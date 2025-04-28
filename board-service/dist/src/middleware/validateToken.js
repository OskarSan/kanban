"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const axios_1 = __importDefault(require("axios"));
const validateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("token", token);
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    try {
        // Send the token to the auth-service for validation
        const response = await axios_1.default.get('http://localhost:4000/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Check if the response from the auth-service is successful
        if (response.status === 200) {
            // Attach the user information from the auth-service to the request object
            console.log("user from auth service", response.data);
            req.user = response.data;
            next(); // Proceed to the next middleware or route handler
        }
        else {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
    catch (error) {
        console.error("Error validating token:", error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.validateToken = validateToken;
