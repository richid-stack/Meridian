(function(){
'use strict';
/* =====================================================================
   M3  Playback
   Sources   adapters that resolve an episode to something playable
   Engine    one controller over HTMLAudioElement or the YouTube IFrame API
   Episode   page: player, chapters, transcript with search, mentions
   Mini      persistent mini-player; Media Session (lock screen controls)
   YT        privacy-first facade (loads only on tap) and inline embeds
   ===================================================================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var fm=function(s){s=Math.max(0,Math.floor(s||0));var h=Math.floor(s/3600),m=Math.floor(s%3600/60),c=s%60;return (h?h+':'+(m<10?'0':'')+m:m)+':'+(c<10?'0':'')+c};
var PLAY='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',PAUSE='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var Store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
/* ---------- episode catalogue (sample content; production reads this from the API) ---------- */
var YT_SAMPLE='aqz-KE-bpKQ';
var EP={
trucks:{id:'trucks',t:'Why empty trucks cost Africa billions',by:'Ama Boateng',role:'Founder, Kora Freight',k:'Podcast',type:'audio',len:180,art:'route',seed:5,
ch:[['Why trucks return empty',0],['The first route',40],['Building the marketplace',85],['Going cross-border',130]],
tr:[[0,'Ama','Most trucks in West Africa drive home empty. That is the problem we started with.'],[12,'Host','How big is the problem in practice?'],[20,'Ama','On some corridors, half the distance is travelled with no cargo at all.'],[40,'Host','Take me back to the first route.'],[46,'Ama','Tema to Kumasi, one carrier, one manufacturer, and a lot of phone calls.'],[70,'Ama','We learned the hard way that trust matters more than software.'],[85,'Host','When did it start to feel like a marketplace?'],[92,'Ama','When operators began posting empty return trips before a load was even booked.'],[110,'Ama','That one change made matching almost instant.'],[130,'Host','And then the borders.'],[136,'Ama','Currency and customs. Each country is a new product.'],[160,'Ama','If I started again, I would hire operations people earlier.']],
men:[['Company','Kora Freight','data-view="company"'],['Person','Ama Boateng','data-view="profile"'],['Book','The Goal','data-book="goal"']]},
kora:{id:'kora',t:'Building Kora from a single route',by:'Ama Boateng',role:'Founder, Kora Freight',k:'Video interview',type:'video',len:120,art:'network',seed:2,yt:YT_SAMPLE,
ch:[['The Tema to Kumasi route',0],['First customers',40],['Raising the Series A',80]],
tr:[[0,'Host','You started with one route. Why that one?'],[8,'Ama','It was the busiest freight lane I knew from my time at the port.'],[25,'Ama','One manufacturer agreed to try us for a month.'],[40,'Host','How did you find your first customers?'],[46,'Ama','Cold calls, honestly. We drove to factory gates and asked for the logistics manager.'],[65,'Ama','Referrals did the rest.'],[80,'Host','And the Series A?'],[86,'Ama','Investors wanted proof that the model worked outside Ghana.'],[104,'Ama','So we opened Abidjan before we closed the round.']],
men:[['Company','Kora Freight','data-view="company"'],['Person','Ama Boateng','data-view="profile"'],['Book','Zero to One','data-book="zero"']]},
payments:{id:'payments',t:'Inside the race for a continental payments rail',by:'Meridian Desk',role:'Explainer',k:'Video explainer',type:'video',len:150,art:'rail',seed:2,yt:YT_SAMPLE,
ch:[['The detour problem',0],['Three contenders',50],['What regulators decide',100]],
tr:[[0,'Host','Sending money between two West African countries still takes a detour.'],[15,'Host','A payment from Accra to Abidjan can pass through a bank in another continent.'],[50,'Host','Three fintech companies now want to remove that detour.'],[70,'Host','Each is building a shared settlement network.'],[100,'Host','Central banks hold the deciding vote.'],[120,'Host','Two have signalled support, but none has set a date.']],
men:[['Article','The quiet race to build a payments rail','data-view="article"'],['Company','Kora Freight','data-view="company"']]}};
var ORDER=['trucks','kora','payments'];
window.Episodes=EP;
/* ---------- Sources: the seam where real feeds plug in ---------- */
var wavCache={};
function synthWav(ep){if(wavCache[ep.id])return wavCache[ep.id];var sr=8000,n=sr*ep.len,buf=new ArrayBuffer(44+n*2),dv=new DataView(buf),w=function(o,s){for(var i=0;i<s.length;i++)dv.setUint8(o+i,s.charCodeAt(i))};
w(0,'RIFF');dv.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,sr,true);dv.setUint32(28,sr*2,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,n*2,true);
var TAU=Math.PI*2,starts=ep.ch.map(function(c){return c[1]});
for(var i=0;i<n;i++){var t=i/sr,pad=.05*(Math.sin(TAU*220*t)+.8*Math.sin(TAU*277.18*t)+.6*Math.sin(TAU*329.63*t))*(.65+.35*Math.sin(TAU*t/7)),ch=0;
for(var k=0;k<starts.length;k++){var d=t-starts[k];if(d>=0&&d<1)ch+=.16*Math.exp(-d*5)*Math.sin(TAU*880*t)}
dv.setInt16(44+i*2,Math.max(-1,Math.min(1,pad+ch))*32767,true)}
return wavCache[ep.id]=URL.createObjectURL(new Blob([buf],{type:'audio/wav'}))}
var Sources={audio:function(ep){return synthWav(ep)},video:function(ep){return ep.yt}};
/* ---------- YouTube IFrame API loader ---------- */
var ytP=null;
function loadYT(){if(window.YT&&window.YT.Player)return Promise.resolve(window.YT);if(ytP)return ytP;
ytP=new Promise(function(res,rej){var to=setTimeout(function(){ytP=null;rej(new Error('timeout'))},7000);window.onYouTubeIframeAPIReady=function(){clearTimeout(to);res(window.YT)};
var s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.async=true;s.onerror=function(){clearTimeout(to);ytP=null;rej(new Error('blocked'))};document.head.appendChild(s)});return ytP}
function ytFallback(host,id,msg){host.innerHTML='<div class="vfb"><div class="vfi"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg></div><b>'+esc(msg||'This video could not be loaded')+'</b><p>It may be blocked by your browser, a network setting, or this preview. You can watch it on YouTube instead.</p><a class="p3b" href="https://www.youtube.com/watch?v='+esc(id)+'" target="_blank" rel="noopener noreferrer">Open on YouTube</a></div>'}
/* ---------- Engine ---------- */
var E={ep:null,pos:0,dur:0,playing:false,busy:false,rate:Store.get('mp:rate')||1,a:null,yt:null,ytOn:false,err:false,scrub:false,tab:0,follow:true,ti:-1,saved:0,sess:0};
var SPD=[1,1.25,1.5,2,.75];
function dur(){return E.dur>0&&isFinite(E.dur)?E.dur:(E.ep?E.ep.len:0)}
function save(force){if(!E.ep)return;var n=Date.now();if(!force&&n-E.saved<2000)return;E.saved=n;Store.set('mp:'+E.ep.id,{p:E.pos>dur()-3?0:E.pos})}
function resumePos(ep){var s=Store.get('mp:'+ep.id);return s&&s.p>5&&s.p<ep.len-8?s.p:0}
function teardown(){save(true);if(E.a){try{E.a.pause();E.a.removeAttribute('src');E.a.load()}catch(e){}E.a=null}killYT();E.playing=false;E.busy=false;E.err=false;E.ep=null}
function killYT(){if(E.yt){try{E.yt.destroy()}catch(e){}}E.yt=null;E.ytOn=false}
function loadAudio(autoplay){var ep=E.ep,a=new Audio();E.a=a;a.preload='auto';a.src=Sources.audio(ep);a.playbackRate=E.rate;
a.addEventListener('loadedmetadata',function(){E.dur=a.duration;if(E.pos>0&&Math.abs(a.currentTime-E.pos)>1)a.currentTime=E.pos;paint()});
a.addEventListener('timeupdate',function(){if(E.scrub)return;E.pos=a.currentTime;save();paint();sessionPos()});
a.addEventListener('play',function(){E.playing=true;E.busy=false;paint()});a.addEventListener('pause',function(){E.playing=false;paint()});
a.addEventListener('waiting',function(){E.busy=true;paint()});a.addEventListener('playing',function(){E.busy=false;paint()});
a.addEventListener('ended',function(){E.playing=false;E.pos=0;save(true);paint()});
a.addEventListener('error',function(){E.err=true;E.busy=false;E.playing=false;paint();renderEpisode()});
setSession();if(autoplay)a.play().catch(function(){})}
function ePlay(){if(!E.ep)return;if(E.ep.type==='audio'&&E.a){if(E.pos>=dur()-.5){E.a.currentTime=0}E.a.play().catch(function(){})}else if(E.yt&&E.ytOn)E.yt.playVideo()}
function ePause(){if(E.a)E.a.pause();else if(E.yt&&E.ytOn)E.yt.pauseVideo()}
function eSeek(s){s=Math.max(0,Math.min(dur(),s));E.pos=s;if(E.a)E.a.currentTime=s;else if(E.yt&&E.ytOn)E.yt.seekTo(s,true);save(true);paint()}
function eRate(r){E.rate=r;Store.set('mp:rate',r);if(E.a)E.a.playbackRate=r;if(E.yt&&E.ytOn&&E.yt.setPlaybackRate)E.yt.setPlaybackRate(r);paint()}
/* ---------- Media Session ---------- */
function artPng(ep){return new Promise(function(res){var i=new Image();i.onload=function(){var c=document.createElement('canvas');c.width=c.height=512;c.getContext('2d').drawImage(i,(512-512*i.width/i.height)/2,0,512*i.width/i.height,512);res(c.toDataURL('image/png'))};i.onerror=function(){res(null)};i.src=window.Art.uri(ep.art,ep.seed)})}
function setSession(){if(!('mediaSession' in navigator)||!E.ep)return;var ep=E.ep,tk=++E.sess;
try{navigator.mediaSession.metadata=new MediaMetadata({title:ep.t,artist:ep.by,album:'Meridian'});
artPng(ep).then(function(u){if(u&&tk===E.sess&&E.ep===ep)navigator.mediaSession.metadata=new MediaMetadata({title:ep.t,artist:ep.by,album:'Meridian',artwork:[{src:u,sizes:'512x512',type:'image/png'}]})})}catch(e){}
[['play',ePlay],['pause',ePause],['seekbackward',function(){eSeek(E.pos-15)}],['seekforward',function(){eSeek(E.pos+30)}],['seekto',function(d){eSeek(d.seekTime)}]].forEach(function(h){try{navigator.mediaSession.setActionHandler(h[0],h[1])}catch(e){}})}
function sessionPos(){if(!('mediaSession' in navigator)||!navigator.mediaSession.setPositionState||!E.ep||!isFinite(dur()))return;try{navigator.mediaSession.setPositionState({duration:dur(),playbackRate:E.rate,position:Math.min(E.pos,dur())})}catch(e){}}
/* ---------- Episode page ---------- */
var P=function(){return $('#v-player')};
function hb(t){return '<header class="hb"><div class="in"><button class="back" aria-label="Back">'+BACK+'Back</button><span class="t">'+(t||'')+'</span><span class="rt"></span></div></header>'}
function other(id){return ORDER.filter(function(k){return k!==id}).map(function(k){var e=EP[k];return '<button class="mr" data-ep="'+k+'"><div class="vth" data-art="'+e.art+'" data-seed="'+e.seed+'"><span class="vp"><span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span></span><em>'+fm(e.len)+'</em></div><div><b>'+esc(e.t)+'</b><small>'+e.k+', '+esc(e.by)+'</small></div></button>'}).join('')}
function renderEpisode(){var ep=E.ep;if(!ep)return;var v=ep.type==='video',h=hb(v?'Interview':'Now playing')+'<div class="pw">';
if(!v)h+='<div class="art" style="background-image:url(\''+window.Art.uri(ep.art,ep.seed)+'\')"><small>'+ep.k+'</small></div>';
else h+='<div class="vstage"><button class="vfc" aria-label="Play video: '+esc(ep.t)+'"><img src="'+window.Art.uri(ep.art,ep.seed)+'" alt=""><span class="vpl">'+PLAY.replace(/22/g,'28')+'</span></button><p class="vnote">Plays from YouTube in privacy-enhanced mode. Loading it shares data with YouTube.</p></div>';
h+='<h1>'+esc(ep.t)+'</h1><p class="by">'+esc(ep.by)+', '+esc(ep.role)+'</p>';
if(!v){h+=E.err?'<div class="vfb inl"><b>This episode could not be loaded</b><button class="p3b" data-retry>Try again</button></div>':'<input type="range" min="0" max="'+Math.floor(dur())+'" value="'+Math.floor(E.pos)+'" aria-label="Seek"><div class="tm"><span class="cu">0:00</span><span>-<span class="rm">0:00</span></span></div><div class="ct"><button class="sd">1x</button><button class="sk2" data-sk="-15" aria-label="Back 15 seconds">-15</button><button class="pl" aria-label="Play or pause"></button><button class="sk2" data-sk="30" aria-label="Forward 30 seconds">+30</button><span style="width:56px"></span></div>'}
h+='<div class="tb3" role="tablist">'+['Chapters','Transcript','Mentions'].map(function(t,i){return '<button role="tab" aria-selected="'+(E.tab===i)+'" data-tab3="'+i+'">'+t+'</button>'}).join('')+'</div><div class="pn"></div><h3>More to watch and hear</h3><div class="mrl">'+other(ep.id)+'</div></div>';
P().querySelector('.pg').innerHTML=h;panel();paint(true)}
function panel(){var ep=E.ep,pn=$('.pn',P());if(!pn)return;E.ti=-1;
if(E.tab===0)pn.innerHTML=ep.ch.map(function(c,i){return '<button class="chp" data-at="'+c[1]+'"><span>'+fm(c[1])+'</span>'+esc(c[0])+'</button>'}).join('');
if(E.tab===1)pn.innerHTML='<div class="tsb"><input type="search" aria-label="Search transcript" placeholder="Search transcript" autocomplete="off"><span class="mc" aria-live="polite"></span></div><div class="tsl" tabindex="0" aria-label="Transcript">'+ep.tr.map(function(l,i){return '<button class="tl" data-at="'+l[0]+'" data-i="'+i+'"><span class="tt">'+fm(l[0])+'</span><span class="sp">'+esc(l[1])+'</span><span class="tx">'+esc(l[2])+'</span></button>'}).join('')+'</div><button class="jn2" hidden>Jump to current line</button>';
if(E.tab===2)pn.innerHTML='<div class="mch">'+ep.men.map(function(m){return '<button class="mc2" '+m[2]+'><small>'+m[0]+'</small>'+esc(m[1])+'</button>'}).join('')+'</div>';
paint(true)}
function curLine(){var tr=E.ep.tr,i=-1;for(var k=0;k<tr.length;k++){if(tr[k][0]<=E.pos+.25)i=k;else break}return i}
function paint(force){var ep=E.ep;if(!ep)return;var pr=P(),d=dur(),pct=d?E.pos/d*100:0;
if(ep.type==='audio'){var r=$('input[type=range]',pr);if(r){if(!E.scrub)r.value=Math.floor(E.pos);r.max=Math.floor(d);r.style.setProperty('--pp',pct+'%');$('.cu',pr).textContent=fm(E.pos);$('.rm',pr).textContent=fm(Math.max(0,d-E.pos));var pl=$('.pl',pr);pl.innerHTML=E.busy?'<span class="spn"></span>':(E.playing?PAUSE:PLAY);pl.setAttribute('aria-label',E.playing?'Pause':'Play');$('.sd',pr).textContent=E.rate+'x'}}
var ci=0;ep.ch.forEach(function(c,i){if(E.pos>=c[1])ci=i});if(E.tab===0)$$('.chp',pr).forEach(function(b,i){b.classList.toggle('on',i===ci)});
if(E.tab===1){var li=curLine();if(li!==E.ti||force){E.ti=li;$$('.tl',pr).forEach(function(b){b.classList.toggle('on',+b.dataset.i===li)});var cur=$('.tl.on',pr),box=$('.tsl',pr);if(cur&&box&&E.follow&&!cur.hidden){box.scrollTo({top:cur.offsetTop-box.offsetTop-box.clientHeight/3,behavior:force?'auto':'smooth'})}}}
var m=$('#mini');if(m&&ep.type==='audio'){$('b',m).textContent=ep.t;$('small',m).textContent=ep.by+', '+fm(E.pos)+' of '+fm(d);$('button',m).innerHTML=E.playing?PAUSE:PLAY;$('.bar i',m).style.width=pct+'%'}}
/* events */
function bindPage(){var pr=P();
pr.addEventListener('click',function(e){var t=e.target,b;
if(t.closest('.pl')){E.playing?ePause():ePlay();return}
if(b=t.closest('[data-sk]')){eSeek(E.pos+ +b.dataset.sk);return}
if(t.closest('.sd')){eRate(SPD[(SPD.indexOf(E.rate)+1)%SPD.length]);return}
if(b=t.closest('[data-tab3]')){E.tab=+b.dataset.tab3;$$('[data-tab3]',pr).forEach(function(x){x.setAttribute('aria-selected',x===b)});panel();return}
if(b=t.closest('[data-at]')){var s=+b.dataset.at;E.follow=true;if(E.ep.type==='video'&&!E.ytOn){mountVideo(s)}else{eSeek(s);if(E.ep.type==='audio')ePlay();else if(E.yt)ePlay()}return}
if(t.closest('.vfc')){mountVideo(E.pos||resumePos(E.ep));return}
if(t.closest('[data-retry]')){E.err=false;loadAudio(true);renderEpisode();return}
if(t.closest('.jn2')){E.follow=true;t.closest('.jn2').hidden=true;E.ti=-2;paint();return}
});
pr.addEventListener('input',function(e){var t=e.target;
if(t.type==='range'){E.scrub=true;E.pos=+t.value;$('.cu',pr).textContent=fm(E.pos);$('.rm',pr).textContent=fm(dur()-E.pos);t.style.setProperty('--pp',(E.pos/dur()*100)+'%')}
if(t.type==='search'){var q=t.value.trim().toLowerCase(),n=0;$$('.tl',pr).forEach(function(b){var tx=$('.tx',b),src=E.ep.tr[+b.dataset.i][2],hit=!q||src.toLowerCase().indexOf(q)>-1;b.hidden=!hit;if(hit&&q)n++;tx.innerHTML=q&&hit?esc(src).replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>'):esc(src)});$('.mc',pr).textContent=q?(n+' match'+(n===1?'':'es')):''}});
pr.addEventListener('change',function(e){if(e.target.type==='range'){E.scrub=false;eSeek(+e.target.value)}});
var tsUser=function(e){if(e.target.closest&&e.target.closest('.tsl')){E.follow=false;var j=$('.jn2',pr);if(j)j.hidden=false}};
pr.addEventListener('wheel',tsUser,{passive:true});pr.addEventListener('touchmove',tsUser,{passive:true})}
bindPage();
/* ---------- video (YouTube) ---------- */
function mountVideo(start){var ep=E.ep,st=$('.vstage',P());if(!st||E.yt||st.classList.contains('loading'))return;st.classList.add('loading');st.innerHTML='<div class="vh"><div id="ytp"></div></div><div class="vload"><span class="spn"></span></div>';
var fail=function(m){killYT();st.classList.remove('loading');ytFallback(st,ep.yt,m)},to=setTimeout(function(){fail('The video is taking too long to load')},9000);
loadYT().then(function(YT){var pv={rel:0,modestbranding:1,playsinline:1,autoplay:1,start:Math.floor(start||0)};
var pl=new YT.Player('ytp',{host:'https://www.youtube-nocookie.com',videoId:Sources.video(ep),playerVars:pv,events:{
onReady:function(){clearTimeout(to);E.yt=pl;E.ytOn=true;st.classList.remove('loading');var l=$('.vload',st);l&&l.remove();E.dur=pl.getDuration()||ep.len;if(E.rate!==1&&pl.setPlaybackRate)pl.setPlaybackRate(E.rate);paint(true)},
onStateChange:function(s){E.playing=s.data===1;E.busy=s.data===3;paint()},
onError:function(){clearTimeout(to);fail('This video is unavailable')}}});E.yt=pl}).catch(function(){clearTimeout(to);fail()})}
setInterval(function(){if(E.yt&&E.ytOn&&E.playing){try{E.pos=E.yt.getCurrentTime();E.dur=E.yt.getDuration()||E.dur;save();paint()}catch(e){}}},300);
/* ---------- public API + mini-player ---------- */
window.openEp=function(id){var ep=EP[id];if(!ep)return;if(!E.ep||E.ep.id!==id){teardown();E.ep=ep;E.pos=resumePos(ep);E.dur=ep.len;E.tab=0;E.follow=true;E.ti=-1;if(ep.type==='audio')loadAudio(true)}App.push('player')};
window.Playback={state:function(){return{id:E.ep&&E.ep.id,pos:E.pos,dur:dur(),playing:E.playing,rate:E.rate,type:E.ep&&E.ep.type,yt:!!E.yt,err:E.err}},seek:eSeek};
var mini=document.createElement('div');mini.id='mini';mini.hidden=true;mini.innerHTML='<div class="r"><div class="mt" data-mini="open" role="button" tabindex="0"><b></b><small></small></div><button aria-label="Play or pause"></button></div><div class="bar"><i></i></div>';document.body.appendChild(mini);
mini.addEventListener('click',function(e){if(e.target.closest('button')){E.playing?ePause():ePlay();return}if(e.target.closest('.mt'))App.push('player')});
var HIDE=['player','live','deal','onboarding','thread','edit','claim','invest','ai'];
function miniVis(v){var show=!!E.ep&&E.ep.type==='audio'&&HIDE.indexOf(v)<0;mini.hidden=!show;document.body.classList.toggle('hasmini',show);if(show)paint()}
/* ---------- rail progress, link cards, inline embeds ---------- */
function railProgress(){$$('#v-home .rc[data-ep]').forEach(function(c){var ep=EP[c.dataset.ep],s=Store.get('mp:'+ep.id),p=s&&s.p>5?s.p:0,bar=$('.prg',c);if(!p){bar&&bar.remove();return}if(!bar){bar=document.createElement('span');bar.className='prg';bar.innerHTML='<i></i>';$('.vth',c).appendChild(bar)}$('i',bar).style.width=Math.round(p/ep.len*100)+'%'})}
window.ytCard=function(o){var art=window.Art.uri(o.art||'network',o.seed||3),ep=o.ep?EP[o.ep]:null,title=o.title||(ep&&ep.t)||'YouTube video',attr=o.ep?'data-ep="'+o.ep+'"':'data-yt="'+esc(o.id)+'"',src=o.id&&!o.ep?'https://i.ytimg.com/vi/'+esc(o.id)+'/hqdefault.jpg':art;
return '<div class="yc" '+attr+' role="button" tabindex="0" aria-label="Play video: '+esc(title)+'"><div class="ycv"><img src="'+src+'" data-fb="'+art+'" alt=""><span class="ycp">'+PLAY.replace(/22/g,'24')+'</span>'+(o.dur?'<em>'+esc(o.dur)+'</em>':'')+'</div><div class="yci"><b>'+esc(title)+'</b><small>YouTube</small></div></div>'};
function expandYC(root){$$('[data-yc]',root.nodeType===1?root:document).forEach(function(el){if(el.dataset.done)return;el.dataset.done=1;try{el.innerHTML=window.ytCard(JSON.parse(el.dataset.yc))}catch(e){}})}
document.addEventListener('error',function(e){var i=e.target;if(i&&i.tagName==='IMG'&&i.dataset.fb&&!i.dataset.fbd){i.dataset.fbd=1;i.src=i.dataset.fb}},true);
function inline(card){var id=card.dataset.yt,box=$('.ycv',card);if(!id||card.classList.contains('on'))return;card.classList.add('on');box.innerHTML='<div class="vh"><div></div></div><div class="vload"><span class="spn"></span></div>';
var fail=function(m){box.innerHTML='';ytFallback(box,id,m)},to=setTimeout(function(){fail('The video is taking too long to load')},9000);
loadYT().then(function(YT){new YT.Player($('.vh div',box),{host:'https://www.youtube-nocookie.com',videoId:id,playerVars:{rel:0,modestbranding:1,playsinline:1,autoplay:1},events:{onReady:function(){clearTimeout(to);var l=$('.vload',box);l&&l.remove()},onError:function(){clearTimeout(to);fail('This video is unavailable')}}})}).catch(function(){clearTimeout(to);fail()})}
document.addEventListener('click',function(e){var c=e.target.closest('.yc[data-yt]');if(c&&!e.target.closest('a'))inline(c)});
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.yc')){e.preventDefault();e.target.click()}});
/* paste a YouTube link into the composer and it becomes a card */
var YTRE=/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?[^\s]*?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})[^\s]*/;
var tx=$('#v-compose [data-i="tx"]');
tx.addEventListener('input',function(){var m=YTRE.exec(tx.value);if(!m||!window.Tray||window.Tray.items.length)return;tx.value=tx.value.replace(m[0],'').replace(/[ \t]{2,}/g,' ').trim();window.Tray.addLink(m[1])});
/* ---------- hooks ---------- */
var prev=window.onView;
window.onView=function(v){prev&&prev(v);expandYC(document.body);
if(v==='player'&&E.ep){E.follow=true;renderEpisode()}
if(v!=='player'&&E.yt){E.pos=E.ytOn?(function(){try{return E.yt.getCurrentTime()}catch(e){return E.pos}})():E.pos;save(true);killYT();E.playing=false}
if(v==='home')railProgress();miniVis(v)};
expandYC(document.body);
new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(n){if(n.nodeType===1)expandYC(n)})})}).observe(document.body,{childList:true,subtree:true});
})();
