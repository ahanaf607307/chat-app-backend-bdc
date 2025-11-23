const httpStatus = require("http-status");
const { messageService } = require("../services");

/**
 * Create a message in a conversation
 */
const createMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { msgByUserId, content, type } = req.body;

    const message = await messageService.createMessage(
      conversationId,
      msgByUserId,
      content,
      type
    );

    return res.status(httpStatus.CREATED).json({
      success: true,
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get messages of a conversation
 */
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
console.log(conversationId , "conversationId")

    const messages = await messageService.getConversationMessages(
      conversationId
    );

    return res.status(httpStatus.OK).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/**
 * Mark all messages as seen for this user
 */
const markSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    await messageService.markMessagesAsSeen(conversationId, userId);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Messages marked as seen",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to mark messages seen",
    });
  }
};

/**
 * Soft delete a message
 */
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const result = await messageService.softDeleteMessage(messageId);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Message deleted",
      data: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  markSeen,
  deleteMessage,
};
