"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const user_db_1 = require("../db/user.db");
const auth_1 = require("../middleware/auth");
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield user_db_1.UserModel.create({
            username: username,
            password: password
        });
        res.status(200).json({
            message: "User created successfully"
        });
    }
    catch (error) {
        res.status(411).json({
            message: "user already exist"
        });
    }
}));
router.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const UserExist = yield user_db_1.UserModel.findOne({
        username,
        password
    });
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    if (UserExist) {
        const token = jsonwebtoken_1.default.sign({
            id: UserExist._id,
        }, process.env.JWT_SECRET);
        res.json({
            token: token
        });
    }
    else {
        res.status(404).json({
            message: "User not found"
        });
    }
}));
//@ts-ignore
router.get("/api/auth/verify-token", (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("Token missing");
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.status(200).send({ message: "Token is valid" });
    }
    catch (error) {
        res.status(401).send({ message: "Invalid token" });
    }
});
//@ts-ignore
router.get("/api/v1/getAllUsers", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = yield user_db_1.UserModel.findOne({
            //@ts-ignore
            _id: req.userId
        });
        //@ts-ignore
        const allUsers = yield (0, utils_1.getAllUsers)({ userId: loggedInUser._id });
        return res.status(200).json({
            users: allUsers
        });
    }
    catch (error) {
        console.log(error);
        //@ts-ignore
        res.status(400).json({ error: error.message });
    }
}));
exports.default = router;
