const { messageService } = require("../services");


 const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const sender = req.user.id;

    const msg = await messageService.sendMessageService(conversationId, sender, text);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
