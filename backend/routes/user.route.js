import express from "express";
import {
  getAllUsers,
  login,
  logout,
  signup,
  updateProfileImage,
  updateProfileDetails,
} from "../controller/user.controller.js";
import secureRoute from "../middleware/secureRoute.js";
import upload from "../middleware/upload.js"; // ✅ Already has cloudinary setup

const router = express.Router();

// ✅ Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile",secureRoute, updateProfileDetails);
router.post("/upload-profile", secureRoute, upload.single("profile"), updateProfileImage);
router.get("/allusers", secureRoute, getAllUsers);

export default router;
