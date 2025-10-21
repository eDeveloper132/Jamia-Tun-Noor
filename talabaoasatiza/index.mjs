import "dotenv/config";
import path from "path";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from "./db/db.js";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
await connectToDatabase();
app.use(cookieParser());
app.use(express.static(path.join('public')));
app.get("/", (req, res) => {
    res.send("talabaoasatiza Service is running");
});
app.use((req, res) => {
    res.status(404).send("Route not found");
});
app.listen(PORT, () => {
    console.log(`talabaoasatiza Service is running on port ${PORT}`);
});
//# sourceMappingURL=index.mjs.map