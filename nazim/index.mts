import "dotenv/config";
import path from "path";
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join('public')));
app.get("/", (req: Request, res: Response) => {
    res.send("Nazim Service is running");
});

app.use((req: Request, res: Response) => {
    res.status(404).send("Route not found");
});

app.listen(PORT, () => {
    console.log(`Nazim Service is running on port ${PORT}`);
});