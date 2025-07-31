import { getReceiverSocketId } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notificationModel.js";

// ✅ Send message (text or image)
export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;

    if (!message && !req.file) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    const imageUrl = req.file ? req.file.path : null;

    // ✅ Create message
    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message: message || "",
      image: imageUrl,
      status: "sent",
    });

    await newMessage.populate("senderId", "fullname");

    // ✅ Create/update conversation
    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [req.user._id, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // ✅ Final message object to send
    const responseMessage = {
      _id: newMessage._id,
      senderId: newMessage.senderId._id,
      senderFullname: newMessage.senderId.fullname,
      receiverId,
      message: newMessage.message,
      image: newMessage.image,
      createdAt: newMessage.createdAt,
      status: newMessage.status,
      conversationId: conversation._id, // ✅ important!
    };

    // ✅ Emit if receiver online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // 👇 emit to specific user room
      req.io.to(receiverSocketId).emit("newMessage", responseMessage);
    } else {
      // ✅ Save notification if offline
      await Notification.create({
        userId: receiverId,
        senderId: req.user._id,
        message: message || "📷 Image",
        conversationId: conversation._id,
        read: false,
      });
    }

    res.status(201).json(responseMessage);
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({ error: "Message not sent" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userId } = req.params; // conversation with this user
    const myId = req.user._id; // logged-in user

    // ✅ Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      members: { $all: [myId, userId] },
    });

    if (!conversation) {
      return res.status(403).json({ error: "Access denied" });
    }

    // ✅ Fetch messages that are not deleted by current user
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
      deletedBy: { $ne: myId }, // this hides messages deleted by current user
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error in getMessages:", err);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const deleteMyMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.params;

    await Message.updateMany(
      {
        $or: [
          { senderId: myId, receiverId: userId },
          { senderId: userId, receiverId: myId },
        ],
      },
      { $addToSet: { deletedBy: myId } }
    );

    res.status(200).json({ message: "Messages deleted for you only" });
  } catch (err) {
    console.error("❌ Error in deleteMyMessages:", err);
    res.status(500).json({ message: "Server error" });
  }
};