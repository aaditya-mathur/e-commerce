import express from "express";
import authRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json({ extended: false }));

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
    errors: err.errors || [],
  });
});

export default app;