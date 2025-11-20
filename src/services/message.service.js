const { Message } = require("../models");

 const sendMessageService = async (conversationId, sender, text) => {
  return Message.create({
    conversationId,
    sender,
    text,
  });
};

 const getMessagesByConversationService = async (conversationId) => {
  return Message.find({ conversationId })
    .populate("sender", "username displayName avatarUrl")
    .sort({ createdAt: 1 }); // chronological
};


module.exports = {
 sendMessageService,
 getMessagesByConversationService
};
