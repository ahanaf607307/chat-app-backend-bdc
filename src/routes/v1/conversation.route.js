const express = require("express");
const auth = require("../../middlewares/auth");
const { conversationController } = require("../../controllers");



const conversationRouter = express.Router();

conversationRouter.route("/create").post(auth("common"), conversationController.createOrGetConversation);  
conversationRouter.route("/").get(auth("common"), conversationController.getMyConversations);  

module.exports = conversationRouter;
