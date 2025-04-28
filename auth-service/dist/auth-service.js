"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const authServiceRouter_1 = __importDefault(require("./src/routes/authServiceRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 4000;
const uri = process.env.MONGODB_URI;
mongoose_1.default.connect(uri);
mongoose_1.default.Promise = global.Promise;
const db = mongoose_1.default.connection;
app.use((0, cors_1.default)());
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use("/", authServiceRouter_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
