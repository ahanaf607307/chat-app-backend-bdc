const Joi = require("joi");
const { password } = require("./custom.validation");

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

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().allow(null, ''),
    email: Joi.string().email().required(),

    password: Joi.string()
  .pattern(passwordRegex)
  .message('Password must contain at least one letter, one number, and be 8+ characters')
  .required(),

    phone: Joi.string().allow(null, ''),
    dob: Joi.date().allow(null),
    location: Joi.string().allow(null, ''),
    verificationCode: Joi.string().allow(null, ''),
    isEmailVerified: Joi.boolean().default(false),
    oneTimeCode: Joi.string().allow(null, ''),
    isResetPassword: Joi.boolean().default(false),
    isDeleted: Joi.boolean().default(false),
    referBy: Joi.string().allow(null, ''),
    nidNumber: Joi.string().allow(null, ''),
    image: Joi.string().uri().allow(null, ''),
    interest: Joi.array().items(Joi.string()).default([]),
    accountNumber: Joi.string().allow(null, ''),
    totalBalance: Joi.number().default(0),
    withdrawalHistory: Joi.array().items(Joi.object()).default([]),
    inviteLink: Joi.string().uri().allow(null, ''),
    role: Joi.string().valid("user",  "admin", "common" ).default("user").allow(null , ""),

    subscription: Joi.object({
      subscriptionId: Joi.string().allow(null),
      subscriptionExpirationDate: Joi.date().allow(null),
      status: Joi.string().valid(...subscriptionStatusEnum).default("trialing"),
      isSubscriptionTaken: Joi.boolean(),
    }).allow(null),

    securitySettings: Joi.object({
      recoveryEmail: Joi.string().email().allow(null, ''),
      recoveryPhone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message('Invalid phone number format')
        .allow(null, ''),
      securityQuestion: Joi.string().allow(null, ''),
      securityAnswer: Joi.string().allow(null, ''),
    }).allow(null),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    fcmToken: Joi.string(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    code: Joi.string().required(),
  }),
};

const deleteMe = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const sendOTP = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
}
const verifyOTP = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    otpCode: Joi.string().required(),
  }),
}
module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteMe,
  changePassword
};
