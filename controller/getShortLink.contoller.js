import urlDb from "../models/shortLinkSchema.js";
export const getShortcode=async (req,res)=>{
    const user=req.user.id;
    const data=await urlDb.find({user});
    return res.json({success:true,data});
}