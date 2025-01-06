"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = exports.UserModel = void 0;
require("dotenv/config");
const mongoose_1 = __importStar(require("mongoose"));
console.log('Environment Variables:', process.env.Mongo_DB);
const mongoDB = process.env.Mongo_DB;
if (!mongoDB) {
    throw new Error('Mongo_DB environment variable is not set');
}
mongoose_1.default.connect(mongoDB);
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: String
});
const projectSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        // lowercase: true,
        required: true,
        trim: true,
        unique: [true, 'Project name must be unique'],
    },
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    fileTree: {
        type: Object,
        default: {}
    },
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.ProjectModel = (0, mongoose_1.model)('Project', projectSchema);
