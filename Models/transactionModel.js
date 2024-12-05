import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
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
        paymentMethod: {
            type: String,
            enum: ['Mono'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        transactionDate: {
            type: Date,
            default: Date.now,
        },
        amount: {
            type: Number, // Amount to be paid for the car
            required: true,
        },
        transactionId: {
            type: String, // Save Mono transaction ID
        },
    },
    { timestamps: true }
);

const transactionModel = mongoose.models['transactionModel'] || mongoose.model('transactionModel', transactionSchema);

export default transactionModel;
