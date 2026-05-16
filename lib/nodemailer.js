import nodemailer from "nodemailer";
import { emailTimer } from "../controller/verifyEmai.controller.js";

const testAccount=await nodemailer.createTestAccount();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "hubert.smitham@ethereal.email",
    pass: "mtGvMm4P86eWWVRuEr",
  },
});

// export const sendEmail=async({to,subject,html})=>{
//     const isSend=await transporter.sendMail({
//         from:`URLS HORTNER ${testAccount.user}`,
//         to,
//         subject,
//         html,
//     });
//     const mail=nodemailer.getTestMessageUrl(isSend);
//     console.log("veirfy email:",mail);
//     if(mail){
//     //  emailTimer();
//      return true;
//     }
// } 


    