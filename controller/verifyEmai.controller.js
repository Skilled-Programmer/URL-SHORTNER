import crypto from "crypto";
import emailVerifyDb from "../models/verifyEmailSchema.js";
import { createVerifyEmailLink } from "../services/auth.service.js";
export const generateRandomOtp=()=>{
    const min=10 ** (7);
    const max=10 ** (8);
    return crypto.randomInt(min,max);
}
export const getEmail=(req,res)=>{
    console.log(req.user.email);
    const email=req.user.email;
    return res.json({success:true,email});
}

export const generateOtp=async(req,res)=>{
    if(!req.user){return}
    const randomOtp=generateRandomOtp(); 
    const userId=req.user.id;;
    const saveToDb=await ubdateOptDb(userId,randomOtp);
    if(!saveToDb){
        return false;
    }
    const createLink=createVerifyEmailLink(req.user.email,randomOtp);
    console.log("createLink",createLink);

}
const ubdateOptDb=async(userId,randomOtp)=>{

    const oldOtp=await emailVerifyDb.find({userId});
    const expiredOtp=oldOtp.expiredAt;
    oldOtp.forEach(async(otp)=>{
        const oldDate=Date.parse(otp.expiredAt);
        if(Date.now()>oldDate){
            const deleteExpired=await emailVerifyDb.deleteOne(otp._id);
            console.log("deleteExpired:",deleteExpired);
        }
    });
    const addNewOtp=await emailVerifyDb.create({
        userId,
        token:randomOtp,
    });
    if(addNewOtp){
        return true;
    }
}
