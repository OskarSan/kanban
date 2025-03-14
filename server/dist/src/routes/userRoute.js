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
const google_passport_config_1 = __importDefault(require("../middleware/google-passport-config"));
const userRouter = (0, express_1.Router)();
//registers a new user to the database with username and password
//sets users cards to an empty array
//isAdmin is set to false by default and there is no way to change it in the frontend
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
            password: hashedPassword,
            cardIds: [],
            isAdmin: req.body.isAdmin,
        });
        res.status(201).json({ message: "User created" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});
//logins with username and password
userRouter.post("/login", (0, express_validator_1.body)('username').isString().trim().escape(), (0, express_validator_1.body)('password').isString().escape(), async (req, res) => {
    let isAdmin = false;
    try {
        //change user not found and invalid password to "login failed" for security reasons
        const user = await User_1.User.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        if (!user.password) {
            res.status(400).json({ message: "no password" });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        else {
            if (user.isAdmin) {
                isAdmin = true;
            }
            //cardIds maybe not needed here
            const JwtPayload = {
                id: user._id,
                username: user.username
            };
            const token = jsonwebtoken_1.default.sign(JwtPayload, process.env.JWT_SECRET, { expiresIn: "5m" });
            res.status(200).json({ message: "Login successful", success: true, token: token, isAdmin: isAdmin });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});
//code for google login made by Erno Vanhala and fetched 
//from: https://github.com/Gessle/awa-google-auth
//edited to fit the project
//redirects to google login
userRouter.get('/auth/google', google_passport_config_1.default.authenticate('google', { scope: ['profile'] }));
//callback for google login
//creates a new user if the user does not exist in the database
//the google login works by redirecting the user to the backend for authentication and then
//redirecting the user back to the frontend with a token
//May be a security risk
userRouter.get('/auth/google/callback', google_passport_config_1.default.authenticate('google', { failureRedirect: '/user/login', session: false }), async (req, res) => {
    try {
        const user = await User_1.User.findOne({ googleId: req.user.id });
        const jwtPayload = {};
        if (!user) {
            const newUser = await User_1.User.create({
                username: req.user.displayName,
                googleId: req.user.id,
                cardIds: []
            });
            jwtPayload.username = newUser.username;
            jwtPayload.id = newUser._id;
            jwtPayload.googleId = newUser.googleId;
        }
        else {
            jwtPayload.username = user.username;
            jwtPayload.id = user._id;
            jwtPayload.googleId = user.googleId;
        }
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "5m" });
        res.redirect(`http://localhost:1234/login?token=${token}`);
    }
    catch (error) {
        console.error(`Error during during external login: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = userRouter;
