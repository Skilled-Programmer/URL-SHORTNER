import mongoose from "mongoose";


const shortLinkSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    longLink:{type:String},
    shortCode:{type:String},
    createdAt:{type:Date,default:Date.now},
});

const urlDb=mongoose.model("url",shortLinkSchema);
export default urlDb;

await mongoose.connection.close();