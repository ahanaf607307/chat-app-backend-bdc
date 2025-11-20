const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");


const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    // Optional: files, images, etc
    attachments: [
      {
        url: String,
        fileType: String,
      },
    ],
  },
  { timestamps: true }
);

messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
