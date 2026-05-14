import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import { deleteRefreshToken } from "../controller/refreshAccessToken.controller.js";
const jwtSecret="urlShortnerJwtKey";

export const verifyJwtToken=(token)=>{
    try {
        return jwt.verify(token,jwtSecret);
    } catch (error) {
        // console.error(error);
        return false;
    }
};
export const createSessionId=()=>{
    return nanoid(5);
}
export const genarateAccessToken=({id,sessionId,name,email})=>{
    return jwt.sign({id,sessionId,name,email},jwtSecret,{
        expiresIn:"20m",
    });
}
export const genarateRefreshToken=({sessionId,userId})=>{
    return jwt.sign({sessionId,userId},jwtSecret,{
        expiresIn:"1d",
    });
}
export const removeToken=(req,res)=>{
    const refreshToken=req.cookies.refreshToken;
    let refreshTokenData;
    try {
        refreshTokenData=jwt.verify(refreshToken,jwtSecret);
    } catch (error) {
        return false;
    }
    deleteRefreshToken(refreshTokenData);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect("/signin");
}
// export const getProfileData=(req,res)=>{
//     console.log("getProfileData:",req.user);
//     const myData=req.user;
//     return res.json({success:true,myData});
// }
export const isStrongPassword=(password)=>{
    const regex=/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}+_=/<>?.,:~|-])[A-Za-z\d!@#$%^&*()[\]{}+_=/<>?.,:~|-]{10,}$/;
    return regex.test(password);
}
export const isValidNumber=(mobileNo)=>{
    const regex=/^[6-9]\d{9}$/;
    return regex.test(mobileNo);
}

export const checkValidShortCode=(shortCode)=>{
    const validCode = /^[a-zA-Z0-9_-]+$/;
    return validCode.test(shortCode);

}
export const checkShortCodeLength=(shortCode)=>{
    return shortCode.length <= 15;
}

export const isSafeUrl=(url)=> {
    const BLOCKED_HOSTS = ["localhost", "127.0.0.1"];
    try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            return false;
        }

        if (BLOCKED_HOSTS.includes(parsed.hostname)) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export const normalizedLongLink=(longLink)=>{
    longLink=longLink.trim();
    if (!/^https?:\/\//i.test(longLink)) {
        longLink = "https://" + longLink;
    }
    return longLink;
}

export const createVerifyEmailLink=(email,token)=>{
    // const encodedEmail=encodeURIComponent(email);
    // return `${"http://localhost:3000"}/verify-email-token?token=${token}&email=${encodedEmail}`;
    const url=new URL(`${"http://localhost:3000"}/verify-email-token`);
    url.searchParams.append("token",token);
    url.searchParams.append("email",email);
    return url.toString();
}