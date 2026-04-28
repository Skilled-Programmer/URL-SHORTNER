const inputs=document.querySelectorAll("input");
const notification=document.querySelector(".notification");
const notify=document.getElementById("notify");

loginForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    let formData=new FormData(e.target);
    formData=Object.fromEntries(formData);
    // console.log(formData);
    try {
        const res=await fetch("https://url-shortner-ez48.onrender.com/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData),
        });
        const data=await res.json();
        console.log(data);
        if(!data.success){
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
    console.log(notification.classList);
    notify.textContent=message;
}
inputs.forEach((input)=>{
    input.addEventListener("focus",()=>{
        // console.log(notification);
        notification.classList.remove("active");
        notify.textContent="";   
    });
});

