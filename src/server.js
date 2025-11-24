import express from "express";
import authRouter from "./routes/user.routes.js"

const app = express();

app.use("/api/auth",authRouter);

export default app;