const { combineResolvers } = require("graphql-resolvers");

const { isAuthenticatedAndAuthorized } = require("../generics");
const { sendEmails } = require("../../../emails")();

const {
  GraphQLNotFoundError,
  GraphQLUserInputError
} = require("../../../errors");

// Query Root Resolvers

const application = combineResolvers(
  isAuthenticatedAndAuthorized(),
  async (parent, args, ctx, info) => {
    const { eventSlug } = args;
    const { db, user } = ctx;

    const application = await db.Application.findOne({
      where: { userId: user.id },
      include: [
        { model: db.Event, where: { slug: eventSlug } },
        { model: db.ApplicationField }
      ]
    });

    if (!application) {
      throw new GraphQLNotFoundError(
        `No application found for the event with the slug: ${eventSlug}!`
      );
    }

    const applicationResponse = {
      status: application.status,
      submissionDate: application.submissionDate,
      responses: application.ApplicationFields.map(
        ({ dataValues, ApplicationFieldResponse }) => ({
          type: dataValues.type,
          label: dataValues.shortLabel,
          answer: ApplicationFieldResponse.answer
        })
      )
    };

    return applicationResponse;
  }
);

// Mutation Root Resolvers

const createApplication = combineResolvers(
  isAuthenticatedAndAuthorized(),
  async (parent, args, ctx, info) => {
    const { eventSlug, input } = args;
    const { user, db } = ctx;

    const newApplication = await db.sequelize.transaction(async (t) => {
      const event = await db.Event.findOne({
        where: { slug: eventSlug },
        include: db.ApplicationField
      });

      if (!event) {
        throw new GraphQLNotFoundError(
          `Could not find an event with the slug: ${eventSlug}!`
        );
      }

      if (!event.requiresApplication) {
        throw new GraphQLUserInputError(
          `${event.name} does not require applications!`
        );
      }

      const currentDate = new Date();

      if (
        currentDate > event.applicationCloseDate ||
        currentDate < event.applicationOpenDate
      ) {
        throw new GraphQLForbiddenError(
          `${event.name} is not accepting applications at this time!`
        );
      }

      const application = await event.createApplication(
        {
          userId: user.id,
          status: "APPLIED"
        },
        { transaction: t }
      );

      if (!application) {
        throw new DatabaseError(
          "Could not create an application at this time!"
        );
      }

      const applicationTable = {};

      event.ApplicationFields.forEach((field) => {
        applicationTable[field.shortLabel] = {
          applicationFieldId: field.id,
          required: field.required
        };
      });

      input.responses.forEach((response) => {
        if (!applicationTable[response.label]) {
          throw new GraphQLUserInputError(
            `${response.label} is not a valid field for ${eventSlug}!`
          );
        }

        applicationTable[label].answer = answer;
        applicationTable[label].applicationId = application.id;
      });

      const userResponse = Object.values(applicationTable).filter(
        (field, i) => {
          if (field.required && !field.answer) {
            throw new GraphQLUserInputError(
              `${Object.keys(applicationTable)[i]} is a required field!`
            );
          }

          return field["answer"];
        }
      );

      const fieldResponse = await db.ApplicationFieldResponse.bulkCreate(
        userResponse,
        { transaction: t }
      );

      if (!fieldResponse) {
        throw new DatabaseError(
          "Could not create an application at this time!"
        );
      }

      await sendEmails("application-success", [
        {
          to: user.email,
          dataForTemplate: {
            firstName: user.firstName,
            email: user.email
          }
        }
      ]);

      return {
        application: {
          status: application.status,
          responses: input.responses,
          submissionDate: application.submissionDate
        }
      };
    });
  }
);

// Resolver Map

module.exports = {
  QueryRoot: {
    application
  },
  MutationRoot: {
    createApplication
  }
};
