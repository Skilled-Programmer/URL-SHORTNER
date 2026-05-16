async function getEmail(){
    try {
        const res=await fetch("/emailForVerify");
        const result=await res.json();
        if(!result.success){
            alert("there is some error");
            return window.location.href="/profile";
        }
        document.querySelector(".addEmail").textContent=`Email=${result.email}`;
    } catch (error) {
        
    }
}

getEmail();

const verifyNow=document.getElementById("verifyNow");
verifyNow.addEventListener("click",async ()=>{
    try {
        const res=await fetch("/generateOtp");
    } catch (error) {
        
    }
});

const verifyBtn=document.getElementById("verifyBtn");
verifyBtn.addEventListener("click",async()=>{
    const otp=document.getElementById("getOtp").value;
    
    try{
        const res=await fetch("/verify-otp",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({otp}), 
        });
        const result=await res.json();
        console.log(result);
        if(result.success){
            alert(result.message);
            return window.location.href="/profile";
        }else{
            alert(result.message);
        }

    }catch(err){
        console.error(err);
    }
}); 