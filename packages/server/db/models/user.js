const bcrypt = require("bcrypt");

const {
  REST_ERROR_CODES,
  NotFoundError,
  OAuthInvalidCredentialsError
} = require("../../errors/rest-errors");

const PHONE_NUMBER_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          isUUID: 4
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        set(val) {
          this.setDataValue(
            "firstName",
            val.charAt(0).toUpperCase() + val.slice(1)
          );
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        set(val) {
          this.setDataValue(
            "lastName",
            val.charAt(0).toUpperCase() + val.slice(1)
          );
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          isLowercase: true,
          set(val) {
            this.setDataValue("email", val.toLowerCase());
          }
        }
      },
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          is: PHONE_NUMBER_REGEX
        }
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        validate: {
          isDate: true
        }
      },
      schoolName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      resumeUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 128]
        }
      },
      resetPasswordHash: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      resetPasswordHashExpiryDate: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: true
        }
      },
      githubLink: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      linkedinLink: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      personalWebsiteLink: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      }
    },
    {
      getterMethods: {
        fullName() {
          return `${this.firstName} ${this.lastName}`;
        }
      },
      setterMethods: {
        fullName(value) {
          const names = value.split(" ");
          this.setDataValue("firstName", names.slice(0, -1).join(" "));
          this.setDataValue("lastName", names.slice(-1).join(" "));
        }
      },
      indexes: [
        {
          unique: true,
          fields: ["email"]
        }
      ]
    }
  );

  User.prototype.validPassword = function(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err, valid) => {
        if (err || !valid) return reject();
        return resolve();
      });
    });
  };

  User.prototype.hashPassword = function() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return reject(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) return reject(err);

          this.password = hash;

          return resolve();
        });
      });
    });
  };

  User.addHook("beforeCreate", (user) => user.hashPassword());

  User.addHook("beforeBulkCreate", (users) =>
    Promise.all(users.map((user) => user.hashPassword()))
  );

  User.addHook("beforeUpdate", async (user, _) => {
    if (user.changed("password")) {
      return user.hashPassword();
    }
  });

  User.authenticate = function(email, password) {
    return new Promise((resolve, reject) => {
      this.findOne({ where: { email } }).then((user) => {
        if (!user) {
          return reject(
            new NotFoundError(
              "Could not find a user with that email!",
              REST_ERROR_CODES.USER_NOT_FOUND
            )
          );
        }

        user
          .validPassword(password)
          .then(() => resolve(user))
          .catch(() => reject(new OAuthInvalidCredentialsError()));
      });
    });
  };

  User.associate = ({
    Event,
    EventCheckIn,
    MailingListSubscription,
    Activity,
    ActivityCheckIn,
    Application,
    ApplicationReview,
    Project,
    UserProject,
    OAuthUser
  }) => {
    User.belongsTo(OAuthUser, {
      foreignKey: {
        name: "oauthUserId",
        allowNull: false
      }
    });

    User.hasMany(Application, {
      foreignKey: { name: "userId", allowNull: false }
    });

    User.belongsToMany(Event, {
      through: EventCheckIn,
      foreignKey: "userId",
      otherKey: "eventId"
    });

    User.hasMany(MailingListSubscription, {
      foreignKey: "userId"
    });

    User.belongsToMany(Application, {
      through: ApplicationReview,
      foreignKey: "reviewerId",
      otherKey: "applicationId"
    });

    User.belongsToMany(Activity, {
      through: ActivityCheckIn,
      foreignKey: "userId",
      otherKey: "activityId"
    });

    User.belongsToMany(Project, {
      through: UserProject,
      foreignKey: "userId",
      otherKey: "projectId"
    });
  };

  return User;
};
