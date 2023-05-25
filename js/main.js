$(".theme-changer-btn").click(function(){
    $("body").toggleClass("light-theme");
    //animations();
});



const tl = gsap.timeline({defaults: {duration: 0.7, ease: "power1.out"}})


animations=()=>{
    tl.fromTo('.location-name', {opacity: 0, y:-100}, {opacity: 1, y:0})
    tl.fromTo('.current-outer', {opacity: 0, y:-100}, {opacity: 1, y:0})
    
}
