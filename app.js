import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import routers from './Routers/index.js';
import cors from"cors";

const app = express();
dotenv.config();

app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_DOMAIN, // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included for preflight requests
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use('/api/v1', routers);


// Custom 404
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
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

