const { Conversation } = require("../models");


/**
 * Create or return existing one-to-one conversation
 */
const createOrGetConversation = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId.toString()) {
    throw new Error("Cannot create a conversation with yourself");
  }

  // Look for existing conversation (both possible orders)
  let conversation = await Conversation.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });

  if (conversation) return conversation;

  // Create new conversation
  conversation = await Conversation.create({
    sender: senderId,
    receiver: receiverId,
  });

  return conversation;
};

/**
 * Get all conversations for a user
 */
const getUserConversations = async (userId) => {
  return Conversation.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender receiver lastMessage" , "fullName email userName")
    .sort({ updatedAt: -1 });
};

/**
 * Push message ID + update last message
 */
const updateConversationWithMessage = async (conversationId, messageId) => {
  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      $set: { lastMessage: messageId },
      $push: { messages: messageId },
    },
    { new: true }
  );
};

/**
 * Get a conversation with populated messages
 */
const getConversationById = async (conversationId) => {
  return Conversation.findById(conversationId)
    .populate("sender receiver")
    .populate({
      path: "messages",
      populate: {
        path: "msgByUserId",
        model: "User",
      },
    });
};

module.exports = {
  createOrGetConversation,
  getUserConversations,
  updateConversationWithMessage,
  getConversationById,
};
