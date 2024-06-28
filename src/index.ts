import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/MyUserRoute";

mongoose
	.connect(process.env.MONGODB_CONNECTION_STRING as string)
	.then(() => console.log("connected to database"));

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async(req:Request, res:Response) => {
	res.send({ message: "Server is working fine health Ok!" });
});

app.use("/api/my/user", myUserRoutes);

app.listen(7000, () => {
	console.log("Server is working fine at localhost:7000");
});
