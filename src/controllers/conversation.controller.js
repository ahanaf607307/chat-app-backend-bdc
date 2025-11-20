const httpStatus = require("http-status");
const conversationService = require("../services/conversation.service");
const response = require("../config/response");

const createOrGetConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user.id; // from auth middleware

    if (myId === userId) {
      return res.status(400).json({ error: "You cannot message yourself" });
    }

    const createConv = await conversationService.createConversationService(
      myId,
      userId
    );
    res.status(httpStatus.OK).json(
      response({
        message: "Conversation creating successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: createConv,
      })
    );
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "Conversation creating failed",
        status: "BAD_REQUEST",
        statusCode: httpStatus.BAD_REQUEST,
        data : {}
      })
    );
  }
};

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await conversationService.getUserConversationsService(
      userId
    );
    res.status(httpStatus.OK).json(
      response({
        message: "Conversation getting successfully ",
        status: "OK",
        statusCode: httpStatus.OK,
        data: conversations,
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getConversationById = async (req, res) => {
  try {
    const isConv = await conversationService.getConversationByIdService(
      req.params.id
    );
    if (!isConv)
      return res.status(404).json({ error: "Conversation not found" });
    res.status(httpStatus.OK).json(
      response({
        message: "Conversation getting successfully by id",
        status: "OK",
        statusCode: httpStatus.OK,
        data: isConv,
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrGetConversation,
  getMyConversations,
  getConversationById,
};
