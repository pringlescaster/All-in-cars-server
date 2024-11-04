import userModel from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../Utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendwelcomeEmail } from "../Mailtrap/email.js";

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
  } catch (err) { 
    // Handle errors
    res.status(400).json({ success: false, message: err.message }); // Use 'err.message' instead
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await userModel.findOne( {
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    })
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendwelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user._doc,
        password: undefined,
      }
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({email});
    if(!user) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    res.status(200).json({ success: true, message: 'Logged in successfully', user: {...user._doc, password: undefined} });
  } catch (error) {
    console.log("Error logging in", error);
    res.status(500).json({ success: false, message: error.message});
    
  }
}


export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}