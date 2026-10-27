// ===== Anel de Cinzas =====
// Para adicionar chefes: acrescente uma linha "Nome|nível|ataques" em MAIN ou OPT.
// Ataques: s=golpe em cone, d=investida, l=pancada em área, p=projéteis, r=chuva de áreas
const $=s=>document.querySelector(s),c=$('#c'),g=c.getContext('2d'),ov=$('#ov');
const W=900,H=500,CX=450,CY=250,R=230,rnd=(a,b)=>a+Math.random()*(b-a),pr=a=>a[Math.random()*a.length|0];
const RAR=[['Comum','#b9b2a2',1,50],['Incomum','#6fbf6f',1.4,28],['Raro','#4a8fe0',1.9,14],['Épico','#b070f0',2.6,6],['Lendário','#f0b030',3.6,2]];
const parse=(t,k)=>t.trim().split('\n').map(l=>{const[n,v,a]=l.split('|');return{n,l:+v,a,k}});
const MAIN=parse(`Margit, o Presságio Funesto|1|sdr
Godrick, o Enxertado|2|sld
Rainha Rennala|3|rp
Radahn, Flagelo das Estrelas|5|sdlr
Rykard, Senhor da Blasfêmia|6|slp
Mohg, Senhor do Sangue|7|sdlr
Morgott, o Rei Presságio|7|sdl
Gigante de Fogo|8|slr
Maliketh, a Lâmina Negra|9|sdp
Godfrey, Primeiro Lorde Elden|10|sld
Radagon do Anel Dourado|11|sdpr
Fera Elden|12|lrp`,'Principal');
const OPT=parse(`Sentinela da Árvore|1|sdl
Dragão Agheel|2|sdp
Cavaleiro Crucible|2|sdl
Marinheiro Tibia|2|sdr
Cavaleiro Noturno|3|sd
Troll Escavador|3|sl
Espírito Ancestral|3|sdp
Lobo Vermelho de Radagon|4|sd
Assassino da Lâmina Negra|4|sdp
Caçador do Sino|4|sd
Cristaliano|4|sdl
Vigia Funerário|4|sdl
Comandante O'Neil|4|sdr
Comandante Niall|5|sdl
Gárgulas Valentes|5|sdp
Wyrm de Magma|5|sdlp
Loretta, Cavaleira Real|5|sdp
Apóstolo Godskin|6|sdr
Nobre Godskin|6|slr
Omenkiller|6|sdl
Lágrima Imitadora|6|sdp
Ave do Ritual da Morte|6|dpr
Espírito da Árvore Ulcerada|7|slr
Avatar Pútrido|7|slr
Elemer da Sarça|7|sdp
Sir Gideon Ofnir|8|sdpr
Astel, Estrela do Vazio|8|dlpr
Lansseax, Dragão Ancião|9|sdlp
Alecto, Lâmina Negra Perseguidora|9|sdr
Mohg, o Presságio|9|sdlr
Greyoll, Dragão Ancião|9|slp
Rellana, Gêmea Lua|10|sdpr
Fortissax, Dragão Morto-Vivo|11|sdlp
Soldado Dragkin|11|slr
Placidusax, Senhor Dragão|13|sdlpr
Malenia, Lâmina de Miquella|14|sdr`,'Opcional');
const ALL=[...MAIN,...OPT];ALL.forEach((b,i)=>b.h=(i*53)%360);

// ===== Progresso salvo =====
let S={runes:0,def:{},inv:[],eq:{},tab:'m'};
try{Object.assign(S,JSON.parse(localStorage.getItem('anelcinzas')||'{}'))}catch(e){}
if(!S.inv.length){S.inv=[{id:1,s:'w',r:0,l:0,n:'Espada Enferrujada',d:6}];S.eq={w:1}}
const save=()=>{try{localStorage.setItem('anelcinzas',JSON.stringify(S))}catch(e){}};

// ===== Equipamentos com RNG =====
const NM={w:['Espada Longa','Katana','Machado Grande','Lança Curva','Martelo','Adaga Ritual','Montante'],a:['Armadura de Cavaleiro','Manto Errante','Elmo de Ferro','Veste do Estrangeiro','Couraça de Pedra'],t:{reg:'Pena do Vigor',ls:'Sede de Sangue',cr:'Olho de Corvo'}};
const AF=['do Exilado','de Cinzas','Rubro','Sagrado','do Presságio','Dourado'],TL={reg:'regen. de vigor',ls:'roubo de vida',cr:'chance crítica'};
function gen(l,s=pr(['w','a','t'])){
 const ws=RAR.map((r,i)=>r[3]*(1+i*l*.08)),T=ws.reduce((a,b)=>a+b);let x=Math.random()*T,r=0;
 while(r<4&&x>=ws[r]){x-=ws[r];r++}
 const m=RAR[r][2],v=()=>rnd(.85,1.15),it={id:Date.now()+Math.random(),s,r,l};
 if(s==='w'){it.n=pr(NM.w);it.d=Math.round((8+l*1.4)*m*v())}
 if(s==='a'){it.n=pr(NM.a);it.hp=Math.round((10+l*3.2)*m*v());it.red=Math.min(45,Math.round((2+l*.3)*m*v()))}
 if(s==='t'){it.k=pr(['reg','ls','cr']);it.n=NM.t[it.k];it.v=Math.round({reg:15,ls:3,cr:6}[it.k]*m*v())}
 it.n+=' '+pr(AF);return it}
const desc=i=>i.s==='w'?`+${i.d} de dano`:i.s==='a'?`+${i.hp} de vida · −${i.red}% dano sofrido`:`+${i.v}% ${TL[i.k]}`;
const cost=i=>120+i.l*40+i.r*60,val=i=>30+i.l*15+i.r*40;
function stats(){const e=k=>S.inv.find(i=>i.id===S.eq[k])||{},w=e('w'),a=e('a'),t=e('t');
 return{dmg:10+(w.d||0),hp:100+(a.hp||0),red:a.red||0,reg:1+(t.k==='reg'?t.v/100:0),ls:t.k==='ls'?t.v/100:0,cr:t.k==='cr'?t.v/100:0}}
const card=i=>`<div><b style="color:${RAR[i.r][1]}">${i.n}</b><small>${RAR[i.r][0]} · ${{w:'Arma',a:'Armadura',t:'Talismã'}[i.s]} · Nv ${i.l}</small><span>${desc(i)}</span></div>`;

// ===== Menus =====
let state='menu',P,B,cur,ST,zones=[],shots=[],fx=[],shake=0,msg='',msgT=0;
function menu(){state='menu';ov.hidden=false;const m=S.tab==='m',L=m?MAIN:OPT,
 lock=b=>m?L.indexOf(b)>0&&!S.def[L[L.indexOf(b)-1].n]:!S.def[MAIN[0].n],cnt=l=>l.filter(b=>S.def[b.n]).length;
 ov.innerHTML=`<h1>Anel de Cinzas</h1><div class="bar"><span>Runas: <b>${S.runes}</b> · Abatidos: <b>${cnt(ALL)}/${ALL.length}</b></span><button data-a="inv">Equipamentos</button></div>
 <div class="tabs"><button data-a="tab" data-v="m" class="${m?'on':''}">Principais (${cnt(MAIN)}/${MAIN.length})</button><button data-a="tab" data-v="o" class="${m?'':'on'}">Opcionais (${cnt(OPT)}/${OPT.length})</button></div>
 ${!m&&lock(OPT[0])?'<p class="note">Derrote Margit para liberar os chefes opcionais.</p>':''}${m?'<p class="note">Os chefes principais são liberados em sequência.</p>':''}
 <div class="list">${L.map(b=>`<button data-a="go" data-n="${b.n}" ${lock(b)?'disabled':''}><span>${S.def[b.n]?'✔ ':''}${b.n}</span><small>Nv ${b.l}</small></button>`).join('')}</div>`}
function inv(note=''){state='inv';ov.hidden=false;const s=stats(),its=[...S.inv].sort((a,b)=>b.r-a.r||b.l-a.l);
 ov.innerHTML=`<h1>Equipamentos</h1><div class="bar"><span>Runas: <b>${S.runes}</b></span><button data-a="menu">Voltar</button></div>
 <p class="note">Dano ${s.dmg} · Vida ${s.hp} · Redução ${s.red}% · Vigor +${Math.round((s.reg-1)*100)}% · Roubo de vida ${Math.round(s.ls*100)}% · Crítico ${Math.round(s.cr*100)}%</p>
 <p class="note">Reforjar sorteia um item novo do mesmo tipo (pode piorar ou melhorar).</p>${note}
 <div class="list">${its.map(i=>{const q=Object.values(S.eq).includes(i.id);return `<div class="it" style="border-color:${RAR[i.r][1]}">${card(i)}<div class="acts"><button data-a="eq" data-id="${i.id}" ${q?'disabled':''}>${q?'Equipado':'Equipar'}</button><button data-a="rf" data-id="${i.id}">Reforjar ${cost(i)}</button><button data-a="sell" data-id="${i.id}" ${q?'disabled':''}>Vender +${val(i)}</button></div></div>`}).join('')}</div>`}
ov.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,it=S.inv.find(i=>String(i.id)===b.dataset.id);
 if(a==='tab'){S.tab=b.dataset.v;menu()}else if(a==='inv')inv();else if(a==='menu')menu();
 else if(a==='go')fight(ALL.find(x=>x.n===b.dataset.n));else if(a==='again')fight(cur);
 else if(a==='eq'){S.eq[it.s]=it.id;save();inv()}
 else if(a==='sell'){S.runes+=val(it);S.inv=S.inv.filter(i=>i!==it);save();inv()}
 else if(a==='rf'){if(S.runes<cost(it))return inv('<p class="note">Runas insuficientes.</p>');S.runes-=cost(it);
  const n=gen(it.l,it.s);n.id=it.id;S.inv[S.inv.indexOf(it)]=n;save();inv(`<p class="note">Reforjado: ${n.n} (${RAR[n.r][0]})</p>`)}};

// ===== Luta =====
function fight(b){cur=b;ST=stats();const hp=220+b.l*85;
 B={...b,x:CX+160,y:CY,hp,max:hp,s:'chase',t:1,ty:'',ang:0,w:1,ph:1,fl:0,dm:18+b.l*2.2,rad:26+b.l*1.6,p2:0,cb:0};
 P={x:CX-170,y:CY,hp:ST.hp,st:100,face:0,roll:0,rx:1,ry:0,atk:0,hit:0,ig:0,fl:3,dr:0,sd:0};
 zones=[];shots=[];fx=[];state='play';ov.hidden=true;say(b.n)}
function win(){state='win';const first=!S.def[B.n];S.def[B.n]=1;const rr=Math.round(B.l*140*(first?2:1)),dr=[gen(B.l)];
 if(B.k==='Principal'||Math.random()<.5)dr.push(gen(B.l));S.runes+=rr;S.inv.push(...dr);save();ov.hidden=false;
 ov.innerHTML=`<h1 class="gold">Grande Inimigo Abatido</h1><p class="note">${B.n} · +${rr} runas${first?' (primeira vez: dobro)':''}</p>
 <div class="list">${dr.map(i=>`<div class="it" style="border-color:${RAR[i.r][1]}">${card(i)}</div>`).join('')}</div>
 <div class="acts"><button data-a="again">Lutar de novo</button><button data-a="inv">Equipamentos</button><button data-a="menu">Menu</button></div>`}
const say=m=>{msg=m;msgT=3},K={},M={x:600,y:250};
onkeydown=e=>{K[e.code]=1;if(e.code==='Space')e.preventDefault();
 if(state==='play'){if(e.code==='Space')dodge();if(e.code==='KeyJ')atk();if(e.code==='KeyR')drink();if(e.code==='Escape')menu()}
 else if(state==='dead'){if(e.code==='Enter')fight(cur);if(e.code==='Escape')menu()}};
onkeyup=e=>K[e.code]=0;
c.onmousemove=e=>{const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height};
c.onmousedown=()=>atk();
function dodge(){if(P.roll>0||P.st<20||P.dr>0)return;let dx=(K.KeyD?1:0)-(K.KeyA?1:0),dy=(K.KeyS?1:0)-(K.KeyW?1:0);
 if(!dx&&!dy){dx=Math.cos(P.face);dy=Math.sin(P.face)}const l=Math.hypot(dx,dy);P.rx=dx/l;P.ry=dy/l;P.roll=.35;P.ig=.3;P.st-=20;P.sd=.6;P.atk=0}
function atk(){if(state!=='play'||P.atk>0||P.roll>0||P.st<8||P.dr>0)return;P.atk=.4;P.hit=0;P.st-=20;P.sd=.7}
function drink(){if(P.fl<1||P.dr>0||P.roll>0)return;P.fl--;P.dr=.9}
const adiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)};
function hurt(d){if(P.ig>0)return;P.hp-=d*(1-ST.red/100);P.ig=.5;shake=10;P.dr=0;if(P.hp<=0){P.hp=0;state='dead'}}
function update(dt){
 if(state!=='play')return;
 P.face=Math.atan2(M.y-P.y,M.x-P.x);
 let dx=(K.KeyD?1:0)-(K.KeyA?1:0),dy=(K.KeyS?1:0)-(K.KeyW?1:0),l=Math.hypot(dx,dy)||1,sp=P.dr>0?60:P.atk>0?70:170;
 if(P.roll>0){P.x+=P.rx*430*dt;P.y+=P.ry*430*dt;P.roll-=dt}else{P.x+=dx/l*sp*dt;P.y+=dy/l*sp*dt}
 const pd=Math.hypot(P.x-CX,P.y-CY);if(pd>R-14){P.x=CX+(P.x-CX)/pd*(R-14);P.y=CY+(P.y-CY)/pd*(R-14)}
 P.ig-=dt;P.sd-=dt;if(P.sd<=0)P.st=Math.min(100,P.st+38*ST.reg*dt);
 if(P.dr>0){P.dr-=dt;if(P.dr<=0){P.hp=Math.min(ST.hp,P.hp+ST.hp*.4);say('Frasco consumido')}}
 if(P.atk>0){P.atk-=dt;if(P.atk<.28&&P.atk>.12&&!P.hit){const d=Math.hypot(B.x-P.x,B.y-P.y);
  if(d<80+B.rad&&adiff(Math.atan2(B.y-P.y,B.x-P.x),P.face)<1.1){P.hit=1;const cr=Math.random()<ST.cr,dm=ST.dmg*(cr?2:1);
   B.hp-=dm;P.hp=Math.min(ST.hp,P.hp+dm*ST.ls);B.fl=.12;shake=cr?7:4;fx.push({x:B.x,y:B.y,t:.3,cr})}}}
 // chefe
 if(!B.p2&&B.hp<B.max/2){B.p2=1;say('Fase 2')}B.ph=B.p2?1.35:1;
 const d=Math.hypot(P.x-B.x,P.y-B.y),a=Math.atan2(P.y-B.y,P.x-B.x);B.fl-=dt;B.t-=dt;
 if(B.s==='chase'){B.x+=Math.cos(a)*70*B.ph*dt;B.y+=Math.sin(a)*70*B.ph*dt;
  if(B.t<=0&&d<300){let k=pr([...B.a]);
   if(d>170&&'sl'.includes(k)){k=['d','p','r'].find(x=>B.a.includes(x));if(!k)B.t=.2}
   if(k){B.ty=k;B.s='wind';B.w=B.t={s:.7,d:.85,l:1,r:.9,p:.6}[k]/B.ph;B.ang=a;
    if(k==='l')zones.push({x:B.x,y:B.y,r:95+B.l*3,t:B.w,w:B.w});
    if(k==='r'){for(let i=0;i<3;i++){const t=B.w+i*.3;zones.push({x:P.x+(i?rnd(-90,90):0),y:P.y+(i?rnd(-90,90):0),r:55,t,w:t})}B.t=B.w+.6}}}}
 else if(B.s==='wind'){if(B.t>.25&&(B.ty==='s'||B.ty==='d'))B.ang=a;
  if(B.t<=0){B.s='act';B.t={s:.15,d:.4}[B.ty]||.05;B.done=0;
   if(B.ty==='s'&&d<110+B.rad&&adiff(a,B.ang)<1)hurt(B.dm);
   if(B.ty==='p'){const n=B.p2?7:5;for(let i=0;i<n;i++){const an=a+(i-(n-1)/2)*.22;shots.push({x:B.x,y:B.y,vx:Math.cos(an)*270,vy:Math.sin(an)*270})}}}}
 else if(B.s==='act'){
  if(B.ty==='d'){B.x+=Math.cos(B.ang)*680*dt;B.y+=Math.sin(B.ang)*680*dt;if(!B.done&&d<B.rad+22){B.done=1;hurt(B.dm*1.1)}}
  if(B.t<=0){if(B.ty==='s'&&B.p2&&!B.cb){B.cb=1;B.s='wind';B.w=B.t=.45;B.ang=a}else{B.cb=0;B.s='rec';B.t=.8/B.ph}}}
 else if(B.t<=0){B.s='chase';B.t=rnd(.2,.5)}
 const bd=Math.hypot(B.x-CX,B.y-CY);if(bd>R-30){B.x=CX+(B.x-CX)/bd*(R-30);B.y=CY+(B.y-CY)/bd*(R-30)}
 zones=zones.filter(z=>{z.t-=dt;if(z.t>0)return true;shake=Math.max(shake,6);if(Math.hypot(P.x-z.x,P.y-z.y)<z.r+10)hurt(B.dm*1.3);return false});
 shots=shots.filter(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;if(Math.hypot(P.x-s.x,P.y-s.y)<20){hurt(B.dm*.7);return false}return Math.hypot(s.x-CX,s.y-CY)<R+40});
 if(B.hp<=0){B.hp=0;win();return}
 msgT-=dt;fx.forEach(f=>f.t-=dt);fx=fx.filter(f=>f.t>0);shake*=.88}

// ===== Desenho =====
const bar=(x,y,w,h,v,col)=>{g.fillStyle='#000a';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle=col;g.fillRect(x,y,w*Math.max(0,v),h);g.strokeStyle='#6b5a34';g.strokeRect(x-2,y-2,w+4,h+4)};
const txt=(t,x,y,s,col,al='center')=>{g.font='700 '+s+'px Cinzel,Georgia,serif';g.textAlign=al;g.fillStyle=col;g.fillText(t,x,y)};
function draw(){
 g.save();g.fillStyle='#0b0a08';g.fillRect(0,0,W,H);
 if(shake>.5)g.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
 const gr=g.createRadialGradient(CX,CY,20,CX,CY,R);gr.addColorStop(0,'#3a3220');gr.addColorStop(1,'#1a1610');
 g.fillStyle=gr;g.beginPath();g.arc(CX,CY,R,0,7);g.fill();g.lineWidth=4;g.strokeStyle='#6b5a34';g.stroke();
 g.lineWidth=1;g.strokeStyle='#4a3f28';for(let r=60;r<R;r+=60){g.beginPath();g.arc(CX,CY,r,0,7);g.stroke()}
 for(let i=0;i<8;i++){const t=i*Math.PI/4+.4;g.fillStyle='#2a2418';g.beginPath();g.arc(CX+Math.cos(t)*(R+18),CY+Math.sin(t)*(R+18),16,0,7);g.fill()}
 if(P&&B){
  zones.forEach(z=>{const p=1-z.t/z.w;g.fillStyle=`rgba(190,30,20,${.12+.3*p})`;g.strokeStyle='rgba(230,60,40,.8)';g.lineWidth=2;
   g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.stroke();g.beginPath();g.arc(z.x,z.y,z.r*Math.max(p,.05),0,7);g.fill()});
  if(B.s==='wind'||B.s==='act'){const p=B.s==='act'?1:1-B.t/B.w;g.fillStyle=`rgba(190,30,20,${.15+.3*p})`;g.strokeStyle='rgba(230,60,40,.8)';
   if(B.ty==='s'){g.beginPath();g.moveTo(B.x,B.y);g.arc(B.x,B.y,(110+B.rad)*Math.max(p,.3),B.ang-1,B.ang+1);g.closePath();g.fill();g.stroke()}
   if(B.ty==='d'){g.save();g.translate(B.x,B.y);g.rotate(B.ang);g.fillRect(0,-26,300*Math.max(p,.2),52);g.restore()}}
  const body=B.fl>0?'#fff':`hsl(${B.h},35%,28%)`;
  g.fillStyle=body;g.beginPath();g.arc(B.x,B.y,B.rad,0,7);g.fill();g.strokeStyle='#d8b45a';g.lineWidth=3;g.stroke();
  g.strokeStyle=B.fl>0?'#fff':'#d8b45a';g.lineWidth=5;
  for(const s of[-1,1]){g.beginPath();g.moveTo(B.x+s*B.rad*.6,B.y-B.rad*.65);g.quadraticCurveTo(B.x+s*B.rad*1.3,B.y-B.rad,B.x+s*B.rad*1.1,B.y-B.rad*1.6);g.stroke()}
  g.fillStyle=B.p2?'#ff5030':'#e8c34a';g.beginPath();g.arc(B.x-B.rad*.27,B.y-4,3,0,7);g.arc(B.x+B.rad*.27,B.y-4,3,0,7);g.fill();
  g.save();g.translate(B.x,B.y);g.rotate(B.ang);g.strokeStyle='#8a8a8a';g.lineWidth=6;g.beginPath();g.moveTo(B.rad,0);g.lineTo(B.rad+50,0);g.stroke();g.restore();
  shots.forEach(s=>{g.fillStyle='#ff8a30';g.beginPath();g.arc(s.x,s.y,7,0,7);g.fill()});
  g.save();g.globalAlpha=P.roll>0?.6:P.ig>0?.5:1;g.translate(P.x,P.y);
  g.fillStyle='#8c8472';g.beginPath();g.arc(0,0,15,0,7);g.fill();g.strokeStyle='#d8b45a';g.lineWidth=2;g.stroke();
  g.rotate(P.face+(P.atk>0?(.4-P.atk)/.4*2.4-1.2:0));g.strokeStyle='#e6e1d0';g.lineWidth=4;g.beginPath();g.moveTo(14,0);g.lineTo(P.atk>0?62:48,0);g.stroke();g.restore();
  fx.forEach(f=>{g.strokeStyle=(f.cr?'rgba(255,90,60,':'rgba(255,200,80,')+f.t*3+')';g.lineWidth=3;g.beginPath();g.arc(f.x,f.y,40-f.t*60,0,7);g.stroke()});
 }
 g.restore();
 if(P&&B){
  bar(24,22,220,12,P.hp/ST.hp,'#9a1f1f');bar(24,42,170,8,P.st/100,'#4f8a3a');
  txt(`Frascos: ${P.fl} · Dano ${ST.dmg}`,24,72,13,'#d8b45a','left');
  bar(CX-190,H-38,380,10,B.hp/B.max,'#a32a1d');txt(`${B.n} · Nv ${B.l} (${B.k})`,CX,H-48,14,'#d8c9a0');
  if(msgT>0&&state==='play')txt(msg,CX,70,16,`rgba(216,201,160,${Math.min(1,msgT)})`)}
 if(state==='dead'){g.fillStyle='rgba(20,0,0,.75)';g.fillRect(0,CY-70,W,140);txt('VOCÊ MORREU',CX,CY+14,64,'#a32a1d');txt('Enter para tentar de novo · Esc para o menu',CX,CY+52,15,'#b9b2a2')}
}
let last=performance.now();
(function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;update(dt);draw();requestAnimationFrame(loop)})(last);
menu();
