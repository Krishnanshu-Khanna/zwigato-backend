import { Request, Response } from "express";
import User from "../models/User";


const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const currentUser = await User.findOne({ _id: req.userId });
		if (!currentUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(currentUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
};


const createCurrentUser = async (req: Request, res: Response) => {
	//1.check if user exists
	//2.create user if doewnt exist
	//3.return user obkect to the callling client
	try {
		const { auth0Id } = req.body;
		if (!auth0Id) {
			return res.status(400).json({ message: "auth0Id is required" });
		}
		//check if user exists
		const existingUser = await User.findOne({ auth0Id }); // .tolean() gives plain js object instead of mongoose document
		if (!existingUser) {
			const newUser = new User(req.body);
			await newUser.save();
			return res
				.status(201)
				.json({ message: "user created succesfully", user: newUser }); //.toObject converts mongoose document to plain js object
		}
		return res
			.status(200)
			.json({ message: "user already exists", user: existingUser });
	} catch (error) {
		console.log("error in createCurrentUser: ", error);
		res.status(500).json({ message: "error in createCurrentUser" });
	}
};

const updateCurrentUser = async (req: Request, res: Response) => {
	try {
		const {name,addressLine1,country,city}=req.body;
		const user= await User.findById(req.userId);

		if(!user){
			return res.status(404).json({message:"user not found"});
		}
		user.name=name;
		user.addressLine1=addressLine1;
		user.country=country;
		user.city=city;

		await user.save();

		res.send({message:"user updated successfully",user});

	} catch (error) {
		console.log("error in updateCurrentUser: ", error);
		res.status(500).json({ message: "Error in updateCurrentUser" });
	}
};
export default { createCurrentUser, updateCurrentUser,getCurrentUser };
