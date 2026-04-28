
import urlDb from "../models/shortLinkSchema.js";

export const deleteSc=async (req,res)=>{
    try{
        
        if(!req.user){
            return res.json({success:false,message:"Unauhorized"});
        }
        const shortCode=req.params.clickedShortCode;
        const getLink=await urlDb.findOneAndDelete({shortCode});
        if(!getLink){
            return res.status(404).json({success:false,message:"Link Not Exist"});
        }
        if(getLink){
            return res.json({success:true});
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"server error",
        });
    }
} 