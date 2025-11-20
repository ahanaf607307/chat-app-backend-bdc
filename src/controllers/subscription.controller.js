const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { subscriptionService } = require("../services");

const createSubscription = catchAsync(async (req, res) => {

req.body.createdBy = req.user.id

  const subscription = await subscriptionService.createSubscription(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Subscription created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: subscription,
    })
  );
});

const getSubscriptions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "status"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const result = await subscriptionService.querySubscriptions(filter, options);

  res.status(httpStatus.OK).json(
    response({
      message: "All Subscriptions",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.getSubscriptionById(req.params.subscriptionId);

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "Subscription",
      status: "OK",
      statusCode: httpStatus.OK,
      data: subscription,
    })
  );
});

const updateSubscription = catchAsync(async (req, res) => {
  const subscription = await subscriptionService.updateSubscriptionById(
    req.params.subscriptionId,
    req.body
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Subscription Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: subscription,
    })
  );
});

const deleteSubscription = catchAsync(async (req, res) => {
  await subscriptionService.deleteSubscriptionById(req.params.subscriptionId);

  res.status(httpStatus.OK).json(
    response({
      message: "Subscription Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});


const takeSubscriptin = catchAsync(async (req, res) => {
  const subId = req.query.subscriptionId;
  const sub = await subscriptionService.takeSubscriptin(req.user.id, subId);

  res.status(httpStatus.OK).json(
    response({
      message: "Subscription Taken",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});


module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,

  takeSubscriptin,
};
