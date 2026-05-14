import { Router } from "express";
import { logging, registeration } from "../controller/auth.controller.js";
import {removeToken } from "../services/auth.service.js";
import { deleteSc } from "../controller/deleteShortCode.controller.js";
import { verifyAuthentication } from "../middleware/verify-auth.middleware.js";
import { getShortCode, updateData } from "../controller/update.controller.js";
import { getProfileData } from "../controller/profile.controller.js";
import { changePass } from "../controller/changePass.controller.js";
import { generateOtp, getEmail, verifyOtp, } from "../controller/verifyEmai.controller.js";



const route=Router();

route.post("/register",registeration);
route.post("/login",logging);
route.get("/myprofile",getProfileData);
route.get("/logout",removeToken);
route.delete("/delete/:clickedShortCode",deleteSc);
route.get("/getShortCode/:url",getShortCode);
route.post("/updateLinks",updateData);
route.post("/changePass",changePass);
route.get("/emailForVerify",getEmail);
route.get("/generateOtp",generateOtp);
route.post("/verify-otp",verifyOtp);
export const authRoute=route;   