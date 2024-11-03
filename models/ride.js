import { Schema, model } from "mongoose";

const rideSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    driverId: { type: Schema.Types.ObjectId, ref: 'User' },

    pickupLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }  // [longitude, latitude]
    },

    dropoffLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true }
    },

    // fareEstimate: { type: Number, required: true },

    distance: { type: Number },  // Optional, calculate based on coordinates

    status: {
        type: String,
        enum: ['requested','pending' ,'accepted', 'in-progress', 'completed', 'canceled'],
        default: 'requested'
    },

    startedAt: { type: Date },

    completedAt: { type: Date }

}, { timestamps: true });

 export const Ride = model('Ride', rideSchema);

