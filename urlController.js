import {getDb} from "./db.js";
import { nanoid } from "nanoid";
import path from "path";
export const saveLink=async (req,res)=>{
    try{
        let db=getDb();
        let {longLink,shortCode}=req.body;
        if(!longLink){
            return res.json({ success: false, message: "URL is required" });
        }
        
        try{
            new URL(longLink)
        }catch{
            return res.json({success:false,message:"Invalid Links"})
        }
        if (!longLink.startsWith("http")) {
            longLink = "https://" + longLink;
        }
        if (!shortCode) {
           shortCode = nanoid(8);
        }
        if(!checkShortCodeLength(shortCode)){
            return res.json({success:false,message:"Length of the shortcode do not exist 15"});
        }
        if(!checkValidShortCode(shortCode)){
            return res.json({success:false,message:"Only _ and - special Characters Are Allowed"})
        }
        const isShortCode=await db.collection("urls").findOne({shortCode});
        if(isShortCode){
            return res.json({success:false,message: "Shortcode already exists ,Please Try Another" });
        }
        const result=await db.collection("urls").insertOne({
            longLink,
            shortCode,
        });
        res.json({ success:true,shortUrl: `https://url-shortner-ez48.onrender.com/${shortCode}`});
    }catch(err){
        console.error(err);
        return res.status(500).json({success:false,message:"Server Error"});
    }
};

function checkValidShortCode(shortCode){
    const validCode = /^[a-zA-Z0-9_-]+$/;
    return validCode.test(shortCode);

}
function checkShortCodeLength(shortCode){
    return shortCode.length <= 15;
 
}