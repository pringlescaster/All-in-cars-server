import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import routers from './Routers/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Correct import for CORS

const app = express();
dotenv.config();

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_DOMAIN, process.env.DEV_MODE];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Allow no origin for requests like CURL
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included for preflight requests
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static CORS Configuration for Localhost Testing
app.use(
    cors({
        origin: "http://localhost:3000", // Replace with your local frontend domain
        credentials: true, // Allow cookies
    })
);

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
        console.log("Successfully started");
    })
    .catch((error) => {
        console.log("Database connection error", error);
    });

export default app;
