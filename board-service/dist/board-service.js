"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const boardServiceRouter_1 = __importDefault(require("./src/routes/boardServiceRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 5000;
const uri = process.env.MONGODB_URI;
app.use((0, cors_1.default)());
mongoose_1.default.connect(uri);
mongoose_1.default.Promise = global.Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use("/", boardServiceRouter_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
