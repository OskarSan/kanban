"use strict";
//validateToken.ts made by Gessle 
//from https://github.com/Gessle/awa-auth/blob/main/src/middleware/validateToken.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateToken = (req, res, next) => {
    const token = req.header('authorization')?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Access denied, missing token" });
    }
};
exports.validateToken = validateToken;
