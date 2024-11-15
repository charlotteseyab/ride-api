import { Schema, model } from "mongoose";
import geocoding from "../middleware/geocoding.js";

const rideSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    driverId: { type: Schema.Types.ObjectId, ref: 'User' },

    pickupLocation: {
        address: { type: String, required: true },
        coordinates: { 
            type: [Number],
            required: false,  // Make coordinates optional
            default: undefined  // Don't set a default value
        }
    },

    dropoffLocation: {
        address: { type: String, required: true },
        coordinates: { 
            type: [Number],
            required: false,  // Make coordinates optional
            default: undefined  // Don't set a default value
        }
    },

    distance: { type: Number },

    status: {
        type: String,
        enum: ['requested', 'pending', 'accepted', 'in-progress', 'completed', 'canceled'],
        default: 'requested'
    },

    startedAt: { type: Date },

    completedAt: { type: Date },

    estimatedAmount: { type: Number },

}, { timestamps: true });

//Pre-save middleware
rideSchema.pre('save', async function(next) {
  try {
    // Only process if pickup or dropoff location has changed
    if (this.isModified('pickupLocation.address') || this.isModified('dropoffLocation.address')) {
      
      // Geocode pickup location
      if (this.isModified('pickupLocation.address')) {
        const pickupCoords = await geocodeAddress(this.pickupLocation.address);
        if (pickupCoords) {
          this.pickupLocation.coordinates = pickupCoords;
        }
      }
       // Geocode dropoff location
       if (this.isModified('dropoffLocation.address')) {
        const dropoffCoords = await geocodeAddress(this.dropoffLocation.address);
        if (dropoffCoords) {
          this.dropoffLocation.coordinates = dropoffCoords;
        }
      }

      // Calculate distance if both coordinates are available
      if (this.pickupLocation.coordinates && this.dropoffLocation.coordinates) {
        this.distance = await calculateDistance(
          this.pickupLocation.address,
          this.dropoffLocation.address
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

 export const Ride = model('Ride', rideSchema);

