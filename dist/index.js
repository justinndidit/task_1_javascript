"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
//test
const express_1 = __importDefault(require("express"));
const appRoute_1 = __importDefault(require("./routes/appRoute"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use("/api/hello", appRoute_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
