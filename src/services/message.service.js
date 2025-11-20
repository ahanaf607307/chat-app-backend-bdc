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
    .populate("sender", "fullName email")
    .sort({ createdAt: 1 });
};



module.exports = {
 sendMessageService,
 getMessagesByConversationService
};
