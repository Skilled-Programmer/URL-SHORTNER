import argon2  from "argon2";
import userDb from "../models/userSchema.js";
import {genarateToken, isStrongPassword, isValidNumber } from "../services/auth.service.js";
import { verifyAuthentication } from "../middleware/verify-auth.middleware.js";

export const registeration= async (req,res)=>{

    try {
        console.log(req.body);
        const {name,email,mobileNo,password}=req.body;
        if(!name || !email || !mobileNo || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        const normalizedEmail=email.toLowerCase().trim();
        const isExist=await userDb.findOne({
            $or:[{email:normalizedEmail},{mobileNo:String(mobileNo).trim()}]
        });
        if(isExist){
            return res.status(400).json({success:false,message:"email or mobile number exist"});
        }
        
        const strongPassword=await isStrongPassword(password);
        const validateNumber=await isValidNumber(mobileNo);
        if(!strongPassword){
            return res.status(439).json({success:false,message:"Password must be at least 10 characters and include uppercase, lowercase, number, and special character"});
        }
        if(!validateNumber){
            return res.status(439).json({success:false,message:"Please Use A Valid 10 Digit Indian Number"});
        }
        const hashPassword=await argon2.hash(password);
        await userDb.create({
          name,
          email:normalizedEmail,
          mobileNo:String(mobileNo).trim(),
          password:hashPassword,
        });
        return res.status(201).json({success:true,message:"Registration is Succesfull"});
    }catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"internal surver error"});
    }
};
export const logging=async (req,res)=>{

    const {name,password}=req.body;

    if(!name ||!password){
        return res.json({success:false,message:"All Field Are Require"});
    }
    const isUSer=await userDb.findOne({name});
    if(!isUSer){
        return res.json({success:false,message:"given credentials are invalid"});
    }
    const isValidPassword=await argon2.verify(isUSer.password,password);
    if(!isValidPassword){
        return res.json({success:false,message:"given credentials are invalid"});
    }
    const token=genarateToken({
        id:isUSer._id,
        name:isUSer.name,
        email:isUSer.email,
    });
    res.cookie("accessToken",token);
    return res.json({success:true,message:"login successfull"});
}
