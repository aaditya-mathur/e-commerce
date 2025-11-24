import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connection successfull")
    } catch (error) {
        console.error("DB connection failed : ",error?.message)
    }
}