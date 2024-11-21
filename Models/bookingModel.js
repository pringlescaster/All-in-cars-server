import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carModel",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Canceled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const bookingModel =
  mongoose.models.bookingModel || mongoose.model("bookingModel", bookingSchema);

export default bookingModel;
