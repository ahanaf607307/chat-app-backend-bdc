const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const subscriptionSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    days: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    feature: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
