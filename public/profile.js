const main=document.querySelector(".main");
async function getProfile() {
    try{
        const res=await fetch("/myprofile");
        const result=await res.json();
        if(!result.success){
            return alert(result.message);
        }
        renderProfileInfo(result.userDetail);
    }catch(Err){
        console.error(Err);
    }
}  

const renderProfileInfo=(userDetail)=>{
    const userFirstWord=userDetail.name[0];
    main.innerHTML=`
        <div class="header">
            <div class="logo">
                <p>${userFirstWord}</p>
            </div>
            <div class="profileData">
                <p class="name">${userDetail.name}</p>
                <p class="email">${userDetail.email}</p>
            </div>
        </div>
        <div class="analytics">
            <div class="linksCreated">
                <div class="linksCreatedNum">${userDetail.linkCreated}</div>
                <div class="linksCreatedText">LINK CREATED</div>
            </div>
            <div class="linksClicked">
                <div class="linksClickedNum">${userDetail.linkClicked}</div>
                <div class="linksClickedText">TOTAL CLICKED</div>
            </div>
        </div>
        <div class="emailVerify">
            <div class="emailVerifyText"><p>Email Verification:</p></div>
            <div class="isVerified"><p class="isVerify"></p></div>
            <div class="verifyBtn">
                <button id="verifyNow">Verify Now</button>
            </div>
        </div>
    `
    // let isVertify;
    // console.log("userdetail:",userDetail);
    if(!userDetail.isVerify){
        document.querySelector(".isVerify").classList.add("false");
        document.querySelector(".isVerify").textContent="Not Verifed";
        const verifyBtn=document.getElementById("verifyNow");
        verifyBtn.addEventListener("click",async ()=>{
            try {
               return window.location.href="/verifyEmailPage";
            } catch (error) {
        
            }
        });
    }else{
        document.querySelector(".isVerify").classList.add("true");
        document.querySelector(".isVerify").textContent="Verifed";
        document.querySelector(".verifyBtn").textContent='';
    }
}
getProfile();
document.getElementById("changePassBtn").addEventListener("click",()=>{
    return window.location.href="/changePassword";
})


