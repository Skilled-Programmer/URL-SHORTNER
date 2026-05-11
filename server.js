import express from "express";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import connectDb from "./db.js";
// import {getDb} from "./db.js";
import { authRoute } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { getRefreshToken, verifyAuthentication } from "./middleware/verify-auth.middleware.js";
import { saveLink } from "./controller/shortLink.controller.js";
import { getShortcode } from "./controller/getShortLink.contoller.js";
import urlDb from "./models/shortLinkSchema.js";
import { handelRefreshToken } from "./controller/refreshAccessToken.controller.js";
import userDb from "./models/userSchema.js";
dotenv.config();
const app=express();
app.use(cookieParser());
await connectDb();
// app.use(express.json());
const PORT=process.env.PORT;
app.use(express.json());

app.use(express.static("public"));
app.use(verifyAuthentication);
// app.use(getRefreshToken);
app.use((req,res,next)=>{
    res.locals.user=req.user;
    return next();
});
app.use((req,res,next)=>{
    res.locals.refreshToken=req.refreshToken;
    return next();
});
app.use(authRoute);

app.use(express.urlencoded({extended:true}));

const errorPage404=path.join(import.meta.dirname,"public","errorPage404.html")

app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/",(req,res)=>{
    if(req.user){
        return res.redirect("/profile");
    }
    return res.redirect("/signin");
})
app.get("/home",(req,res)=>{
    if(!req.user){
        return res.redirect("/signin");
    }
    const homePage=path.join(import.meta.dirname,"public","home.html");
    return res.sendFile (homePage);
});
app.get("/signup",(req,res)=>{
    const registerPath=path.join(import.meta.dirname,"public","register.html");
    return res.sendFile(registerPath);
});
app.get("/signin",async (req,res)=>{
    console.log("req.user",req.user);
    if(!req.user){
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken){
            const loginPage=path.join(import.meta.dirname,"public","login.html");
            return res.sendFile(loginPage);
        }
        const handel=await handelRefreshToken(refreshToken,res);
        if(handel){
     
            const profilePage=path.join(import.meta.dirname,"public","profile.html");
            return res.sendFile(profilePage);
        }else{
            const loginPage=path.join(import.meta.dirname,"public","login.html");
            return res.sendFile(loginPage);
 
        }
    }
    return res.redirect("/profile");
});

app.get("/profile",async (req,res)=>{
    // console.log(req.user);
    if(!req.user){
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken){
            return res.redirect("/signin");
        }
        const handel=await handelRefreshToken(refreshToken,res);
        if(handel){
            // console.log("handel:",handel);
            const profilePage=path.join(import.meta.dirname,"public","profile.html");
            return res.sendFile(profilePage);
        }else{
            return res.redirect("/signin");
        }
    }
    const profilePage=path.join(import.meta.dirname,"public","profile.html");
    return res.sendFile(profilePage);
    
});
app.get("/changePassword",async (req,res)=>{
    const changePass=path.join(import.meta.dirname,"public","changePass.html");
    return res.sendFile(changePass);
})
app.get("/error404",(req,res)=>{
    return res.sendFile(errorPage404);
})

app.post("/shorten",saveLink);

app.get("/shortCode",getShortcode);
app.get("/:shortCode",async (req,res)=>{
    try {
        const shortCode = req.params.shortCode;
        if (!shortCode || shortCode.length > 15) {
           return res.status(400).send("Invalid shortcode");
        }

        const validCode = /^[a-zA-Z0-9_-]+$/.test(shortCode);
        if (!validCode) {
           return res.status(400).send("Invalid shortcode");
        }
        const shortCodeData=await urlDb.findOne({shortCode}).lean();
        if(!shortCodeData){
           return res.status(404).sendFile(errorPage404);
        }
            if (!/^https?:\/\//.test(shortCodeData.longLink)) {
            return res.status(400).send("Invalid URL");
            }

        const id=req.user.id;
        const userDetail=await userDb.findOne({_id:req.user.id});
        let linkClicked=userDetail.linkClicked;
        linkClicked=parseInt(linkClicked);
        linkClicked+=1;
        linkClicked=linkClicked.toString();
        const updateClick=await userDb.findByIdAndUpdate(
            id,
            {linkClicked},
        )
        res.redirect(shortCodeData.longLink);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});
app.get("/update/:url",async(req,res)=>{
    const updatePage=path.join(import.meta.dirname,"public","update.html");
    return res.sendFile(updatePage);
});
app.listen(PORT,()=>{
    console.log(`surver running on port number ${PORT}`);
});