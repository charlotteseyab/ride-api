import Joi from "joi";

export const registerValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('rider', 'driver').required(),
    phoneNumber: Joi.string().required(),
    // currentLocation: Joi.object({
    //     type: Joi.string().valid('Point').required(),
    //     coordinates: Joi.array().length(2).required()
    // }).required(),
    vehicleInfo: Joi.object({
        licensePlate: Joi.string().required(),
        model: Joi.string().required(),
        color: Joi.string().required()
    })
    });

    export const loginValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    export const updateProfileValidator = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        role: Joi.string().valid('rider', 'driver'),
        phoneNumber: Joi.string(),
        currentLocation: Joi.object({
            type: Joi.string().valid('Point'),
            coordinates: Joi.array().length(2)
        }),
        vehicleInfo: Joi.object({
            licensePlate: Joi.string(),
            model: Joi.string(),
            color: Joi.string()
        })
    });

    