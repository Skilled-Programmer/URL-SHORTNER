import {MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const client=new MongoClient(process.env.MONGO_URI);

let db;
export const connectDb=async (req,res)=>{
    try{
        await client.connect();
        console.log("database connected");
        db=client.db(process.env.dbName);
    }catch(err){
        console.error(err);
    }
}

export const getDb=()=> db;