import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDb from "./db.js";
// import {getDb} from "./db.js";
import { authRoute } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { verifyAuthentication } from "./middleware/verify-auth.middleware.js";
import { saveLink } from "./controller/shortLink.controller.js";
import { getShortcode } from "./controller/getShortLink.contoller.js";
import urlDb from "./models/shortLinkSchema.js";
dotenv.config();
const app=express();
app.use(cookieParser());
await connectDb();
// app.use(express.json());
const PORT=process.env.PORT;
app.use(express.json());

app.use(express.static("public"));
app.use(verifyAuthentication);
app.use((req,res,next)=>{
    res.locals.user=req.user;
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
app.get("/signin",(req,res)=>{
    if(!req.user){
        console.log("details=>",req.user);
        console.log("login page");
        const loginPath=path.join(import.meta.dirname,"public","login.html");
        return res.sendFile(loginPath);
    }
    return res.redirect("/profile");
});
app.get("/profile",(req,res)=>{
    if(!req.user){
        return res.redirect("/signin");
    }
    const profilePage=path.join(import.meta.dirname,"public","profile.html");
    return res.sendFile(profilePage);
});
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
        console.log(shortCodeData);
        if(!shortCodeData){
           return res.status(404).sendFile(errorPage404);
        }
        if (!/^https?:\/\//.test(shortCodeData.longLink)) {
          return res.status(400).send("Invalid URL");
        }
        console.log("Redirect:", shortCode, "→", shortCodeData.longLink);
        res.redirect(shortCodeData.longLink);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});
app.listen(PORT,()=>{
    console.log(`surver running on port number ${PORT}`);
});