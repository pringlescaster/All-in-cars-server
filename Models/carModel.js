import mongoose from "mongoose";

const carSchema = mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    publicId: {
      type: String,
    },
    logo: {
      type: String,
    },
    logoPublicId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    engineType: {
      type: String,
    },
    speed: {
      type: String,
    },
    year: {
      type: String,
    },
    price: {
      type: String,
    },
    categories: {
      type: String,
      enum: ["Sport Cars", "SUVS", "Sudans", "Convertibles", "Electric Cars"],
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const carModel =
  mongoose.models.carModel || mongoose.model("carModel", carSchema);

export default carModel;
