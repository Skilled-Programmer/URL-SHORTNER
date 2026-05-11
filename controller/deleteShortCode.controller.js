
import urlDb from "../models/shortLinkSchema.js";
import userDb from "../models/userSchema.js";
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
            const id=req.user.id;
            const userDetail=await userDb.findOne({_id:id});
            console.log("old linkcreated:",userDetail.linkCreated);
            let linkCreated=userDetail.linkCreated;
            linkCreated=parseInt(linkCreated);
            linkCreated-=1;
            linkCreated=linkCreated.toString();
            console.log("linkCreated:",linkCreated);
            const updateData=await userDb.findByIdAndUpdate(
                id,
                {linkCreated},
            )
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