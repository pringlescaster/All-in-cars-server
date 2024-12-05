import userModel from "../Models/userModel.js";
import bookingModel from "../Models/bookingModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../Utils/emailTemplate/verificationEmail.js";
import { sendWelcomeEmail } from "../Utils/emailTemplate/welcomeEmail.js";
import { sendPasswordResetEmail } from "../Utils/emailTemplate/passwordReset.js";
import { sendBookingConfirmationEmail } from "../Utils/emailTemplate/bookingConfirmation.js";
import { sendCompanyNotificationEmail } from "../Utils/emailTemplate/companyNotification.js";
import carModel from "../Models/carModel.js";
import newArrivalModel from "../Models/newArrivalModel.js";
import { generateToken } from "../Utils/generateToken.js";
import transactionModel from "../Models/transactionModel.js";
import { initiateMonoAccount, getIncomeInsights, checkCreditWorthiness, getUserAccountData, getIncome } from "../Service/monoService.js";


export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  let session;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    session = await userModel.startSession();
    session.startTransaction();

    const userAlreadyExists = await userModel.findOne({ email }).session(session);
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new userModel({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save({ session });

    // Create Mono account and get the Mono Account ID
    const monoResponse = await initiateMonoAccount({ name, email });

    // Save the Mono Account ID in the user's record
    user.monoAccountId = monoResponse.accountId; // Assuming `monoResponse` contains `accountId`
    await user.save({ session });

    const token = generateToken(user._id);

    await sendVerificationEmail(user.email, verificationToken);
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
      token,
      mono: monoResponse,
    });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
    }
    res.status(400).json({ success: false, message: err.message });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};



export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await userModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    user.lastLogin = new Date();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
      token, // Send token in the response body
    });
  } catch (error) {
    console.log("Error logging in", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

//Forgot Password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_DOMAIN}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgot password", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(400).json({ success: false, messgae: error.message });
  }
};

export const addToFavorites = async (req, res) => {
  const { carId } = req.body;
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId);
    const car = await carModel.findById(carId);

    if (!car) {
      return res.status(400).json({ success: false, message: "Car not found" });
    }

    if (user.favorites.includes(carId)) {
      return res
        .status(400)
        .json({ success: false, message: "Car already in favorites" });
    }

    user.favorites.push(carId);
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Car added to favorites",
        favorites: user.favorites,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId).populate("favorites");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromFavorites = async (req, res) => {
  const { carId } = req.params;
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId);

    if (!user.favorites.includes(carId)) {
      return res
        .status(400)
        .json({ success: false, message: "Car not in favorites" });
    }

    user.favorites = user.favorites.filter((fav) => fav.toString() !== carId);
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Car removed from favorites",
        favorites: user.favorites,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const addToFavoritesNewArrival = async (req, res) => {
  const { newArrivalId } = req.body;
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId);
    const newArrival = await newArrivalModel.findById(newArrivalId);

    if (!newArrival) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (user.favorites.includes(newArrivalId)) {
      return res
        .status(400)
        .json({ success: false, message: "Car already in favorite" });
    }

    user.favorites.push(newArrivalId);
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Car added to favorites",
        favorites: user.favorites,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Add booking
export const bookVisitation = async (req, res) => {
  const { carId, date, accountId } = req.body;

  try {
    // Fetch income details to check creditworthiness
    const incomeData = await getIncomeInsights(accountId);
    if (!checkCreditWorthiness(incomeData)) {
      return res.status(400).json({
        success: false,
        message: "User is not creditworthy for booking.",
      });
    }

    // Validate required fields
    if (!carId || !date) {
      return res.status(400).json({ success: false, message: "Car ID and date are required." });
    }

    // Check if the car is already booked for the specified date
    const existingBooking = await bookingModel.findOne({ car: carId, date });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Car is already booked for this date.",
      });
    }

    // Fetch the user who is trying to make the booking
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Fetch the car the user wants to book
    const car = await carModel.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found." });
    }

    // Create a new booking
    const booking = new bookingModel({
      car: carId,
      user: req.userId,
      date,
    });
    await booking.save();

    // Send booking confirmation email to the user
    await sendBookingConfirmationEmail(user.email, car.name, date);

    // Send notification email to the company
    await sendCompanyNotificationEmail(car.name, user.name, date);

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


// //to initiate mono
// export const initiateMono = async (req,res) => {
//   const userId = req.userId;

//   try {
//     const user = await userModel.findById(userId);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     const monoResponse = await initiateMonoAccount({name: user.name, email: user.email});
//     user.monoAccountId = monoResponse.accountId;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Mono account initiated successfully",
//       monoAccountId: monoResponse,
//     })
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });

//   }
// }


//Get user account data and income details using Mono
export const getMonoAccount = async (req, res) => {
  try {
    // Fetch user account data from Mono
    const userAccountData = await getUserAccountData();
    
    // Get the accountId from the fetched user account data
    const accountId = userAccountData?.data?.account_id; // Adjust based on the structure of response data

    // Fetch income insights if accountId exists
    let incomeInsights = null;
    let income = null;
    
    if (accountId) {
      // Fetch income insights
      incomeInsights = await getIncomeInsights(accountId);

      // Fetch income details
      income = await getIncome(accountId);
    }

    // Return the user account data along with income insights and income
    res.status(200).json({
      success: true,
      message: "User account data and income fetched successfully",
      data: {
        userAccountData,
        incomeInsights,
        income,
      }, // Return all data (user account, income insights, income)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
