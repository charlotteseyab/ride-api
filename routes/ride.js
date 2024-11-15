import { Router } from "express";
import { cancelRide, createRide, getHistory, getRideDetails, updateRide } from "../controllers/ride.js";
import { isAuthenticated } from "../middleware/auth.js";

export const rideRouter = Router()

rideRouter.post("/rides", createRide);     

rideRouter.patch("/rides/:rideId", updateRide); 

rideRouter.patch("/rides/:rideId/cancel", cancelRide);    

rideRouter.get("/rides/details/:rideId", isAuthenticated, getRideDetails);  

rideRouter.get("/rides/history", isAuthenticated, getHistory);



export default rideRouter;