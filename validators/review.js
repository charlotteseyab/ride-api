import Joi from "joi";

export const createReviewValidator = Joi.object({
    riderId: Joi.string().required(),
    rideId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
});

export const getDriverReviewsValidator = Joi.object({
    driverId: Joi.string().required()
});