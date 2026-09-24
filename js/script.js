const screens = document.querySelectorAll('.screen');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const colors = ['#d95f7b', '#f7d3d8', '#f2a7b5', '#4f6f3d', '#f3e2c7', '#ffffff'];
let pieces = [], raf = null;

function show(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  if (id === 'alrighty' || id === 'yay') launchConfetti();
}

document.querySelectorAll('button[data-go]').forEach(b =>
  b.addEventListener('click', () => show(b.dataset.go))
);

function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

function launchConfetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.6,
    w: 6 + Math.random() * 8,
    h: 10 + Math.random() * 10,
    vy: 2 + Math.random() * 3.5,
    vx: -1.5 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: -0.12 + Math.random() * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));
  cancelAnimationFrame(raf);
  const end = performance.now() + 6000;
  (function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height + 20 && t < end) { p.y = -20; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter(p => p.y < canvas.height + 30);
    if (pieces.length) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })(performance.now());
}