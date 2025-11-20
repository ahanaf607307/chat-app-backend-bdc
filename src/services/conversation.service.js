const { default: mongoose } = require("mongoose");
const { Conversation } = require("../models");

const createConversationService = async (userA, userB) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [userA, userB] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userA, userB],
    });
  }

  return conversation;
};

// it just gives the list of conversation

//  const getUserConversationsService = async (userId) => {
//   return Conversation.find({
//     participants: userId
//   }).populate("participants" , "-password   ").sort({ createdAt: -1 });
// };

//  it will give you the latest chat or conversation ->

const getUserConversationsService = async (userId) => {
  return Conversation.aggregate([
    // Match conversations where the user is a participant
    { $match: { participants: new mongoose.Types.ObjectId(userId) } },
    // Lookup latest message
    {
      $lookup: {
        from: "messages",
        let: { convoId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$conversationId", "$$convoId"] } } },
          { $sort: { createdAt: -1 } },
        ],
        as: "latestMessage",
      },
    },
    // Populate participants
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $project: {
        "participants.fullName": 1,
        "participants.email": 1,
        latestMessage: 1,
        createdAt: 1,
      },
    },
    // Flatten latestMessage array
    { $unwind: { path: "$latestMessage", preserveNullAndEmptyArrays: true } },
    // Sort by latestMessage.createdAt (descending)
    { $sort: { "latestMessage.createdAt": -1 } },
  ]);
};

const getConversationByIdService = async (conversationId) => {
  return Conversation.findById(conversationId).populate(
    "participants",
    "username displayName avatarUrl"
  );
};

module.exports = {
  createConversationService,
  getUserConversationsService,
  getConversationByIdService,
};
