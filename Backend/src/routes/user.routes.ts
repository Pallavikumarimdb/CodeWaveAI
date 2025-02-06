import { Router } from 'express';

import jwt from "jsonwebtoken"
import 'dotenv/config'
import { UserModel} from "../db/schema.db";
import {authMiddleware} from "../middleware/auth"
import {getAllUsers} from "../utils"




const router = Router();

router.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        })

        res.status(200).json({
            message: "User created successfully"
        })

    } catch (error) {
        res.status(411).json({
            message: "user already exist"
        })
    }
})

router.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const UserExist = await UserModel.findOne({
        username,
        password
    });

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    if (UserExist) {
        const token = jwt.sign(
            {
                id: UserExist._id,
            },
            process.env.JWT_SECRET
        );

        res.json({
            token: token,
            UserExist: {
                _id: UserExist._id,
                username: UserExist.username
            },
        });
    } else {
        res.status(404).json({
            message: "User not found",
        });
    }
});


//@ts-ignore
router.get("/api/v1/getAllUsers", authMiddleware, async(req, res)=>{
    try {

        const loggedInUser = await UserModel.findOne({
            //@ts-ignore
            _id: req.userId
        })
        //@ts-ignore
        const allUsers = await getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (error) {

        console.log(error)
        //@ts-ignore
        res.status(400).json({ error: error.message })

    }
})


export default router;