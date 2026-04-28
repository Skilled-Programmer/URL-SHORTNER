import { Router } from "express";
import { logging, registeration } from "../controller/auth.controller.js";
import { getProfileData, removeToken } from "../services/auth.service.js";
import { deleteSc } from "../controller/deleteShortCode.controller.js";
import { verifyAuthentication } from "../middleware/verify-auth.middleware.js";


const route=Router();

route.post("/register",registeration);
route.post("/login",logging);
route.get("/myprofile",getProfileData);
route.get("/logout",removeToken);
route.delete("/delete/:clickedShortCode",deleteSc);
export const authRoute=route;