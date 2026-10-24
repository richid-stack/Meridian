(function(){
'use strict';
/* =====================================================================
   M1 + M2  Media system
   Art      procedural editorial illustration (stand-in for licensed photography)
   Media    registry, renderers (images, video, audio, files), lightbox, avatar enhancer
   Up       upload pipeline: pick, validate, process (compress, poster frame, waveform)
   Crop     avatar and cover cropper
   Tray     composer attachment tray and voice recorder
   ===================================================================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var fm=function(s){s=Math.max(0,Math.round(s||0));return Math.floor(s/60)+':'+(s%60<10?'0':'')+(s%60)};
var sz=function(b){return b>=1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB'};
var I={play:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',pause:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
x:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
l:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',r:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
ph:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
vd:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
mic:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
fl:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>',
zo:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4M8 11h6"/></svg>',zi:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4M8 11h6M11 8v6"/></svg>'};

/* ---------- Art ---------- */
var P={bg:'#0B2A21',bg2:'#0F3A2D',bg3:'#14503D',gold:'#E3B341',pale:'#E9EFEA'};
function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
var THEMES={
rail:function(r,W,H){var vx=W*(.55+r()*.15),vy=H*.38,s='<rect y="'+vy+'" width="'+W+'" height="'+(H-vy)+'" fill="'+P.bg2+'"/>',i,k;
for(i=-6;i<=6;i++)s+='<line x1="'+vx+'" y1="'+vy+'" x2="'+(vx+i*W*.16)+'" y2="'+H+'" stroke="'+P.gold+'" stroke-opacity="'+(i%2?.35:.9)+'" stroke-width="'+(i%2?2:3)+'"/>';
for(k=1;k<14;k++){var t=Math.pow(k/14,1.8),y=vy+(H-vy)*t,hw=W*.9*t;s+='<line x1="'+(vx-hw)+'" y1="'+y+'" x2="'+(vx+hw)+'" y2="'+y+'" stroke="'+P.pale+'" stroke-opacity=".12" stroke-width="'+(1+t*3)+'"/>'}
return s+'<circle cx="'+vx+'" cy="'+vy+'" r="'+(18+r()*10)+'" fill="'+P.gold+'"/>'},
route:function(r,W,H){var s='',x,y;for(x=40;x<W;x+=48)for(y=40;y<H;y+=48)s+='<circle cx="'+x+'" cy="'+y+'" r="2" fill="'+P.pale+'" fill-opacity=".14"/>';
var pts=[[.1,.75],[.32,.35+r()*.15],[.62,.62-r()*.1],[.9,.25+r()*.1]].map(function(p){return[p[0]*W,p[1]*H]}),d='M'+pts[0][0]+' '+pts[0][1];
for(var i=1;i<pts.length;i++){var a=pts[i-1],b=pts[i],mx=(a[0]+b[0])/2;d+=' C'+mx+' '+a[1]+' '+mx+' '+b[1]+' '+b[0]+' '+b[1]}
s+='<path d="'+d+'" fill="none" stroke="'+P.gold+'" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 16" stroke-opacity=".5"/><path d="'+d+'" fill="none" stroke="'+P.gold+'" stroke-width="3" stroke-linecap="round" stroke-dasharray="120 34"/>';
pts.forEach(function(p,i){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i===3?26:16)+'" fill="'+P.bg+'" stroke="'+P.gold+'" stroke-width="4"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i===3?10:6)+'" fill="'+P.gold+'"/>'});return s},
sun:function(r,W,H){var cx=W*(.62+r()*.12),cy=H*.52,s='',i;for(i=7;i>=1;i--)s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(60+i*58)+'" fill="none" stroke="'+P.gold+'" stroke-opacity="'+(.06+(8-i)*.03).toFixed(2)+'" stroke-width="3"/>';
s+='<circle cx="'+cx+'" cy="'+cy+'" r="92" fill="'+P.gold+'"/><rect y="'+H*.72+'" width="'+W+'" height="'+H*.28+'" fill="'+P.bg2+'"/>';
for(i=0;i<9;i++){var x=i*W/8-40;s+='<polygon points="'+x+','+H*.97+' '+(x+120)+','+H*.97+' '+(x+150)+','+H*.8+' '+(x+30)+','+H*.8+'" fill="'+P.bg3+'" stroke="'+P.pale+'" stroke-opacity=".25"/>'}return s},
clinic:function(r,W,H){var s='',x,y;for(x=60;x<W;x+=90)for(y=60;y<H*.75;y+=90)s+='<path d="M'+x+' '+(y-14)+'v28M'+(x-14)+' '+y+'h28" stroke="'+P.pale+'" stroke-opacity="'+(.05+r()*.2).toFixed(2)+'" stroke-width="4" stroke-linecap="round"/>';
var cx=W*(.3+r()*.1),cy=H*.38;s+='<path d="M'+cx+' '+(cy-110)+'v220M'+(cx-110)+' '+cy+'h220" stroke="'+P.gold+'" stroke-width="64" stroke-linecap="round"/>';
var py=H*.84,d='M0 '+py;for(x=0;x<=W;x+=20){var o=(x>W*.45&&x<W*.6)?-Math.sin((x-W*.45)/(W*.15)*Math.PI)*90*(x%40?1:-.6):Math.sin(x/37)*3;d+=' L'+x+' '+(py+o)}
return s+'<path d="'+d+'" fill="none" stroke="'+P.gold+'" stroke-width="5" stroke-linejoin="round"/>'},
network:function(r,W,H){var n=[],s='',i;for(i=0;i<16;i++)n.push([60+r()*(W-120),50+r()*(H-100),4+r()*8]);
n.forEach(function(a,i){n.map(function(b,j){return[j,(a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1])]}).filter(function(x){return x[0]!==i}).sort(function(p,q){return p[1]-q[1]}).slice(0,2).forEach(function(x){var b=n[x[0]];s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+P.pale+'" stroke-opacity=".22" stroke-width="2"/>'})});
n.forEach(function(a,i){s+='<circle cx="'+a[0]+'" cy="'+a[1]+'" r="'+(i===0?30:a[2])+'" fill="'+(i===0?P.gold:P.bg3)+'" stroke="'+P.gold+'" stroke-width="'+(i===0?0:2)+'"/>'});return s}};
var cache={};
function artUri(theme,seed){var key=theme+seed;if(cache[key])return cache[key];var W=1200,H=675,r=rng((seed||1)*9973+theme.length*31);
var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice"><defs><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .05 0"/></filter></defs><rect width="100%" height="100%" fill="'+P.bg+'"/>'+THEMES[theme](r,W,H)+'<rect width="100%" height="100%" filter="url(#n)"/></svg>';
return cache[key]='data:image/svg+xml;utf8,'+encodeURIComponent(svg)}
window.Art={uri:artUri};

/* ---------- Media: registry and renderers ---------- */
var REG={},GR={},cnt=0,AU={el:null,card:null,id:null};
function rid(it){var id='m'+(++cnt);REG[id]=it;return id}
function group(list){var g='g'+(++cnt);GR[g]=list;return g}
function hero(s){var src=s.src||artUri(s.art,s.seed||1),inner='<img class="mi-img" data-mi src="'+src+'" alt="'+esc(s.alt)+'" loading="lazy" decoding="async">';
if(s.lb){inner='<button class="lbb" data-lb="'+group([{src:src,alt:s.alt,cap:s.cap,credit:s.credit}])+':0" aria-label="View image larger">'+inner+'</button>'}
return '<figure class="herow"><div class="mi hero" style="aspect-ratio:'+(s.ar||'16/9')+'">'+inner+'</div>'+((s.cap||s.credit)?'<figcaption>'+esc(s.cap||'')+(s.credit?' <i>'+esc(s.credit)+'</i>':'')+'</figcaption>':'')+'</figure>'}
function render(items){var imgs=items.filter(function(i){return i.t==='img'}),h='';
if(imgs.length){var n=Math.min(imgs.length,4),gid=group(imgs.map(function(i){return{src:i.src,alt:i.alt,credit:i.credit}})),ar=n===1&&imgs[0].w?Math.max(.8,Math.min(1.78,imgs[0].w/imgs[0].h)):0;
h+='<div class="mg n'+n+'"'+(ar?' style="--ar:'+ar.toFixed(3)+'"':'')+'>'+imgs.slice(0,4).map(function(i,k){return'<button class="mgi" data-lb="'+gid+':'+k+'" aria-label="'+esc(i.alt||('Photo '+(k+1)+' of '+imgs.length))+'"><img src="'+i.src+'" alt="'+esc(i.alt)+'" loading="lazy" decoding="async"></button>'}).join('')+'</div>'}
items.forEach(function(it){
if(it.t==='vid'){var ar=it.w?Math.max(.6,Math.min(1.78,it.w/it.h)):1.78;h+='<div class="mv" data-id="'+rid(it)+'" style="--ar:'+ar.toFixed(3)+'"><img class="pst" src="'+it.poster+'" alt=""><button class="pl" data-vplay aria-label="Play video">'+I.play+'</button><span class="dur">'+fm(it.dur)+'</span></div>'}
if(it.t==='aud'){h+='<div class="ma" data-id="'+rid(it)+'"><button class="pb" data-aplay aria-label="Play voice note">'+I.play+'</button><div class="wv" role="slider" aria-label="Seek voice note" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">'+it.peaks.map(function(p){return'<i style="height:'+Math.round(6+p*28)+'px"></i>'}).join('')+'</div><span class="tm">'+fm(it.dur)+'</span></div>'}
if(it.t==='yt'&&window.ytCard)h+=window.ytCard({id:it.id});
if(it.t==='story'&&window.storyEmbed)h+=window.storyEmbed(it.id);
if(it.t==='doc'){h+='<a class="mf" href="'+(it.src||'#')+'" download="'+esc(it.name)+'"><div class="fi">PDF</div><div><b>'+esc(it.name)+'</b><small>'+sz(it.size)+'</small></div></a>'}});
return h}
function expand(root){var rs=root.nodeType===1?[root].concat($$('*',root)):[];
$$('[data-hero]',root.nodeType===1?root:document).concat(root.matches&&root.matches('[data-hero]')?[root]:[]).forEach(function(el){if(el.dataset.done)return;el.dataset.done=1;try{el.innerHTML=hero(JSON.parse(el.dataset.hero))}catch(e){}});
$$('[data-mg]',root.nodeType===1?root:document).concat(root.matches&&root.matches('[data-mg]')?[root]:[]).forEach(function(el){if(el.dataset.done)return;el.dataset.done=1;try{el.innerHTML=render(JSON.parse(el.dataset.mg).map(function(m){return{t:'img',src:artUri(m.art,m.seed||1),alt:m.alt,credit:m.credit}}))}catch(e){}});
$$('.vth[data-art]',root.nodeType===1?root:document).forEach(function(el){if(!el.dataset.done){el.dataset.done=1;el.style.backgroundImage='url("'+artUri(el.dataset.art,+el.dataset.seed||1)+'")'}})}
function ready(root){$$('img[data-mi]:not([data-r])',root.nodeType===1?root:document).forEach(function(i){i.dataset.r=1;var m=i.closest('.mi');if(i.complete&&i.naturalWidth)i.classList.add('ld');else{i.addEventListener('load',function(){i.classList.add('ld')});i.addEventListener('error',function(){m&&m.classList.add('err')})}})}

/* ---------- Media: avatar enhancer (images replace monogram tiles) ---------- */
var me={photo:null,cover:null,key:'R'},SEL='.av,.pe,.pe2,.mono-box';
function enhance(root){var base=root.nodeType===1?root:document,els=$$(SEL,base);if(base.matches&&base.matches(SEL))els.unshift(base);
els.forEach(function(el){var has=el.classList.contains('hasimg'),im=has&&el.querySelector(':scope>img');
if(has&&!im){el.classList.remove('hasimg');el.removeAttribute('data-k');has=false}
var k=has?el.dataset.k:(el.children.length?'':el.textContent.trim()),want=!!me.photo&&k===me.key;
if(want&&!has){el.dataset.k=k;el.textContent='';el.classList.add('hasimg');var i=new Image();i.alt='';i.src=me.photo;el.appendChild(i)}
else if(want&&has){if(im.getAttribute('src')!==me.photo)im.src=me.photo}
else if(!want&&has){el.classList.remove('hasimg');el.textContent=el.dataset.k;el.removeAttribute('data-k')}})}
function renderCover(){var w=$('#v-you main.wrap');if(!w)return;var c=$('.cvr',w);if(!me.cover){c&&c.remove();return}
if(!c){c=document.createElement('div');c.className='cvr';c.setAttribute('role','img');c.setAttribute('aria-label','Your cover photo');w.insertBefore(c,w.firstChild)}c.style.backgroundImage='url("'+me.cover+'")'}
window.Media={render:render,enhance:enhance,setMe:function(p,c,ini){me.photo=p||null;me.cover=c||null;if(ini)me.key=ini;enhance(document.body);renderCover()}};

/* ---------- Lightbox ---------- */
var lb=document.createElement('div');lb.id='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image viewer');
lb.innerHTML='<div class="top"><span class="ct"></span><button class="cl" aria-label="Close">'+I.x+'</button></div><div class="stg"><button class="nv p" aria-label="Previous photo">'+I.l+'</button><img alt=""><button class="nv n" aria-label="Next photo">'+I.r+'</button></div><div class="cap"></div>';
document.body.appendChild(lb);
var L={g:null,i:0,from:null};
function lbShow(){var it=GR[L.g][L.i],n=GR[L.g].length;$('img',lb).src=it.src;$('img',lb).alt=it.alt||'';$('.ct',lb).textContent=n>1?(L.i+1)+' of '+n:'';
$('.cap',lb).innerHTML=esc(it.cap||it.alt||'')+(it.credit?'<i>'+esc(it.credit)+'</i>':'');$('.nv.p',lb).hidden=n<2||L.i===0;$('.nv.n',lb).hidden=n<2||L.i===n-1}
function lbOpen(ref,from){var p=ref.split(':');L.g=p[0];L.i=+p[1]||0;if(!GR[L.g])return;L.from=from;lb.hidden=false;lbShow();$('.cl',lb).focus()}
function lbClose(){lb.hidden=true;$('img',lb).src='';L.from&&L.from.focus&&L.from.focus()}
function lbGo(d){var n=GR[L.g].length,j=L.i+d;if(j>=0&&j<n){L.i=j;lbShow()}}
lb.addEventListener('click',function(e){if(e.target.closest('.cl')||e.target.classList.contains('stg')||e.target===lb)lbClose();else if(e.target.closest('.nv.p'))lbGo(-1);else if(e.target.closest('.nv.n'))lbGo(1)});
var sx=null;lb.addEventListener('pointerdown',function(e){sx=e.clientX});lb.addEventListener('pointerup',function(e){if(sx!=null&&Math.abs(e.clientX-sx)>60&&e.target.tagName==='IMG')lbGo(e.clientX<sx?1:-1);sx=null});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')lbGo(-1);if(e.key==='ArrowRight')lbGo(1)});

/* ---------- Media: playback (video and audio cards) ---------- */
function toDataUri(file){return new Promise(function(res,rej){var f=new FileReader();f.onload=function(){res(f.result)};f.onerror=rej;f.readAsDataURL(file)})}
function stopAudio(){if(AU.el){AU.el.pause();setAud(AU.card,false)}}
function setAud(card,on){if(!card)return;card.classList.toggle('playing',on);var b=$('.pb',card);b.innerHTML=on?I.pause:I.play;b.setAttribute('aria-label',on?'Pause voice note':'Play voice note')}
function paintAud(card,ratio,dur){var bars=$$('.wv i',card);bars.forEach(function(b,i){b.classList.toggle('on',i/bars.length<ratio)});$('.wv',card).setAttribute('aria-valuenow',Math.round(ratio*100));$('.tm',card).textContent=ratio>0?fm(ratio*dur):fm(dur)}
function audioFor(card){var id=card.dataset.id,it=REG[id];if(AU.id===id&&AU.el)return AU.el;stopAudio();AU.el=new Audio();AU.id=id;AU.card=card;var a=AU.el;a.preload='auto';a.src=it.src;
a.addEventListener('timeupdate',function(){paintAud(card,Math.min(1,a.currentTime/it.dur),it.dur)});
a.addEventListener('ended',function(){setAud(card,false);paintAud(card,0,it.dur)});
a.addEventListener('error',function(){if(it.file&&!it.fell){it.fell=1;toDataUri(it.file).then(function(u){a.src=u;a.play()})}else{setAud(card,false);$('.tm',card).textContent='Unavailable'}});return a}
function audToggle(card){var a=audioFor(card);if(a.paused){$$('.mv video').forEach(function(v){v.pause()});a.play().then(function(){setAud(card,true)}).catch(function(){})}else{a.pause();setAud(card,false)}}
function audSeek(card,ratio){var it=REG[card.dataset.id],a=audioFor(card);a.currentTime=Math.max(0,Math.min(1,ratio))*it.dur;paintAud(card,ratio,it.dur)}
function vidPlay(box){var it=REG[box.dataset.id];stopAudio();var v=document.createElement('video');v.controls=true;v.playsInline=true;v.autoplay=true;v.setAttribute('playsinline','');v.src=it.src;
v.addEventListener('error',function(){if(it.file&&!it.fell){it.fell=1;toDataUri(it.file).then(function(u){v.src=u;v.play()})}else{v.remove();var m=document.createElement('div');m.className='vmsg';m.textContent='This video cannot be played in this preview. The file is attached.';box.appendChild(m)}});
$('.pst',box).remove();$('.pl',box).remove();$('.dur',box).remove();box.appendChild(v)}
document.addEventListener('click',function(e){var t=e.target,b;
if(b=t.closest('[data-lb]'))return lbOpen(b.dataset.lb,b);
if(b=t.closest('[data-vplay]'))return vidPlay(b.closest('.mv'));
if(b=t.closest('[data-aplay]'))return audToggle(b.closest('.ma'));
if(b=t.closest('.ma .wv')){var r=b.getBoundingClientRect();audSeek(b.closest('.ma'),(e.clientX-r.left)/r.width)}});
document.addEventListener('keydown',function(e){var w=e.target.closest&&e.target.closest('.ma .wv');if(!w||(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'))return;var c=w.closest('.ma'),it=REG[c.dataset.id],a=audioFor(c);audSeek(c,Math.max(0,Math.min(1,(a.currentTime+(e.key==='ArrowRight'?5:-5))/it.dur)));e.preventDefault()});

/* ---------- Up: upload pipeline ---------- */
var LIM={img:20,vid:100,aud:25,doc:20},NAME={img:'photos',vid:'video',aud:'voice note',doc:'file',yt:'video link',story:'news story'};
var Up={
pick:function(accept,multi){return new Promise(function(res){var i=document.createElement('input');i.type='file';i.accept=accept;if(multi)i.multiple=true;i.style.cssText='position:fixed;left:-9999px;top:0';i.addEventListener('change',function(){res([].slice.call(i.files));setTimeout(function(){i.remove()},0)});i.addEventListener('cancel',function(){i.remove()});document.body.appendChild(i);i.click()})},
check:function(kind,f){var mb=f.size/1048576;
if(kind==='img'&&!/^image\//.test(f.type)&&!/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name))return'Use a JPEG, PNG, or WebP photo.';
if(kind==='vid'&&!/^video\//.test(f.type))return'Choose a video file.';
if(kind==='aud'&&!/^audio\//.test(f.type))return'Choose an audio file.';
if(kind==='doc'&&f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name))return'Only PDF files are supported.';
if(mb>LIM[kind])return'Larger than '+LIM[kind]+' MB.';return null},
decode:function(f){var viaImg=function(){return new Promise(function(res,rej){var u=URL.createObjectURL(f),i=new Image();i.onload=function(){URL.revokeObjectURL(u);res(i)};i.onerror=function(){URL.revokeObjectURL(u);rej(new Error('format'))};i.src=u})};
return window.createImageBitmap?createImageBitmap(f,{imageOrientation:'from-image'}).catch(viaImg):viaImg()},
image:function(f,max){return Up.decode(f).then(function(b){var w=b.width||b.naturalWidth,h=b.height||b.naturalHeight,s=Math.min(1,max/Math.max(w,h)),cw=Math.round(w*s),ch=Math.round(h*s),c=document.createElement('canvas');c.width=cw;c.height=ch;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cw,ch);x.drawImage(b,0,0,cw,ch);if(b.close)b.close();var src=c.toDataURL('image/jpeg',.82);return{src:src,w:cw,h:ch}})},
video:function(f){return new Promise(function(res,rej){var u=URL.createObjectURL(f),v=document.createElement('video'),done=false,to=setTimeout(function(){rej(new Error('format'))},9000);v.preload='metadata';v.muted=true;v.playsInline=true;
v.onerror=function(){clearTimeout(to);rej(new Error('format'))};
v.onloadedmetadata=function(){if(v.duration>180){clearTimeout(to);rej(new Error('long'));return}v.currentTime=Math.min(.5,v.duration/2)};
v.onseeked=function(){if(done)return;done=true;clearTimeout(to);var s=Math.min(1,640/v.videoWidth),c=document.createElement('canvas');c.width=Math.round(v.videoWidth*s);c.height=Math.round(v.videoHeight*s);c.getContext('2d').drawImage(v,0,0,c.width,c.height);res({src:u,poster:c.toDataURL('image/jpeg',.8),dur:v.duration,w:v.videoWidth,h:v.videoHeight})};v.src=u})},
audio:function(f){var url=URL.createObjectURL(f);
var flat=function(){return new Promise(function(res,rej){var a=new Audio(),to=setTimeout(function(){rej(new Error('format'))},6000);a.preload='metadata';a.onloadedmetadata=function(){clearTimeout(to);var d=isFinite(a.duration)?a.duration:0;res({peaks:Array.apply(null,Array(48)).map(function(_,i){return .25+.2*Math.abs(Math.sin(i/3))}),dur:d})};a.onerror=function(){clearTimeout(to);rej(new Error('format'))};a.src=url})};
return(f.arrayBuffer?f.arrayBuffer():Promise.reject()).then(function(ab){var AC=window.AudioContext||window.webkitAudioContext,ctx=new AC();return new Promise(function(res,rej){ctx.decodeAudioData(ab,res,rej)}).then(function(buf){var d=buf.getChannelData(0),n=48,step=Math.floor(d.length/n),out=[],mx=0,i,j;for(i=0;i<n;i++){var m=0;for(j=0;j<step;j+=Math.max(1,step>>6))m=Math.max(m,Math.abs(d[i*step+j]||0));out.push(m);mx=Math.max(mx,m)}ctx.close();return{peaks:out.map(function(v){return mx?Math.max(.08,v/mx):.2}),dur:buf.duration}})}).catch(flat).then(function(r){r.src=url;return r})}};
var ERR={format:'This file could not be read. Try another format.',long:'Longer than 3 minutes.'};

/* ---------- Crop ---------- */
var cr=document.createElement('div');cr.id='crop';cr.hidden=true;cr.setAttribute('role','dialog');cr.setAttribute('aria-modal','true');cr.setAttribute('aria-label','Crop photo');
cr.innerHTML='<div class="hd"><button class="cn">Cancel</button><span>Adjust photo</span><button class="ok">Use photo</button></div><div class="stage"><div class="frame"><img alt=""></div></div><p class="tip">Drag to reposition. Pinch or use the slider to zoom.</p><div class="zm">'+I.zo+'<input type="range" min="100" max="300" value="100" aria-label="Zoom">'+I.zi+'</div>';
document.body.appendChild(cr);
var C={};
function crPlace(){var w=C.nw*C.s*C.z,h=C.nh*C.s*C.z,mx=(w-C.fw)/2,my=(h-C.fh)/2;C.ox=Math.max(-mx,Math.min(mx,C.ox));C.oy=Math.max(-my,Math.min(my,C.oy));var im=$('img',cr);im.style.width=w+'px';im.style.height=h+'px';im.style.left=(C.fw/2+C.ox-w/2)+'px';im.style.top=(C.fh/2+C.oy-h/2)+'px'}
var Crop={open:function(src,aspect,outW,cb){var im=$('img',cr);cr.hidden=false;C={cb:cb,aspect:aspect,outW:outW,z:1,ox:0,oy:0,src:src,ptr:{}};
var vw=window.innerWidth;C.fw=aspect<1?Math.min(vw-64,300):Math.min(vw-32,640);C.fh=C.fw/aspect;var f=$('.frame',cr);f.style.width=C.fw+'px';f.style.height=C.fh+'px';
im.onload=function(){C.nw=im.naturalWidth;C.nh=im.naturalHeight;C.s=Math.max(C.fw/C.nw,C.fh/C.nh);crPlace()};im.src=src;$('input',cr).value=100;$('.ok',cr).focus()},
close:function(){cr.hidden=true;$('img',cr).removeAttribute('src')}};
$('input',cr).addEventListener('input',function(e){C.z=e.target.value/100;crPlace()});
$('.stage',cr).addEventListener('wheel',function(e){e.preventDefault();C.z=Math.max(1,Math.min(3,C.z-e.deltaY/400));$('input',cr).value=Math.round(C.z*100);crPlace()},{passive:false});
var fr=$('.frame',cr);
fr.addEventListener('pointerdown',function(e){fr.setPointerCapture(e.pointerId);C.ptr[e.pointerId]=[e.clientX,e.clientY];C.d0=null});
fr.addEventListener('pointermove',function(e){var p=C.ptr[e.pointerId];if(!p)return;var ids=Object.keys(C.ptr);
if(ids.length===2){var o=C.ptr[ids[0]===String(e.pointerId)?ids[1]:ids[0]];var d=Math.hypot(e.clientX-o[0],e.clientY-o[1]);if(C.d0){C.z=Math.max(1,Math.min(3,C.z*d/C.d0));$('input',cr).value=Math.round(C.z*100)}C.d0=d;C.ptr[e.pointerId]=[e.clientX,e.clientY];crPlace();return}
C.ox+=e.clientX-p[0];C.oy+=e.clientY-p[1];C.ptr[e.pointerId]=[e.clientX,e.clientY];crPlace()});
var crUp=function(e){delete C.ptr[e.pointerId];C.d0=null};fr.addEventListener('pointerup',crUp);fr.addEventListener('pointercancel',crUp);
$('.cn',cr).addEventListener('click',Crop.close);
$('.ok',cr).addEventListener('click',function(){var sc=C.s*C.z,sx=(C.nw*sc/2-C.fw/2-C.ox)/sc,sy=(C.nh*sc/2-C.fh/2-C.oy)/sc,c=document.createElement('canvas');c.width=C.outW;c.height=Math.round(C.outW/C.aspect);
c.getContext('2d').drawImage($('img',cr),sx,sy,C.fw/sc,C.fh/sc,0,0,c.width,c.height);var out=c.toDataURL('image/jpeg',.88),cb=C.cb;Crop.close();cb(out)});
document.addEventListener('keydown',function(e){if(!cr.hidden&&e.key==='Escape')Crop.close()});

/* ---------- Profile photo and cover (Edit profile) ---------- */
window.photoBlock=function(d){return'<div class="phs"><div class="cvp'+(d.cover?' has':'')+'"'+(d.cover?' style="background-image:url(\''+d.cover+'\')"':'')+'>'+(d.cover?'':'No cover photo')+'</div><div class="avr"><div class="avp">'+(d.photo?'<img alt="" src="'+d.photo+'">':esc((d.name||'R').charAt(0).toUpperCase()))+'</div><div class="phb"><button class="p3b o" data-pick="photo">'+(d.photo?'Change photo':'Add photo')+'</button>'+(d.photo?'<button class="lnk" data-rm="photo">Remove</button>':'')+'<button class="p3b o" data-pick="cover">'+(d.cover?'Change cover':'Add cover')+'</button>'+(d.cover?'<button class="lnk" data-rm="cover">Remove</button>':'')+'</div></div></div>'};
function refreshBlock(){var el=$('#v-edit .phs');if(el)el.outerHTML=window.photoBlock(window.editHook.get())}
$('#v-edit').addEventListener('click',function(e){var p=e.target.closest('[data-pick]'),r=e.target.closest('[data-rm]');
if(r){window.editHook.set(r.dataset.rm,null);refreshBlock();return}
if(!p)return;var kind=p.dataset.pick;
Up.pick('image/*',false).then(function(fs){var f=fs[0];if(!f)return;var bad=Up.check('img',f);if(bad){window.toast(bad);return}
Up.image(f,2400).then(function(r){Crop.open(r.src,kind==='photo'?5/6:3,kind==='photo'?720:1500,function(out){window.editHook.set(kind,out);refreshBlock()})}).catch(function(){window.toast('That format is not supported. Try JPEG or PNG.')})})});

/* ---------- Tray: composer attachments ---------- */
var uid=0,Tray={items:[],sel:-1,err:'',rec:null,el:null};
var NM2={img:'photos',vid:'a video',aud:'a voice note',doc:'a file',yt:'a video link',story:'a news story'};
function notify(){var tx=$('#v-compose [data-i="tx"]');tx&&tx.dispatchEvent(new Event('input',{bubbles:true}))}
function thumb(it,i){var sel=i===Tray.sel?' sel':'',x='<button class="x" data-rm="'+it.k+'" aria-label="Remove">'+I.x+'</button>';
if(it.t==='story')return'<div class="ti'+sel+'" data-k="'+it.k+'" tabindex="0"><img src="'+esc(window.storyThumb?window.storyThumb(it.id):'')+'" alt=""><span class="bd2">News</span>'+x+'</div>';
if(it.t==='yt')return'<div class="ti vid'+sel+'" data-k="'+it.k+'" tabindex="0"><img src="'+artUri('network',3)+'" alt=""><span class="pl2">'+I.play.replace(/22/g,'14')+'</span><span class="bd2">YouTube</span>'+x+'</div>';
if(it.st==='bad')return'<div class="ti bad'+sel+'" data-k="'+it.k+'" tabindex="0"><div class="badm">'+esc(it.msg||'Could not add this file')+'</div>'+x+'</div>';
var up=it.st==='up'?'<div class="up"><b style="--p:'+it.p+'"><span>'+Math.round(it.p)+'%</span></b></div>':'';
if(it.t==='img')return'<div class="ti'+sel+'" data-k="'+it.k+'" tabindex="0">'+(it.src?'<img src="'+it.src+'" alt="">':'')+up+(it.st==='ok'?'<span class="bd2'+(it.alt?'':' need')+'">'+(it.alt?'Alt':'+ Alt')+'</span>':'')+x+'</div>';
if(it.t==='vid')return'<div class="ti vid'+sel+'" data-k="'+it.k+'" tabindex="0">'+(it.poster?'<img src="'+it.poster+'" alt="">':'')+(it.st==='ok'?'<span class="pl2">'+I.play.replace(/22/g,'14')+'</span><span class="bd2">'+fm(it.dur)+'</span>':'')+up+x+'</div>';
if(it.t==='aud')return'<div class="ti aud'+sel+'" data-k="'+it.k+'" tabindex="0"><span class="nm">'+esc(it.name)+'</span><div class="wv2">'+(it.peaks?it.peaks.slice(0,28).map(function(p){return'<i style="height:'+Math.round(4+p*24)+'px"></i>'}).join(''):'')+'</div><span class="sz">'+(it.st==='ok'?fm(it.dur):'')+'</span>'+up+x+'</div>';
return'<div class="ti doc'+sel+'" data-k="'+it.k+'" tabindex="0"><span class="pdf">PDF</span><span class="nm">'+esc(it.name)+'</span><span class="sz">'+sz(it.size)+'</span>'+up+x+'</div>'}
function draw(){var el=Tray.el,s=Tray.items[Tray.sel],h='';el.hidden=!(Tray.items.length||Tray.rec||Tray.err);
if(Tray.rec)h+='<div class="rec"><span class="rd"></span><canvas width="300" height="40" aria-label="Recording level"></canvas><span class="rt">0:00</span><button data-recstop>Stop</button></div>';
if(Tray.items.length)h+='<div class="tr-row">'+Tray.items.map(thumb).join('')+'</div>';
if(s&&s.t==='img'&&s.st==='ok')h+='<div class="tr-edit"><input aria-label="Describe this photo" placeholder="Describe this photo for screen readers" maxlength="200" value="'+esc(s.alt)+'"><button data-mv="-1" aria-label="Move photo earlier"'+(Tray.sel===0?' disabled':'')+'>'+I.l+'</button><button data-mv="1" aria-label="Move photo later"'+(Tray.sel===Tray.items.length-1?' disabled':'')+'>'+I.r+'</button></div>';
if(Tray.items.some(function(i){return i.t==='img'&&i.st==='ok'&&!i.alt}))h+='<p class="tr-hint">Add a description so everyone can follow along.</p>';
h+='<div class="tr-err" role="alert">'+esc(Tray.err)+'</div>';el.innerHTML=h}
function setProg(it){var b=$('[data-k="'+it.k+'"] .up b',Tray.el);if(b){b.style.setProperty('--p',it.p);b.firstChild.textContent=Math.round(it.p)+'%'}}
function process(it,f){var done=false,iv=setInterval(function(){it.p=Math.min(done?100:90,it.p+(done?20:8));if(it.p>=100&&done){clearInterval(iv);it.st='ok';draw();notify()}else setProg(it)},60);
var pr=it.t==='img'?Up.image(f,1600):it.t==='vid'?Up.video(f):it.t==='aud'?Up.audio(f):Promise.resolve({src:URL.createObjectURL(f)});
pr.then(function(r){for(var k in r)it[k]=r[k];it.file=f;done=true;draw()}).catch(function(e){clearInterval(iv);it.st='bad';it.msg=ERR[e&&e.message]||'Could not read this file.';draw();notify()})}
function addFiles(kind,files){Tray.err='';var cur=Tray.items[0]&&Tray.items[0].t;
if(cur&&cur!==kind){Tray.err='Remove your '+NAME[cur]+' to add '+NM2[kind]+'.';draw();return}
var msgs=[],ok=[];files.forEach(function(f){var bad=Up.check(kind,f);bad?msgs.push(f.name+': '+bad):ok.push(f)});
if(kind==='img'){var room=4-Tray.items.length;if(room<=0){Tray.err='You can add up to 4 photos.';draw();return}if(ok.length>room){ok=ok.slice(0,room);msgs.push('Only 4 photos fit in a post. Extra photos were skipped.')}}
else if(ok.length&&Tray.items.length){Tray.err='Only one '+NAME[kind]+' per post.';draw();return}
else if(ok.length>1){ok=ok.slice(0,1);msgs.push('Only one '+NAME[kind]+' per post.')}
ok.forEach(function(f){var it={k:++uid,t:kind,name:f.name,size:f.size,st:'up',p:0,alt:''};Tray.items.push(it);process(it,f)});
Tray.err=msgs.join(' ');if(ok.length)Tray.sel=Tray.items.length-1;draw();notify()}
Tray.n=function(){return Tray.items.filter(function(i){return i.st==='ok'}).length};
Tray.busy=function(){return Tray.items.some(function(i){return i.st==='up'})||!!Tray.rec};
Tray.clear=function(){stopRec(true);Tray.items=[];Tray.sel=-1;Tray.err='';if(Tray.el)draw()};
Tray.addStory=function(id){Tray.err='';Tray.items=[{k:++uid,t:'story',id:id,st:'ok',name:'News story',alt:''}];Tray.sel=0;draw();notify()};
Tray.addLink=function(id){Tray.err='';Tray.items=[{k:++uid,t:'yt',id:id,st:'ok',name:'YouTube video',alt:''}];Tray.sel=0;draw();notify()};
Tray.html=function(){return render(Tray.items.filter(function(i){return i.st==='ok'}).map(function(i){return i.t==='story'?{t:'story',id:i.id}:i.t==='yt'?{t:'yt',id:i.id}:i.t==='img'?{t:'img',src:i.src,alt:i.alt,w:i.w,h:i.h}:i.t==='vid'?{t:'vid',src:i.src,poster:i.poster,dur:i.dur,w:i.w,h:i.h,file:i.file}:i.t==='aud'?{t:'aud',src:i.src,peaks:i.peaks,dur:i.dur,file:i.file}:{t:'doc',name:i.name,size:i.size,src:i.src}}))};
window.Tray=Tray;
/* voice recorder */
function stopRec(cancel){var r=Tray.rec;if(!r)return;Tray.rec=null;r.cancel=!!cancel;cancelAnimationFrame(r.raf);clearTimeout(r.to);try{r.mr.state!=='inactive'&&r.mr.stop()}catch(e){}r.stream.getTracks().forEach(function(t){t.stop()});try{r.ac.close()}catch(e){}if(Tray.el)draw()}
function startRec(){if(!navigator.mediaDevices||!window.MediaRecorder){Tray.err='Recording is not supported in this browser. Choose a file instead.';draw();return}
navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){var mime=['audio/webm;codecs=opus','audio/webm','audio/mp4'].filter(function(m){return MediaRecorder.isTypeSupported(m)})[0],mr=new MediaRecorder(stream,mime?{mimeType:mime}:{}),chunks=[],AC=window.AudioContext||window.webkitAudioContext,ac=new AC(),an=ac.createAnalyser();an.fftSize=256;ac.createMediaStreamSource(stream).connect(an);
var r=Tray.rec={mr:mr,stream:stream,ac:ac,t0:Date.now(),raf:0};mr.ondataavailable=function(e){e.data.size&&chunks.push(e.data)};
mr.onstop=function(){if(r.cancel)return;var type=(mr.mimeType||'audio/webm').split(';')[0],f=new File([new Blob(chunks,{type:type})],'voice-note.'+(type.indexOf('mp4')>-1?'m4a':'webm'),{type:type});addFiles('aud',[f])};
mr.start();Tray.err='';draw();var cv=$('.rec canvas',Tray.el),g=cv.getContext('2d'),buf=new Uint8Array(an.fftSize),hist=[],last=0;
(function loop(t){r.raf=requestAnimationFrame(loop);if(t-last>70){last=t;an.getByteTimeDomainData(buf);var m=0;for(var i=0;i<buf.length;i++)m=Math.max(m,Math.abs(buf[i]-128));hist.push(m/128);if(hist.length>60)hist.shift();g.clearRect(0,0,300,40);g.fillStyle='#E3B341';hist.forEach(function(v,i){var h=Math.max(3,v*38);g.fillRect(i*5,20-h/2,3,h)});var s=(Date.now()-r.t0)/1000,tt=$('.rec .rt',Tray.el);tt&&(tt.textContent=fm(s))}})(0);
r.to=setTimeout(function(){stopRec()},180000)}).catch(function(e){Tray.err=e&&e.name==='NotAllowedError'?'Microphone access is blocked. Allow it in your browser settings, or choose a file.':'No microphone found. Choose a file instead.';draw()})}
/* wiring */
function initTray(){var comp=$('#v-compose'),att=$('[data-i="att"]',comp),body=att.parentNode,tb=$('.tb',comp);
Tray.el=document.createElement('div');Tray.el.className='tray';Tray.el.hidden=true;body.insertBefore(Tray.el,att);
var lk=document.createElement('div');lk.className='lkr';lk.innerHTML='<span>Link</span>';$$('.at',comp).forEach(function(b){lk.appendChild(b)});body.appendChild(lk);
var defs=[['img','Photo',I.ph,'image/*',true],['vid','Video',I.vd,'video/*',false],['aud','Voice',I.mic,'audio/*',false],['doc','File',I.fl,'application/pdf',false]],ct=$('.ct',tb);
defs.forEach(function(d){var b=document.createElement('button');b.className='mb';b.type='button';b.dataset.mk=d[0];b.setAttribute('aria-label','Add '+d[1].toLowerCase());b.innerHTML=d[2]+d[1];tb.insertBefore(b,ct)});
tb.addEventListener('click',function(e){var b=e.target.closest('[data-mk]');if(!b)return;var k=b.dataset.mk;
if(k==='aud'){if(Tray.items.length&&Tray.items[0].t!=='aud'){Tray.err='Remove your '+NAME[Tray.items[0].t]+' to add a voice note.';draw();return}if(Tray.rec)return;if(Tray.items.length){Tray.err='Only one voice note per post.';draw();return}Tray.err='';draw();
Tray.el.insertAdjacentHTML('afterbegin','<div class="rec" data-choose><span class="rt" style="flex:1;font-family:inherit">Add a voice note</span><button data-startrec>Record</button><button data-pickaud style="background:none;color:var(--ink);border:1px solid var(--rule)">Choose file</button></div>');Tray.el.hidden=false;return}
var d=defs.filter(function(x){return x[0]===k})[0];Up.pick(d[3],d[4]).then(function(fs){fs.length&&addFiles(k,fs)})});
Tray.el.addEventListener('click',function(e){var t=e.target,b;
if(t.closest('[data-startrec]')){startRec();return}
if(t.closest('[data-pickaud]')){Up.pick('audio/*',false).then(function(fs){Tray.err='';draw();fs.length&&addFiles('aud',fs)});return}
if(t.closest('[data-recstop]')){stopRec();return}
if(b=t.closest('[data-rm]')){var id=+b.dataset.rm;Tray.items=Tray.items.filter(function(i){return i.k!==id});Tray.sel=Math.min(Tray.sel,Tray.items.length-1);Tray.err='';draw();notify();e.stopPropagation();return}
if(b=t.closest('[data-mv]')){var d=+b.dataset.mv,s=Tray.sel,j=s+d;if(j>=0&&j<Tray.items.length){var x=Tray.items[s];Tray.items[s]=Tray.items[j];Tray.items[j]=x;Tray.sel=j;draw()}return}
if(b=t.closest('.ti')){var i=Tray.items.map(function(x){return x.k}).indexOf(+b.dataset.k);Tray.sel=i;draw();var inp=$('.tr-edit input',Tray.el);inp&&inp.focus()}});
Tray.el.addEventListener('input',function(e){if(e.target.matches('.tr-edit input')){var s=Tray.items[Tray.sel];if(s){s.alt=e.target.value;var bd=$('[data-k="'+s.k+'"] .bd2',Tray.el);if(bd){bd.textContent=s.alt?'Alt':'+ Alt';bd.classList.toggle('need',!s.alt)}var h=$('.tr-hint',Tray.el),need=Tray.items.some(function(i){return i.t==='img'&&i.st==='ok'&&!i.alt});if(h)h.style.display=need?'':'none'}}})}
/* ---------- init ---------- */
initTray();expand(document.body);ready(document.body);enhance(document.body);
new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(n.nodeType===1){enhance(n);expand(n);ready(n)}})})}).observe(document.body,{childList:true,subtree:true});
var prev=window.onView;window.onView=function(v){prev&&prev(v);expand(document.body);ready(document.body);if(v==='edit'&&me.photo===null&&false){}};
})();
