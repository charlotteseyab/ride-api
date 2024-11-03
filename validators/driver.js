import Joi from "joi";

export const getAvailableRidesValidator = Joi.object({
    userId: Joi.string().required()
});

export const acceptRideValidator = Joi.object({
    userId: Joi.string().required(),
    rideId: Joi.string().required()
});

export const startRideValidator = Joi.object({
    userId: Joi.string().required(),
    rideId: Joi.string().required()
});

export const endRideValidator = Joi.object({
    userId: Joi.string().required(),
    rideId: Joi.string().required()
});