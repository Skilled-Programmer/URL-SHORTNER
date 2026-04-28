const inputs=document.querySelectorAll("input");
const notification=document.querySelector(".notification");
const notify=document.getElementById("notify");

loginForm.addEventListener("submit",async(e)=>{
    document.querySelector("#loginBtn").textContent="Logging";
    e.preventDefault();
    let formData=new FormData(e.target);
    formData=Object.fromEntries(formData);
    try {
        const res=await fetch("/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData),
        });
        const data=await res.json();
        if(!data.success){
            document.querySelector("#loginBtn").textContent="Log In";
            showPopup(data.message);
        } 
        if(data.success){
            window.location.href="/profile";
        }
    } catch (error) {
        console.log(error);
    }
        
    
});

function showPopup(message){
    notification.classList.add("active");
    notify.textContent=message;
}
inputs.forEach((input)=>{
    input.addEventListener("focus",()=>{
        notification.classList.remove("active");
        notify.textContent="";   
    });
});

