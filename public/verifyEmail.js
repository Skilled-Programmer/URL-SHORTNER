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