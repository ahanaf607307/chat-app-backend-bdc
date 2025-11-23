const Joi = require("joi");
const { objectId } = require("./custom.validation");
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const subscriptionStatusEnum = [
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "trialing",
  "paused",
];

const createUser = {
  body: Joi.object().keys({
    fullName: Joi.string().allow(null, ""),
    userName: Joi.string().allow(null, ""),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(passwordRegex)
      .message("Password must contain at least one letter, one number, and be 8+ characters"),
    phone: Joi.string().allow(null, ""),
    dob: Joi.date().allow(null),
    location: Joi.string().allow(null, ""),

    verificationCode: Joi.string().allow(null, ""),
    isEmailVerified: Joi.boolean(),
    isEmployeeVerified: Joi.boolean(),

    referalCode: Joi.string().custom(objectId).allow(null),
    referedIds: Joi.array().items(Joi.string().custom(objectId)).default([]),

    oneTimeCode: Joi.string().allow(null, ""),
    isResetPassword: Joi.boolean(),
    isDeleted: Joi.boolean(),

    nidNumber: Joi.string().allow(null, ""),
    image: Joi.string().allow(null, ""),

    role: Joi.string()
      .valid("admin",   "common", "user")
      .default("user"),

    subscription: Joi.object({
      subscriptionId: Joi.string().custom(objectId).allow(null),
      subscriptionExpirationDate: Joi.date().allow(null),
      status: Joi.string().valid(...subscriptionStatusEnum).default("trialing"),
      isSubscriptionTaken: Joi.boolean(),
    }).allow(null),

    securitySettings: Joi.object({
      recoveryEmail: Joi.string().email().allow(null, ""),
      recoveryPhone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message("Invalid phone number format")
        .allow(null, ""),
      securityQuestion: Joi.string().allow(null, ""),
      securityAnswer: Joi.string().allow(null, ""),
    }).allow(null),
  }),
};

const updateUser = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().allow(null, ""),
      email: Joi.string().email(),
      password: Joi.string()
        .pattern(passwordRegex)
        .message("Password must contain at least one letter, one number, and be 8+ characters"),
      phone: Joi.string().allow(null, ""),
      dob: Joi.date().allow(null),
      location: Joi.string().allow(null, ""),
      verificationCode: Joi.string().allow(null, ""),
      isEmailVerified: Joi.boolean(),
      oneTimeCode: Joi.string().allow(null, ""),
      isResetPassword: Joi.boolean(),
      isDeleted: Joi.boolean(),
      referBy: Joi.string().allow(null, ""),
      nidNumber: Joi.string().allow(null, ""),
      image: Joi.string().uri().allow(null, ""),
      
     
       role: Joi.string().valid("admin", "user", "common" ).default("user"),

      subscription: Joi.object({
        subscriptionId: Joi.string().custom(objectId).allow(null),
        subscriptionExpirationDate: Joi.date().allow(null),
        status: Joi.string().valid(...subscriptionStatusEnum),
        isSubscriptionTaken: Joi.boolean(),
      }),

      securitySettings: Joi.object({
        recoveryEmail: Joi.string().email().allow(null, ""),
        recoveryPhone: Joi.string()
          .pattern(/^\+?[1-9]\d{1,14}$/)
          .message("Invalid phone number format")
          .allow(null, ""),
        securityQuestion: Joi.string().allow(null, ""),
        securityAnswer: Joi.string().allow(null, ""),
      }),
    })
    .min(1),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    email: Joi.string(),
   role: Joi.string().valid("admin", "common", "user", ),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
};
