import express from "express";
import secureRoute from "../middleware/secureRoute.js";
import upload from "../middleware/upload.js";
import {
  sendMessage,
  getMessages,
  deleteMyMessages,
} from "../controller/message.controller.js";

const router = express.Router();

// ✅ Send message (text/image)
router.post("/send/:id", secureRoute, upload.single("image"), sendMessage);

// ✅ Get messages with user
router.get("/:id", secureRoute, getMessages);


router.delete("/delete/:userId", secureRoute, deleteMyMessages);


export default router;
