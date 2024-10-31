import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },

    riderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    amount: { type: Number, required: true },

    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },

    transactionId: { type: String },

    paymentMethod: { type: String, enum: ['mobile money', 'cash'], required: true }

}, { timestamps: true });

 export const Payment = model('Payment', paymentSchema);

