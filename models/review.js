import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },

    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    reviewedId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    rating: { type: Number, min: 1, max: 5, required: true },

    comment: { type: String }

}, { timestamps: true });

export const Review = model('Review', reviewSchema);

