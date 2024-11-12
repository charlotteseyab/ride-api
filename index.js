import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.js";
import driverRouter from "./routes/driver.js";
import rideRouter from "./routes/ride.js";
import reviewRouter from "./routes/review.js";
import axios from "axios";
import bodyParser from "body-parser";



await mongoose.connect(process.env.MONGO_URI).then (() => console.log("Database connected successfully")).catch((error) => console.log("Error connecting to database", error));

const app = express();
const port = process.env.PORT || 
3000

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(userRouter);
app.use(driverRouter);
app.use(rideRouter);
app.use(reviewRouter);


app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});