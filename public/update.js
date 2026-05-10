const editBtn=document.querySelectorAll(".editBtn");
const longLink=document.getElementById("longLink");
const shortCode=document.getElementById("shortCode");
const updateData=document.getElementById("updateData");
const getLinksBtn=document.getElementById("getLinks");
const inputs=document.querySelectorAll("input");
const currentPath=window.location.pathname;
const getShortCode=currentPath.split("/");
const url=getShortCode[getShortCode.length-1];
// console.log(url);
let id;
async function updateLinks() {
    try{
        const res=await fetch(`/getShortCode/${url}`);
        const result=await res.json();
        if(result.success){
            id=result.getData._id;
            return updateLinksUi(result.getData);
        }
    }catch(err){
        console.error(err);
    }
}

const updateLinksUi=async (newLinks)=>{

    longLink.value=newLinks.longLink;
    shortCode.value=newLinks.shortCode;
}
updateData.addEventListener("submit",async (e)=>{

    e.preventDefault();
    getLinksBtn.textContent="Updating";
    // console.log(id);
    let formData=new FormData(e.target);
    formData=Object.fromEntries(formData);
    formData.id=id;
    // console.log(formData);
    try{
        const res=await fetch("/updateLinks",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(formData),
        });
        const result=await res.json();
        console.log(result);
        if(result.success){
            alert(result.message);
            getLinksBtn.textContent="Update";
            return window.location.href="/home";
        }else{
            getLinksBtn.textContent="Update";
            alert('There Is Something Wrong Try Again');
            return window.location.href="/home";
        }
    }catch(err){
        console.log(err);
    }
}); 

updateLinks();
