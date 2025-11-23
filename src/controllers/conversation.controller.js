const httpStatus = require("http-status");
const { conversationService } = require("../services");

/**
 * Create or return a one-to-one conversation
 */
const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const conversation = await conversationService.createOrGetConversation(
      senderId,
      receiverId
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Conversation fetched/created successfully",
      data: conversation,
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all conversations of a user
 */
const getUserConversations = async (req, res) => {
  try {
     const userId = req.user.id
    console.log(userId)

    const conversations = await conversationService.getUserConversations(userId);

    return res.status(httpStatus.OK).json({
      success: true,
      data: conversations,
      message : "all conversation getting successfully"
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

/**
 * Get specific conversation (with messages)
 */
const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await conversationService.getConversationById(
      conversationId
    );

    if (!conversation) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(httpStatus.OK).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationById,
};
