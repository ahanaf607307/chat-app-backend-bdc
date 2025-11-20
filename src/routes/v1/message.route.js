const express = require("express");
const auth = require("../../middlewares/auth");
const { conversationController, messageController } = require("../../controllers");



const messageRouter = express.Router();

messageRouter.route("/send").post(auth("common"), messageController.sendMessage);  

module.exports = messageRouter;
