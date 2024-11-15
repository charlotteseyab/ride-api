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

        // Format addresses to include city/region for better geocoding results
        const formatAddress = (address) => {
            // If address doesn't include city/region, append it
            if (!address.toLowerCase().includes('ghana')) {
                return `${address}, Ghana`;
            }
            return address;
        };

        const pickupLocation = typeof value.pickupLocation === 'string' 
            ? { address: formatAddress(value.pickupLocation) }
            : { address: formatAddress(value.pickupLocation.address) };

        const dropoffLocation = typeof value.dropoffLocation === 'string'
            ? { address: formatAddress(value.dropoffLocation) }
            : { address: formatAddress(value.dropoffLocation.address) };

        const newRide = await Ride.create({
            userId: value.userId,
            pickupLocation,
            dropoffLocation,
            status: "requested"
        });

        res.status(201).json({
            message: "Ride created successfully",
            ride: newRide
        });
    } catch (error) {
        console.error('Create ride error:', error);
        res.status(500).json({ 
            message: "Failed to create ride", 
            error: error.message 
        });
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
        console.log('Auth object in request:', req.auth); // Debug log
        
        if (!req.auth || !req.auth._id) {
            return res.status(401).json({ 
                error: "Unauthorized",
                message: "No authentication data found in request" 
            });
        }

        const { rideId } = req.params;
        console.log('Looking for ride:', rideId); // Debug log
        
        const ride = await Ride.findOne({
            _id: rideId,
            userId: req.auth._id
        });

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        res.status(200).json(ride);
    } catch (error) {
        console.error('Get ride details error:', error);
        res.status(500).json({ 
            message: "Failed to get ride details", 
            error: error.message 
        });
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
