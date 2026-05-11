import {nanoid} from "nanoid";
import urlDb from "../models/shortLinkSchema.js";
import userDb from "../models/userSchema.js";
import { checkShortCodeLength, checkValidShortCode, isSafeUrl, normalizedLongLink } from "../services/auth.service.js";
import { parse } from "dotenv";
export const saveLink=async (req,res)=>{
    try{
        
        let {longLink,shortCode}=req.body;
        if(!longLink){
           return res.json({success:false,message:"Long Link Required"});
        }
        const normalizeLongLink=normalizedLongLink(longLink);
        try {
            new URL(normalizeLongLink);
        } catch (error) {
            return res.json({success:false,message:"please enter a valid URl"});
        }
        if(!isSafeUrl(normalizeLongLink)){
            return res.status(400).json({
                success:false,
                message:"Use Valid Link"
            });
        }
        
        if(!shortCode){
            shortCode=nanoid(8);
        }
        if(!checkShortCodeLength(shortCode)){
            return res.json({success:false,message:"Length of the shortcode do not exist 15"});
        }
        if(!checkValidShortCode(shortCode)){
            return res.json({success:false,message:"Only _ and - special Characters Are Allowed"})
        }
        const isShortCode=await urlDb.findOne({shortCode});
        if(isShortCode){
            return res.json({success:false,message:"ShortCode is already used please try another"});
        }
        await urlDb.create({
            user:req.user.id,
            longLink:normalizeLongLink,
            shortCode:shortCode,
        });
        const id=req.user.id;
        const userDetail=await userDb.findOne({_id:id});
        console.log("old linkcreated:",userDetail.linkCreated);
        let linkCreated=userDetail.linkCreated;
        linkCreated=parseInt(linkCreated);
        linkCreated+=1;
        linkCreated=linkCreated.toString();
        console.log("linkCreated:",linkCreated);
        const updateData=await userDb.findByIdAndUpdate(
            id,
            {linkCreated},
        )
        console.log("updateData:",updateData);
        res.json({success:true,message:"ShortCode Created Succefully"});
    }catch(err){
        console.error(err);
        return res.json({success:false,message:"Something Went Wrong Please Try Again"});   
    }
    
}