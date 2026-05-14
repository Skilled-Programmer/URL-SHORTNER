import crypto from "crypto";
import emailVerifyDb from "../models/verifyEmailSchema.js";
import userDb from "../models/userSchema.js";
import { createVerifyEmailLink } from "../services/auth.service.js";
import { sendEmail } from "../lib/nodemailer.js";
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
    sendEmail({
        to:req.user.email,
        subject:"Verify Your Email",
        html:` 
            <h1>Click The Link Below To Verify Your Email</h1>
            <p>This Is Your 8 Digit Verification Code:${randomOtp}</p>
            <a href="${createLink}">Click To Verify</a>
        `
    }).catch(console.error);
    res.redirect("/verifyEmailPage");

}
export const emailTimer=async(userId)=>{
    const dbOtp=await emailVerifyDb.findOne({userId});
    console.log("dbOtp:",dbOtp);
    // const sendTime=await ;
    const expiryTime=dbOtp.expiredAt.getTime();
    console.log("expired time:",expiryTime);
    // console.log("sending time:",sendTime);
    // console.log("sending time:",expiryTime);
    if(Date.now()>expiryTime){
        return false;
    }else{
        return true;
    }
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
export const verifyOtp=async(req,res)=>{
    const {otp}=req.body;
    const checkValidaty=await emailTimer(req.user.id);
    console.log("checkValidaty:",checkValidaty);
    const userEmail=req.user.email;
    const id=req.user.id;
    const getOtp=await emailVerifyDb.findOne({userId:id});
    const legitOtp=getOtp.token;
    if(otp.toString()===legitOtp){
        console.log("db updated");
        const update=await emailVerifyUiChange(id);
        if(update){
            console.log("update if called");
            return res.json({success:true,message:"otp verifed"});
        }else{
            console.log("fail to update");
        }
    }else{
        console.log("otp is invalid");
    }
     console.log("update if not called");
}

export const verifyThroughLink=async(email,token)=>{
    const isToken=await emailVerifyDb.findOne({token:token});
    if(!isToken){
        console.log("invalid otp");
        return false;
    }
    const isExpired=isToken.expiredAt;
    const checkEmail=await userDb.findOne({email});
    if(!checkEmail){
        console.log("invalid email");
        return false;
    }
    if(isToken.userId!=checkEmail._id){
        return console.log("verification field");
        return false;
    }
    const updateEmailVerify=emailVerifyUiChange(checkEmail._id);
    if(!updateEmailVerify){
        return false;
    }
    console.log("verification succefull");
    return true;
}
async function emailVerifyUiChange(_id){
    const getEmail=await userDb.findByIdAndUpdate(
        _id,
        {isVerify:true},
    );
    if(getEmail){
        return true;
    }
    
}