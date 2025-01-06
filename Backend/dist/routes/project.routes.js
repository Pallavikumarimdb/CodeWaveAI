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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_db_1 = require("../db/user.db");
const router = (0, express_1.Router)();
router.post('/create', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    console.log(name);
    const loogedInUser = yield user_db_1.UserModel.findOne({
        //@ts-ignore
        _id: req.userId
    });
    //@ts-ignore
    const userId = loogedInUser._id;
    try {
        console.log(typeof name);
        console.log(typeof userId);
        const newProject = yield user_db_1.ProjectModel.create({
            name,
            users: [userId]
        });
        console.log("loogedInUser  " + newProject);
        res.status(201).json(newProject);
    }
    catch (error) {
        throw new Error('An error occured while creating project');
    }
}));
//@ts-ignore
router.get('/all', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = yield user_db_1.UserModel.findOne({
            //@ts-ignore
            _id: req.userId
        });
        console.log(loggedInUser);
        const allUserProjects = yield user_db_1.ProjectModel.find({
            //@ts-ignore
            users: req.userId
        });
        return res.status(200).json({
            projects: allUserProjects
        });
    }
    catch (err) {
        console.log(err);
        //@ts-ignore
        res.status(400).json({ error: err.message });
    }
}));
router.put('/add-user', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.get('/get-project/:projectId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
router.put('/update-file-tree', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.default = router;
