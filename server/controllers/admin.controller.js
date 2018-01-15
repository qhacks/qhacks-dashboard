const _ = require('lodash');
const { Settings, User } = require('../models');
const { ERROR_TEMPLATES, createError } = require('../errors');
const { ERROR, USER } = require('../strings');

const DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS = { new: true };
const REVIEW_FIELDS = [
    'score',
    'group',
    'performedBy',
    'performedAt',
    'goldenTicket'
];

module.exports = {
    async getApplicationToReview(reviewGroup) {
        let user;
        try {
            user = await User.findOne({
                $and: [
                    { role: 'HACKER' },
                    {
                        $or: [
                            { reviews: { $exists: false } },
                            { reviews: { $size: 0 } },
                            { 'reviews.group': { $ne: reviewGroup } }
                        ]
                    },
                    {
                        $or: [
                            { 'reviews.goldenTicket': false },
                            { 'reviews.goldenTicket': { $exists: false } }
                        ]
                    }
                ]
            });
        } catch (err) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR.DB_APPLICATION_TO_REVIEW_GET, err);
        }

        if (_.isEmpty(user)) {
            throw createError(ERROR_TEMPLATES.NOT_FOUND, ERROR.NO_APPLICATION_TO_REVIEW_EXISTS);
        }

        return user;
    },

    async getApplicationsWithReviews() {
        let applications;
        try {
            applications = await User.find({ reviews: { $exists: true, $not: { $size: 0 } } });
        } catch (err) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR.DB_APPLICATIONS_WITH_REVIEWS_GET, err);
        }

        if (_.isEmpty(applications)) {
            throw createError(ERROR_TEMPLATES.NOT_FOUND, ERROR.NO_APPLICATIONS_WITH_REVIEWS_EXIST);
        }

        return applications;
    },

    async getReviewers() {
        let reviewers;

        try {
            reviewers = await User.find({ role: USER.ROLES.ADMIN, reviewGroup: { $exists: true } });
        } catch (err) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR.DB_REVIEWERS_GET, err);
        }

        if (_.isEmpty(reviewers)) {
            throw createError(ERROR_TEMPLATES.NOT_FOUND, ERROR.NO_REVIEWERS_EXIST);
        }

        return reviewers;
    },

    async getSettings() {
        let settings;

        try {
            settings = await Settings.findOne({});
        } catch (err) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR.DB_USER_GET, err);
        }

        if (_.isEmpty(settings)) {
            throw createError(ERROR_TEMPLATES.NOT_FOUND, ERROR.NO_SETTINGS_EXIST);
        }

        return settings;
    },

    async reassignReviewers() {
        let admins = [];

        try {
            admins = await User.find({ role: USER.ROLES.ADMIN });
        } catch (err) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR.DB_REVIEWERS_GET, err);
        }

        if (_.isEmpty(admins)) {
            throw createError(ERROR_TEMPLATES.NOT_FOUND, ERROR.NO_ADMINS_EXIST);
        }

        const { numberOfReviewsRequired } = await this.getSettings();

        const promises = admins.map((admin, index) => (
            User.findOneAndUpdate(
                { _id: admin._id },
                { $set: { reviewGroup: index % numberOfReviewsRequired } },
                DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS
            )
        ));

        return await Promise.all(promises);
    },

    async submitApplicationReview(userId, review) {
        let updatedUser;
        let hasGoldenTicket;
        let reviewer;

        const reviewToSubmit = _.pick(review, REVIEW_FIELDS);
        const reviewerId = reviewToSubmit.performedBy;

        if (reviewToSubmit.goldenTicket) {
            try {
                reviewer = await User.findOne({ _id: reviewerId });
            } catch (err) {
                throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR_MESSAGES.DB_USER, err);
            }

            const { goldenTickets = 0 } = reviewer;

            if (goldenTickets <= 0) {
                throw createError(ERROR_TEMPLATES.BAD_REQUEST, ERROR_MESSAGES.NO_GOLDEN_TICKETS);
            }

            try {
                hasGoldenTicket = !!(await User.findOne({ _id: userId, 'reviews.goldenTicket': true }));
            } catch (err) {
                throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR_MESSAGES.DB_REVIEW_CREATE, err);
            }

            if (hasGoldenTicket) {
                throw createError(ERROR_TEMPLATES.BAD_REQUEST, ERROR_MESSAGES.ALREADY_HAS_GOLDEN_TICKET);
            }

            try {
                const numberOfGoldenTicketsRemaining = goldenTickets - 1 > 0
                    ? goldenTickets - 1
                    : 0;
                await User.findOneAndUpdate(
                    { _id: reviewerId },
                    { $set: { goldenTickets: numberOfGoldenTicketsRemaining } }
                );
            } catch (err) {
                throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR_MESSAGES.DB_GOLDEN_TICKETS_REDUCE, err);
            }
        }

        try {
            updatedUser = await User.findOneAndUpdate(
                { _id: userId },  // TODO: add { 'reviews.group': { $ne: reviewToSubmit.group } } to avoid duplicate
                                  // applications for a user
                { $push: { reviews: reviewToSubmit } },
                DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS
            );
        } catch (err) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR_MESSAGES.DB_REVIEW_CREATE, err);
        }

        return updatedUser;
    },

    async updateApplicationStatus(userId, eventId, status) {
        if (!userId) {
            throw createError(ERROR_TEMPLATES.BAD_REQUEST, ERROR.INVALID_USER_ID);
        }

        if (!eventId) {
            throw createError(ERROR_TEMPLATES.BAD_REQUEST, ERROR.INVALID_EVENT_ID);
        }

        if (!status || !USER.APPLICATION.STATUSES[status]) {
            throw createError(ERROR_TEMPLATES.BAD_REQUEST, ERROR.INVALID_APPLICATION_STATUS);
        }

        let updatedUser;
        try {
            updatedUser = await User.findOneAndUpdate(
                { _id: userId, 'applications.event': eventId },
                { $set: { 'applications.$.status': USER.APPLICATION.STATUSES[status] } },
                DEFAULT_FIND_ONE_AND_UPDATE_OPTIONS
            );
        } catch (e) {
            throw createError(ERROR_TEMPLATES.DB_ERROR, ERROR.DB_UPDATE_APPLICATION_STATUS, e);
        }

        return updatedUser;
    }
};
