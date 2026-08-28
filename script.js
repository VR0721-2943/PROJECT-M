// =========================================
// PROJECT M - SCRIPT.JS PART 1
// Password + Lock + Ambient Dust
// =========================================

const PASSWORD = "19L41AO529V19L41A0543R";

const loginPage = document.getElementById("loginPage");
const memoryPage = document.getElementById("memoryPage");

const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");

const errorText = document.getElementById("errorText");
const secondHint = document.getElementById("secondHint");

const lockPanel = document.getElementById("lockPanel");
const countdown = document.getElementById("countdown");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

// ------------------------------
// CHECK EXISTING LOCK
// ------------------------------

checkExistingLock();

function checkExistingLock(){

    const lock = Number(localStorage.getItem("pm_lock"));

    if(!lock) return;

    if(Date.now() >= lock){

        localStorage.removeItem("pm_lock");
        localStorage.removeItem("pm_try");

        return;
    }

    showLock(lock);

}

// ------------------------------
// PASSWORD BUTTON
// ------------------------------

unlockBtn.addEventListener("click",()=>{

    const lock = Number(localStorage.getItem("pm_lock"));

    if(lock && Date.now() < lock){

        showLock(lock);

        return;
    }

    let tries =
    Number(localStorage.getItem("pm_try")) || 0;

    if(passwordInput.value === PASSWORD){

        localStorage.setItem("pm_try",0);

        loginPage.classList.add("hidden");
        memoryPage.classList.remove("hidden");

        memoryPage.classList.add("fadeIn");

        music.play().catch(()=>{});

        return;
    }

    tries++;

    localStorage.setItem("pm_try",tries);

    if(tries === 1){

        errorText.innerText = "Wrong Password";

    }else{

        secondHint.classList.remove("hidden");

        const next = tomorrow729();

        localStorage.setItem("pm_lock",next);

        showLock(next);

    }

});

// ------------------------------
// TOMORROW 7:29 PM
// ------------------------------

function tomorrow729(){

    let d = new Date();

    d.setDate(d.getDate()+1);

    d.setHours(19,29,0,0);

    return d.getTime();

}

// ------------------------------
// SHOW LOCK PANEL
// ------------------------------

function showLock(time){

    lockPanel.classList.remove("hidden");

    errorText.innerText = "";

    updateCountdown(time);

    setInterval(()=>{

        updateCountdown(time);

    },1000);

}

function updateCountdown(time){

    const diff = time - Date.now();

    if(diff<=0){

        countdown.innerText="Unlocked";

        return;
    }

    const h=Math.floor(diff/3600000);
    const m=Math.floor(diff%3600000/60000);
    const s=Math.floor(diff%60000/1000);

    countdown.innerText=
    `${h}h ${m}m ${s}s`;

}

// ------------------------------
// MUSIC
// ------------------------------

let playing=false;

musicBtn.addEventListener("click",()=>{

    if(!playing){

        music.play();

        playing=true;

        musicBtn.innerHTML="❚❚";

    }else{

        music.pause();

        playing=false;

        musicBtn.innerHTML="♫";

    }

});

// ------------------------------
// FLOATING AMBIENT DUST
// ------------------------------

const dustCanvas =
document.getElementById("ambientDust");

const dctx = dustCanvas.getContext("2d");

function resizeDust(){

    dustCanvas.width = innerWidth;
    dustCanvas.height = innerHeight;

}

resizeDust();

window.addEventListener("resize",resizeDust);

const ambient=[];

for(let i=0;i<120;i++){

    ambient.push({

        x:Math.random()*dustCanvas.width,
        y:Math.random()*dustCanvas.height,

        r:Math.random()*2+0.5,

        v:(Math.random()*0.3)+0.05,

        a:Math.random()*0.4+0.15

    });

}

function animateAmbient(){

    dctx.clearRect(
    0,0,
    dustCanvas.width,
    dustCanvas.height);

    ambient.forEach(p=>{

        p.y-=p.v;

        if(p.y<0){

            p.y=dustCanvas.height;

            p.x=Math.random()*dustCanvas.width;

        }

        dctx.beginPath();

        dctx.fillStyle=
        `rgba(255,235,180,${p.a})`;

        dctx.arc(
        p.x,p.y,p.r,
        0,Math.PI*2);

        dctx.fill();

    });

    requestAnimationFrame(animateAmbient);

}

animateAmbient();
// ==========================================
// PROJECT M - PART 2A
// REAL DUST ENGINE CORE
// ==========================================

const storyData = [
`Nee first memory story ikkada rayi.`,

`Second story ikkada rayi.`,

`Third story ikkada rayi.`
];

const canvases = document.querySelectorAll(".dustCanvas");
const textBlocks = document.querySelectorAll(".storyText");

canvases.forEach((canvas,index)=>{

    textBlocks[index].innerText = storyData[index];

    initDust(canvas);

});

function initDust(canvas){

    const ctx = canvas.getContext("2d");

    const W = 1400;
    const H = 500;

    canvas.width = W;
    canvas.height = H;

    // ---------- CREATE DUST LAYER ----------

    for(let i=0;i<45000;i++){

        const x = Math.random()*W;
        const y = Math.random()*H;

        const s = Math.random()*2+0.5;

        const a = Math.random()*0.28+0.08;

        ctx.fillStyle =
        `rgba(118,93,66,${a})`;

        ctx.fillRect(x,y,s,s);

    }

    // soft dust fog

    for(let i=0;i<120;i++){

        ctx.beginPath();

        ctx.fillStyle =
        `rgba(180,150,110,0.025)`;

        ctx.arc(
            Math.random()*W,
            Math.random()*H,
            Math.random()*90+30,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

    ctx.globalCompositeOperation = "destination-out";

    function reveal(px,py){

        const g = ctx.createRadialGradient(
            px,py,10,
            px,py,70
        );

        g.addColorStop(0,"rgba(0,0,0,1)");
        g.addColorStop(.35,"rgba(0,0,0,.85)");
        g.addColorStop(1,"rgba(0,0,0,0)");

        ctx.fillStyle = g;

        ctx.beginPath();

        ctx.arc(px,py,70,0,Math.PI*2);

        ctx.fill();

    }

    // ---------- MOUSE ----------

    canvas.addEventListener("mousemove",e=>{

        if(e.buttons!==1) return;

        const r = canvas.getBoundingClientRect();

        reveal(
            (e.clientX-r.left)*(W/r.width),
            (e.clientY-r.top)*(H/r.height)
        );

    });

    // ---------- TOUCH ----------

    canvas.addEventListener("touchmove",e=>{

        e.preventDefault();

        const t = e.touches[0];

        const r = canvas.getBoundingClientRect();

        reveal(
            (t.clientX-r.left)*(W/r.width),
            (t.clientY-r.top)*(H/r.height)
        );

    },{passive:false});

}
// ==========================================
// PROJECT M - PART 2B
// FLYING DUST PARTICLES
// ==========================================

const flyingDust = [];

function spawnFlyingDust(x, y){

    for(let i=0;i<12;i++){

        flyingDust.push({

            x:x,
            y:y,

            vx:(Math.random()-0.5)*3.5,
            vy:-(Math.random()*2.5+0.5),

            size:Math.random()*3+1,
            alpha:1

        });

    }

}

function updateFlyingDust(ctx){

    for(let i=flyingDust.length-1;i>=0;i--){

        const p=flyingDust[i];

        p.x+=p.vx;
        p.y+=p.vy;

        p.vy+=0.02;

        p.alpha-=0.018;

        if(p.alpha<=0){

            flyingDust.splice(i,1);
            continue;

        }

        ctx.save();

        ctx.globalCompositeOperation="source-over";

        ctx.fillStyle=
        `rgba(188,160,120,${p.alpha})`;

        ctx.beginPath();

        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);

        ctx.fill();

        ctx.restore();

    }

}

// -------- CONNECT WITH DUST REVEAL --------

canvases.forEach(canvas=>{

    function particleEvent(e){

        const r=canvas.getBoundingClientRect();

        const px=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
        const py=(e.touches?e.touches[0].clientY:e.clientY)-r.top;

        spawnFlyingDust(
            px*(canvas.width/r.width),
            py*(canvas.height/r.height)
        );

    }

    canvas.addEventListener("mousemove",e=>{
        if(e.buttons===1) particleEvent(e);
    });

    canvas.addEventListener("touchmove",particleEvent,{passive:false});

});

// -------- RENDER LOOP --------

function particleLoop(){

    canvases.forEach(canvas=>{

        const ctx=canvas.getContext("2d");

        updateFlyingDust(ctx);

    });

    requestAnimationFrame(particleLoop);

}

particleLoop();
// ==========================================
// PROJECT M - PART 2C
// REALISTIC BRUSH REVEAL
// ==========================================

function brushReveal(ctx, px, py){

    for(let i=0;i<14;i++){

        const angle=Math.random()*Math.PI*2;
        const dist=Math.random()*32;

        const x=px+Math.cos(angle)*dist;
        const y=py+Math.sin(angle)*dist;

        const r=Math.random()*18+10;

        const g=ctx.createRadialGradient(x,y,0,x,y,r);

        g.addColorStop(0,"rgba(0,0,0,1)");
        g.addColorStop(0.55,"rgba(0,0,0,.45)");
        g.addColorStop(1,"rgba(0,0,0,0)");

        ctx.fillStyle=g;

        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();

    }

}

// ---------- Replace reveal() ----------

canvases.forEach(canvas=>{

    const ctx=canvas.getContext("2d");

    function draw(e){

        const rect=canvas.getBoundingClientRect();

        const px=((e.touches?e.touches[0].clientX:e.clientX)-rect.left)*(canvas.width/rect.width);

        const py=((e.touches?e.touches[0].clientY:e.clientY)-rect.top)*(canvas.height/rect.height);

        brushReveal(ctx,px,py);
        spawnFlyingDust(px,py);

    }

    canvas.addEventListener("mousemove",e=>{
        if(e.buttons===1) draw(e);
    });

    canvas.addEventListener("touchmove",e=>{
        e.preventDefault();
        draw(e);
    },{passive:false});

});
// ==========================================
// PROJECT M - PART 2D
// REVEAL SAVE + MULTI INCIDENT SYSTEM
// ==========================================

// ---------- INCIDENT DATA ----------

const INCIDENT = {
  id: "M001",
  title: "FIRST MEET",

  stories: [
    `Nee first story ikkada rayi.`,

    `Second story ikkada rayi.`,

    `Third story ikkada rayi.`
  ]
};

// ---------- LOAD INCIDENT ----------

document.getElementById("incidentTitle").innerText =
  INCIDENT.title;

const textBlocks = document.querySelectorAll(".storyText");

textBlocks.forEach((block, i) => {
  block.innerText = INCIDENT.stories[i] || "";
});

// ---------- SAVE DUST ----------

function saveReveal(canvas, index) {
  const key = `${INCIDENT.id}_${index}`;
  localStorage.setItem(key, canvas.toDataURL("image/png"));
}

function loadReveal(canvas, index) {
  const key = `${INCIDENT.id}_${index}`;

  const data = localStorage.getItem(key);

  if (!data) return;

  const img = new Image();

  img.onload = () => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
  };

  img.src = data;
}

// ---------- AUTO SAVE ----------

canvases.forEach((canvas, index) => {
  loadReveal(canvas, index);

  const save = () => saveReveal(canvas, index);

  canvas.addEventListener("mouseup", save);
  canvas.addEventListener("touchend", save);
});

// ---------- RESET (OPTIONAL) ----------

function resetIncident() {
  canvases.forEach((canvas, index) => {
    localStorage.removeItem(`${INCIDENT.id}_${index}`);
  });

  location.reload();
}
// ==========================================
// PROJECT M - PART 3
// CINEMATIC OPENING + PAGE FX
// ==========================================

// ---------- PAPER GLOW ----------

const paper = document.querySelector(".memoryPaper");

document.addEventListener("mousemove",(e)=>{

    if(!paper) return;

    const rect = paper.getBoundingClientRect();

    const x = ((e.clientX-rect.left)/rect.width)*100;
    const y = ((e.clientY-rect.top)/rect.height)*100;

    paper.style.background =
    `radial-gradient(circle at ${x}% ${y}%,
    rgba(255,248,220,.28),
    rgba(0,0,0,0) 45%),
    radial-gradient(rgba(90,60,30,.08) 1px,transparent 1px),
    linear-gradient(180deg,#E4C995,#D5B47A)`;

});

// ---------- PAGE OPEN ----------

function openMemoryPage(){

    loginPage.classList.add("hidden");

    memoryPage.classList.remove("hidden");

    memoryPage.animate([

        {
            opacity:0,
            transform:"scale(.97) rotateX(8deg)"
        },

        {
            opacity:1,
            transform:"scale(1) rotateX(0deg)"
        }

    ],{
        duration:900,
        easing:"ease-out"
    });

    typeTitle(INCIDENT.title);

}

// ---------- TYPEWRITER TITLE ----------

function typeTitle(text){

    const el = document.getElementById("incidentTitle");

    el.innerText="";

    let i=0;

    const timer=setInterval(()=>{

        el.innerText+=text.charAt(i);

        i++;

        if(i>=text.length) clearInterval(timer);

    },55);

}

// ---------- PASSWORD SUCCESS ----------

unlockBtn.addEventListener("click",()=>{

    if(passwordInput.value===PASSWORD){

        setTimeout(()=>{

            openMemoryPage();

        },350);

    }

});
// ==========================================
// PROJECT M - PART 4
// CINEMATIC AMBIENCE + INCIDENT LOADER
// ==========================================

// ---------- INCIDENT DATABASE ----------

const MEMORY_DATABASE = {

M001:{
title:"FIRST MEET",
stories:[
`Story 01`,
`Story 02`,
`Story 03`
]
},

M002:{
title:"BIRTHDAY",
stories:[
`Birthday story`,
`Cake memory`,
`Last smile`
]
}

};

// ---------- QR PARAMETER ----------
// index.html?id=M001

const params = new URLSearchParams(location.search);

const memoryID = params.get("id") || "M001";

const DATA = MEMORY_DATABASE[memoryID];

// ---------- LOAD INCIDENT ----------

document.getElementById("incidentTitle").innerText =
DATA.title;

document.querySelectorAll(".storyText").forEach((el,i)=>{

el.innerText = DATA.stories[i] || "";

});

// ---------- READING PROGRESS ----------

const progressKey = `${memoryID}_progress`;

window.addEventListener("scroll",()=>{

const value = Math.round(
(scrollY/(document.body.scrollHeight-innerHeight))*100
);

localStorage.setItem(progressKey,value);

});

// ---------- CINEMATIC WIND ----------

let wind = 0;

setInterval(()=>{

wind += .003;

document.body.style.backgroundPosition =
`${Math.sin(wind)*20}px 0px`;

},30);

// ---------- SOFT PAPER BREATH ----------

setInterval(()=>{

const glow = 0.96 + Math.random()*0.03;

document.querySelector(".memoryPaper").style.transform =
`scale(${glow})`;

},3500);
// ==========================================
// PROJECT M - PART 5 (FINAL)
// PREMIUM FINISH
// ==========================================

// ---------- AUTO MUSIC FADE IN ----------

music.volume = 0;

function fadeMusic(){

    let v = 0;

    const fade = setInterval(()=>{

        v += 0.02;

        music.volume = Math.min(v,0.45);

        if(v >= 0.45) clearInterval(fade);

    },120);

}

// Password success lo call cheyyi
unlockBtn.addEventListener("click",()=>{

    if(passwordInput.value===PASSWORD){

        setTimeout(()=>{

            fadeMusic();

        },700);

    }

});

// ---------- ASH BURST ----------

function ashBurst(x,y,ctx){

    for(let i=0;i<25;i++){

        const angle=Math.random()*Math.PI*2;
        const speed=Math.random()*4+1;

        flyingDust.push({

            x:x,
            y:y,

            vx:Math.cos(angle)*speed,
            vy:Math.sin(angle)*speed,

            size:Math.random()*2+1,
            alpha:1

        });

    }

}

// connect burst

canvases.forEach(canvas=>{

    canvas.addEventListener("touchstart",e=>{

        const r=canvas.getBoundingClientRect();

        const t=e.touches[0];

        ashBurst(
            (t.clientX-r.left)*(canvas.width/r.width),
            (t.clientY-r.top)*(canvas.height/r.height),
            canvas.getContext("2d")
        );

    });

});

// ---------- PAGE TURN ----------

function pageTurn(nextID){

    const page=document.querySelector(".memoryPaper");

    page.animate([

        {transform:"rotateY(0deg)",opacity:1},
        {transform:"rotateY(-90deg)",opacity:0}

    ],{
        duration:650,
        easing:"ease-in-out"
    }).onfinish=()=>{

        location.href=`index.html?id=${nextID}`;

    };

}

// ---------- SECRET DEVELOPER MODE ----------

let tap=0;

document.getElementById("incidentTitle")
.addEventListener("click",()=>{

    tap++;

    if(tap===5){

        const text=prompt("Edit Incident Title");

        if(text){

            document.getElementById("incidentTitle").innerText=text;

        }

        tap=0;

    }

});

// ---------- PARALLAX PAPER ----------

document.addEventListener("mousemove",e=>{

    const paper=document.querySelector(".memoryPaper");
    if(!paper) return;

    const x=(e.clientX/window.innerWidth-.5)*6;
    const y=(e.clientY/window.innerHeight-.5)*6;

    paper.style.transform=
    `rotateX(${-y}deg) rotateY(${x}deg)`;

});