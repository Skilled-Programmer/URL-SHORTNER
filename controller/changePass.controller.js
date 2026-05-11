
import userDb from "../models/userSchema.js";
import argon2 from "argon2";
export const changePass=async (req,res)=>{
    const {currentPass,newPass}=req.body;
    const userId=req.user.id;
    const userDetail=await userDb.findOne({_id:userId});
    const oldPassword=userDetail.password;
    const comparePass=await argon2.verify(oldPassword,currentPass);
    if(!comparePass){
        return res.json({success:false,message:"Invalid Password"});
    }
    const id=userId;
    const hashedNewPass=await argon2.hash(newPass);
    const password=hashedNewPass;
    const isChanged=await userDb.findByIdAndUpdate(
        id,
        {password},
    )
    console.log("changed:",isChanged);
    if(!isChanged){
        return res.json({success:false,message:"Here Is Something Wrong"});
    }
    return res.json({success:true,message:"password change succefully"});
}
