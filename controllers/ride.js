import { Ride } from "../models/ride.js";
import { cancelRideValidator, createRideValidator, updateRideValidator } from "../validators/ride.js";
import { getDistance } from "geolib";
import { calculateFare } from '../utils/fareCalculator.js';



// Create a new ride
export const createRide = async (req, res) => {
    try {
        const { error, value } = createRideValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Invalid request", error });
        }

        const { userId, pickupLocation, dropoffLocation } = value;

        // Create new ride with just the addresses
        const newRide = await Ride.create({
            userId,
            pickupLocation: {
                address: pickupLocation.address
            },
            dropoffLocation: {
                address: dropoffLocation.address
            },
            status: "requested",
            requestedAt: Date.now(),
        });

        // Wait for the pre-save middleware to complete and get the updated ride with coordinates and distance
        await newRide.save();

        // Calculate estimated amount based on the distance
        const fareEstimate = calculateFare(newRide.distance, {
            timeOfDay: new Date(),
            vehicleType: 'standard',
            trafficMultiplier: 1.1 // Could be determined by real-time traffic data
        });

        res.status(201).json({
            ride: newRide,
            fareEstimate: {
                ...fareEstimate,
                currency: 'NGN',
                distance: `${newRide.distance.toFixed(2)} km`,
                note: 'This is an estimated fare. Actual fare may vary based on traffic and other factors.'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create ride", error });
    }
};

export const updateRide = async (req, res) => {
    try {
        const { error, value } = updateRideValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: 'Validation failed', details: error.details });
        }

        const { userId, rideId, status, currentLocation } = value;

        // Validate the status value
        if (!['requested', 'accepted', 'in-progress', 'completed', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Retrieve the ride to get its location details
        const ride = await Ride.findOne({ _id: rideId, userId });
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Check if the ride is already in the desired status
        if (ride.status === status) {
            return res.status(400).json({ message: 'Ride is already in the desired status' });
        }

        // Calculate distance if currentLocation is provided
        let distance = null;
        if (currentLocation) {
            try {
                distance = getDistance(
                    { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
                    { latitude: ride.pickupLocation.coordinates[1], longitude: ride.pickupLocation.coordinates[0] }
                );
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to calculate distance' });
            }
        }
        // Update the ride status
        ride.status = status;
        await ride.save();

        // Send the response with distance data, if calculated
        res.status(200).json({
            message: `Ride status updated to ${status}`,
            distanceFromPickup: distance ? `${distance} meters` : "N/A",
            updatedRide: ride,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update ride", error });
    }
};
export const cancelRide = async (req, res) => {
    try {
        const { error, value } = cancelRideValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: 'Validation failed', details: error.details });
        }
        const { userId, rideId } = value;

        const canceledRide = await Ride.findOneAndUpdate(
            { _id: rideId, userId },
            { status: "canceled" },
            { new: true }
        );

        if (!canceledRide) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Respond with only the success message
        console.log('response--->', response);
        res.status(200).json({
            message: "Ride canceled successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to cancel ride", error });
    }
};



export const getRideDetails = async (req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Calculate the distance dynamically if not stored
        const distance = ride.distance || getDistance(
            { latitude: ride.pickupLocation.coordinates[1], longitude: ride.pickupLocation.coordinates[0] },
            { latitude: ride.dropoffLocation.coordinates[1], longitude: ride.dropoffLocation.coordinates[0] }
        );

        res.status(200).json({ ...ride.toObject(), distance });
    } catch (error) {
        res.status(500).json({ message: "Failed to get ride details", error });
    }
};

export const getHistory = async (req, res) => {
    try {
        const history = await Ride.find({ userId: req.auth._id })
            .select('status amount pickupLocation dropoffLocation createdAt');

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to get history", error });
    }
};
