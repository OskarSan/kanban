//code heavily inspired by Erno Vanhala 
//https://github.com/Gessle/awa-auth/blob/main/src/routes/user.ts


import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import exp from 'constants'
import router from './route'
//import { validateToken } from '../middleware/validateToken'
import passport from '../middleware/google-passport-config'

const userRouter: Router = Router()

userRouter.post("/register",
    body('username').isString().trim().isLength({ min: 3 }).escape(),
    body('password').isString().isLength({ min: 5 }).escape(),
    async(req: Request, res: Response) => {
        const errors : Result<ValidationError> = validationResult(req)
        
        if(!errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
            return
        }
        try{
            const existingUser: IUser | null = await User.findOne({username: req.body.username})
            if(existingUser){
                res.status(400).json({message: "User already exists"})
                return
            }
            const salt: string = await bcrypt.genSaltSync(10)
            const hashedPassword: string = await bcrypt.hash(req.body.password, salt)
            
            //const newBoard = await Board.create({Id: user._id });
            
            await User.create({
                username: req.body.username,
                password: hashedPassword,
                //board: newBoard,
                cardIds: []
            })
            res.status(201).json({message: "User created"})

        }catch(error:any) {
            res.status(500).json({message: error.message})
            return
        }
    }
)

userRouter.post("/login",
    body('username').isString().trim().escape(),
    body('password').isString().escape(),
    async(req: Request, res: Response) => {
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

                //cardIds maybe not needed here
                const JwtPayload: JwtPayload = {
                    id: user._id,
                    username: user.username
                }
                const token: string = jwt.sign(JwtPayload, process.env.JWT_SECRET as string, {expiresIn: "5m"})

                res.status(200).json({message: "Login successful", success: true, token: token})
                return
            }

        }catch(error: any){
            res.status(500).json({message: error.message})
            return
        }


    }
)
//code for google login made by Erno Vanhala and fetched 
//from: https://github.com/Gessle/awa-google-auth

userRouter.get('/auth/google', passport.authenticate('google', {scope: ['profile']}))

userRouter.get('/auth/google/callback', 
    passport.authenticate('google', {failureRedirect: '/user/login', session: false}), 
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

            res.redirect(`http://localhost:1234/login?token=${token}`);

        } catch(error: any) {
            console.error(`Error during during external login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
)

export default userRouter