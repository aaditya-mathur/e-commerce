import express from "express";
import cookieParser from "cookie-parser";
import {
  authRouter,
  cartRouter,
  couponRouter,
  productRouter,
  paymentRouter,
  analyticsRouter,
} from "./routes/routes.index.js";

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/analytics", analyticsRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
    errors: err.errors || [],
  });
});

export default app;