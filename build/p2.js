(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var PLAY='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',PAUSE='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
var SEND='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
function hb(t,r){return '<header class="hb"><div class="in"><button class="back" aria-label="Back">'+BACK+'Back</button><span class="t">'+(t||'')+'</span><span class="rt">'+(r||'')+'</span></div></header>'}
var esc=function(s){return String(s).replace(/</g,'&lt;')};
/* Books */
var Books={
zero:{t:'Zero to One',a:'Peter Thiel',c:'#1F4E79',n:412,s:'A guide to building something new instead of copying what already works. It argues that the biggest companies create a category of their own.',
I:[['Start with a secret','The best companies begin with something true that few people yet believe.'],['Aim to own your niche','Competing on price in a crowded market leaves little profit. A small market you lead is stronger.'],['Go from zero to one','Copying a proven model adds more of the same. Real progress creates something new.'],['Distribution is part of the product','A great product still needs a deliberate way to reach customers.']],who:['AB','Ama Boateng','Founder, Kora Freight'],who2:['KO','Kunle Okafor','Partner, Sahel Ventures']},
goal:{t:'The Goal',a:'Eliyahu Goldratt',c:'#5B3A29',n:286,s:'A business novel about a factory manager who learns to find the single constraint that limits his plant, and to improve around it.',
I:[['Find the bottleneck','Every system has one constraint that sets its pace. Improving anything else changes little.'],['Measure throughput','Output that reaches customers matters more than how busy each part looks.'],['Improve in a loop','Identify the constraint, use it fully, then move to the next one.']],who:['AB','Ama Boateng','Founder, Kora Freight']},
things:{t:'Things Fall Apart',a:'Chinua Achebe',c:'#7A2E3A',n:198,s:'A novel about a proud leader in a Nigerian village and what happens when outside forces disrupt the community he knows.',
I:[['Change meets tradition','Communities respond to outside pressure in different ways, and not every response is wise.'],['Leadership and fear','A leader driven by fear of weakness can make choices that cost him what he values.'],['Context shapes markets','Anyone building across cultures benefits from understanding the history behind them.']],who:['AB','Ama Boateng','Founder, Kora Freight']}};
var bookId='zero',want={};
window.openBook=function(id){bookId=id;App.push('book')};
function renderBook(){var b=Books[bookId];
var w=function(x){return '<div class="p"'+(x[0]==='AB'?' data-view="profile" style="cursor:pointer"':'')+'><div>'+x[0]+'</div><b>'+x[1]+'</b><span>'+x[2]+'</span></div>'};
$('#v-book .pg').innerHTML=hb('')+'<main class="pgw"><div class="bh"><div class="cv" style="background:'+b.c+'">'+b.t+'</div><div><h1>'+b.t+'</h1><p class="au">'+b.a+'</p><p class="rdb">Read by <b>'+b.n+'</b> founders on Meridian</p></div></div>'+
'<div class="acts"><button class="btn" data-want aria-pressed="'+!!want[bookId]+'">'+(want[bookId]?'On your list':'Want to read')+'</button><button class="btn o" data-tab="community">Join the discussion</button></div>'+
'<h2>Summary</h2><p class="cap">Written by Meridian AI. It does not replace reading the book.</p><p style="font:400 19px/1.55 Newsreader,Georgia,serif;margin:0">'+b.s+'</p>'+
'<h2>Key ideas</h2>'+b.I.map(function(i,k){return '<div class="idea"><b>'+(k+1)+'</b><div><h4>'+i[0]+'</h4><p>'+i[1]+'</p></div></div>'}).join('')+
'<h2>Recommended by</h2><div class="ppl">'+w(b.who)+(b.who2?w(b.who2):'')+'</div><p class="note">Sample page with placeholder data.</p></main>';
}
$('#v-book').addEventListener('click',function(e){var x=e.target.closest('[data-want]');if(x){want[bookId]=!want[bookId];x.setAttribute('aria-pressed',!!want[bookId]);x.textContent=want[bookId]?'On your list':'Want to read'}});
/* Article */
var art=$('#v-article');
$('.aa',art).addEventListener('click',function(){var z=+art.dataset.sz;art.dataset.sz=z>=3?1:z+1});
window.addEventListener('scroll',function(){if(!art.classList.contains('on'))return;var m=document.documentElement.scrollHeight-window.innerHeight;$('.prog',art).style.width=(m>0?Math.min(100,window.scrollY/m*100):0)+'%'},{passive:true});
window.openArticle=function(){App.push('article')};
var fm=function(s){s=Math.floor(s);var h=Math.floor(s/3600),m=Math.floor(s%3600/60),c=s%60;return (h?h+':'+(m<10?'0':'')+m:m)+':'+(c<10?'0':'')+c};
/* Live room */
var Q=[{n:'Esi A.',q:'How did you decide which corridor to open third?',v:41},{n:'Yaw M.',q:'What does a truck operator need most from a platform?',v:28},{n:'Adwoa K.',q:'How do you handle currency swings on cross-border loads?',v:19}];
var hand=false,t0=Date.now(),base=12*60+7;
window.openLive=function(){App.push('live')};
function renderLive(){
$('#v-live .pg').innerHTML=hb('')+'<main class="lw"><div class="lv"><i></i><b>Live now</b><span>312 listening</span><em class="el"></em></div><h1>Building a logistics network across borders</h1>'+
'<div class="spk"><div data-view="profile" style="cursor:pointer"><i>AB</i><b>Ama Boateng</b><span class="hd">Host</span></div><div><i>KO</i><b>Kunle Okafor</b><span>Moderator</span></div><div><i>NM</i><b>Nia Mensah</b><span>Guest</span></div></div>'+
'<button class="rs" aria-pressed="'+hand+'">'+(hand?'Hand raised':'Request to speak')+'</button><h2>Questions</h2><div class="ql"></div></main>'+
'<div class="ask"><div><input aria-label="Ask a question" placeholder="Ask a question"><button aria-label="Send">'+SEND+'</button></div></div>';
qs();tickL();}
function qs(){$('#v-live .ql').innerHTML=Q.slice().sort(function(a,b){return b.v-a.v}).map(function(x){return '<div class="q"><div><p>'+esc(x.q)+'</p><small>'+esc(x.n)+'</small></div><button class="vt" aria-pressed="'+!!x.me+'" data-q="'+Q.indexOf(x)+'" aria-label="Upvote"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>'+x.v+'</button></div>'}).join('')}
function tickL(){var el=$('#v-live .el');if(el)el.textContent=fm(base+(Date.now()-t0)/1000)}
setInterval(function(){if($('#v-live').classList.contains('on'))tickL()},1000);
$('#v-live').addEventListener('click',function(e){var t=e.target;
var v=t.closest('.vt');if(v){var q=Q[+v.dataset.q];q.me=!q.me;q.v+=q.me?1:-1;qs();return}
var r=t.closest('.rs');if(r){hand=!hand;r.setAttribute('aria-pressed',hand);r.textContent=hand?'Hand raised':'Request to speak';return}
if(t.closest('.ask button'))sendQ()});
$('#v-live').addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('.ask input'))sendQ()});
function sendQ(){var i=$('#v-live .ask input'),v=i.value.trim();if(!v)return;Q.push({n:'You',q:v,v:1,me:1});i.value='';qs()}
/* Groups */
var G={logistics:{n:'Logistics and supply chain',i:'L',m:'2,418',one:'Freight, ports, warehousing, and last-mile',j:1,pin:'Welcome. Share corridor updates, ask about customs, and keep it practical.',P:[['NM','Nia Mensah','CEO, Aya Health','3h','Rural clinics taught us that cold-chain reliability is a logistics problem first.'],['FK','Fatou Keita','Head of operations, Kora Freight','1d','Load matching improved once we began tracking empty return trips by route.'],['TD','Tunde Dlamini','CFO, Zuri Energy','2d','Does anyone have a reliable customs broker contact for Takoradi?']]},
fintech:{n:'Fintech founders under 40',i:'F',m:'1,207',one:'Building money products across Africa',j:0,pin:'A place to swap lessons on licensing, partnerships, and raising your first round.',P:[['KO','Kunle Okafor','Partner, Sahel Ventures','5h','Most early fintech pitches underestimate compliance cost. Budget for it from day one.'],['TD','Tunde Dlamini','CFO, Zuri Energy','1d','Collections improved when we moved repayment reminders to mobile money.']]},
angels:{n:'Angel investors circle',i:'A',m:'642',one:'Deal flow and diligence for verified investors',j:0,pin:'Verified investors only. Share diligence notes, not promises of returns.',P:[['KO','Kunle Okafor','Partner, Sahel Ventures','6h','When reading a SAFE, check the valuation cap against the last priced round.'],['NM','Nia Mensah','CEO, Aya Health','2d','Founders: investors read your risks section first. Write it honestly.']]},
accra:{n:'Accra startup scene',i:'C',m:'3,905',one:'Events, co-working, and introductions in Accra',j:1,pin:'Monthly founder meetups and open office hours are posted here first.',P:[['FK','Fatou Keita','Head of operations, Kora Freight','4h','Hosting open office hours on Thursday. Bring your operations questions.']]}};
var gid='logistics',gm=false;
window.openGroup=function(id){gid=id;App.push('group')};
function renderGroup(){var g=G[gid];
$('#v-group .pg').innerHTML=hb('')+'<main class="pgw"><div class="gh"><h1>'+g.n+'</h1><p>'+g.one+'</p><span class="mm">'+g.m+' members</span><button class="btn '+(g.j?'':'')+'" data-jn="'+gid+'" aria-pressed="'+!!g.j+'">'+(g.j?'Joined':'Join group')+'</button></div>'+
'<div class="pin"><small>Pinned</small><p>'+g.pin+'</p></div><h2>Recent posts</h2>'+g.P.map(function(p){return '<div class="gp"><div class="pe">'+p[0]+'</div><div><b>'+p[1]+'</b><span>'+p[3]+'</span><div class="r">'+p[2]+'</div><p>'+p[4]+'</p></div></div>'}).join('')+'<p class="note">Sample group with placeholder posts.</p></main>';}
function toggleJ(k){G[k].j=G[k].j?0:1;var n=G[k].m;}
$('#v-group').addEventListener('click',function(e){var b=e.target.closest('[data-jn]');if(b){toggleJ(b.dataset.jn);renderGroup()}});
/* Community tabs: For you / Following / Groups */
var com=$('#v-community'),wrap=$('main.wrap',com),gl=document.createElement('div');gl.className='gl';gl.hidden=true;wrap.insertBefore(gl,$('.note',wrap));
function mode(i){
var posts=$$('.post',wrap),live=$('.live',wrap);
live.hidden=i===2;gl.hidden=i!==2;
posts.forEach(function(p){var a=($('.who b',p)||{}).textContent||'';p.hidden=i===2||(i===1&&['Nia Mensah','Kunle Okafor','Rich'].indexOf(a)<0)});
if(i===2){var ks=Object.keys(G);gl.innerHTML='<h3>Your groups</h3>'+ks.filter(function(k){return G[k].j}).map(row).join('')+'<h3>Discover</h3>'+ks.filter(function(k){return !G[k].j}).map(row).join('')}
window.scrollTo(0,0)}
function row(k){var g=G[k];return '<div class="gr" data-group="'+k+'"><div class="gi">'+g.i+'</div><div><b>'+g.n+'</b><small>'+g.one+'</small><em>'+g.m+' members</em></div><button class="jn" aria-pressed="'+!!g.j+'" data-jn="'+k+'">'+(g.j?'Joined':'Join')+'</button></div>'}
$$('.tab',com).forEach(function(t,i){t.addEventListener('click',function(){mode(i)})});
gl.addEventListener('click',function(e){var b=e.target.closest('[data-jn]');if(b){toggleJ(b.dataset.jn);mode(2)}});
/* view hook */
var prev=window.onView;
window.onView=function(v){prev&&prev(v);
if(v==='book')renderBook();if(v==='live')renderLive();if(v==='group')renderGroup();
if(v==='article'){$('.prog',art).style.width='0'}
};
})();
