import mongoose from "mongoose";

const connectDb=async ()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/urlShortner");
    } catch (error) {
        console.error(error);
    }
}

export default connectDb;