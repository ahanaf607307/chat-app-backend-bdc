const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Message",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);



conversationSchema.plugin(toJSON);
conversationSchema.plugin(paginate);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
