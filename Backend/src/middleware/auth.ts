
import { NextFunction, Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import 'dotenv/config'

export const authMiddleware=(req:Request, res:Response, next:NextFunction)=>{
    const token=req.headers["authorization"];
    //@ts-ignore
    const tokenVerify=jwt.verify(token as string, process.env.JWT_SECRET);

    if(tokenVerify){
        if(typeof tokenVerify === "string"){
            res.status(403).json({
                message:"You are loggedin"
            })
            return;
        }
        //@ts-ignore
        // TO DO: override the types of the express request object
        req.userId=(tokenVerify as JwtPayload).id;
        next();
    }else{
        res.status(404).json({
            message:"You are not loggedin"
        })
    }
}