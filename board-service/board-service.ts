import express, {Express} from 'express'; 


import mongoose, {Connection} from 'mongoose'
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors, {CorsOptions} from 'cors';
import boardServiceRouter from './src/routes/boardServiceRouter';

dotenv.config();


const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 5000;
const uri: string = process.env.MONGODB_URI as string; 
app.use(cors())
mongoose.connect(uri);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(express.json());
app.use(morgan('dev'));
app.use("/", boardServiceRouter);




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
