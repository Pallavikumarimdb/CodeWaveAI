"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    //@ts-ignore
    const tokenVerify = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (tokenVerify) {
        if (typeof tokenVerify === "string") {
            res.status(403).json({
                message: "You are loggedin"
            });
            return;
        }
        //@ts-ignore
        // TO DO: override the types of the express request object
        req.userId = tokenVerify.id;
        next();
    }
    else {
        res.status(404).json({
            message: "You are not loggedin"
        });
    }
};
exports.authMiddleware = authMiddleware;
