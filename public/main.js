
document.getElementById("getFormData").addEventListener("submit",async (e)=>{
    const btn = document.querySelector("#getLinks");
    btn.disabled = true;
    btn.innerText = "Processing...";
    e.preventDefault();
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
        displayShortUrl(result.shortUrl);
    }
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Try again.");
        btn.disabled = false;
        btn.innerText = "Shorten";
    }
});
function displayShortUrl(shortUrl){
    const li=document.createElement("li");
    const a=document.createElement("a");
    a.href=shortUrl;
    a.textContent=shortUrl;
    a.target = "_blank";
    li.appendChild(a);
    document.querySelector(".shortedLinks").appendChild(li);
}
