import express, {Express} from 'express'; 

import router from "./src/routes/route"

import morgan from 'morgan';
import mongoose, {Connection} from 'mongoose'
import { parse } from 'path';
import dotenv from 'dotenv';
import cors, {CorsOptions} from 'cors';

dotenv.config();


const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 3000;
const uri: string = process.env.MONGODB_URI as string; 

mongoose.connect(uri);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use("/",router);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

