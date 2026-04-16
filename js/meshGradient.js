// js/meshGradient.js
// メッシュグラデーション共通関数

function hexToRgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

function initMeshHero(config) {
  const {
    wrapperId = 'heroWrap',
    bgCanvasId = 'bgCanvas',
    shimCanvasId = 'shimCanvas',
    orbsLayerId = 'orbsLayer',
    colors,
    speed = { mesh: 0.7, shim: 2.2, orb: 2.8 },
    shimmerOpacity = 0.31,
  } = config;

  const wrap   = document.getElementById(wrapperId);
  const bgCv   = document.getElementById(bgCanvasId);
  const bgCtx  = bgCv.getContext('2d');
  const shCv   = document.getElementById(shimCanvasId);
  const shCtx  = shCv.getContext('2d');
  const orbsEl = document.getElementById(orbsLayerId);

  // カラーポイント生成
  const pts = colors.points.map(c => ({
    c,
    x: Math.random(), y: Math.random(),
    vx: (Math.random()-.5)*.003,
    vy: (Math.random()-.5)*.003,
  }));

  // orbs生成
  const orbs = colors.orbs.map(color => {
    const el = document.createElement('div');
    el.className = 'orb';
    const size = 180 + Math.random() * 160;
    el.style.cssText = `width:${size}px;height:${size}px;background:${color};position:absolute;border-radius:50%;filter:blur(60px);mix-blend-mode:screen;`;
    el.style.left = (Math.random() * 100) + '%';
    el.style.top  = (Math.random() * 100) + '%';
    orbsEl.appendChild(el);
    return { el, x: Math.random(), y: Math.random(), vx:(Math.random()-.5)*0.0045, vy:(Math.random()-.5)*0.0045 };
  });

  function resize() {
    const dpr = devicePixelRatio;
    bgCv.width = window.innerWidth * dpr;  bgCv.height = window.innerHeight * dpr;
    shCv.width = window.innerWidth * dpr;  shCv.height = window.innerHeight * dpr;
  }

  function drawMesh() {
    const W = bgCv.width / devicePixelRatio;
    const H = bgCv.height / devicePixelRatio;
    const sw = Math.ceil(W / 3), sh = Math.ceil(H / 3);
    const id = bgCtx.createImageData(sw, sh);
    const d = id.data;
    for (let py = 0; py < sh; py++) {
      for (let px = 0; px < sw; px++) {
        const nx = px / sw, ny = py / sh;
        let tr=0, tg=0, tb=0, tw=0;
        for (const p of pts) {
          const dx = nx - p.x, dy = ny - p.y;
          const w2 = 1 / (dx*dx + dy*dy + 0.016);
          const [r,g,b] = hexToRgb(p.c);
          tr+=r*w2; tg+=g*w2; tb+=b*w2; tw+=w2;
        }
        const idx = (py * sw + px) * 4;
        d[idx]   = tr / tw;
        d[idx+1] = tg / tw;
        d[idx+2] = tb / tw;
        d[idx+3] = 255;
      }
    }
    const tmp = document.createElement('canvas');
    tmp.width = sw; tmp.height = sh;
    tmp.getContext('2d').putImageData(id, 0, 0);
    bgCtx.save();
    bgCtx.scale(devicePixelRatio, devicePixelRatio);
    bgCtx.imageSmoothingEnabled = true;
    bgCtx.imageSmoothingQuality = 'high';
    bgCtx.drawImage(tmp, 0, 0, W, H);
    bgCtx.restore();
  }

  let shimT = 0;
  function drawShimmer() {
    const W = shCv.width / devicePixelRatio;
    const H = shCv.height / devicePixelRatio;
    shCtx.save();
    shCtx.scale(devicePixelRatio, devicePixelRatio);
    shCtx.clearRect(0, 0, W, H);
    for (let i = 0; i < 5; i++) {
      const x = W * (0.08 + i * 0.2 + Math.sin(shimT * 0.55 + i) * 0.16);
      const y = H * (0.15 + Math.cos(shimT * 0.42 + i * 1.2) * 0.36);
      const r = 52 + Math.sin(shimT + i) * 18;
      const g = shCtx.createRadialGradient(x, y, 0, x, y, r * 4.2);
      g.addColorStop(0,   'rgba(255,255,255,0.62)');
      g.addColorStop(0.3, 'rgba(255,255,255,0.20)');
      g.addColorStop(1,   'rgba(255,255,255,0)');
      shCtx.fillStyle = g;
      shCtx.beginPath();
      shCtx.ellipse(x, y, r * 2.5, r, shimT * 0.22 + i, 0, Math.PI * 2);
      shCtx.fill();
    }
    shCtx.restore();
    shCv.style.opacity = shimmerOpacity;
  }

  function animate() {
    shimT += 0.006 * speed.shim;
    for (const p of pts) {
      p.x += p.vx * speed.mesh; p.y += p.vy * speed.mesh;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
    }
    for (const o of orbs) {
      o.x += o.vx * speed.orb; o.y += o.vy * speed.orb;
      if (o.x < -0.1 || o.x > 1.1) o.vx *= -1;
      if (o.y < -0.1 || o.y > 1.1) o.vy *= -1;
      o.el.style.left = (o.x * 100) + '%';
      o.el.style.top  = (o.y * 100) + '%';
    }
    drawMesh();
    drawShimmer();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener('resize', resize);
}