import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import routers from './Routers/index.js';
import cookieParser from 'cookie-parser';
import cors from"cors";

const app = express();
dotenv.config();

app.use(express.json()); // allows us to parse incoming requets:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

// CORS Configuration
app.use(cors({
    origin: 'https://allincars-brown.vercel.app' || 'http://localhost:3000', // Add localhost for dev
 // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included for preflight requests
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use('/api/v1', routers);


// Custom 404
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
  });

  // Custom 500
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ msg: "Something went wrong", error: err.message });
});



const port = process.env.PORT || 2000;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
    console.log("successfully started");
})

.catch((error) => {
    console.log("Database connection error", error);
});



export default app;