/* ==========================================
   PROJECT M V4
   SCRIPT.JS — PART 1
   Password • Lock • Music • Story DB
========================================== */

const PASSWORD = "19L41A0529V";

/* ---------- STORY DATABASE ---------- */
/* NEE STORIES IKKADE RAYI */

const MEMORY = {
  id: "M001",
  title: "FIRST MEET",

  stories: [

`MADAM`,

`KANNA`,

`AMMU`

  ]
};

/* ---------- ELEMENTS ---------- */

const loginPage = document.getElementById("loginPage");
const memoryPage = document.getElementById("memoryPage");

const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");

const errorText = document.getElementById("errorText");
const secondHint = document.getElementById("secondHint");

const lockBox = document.getElementById("lockBox");
const countdown = document.getElementById("countdown");

const titleEl = document.getElementById("incidentTitle");

const storyEls = [
 document.getElementById("story1"),
 document.getElementById("story2"),
 document.getElementById("story3")
];

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

/* ---------- LOAD TEXT ---------- */

titleEl.innerText = MEMORY.title;

storyEls.forEach((el,i)=>{
 el.innerText = MEMORY.stories[i] || "";
});

/* ---------- LOCK SYSTEM ---------- */

let playing = false;

window.addEventListener("load",()=>{

 checkLock();

});

unlockBtn.addEventListener("click",unlockMemory);

passwordInput.addEventListener("keydown",(e)=>{

 if(e.key==="Enter") unlockMemory();

});

function unlockMemory(){

 const lock = Number(localStorage.getItem("PM_LOCK"));

 if(lock && Date.now()<lock){

   showLock(lock);
   return;

 }

 let tries = Number(localStorage.getItem("PM_TRIES")) || 0;

 if(passwordInput.value===PASSWORD){

   localStorage.setItem("PM_TRIES","0");

   loginPage.classList.add("hidden");

   memoryPage.classList.remove("hidden");

   memoryPage.classList.add("fadeIn");

   fadeMusic();

   return;

 }

 tries++;

 localStorage.setItem("PM_TRIES",tries);

 if(tries===1){

   errorText.innerText="Wrong Password";

 }else{

   secondHint.classList.remove("hidden");

   const next = tomorrow729();

   localStorage.setItem("PM_LOCK",next);

   showLock(next);

 }

}

function tomorrow729(){

 const d = new Date();

 d.setDate(d.getDate()+1);

 d.setHours(19,29,0,0);

 return d.getTime();

}

function checkLock(){

 const lock = Number(localStorage.getItem("PM_LOCK"));

 if(!lock) return;

 if(Date.now()>=lock){

   localStorage.removeItem("PM_LOCK");
   localStorage.removeItem("PM_TRIES");

   return;

 }

 showLock(lock);

}

function showLock(time){

 lockBox.classList.remove("hidden");

 updateTimer(time);

 setInterval(()=>{

   updateTimer(time);

 },1000);

}

function updateTimer(time){

 const diff = time-Date.now();

 if(diff<=0){

   countdown.innerText="Unlocked";
   return;

 }

 const h=Math.floor(diff/3600000);
 const m=Math.floor((diff%3600000)/60000);
 const s=Math.floor((diff%60000)/1000);

 countdown.innerText=`${h}h ${m}m ${s}s`;

}

/* ---------- MUSIC ---------- */

music.volume=0;

musicBtn.addEventListener("click",()=>{

 if(!playing){

   music.play().catch(()=>{});

   playing=true;

   musicBtn.innerText="❚❚";

 }else{

   music.pause();

   playing=false;

   musicBtn.innerText="♫";

 }

});

function fadeMusic(){

 let v=0;

 music.play().catch(()=>{});

 const fade=setInterval(()=>{

   v+=0.02;

   music.volume=Math.min(v,0.45);

   if(v>=0.45){

     playing=true;

     musicBtn.innerText="❚❚";

     clearInterval(fade);

   }

 },120);

}

/* ---------- AMBIENT DUST ---------- */

const ambientCanvas=document.getElementById("ambientDust");
const actx=ambientCanvas.getContext("2d");

function resizeAmbient(){

 ambientCanvas.width=window.innerWidth;
 ambientCanvas.height=window.innerHeight;

}

resizeAmbient();

window.addEventListener("resize",resizeAmbient);

const ambient=[];

for(let i=0;i<180;i++){

 ambient.push({

   x:Math.random()*ambientCanvas.width,
   y:Math.random()*ambientCanvas.height,

   r:Math.random()*2.2+0.5,

   vx:(Math.random()-0.5)*0.15,
   vy:Math.random()*0.35+0.05,

   a:Math.random()*0.45+0.08

 });

}

function animateAmbient(){

 actx.clearRect(0,0,ambientCanvas.width,ambientCanvas.height);

 ambient.forEach(p=>{

   p.x+=p.vx;
   p.y-=p.vy;

   if(p.y<-10){

     p.y=ambientCanvas.height+10;
     p.x=Math.random()*ambientCanvas.width;

   }

   if(p.x<0) p.x=ambientCanvas.width;
   if(p.x>ambientCanvas.width) p.x=0;

   actx.beginPath();

   actx.fillStyle=`rgba(245,225,180,${p.a})`;

   actx.arc(p.x,p.y,p.r,0,Math.PI*2);

   actx.fill();

 });

 requestAnimationFrame(animateAmbient);

}

animateAmbient();

/* ===== PART 2 CONTINUES FROM HERE ===== */
/* ==========================================
   PROJECT M V4
   SCRIPT.JS — PART 2 (CONTINUATION)
   Dust Reveal • Particles • Save Progress
========================================== */

const canvases=[
 document.getElementById("dust1"),
 document.getElementById("dust2"),
 document.getElementById("dust3")
];

const particles=[];

/* ---------- INIT EACH STORY ---------- */

canvases.forEach((canvas,index)=>{

 const ctx=canvas.getContext("2d");

 const W=1200,H=420;

 canvas.width=W;
 canvas.height=H;

 // Dust layer
 for(let i=0;i<42000;i++){
   ctx.fillStyle=`rgba(118,93,66,${Math.random()*0.22+.08})`;
   ctx.fillRect(
     Math.random()*W,
     Math.random()*H,
     Math.random()*2+.5,
     Math.random()*2+.5
   );
 }

 ctx.globalCompositeOperation="destination-out";

 // Load previous reveal
 const key=`PM_${MEMORY.id}_${index}`;
 const saved=localStorage.getItem(key);

 if(saved){
   const img=new Image();
   img.onload=()=>{
     ctx.clearRect(0,0,W,H);
     ctx.drawImage(img,0,0,W,H);
     ctx.globalCompositeOperation="destination-out";
   };
   img.src=saved;
 }

 function reveal(x,y){

   for(let i=0;i<18;i++){

     const a=Math.random()*Math.PI*2;
     const d=Math.random()*35;

     const px=x+Math.cos(a)*d;
     const py=y+Math.sin(a)*d;

     const g=ctx.createRadialGradient(px,py,0,px,py,20);

     g.addColorStop(0,"rgba(0,0,0,1)");
     g.addColorStop(.6,"rgba(0,0,0,.45)");
     g.addColorStop(1,"rgba(0,0,0,0)");

     ctx.fillStyle=g;
     ctx.beginPath();
     ctx.arc(px,py,20,0,6.28);
     ctx.fill();
   }

 }

 function burst(x,y){

   for(let i=0;i<14;i++){
     particles.push({
       x,y,
       vx:(Math.random()-.5)*3,
       vy:-(Math.random()*2+1),
       r:Math.random()*2+1,
       a:1,
       canvas
     });
   }

 }

 function save(){
   localStorage.setItem(key,canvas.toDataURL("image/png"));
 }

 function pointer(clientX,clientY){
   const r=canvas.getBoundingClientRect();
   return {
     x:(clientX-r.left)*(W/r.width),
     y:(clientY-r.top)*(H/r.height)
   };
 }

 canvas.addEventListener("mousemove",e=>{
   if(e.buttons!==1)return;
   const p=pointer(e.clientX,e.clientY);
   reveal(p.x,p.y);
   burst(p.x,p.y);
 });

 canvas.addEventListener("mouseup",save);

 canvas.addEventListener("touchmove",e=>{
   e.preventDefault();
   const t=e.touches[0];
   const p=pointer(t.clientX,t.clientY);
   reveal(p.x,p.y);
   burst(p.x,p.y);
 },{passive:false});

 canvas.addEventListener("touchend",save);

});

/* ---------- PARTICLE ENGINE ---------- */

function animateParticles(){

 canvases.forEach(c=>{
   const ctx=c.getContext("2d");

   particles.forEach((p,i)=>{

     if(p.canvas!==c)return;

     ctx.save();
     ctx.globalCompositeOperation="source-over";
     ctx.fillStyle=`rgba(205,180,140,${p.a})`;
     ctx.beginPath();
     ctx.arc(p.x,p.y,p.r,0,6.28);
     ctx.fill();
     ctx.restore();

     p.x+=p.vx;
     p.y+=p.vy;
     p.vy+=0.03;
     p.a-=0.02;

     if(p.a<=0)particles.splice(i,1);

   });

 });

 requestAnimationFrame(animateParticles);

}

animateParticles();

/* ---------- QR SUPPORT ---------- */

const params=new URLSearchParams(location.search);

if(params.get("id")){
 console.log("Incident:",params.get("id"));
}