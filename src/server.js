import express from "express";
import authRouter from "./routes/user.routes.js"

const app = express();

app.use(express.json({extended : false}));

app.use("/api/auth",authRouter);

export default app;