/* ==========================================
   PROJECT M
   SCRIPT.JS • PART 1
   Password + Lock + Music + Ambient Dust
========================================== */

// ---------- PASSWORD ----------

const PASSWORD = "19L41AO529V19L41A0543R";

// ---------- ELEMENTS ----------

const loginPage = document.getElementById("loginPage");
const memoryPage = document.getElementById("memoryPage");

const passwordInput = document.getElementById("passwordInput");
const unlockButton = document.getElementById("unlockButton");

const errorText = document.getElementById("errorText");
const hintTwo = document.getElementById("hintTwo");

const lockBox = document.getElementById("lockBox");
const lockTimer = document.getElementById("lockTimer");

const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

// ---------- LOCK CHECK ----------

checkLock();

function checkLock(){

    const lock = Number(localStorage.getItem("PM_LOCK"));

    if(!lock) return;

    if(Date.now() >= lock){

        localStorage.removeItem("PM_LOCK");
        localStorage.removeItem("PM_TRIES");

        return;
    }

    showLock(lock);

}

// ---------- BUTTON ----------

unlockButton.addEventListener("click", unlockMemory);

passwordInput.addEventListener("keydown", e=>{

    if(e.key==="Enter") unlockMemory();

});

function unlockMemory(){

    const lock = Number(localStorage.getItem("PM_LOCK"));

    if(lock && Date.now() < lock){

        showLock(lock);

        return;

    }

    let tries =
    Number(localStorage.getItem("PM_TRIES")) || 0;

    if(passwordInput.value === PASSWORD){

        localStorage.setItem("PM_TRIES",0);

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

        hintTwo.classList.remove("hidden");

        const next = tomorrow729();

        localStorage.setItem("PM_LOCK",next);

        showLock(next);

    }

}

// ---------- NEXT DAY 7:29 ----------

function tomorrow729(){

    const d=new Date();

    d.setDate(d.getDate()+1);

    d.setHours(19,29,0,0);

    return d.getTime();

}

// ---------- LOCK PANEL ----------

function showLock(time){

    lockBox.classList.remove("hidden");

    updateTimer(time);

    setInterval(()=>{

        updateTimer(time);

    },1000);

}

function updateTimer(time){

    const diff=time-Date.now();

    if(diff<=0){

        lockTimer.innerText="Unlocked";

        return;

    }

    const h=Math.floor(diff/3600000);
    const m=Math.floor((diff%3600000)/60000);
    const s=Math.floor((diff%60000)/1000);

    lockTimer.innerText=
    `${h}h ${m}m ${s}s`;

}

// ---------- MUSIC ----------

music.volume=0;

let playing=false;

function fadeMusic(){

    let v=0;

    music.play().catch(()=>{});

    const f=setInterval(()=>{

        v+=0.02;

        music.volume=Math.min(v,0.45);

        if(v>=0.45){

            playing=true;

            clearInterval(f);

        }

    },120);

}

musicButton.addEventListener("click",()=>{

    if(!playing){

        music.play();

        playing=true;

        musicButton.innerText="❚❚";

    }else{

        music.pause();

        playing=false;

        musicButton.innerText="♫";

    }

});

// ---------- AMBIENT DUST ----------

const ambientCanvas =
document.getElementById("ambientDust");

const actx = ambientCanvas.getContext("2d");

function resizeAmbient(){

    ambientCanvas.width=window.innerWidth;
    ambientCanvas.height=window.innerHeight;

}

resizeAmbient();

window.addEventListener("resize",resizeAmbient);

const ambient=[];

for(let i=0;i<140;i++){

    ambient.push({

        x:Math.random()*ambientCanvas.width,
        y:Math.random()*ambientCanvas.height,

        r:Math.random()*2.4+0.5,

        vy:Math.random()*0.25+0.05,

        a:Math.random()*0.4+0.1

    });

}

function animateAmbient(){

    actx.clearRect(
        0,0,
        ambientCanvas.width,
        ambientCanvas.height
    );

    ambient.forEach(p=>{

        p.y-=p.vy;

        if(p.y<0){

            p.y=ambientCanvas.height;
            p.x=Math.random()*ambientCanvas.width;

        }

        actx.beginPath();

        actx.fillStyle=
        `rgba(255,235,190,${p.a})`;

        actx.arc(
            p.x,p.y,p.r,
            0,Math.PI*2
        );

        actx.fill();

    });

    requestAnimationFrame(animateAmbient);

}

animateAmbient();
/* ==========================================
   PROJECT M
   SCRIPT.JS • PART 2
   STORY DATABASE
========================================== */

// ================================
// PASTE YOUR STORY ONLY HERE
// ================================

const MEMORY = {

    id : "M001",

    title : "FIRST MEET",

    stories : [

`IKKADA STORY 01 RAYI.

Entha lengthy aina parledhu.
Paragraphs kuda rayochu.`,

`IKKADA STORY 02 RAYI.

Second memory complete ga rayochu.`,

`IKKADA STORY 03 RAYI.

Future lo inka stories add cheyyachu.`

    ]

};

// ================================
// AUTO LOAD TITLE
// ================================

document.getElementById("incidentTitle").innerText =
MEMORY.title;

// ================================
// AUTO LOAD STORIES
// ================================

document.getElementById("story1").innerText =
MEMORY.stories[0] || "";

document.getElementById("story2").innerText =
MEMORY.stories[1] || "";

document.getElementById("story3").innerText =
MEMORY.stories[2] || "";

// ================================
// FUTURE QR SUPPORT
// ================================

const INCIDENT_ID = MEMORY.id;
/* ==========================================
   PROJECT M
   SCRIPT.JS • PART 3
   DUST REVEAL ENGINE
========================================== */

const canvases = [
  document.getElementById("dust1"),
  document.getElementById("dust2"),
  document.getElementById("dust3")
];

const storyBoxes = [
  document.getElementById("story1"),
  document.getElementById("story2"),
  document.getElementById("story3")
];

const revealParticles = [];

canvases.forEach((canvas, index) => {

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const W = 1200;
  const H = 420;

  canvas.width = W;
  canvas.height = H;

  // ---------- Dust Layer ----------

  for(let i=0;i<42000;i++){

    const x=Math.random()*W;
    const y=Math.random()*H;

    const s=Math.random()*2+0.5;
    const a=Math.random()*0.22+0.08;

    ctx.fillStyle=`rgba(120,95,70,${a})`;
    ctx.fillRect(x,y,s,s);

  }

  // Soft Fog

  for(let i=0;i<140;i++){

    ctx.beginPath();

    ctx.fillStyle="rgba(180,150,110,0.03)";

    ctx.arc(
      Math.random()*W,
      Math.random()*H,
      Math.random()*70+20,
      0,
      Math.PI*2
    );

    ctx.fill();

  }

  ctx.globalCompositeOperation="destination-out";

  // ---------- Brush ----------

  function brush(px,py){

    for(let i=0;i<10;i++){

      const angle=Math.random()*Math.PI*2;
      const dist=Math.random()*28;

      const x=px+Math.cos(angle)*dist;
      const y=py+Math.sin(angle)*dist;

      const r=Math.random()*20+12;

      const g=ctx.createRadialGradient(x,y,0,x,y,r);

      g.addColorStop(0,"rgba(0,0,0,1)");
      g.addColorStop(.6,"rgba(0,0,0,.45)");
      g.addColorStop(1,"rgba(0,0,0,0)");

      ctx.fillStyle=g;

      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();

    }

  }

  // ---------- Dust Fly ----------

  function spawn(px,py){

    for(let i=0;i<12;i++){

      revealParticles.push({

        x:px,
        y:py,

        vx:(Math.random()-0.5)*3,
        vy:-(Math.random()*2+1),

        r:Math.random()*2+1,

        a:1,

        canvas

      });

    }

  }

  // ---------- Mouse ----------

  canvas.addEventListener("mousemove",e=>{

    if(e.buttons!==1) return;

    const rect=canvas.getBoundingClientRect();

    const px=(e.clientX-rect.left)*(W/rect.width);
    const py=(e.clientY-rect.top)*(H/rect.height);

    brush(px,py);
    spawn(px,py);

  });

  // ---------- Touch ----------

  canvas.addEventListener("touchmove",e=>{

    e.preventDefault();

    const t=e.touches[0];

    const rect=canvas.getBoundingClientRect();

    const px=(t.clientX-rect.left)*(W/rect.width);
    const py=(t.clientY-rect.top)*(H/rect.height);

    brush(px,py);
    spawn(px,py);

  },{passive:false});

});

// ---------- Particle Animation ----------

function animateRevealParticles(){

  revealParticles.forEach((p,i)=>{

    const ctx=p.canvas.getContext("2d");

    ctx.save();

    ctx.globalCompositeOperation="source-over";

    ctx.fillStyle=`rgba(190,165,120,${p.a})`;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();

    ctx.restore();

    p.x+=p.vx;
    p.y+=p.vy;

    p.vy+=0.03;

    p.a-=0.02;

    if(p.a<=0){

      revealParticles.splice(i,1);

    }

  });

  requestAnimationFrame(animateRevealParticles);

}

animateRevealParticles();
/* ==========================================
   PROJECT M
   SCRIPT.JS • PART 4
   SAVE + QR INCIDENT LOADER
========================================== */

// ---------- QR SUPPORT ----------
// URL Example:
// index.html?id=M001

const params = new URLSearchParams(window.location.search);
const qrID = params.get("id");

// Future lo multiple incidents add cheyyachu
const DATABASE = {
  M001: MEMORY
};

// QR id unte aa incident load cheyyi
const ACTIVE = DATABASE[qrID] || MEMORY;

// ---------- LOAD TITLE ----------

document.getElementById("incidentTitle").innerText =
ACTIVE.title;

// ---------- LOAD STORIES ----------

document.getElementById("story1").innerText =
ACTIVE.stories[0] || "";

document.getElementById("story2").innerText =
ACTIVE.stories[1] || "";

document.getElementById("story3").innerText =
ACTIVE.stories[2] || "";

// ---------- SAVE REVEAL ----------

const SAVE_KEY = ACTIVE.id;

function saveCanvas(canvas,index){

  const key = `${SAVE_KEY}_${index}`;

  localStorage.setItem(
    key,
    canvas.toDataURL("image/png")
  );

}

function loadCanvas(canvas,index){

  const key = `${SAVE_KEY}_${index}`;

  const data = localStorage.getItem(key);

  if(!data) return;

  const img = new Image();

  img.onload = ()=>{

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.globalCompositeOperation =
    "destination-out";

  };

  img.src = data;

}

// ---------- AUTO LOAD ----------

canvases.forEach((canvas,index)=>{

  loadCanvas(canvas,index);

});

// ---------- AUTO SAVE ----------

canvases.forEach((canvas,index)=>{

  canvas.addEventListener("mouseup",()=>{

    saveCanvas(canvas,index);

  });

  canvas.addEventListener("touchend",()=>{

    saveCanvas(canvas,index);

  });

});

// ---------- RESET MEMORY ----------

function resetReveal(){

  canvases.forEach((canvas,index)=>{

    localStorage.removeItem(
      `${SAVE_KEY}_${index}`
    );

  });

  location.reload();

}
/* ==========================================
   PROJECT M
   SCRIPT.JS • PART 5
   CINEMATIC FX + DEVELOPER MODE
========================================== */

// ---------- PAGE GLOW ----------

const paper = document.querySelector(".memoryPaper");

document.addEventListener("mousemove",(e)=>{

  if(!paper || memoryPage.classList.contains("hidden")) return;

  const rect = paper.getBoundingClientRect();

  const x = ((e.clientX-rect.left)/rect.width)*100;
  const y = ((e.clientY-rect.top)/rect.height)*100;

  paper.style.background = `
  radial-gradient(circle at ${x}% ${y}%,
  rgba(255,248,220,.25),
  rgba(0,0,0,0) 45%),
  radial-gradient(rgba(90,60,30,.08) 1px,transparent 1px),
  linear-gradient(180deg,#E6CB93,#D4B47B)`;

});

// ---------- TYPEWRITER TITLE ----------

function typeWriter(title){

  const el = document.getElementById("incidentTitle");

  el.innerText="";

  let i=0;

  const t=setInterval(()=>{

    el.innerText += title.charAt(i);

    i++;

    if(i>=title.length) clearInterval(t);

  },55);

}

document.getElementById("incidentTitle").innerText="";
typeWriter(ACTIVE.title);

// ---------- PARALLAX PAPER ----------

document.addEventListener("mousemove",(e)=>{

  if(!paper || memoryPage.classList.contains("hidden")) return;

  const rx=(e.clientX/window.innerWidth-.5)*5;
  const ry=(e.clientY/window.innerHeight-.5)*5;

  paper.style.transform=
  `rotateY(${rx}deg) rotateX(${-ry}deg)`;

});

// ---------- SECRET EDIT MODE ----------

let taps=0;

document
.getElementById("incidentTitle")
.addEventListener("click",()=>{

  taps++;

  if(taps===5){

    const newTitle=prompt("Incident Title");

    if(newTitle){

      document
      .getElementById("incidentTitle")
      .innerText=newTitle;

    }

    taps=0;

  }

});

// ---------- PAGE OPEN SOUND ----------

setTimeout(()=>{

  if(!memoryPage.classList.contains("hidden")){

    fadeMusic();

  }

},600);

// ---------- END ----------