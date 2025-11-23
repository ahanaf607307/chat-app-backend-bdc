
const { conversationService } = require('../services');
const { Message } = require("../models");


/**
 * Create a message inside a conversation
 */
const createMessage = async (conversationId, msgByUserId, content, type = "text") => {
  // Create message
  const message = await Message.create({
     conversationId,
    msgByUserId,
    content,
    type,
  });

  // Update conversation (lastMessage + push ID)
  
  await conversationService.updateConversationWithMessage(conversationId, message._id);
  return message;
};

/**
 * Get all messages from a conversation
 */
const getConversationMessages = async (conversationId) => {
  return Message.find({  conversationId })
    .populate("msgByUserId", "fullName email")
    .sort({ createdAt: 1 });
};

/**
 * Mark all messages as seen for a conversation
 */
const markMessagesAsSeen = async (conversationId, userId) => {
  await Message.updateMany(
    {
      conversationId,
      msgByUserId: { $ne: userId },
      seen: false,
    },
    { $set: { seen: true } }
  );
};

/**
 * Soft delete a message
 */
const softDeleteMessage = async (messageId) => {
  return Message.findByIdAndUpdate(
    messageId,
    { isDeleted: true, content: null },
    { new: true }
  );
};

module.exports = {
  createMessage,
  getConversationMessages,
  markMessagesAsSeen,
  softDeleteMessage,
};
