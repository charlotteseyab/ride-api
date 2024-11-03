import { Ride } from "../models/ride.js";


// Get all available rides
export const getAvailableRides = async (req, res, next) => {
  try {
    const availableRides = await Ride.find({ status: "requested" });

    if (availableRides.length === 0) {
      return res.status(404).json({ message: "No available rides found" });
    }

    res.status(200).json(availableRides);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const acceptRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const acceptedRide = await Ride.findByIdAndUpdate(rideId, { status: "accepted" }, { new: true });
    if (!acceptedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.status(200).json(acceptedRide);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ride ID" });
    }
    next(error);
  }
};

export const startRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (ride.status !== "accepted") {
      return res.status(400).json({ message: "Ride cannot be started in this status" });
    }

    const startedRide = await Ride.findByIdAndUpdate(rideId, { status: "started" }, { new: true });
    // console.log("Current ride status:", startedRide.status);
    res.status(200).json(startedRide);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ride ID" });
    }
    next(error);
  }
};


export const endRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (ride.status !== "started") {
      return res.status(400).json({ message: "Ride cannot be ended in this status" });
    }

    const endedRide = await Ride.findByIdAndUpdate(rideId, { status: "ended" }, { new: true });
    res.status(200).json(endedRide);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ride ID" });
    }
    next(error);
  }
};

export const cancelRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const cancelledRide = await Ride.findByIdAndUpdate(rideId, { status: "cancelled" }, { new: true });
    if (!cancelledRide) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.status(200).json(cancelledRide);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ride ID" });
    }
    next(error);
  }
};


