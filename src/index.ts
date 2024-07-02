import "dotenv/config";

import express from "express";
import router from "./routes/appRoute";

const port = process.env.PORT || 3000;

const app = express();

app.use("/api/hello", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}, Happy happy!!`);
})