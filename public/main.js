
const container = document.querySelector(".shortedLinks");
let deleteBtn;

document.getElementById("getFormData").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const btn = document.querySelector("#getLinks");
    btn.disabled = true;
    btn.innerText = "Processing...";
    
    const formData=new FormData(e.target);
    const data=Object.fromEntries(formData);

    try {
        const res=await fetch("/shorten",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    const result=await res.json();
    if(!result.success){``
        btn.disabled = false;
        btn.innerText = "Shorten";
        alert(result.message);
    }
    if((result.success)){
        btn.disabled = false;
        btn.innerText = "Shorten";
        getLinks();
    }
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Try again.");
        btn.disabled = false;
        btn.innerText = "Shorten";
    }
});
const getLinks=async()=>{
    
    try{
        const res=await fetch("/shortCode");

        const result=await res.json();
        if(!result.success){
            container.innerHTML="<p>Failed to fetch links</p>";
            return;
        }

        displayShortUrl(result.data);
    }catch(err){
        console.log(err);
    }
    
}
const displayShortUrl=(links)=>{
    if(links.length===0){
        container.classList.add("noShortLink");
        container.innerHTML="<p>No links created yet</p>";
        return;
    }
    container.classList.remove("noShortLink")
    container.innerHTML = "";
    links.forEach(link => {

        const li=document.createElement("li");
        const a=document.createElement("a");
        const buttonDiv=document.createElement("div");
        const copyButton=document.createElement("Button");
        const deleteButton=document.createElement("Button");
        const editButton=document.createElement("Button");
        
        a.href=window.location.origin+"/"+link.shortCode;
        a.textContent=window.location.origin+"/"+link.shortCode;        
        a.target = "_blank";
        buttonDiv.classList.add("linksButton");
        copyButton.textContent="Copy"
        copyButton.classList.add("copyBtn");
        copyButton.dataset.url=window.location.origin+"/"+link.shortCode;
        editButton.textContent="Edit";
        editButton.classList.add("editBtn");
        editButton.dataset.url=link.shortCode;
        deleteButton.textContent="Delete";
        deleteButton.classList.add("deleteBtn");
        deleteButton.dataset.code=link.shortCode;
        li.appendChild(a);
        li.appendChild(buttonDiv);
        buttonDiv.appendChild(copyButton);
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(deleteButton);
        
        container.appendChild(li);
        deleteBtn=document.querySelectorAll(".deleteBtn");
    });
}

getLinks();
document.addEventListener("click",async (e) => {
    if (e.target.classList.contains("deleteBtn")) {
        const btn= e.target;
        btn.disabled=true;
        const clickedShortCode= e.target.dataset.code;
        try{
            const res=await fetch(`/delete/${clickedShortCode}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                },
            });
            const result=await res.json();
            if(result.success){
                // return getLinks();
                const li = e.target.closest("li");
                if (li) li.remove();
            }else{
                if(result.message=="Unauhorized"){
                   return window.location.href="/signin";
                }
                btn.disabled=false;
                throw new Error("server error");
            }
            
        }catch(error){
            console.error(error);
        }
    }
});
document.addEventListener("click",async (e)=>{
    if(e.target.classList.contains("copyBtn")){
        const url=e.target.dataset.url;

        try{
            await navigator.clipboard.writeText(url);
            e.target.innerText="Copyied";
            setTimeout(() => {
                e.target.innerText="Copy";
            }, 1500);
        }catch(error){
            alert("Copy Failed Please TryAgain");
            console.error(error);

        }
    }
});



// const editBtn=document.querySelectorAll(".editBtn");
// editBtn.forEach(editButton=>{
//     editButton.addEventListener("click",()=>{
//         console.log("hello");
//     });
// });
document.addEventListener("click",async(e)=>{
    if(e.target.classList.contains("editBtn")){
        const url=e.target.dataset.url;
        return window.location.href=`/update/${url}`;
    }
});