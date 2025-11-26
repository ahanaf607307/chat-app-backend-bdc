const logger = require("../config/logger");
const { Conversation, Message } = require("../models");
const { conversationService, userService } = require("../services");


const socketIO = (io) => {
  io.on("connection", async (socket) => {
    console.log(`ID: ${socket.id} just connected`);

    const token = socket.handshake.headers.authorization;

    if (!token) {
      logger.error("No token provided in socket connection");
      socket.disconnect();
      return;
    }

    const mainToken =
      token && token.startsWith("Bearer ") ? token?.split(" ")[1] : token;

    const user = await userService.getUserFromToken(mainToken);

    socket.join(user?._id?.toString());

    socket.on("conversation-page", async (data) => {

      const conversations = await conversationService.getUserConversations(data?.carUserId);

      socket.emit("conversations", conversations);
    });

    socket.on("message-page" , async(data) => {
      console.log('message-page-data ->', data)
      const receiverId = data.receiverId
      const receiverData = await userService.getUserById(receiverId)
      if(!receiverData) {
        socket.emit("error" , {message : "Receiver not found"})
      }

      const getConversationMessage = await Conversation.findOne({
        $or : [
          {sender : user._id , receiver : receiverId},
          {sender : receiverId , receiver : user._id}
        ]
      }).populate('messages').sort({createdAt : -1})

      socket.emit("messages" , getConversationMessage?.messages || [])
    } )


    socket.on("new-message", async (data) => {

      console.log(data)

      if(!data?.sender || !data?.receiver) {
        return socket.emit("error", { message: "Sender and Receiver IDs are required" });
      }

      let concersation = await Conversation.findOne({
        $or: [
          {sender: data?.sender, receiver: data?.receiver},
          {sender: data?.receiver, receiver: data?.sender}
        ],
      });

      if(!concersation) {
        const crateConversation = await Conversation.create({
          sender: data?.sender,
          receiver: data?.receiver,
        });

        concersation = crateConversation;
      }


      const message = new Message({
        conversation: concersation._id,
        content: data?.content,
        type: data?.type || "text",
        msgByUserId: data?.sender,
      });

      const newMessage = await message.save();

      await Conversation.findByIdAndUpdate(concersation._id, {
        $push: { messages: newMessage._id },
        lastMessage: newMessage._id,
      }, { new: true });

      const getConversationMessage = await Conversation.findById(concersation._id)
        .populate("messages")
        .sort({ createdAt: -1 });


        io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
        io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);

        const conversationSender = await conversationService.getUserConversations(data?.sender);
        const conversationReceiver = await conversationService.getUserConversations(data?.receiver);

        io.to(data?.sender).emit("conversations", conversationSender || []);
        io.to(data?.receiver).emit("conversations", conversationReceiver || []);
    });


    socket.on("join-room", (data, callback) => {
      //console.log('someone wants to join--->', data);
      if (data?.roomId) {
        socket.join("room" + data.roomId);
        callback("Join room successful");
      } else {
        callback("Must provide a valid user id");
      }
    });

    socket.on("leave-room", (data) => {
      if (data?.roomId) {
        socket.leave("room" + data.roomId);
      }
    });

    socket.on("disconnect", () => {
      console.log(`ID: ${socket.id} disconnected`);
    });
  });
};

module.exports = socketIO;
