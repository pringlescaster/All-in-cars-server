import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
          },

          name: {
            type: String,
            required: true,
          },
          lastLogin: {
            type: Date,
            default: Date.now,
          },
          isVerified: {
            type: Boolean,
            default: false,
          },
          resetPasswordtToken: String,
          resetPasswordExpiresAt: Date,
          verificationToken: String,
          verificationTokenExpiresAt: Date,

    },
    { timestamps: true }
);

const userModel = mongoose.model("userModel", userSchema);
export default userModel;
