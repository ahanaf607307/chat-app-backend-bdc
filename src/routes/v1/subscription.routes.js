const express = require("express");
const auth = require("../../middlewares/auth");
const { subscriptionController } = require("../../controllers");

const router = express.Router();

router
  .route("/create")
  .post(auth("admin"), subscriptionController.createSubscription);

router
  .route("/")
  .get(subscriptionController.getSubscriptions);

router
  .route("/:subscriptionId")
  .get(subscriptionController.getSubscription)
  .patch(auth("admin"), subscriptionController.updateSubscription)
  .delete(auth("admin"), subscriptionController.deleteSubscription);


router
  .route("/take")
  .post(auth("common"), subscriptionController.takeSubscriptin);

module.exports = router;
