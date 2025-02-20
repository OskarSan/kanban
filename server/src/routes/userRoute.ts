//code heavily inspired by Erno Vanhala 
//https://github.com/Gessle/awa-auth/blob/main/src/routes/user.ts


import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import exp from 'constants'
//import { validateToken } from '../middleware/validateToken'

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

            await User.create({
                username: req.body.username,
                password: hashedPassword
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
            const validPassword: boolean = await bcrypt.compare(req.body.password, user.password)
            if(!validPassword){
                res.status(400).json({message: "Invalid password"})
                return
            }else{
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

export default userRouter