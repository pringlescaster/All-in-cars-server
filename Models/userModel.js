import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    monoAccountId: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: "carModel" },
      { type: mongoose.Schema.Types.ObjectId, ref: "newArrivalModel" },
    ],

  
  
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userSchema);
export default userModel;
