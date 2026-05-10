import urlDb from "../models/shortLinkSchema.js";
export const getShortCode=async(req,res)=>{
    // console.log(window.origin);
    const shortCode=req.params.url;
    const getData=await urlDb.findOne({shortCode});
    return res.json({success:true,getData});
}

export const updateData=async (req,res)=>{
    const id=req.body.id;
    const longLink=req.body.longLink;
    const shortCode=req.body.shortCode;
    // let getId=await getShortCodeId(shortCode);
    // getId=getId.toString();
    const update=await urlDb.findByIdAndUpdate(
        id,
        {longLink,shortCode},
    );
    return res.status(200).json({success:true,message:"Updated Succefully"});
}





// const getShortCodeId=async(shortCode)=>{
//     let data=await urlDb.findOne({shortCode});
//     console.log(data);
//     data=data._id;
//     // console.log("data",data);
//     return data;
// }