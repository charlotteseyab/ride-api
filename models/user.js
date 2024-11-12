import { toJSON } from "@reis/mongoose-to-json";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, enum: ['rider', 'driver'], default: 'rider' },

    phoneNumber: { type: String, required: true },

    // currentLocation: {
    //     type: { type: String, default: 'Point' },
    //     coordinates: { type: [Number], index: '2dsphere' }  // [longitude, latitude]
    // },

    vehicleInfo: {
        licensePlate: String,
        model: String,
        color: String
    },

    ghanaCardNumber : {type : String} 
}, {
    timestamps: true
});

userSchema.plugin(toJSON);

export const User = model('User', userSchema);
