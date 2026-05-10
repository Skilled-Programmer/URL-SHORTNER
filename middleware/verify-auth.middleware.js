import { verifyJwtToken } from "../services/auth.service.js";



export const verifyAuthentication=(req,res,next)=>{
    const token=req.cookies.accessToken;

    if(!token){

        req.user=null;
        return next();
    }
    try {
        const decodedToken=verifyJwtToken(token);
        req.user=decodedToken;

    } catch (error) {
        req.user=null;
    }
    return next();
}
export const getRefreshToken=(req,res,next)=>{
    console.log("first");
    const token=req.cookies.refreshToken;
    if(!token){
        return next();
    }
    try{
        console.log("second");
        const decodedToken=verifyJwtToken(token);
        req.refreshToken=decodedToken;
        console.log("decodedToken:",decodedToken);
    }catch(err){
        console.error(err);
        return next();
    }
    next ();
}