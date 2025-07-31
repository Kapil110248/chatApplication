import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "", // 👈 now optional for image-only messages
    },
    image: {
      type: String, // 👈 URL to Cloudinary or local path
      default: "",  // optional
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
   deletedBy: {
  type: [mongoose.Schema.Types.ObjectId],
  default: [],
},
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }, // 👈 ADD THIS
  createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
