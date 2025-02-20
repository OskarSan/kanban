//validateToken.ts made by Gessle 
//from https://github.com/Gessle/awa-auth/blob/main/src/middleware/validateToken.ts



import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface CustomRequest extends Request {
    user?: JwtPayload
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1]

    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return 
    }
    try {
        const verified: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.user = verified
        next()

    } catch (error: any) {
        res.status(400).json({message: "Access denied, missing token"})
    }
}
