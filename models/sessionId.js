import mongoose from "mongoose";
import connectDb from "../db.js";
import { createSessionId } from "../services/auth.service.js";
const sessionSchema=mongoose.Schema({
    sessionId:{type:String},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:"1d",
    }
});

const sessionDb=mongoose.model("session",sessionSchema);
export default sessionDb;

await mongoose.connection.close();  