// ROTACIÓN AUTOMÁTICA (siempre activa)
let autoRotX = 0.002;
let autoRotY = 0.003;
let autoRotZ = 0.001;

// ROTACIÓN MANUAL (drag / touch)
let dragRotX = 0;
let dragRotY = 0;


/* ================= CANVAS ================= */
const canvas = document.getElementById("sphereCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resize);
resize();

/* ================= CONFIG ================= */
const RADIUS = 220;
const DEPTH = 900;

let rotX = 0;
let rotY = 0;
let velX = 0;
let velY = 0;
let dragging = false;
let lastX = 0;
let lastY = 0;

let selectedNode = null;

/* ================= DATOS DE NODOS ================= */
const nodeData = [
  {
    img: "fotito.gif",
    title: "Who I'm I?",
    text: "Sometimes I ask myself. Although we live in a changing world, I know I'm part of the change. And thanks to the problems and my experiences, I grow positively every day. I believe that problems are like fuel for solutions...",
    link: "https://example.com"
  },
  {
    img: "fal.png",
    title: "Fal Art",
    text: "Obras de Arte",
    link: "https://falart.jimdofree.com/"
  },
  {
    img: "blue.png",
    title: "Blue Print",
    text: "Este nodo representa los planos en 2D y 3D.",
    link: "https://falart.jimdofree.com/portfolio/architecture/"
  },
  {
    img: "3n.png",
    title: "3N Tegelzetter",
    text: "Este nodo representa las instalaciones de azulejos.",
    link: "https://www.facebook.com/people/3N-tegelzetter/100040099371380/"
  },
  {
    img: "deve.png",
    title: "Developer",
    text: "Este nodo representa los codigos y programas.",
    link: "https://github.com/falart3?tab=repositories"
  },
  {
    img: "insta.png",
    title: "Intagram",
    text: "Este nodo representa otra conexion mas.",
    link: "https://www.instagram.com/francisco.lopez.art/?hl=es"
  },
  {
    img: "face.png",
    title: "FacebookIntagram",
    text: "Este nodo representa otra conexion mas.",
    link: "https://www.facebook.com/people/Francisco-Lopez/1552539529/"
  },
      { img: "wtsaap.png",
    title: "Whatsaap",
    text: "Este nodo representa otra conexion mas."
  },
  {
    img: "yout.png",
    title: "YouTube",
    text: "Canal de videos",
    link: "https://www.youtube.com/user/falarte"
  },
  { img: "blog.png",
    title: "Blog",
    text: "Este nodo representa otra conexion mas.",
    link: "http://falart.blogspot.com/"
  },
      {
    img: "lin.png",
    title: "Linkedin",
    text: "Este nodo representa otra conexion mas.",
    link: "https://www.linkedin.com/in/francisco-lopez-a5b67326"
  }    
];

/* ================= CREAR ESFERA ================= */
 const nodes = nodeData.map((data, i) => {
  const phi = Math.acos(1 - 2 * (i + 0.5) / nodeData.length);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;

  const img = new Image();
  img.src = data.img;

  return {
    x: RADIUS * Math.cos(theta) * Math.sin(phi),
    y: RADIUS * Math.sin(theta) * Math.sin(phi),
    z: RADIUS * Math.cos(phi),
    img,
    data
  };
});

/* ================= PROYECCIÓN ================= */
function project(n) {
  const scale = DEPTH / (DEPTH + n.z);
  return {
    x: n.x * scale + canvas.width / 2 + 150, // centra la esfera,
    y: n.y * scale + canvas.height / 2 - 50, // sube la esfera,
    scale
  };
}


/* ================= ROTACIONES ================= */
function rotateX(n, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const y = n.y * c - n.z * s;
  const z = n.y * s + n.z * c;
  n.y = y; n.z = z;
}

function rotateY(n, a) {
  const c = Math.cos(a), s = Math.sin(a);
  const x = n.x * c - n.z * s;
  const z = n.x * s + n.z * c;
  n.x = x; n.z = z;
}

/* ================= DIBUJO ================= */
function draw() {
    // Inicializamos la rotación automática como 0
    let autoRotX = 0;
    let autoRotY = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Aplica rotación automática
  rotX += autoRotX;
  rotY += autoRotY;

  nodes.forEach(n => {
      // Aplica tanto rotación automática como manual (drag)
    rotateX(n, velX + autoRotX);
    rotateY(n, velY + autoRotY);
  });

    // Fricción solo sobre la rotación manual
  velX *= 0.98;
  velY *= 0.98;;
  autoRotX *= 1.85; // fricción más lenta para rotación automática
  autoRotY *= 1.85;

  
  if (selectedNode) {
  drawInfoPanel(selectedNode);
}  


  // HILOS
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  nodes.forEach(a => {
    const pa = project(a);
    nodes.forEach(b => {
      const pb = project(b);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    });
  });

  // NODOS
  nodes.forEach(n => {
    const p = project(n);
    n.sx = p.x;
    n.sy = p.y;

    const size = 28 * p.scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(n.img, p.x - size, p.y - size, size * 2, size * 2);
    ctx.restore();

    if (n === selectedNode) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });

  requestAnimationFrame(draw);
}
draw();

/* ================= INTERACCIÓN ================= */
canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener("mouseup", () => dragging = false);

window.addEventListener("mousemove", e => {
  if (!dragging) return;
  velY = (e.clientX - lastX) * 0.002;
  velX = (e.clientY - lastY) * 0.002;
  lastX = e.clientX;
  lastY = e.clientY;

      // hacemos que la rotación automática siga la dirección del drag
  autoRotX = velX;
  autoRotY = velY;

  lastX = e.clientX;
  lastY = e.clientY;
});



/* ================= CLICK ================= */
canvas.addEventListener("click", e => {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  selectedNode = null;

  nodes.forEach(n => {
    const dx = x - n.sx;
    const dy = y - n.sy;
    if (Math.hypot(dx, dy) < 30) {
      selectedNode = n;
      showPanel(n);
    }
  });
});

/* ================= PANEL HTML ================= */
function showPanel(node) {
  const panel = document.getElementById("infoPanel");
    // Datos
  document.getElementById("infoTitle").innerText = node.data.title;
  document.getElementById("infoText").innerText = node.data.text;
  document.getElementById("infoLink").href = node.data.link;

  panel.classList.remove("hidden");

}


/* ================= HILO PANEL ================= */
function drawThread(node, panelAnchorX, panelAnchorY) {
  const p = project(node);

  ctx.save();
  ctx.strokeStyle = "rgba(0,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);

  ctx.lineTo(panelAnchorX, panelAnchorY);
    
  ctx.stroke();
  ctx.restore();
}

function drawInfoPanel(node) {

    const panel = document.getElementById("infoPanel");
    if (!panel) return;
    const p = project(node);


    // Posición del panel HTML
const rect = panel.getBoundingClientRect();
const canvasRect = canvas.getBoundingClientRect();
    
  const panelX = 20; 
  const panelY = canvas.height / 2 - 300;
  const panelW = 260;
  const panelH = 180;

  const anchorX = panelX + panelW;
  const anchorY = panelY + panelH;


  // 🧵 HILO
drawThread(node, anchorX, anchorY); 

  // 📦 PANEL
 /*
  ctx.save();
  ctx.fillStyle = "rgba(10,10,10,0.55)";
  ctx.strokeStyle = "rgba(0,255,255,0.4)";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 16);
  ctx.fill();
  ctx.stroke();

  // 📝 TEXTO
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText(node.data.text, panelX + 16, panelY + 32);

  ctx.font = "13px sans-serif";
  ctx.fillText("Click para abrir enlace", panelX + 16, panelY + 60);

  ctx.restore();
  */
}

