const ERROR = {
  DB_ADMINS_GET: 'Could not retrieve admins from the database!',
  DB_APPLICATION_TO_REVIEW_GET:
    'Could not retrieve an application to review from the database!',
  DB_APPLICATIONS_WITH_REVIEWS_GET:
    'Could not retrieve any applications with reviews from the database!',
  DB_CHECK_IN: 'Could not check in the supplied user to the supplied event',
  DB_GOLDEN_TICKETS_REDUCE:
    'Could not reduce the amount of golden tickets for the reviewer!',
  DB_REVIEW_CREATE: 'Could not add a review to the specified application',
  DB_REVIEWS_GET: 'Could not get a review from the specified application',
  DB_REVIEWERS_GET: 'Could not retrieve reviewers from the database!',
  DB_RSVP: 'Could not add RSVP information to the specified application',
  DB_SETTINGS_GET: 'Could not retrieve settings from the database!',
  DB_UPDATE_APPLICATION_STATUS:
    'Could not update the application status of the supplied user for the specified event!',
  DB_USER_CREATE: 'Error creating User in the database!',
  DB_USER_GET: 'Could not retrieve that user from the database!',
  DB_USER_UPDATE: 'Could not update the specified user in the database!',
  DB_USERS_GET: 'Error retrieving users from the database!',

  NO_ADMINS_EXIST: 'No admins exist in the database!',
  NO_APPLICATION_TO_REVIEW_EXISTS:
    'No application to review exists in the database!',
  NO_APPLICATIONS_WITH_REVIEWS_EXIST:
    'No applications with reviews exist in the database!',
  NO_GOLDEN_TICKETS: 'No golden tickets are left for this reviewer!',
  NO_REVIEWERS_EXIST: 'No reviewers exist in the database!',
  NO_SETTINGS_EXIST: 'No settings exist in the database!',
  EMAIL_TEMPLATE_DOES_NOT_EXIST: 'The email template specified does not exist',
  NO_EMAIL_RECIPIENT_SPECIFIED: 'No email recipient was specified',
  NO_HACKERS_REQUIRING_CHECK_IN_EXIST:
    'No hackers requiring check in for the specified event exist in the database!',

  MISSING_USER_ID: 'Missing user ID!',
  MISSING_EVENT_ID: 'Missing event ID!',
  MISSING_CHECK_IN_STATUS: 'Missing check-in status!',
  MISSING_TOKEN: 'Missing auth token!',
  INVALID_TOKEN: 'Invalid token!',

  INVALID_APPLICATION_STATUS: 'Invalid application status supplied!',
  INVALID_CREDENTIALS: 'You have provided invalid credentials!',
  INVALID_EVENT_ID: 'An event with this identifier not exist!',
  INVALID_REFRESH_TOKEN: 'The refresh token provided is invalid!',
  INVALID_RESET_HASH: 'A user with this reset hash does not exist!',
  INVALID_RSVP: 'Invalid RSVP information supplied!',
  INVALID_USER_ID: 'A user with this identifier does not exist!',
  INVALID_USER_EMAIL: 'A user with this email does not exist!',
  INVALID_DATE:
    'The date provided is invalid! Be sure to follow ISO or RFC2822 date format.',
  INVALID_EMAIL: 'The email address provided is invalid!',
  INVALID_GRAD_YEAR: 'The graduation year provided is invalid!',
  INVALID_PASSWORD:
    'The password provided is invalid, it must be more than eight characters.',
  INVALID_NAME: 'The first and last name combination provided is invalid.',
  INVALID_PHONE_NUMBER: 'The phone number provided is invalid.',

  ALREADY_HAS_GOLDEN_TICKET: 'This application already has a golden ticket!',
  RESET_HASH_CREATE_FAIL: 'Error when creating the reset hash!',

  APPLICATION_ACCEPTED_EMAIL_FAILED_TO_SEND:
    'The application accepted email did not send correctly!',
  APPLICATION_ACCEPTED_FROM_WAITLIST_EMAIL_FAILED_TO_SEND:
    'The application accepted from waitlist email did not send correctly!',
  APPLICATION_ACCEPTED_REMINDER_EMAIL_FAILED_TO_SEND:
    'The application accepted reminder email did not send correctly!',
  APPLICATION_ACCEPTED_REMINDER_AFTER_WAITLIST_ACCEPTED_EMAIL_FAILED_TO_SEND:
    'The application accepted reminder after waitlist accepted email did not send correctly!',
  APPLICATION_DECLINED_EMAIL_FAILED_TO_SEND:
    'The application declined email did not send correctly!',
  APPLICATION_SUCCESSFUL_EMAIL_FAILED_TO_SEND:
    'The application successful email did not send correctly!',
  APPLICATION_WAITLISTED_EMAIL_FAILED_TO_SEND:
    'The application waitlisted email did not send correctly!',
  RESET_PASSWORD_EMAIL_FAILED_TO_SEND:
    'The reset password email did not send correctly!',
  SUCCESSFUL_PASSWORD_RESET_EMAIL_FAILED_TO_SEND:
    'The successful reset password email did not send correctly!'
};

module.exports = ERROR;
