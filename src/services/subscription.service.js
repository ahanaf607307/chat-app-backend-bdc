const httpStatus = require("http-status");
const { Subscription } = require("../models");
const ApiError = require("../utils/ApiError");
const { getUserById } = require("./user.service");

const createSubscription = async (subBody) => {
  return Subscription.create({ ...subBody });
};

const querySubscriptions = async (filter = {}, options = {}) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (
      (key === "name" || key === "status") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" }; // case-insensitive match
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  return Subscription.paginate(query, options);
};

const getSubscriptionById = async (id) => {
  const subscription = await Subscription.findById(id);
  if (!subscription || subscription.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }
  return subscription;
};

const updateSubscriptionById = async (id, updateBody) => {
  const subscription = await getSubscriptionById(id);

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  Object.assign(subscription, updateBody);
  await subscription.save();
  return subscription;
};

const deleteSubscriptionById = async (id) => {
  const subscription = await getSubscriptionById(id);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  // Soft delete
  subscription.isDeleted = true;
  await subscription.save();
  return subscription;
};

const takeSubscriptin = async (userId, subId) => {

  const sub = await getSubscriptionById(subId);
  const user = await getUserById(userId);

  switch (sub.name) {
    case "basic":
      user.friendReqCredit = 20,
      user.interestReqCredit = 15,
      user.subscription = {
        subscriptionId: sub._id,
        subscriptionExpirationDate: new Date() + sub.days,
        status: "active",
        isSubscriptionTaken: true
      }

      await user.save();
      break;
    case "silver":
      user.friendReqCredit = 50,
        user.interestReqCredit = 30,
        user.subscription = {
          subscriptionId: sub._id,
          subscriptionExpirationDate: new Date() + sub.days,
          status: "active",
          isSubscriptionTaken: true
        }

      await user.save();
    case "gold":
      user.friendReqCredit = 100,
        user.interestReqCredit = 90,
        user.subscription = {
          subscriptionId: sub._id,
          subscriptionExpirationDate: new Date() + sub.days,
          status: "active",
          isSubscriptionTaken: true
        }

      await user.save();
      break
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, "The name is invalid")
      break;
  }

  
  return user;
};


module.exports = {
  createSubscription,
  querySubscriptions,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,

  takeSubscriptin,
};
