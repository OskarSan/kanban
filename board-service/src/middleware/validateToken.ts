import axios from 'axios';
import jwt, {JwtPayload} from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    user?: any; // Attach user information to the request object
  }

  export const validateToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("token", token)
    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }
  
    try {
      // Send the token to the auth-service for validation
      const response = await axios.get('http://localhost:4000/validate-token', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Check if the response from the auth-service is successful
      if (response.status === 200) {
        // Attach the user information from the auth-service to the request object
        
        req.user = response.data;
        next(); // Proceed to the next middleware or route handler
      } else {
        res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error: any) {
      console.error("Error validating token:", error.message);
      res.status(401).json({ message: 'Invalid token' });
    }
  };