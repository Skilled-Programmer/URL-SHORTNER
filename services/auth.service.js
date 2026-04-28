import jwt from "jsonwebtoken";

const jwtSecret="urlShortnerJwtKey";

export const verifyJwtToken=(token)=>{
    return jwt.verify(token,jwtSecret);
};

export const genarateToken=({id,name,email})=>{
    return jwt.sign({id,name,email},jwtSecret,{
        expiresIn:"1d",
    });
}
export const removeToken=(req,res)=>{
    res.clearCookie("accessToken");
    return res.redirect("/signin");
}
export const getProfileData=(req,res)=>{
    const myData=req.user;
    return res.json({success:true,myData});
}
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