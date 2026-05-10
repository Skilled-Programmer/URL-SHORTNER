import { Router } from "express";
import { logging, registeration } from "../controller/auth.controller.js";
import {removeToken } from "../services/auth.service.js";
import { deleteSc } from "../controller/deleteShortCode.controller.js";
import { verifyAuthentication } from "../middleware/verify-auth.middleware.js";
import { getShortCode, updateData } from "../controller/update.controller.js";
import { getProfileData } from "../controller/profile.controller.js";



const route=Router();

route.post("/register",registeration);
route.post("/login",logging);
route.get("/myprofile",getProfileData);
route.get("/logout",removeToken);
route.delete("/delete/:clickedShortCode",deleteSc);
route.get("/getShortCode/:url",getShortCode);
route.post("/updateLinks",updateData);
export const authRoute=route;   