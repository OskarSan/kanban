import express, {Router, Request, Response, NextFunction} from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import passport from '../middleware/google-passport-config'


const authServiceRouter = express.Router();

interface CustomRequest extends Request {
    user?: JwtPayload
}


// Register a new user
authServiceRouter.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered', user });
});

// Login a user
authServiceRouter.post("/login",
    body('username').isString().trim().escape(),
    body('password').isString().escape(),
    async(req: Request, res: Response) => {
        let isAdmin: boolean = false
        try {

            //change user not found and invalid password to "login failed" for security reasons
            const user: IUser | null = await User.findOne({username: req.body.username})
            if(!user){
                res.status(400).json({message: "User not found"})
                return
            }
            if(!user.password){
                res.status(400).json({message: "no password"})
                return
            }
            const validPassword: boolean = await bcrypt.compare(req.body.password, user.password)
            if(!validPassword){
                res.status(400).json({message: "Invalid password"})
                return
            }else{
                
                if(user.isAdmin){
                    isAdmin = true
                }
                //cardIds maybe not needed here
                const JwtPayload: JwtPayload = {
                    id: user._id,
                    username: user.username
                }
                const token: string = jwt.sign(JwtPayload, process.env.JWT_SECRET as string, {expiresIn: "5m"})

                res.status(200).json({message: "Login successful", success: true, token: token, isAdmin: isAdmin})
                return
            }

        }catch(error: any){
            res.status(500).json({message: error.message})
            return
        }


    }
)
// Validate a token
authServiceRouter.get('/validate-token', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: "Access denied" });
        return 
    }
    try {
        const verified: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.user = verified
        res.status(200).json({ message: "Token is valid", user: verified });

    } catch (error: any) {
        res.status(400).json({message: "Access denied, missing token"})
    }
  });


//code for google login made by Erno Vanhala and fetched 
//from: https://github.com/Gessle/awa-google-auth
//edited to fit the project

//redirects to google login
authServiceRouter.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

//callback for google login
//creates a new user if the user does not exist in the database

//the google login works by redirecting the user to the backend for authentication and then
//redirecting the user back to the frontend with a token
//May be a security risk

authServiceRouter.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/login', session: false}), 
    async (req: Request, res: Response) => {
        try{
            const user: IUser | null = await User.findOne({googleId: (req.user as {id: string}).id})
            const jwtPayload: JwtPayload = {}
            if(!user) {
                const newUser: IUser = await User.create({
                    username: (req.user as {displayName: string}).displayName,
                    googleId: (req.user as {id: string}).id,
                    cardIds: []
                })
                jwtPayload.username = newUser.username
                jwtPayload.id = newUser._id
                jwtPayload.googleId = newUser.googleId
            } else { 
                jwtPayload.username = user.username
                jwtPayload.id = user._id
                jwtPayload.googleId = user.googleId
            }

            const token: string = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {expiresIn: "5m"})
            //this is bad practice, but for the sake of simplicity, we redirect to localhost
            res.redirect(`http://localhost:1234/login?token=${token}`);

        } catch(error: any) {
            console.error(`Error during during external login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
)

export default authServiceRouter;