const { Conversation } = require("../models");



 const createConversationService = async (userA, userB) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [userA, userB] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userA, userB]
    });
  }

  return conversation;
};

 const getUserConversationsService = async (userId) => {
  return Conversation.find({
    participants: userId
  }).populate("participants" , "-password   ");
};

 const getConversationByIdService = async (conversationId) => {
  return Conversation.findById(conversationId)
    .populate("participants", "username displayName avatarUrl");
};



module.exports = {
  createConversationService,
  getUserConversationsService,
  getConversationByIdService
};
