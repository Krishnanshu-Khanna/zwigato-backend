import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt  from "jsonwebtoken";
import User from "../models/User";


declare global {
	namespace Express {
		interface Request {
			userId: string;
			auth0Id: string;
		}
	}
}

export const jwtCheck = auth({
	audience: process.env.AUTH0_AUDIENCE,
	issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
	tokenSigningAlg: "RS256",
});
export const jwtParse = async(req:Request,res:Response,next:NextFunction)=>{
	const{authorization}=req.headers;

	if(!authorization || !authorization.startsWith("Bearer ")){
		return res.status(401).json({message:"Authorization header is required"});
	}

	//Bearer tokenllsjdsdsjskskdskdsj
	const token=authorization.split(" ")[1];


	try {
		const decoded=await jwt.decode(token) as jwt.JwtPayload;
		const auth0Id=decoded.sub;
		const user =await User.findOne({auth0Id});

		if(!user){
			return res.status(401).json({message:"User not found"});	
		}

		req.auth0Id = auth0Id as string;
		req.userId = user._id.toString();
		next();
	} catch (error) {
		console.log("error in jwtParse",error);
		res.status(401).json({message:"Invalid token"});
	}
}
