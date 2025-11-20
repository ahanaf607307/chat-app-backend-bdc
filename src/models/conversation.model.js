const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ]
  },
  { timestamps: true }
);

// Prevent duplicates: same two users cannot have two conversations
conversationSchema.index(
  { participants: 1 },
  { unique: true, partialFilterExpression: { participants: { $size: 2 } } }
);

conversationSchema.plugin(toJSON);
conversationSchema.plugin(paginate);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
