// controllers/notificationController.js
import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const notifs = await Notification.find({ userId, read: false }).populate("senderId", "fullname");
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
