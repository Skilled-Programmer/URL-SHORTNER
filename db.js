import {MongoClient} from "mongodb";

const client=new MongoClient("mongodb://localhost:27017/");

let db;
export const connectDb=async (req,res)=>{
    try{
        await client.connect();
        console.log("database connected");
        db=client.db("urlShortner");
    }catch(err){
        console.error(err);
    }
}

export const getDb=()=> db;