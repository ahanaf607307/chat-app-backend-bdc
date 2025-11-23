const express = require("express");
const auth = require("../../middlewares/auth");
const {  messageController } = require("../../controllers");



const messageRouter = express.Router();

messageRouter.post("/send/:conversationId",auth("common"), messageController.createMessage);
messageRouter.get("/:conversationId",auth("common"), messageController.getMessages);
messageRouter.put("/seen/:conversationId",auth("common"), messageController.markSeen);
messageRouter.delete("/:messageId",auth("common"), messageController.deleteMessage);  


module.exports = messageRouter;
