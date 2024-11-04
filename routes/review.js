import { Router } from "express";
import { getDriverReviews, postReview } from "../controllers/review.js";
import { isAuthenticated } from "../middleware/auth.js";

export const reviewRouter = Router();

reviewRouter.post('/reviews', postReview);

reviewRouter.get('/reviews/driver/:driverId', getDriverReviews);

export default reviewRouter;