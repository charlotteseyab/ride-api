import { Router } from "express";
import { getAvailableRides, acceptRide, startRide, endRide, cancelRide, getHistory } from "../controllers/driver.js";

export const driverRouter = Router();


driverRouter.get("/rides/available", getAvailableRides);

driverRouter.patch("/rides/:rideId/accept", acceptRide);

driverRouter.patch("/rides/:rideId/start", startRide);

driverRouter.patch("/rides/:rideId/end", endRide);

driverRouter.patch("/rides/:rideId/cancel", cancelRide);

driverRouter.get("/rides/:rideId", getHistory);

export default driverRouter;
