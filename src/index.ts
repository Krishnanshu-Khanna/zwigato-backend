import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/MyUserRoute";
import myRestaurantRoutes from "./routes/MyRestaurantRoute";
import searchRestaurantRoutes from "./routes/SearchRestaurantRoute";
import {v2 as cloudinary} from "cloudinary";

mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING as string)
	.then(() => console.log("connected to database"));

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	const allowedOrigins = [
		"https://zwigato-frontend.onrender.com",
		"http://localhost:5173",
	];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin as string)) {
		res.setHeader("Access-Control-Allow-Origin", origin as string);
	}
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
	);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Private-Network", "true");
	// Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
	res.setHeader("Access-Control-Max-Age", 7200);

	next();
});


app.get("/health", async(req:Request, res:Response) => {
	res.send({ message: "Server is working fine health Ok!" });
});

app.use("/api/my/user", myUserRoutes);
app.use("/api/my/restaurant", myRestaurantRoutes);
app.use("/api/restaurant", searchRestaurantRoutes);

app.listen(7000, () => {
	console.log("Server is working fine at localhost:7000");
});
