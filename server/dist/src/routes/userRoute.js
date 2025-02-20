"use strict";
//code heavily inspired by Erno Vanhala 
//https://github.com/Gessle/awa-auth/blob/main/src/routes/user.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
//import { validateToken } from '../middleware/validateToken'
const userRouter = (0, express_1.Router)();
userRouter.post("/register", (0, express_validator_1.body)('username').isString().trim().isLength({ min: 3 }).escape(), (0, express_validator_1.body)('password').isString().isLength({ min: 5 }).escape(), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const existingUser = await User_1.User.findOne({ username: req.body.username });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const salt = await bcrypt_1.default.genSaltSync(10);
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, salt);
        await User_1.User.create({
            username: req.body.username,
            password: hashedPassword
        });
        res.status(201).json({ message: "User created" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});
userRouter.post("/login", (0, express_validator_1.body)('username').isString().trim().escape(), (0, express_validator_1.body)('password').isString().escape(), async (req, res) => {
    try {
        //change user not found and invalid password to "login failed" for security reasons
        const user = await User_1.User.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        else {
            const JwtPayload = {
                id: user._id,
                username: user.username
            };
            const token = jsonwebtoken_1.default.sign(JwtPayload, process.env.JWT_SECRET, { expiresIn: "5m" });
            res.status(200).json({ message: "Login successful", success: true, token: token });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});
exports.default = userRouter;
