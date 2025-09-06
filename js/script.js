// Mobile nav toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks){
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}

// Mobile dropdown toggle
document.querySelectorAll('.dropdown .dropdown-toggle').forEach(toggle=>{
  toggle.addEventListener('click', (e)=>{
    if (window.innerWidth <= 768){
      e.preventDefault();
      toggle.parentElement.classList.toggle('open');
    }
  });
});

// Theme toggle (light / dark neon)
const themeToggle = document.getElementById('theme-toggle');
const setTheme = (mode)=>{
  if(mode === 'light'){ document.documentElement.classList.add('light'); }
  else { document.documentElement.classList.remove('light'); }
  localStorage.setItem('theme', mode);
}
if (themeToggle){
  const saved = localStorage.getItem('theme');
  if(saved){ setTheme(saved); }
  themeToggle.addEventListener('click', ()=>{
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Typewriter effect
const typeEls = document.querySelectorAll('.type');
typeEls.forEach(el=>{
  const words = JSON.parse(el.dataset.words || '[]');
  let i=0, j=0, deleting=false;
  const tick = ()=>{
    const word = words[i] || '';
    el.textContent = deleting ? word.slice(0, j--) : word.slice(0, j++);
    if(!deleting && j === word.length + 3){ deleting = true; }
    if(deleting && j === 0){ deleting = false; i = (i+1) % words.length; }
    setTimeout(tick, deleting ? 60 : 120);
  };
  tick();
});

// Intersection Observer reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
},{ threshold: 0.15 });
revealEls.forEach(el=> io.observe(el));

// Simple tilt on cards
document.querySelectorAll('.tilt').forEach(card=>{
  const strength = 10;
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    const rx = ((cy / r.height) - .5) * -strength;
    const ry = ((cx / r.width) - .5) * strength;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = '');
});

// Parallax blob
document.querySelectorAll('[data-parallax]').forEach(el=>{
  window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth - .5) * 10;
    const y = (e.clientY / window.innerHeight - .5) * 10;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// Particles background
const particles = document.getElementById('particles');
if (particles){
  const ctx = particles.getContext('2d');
  const pts = Array.from({length: 60}, ()=>({x:Math.random(), y:Math.random(), vx:(Math.random()-.5)/200, vy:(Math.random()-.5)/200}));
  const resize=()=>{ particles.width = particles.offsetWidth; particles.height = particles.offsetHeight; };
  window.addEventListener('resize', resize); resize();
  const loop=()=>{
    ctx.clearRect(0,0,particles.width,particles.height);
    ctx.fillStyle = 'rgba(124,58,237,.8)';
    ctx.strokeStyle = 'rgba(6,182,212,.6)';
    pts.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>1) p.vx*=-1;
      if(p.y<0||p.y>1) p.vy*=-1;
      const X = p.x * particles.width, Y = p.y * particles.height;
      ctx.beginPath(); ctx.arc(X,Y,2,0,Math.PI*2); ctx.fill();
    });
    // lines
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx = (pts[i].x-pts[j].x)*particles.width;
        const dy = (pts[i].y-pts[j].y)*particles.height;
        const d = Math.hypot(dx,dy);
        if(d<130){
          ctx.globalAlpha = 1 - d/130;
          ctx.beginPath();
          ctx.moveTo(pts[i].x*particles.width, pts[i].y*particles.height);
          ctx.lineTo(pts[j].x*particles.width, pts[j].y*particles.height);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(loop);
  };
  loop();
}

// Footer grid glow
const grid = document.getElementById('footerGrid');
if (grid){
  const g = grid.getContext('2d');
  const resize=()=>{ grid.width = grid.offsetWidth; grid.height = grid.offsetHeight; };
  window.addEventListener('resize', resize); resize();
  const draw=()=>{
    g.clearRect(0,0,grid.width,grid.height);
    g.strokeStyle = 'rgba(124,58,237,.25)';
    for(let x=0;x<grid.width;x+=40){
      g.beginPath(); g.moveTo(x,0); g.lineTo(x,grid.height); g.stroke();
    }
    for(let y=0;y<grid.height;y+=40){
      g.beginPath(); g.moveTo(0,y); g.lineTo(grid.width,y); g.stroke();
    }
    requestAnimationFrame(draw);
  };
  draw();
}

// Filters in projects
document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.filter;
    document.querySelectorAll('.portfolio-grid .project-card').forEach(card=>{
      card.style.display = (cat==='all' || card.dataset.cat===cat) ? '' : 'none';
    });
  });
});

// Active nav link
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a[href]').forEach(a=>{
  if(a.getAttribute('href')===current){ a.classList.add('active'); }
});

// Footer year
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
