import mongoose from "mongoose";
import connectDb from "../db.js";

const userSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    mobileNo:{type:String},
    password:{type:String},
    isVerify:{type:Boolean},
    linkCreated:{type:String},
    linkClicked:{type:String},
});
const userDb=mongoose.model("User",userSchema);
export default userDb;

await mongoose.connection.close();