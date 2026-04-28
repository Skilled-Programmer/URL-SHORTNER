import {nanoid} from "nanoid";
import urlDb from "../models/shortLinkSchema.js";
import userDb from "../models/userSchema.js";
import { checkShortCodeLength, checkValidShortCode } from "../services/auth.service.js";
export const saveLink=async (req,res)=>{
    try{
        
        let {longLink,shortCode}=req.body;
        if(!longLink){
           return res.json({success:false,message:"Long Link Required"});
        }
        try {
            new URL(longLink);
        } catch (error) {
            return res.json({success:false,message:"please enter a valid URl"});
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
        console.log(req.user);
        await urlDb.create({
            user:req.user.id,
            longLink:longLink,
            shortCode:shortCode,
        });
        res.json({success:true,message:"ShortCode Created Succefully"});
    }catch(err){
        console.error(err);
        return res.json({success:false,message:"Something Went Wrong Please Try Again"});   
    }
    
}