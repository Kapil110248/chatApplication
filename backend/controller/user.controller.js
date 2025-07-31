import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
import jwt from "jsonwebtoken"; // ✅ Missing import (add this line!)


export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already registered" });
    }
    // Hashing the password
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      fullname,
      email,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      createTokenAndSaveCookie(newUser._id, res);
      res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid user credential" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid user credential" });

    // ✅ Already logged in check
    if (user.currentToken) {
      return res.status(403).json({ error: "Already logged in on another device" });
    }

    // ✅ Create and store token
    const token = createTokenAndSaveCookie(user._id, res);
    await User.findByIdAndUpdate(user._id, { currentToken: token });

    res.status(201).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.userId, { currentToken: null });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // 🔐 password hide

    // ✅ Wrap response in an object with "users" key
    res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageUrl = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true } // 👈 return updated user
    ).select("-password"); // exclude password

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile image" });
  }
};
// controllers/userController.js
export const updateProfileDetails = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const updateFields = { fullname, email };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateFields.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    ).select("-password");

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
};
