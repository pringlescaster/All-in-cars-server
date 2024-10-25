import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Your Cloudinary Cloud Name
  api_key: process.env.API_KEY, // Your Cloudinary API Key
  api_secret: process.env.API_SECRET, // Your Cloudinary API Secret
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'Home', // Replace with your desired folder name in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png', 'svg'],
  },
});

// Set up multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
});

// Export the upload middleware
export { upload };
