import mongoose from "mongoose";
import connectDb from "../db.js";

const verifyEmailSchema=mongoose.Schema({
    userId:{
        type:String,
        ref:"User",
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    expiredAt:{
        type:Date,
        default:Date.now()+2 * 60 * 1000,
    }
});
const emailVerifyDb=mongoose.model("emailVerify",verifyEmailSchema);
export default emailVerifyDb;
await mongoose.connection.close();