import urlDb from "../models/shortLinkSchema.js";
export const getShortcode=async (req,res)=>{
    const user=req.user.id;
    const data=await urlDb.find({user});
    // console.log(data);
    return res.json({success:true,data});
}