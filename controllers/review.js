import { Review } from "../models/review.js";
import { Ride } from "../models/ride.js";
import { createReviewValidator } from "../validators/review.js";




export const getDriverReviews = async (req, res, next) => {
    try {
        const driverId = req.params._id; // Assuming driver's ID is available in req.user after authentication

        // Find reviews that match the driver's ID
        const reviews = await Review.find({ driverId });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this driver" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};





export const postReview = async (req, res, next) => {
    try {
        const { rideId, riderId, rating, comment } = req.body;

        // Check if the ride exists and is completed
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }
        
        // Ensure the ride status is "ended"
        if (ride.status !== "ended") {
            return res.status(400).json({ message: "Ride must be ended to post a review" });
        }

        // Post the review without needing a user ID
        const newReview = new Review({
            rideId,
            riderId,
            rating,
            comment,
        });

        const savedReview = await newReview.save();
        res.status(201).json({ message: "Review posted successfully", review: savedReview });
    } catch (error) {
        next(error);
    }
};







