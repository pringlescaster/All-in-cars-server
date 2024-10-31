import userModel from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../Utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new userModel({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    try {
      generateTokenAndSetCookie(res, user._id);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: { ...user._doc, password: undefined },
      });
    } catch (tokenError) {
      // If there is an error in generating the token, remove the user
      await userModel.findByIdAndDelete(user._id);
      throw new Error("Failed to generate token, user registration failed");
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
