const passwordInput=document.getElementById("password");

passwordInput.addEventListener("input",()=>{
    const value=passwordInput.value;
    const upperCase=/[A-Z]/.test(value);
    const lowerCase=/[a-z]/.test(value);
    const specialCharacter=/[!@#$%^&*()[\]{}+_=/<>?.,:~|-]/.test(value);
    const hasNumber=/\d/.test(value);
    const length=value.length>=10;
    updatePasswordValidUi("uppercase",upperCase);
    updatePasswordValidUi("lowercase",lowerCase);
    updatePasswordValidUi("hasNumber",hasNumber);
    updatePasswordValidUi("specialChar",specialCharacter);
    updatePasswordValidUi("length",length);
    
});
function updatePasswordValidUi(id,condition){
    const targetId=document.getElementById(id);
    if(condition){
        targetId.classList.replace("invalid","valid");
    }else if(!condition){
        targetId.classList.replace("valid","invalid");
    }
}
signUp.addEventListener("submit",async(e)=>{
    e.preventDefault();
    document.querySelector("#registerBtn").textContent="Registering"
    let formData=new FormData(e.target);
    formData=Object.fromEntries(formData);
    try {
        const res=await fetch("/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData),
        });
        const data=await res.json();
        // alert(data.message);
        if(!data.success){
            document.querySelector("#registerBtn").textContent="Sign Up"
            return showPopup(data.success,data.message);
        }
        if(data.success){
            showPopup(data.success,data.message);
            setTimeout(() => {
                return window.location.href="/signin";
            }, 2000);
            
        }
    } catch (error) {
        console.log(error);
    }
});

const inputs=document.querySelectorAll("input");
const notification=document.querySelector(".notification");
const notify=document.getElementById("notify");


function showPopup(validation,message){
    if(validation){
        notification.classList.add("valid");
    }else{
        notification.classList.add("invalid");
    }
    notify.textContent=message;
}
inputs.forEach((input)=>{
    input.addEventListener("focus",()=>{
        notification.classList.remove("invalid");
        notify.textContent="";   
    });
});