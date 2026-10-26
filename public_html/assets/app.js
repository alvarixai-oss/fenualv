(()=>{
  const body=document.body; const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches; const fine=matchMedia('(pointer:fine)').matches;
  const navBtn=document.querySelector('.nav-toggle'),nav=document.querySelector('.nav'); navBtn?.addEventListener('click',()=>{const o=nav.classList.toggle('open');navBtn.setAttribute('aria-expanded',o)});
  const revealEls=[...document.querySelectorAll('.reveal')];if('IntersectionObserver' in window){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});revealEls.forEach((el,i)=>{el.style.transitionDelay=`${Math.min((i%6)*65,260)}ms`;obs.observe(el)});}else{revealEls.forEach(el=>el.classList.add('visible'));}
  const glow=document.querySelector('.cursor-glow'); if(!reduced&&fine&&glow)addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
  document.querySelectorAll('.spotlight').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')}));
  if(!reduced&&fine)document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.13,y=(e.clientY-r.top-r.height/2)*.15;el.style.transform=`translate3d(${x}px,${y}px,0)`});el.addEventListener('pointerleave',()=>el.style.transform='translate3d(0,0,0)')});
  if(!reduced&&fine)document.querySelectorAll('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),p=Number(el.dataset.tilt||4),rx=((e.clientY-r.top)/r.height-.5)*-p*2,ry=((e.clientX-r.left)/r.width-.5)*p*2;el.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='perspective(1000px) rotateX(0) rotateY(0)')});
  document.querySelectorAll('[data-rotate]').forEach(rot=>{if(reduced)return;const words=rot.dataset.rotate.split('|');let i=0;setInterval(()=>{if(body.classList.contains('paused'))return;rot.classList.add('flip');setTimeout(()=>{i=(i+1)%words.length;rot.textContent=words[i];rot.classList.remove('flip')},240)},2500)});
  const cobs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,t=Number(el.dataset.count||0),s=performance.now(),d=1300;const run=n=>{const p=Math.min((n-s)/d,1),q=1-Math.pow(1-p,3);el.textContent=Math.floor(t*q).toLocaleString('es-ES');if(p<1)requestAnimationFrame(run)};requestAnimationFrame(run);cobs.unobserve(el)}),{threshold:.5});document.querySelectorAll('[data-count]').forEach(el=>cobs.observe(el));
  if(!reduced)addEventListener('pointerdown',e=>{if(!fine)return;for(let i=0;i<6;i++){const p=document.createElement('i');p.style.cssText=`position:fixed;pointer-events:none;z-index:99;left:${e.clientX}px;top:${e.clientY}px;width:2px;height:9px;border-radius:9px;background:#d6aa5c;transform-origin:50% 0;transform:rotate(${i*60}deg);animation:spark .48s ease-out forwards`;document.body.appendChild(p);setTimeout(()=>p.remove(),520)}}); const sty=document.createElement('style');sty.textContent='@keyframes spark{to{translate:0 17px;opacity:0}}';document.head.appendChild(sty);
  const motion=document.querySelector('.motion-toggle');motion?.addEventListener('click',()=>{const p=body.classList.toggle('paused');motion.textContent=p?'▶ Reanudar movimiento':'Ⅱ Pausar movimiento';motion.setAttribute('aria-pressed',String(p))});
  document.querySelector('#contactForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),s=encodeURIComponent('Contacto desde fenualv.com'),b=encodeURIComponent(`Nombre: ${f.get('nombre')}\nTeléfono: ${f.get('telefono')}\nEmail: ${f.get('email')}\n\n${f.get('mensaje')}`);location.href=`mailto:info@fenualv.com?subject=${s}&body=${b}`});
  // Canvas background: React Bits-inspired Threads + Particles + cursor influence.
  const canvas=document.querySelector('#ambientCanvas'); if(canvas&&!reduced){const ctx=canvas.getContext('2d');let w,h,dpr=Math.min(devicePixelRatio||1,2),mx=.68,my=.22;const mode=body.classList.contains('page-ai')?'ai':'light';
    const particles=Array.from({length:mode==='ai'?72:45},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00016,vy:(Math.random()-.5)*.00016,r:Math.random()*1.5+.5}));
    function resize(){w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}resize();addEventListener('resize',resize,{passive:true});addEventListener('pointermove',e=>{mx=e.clientX/w;my=e.clientY/h},{passive:true});
    let t=0;function draw(){if(!body.classList.contains('paused'))t+=.004;ctx.clearRect(0,0,w,h);
      for(let k=0;k<(mode==='ai'?12:8);k++){ctx.beginPath();const base=(k+1)/(mode==='ai'?13:9)*h;for(let x=-40;x<=w+40;x+=18){const influence=Math.exp(-Math.pow((x/w-mx)*3.1,2))*36;const y=base+Math.sin(x*.008+t*2+k*.72)*15+Math.sin(x*.003-t*1.2+k)*9+(my-.5)*influence; x===-40?ctx.moveTo(x,y):ctx.lineTo(x,y)}ctx.strokeStyle=mode==='ai'?`rgba(${80+k*4},${154+k*3},${190+k*2},${.035+k*.003})`:`rgba(170,132,67,${.025+k*.002})`;ctx.lineWidth=1;ctx.stroke()}
      particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;const dx=p.x-mx,dy=p.y-my,dist=Math.hypot(dx,dy);if(dist<.13){p.x+=dx*.002;p.y+=dy*.002}ctx.beginPath();ctx.arc(p.x*w,p.y*h,p.r,0,Math.PI*2);ctx.fillStyle=mode==='ai'?'rgba(189,226,238,.22)':'rgba(152,118,58,.12)';ctx.fill(); if(mode==='ai'&&i%4===0){for(let j=i+1;j<Math.min(i+5,particles.length);j++){const q=particles[j],dd=Math.hypot((p.x-q.x)*w,(p.y-q.y)*h);if(dd<100){ctx.beginPath();ctx.moveTo(p.x*w,p.y*h);ctx.lineTo(q.x*w,q.y*h);ctx.strokeStyle=`rgba(111,190,214,${.07*(1-dd/100)})`;ctx.stroke()}}}});requestAnimationFrame(draw)}draw();}
})();

;(()=>{
  const body=document.body;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(pointer:fine)').matches;
  const paused=()=>body.classList.contains('paused');

  // Center Flow: a connected FENUALV IA hub in the hero visual.
  const heroVisual=document.querySelector('.hero-visual');
  if(heroVisual&&!heroVisual.querySelector('.center-flow')){
    heroVisual.classList.add('has-center-flow');
    const flow=document.createElement('div');
    flow.className='center-flow';
    flow.setAttribute('aria-label','Servicios conectados con FENUALV IA');
    flow.innerHTML=`
      <svg viewBox="0 0 500 500" preserveAspectRatio="none" aria-hidden="true">
        <defs><radialGradient id="pulseGlow"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#7dc9dc"/><stop offset="1" stop-color="#2c7894"/></radialGradient></defs>
        <path id="p1" class="cf-line gold" d="M250 250 C190 205 145 145 85 115"/>
        <path id="p2" class="cf-line" d="M250 250 C315 195 355 145 420 110"/>
        <path id="p3" class="cf-line gold" d="M250 250 C325 265 375 330 430 385"/>
        <path id="p4" class="cf-line" d="M250 250 C180 275 140 330 80 390"/>
        <path id="p5" class="cf-line" d="M250 250 C165 245 110 250 40 250"/>
        <path id="p6" class="cf-line gold" d="M250 250 C335 240 395 245 468 250"/>
        ${[1,2,3,4,5,6].map((n,i)=>`<circle class="cf-pulse" r="5" fill="url(#pulseGlow)"><animateMotion dur="${2.8+i*.18}s" repeatCount="indefinite" begin="${(i*.43).toFixed(2)}s"><mpath href="#p${n}"/></animateMotion></circle>`).join('')}
      </svg>
      <div class="cf-hub"><strong>FENUALV<br>IA</strong><span>núcleo activo</span></div>
      <div class="cf-node n1"><i></i>Correo IA</div><div class="cf-node n2"><i></i>Atención 24/7</div>
      <div class="cf-node n3"><i></i>Informes</div><div class="cf-node n4"><i></i>Documentos</div>
      <div class="cf-node n5"><i></i>Procesos</div><div class="cf-node n6"><i></i>Captación</div>
      <div class="cf-caption">Un núcleo · múltiples automatizaciones</div>`;
    const heroShell=heroVisual.closest('.hero');
    if(heroShell){heroShell.classList.add('has-global-center-flow');heroShell.appendChild(flow)}else{heroVisual.appendChild(flow)}
    if(fine&&!reduced){flow.addEventListener('pointermove',e=>{const r=flow.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;flow.style.transform=`perspective(900px) rotateX(${-y*3}deg) rotateY(${x*4}deg)`});flow.addEventListener('pointerleave',()=>flow.style.transform='')}
  }

  // Home-only Magic Transform style demonstration.
  const hero=document.querySelector('.hero');
  const aiZone=document.querySelector('.ai-zone');
  if(hero&&aiZone&&!document.querySelector('.transform-lab')){
    const lab=document.createElement('section');
    lab.className='transform-lab';
    lab.innerHTML=`<div class="container"><div class="section-head reveal"><div><p class="eyebrow">AUTOMATIZACIÓN VISIBLE</p><h2>La información entra.<br><span>El trabajo sale hecho.</span></h2></div><p>Un ejemplo visual de cómo FENUALV IA puede recibir información, interpretarla y dejar preparados los siguientes pasos.</p></div>
      <div class="transform-stage reveal spotlight">
        <div class="transform-stack">
          <div class="transform-card"><span class="ic">✉</span><div><small>Entrada</small><b>Correo de cliente</b></div></div>
          <div class="transform-card"><span class="ic">▤</span><div><small>Entrada</small><b>PDF / formulario</b></div></div>
          <div class="transform-card"><span class="ic">↗</span><div><small>Entrada</small><b>Nueva oportunidad</b></div></div>
        </div>
        <div class="transform-path"><i></i><i></i><i></i></div>
        <div class="transform-core"><strong>FENUALV IA<span>analiza · decide · deriva</span></strong></div>
        <div class="transform-stack">
          <div class="transform-card out"><span class="ic">✓</span><div><small>Resultado</small><b>Respuesta preparada</b></div></div>
          <div class="transform-card out"><span class="ic">◎</span><div><small>Resultado</small><b>CRM actualizado</b></div></div>
          <div class="transform-card out"><span class="ic">▥</span><div><small>Resultado</small><b>Informe listo</b></div></div>
        </div>
      </div></div>`;
    aiZone.parentNode.insertBefore(lab,aiZone);
  }

  // Add a live automation feed + agentic orb inside the AI section.
  if(aiZone&&!aiZone.querySelector('.ai-showcase-grid')){
    const container=aiZone.querySelector('.container');
    const grid=document.createElement('div');
    grid.className='ai-showcase-grid reveal';
    grid.innerHTML=`<div class="ai-panel"><div class="ai-panel-head"><strong>Automatizaciones en directo</strong><span class="status-pill">sistema activo</span></div><div class="live-feed" aria-live="polite"></div></div>
      <div class="ai-panel agent-orb-wrap"><span class="agent-spark"></span><span class="agent-spark s2"></span><div class="agent-orb"></div><div class="agent-orb-label"><strong>Agente FENUALV</strong><span>escucha · analiza · actúa</span></div></div>`;
    container.appendChild(grid);
    const feed=grid.querySelector('.live-feed');
    const items=[
      ['✉','Correo clasificado','Prioridad alta · Comercial'],['◎','Lead registrado','Seguimiento programado'],['▤','Documento leído','6 campos extraídos'],['↗','Respuesta preparada','Pendiente de revisión'],['▥','Informe actualizado','Datos consolidados'],['✓','Tarea completada','CRM sincronizado']
    ];
    let idx=0;
    const render=()=>{if(paused())return;const [ic,title,desc]=items[idx++%items.length];const row=document.createElement('div');row.className='feed-item';row.innerHTML=`<span class="feed-icon">${ic}</span><div><b>${title}</b><small>${desc}</small></div><span class="feed-time">ahora</span>`;feed.prepend(row);while(feed.children.length>5)feed.lastElementChild.remove()};
    for(let i=0;i<4;i++)render();
    if(!reduced)setInterval(render,2600);
  }

  // Add an animated mini graph to the metrics row on the home page.
  const metrics=document.querySelector('.metrics');
  if(metrics&&hero&&!metrics.querySelector('.graph-metric')){
    const m=document.createElement('div');m.className='metric graph-metric reveal';
    m.innerHTML=`<strong>Ahorro y eficiencia, visualizados</strong><span>Evolución ilustrativa de un proceso optimizado</span><div class="graph-wrap"><svg viewBox="0 0 360 80" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="graphGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d1a24c"/><stop offset="1" stop-color="#d1a24c" stop-opacity="0"/></linearGradient></defs><path class="graph-fill" d="M0 68 C45 61 65 53 95 55 S145 39 175 41 S220 29 250 31 S310 13 360 12 L360 80 L0 80 Z"/><path class="graph-line" d="M0 68 C45 61 65 53 95 55 S145 39 175 41 S220 29 250 31 S310 13 360 12"/><circle class="graph-dot" cx="360" cy="12" r="3.5"/></svg></div>`;
    metrics.appendChild(m);
  }

  // Enrich every subpage hero orb with connected business concepts.
  document.querySelectorAll('.visual-orb').forEach(orb=>{
    if(orb.classList.contains('enhanced'))return;orb.classList.add('enhanced');
    ['Datos','Control','Ahorro','Automatización'].forEach((label,i)=>{const s=document.createElement('span');s.className=`satellite sat-${i+1}`;s.textContent=label;orb.appendChild(s)});
  });

  // New reveal elements inserted after the original observer was created.
  const revealNew=[...document.querySelectorAll('.transform-lab .reveal,.ai-showcase-grid.reveal,.graph-metric.reveal')];
  if('IntersectionObserver' in window){const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target)}}),{threshold:.1});revealNew.forEach(el=>ro.observe(el))}else revealNew.forEach(el=>el.classList.add('visible'));
})();
