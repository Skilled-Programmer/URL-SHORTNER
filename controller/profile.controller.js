import userDb from "../models/userSchema.js"
export const getProfileData=async (req,res)=>{
    const userId=req.user.id;
    const userDetail=await userDb.findOne({_id:userId});
    // console.log(userDetail);
    if(!userDetail){
        return res.json({success:false,message:"There Is Some Error To Get Profile Info"});
    }
    return res.json({success:true,userDetail,message:"Succefull"});
}