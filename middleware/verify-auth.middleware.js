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