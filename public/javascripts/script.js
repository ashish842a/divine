document.querySelector(".nav #close").addEventListener("click",function(){
    document.querySelector(".nav").style.width="0%";
    document.querySelector(".nav .nav_content").style.display="none"; 
    document.querySelector(".nav #close").style.display="none"; 
    document.querySelector("#menu").style.opacity="1";
})

document.querySelector("#menu").addEventListener("click",function(){
    document.querySelector(".nav").style.width="450px";
    document.querySelector("#menu").style.opacity="0";
    setTimeout(() => {
        document.querySelector(".nav .nav_content").style.display="block";
    document.querySelector(".nav #close").style.display="initial"; 
}, 500);
})


// document.querySelector("#act").addEventListener("click",function(){
//     console.log("click");
//     document.querySelector("#bookTable").style.display="initial";
// })