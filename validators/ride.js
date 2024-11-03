import Joi from "joi";

export const createRideValidator = Joi.object({
    userId: Joi.string().required(),
    pickupLocation: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).required()
    }).required(),
    dropoffLocation: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).required()
    }).required()
});


export const updateRideValidator = Joi.object({
    userId: Joi.string().required(),
    rideId: Joi.string().required(),
    status: Joi.string().valid('in-progress', 'completed').required(),
    pickupLocation: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).required()
    }),
    dropoffLocation: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().length(2).required()
    })
});

export const cancelRideValidator = Joi.object({
    userId: Joi.string().required(),
    rideId: Joi.string().required()
});

export const getRideDetailsValidator = Joi.object({
    userId: Joi.string().required(),
    rideId: Joi.string().required()
});