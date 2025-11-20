const express = require("express");
const auth = require("../../middlewares/auth");
const {  messageController } = require("../../controllers");



const messageRouter = express.Router();

messageRouter.route("/send").post(auth("common"), messageController.sendMessage);  
messageRouter.route("/:id").get(auth("common"), messageController.getMessages);  


module.exports = messageRouter;
