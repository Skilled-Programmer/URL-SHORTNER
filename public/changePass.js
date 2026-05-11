document.getElementById("inputForm").addEventListener("submit",async (e)=>{
    e.preventDefault();
    let formData=new FormData(e.target);
    formData=Object.fromEntries(formData);
    try {
        const res=await fetch("/changePass",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData),
        });
        const result=await res.json();
        if(!result.success){
            return alert(result.message);
        }else{
            return alert(result.message);
        }
    } catch (error) {
        
    }
});
const newPass=document.getElementById("newPass");
newPass.addEventListener("input",()=>{
    const inputPass=newPass.value;
    const upperCase=/[A-Z]/.test(inputPass);
    const lowerCase=/[a-z]/.test(inputPass);
    const specialCharacter=/[!@#$%^&*()[\]{}+_=/<>?.,:~|-]/.test(inputPass);
    const hasNumber=/\d/.test(inputPass);
    const length=inputPass.length>=10;
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