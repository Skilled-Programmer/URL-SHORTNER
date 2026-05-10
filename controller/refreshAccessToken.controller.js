import { json } from "express";
import sessionDb from "../models/sessionId.js";
import userDb from "../models/userSchema.js";
import { createSessionId, genarateAccessToken, genarateRefreshToken } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
let jwtSecret="urlShortnerJwtKey";
export const handelRefreshToken=async(getSessionJwt,res)=>{
    let refreshTokenData;
    try {
        refreshTokenData=jwt.verify(getSessionJwt,jwtSecret);
    } catch (error) {                                                           
        console.error(error);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return false;
    }
    const sessionId=refreshTokenData.sessionId;
    const getSessionDetail=await sessionDb.findOne({sessionId}); 
    if(!getSessionDetail){
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return false;
    }
    let userId=getSessionDetail.userId;
    userId=userId.toString();
    const userDetail=await userDb.findOne({_id:userId});
    if(!userDetail){
        return false;
    }
    const accessToken=genarateAccessToken({
        id:userDetail._id,
        // sessionId:newSessionId,
        name:userDetail.name,
        email:userDetail.email,
    });
    
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
    });
    return true;
}
export async function deleteRefreshToken(refreshTokenData){
    console.log("refreshTokenData:",refreshTokenData);
    const userId=refreshTokenData.userId;
    console.log("userid:",userId);
    const get=await sessionDb.deleteMany({
        userId
    });
    console.log(get);
}