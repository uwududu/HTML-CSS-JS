// ===== Anel de Cinzas =====
const VERSION='1.4.1';
const GITHUB_URL='https://github.com/uwududu';
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
// Ataques novos: c=combo triplo, j=salto, k=estacas, o=orbes teleguiados, t=nova de projéteis, f=sopro em cone
const EX={'Dragão Agheel':'ft','Greyoll, Dragão Ancião':'ft','Lansseax, Dragão Ancião':'ftj','Fortissax, Dragão Morto-Vivo':'ftoj','Placidusax, Senhor Dragão':'ftojk','Rainha Rennala':'otk','Astel, Estrela do Vazio':'otj',
'Rellana, Gêmea Lua':'ocj','Elemer da Sarça':'ock','Sir Gideon Ofnir':'otc','Gigante de Fogo':'fkj','Wyrm de Magma':'fk','Rykard, Senhor da Blasfêmia':'fkc','Radahn, Flagelo das Estrelas':'jtok','Malenia, Lâmina de Miquella':'cjkt',
'Radagon do Anel Dourado':'ctjo','Fera Elden':'otkf','Maliketh, a Lâmina Negra':'cjkt','Mohg, Senhor do Sangue':'kjfo','Mohg, o Presságio':'kjf','Godrick, o Enxertado':'cj','Margit, o Presságio Funesto':'cj','Morgott, o Rei Presságio':'cjk',
'Godfrey, Primeiro Lorde Elden':'cjk','Lágrima Imitadora':'cj','Assassino da Lâmina Negra':'cjk','Alecto, Lâmina Negra Perseguidora':'cjk'};
ALL.forEach(b=>{let x=EX[b.n]||'';if(b.l>=2)x+='c';if(b.l>=4)x+='j';if(b.l>=5)x+='k';if(b.l>=7)x+='o';if(b.l>=9)x+='t';b.a=[...new Set(b.a+x)].join('')});

// ===== Progresso salvo =====
const DEF=()=>({runes:0,def:{},inv:[],eq:{},tab:'m',sk:{},sp:0,qd:{},dif:0,kc:{},nh:{},nf:{},tr:{},st:{kills:0,flawless:0,noroll:0,fast:0,noflask:0,refs:0,deaths:0,sold:0,earned:0}});
let S=DEF();
function norm(o){const d=DEF();S=Object.assign(d,typeof o==='object'&&o?o:{});S.st=Object.assign(DEF().st,S.st);S.sk=S.sk||{};S.qd=S.qd||{};S.def=S.def||{};['kc','nh','nf','tr'].forEach(k=>S[k]=S[k]||{});Object.keys(S.def).forEach(k=>S.kc[k]=S.kc[k]||1);S.runes=+S.runes||0;S.sp=+S.sp||0;
 if(!Array.isArray(S.inv)||!S.inv.length){S.inv=[{id:1,s:'w',r:0,l:0,n:'Espada Enferrujada',d:6}];S.eq={w:1}}S.eq=S.eq||{}}
try{norm(JSON.parse(localStorage.getItem('anelcinzas')||'{}'))}catch(e){norm({})}
const save=()=>{chkTr();try{localStorage.setItem('anelcinzas',JSON.stringify(S))}catch(e){}};

// ===== Equipamentos com RNG =====
const NM={w:['Espada Longa','Katana','Machado Grande','Lança Curva','Martelo','Adaga Ritual','Montante'],a:['Armadura de Cavaleiro','Manto Errante','Elmo de Ferro','Veste do Estrangeiro','Couraça de Pedra'],t:{reg:'Pena do Vigor',ls:'Sede de Sangue',cr:'Olho de Corvo'}};
const AF=['do Exilado','de Cinzas','Rubro','Sagrado','do Presságio','Dourado'],TL={reg:'regen. de vigor',ls:'roubo de vida',cr:'chance crítica'};
function gen(l,s=pr(['w','a','t']),fr=0){
 const ws=RAR.map((r,i)=>r[3]*(1+i*l*.08)),T=ws.reduce((a,b)=>a+b);let x=Math.random()*T,r=0;
 while(r<4&&x>=ws[r]){x-=ws[r];r++}r=Math.max(r,fr);
 const m=RAR[r][2],v=()=>rnd(.85,1.15),it={id:Date.now()+Math.random(),s,r,l};
 if(s==='w'){it.n=pr(NM.w);it.d=Math.round((8+l*1.4)*m*v())}
 if(s==='a'){it.n=pr(NM.a);it.hp=Math.round((10+l*3.2)*m*v());it.red=Math.min(45,Math.round((2+l*.3)*m*v()))}
 if(s==='t'){it.k=pr(['reg','ls','cr']);it.n=NM.t[it.k];it.v=Math.round({reg:15,ls:3,cr:6}[it.k]*m*v())}
 it.n+=' '+pr(AF);return it}
const desc=i=>i.s==='w'?`+${i.d} de dano`:i.s==='a'?`+${i.hp} de vida · −${i.red}% dano sofrido`:`+${i.v}% ${TL[i.k]}`;
const cost=i=>120+i.l*40+i.r*60,val=i=>30+i.l*15+i.r*40;
function stats(){const e=k=>S.inv.find(i=>i.id===S.eq[k])||{},w=e('w'),a=e('a'),t=e('t'),k=id=>S.sk[id]||0;
 return{dmg:Math.round((10+(w.d||0))*(1+.08*k('f1')+.1*k('f4'))),hp:100+(a.hp||0)+12*k('v1'),red:Math.min(50,(a.red||0)+2*k('v2')),reg:1+(t.k==='reg'?t.v/100:0)+.1*k('a2'),
  ls:(t.k==='ls'?t.v/100:0)+.02*k('f3'),cr:(t.k==='cr'?t.v/100:0)+.04*k('f2'),fl:3+k('v3'),heal:.4+.08*k('v4'),spd:1+.05*k('a1'),inv:.04*k('a3'),cost:20-2*k('a4')}}
const card=i=>`<div><b style="color:${RAR[i.r][1]}">${i.n}</b><small>${RAR[i.r][0]} · ${{w:'Arma',a:'Armadura',t:'Talismã'}[i.s]} · Nv ${i.l}</small><span>${desc(i)}</span></div>`;

// ===== Menus =====
let state='menu',P,B,cur,ST,zones=[],pools=[],shots=[],fx=[],shake=0,msg='',msgT=0;
function menu(){state='menu';ov.hidden=false;const m=S.tab==='m',L=m?MAIN:OPT,
 lock=b=>m?L.indexOf(b)>0&&!S.def[L[L.indexOf(b)-1].n]:!S.def[MAIN[0].n],cnt=l=>l.filter(b=>S.def[b.n]).length;
 ov.innerHTML=`<h1>Elden Ring em JS</h1><div class="bar"><span>Runas: <b>${S.runes}</b> · Pontos: <b>${S.sp}</b> · Abatidos: <b>${cnt(ALL)}/${ALL.length}</b></span><button data-a="inv">Equipamentos</button></div>
 <div class="acts"><button data-a="wp">Armas</button><button data-a="sk">Habilidades</button><button data-a="tr">Troféus</button><button data-a="df">Dificuldade: ${S.dif?'Pesadelo':'Difícil'}</button><button data-a="qs">Missões</button><button data-a="sv">Salvar (.txt)</button><button data-a="ld">Carregar (.txt)</button><button data-a="gh">GitHub</button></div>
 <div class="tabs"><button data-a="tab" data-v="m" class="${m?'on':''}">Principais (${cnt(MAIN)}/${MAIN.length})</button><button data-a="tab" data-v="o" class="${m?'':'on'}">Opcionais (${cnt(OPT)}/${OPT.length})</button></div>
 ${!m&&lock(OPT[0])?'<p class="note">Derrote Margit para liberar os chefes opcionais.</p>':''}${m?'<p class="note">Os chefes principais são liberados em sequência.</p>':''}
 <div class="list">${L.map(b=>`<button data-a="go" data-n="${b.n}" ${lock(b)?'disabled':''}><span>${S.def[b.n]?'✔ ':''}${b.n}</span><small>Nv ${b.l}</small></button>`).join('')}</div><p class="ver">Anel de Cinzas · versão ${VERSION}</p>`}
function inv(note=''){state='inv';ov.hidden=false;const s=stats(),its=[...S.inv].sort((a,b)=>b.r-a.r||b.l-a.l);
 ov.innerHTML=`<h1>Equipamentos</h1><div class="bar"><span>Runas: <b>${S.runes}</b></span><button data-a="menu">Voltar</button></div>
 <p class="note">Dano ${s.dmg} · Vida ${s.hp} · Redução ${s.red}% · Vigor +${Math.round((s.reg-1)*100)}% · Roubo de vida ${Math.round(s.ls*100)}% · Crítico ${Math.round(s.cr*100)}%</p>
 <p class="note">Reforjar sorteia um item novo do mesmo tipo (pode piorar ou melhorar).</p>${note}
 <div class="list">${its.map(i=>{const q=Object.values(S.eq).includes(i.id);return `<div class="it" style="border-color:${RAR[i.r][1]}">${card(i)}<div class="acts"><button data-a="eq" data-id="${i.id}" ${q?'disabled':''}>${q?'Equipado':'Equipar'}</button><button data-a="rf" data-id="${i.id}">Reforjar ${cost(i)}</button><button data-a="sell" data-id="${i.id}" ${q?'disabled':''}>Vender +${val(i)}</button></div></div>`}).join('')}</div>`}
ov.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,it=S.inv.find(i=>String(i.id)===b.dataset.id);
 if(a==='tab'){S.tab=b.dataset.v;menu()}else if(a==='inv')inv();else if(a==='menu')menu();
 else if(a==='go')fight(ALL.find(x=>x.n===b.dataset.n));else if(a==='again')fight(cur);
 else if(a==='wp')weapons();else if(a==='sk')skills();else if(a==='tr')trophies();else if(a==='gh')window.open(GITHUB_URL,'_blank','noopener');else if(a==='df'){S.dif=S.dif?0:1;save();menu()}else if(a==='qs')quests();else if(a==='sv')exportSave();else if(a==='ld')fl.click();
 else if(a==='sn'){const s=SK.find(x=>x[0]===b.dataset.id);if(s&&S.sp>0&&(S.sk[s[0]]||0)<s[3]&&(!s[4]||S.sk[s[4]])){S.sp--;S.sk[s[0]]=(S.sk[s[0]]||0)+1;save()}skills()}
 else if(a==='rs'){const n=Object.values(S.sk).reduce((x,y)=>x+y,0);if(!n)return skills();if(S.runes<300)return skills('<p class="note">Runas insuficientes.</p>');S.runes-=300;S.sp+=n;S.sk={};save();skills('<p class="note">Habilidades redefinidas.</p>')}
 else if(a==='cl'){const q=QS.find(x=>x[0]===b.dataset.id);if(q&&!S.qd[q[0]]&&q[3]()>=q[4]){S.qd[q[0]]=1;const i=gen(q[6],undefined,q[5]);i.n='★ '+i.n;S.inv.push(i);S.sp+=q[7];save();
  quests(`<div class="it" style="border-color:${RAR[i.r][1]}">${card(i)}</div><p class="note">Missão concluída! +${q[7]} ponto(s) de habilidade.</p>`)}}
 else if(a==='ca'){let n=0,p=0;QS.forEach(q=>{if(!S.qd[q[0]]&&q[3]()>=q[4]){S.qd[q[0]]=1;const i=gen(q[6],undefined,q[5]);i.n='★ '+i.n;S.inv.push(i);S.sp+=q[7];n++;p+=q[7]}});if(n)save();quests(n?`<p class="note">${n} missão(ões) resgatada(s): +${p} ponto(s) de habilidade e ${n} equipamento(s) ★.</p>`:'')}
 else if(a==='eq'){S.eq[it.s]=it.id;save();state==='wp'?weapons():inv()}
 else if(a==='sell'){S.runes+=val(it);S.st.sold++;S.inv=S.inv.filter(i=>i!==it);save();inv()}
 else if(a==='rf'){if(S.runes<cost(it))return inv('<p class="note">Runas insuficientes.</p>');S.runes-=cost(it);S.st.refs++;
  const n=gen(it.l,it.s);n.id=it.id;S.inv[S.inv.indexOf(it)]=n;save();inv(`<p class="note">Reforjado: ${n.n} (${RAR[n.r][0]})</p>`)}};

// ===== Árvore de habilidades =====
const SK=[['f1','Força Bruta','Guerreiro',5,'','+8% de dano'],['f2','Olho Afiado','Guerreiro',5,'f1','+4% de crítico'],['f3','Sede de Sangue','Guerreiro',3,'f2','+2% de roubo de vida'],['f4','Fúria','Guerreiro',4,'f3','+10% de dano'],
['v1','Vigor','Sobrevivente',5,'','+12 de vida'],['v2','Pele de Ferro','Sobrevivente',5,'v1','+2% de redução de dano'],['v3','Frasco Extra','Sobrevivente',3,'v2','+1 frasco'],['v4','Frasco Potente','Sobrevivente',3,'v3','+8% de cura'],
['a1','Pés Leves','Ágil',4,'','+5% de velocidade'],['a2','Fôlego','Ágil',5,'a1','+10% de regen. de vigor'],['a3','Rolagem Perfeita','Ágil',3,'a2','+0,04s de invulnerabilidade'],['a4','Dança das Lâminas','Ágil',4,'a3','−2 de custo de vigor']];
function skills(note=''){state='sk';ov.hidden=false;const rk=id=>S.sk[id]||0;
 ov.innerHTML=`<h1>Árvore de Habilidades</h1><div class="bar"><span>Pontos: <b>${S.sp}</b></span><button data-a="rs">Redefinir (300 runas)</button><button data-a="menu">Voltar</button></div>${note}
 <p class="note">Ganhe pontos ao derrotar chefes pela primeira vez (2 nos principais) e ao concluir missões.</p>
 ${['Guerreiro','Sobrevivente','Ágil'].map(br=>`<h3>${br}</h3><div class="list">${SK.filter(s=>s[2]===br).map(([id,n,,mx,rq,d])=>{const lock=rq&&!rk(rq),r=rk(id);
  return `<button data-a="sn" data-id="${id}" ${lock||r>=mx||S.sp<1?'disabled':''}><span>${n} <small>${r}/${mx} · ${d} por nível${lock?' · requer '+SK.find(x=>x[0]===rq)[1]:''}</small></span><small>1 pt</small></button>`}).join('')}</div>`).join('')}`}
// ===== Missões secundárias =====
const dn=(...n)=>n.filter(x=>S.def[x]).length;
const QS=[['q1','Primeiro Sangue','Derrote 3 chefes',()=>S.st.kills,3,2,3,1],
['q2','Intocável','Derrote um chefe sem sofrer dano',()=>S.st.flawless,1,3,5,1],
['q3','Pés no Chão','Derrote um chefe sem rolar',()=>S.st.noroll,1,2,4,1],
['q4','Relâmpago','Derrote um chefe em menos de 45s',()=>S.st.fast,1,3,6,1],
['q5','Jejum de Frascos','Derrote 3 chefes sem usar frascos',()=>S.st.noflask,3,2,4,1],
['q6','Ferreiro Teimoso','Reforje 5 itens',()=>S.st.refs,5,2,5,1],
['q7','Caçador de Presságios','Derrote Margit, Morgott e Mohg, o Presságio',()=>dn('Margit, o Presságio Funesto','Morgott, o Rei Presságio','Mohg, o Presságio'),3,3,8,2],
['q8','Mata-Dragões','Derrote Agheel, Greyoll, Lansseax, Fortissax e Placidusax',()=>dn('Dragão Agheel','Greyoll, Dragão Ancião','Lansseax, Dragão Ancião','Fortissax, Dragão Morto-Vivo','Placidusax, Senhor Dragão'),5,4,12,2],
['q9','Lâminas Negras','Derrote o Assassino da Lâmina Negra, Alecto e Maliketh',()=>dn('Assassino da Lâmina Negra','Alecto, Lâmina Negra Perseguidora','Maliketh, a Lâmina Negra'),3,4,11,2],
['q10','Veterano','Derrote 15 chefes',()=>S.st.kills,15,3,8,2],
['q11','Rei dos Opcionais','Derrote 20 chefes opcionais',()=>OPT.filter(b=>S.def[b.n]).length,20,4,12,2],
['q12','Lenda de Cinzas','Derrote Malenia, Lâmina de Miquella',()=>dn('Malenia, Lâmina de Miquella'),1,4,16,3]];
const qst=q=>S.qd[q[0]]?2:q[3]()>=q[4]?0:1,own=f=>()=>S.inv.filter(f).length,skn=()=>Object.values(S.sk).reduce((a,b)=>a+b,0),lvf=(m,up)=>ALL.filter(b=>up?b.l>=m:b.l<=m),dd=l=>()=>l.filter(b=>S.def[b.n]).length;
QS.push(
['q13','Meio Caminho','Derrote 24 chefes diferentes',dd(ALL),24,3,10,2],
['q14','Lorde Elden','Derrote todos os chefes principais',dd(MAIN),MAIN.length,4,14,3],
['q15','Mestre dos Opcionais','Derrote todos os chefes opcionais',dd(OPT),OPT.length,4,18,4],
['q16','Exterminador','Derrote todos os chefes do jogo',dd(ALL),ALL.length,4,20,5],
['q17','Aprendiz','Derrote todos os chefes até o nível 3',dd(lvf(3)),lvf(3).length,2,4,1],
['q18','Veterano de Guerra','Derrote todos os chefes até o nível 7',dd(lvf(7)),lvf(7).length,3,9,2],
['q19','Mestre das Cinzas','Derrote todos os chefes até o nível 11',dd(lvf(11)),lvf(11).length,4,13,3],
['q20','Além do Limite','Derrote todos os chefes de nível 12 ou mais',dd(lvf(12,1)),lvf(12,1).length,4,18,3],
['q21','Semideuses','Derrote Godrick, Rennala, Radahn, Rykard, Mohg, Morgott e Malenia',()=>dn('Godrick, o Enxertado','Rainha Rennala','Radahn, Flagelo das Estrelas','Rykard, Senhor da Blasfêmia','Mohg, Senhor do Sangue','Morgott, o Rei Presságio','Malenia, Lâmina de Miquella'),7,4,13,2],
['q22','Servos de Godskin','Derrote o Apóstolo e o Nobre Godskin',()=>dn('Apóstolo Godskin','Nobre Godskin'),2,3,7,1],
['q23','Comandantes','Derrote Niall e O\'Neil',()=>dn('Comandante Niall',"Comandante O'Neil"),2,3,6,1],
['q24','Guardiões da Árvore','Derrote a Sentinela, o Espírito Ulcerado, o Avatar Pútrido e o Espírito Ancestral',()=>dn('Sentinela da Árvore','Espírito da Árvore Ulcerada','Avatar Pútrido','Espírito Ancestral'),4,3,8,1],
['q25','Cavaleiros e Guardiões','Derrote 6 cavaleiros e guardiões de elite',()=>dn('Cavaleiro Crucible','Cavaleiro Noturno','Loretta, Cavaleira Real','Sir Gideon Ofnir','Rellana, Gêmea Lua','Vigia Funerário'),6,3,9,2],
['q26','Feras e Aberrações','Derrote 7 feras e aberrações',()=>dn('Lobo Vermelho de Radagon','Ave do Ritual da Morte','Omenkiller','Cristaliano','Troll Escavador','Wyrm de Magma','Gárgulas Valentes'),7,3,8,2],
['q27','Duelistas','Derrote 5 duelistas',()=>dn('Caçador do Sino','Assassino da Lâmina Negra','Lágrima Imitadora','Elemer da Sarça','Marinheiro Tibia'),5,3,7,1],
['q28','Antigos e Titãs','Derrote Gigante de Fogo, Greyoll, Astel e Soldado Dragkin',()=>dn('Gigante de Fogo','Greyoll, Dragão Ancião','Astel, Estrela do Vazio','Soldado Dragkin'),4,4,12,2],
['q29','Mão de Fantasma','Derrote 3 chefes sem sofrer dano',()=>S.st.flawless,3,3,7,1],
['q30','Dançarino Lendário','Derrote 10 chefes sem sofrer dano',()=>S.st.flawless,10,4,13,3],
['q31','Sempre de Pé','Derrote 5 chefes sem rolar',()=>S.st.noroll,5,3,7,1],
['q32','Monge Imóvel','Derrote 15 chefes sem rolar',()=>S.st.noroll,15,4,12,2],
['q33','Velocista','Derrote 5 chefes em menos de 45s',()=>S.st.fast,5,3,8,2],
['q34','Raio Negro','Derrote 15 chefes em menos de 45s',()=>S.st.fast,15,4,13,2],
['q35','Asceta','Derrote 10 chefes sem usar frascos',()=>S.st.noflask,10,3,8,2],
['q36','Saqueador de Runas','Ganhe 5000 runas derrotando chefes',()=>S.st.earned,5000,2,6,1],
['q37','Senhor das Runas','Ganhe 25000 runas derrotando chefes',()=>S.st.earned,25000,3,10,2],
['q38','Mercador','Venda 10 itens',()=>S.st.sold,10,2,5,1],
['q39','Mestre Ferreiro','Reforje 20 itens',()=>S.st.refs,20,3,9,2],
['q40','Morrer é Aprender','Morra 10 vezes',()=>S.st.deaths,10,2,4,1],
['q41','Persistente','Morra 50 vezes',()=>S.st.deaths,50,3,8,2],
['q42','Brilho Dourado','Tenha um item Lendário',own(i=>i.r===4),1,4,12,2],
['q43','Arsenal','Tenha 5 itens Épicos ou melhores',own(i=>i.r>=3),5,3,9,2],
['q44','Mochila Cheia','Tenha 25 itens no inventário',()=>S.inv.length,25,2,6,1],
['q45','Colecionador de ★','Tenha 5 itens de missão (★)',own(i=>i.n.startsWith('★')),5,4,14,2],
['q46','Estudioso','Gaste 10 pontos de habilidade',skn,10,3,8,2],
['q47','Mestre das Habilidades','Preencha toda a árvore de habilidades (49 pontos)',skn,49,4,18,3]
);

function quests(note=''){state='qs';ov.hidden=false;
 ov.innerHTML=`<h1>Missões Secundárias</h1><div class="bar"><span>Pontos: <b>${S.sp}</b> · Concluídas: <b>${QS.filter(q=>S.qd[q[0]]).length}/${QS.length}</b></span><div class="acts"><button data-a="ca">Resgatar todas</button><button data-a="menu">Voltar</button></div></div>${note}
 <div class="list">${[...QS].sort((a,b)=>qst(a)-qst(b)).map(([id,n,d,fn,go,rar,lv,sp])=>{const p=Math.min(go,fn()),done=S.qd[id],rdy=!done&&p>=go;
  return `<div class="it" style="border-color:${RAR[rar][1]}"><div><b>${done?'✔ ':''}${n}</b><small>${d} · ${p}/${go}</small><span>Recompensa: equipamento ${RAR[rar][0]} ou melhor (Nv ${lv}) e ${sp} ponto(s) de habilidade</span></div><div class="acts"><button data-a="cl" data-id="${id}" ${rdy?'':'disabled'}>${done?'Concluída':'Resgatar'}</button></div></div>`}).join('')}</div>`}
// ===== Save em arquivo .txt =====
function exportSave(){const t='ANEL-DE-CINZAS-SAVE v2\n'+JSON.stringify(S,null,1),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));
 a.download='anel-de-cinzas-save.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
const fl=document.createElement('input');fl.type='file';fl.accept='.txt,text/plain';
fl.onchange=()=>{const f=fl.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{let ok=1;try{const t=String(rd.result);if(!t.startsWith('ANEL-DE-CINZAS-SAVE'))throw 0;norm(JSON.parse(t.slice(t.indexOf('\n')+1)));save()}catch(e){ok=0}
 menu();ov.insertAdjacentHTML('beforeend',ok?'<p class="note">Save carregado!</p>':'<p class="note">Arquivo de save inválido.</p>')};rd.readAsText(f);fl.value=''};
// ===== Troféus (mesmo sistema do Elden Ring: 24 bronze, 14 prata, 3 ouro e a platina) =====
const TN=['Bronze','Prata','Ouro','Platina'],TC=['#cd7f32','#c8ccd2','#ffd24a','#9fd8ff'],RW=[[2,6,1],[3,11,2],[4,16,3]],
RWD=['equipamento Raro ou melhor (Nv 6) e 1 ponto de habilidade','equipamento Épico ou melhor (Nv 11) e 2 pontos de habilidade','equipamento Lendário (Nv 16) e 3 pontos de habilidade','3 equipamentos Lendários (Nv 22), 10 pontos de habilidade e 10.000 runas'];
const leg=x=>S.inv.filter(i=>i.s===x&&i.r===4);
const TRB=[['Margit, the Fell Omen',0,'Margit, o Presságio Funesto'],['Rennala, Queen of the Full Moon',0,'Rainha Rennala'],['Godskin Noble',0,'Nobre Godskin'],['Fire Giant',0,'Gigante de Fogo'],
['Godfrey the First Lord',0,'Godfrey, Primeiro Lorde Elden'],['Mohg, the Omen',0,'Mohg, o Presságio'],['Mimic Tear',0,'Lágrima Imitadora'],['Royal Knight Loretta',0,'Loretta, Cavaleira Real'],
['Astel, Naturalborn of the Void',0,'Astel, Estrela do Vazio'],['Leonine Misbegotten',0,'Omenkiller'],['Elemer of the Briar',0,'Elemer da Sarça'],['Ancestor Spirit',0,'Espírito Ancestral'],
['Commander Niall',0,'Comandante Niall'],['Dragonkin Soldier of Nokstella',0,'Soldado Dragkin'],['Lichdragon Fortissax',0,'Fortissax, Dragão Morto-Vivo'],['Magma Wyrm Makar',0,'Wyrm de Magma'],
['Red Wolf of Radagon',0,'Lobo Vermelho de Radagon'],['Valiant Gargoyle',0,'Gárgulas Valentes'],
['Shardbearer Godrick',1,'Godrick, o Enxertado'],['Shardbearer Radahn',1,'Radahn, Flagelo das Estrelas'],['Shardbearer Morgott',1,'Morgott, o Rei Presságio'],['Shardbearer Rykard',1,'Rykard, Senhor da Blasfêmia'],
['Shardbearer Malenia',1,'Malenia, Lâmina de Miquella'],['Shardbearer Mohg',1,'Mohg, Senhor do Sangue'],['Maliketh the Black Blade',1,'Maliketh, a Lâmina Negra'],['Dragonlord Placidusax',1,'Placidusax, Senhor Dragão']];
const TR=TRB.map(([n,t,b])=>[n,t,'Derrote '+b,()=>S.def[b]?1:0,1]).concat([
['Godskin Duo',0,'Derrote o Apóstolo Godskin e o Nobre Godskin',()=>dn('Apóstolo Godskin','Nobre Godskin'),2],
['Loretta, Knight of the Haligtree',0,'Derrote Loretta, Cavaleira Real pela segunda vez',()=>S.kc['Loretta, Cavaleira Real']||0,2],
['Regal Ancestor Spirit',0,'Derrote o Espírito Ancestral sem sofrer dano',()=>S.nh['Espírito Ancestral']?1:0,1],
['Roundtable Hold',0,'Derrote seu primeiro chefe e chegue à Távola Redonda',()=>S.st.kills,1],
['Great Rune',0,'Restaure uma Grande Runa: derrote um portador de fragmento ou Rennala',()=>dn('Godrick, o Enxertado','Rainha Rennala','Radahn, Flagelo das Estrelas','Rykard, Senhor da Blasfêmia','Mohg, Senhor do Sangue','Morgott, o Rei Presságio','Malenia, Lâmina de Miquella'),1],
['Erdtree Aflame',0,'Derrote o Gigante de Fogo e Maliketh e incendeie a Árvore Dourada',()=>dn('Gigante de Fogo','Maliketh, a Lâmina Negra'),2],
['Hoarah Loux the Warrior',1,'Derrote Godfrey, Primeiro Lorde Elden pela segunda vez (Trono Elden)',()=>S.kc['Godfrey, Primeiro Lorde Elden']||0,2],
['God-Slaying Armament',1,'Tenha uma arma Lendária (o estágio mais alto)',()=>leg('w').length,1],
['Legendary Armaments',1,'Tenha 3 armas Lendárias',()=>leg('w').length,3],
['Legendary Ashen Remains',1,'Tenha 3 armaduras Lendárias',()=>leg('a').length,3],
['Legendary Sorceries and Incantations',1,'Complete um ramo inteiro da árvore de habilidades',()=>['Guerreiro','Sobrevivente','Ágil'].filter(br=>SK.filter(x=>x[2]===br).every(x=>(S.sk[x[0]]||0)>=x[3])).length,1],
['Legendary Talismans',1,'Tenha um talismã Lendário de cada efeito (regeneração, roubo de vida e crítico)',()=>new Set(leg('t').map(i=>i.k)).size,3],
['Elden Lord',2,'Derrote Radagon do Anel Dourado e a Fera Elden',()=>dn('Radagon do Anel Dourado','Fera Elden'),2],
['Age of the Stars',2,'Derrote Radahn, Rennala, Rellana e Astel (estrelas e luas)',()=>dn('Radahn, Flagelo das Estrelas','Rainha Rennala','Rellana, Gêmea Lua','Astel, Estrela do Vazio'),4],
['Lord of Frenzied Flame',2,'Derrote a Fera Elden sem usar nenhum frasco',()=>S.nf['Fera Elden']?1:0,1]]);
TR.push(['Elden Ring',3,'Obtenha todos os troféus',()=>Object.keys(S.tr).filter(k=>k!=='Elden Ring').length,TR.length]);
const tc=document.createElement('div');tc.id='toasts';document.body.append(tc);
function toast(t){const d=document.createElement('div');d.className='toast';d.innerHTML=`<b style="color:${TC[t[1]]}">🏆 Troféu de ${TN[t[1]]}</b><br>${t[0]}`;tc.append(d);setTimeout(()=>d.remove(),5000)}
function unlock(t){S.tr[t[0]]=Date.now();const k=t[1];
 if(k===3){['w','a','t'].forEach(x=>{const i=gen(22,x,4);i.n='🏆 '+i.n;S.inv.push(i)});S.sp+=10;S.runes+=10000}
 else{const[r,l,p]=RW[k],i=gen(l,undefined,r);i.n='🏆 '+i.n;S.inv.push(i);S.sp+=p}
 toast(t)}
function chkTr(){TR.forEach(t=>{if(!S.tr[t[0]]&&t[3]()>=t[4])unlock(t)})}
function trophies(){state='tr';ov.hidden=false;const done=t=>S.tr[t[0]],cnt=k=>TR.filter(t=>t[1]===k&&done(t)).length,tot=k=>TR.filter(t=>t[1]===k).length;
 ov.innerHTML=`<h1>Troféus</h1><div class="bar"><span><b>${Object.keys(S.tr).length}/${TR.length}</b></span><button data-a="menu">Voltar</button></div>
 <p class="note">${[3,2,1,0].map(k=>`<b style="color:${TC[k]}">${TN[k]}</b> ${cnt(k)}/${tot(k)}`).join(' · ')}</p>
 <p class="note">Os troféus são desbloqueados sozinhos e dão equipamentos e pontos. A Platina vem ao conquistar todos os outros.</p>
 <div class="list">${[...TR].sort((a,b)=>b[1]-a[1]||(!!done(a))-(!!done(b))).map(t=>{const d=done(t),c=Math.min(t[4],t[3]()),k=t[1];
  return `<div class="it" style="border-color:${TC[k]};${d?'opacity:.7':''}"><div><b style="color:${TC[k]}">${d?'✔ ':''}${t[0]}</b><small>${TN[k]} · ${c}/${t[4]}</small><span>${t[2]}</span><span>Recompensa: ${RWD[k]}</span></div></div>`}).join('')}</div>`}
// ===== Minhas armas =====
const wico=n=>/Machado/.test(n)?'🪓':/Martelo/.test(n)?'🔨':/Lança/.test(n)?'🔱':/Adaga/.test(n)?'🗡️':'⚔️';
function weapons(){state='wp';ov.hidden=false;const k=id=>S.sk[id]||0,m=1+.08*k('f1')+.1*k('f4'),eff=i=>Math.round((10+i.d)*m),
 ws=S.inv.filter(i=>i.s==='w').sort((a,b)=>b.d-a.d),cur=S.inv.find(i=>i.id===S.eq.w),ce=cur?eff(cur):10;
 ov.innerHTML=`<h1>Minhas Armas</h1><div class="bar"><span>${ws.length} arma(s) · Dano atual: <b>${stats().dmg}</b></span><div class="acts"><button data-a="inv">Equipamentos</button><button data-a="menu">Voltar</button></div></div>
 <p class="note">O dano mostrado já inclui seus bônus de habilidade. Para vender ou reforjar, abra Equipamentos.</p>
 <div class="list">${ws.length?ws.map(i=>{const q=cur&&cur.id===i.id,df=eff(i)-ce;
  return `<div class="it" style="border-color:${RAR[i.r][1]}"><div><b style="color:${RAR[i.r][1]}">${wico(i.n)} ${i.n}</b><small>${RAR[i.r][0]} · Nv ${i.l}</small><span>Dano total: <b>${eff(i)}</b> (arma +${i.d})${q?' · equipada':df?` · ${df>0?'+':'−'}${Math.abs(df)} em relação à equipada`:''}</span></div><div class="acts"><button data-a="eq" data-id="${i.id}" ${q?'disabled':''}>${q?'Equipada':'Equipar'}</button></div></div>`}).join(''):'<p class="note">Você ainda não tem nenhuma arma.</p>'}</div>`}
// ===== Golpes assinatura dos chefes =====
// Letras: s golpe, c combo triplo, d investida, l pancada, L pancada gigante, j salto, J mergulho retardado, k estacas, o orbes teleguiados,
// t nova, f sopro em cone, p rajada, r chuva, g gravidade (puxa você), R poças persistentes. Uma sequência ("dddL") encadeia golpes rápidos.
const ATN={s:'Golpe',d:'Investida',l:'Pancada',p:'Rajada',r:'Chuva',c:'Combo Triplo',j:'Salto',o:'Orbes Teleguiados',t:'Nova',k:'Estacas',f:'Sopro'};
const MV={'Margit, o Presságio Funesto':[['Combo do Cajado','c'],['Adagas Sagradas','pp'],['Mergulho Retardado','J'],['Martelo Dourado','ls'],['Salto Esmagador','jl',2],['Adagas e Salto','pj',2]],
'Godrick, o Enxertado':[['Machadada','s'],['Giro do Machado','sl'],['Salto do Machado','jl'],['Investida do Machado','ds'],['Sopro do Dragão Enxertado','f',2],['Braço de Dragão','fl',3]],
'Rainha Rennala':[['Orbes Lunares','oo'],['Chuva de Estrelas','r'],['Nova Lunar','t'],['Cometas','rk',2],['Lua Cheia','ot',3]],
'Radahn, Flagelo das Estrelas':[['Espadada Dupla','sc'],['Chuva de Flechas','pp'],['Poço de Gravidade','gL'],['Meteoros','rr',2],['Investida Galopante','dd'],['Salto Estelar','jl'],['Gravidade e Meteoros','gr',3]],
'Rykard, Senhor da Blasfêmia':[['Espadada da Blasfêmia','sl'],['Poças de Lava','R'],['Cuspe de Magma','pp'],['Chama da Serpente','f',2],['Estacas de Magma','k'],['Erupção','Rl',3]],
'Mohg, Senhor do Sangue':[['Tridente de Sangue','cs'],['Pilares de Sangue','kR'],['Maré de Sangue','t'],['Salto Sangrento','jl'],['Chama de Sangue','fo',2],['Ritual de Sangue','Rt',3]],
'Morgott, o Rei Presságio':[['Combo do Cajado','c'],['Martelo Sagrado','L'],['Lanças de Luz','rk'],['Salto Maldito','jc'],['Orbes Sagrados','ot',2],['Fúria do Presságio','Lc',3]],
'Gigante de Fogo':[['Pisão','L'],['Espadada Flamejante','sl'],['Sopro Ígneo','f'],['Chuva de Fogo','rr',2],['Varredura','sc'],['Pisão Duplo','LL',3]],
'Maliketh, a Lâmina Negra':[['Lâmina Veloz','cc'],['Morte Predestinada','oo'],['Estocada Negra','dd'],['Chamas Negras','tk',2],['Salto Negro','jc'],['Corte do Destino','dsc',3]],
'Godfrey, Primeiro Lorde Elden':[['Machadada Dupla','ss'],['Agarrão','J'],['Rugido Selvagem','t'],['Investida','ds'],['Machado Giratório','sl'],['Fúria de Hoarah Loux','Jc',2]],
'Radagon do Anel Dourado':[['Martelo Dourado','Ls'],['Estrelas Elden','ot'],['Teleporte e Golpe','jc'],['Ordem Dourada','kk'],['Raio Dourado','f',2]],
'Fera Elden':[['Anel Elden','tt'],['Estrelas Elden','oo'],['Raio Dourado','f'],['Chuva Dourada','rr'],['Pancada Dourada','L'],['Fim da Ordem','Lt',3]],
'Malenia, Lâmina de Miquella':[['Dança da Ave Aquática','dddL'],['Corte Escarlate','sc'],['Flor de Podridão','R'],['Orbes de Podridão','ot'],['Investida Cega','dj'],['Florescer Escarlate','RL',3]],
'Placidusax, Senhor Dragão':[['Mordida','s'],['Raio Dourado','f'],['Tempestade Dracônica','tk'],['Salto Dracônico','jl'],['Chuva de Relâmpagos','rr',2],['Dança do Tempo','dddL',3]],
'Fortissax, Dragão Morto-Vivo':[['Mordida','s'],['Relâmpago Escuro','ot'],['Sopro Podre','f'],['Salto Dracônico','jl'],['Raios','rk',2]],
'Astel, Estrela do Vazio':[['Cometas','rr'],['Orbes do Vazio','oo'],['Nova do Vazio','t'],['Mergulho Estelar','J'],['Chuva e Orbes','ro',2]]};
function begin(k,ch){B.ty=k;B.s='wind';const a=Math.atan2(P.y-B.y,P.x-B.x);B.ang=a;
 let w=Math.max(.32,{s:.6,d:.75,l:.9,r:.8,p:.5,c:.5,j:1,o:.7,t:.8,k:.8,f:.85,J:1.5,L:1.2,g:1.1,R:.7}[k]/B.ph);if(ch)w=Math.max(.25,w*.6);B.w=B.t=w;B.cb=0;
 if(k==='l')zones.push({x:B.x,y:B.y,r:105+B.l*3.5,t:w,w});
 if(k==='L')zones.push({x:B.x,y:B.y,r:(105+B.l*3.5)*1.35,t:w,w});
 if(k==='r'){const nr=B.p3?6:B.p2?5:3;for(let i=0;i<nr;i++){const t=w+i*.25;zones.push({x:P.x+(i?rnd(-90,90):0),y:P.y+(i?rnd(-90,90):0),r:58,t,w:t})}B.t=w+nr*.25}
 if(k==='j'||k==='J'){B.jx=P.x;B.jy=P.y;B.jz={x:P.x,y:P.y,r:85,t:w,w};zones.push(B.jz)}
 if(k==='k'){const n=7;for(let i=0;i<n;i++){const t=w+i*.13,dd=60+i*55;zones.push({x:B.x+Math.cos(a)*dd,y:B.y+Math.sin(a)*dd,r:38,t,w:t})}B.t=w+n*.13}
 if(k==='R')for(let i=0;i<3;i++)pools.push({x:P.x+(i?rnd(-110,110):0),y:P.y+(i?rnd(-110,110):0),r:62,d:w,life:5.5,tk:0})}
// ===== Luta =====
function fight(b){cur=b;ST=stats();const mu=S.dif?1.3:1,hp=Math.round((300+b.l*110)*(S.dif?1.4:1));
 B={...b,x:CX+160,y:CY,hp,max:hp,s:'chase',t:1,ty:'',ang:0,w:1,ph:1,fl:0,dm:(24+b.l*2.8)*mu,rad:26+b.l*1.6,p2:0,cb:0,heal:/^Malenia/.test(b.n),q:[]};
 P={x:CX-170,y:CY,hp:ST.hp,st:100,face:0,roll:0,rx:1,ry:0,atk:0,hit:0,ig:0,fl:ST.fl,dr:0,sd:0,hurts:0,rolls:0,fls:0,tm:0};
 zones=[];pools=[];shots=[];fx=[];state='play';ov.hidden=true;say(b.n)}
function win(){state='win';const first=!S.def[B.n];S.def[B.n]=1;const rr=Math.round(B.l*140*(first?2:1)*(S.dif?2:1)),dr=[gen(B.l)];
 if(B.k==='Principal'||Math.random()<.5)dr.push(gen(B.l));S.runes+=rr;S.st.earned+=rr;S.inv.push(...dr);const sp=first?(B.k==='Principal'?2:1):0;S.sp+=sp;const q=S.st;q.kills++;if(!P.hurts)q.flawless++;if(!P.rolls)q.noroll++;if(P.tm<45)q.fast++;if(!P.fls)q.noflask++;S.kc[B.n]=(S.kc[B.n]||0)+1;if(!P.hurts)S.nh[B.n]=1;if(!P.fls)S.nf[B.n]=1;save();ov.hidden=false;
 ov.innerHTML=`<h1 class="gold">Grande Inimigo Abatido</h1><p class="note">${B.n} · +${rr} runas${first?' (primeira vez: dobro)':''}${sp?` · +${sp} ponto(s) de habilidade`:''}</p>
 <div class="list">${dr.map(i=>`<div class="it" style="border-color:${RAR[i.r][1]}">${card(i)}</div>`).join('')}</div>
 <div class="acts"><button data-a="again">Lutar de novo</button><button data-a="inv">Equipamentos</button><button data-a="menu">Menu</button></div>`}
const say=m=>{msg=m;msgT=3},K={},M={x:600,y:250};
onkeydown=e=>{K[e.code]=1;if(e.code==='Space')e.preventDefault();
 if(state==='play'){if(e.code==='Space')dodge();if(e.code==='KeyJ')atk();if(e.code==='KeyR')drink();if(e.code==='Escape')menu()}
 else if(state==='dead'){if(e.code==='Enter')fight(cur);if(e.code==='Escape')menu()}};
onkeyup=e=>K[e.code]=0;
c.onmousemove=e=>{const r=c.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height};
c.onmousedown=()=>atk();
function dodge(){if(P.roll>0||P.st<ST.cost||P.dr>0)return;let dx=(K.KeyD?1:0)-(K.KeyA?1:0),dy=(K.KeyS?1:0)-(K.KeyW?1:0);
 if(!dx&&!dy){dx=Math.cos(P.face);dy=Math.sin(P.face)}const l=Math.hypot(dx,dy);P.rx=dx/l;P.ry=dy/l;P.roll=.35;P.ig=.3+ST.inv;P.st-=ST.cost;P.sd=.75;P.atk=0;P.rolls++}
function atk(){if(state!=='play'||P.atk>0||P.roll>0||P.st<8||P.dr>0)return;P.atk=.4;P.hit=0;P.st-=ST.cost;P.sd=.85}
function drink(){if(P.fl<1||P.dr>0||P.roll>0)return;P.fl--;P.fls++;P.dr=.9}
const adiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)};
function hurt(d){if(P.ig>0)return;P.hurts++;const dd=d*(1-ST.red/100);P.hp-=dd;if(B&&B.heal)B.hp=Math.min(B.max,B.hp+dd*.6);P.ig=.4;shake=10;P.dr=0;if(P.hp<=0){P.hp=0;state='dead';S.st.deaths++;save()}}
function update(dt){
 if(state!=='play')return;
 P.face=Math.atan2(M.y-P.y,M.x-P.x);P.tm+=dt;
 let dx=(K.KeyD?1:0)-(K.KeyA?1:0),dy=(K.KeyS?1:0)-(K.KeyW?1:0),l=Math.hypot(dx,dy)||1,sp=P.dr>0?60:P.atk>0?70:170*ST.spd;
 if(P.roll>0){P.x+=P.rx*430*dt;P.y+=P.ry*430*dt;P.roll-=dt}else{P.x+=dx/l*sp*dt;P.y+=dy/l*sp*dt}
 const pd=Math.hypot(P.x-CX,P.y-CY);if(pd>R-14){P.x=CX+(P.x-CX)/pd*(R-14);P.y=CY+(P.y-CY)/pd*(R-14)}
 P.ig-=dt;P.sd-=dt;if(P.sd<=0)P.st=Math.min(100,P.st+38*ST.reg*dt);
 if(P.dr>0){P.dr-=dt;if(P.dr<=0){P.hp=Math.min(ST.hp,P.hp+ST.hp*ST.heal);say('Frasco consumido')}}
 if(P.atk>0){P.atk-=dt;if(P.atk<.28&&P.atk>.12&&!P.hit){const d=Math.hypot(B.x-P.x,B.y-P.y);
  if(d<80+B.rad&&adiff(Math.atan2(B.y-P.y,B.x-P.x),P.face)<1.1){P.hit=1;const cr=Math.random()<ST.cr,dm=ST.dmg*(cr?2:1);
   B.hp-=dm;P.hp=Math.min(ST.hp,P.hp+dm*ST.ls);B.fl=.12;shake=cr?7:4;fx.push({x:B.x,y:B.y,t:.3,cr})}}}
 // chefe
 if(!B.p2&&B.hp<B.max/2){B.p2=1;say('Fase 2')}if(!B.p3&&B.hp<B.max/4){B.p3=1;say('Fúria final!')}B.ph=(B.p3?1.7:B.p2?1.45:1)*(1+B.l*.02);
 const d=Math.hypot(P.x-B.x,P.y-B.y),a=Math.atan2(P.y-B.y,P.x-B.x);B.fl-=dt;B.t-=dt;
 if(B.s==='chase'){const cs=85*Math.min(B.ph,1.5)*dt;B.x+=Math.cos(a)*cs;B.y+=Math.sin(a)*cs;
  if(B.t<=0&&d<300){const fz=B.p3?3:B.p2?2:1,ms=(MV[B.n]||B.a.split('').map(x=>[ATN[x],x])).filter(m=>(m[2]||1)<=fz&&(d<=170||!'slcL'.includes(m[1][0])));
   if(!ms.length)B.t=.2;else{const m=pr(ms);B.mv=m[0];B.q=[...m[1]];begin(B.q.shift(),0)}}}
 else if(B.s==='wind'){
  if(B.t>.15&&'sdcf'.includes(B.ty))B.ang=a;
  if(B.ty==='J'&&B.t>.45){B.jx=P.x;B.jy=P.y;B.jz.x=P.x;B.jz.y=P.y}
  if(B.ty==='g'&&P.roll<=0){P.x-=Math.cos(a)*150*dt;P.y-=Math.sin(a)*150*dt}
  if(B.t<=0){B.s='act';B.t={s:.15,d:.4,c:.15,f:.7}[B.ty]||.05;B.done=0;
   if((B.ty==='s'||B.ty==='c')&&d<110+B.rad&&adiff(a,B.ang)<1.15)hurt(B.dm*(B.ty==='c'?(B.cb>=2?1.3:.75):1));
   if(B.ty==='j'||B.ty==='J'){B.x=B.jx;B.y=B.jy;shake=12}
   if(B.ty==='o'){const n=B.p3?5:B.p2?4:3;for(let i=0;i<n;i++){const an=a+(i-(n-1)/2)*.7;shots.push({x:B.x,y:B.y,vx:Math.cos(an)*150,vy:Math.sin(an)*150,h:1,life:4.5})}}
   if(B.ty==='t'){const n=B.p3?20:B.p2?16:12,o=Math.random()*6;for(let i=0;i<n;i++){const an=o+i*2*Math.PI/n;shots.push({x:B.x,y:B.y,vx:Math.cos(an)*210,vy:Math.sin(an)*210})}}
   if(B.ty==='p'){const n=B.p3?11:B.p2?9:7;for(let i=0;i<n;i++){const an=a+(i-(n-1)/2)*.22;shots.push({x:B.x,y:B.y,vx:Math.cos(an)*310,vy:Math.sin(an)*310})}}}}
 else if(B.s==='act'){
  if(B.ty==='f'){B.ft=(B.ft||0)-dt;if(B.ft<=0){B.ft=.18;if(d<260&&adiff(a,B.ang)<.55)hurt(B.dm*.45)}}
  if(B.ty==='d'){B.x+=Math.cos(B.ang)*760*dt;B.y+=Math.sin(B.ang)*760*dt;if(!B.done&&d<B.rad+22){B.done=1;hurt(B.dm*1.1)}}
  if(B.t<=0){
   if(B.ty==='c'&&B.cb<2){B.cb++;B.s='wind';B.w=B.t=Math.max(.28,.4/B.ph);B.ang=a}
   else if(B.q&&B.q.length)begin(B.q.shift(),1);
   else if(!MV[B.n]&&(B.ty==='s'||B.ty==='d')&&B.p2&&!B.cb){B.cb=1;B.s='wind';B.w=B.t=.4;B.ang=a}
   else{B.cb=0;B.s='rec';B.t=.55/B.ph;if(B.p2&&Math.random()<(B.p3?.5:.3))B.t=.12}}}
 else if(B.t<=0){B.s='chase';B.t=rnd(.1,.3)}
 const bd=Math.hypot(B.x-CX,B.y-CY);if(bd>R-30){B.x=CX+(B.x-CX)/bd*(R-30);B.y=CY+(B.y-CY)/bd*(R-30)}
 zones=zones.filter(z=>{z.t-=dt;if(z.t>0)return true;shake=Math.max(shake,6);if(Math.hypot(P.x-z.x,P.y-z.y)<z.r+10)hurt(B.dm*1.3);return false});
 pools=pools.filter(q=>{if(q.d>0){q.d-=dt;return true}q.life-=dt;q.tk-=dt;if(q.tk<=0&&Math.hypot(P.x-q.x,P.y-q.y)<q.r){hurt(B.dm*.35);q.tk=.5}return q.life>0});
 shots=shots.filter(s=>{if(s.h){s.life-=dt;const aa=Math.atan2(P.y-s.y,P.x-s.x);s.vx+=(Math.cos(aa)*150-s.vx)*1.6*dt;s.vy+=(Math.sin(aa)*150-s.vy)*1.6*dt;if(s.life<=0)return false}s.x+=s.vx*dt;s.y+=s.vy*dt;if(Math.hypot(P.x-s.x,P.y-s.y)<20){hurt(B.dm*.7);return false}return Math.hypot(s.x-CX,s.y-CY)<R+40});
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
  pools.forEach(q=>{g.fillStyle=q.d>0?'rgba(200,60,40,.15)':`hsla(${B.h},70%,42%,.5)`;g.strokeStyle='rgba(230,80,50,.8)';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,q.r,0,7);g.fill();g.stroke()});
  zones.forEach(z=>{const p=1-z.t/z.w;g.fillStyle=`rgba(190,30,20,${.12+.3*p})`;g.strokeStyle='rgba(230,60,40,.8)';g.lineWidth=2;
   g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.stroke();g.beginPath();g.arc(z.x,z.y,z.r*Math.max(p,.05),0,7);g.fill()});
  if(B.s==='wind'||B.s==='act'){const p=B.s==='act'?1:1-B.t/B.w;g.fillStyle=`rgba(190,30,20,${.15+.3*p})`;g.strokeStyle='rgba(230,60,40,.8)';
   if(B.ty==='s'||B.ty==='c'){g.beginPath();g.moveTo(B.x,B.y);g.arc(B.x,B.y,(110+B.rad)*Math.max(p,.3),B.ang-1.15,B.ang+1.15);g.closePath();g.fill();g.stroke()}
   if(B.ty==='d'){g.save();g.translate(B.x,B.y);g.rotate(B.ang);g.fillRect(0,-26,300*Math.max(p,.2),52);g.restore()}
   if(B.ty==='f'){g.beginPath();g.moveTo(B.x,B.y);g.arc(B.x,B.y,260*Math.max(p,.3),B.ang-.55,B.ang+.55);g.closePath();g.fill();g.stroke()}
   if(B.ty==='g'){g.strokeStyle='#b070ff';g.lineWidth=3;g.beginPath();g.arc(B.x,B.y,280*(1-p)+30,0,7);g.stroke()}}
  const body=B.fl>0?'#fff':`hsl(${B.h},35%,28%)`;
  g.fillStyle=body;g.beginPath();g.arc(B.x,B.y,B.rad,0,7);g.fill();g.strokeStyle='#d8b45a';g.lineWidth=3;g.stroke();
  g.strokeStyle=B.fl>0?'#fff':'#d8b45a';g.lineWidth=5;
  for(const s of[-1,1]){g.beginPath();g.moveTo(B.x+s*B.rad*.6,B.y-B.rad*.65);g.quadraticCurveTo(B.x+s*B.rad*1.3,B.y-B.rad,B.x+s*B.rad*1.1,B.y-B.rad*1.6);g.stroke()}
  g.fillStyle=B.p2?'#ff5030':'#e8c34a';g.beginPath();g.arc(B.x-B.rad*.27,B.y-4,3,0,7);g.arc(B.x+B.rad*.27,B.y-4,3,0,7);g.fill();
  g.save();g.translate(B.x,B.y);g.rotate(B.ang);g.strokeStyle='#8a8a8a';g.lineWidth=6;g.beginPath();g.moveTo(B.rad,0);g.lineTo(B.rad+50,0);g.stroke();g.restore();
  shots.forEach(s=>{g.fillStyle=s.h?'#c060ff':'#ff8a30';g.beginPath();g.arc(s.x,s.y,7,0,7);g.fill()});
  g.save();g.globalAlpha=P.roll>0?.6:P.ig>0?.5:1;g.translate(P.x,P.y);
  g.fillStyle='#8c8472';g.beginPath();g.arc(0,0,15,0,7);g.fill();g.strokeStyle='#d8b45a';g.lineWidth=2;g.stroke();
  g.rotate(P.face+(P.atk>0?(.4-P.atk)/.4*2.4-1.2:0));g.strokeStyle='#e6e1d0';g.lineWidth=4;g.beginPath();g.moveTo(14,0);g.lineTo(P.atk>0?62:48,0);g.stroke();g.restore();
  fx.forEach(f=>{g.strokeStyle=(f.cr?'rgba(255,90,60,':'rgba(255,200,80,')+f.t*3+')';g.lineWidth=3;g.beginPath();g.arc(f.x,f.y,40-f.t*60,0,7);g.stroke()});
 }
 g.restore();
 if(P&&B){
  bar(24,22,220,12,P.hp/ST.hp,'#9a1f1f');bar(24,42,170,8,P.st/100,'#4f8a3a');
  txt(`Frascos: ${P.fl} · Dano ${ST.dmg}`,24,72,13,'#d8b45a','left');
  bar(CX-190,H-38,380,10,B.hp/B.max,'#a32a1d');txt(`${B.n} · Nv ${B.l} (${B.k})`,CX,H-48,14,'#d8c9a0');if(B.mv&&(B.s==='wind'||B.s==='act'))txt(B.mv,CX,H-64,13,'#e8c070');
  if(msgT>0&&state==='play')txt(msg,CX,70,16,`rgba(216,201,160,${Math.min(1,msgT)})`)}
 if(state==='dead'){g.fillStyle='rgba(20,0,0,.75)';g.fillRect(0,CY-70,W,140);txt('VOCÊ MORREU',CX,CY+14,64,'#a32a1d');txt('Enter para tentar de novo · Esc para o menu',CX,CY+52,15,'#b9b2a2')}
}
let last=performance.now();
(function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;update(dt);draw();requestAnimationFrame(loop)})(last);
menu();