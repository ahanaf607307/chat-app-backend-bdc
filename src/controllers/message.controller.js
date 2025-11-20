const httpStatus = require("http-status");
const response = require("../config/response");
const { messageService } = require("../services");


 const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.user.id;

    const msg = await messageService.sendMessageService(conversationId, sender, text);
       res.status(httpStatus.OK).json(
      response({
        message: "Message sending successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data : msg
      })
    );
  } catch (err) {
      res.status(httpStatus.BAD_REQUEST).json(
      response({
        message: "Message sending failed",
        status: "BAD_REQUEST",
        statusCode: httpStatus.BAD_REQUEST,
        data : {}
      })
    );
  }
};

 const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const messages = await messageService.getMessagesByConversationService(conversationId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
 sendMessage,
 getMessages
};
