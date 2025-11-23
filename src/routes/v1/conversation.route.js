const express = require("express");
const auth = require("../../middlewares/auth");
const { conversationController } = require("../../controllers");



const conversationRouter = express.Router();

// Conversation
conversationRouter.post("/create",auth("common"), conversationController.createConversation);
conversationRouter.get("/",auth("common"), conversationController.getUserConversations);
conversationRouter.get("/detail/:conversationId",auth("common"), conversationController.getConversationById); 

module.exports = conversationRouter;
