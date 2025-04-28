"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authServiceRouter = express_1.default.Router();
// Register a new user
authServiceRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await User_1.User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered', user });
});
// Login a user
authServiceRouter.post("/login", (0, express_validator_1.body)('username').isString().trim().escape(), (0, express_validator_1.body)('password').isString().escape(), async (req, res) => {
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
// Validate a token
authServiceRouter.get('/validate-token', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        res.status(200).json({ message: "Token is valid", user: verified });
    }
    catch (error) {
        res.status(400).json({ message: "Access denied, missing token" });
    }
});
exports.default = authServiceRouter;
