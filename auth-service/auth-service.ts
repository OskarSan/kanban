import express, {Express} from 'express'
import morgan from 'morgan'
import mongoose, {Connection} from 'mongoose'
import dotenv from 'dotenv'
import cors, {CorsOptions} from 'cors'
import passport from 'passport'
import authServiceRouter from './src/routes/authServiceRouter'

dotenv.config()


const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 4000;
const uri: string = process.env.MONGODB_URI as string; 

mongoose.connect(uri);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

app.use(cors())


app.use(passport.initialize());
app.use(express.json());

app.use(morgan('dev'));
app.use("/",authServiceRouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
