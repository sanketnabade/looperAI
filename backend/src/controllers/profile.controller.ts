import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";

interface AuthRequest extends Request {
  user?: any;
}

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, profile, currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If updating email, check if it's already taken
    if (email && email !== user.email) {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update profile picture if provided
    if (profile !== undefined) {
      user.profile = profile;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    const updatedUser = await UserModel.findById(user._id).select("-password");
    res.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user account
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    await UserModel.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Upload avatar (simplified - in production, use cloud storage)
export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // In a real app, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
    // For now, we'll just return a placeholder URL
    const avatarUrl = `/uploads/avatars/${
      req.user._id
    }_${Date.now()}.${req.file.originalname.split(".").pop()}`;

    // You could also save the file locally here if needed
    // For this demo, we'll just return a mock URL
    res.json({
      url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        req.user.name || "User"
      )}&size=200&background=00D4FF&color=fff`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
