const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: null,
    },
    userName : {  type: String,
      unique: true,
      lowercase: true,},

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },

    phone: { type: String, default: null },
    dob: { type: Date, default: null },
    location: { type: String, default: null },

    verificationCode: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isEmployeeVerified: { type: Boolean, default: false },

    referalCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referedIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],

    oneTimeCode: { type: String, default: null },
    isResetPassword: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    nidNumber: { type: String, default: null },
    image: { type: String, default: "/uploads/users/user.png" },

    role: {
      type: String,
      enum: ["admin", "common", "user"],
      default: "user",
    },

    subscription: {
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
      subscriptionExpirationDate: { type: Date, default: null },
      status: {
        type: String,
        enum: [
          "active",
          "past_due",
          "canceled",
          "unpaid",
          "incomplete",
          "incomplete_expired",
          "trialing",
          "paused",
        ],
        default: "trialing",
      },
      isSubscriptionTaken: { type: Boolean, default: false },
    },

    securitySettings: {
      recoveryEmail: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        default: null,
      },
      recoveryPhone: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"],
        default: null,
      },
      securityQuestion: { type: String, trim: true, default: null },
      securityAnswer: {
        type: String,
        required: function () {
          return !!this.securityQuestion;
        },
        set: (answer) =>
          answer
            ? crypto.createHash("sha256").update(answer).digest("hex")
            : null,
        select: false,
        default: null,
      },
    },
  },
  { timestamps: true }
);


// // ➤ Automatically create username like "@ahanafmubasshir"
// userSchema.pre("save", function (next) {
//   if (!this.isModified("fullName") && this.userName) return next();

//   if (this.fullName) {
//     const cleaned = this.fullName
//       .toLowerCase()
//       .replace(/[^a-zA-Z ]/g, "")        // remove special chars
//       .trim()
//       .split(" ")
//       .join("");                         // join first + last name

//     this.userName = `@${cleaned}`;
//   }

//   next();
// });



// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.statics.isPhoneNumberTaken = async function (
  phoneNumber,
  excludeUserId
) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
