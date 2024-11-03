import { Router } from "express";
import { cancelRide, createRide, getRideDetails, updateRide } from "../controllers/ride.js";

export const rideRouter = Router()

rideRouter.post("/rides", createRide);     

rideRouter.patch("/rides/:rideId", updateRide); 

rideRouter.patch("/rides/:rideId/cancel", cancelRide);    

rideRouter.get("/rides/:rideId", getRideDetails);  



export default rideRouter;