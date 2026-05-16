// import express, from "express";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// const app = express();
const resend = new Resend(process.env.resend_api_key);


export const sendEmail=async({to,subject,html})=>{
     const { isSend, error }=await resend.emails.send({
        from:"Acme <onboarding@resend.dev>",
        to,
        subject,
        html,
    });
    if (error) {
    return false;
  }
    console.log(isSend);
    return true;
} 
