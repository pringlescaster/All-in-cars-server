import userModel from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../Utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../Mailtrap/email.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if all fields are provided
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    // Check if user already exists
    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // Generate a verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new user
    const user = new userModel({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Save the user
    await user.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(res, user._id);

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Respond with success
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined }, // Exclude password from the response
    });
  } catch (err) { // Change 'error' to 'err' or any valid identifier
    // Handle errors
    res.status(400).json({ success: false, message: err.message }); // Use 'err.message' instead
  }
};
