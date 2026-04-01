import express from "express";
import path from "path";
import dotenv from "dotenv";
import {saveLink} from "./urlController.js";
import {connectDb} from "./db.js";
import {getDb} from "./db.js";
dotenv.config();
const app=express();
app.use(express.json());
const PORT=process.env.PORT;
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
const errorPage404=path.join(import.meta.dirname,"public","errorPage404.html")
await connectDb();
app.get("/favicon.ico", (req, res) => res.status(204));
app.post("/shorten",saveLink);
app.get("/:shortCode",async (req,res)=>{
    let db=getDb();
    const shortCode = req.params.shortCode;
    let getUrl=await db.collection("urls").findOne({shortCode:shortCode});
    
    if (!getUrl) {
      return res.status(404).sendFile(errorPage404);
    }
    console.log(getUrl.longLink);
    res.redirect(getUrl.longLink);

});
app.listen(PORT,()=>{
    console.log(`surver running on port number ${PORT}`);
});