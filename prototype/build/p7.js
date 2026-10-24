(function(){
'use strict';
/* =====================================================================
   M4  News
   Providers   two sample feeds with different raw shapes (swap for real HTTP clients)
   Normalise   raw item -> Story { id, title, snippet, source, url, image, at, region, topic, lang, entities }
   Cluster     groups near-duplicate headlines into one story with several sources
   Repo        load(query) -> filtered, clustered, paged stories (cached, offline-aware)
   UI          Top stories on Home and Explore, News page, story page, share to community
   ===================================================================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var Store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',BM='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 4h12v17l-6-4-6 4z"/></svg>',RF='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 11-2.3-5.6M20 4v5h-5"/></svg>';
var NOW=Date.now(),mins=function(m){return new Date(NOW-m*60000).toISOString()};
/* ---------- sample raw feeds (fictional outlets and companies) ---------- */
var FEED_A=[
{source:{name:'Accra Business Daily'},title:'Mobile money transfers pass a new monthly record across West Africa',description:'Operators report wallet-to-wallet transfers rose for a fifth straight month as merchants move away from cash.',url:'https://example.com/a1',urlToImage:null,publishedAt:mins(35),category:'fintech',region:'west',tags:[]},
{source:{name:'Accra Business Daily'},title:'Freight network adds a third corridor as cross-border volumes climb',description:'Kora Freight says load matching on the new route takes minutes as manufacturers shift cargo to digital platforms.',url:'https://example.com/a2',urlToImage:null,publishedAt:mins(95),category:'logistics',region:'west',tags:['Kora Freight','Ama Boateng']},
{source:{name:'Continental Wire'},title:'Solar-powered clinics reach rural districts in new pilot',description:'Aya Health says its first clinics kept running through grid failures, with more sites planned this year.',url:'https://example.com/a3',urlToImage:null,publishedAt:mins(160),category:'health',region:'west',tags:['Aya Health']},
{source:{name:'Nairobi Markets Review'},title:'Nairobi-based startups raise record seed funding in the quarter',description:'Early-stage deals grew as local angel networks and regional funds wrote larger cheques.',url:'https://example.com/a4',urlToImage:null,publishedAt:mins(210),category:'startups',region:'east',tags:[]},
{source:{name:'Cape Insight'},title:'Utility signs deal for large solar and storage project',description:'The project pairs panels with batteries to supply evening demand and reduce reliance on diesel backup.',url:'https://example.com/a5',urlToImage:null,publishedAt:mins(300),category:'energy',region:'south',tags:[]},
{source:{name:'Continental Wire'},title:'Regulators outline rules for cross-border digital payments',description:'Draft guidance covers licensing, settlement timelines, and consumer protection for new payment networks.',url:'https://example.com/a6',urlToImage:null,publishedAt:mins(420),category:'policy',region:'north',tags:[],africaRel:true},
{source:{name:'Global Business Ledger'},title:'Commodity prices ease as global demand cools',description:'Analysts say softer industrial demand pulled metals and agricultural benchmarks lower this week.',url:'https://example.com/a7',urlToImage:null,publishedAt:mins(60),category:'markets',region:'americas',tags:[],africaRel:true,africaNote:'Cocoa, gold, and oil exporters feel price swings quickly, which can move currencies and government budgets.'},
{source:{name:'Pacific Trade Journal'},title:'Helix Semiconductors unveils a lower-power processor line',description:'The company says the new chips cut energy use in data centres and phones, with shipments due next year.',url:'https://example.com/a8',urlToImage:null,publishedAt:mins(250),category:'tech',region:'asia',tags:['Helix Semiconductors']},
{source:{name:'Euro Market Watch'},title:'Aurora Retail Group expands low-cost delivery pilots to emerging markets',description:'The retailer will test cash-on-delivery and locker pickup in several cities before a wider rollout.',url:'https://example.com/a9',urlToImage:null,publishedAt:mins(380),category:'retail',region:'europe',tags:['Aurora Retail Group'],africaRel:true,africaNote:'African cities with strong mobile money use are natural test beds for cash-free delivery, which may open partnerships for local logistics firms.'},
{source:{name:'Americas Energy Report'},title:'Lumen Grid announces a battery storage manufacturing plant',description:'The plant aims to lower storage costs for utilities and large commercial customers.',url:'https://example.com/a10',urlToImage:null,publishedAt:mins(520),category:'energy',region:'americas',tags:['Lumen Grid'],africaRel:true,africaNote:'Cheaper batteries could speed up solar-plus-storage projects across the continent, where grid reliability is a daily constraint.'}];
var FEED_B=[
{src:'Lagos Ledger',title:{en:'Mobile money use reaches record high in West Africa'},summary:{en:'Transfers between wallets hit a high as more retailers accept digital payments.'},link:'https://example.com/b1',pub:mins(70),cat:'fintech',loc:'west',ents:[],lang:'en'},
{src:'Lagos Ledger',title:{en:'Cross-border freight network opens third corridor'},summary:{en:'Digital load matching is cutting waiting times for truck operators on the new route.'},link:'https://example.com/b2',pub:mins(130),cat:'logistics',loc:'west',ents:['Kora Freight'],lang:'en'},
{src:'Abidjan Économie',title:{fr:'Le fret transfrontalier gagne du terrain en Afrique de l\'Ouest',en:'Cross-border freight gains ground in West Africa'},summary:{fr:'Les plateformes numériques réduisent les trajets à vide et accélèrent le dédouanement.',en:'Digital platforms are reducing empty trips and speeding up customs clearance.'},link:'https://example.com/b3',pub:mins(190),cat:'logistics',loc:'west',ents:[],lang:'fr'},
{src:'Maghreb Finance Weekly',title:{en:'Regulators set out cross-border digital payment rules'},summary:{en:'The guidance asks payment networks to meet capital and reporting standards.'},link:'https://example.com/b4',pub:mins(480),cat:'policy',loc:'north',ents:[],lang:'en'},
{src:'Pacific Trade Journal',title:{en:'Commodity prices cool as global demand slows'},summary:{en:'Benchmarks fell as manufacturers cut orders.'},link:'https://example.com/b5',pub:mins(90),cat:'markets',loc:'asia',ents:[],lang:'en'},
{src:'Kampala Tech Review',title:{en:'Startup funding in East Africa hits record quarter'},summary:{en:'Founders say larger rounds are closing faster as regional investors compete.'},link:'https://example.com/b6',pub:mins(260),cat:'startups',loc:'east',ents:[],lang:'en'},
{src:'Southern Health Report',title:{en:'Hospitals adopt solar power to cut outages'},summary:{en:'Backup systems with batteries now keep theatres and cold rooms running.'},link:'https://example.com/b7',pub:mins(330),cat:'health',loc:'south',ents:[],lang:'en'},
{src:'Euro Market Watch',title:{en:'Digital lenders face tougher capital rules in Europe'},summary:{en:'Supervisors want lenders to hold more capital against consumer loans.'},link:'https://example.com/b8',pub:mins(600),cat:'fintech',loc:'europe',ents:[],lang:'en'},
{src:'Dakar Économie',title:{fr:'Un fonds régional soutient les start-up de l\'énergie solaire',en:'A regional fund backs solar start-ups'},summary:{fr:'Le fonds prévoit de financer vingt jeunes entreprises sur trois ans.',en:'The fund plans to finance twenty young companies over three years.'},link:'https://example.com/b9',pub:mins(700),cat:'energy',loc:'west',ents:[],lang:'fr'}];
/* ---------- normalise ---------- */
var hash=function(s){var h=5381,i;for(i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return 's'+(h>>>0).toString(36)};
function normA(r){return{id:hash(r.url||r.title),title:r.title,titleEn:r.title,snippet:r.description||'',source:(r.source&&r.source.name)||'Unknown source',url:r.url,image:r.urlToImage||null,imageCredit:r.urlToImage?'Image: '+((r.source&&r.source.name)||'source'):null,at:Date.parse(r.publishedAt),region:r.region||'pan',topic:r.category||'markets',lang:r.language||'en',entities:r.tags||[],africaRel:!!r.africaRel,africaNote:r.africaNote||null,tr:null}}
function normB(r){var l=r.lang||'en';return{id:hash(r.link||r.title.en),title:r.title[l]||r.title.en,titleEn:r.title.en,snippet:(r.summary&&(r.summary[l]||r.summary.en))||'',source:r.src,url:r.link,image:r.img||null,imageCredit:r.img?'Image: '+r.src:null,at:Date.parse(r.pub),region:r.loc||'pan',topic:r.cat||'markets',lang:l,entities:r.ents||[],africaRel:!!r.africaRel,africaNote:null,tr:l==='en'?null:{title:r.title.en,snippet:r.summary.en}}}
var delay=function(v,ms){return new Promise(function(res){setTimeout(function(){res(v)},ms)})};
var Providers=[{name:'aggregator',fetch:function(){return delay(FEED_A,300)},norm:normA},{name:'events',fetch:function(){return delay(FEED_B,420)},norm:normB}];
/* ---------- cluster near-duplicate headlines ---------- */
var STOP='the and for with from into over that this are was were has have its new says say after as in on of to a an at by is'.split(' ');
var stem=function(w){return w.replace(/(ies)$/,'y').replace(/(ing|ed|es|s)$/,function(m,x){return w.length>5?'':m})};
var toks=function(t){return t.toLowerCase().replace(/[^a-z0-9\- ]/g,' ').split(/\s+/).filter(function(w){return w.length>2&&STOP.indexOf(w)<0}).map(stem)};
function jac(a,b){var s={},i,n=0;a.forEach(function(x){s[x]=1});b.forEach(function(x){if(s[x]){n++;s[x]=2}});var u=Object.keys(s).length+b.filter(function(x){return !s[x]}).length;return u?n/u:0}
function cluster(list,th){th=th||.3;var out=[];list.slice().sort(function(a,b){return b.at-a.at}).forEach(function(s){var t=toks(s.titleEn),hit=out.filter(function(c){return c.topic===s.topic&&c.region!==undefined&&jac(c._t,t)>=th})[0];
if(hit){hit.all.push(s);hit._t=hit._t.concat(t)}else out.push({id:s.id,topic:s.topic,region:s.region,all:[s],_t:t})});
return out.map(function(c){var withImg=c.all.filter(function(x){return x.image})[0],p=withImg||c.all[0],seen={},srcs=c.all.filter(function(x){if(seen[x.source])return false;seen[x.source]=1;return true});
return{id:p.id,primary:p,sources:srcs,others:srcs.filter(function(x){return x!==p}),topic:p.topic,region:p.region,at:Math.max.apply(null,c.all.map(function(x){return x.at})),africaRel:c.all.some(function(x){return x.africaRel}),africaNote:(c.all.filter(function(x){return x.africaNote})[0]||{}).africaNote||null,lang:p.lang}})}
/* ---------- repo ---------- */
var AF=['west','east','south','north','pan'],GL=['europe','asia','americas'],ALL={},CACHE={},PAGE=6;
var REGIONS=[['africa','Africa'],['west','West Africa'],['east','East Africa'],['south','Southern Africa'],['north','North Africa'],['global','Global']],TOPICS=[['all','All topics'],['markets','Markets'],['startups','Startups'],['fintech','Fintech'],['energy','Energy'],['health','Health'],['logistics','Logistics'],['policy','Policy'],['tech','Tech'],['retail','Retail']];
function inRegion(c,r){if(r==='africa')return AF.indexOf(c.region)>-1||c.africaRel;if(r==='global')return GL.indexOf(c.region)>-1;return c.region===r||c.region==='pan'}
var Repo={load:function(q){if(!navigator.onLine)return Promise.reject(new Error('offline'));var key='all',hit=CACHE[key];
var get=hit&&Date.now()-hit.t<60000?Promise.resolve(hit.c):Promise.all(Providers.map(function(p){return p.fetch().then(function(rs){return rs.map(p.norm)})})).then(function(parts){var cs=cluster([].concat.apply([],parts));cs.forEach(function(c){ALL[c.id]=c});CACHE[key]={t:Date.now(),c:cs};return cs});
return get.then(function(cs){var f=cs.filter(function(c){return inRegion(c,q.region)&&(q.topic==='all'||c.topic===q.topic)&&(!q.saved||Saved[c.id])});f.sort(function(a,b){return(b.at+(b.sources.length-1)*900000)-(a.at+(a.sources.length-1)*900000)});return{items:f.slice(0,(q.page||1)*PAGE),total:f.length,more:f.length>(q.page||1)*PAGE,updated:Date.now()}})},clear:function(){CACHE={}}};
var Saved=Store.get('news:saved')||{};
/* ---------- view helpers ---------- */
var ART={markets:'network',startups:'network',fintech:'network',energy:'sun',health:'clinic',logistics:'route',policy:'rail',tech:'network',retail:'route'};
var ago=function(t){var m=Math.max(1,Math.round((Date.now()-t)/60000));return m<60?m+'m ago':m<1440?Math.round(m/60)+'h ago':Math.round(m/1440)+'d ago'};
var tile=function(n){return '<span class="nw-tile" aria-hidden="true">'+esc(n.charAt(0))+'</span>'};
var seed=function(c){var h=0,s=c.id;for(var i=0;i<s.length;i++)h+=s.charCodeAt(i);return h%9+1};
var artFor=function(c){return window.Art.uri(ART[c.topic]||'network',seed(c))};
function imgTag(c,cls){var p=c.primary,src=p.image||artFor(c);return '<div class="nw-img'+(cls?' '+cls:'')+'"><img src="'+esc(src)+'" data-fb="'+artFor(c)+'" alt="" loading="lazy" decoding="async"></div>'}
function meta(c,full){var p=c.primary,b='';if(p.lang!=='en')b+=' <span class="nw-badge">'+p.lang.toUpperCase()+'</span>';if(GL.indexOf(c.region)>-1)b+=' <span class="nw-badge">Global</span>';return '<div class="nw-meta">'+tile(p.source)+'<b>'+esc(p.source)+'</b><span>'+ago(c.at)+'</span>'+b+'</div>'}
function cov(c){return c.others.length?'<div class="nw-co"><span class="nw-stack">'+c.sources.slice(0,3).map(function(s){return tile(s.source)}).join('')+'</span><span>Also covered by '+c.others.length+' source'+(c.others.length===1?'':'s')+'</span></div>':''}
var ttl=function(p){return p.tr&&window.Prefs&&window.Prefs.get('translate')?p.tr.title:p.title},snp=function(p){return p.tr&&window.Prefs&&window.Prefs.get('translate')?p.tr.snippet:p.snippet};
function lead(c){var p=c.primary;return '<button class="nw-lead" data-story="'+c.id+'">'+imgTag(c)+meta(c)+'<h2>'+esc(ttl(p))+'</h2><p>'+esc(snp(p))+'</p>'+cov(c)+'</button>'}
function row(c,img){var p=c.primary;return '<button class="nw-row'+(img===false?' nm':'')+'" data-story="'+c.id+'"><div>'+meta(c)+'<h3>'+esc(ttl(p))+'</h3>'+(img===false?'<p>'+esc(snp(p))+'</p>':'')+cov(c)+'</div>'+(img===false?'':imgTag(c))+'</button>'}
function skel(n){var h='';for(var i=0;i<n;i++)h+='<div style="padding:16px 0;border-top:1px solid var(--rule);display:grid;grid-template-columns:1fr 96px;gap:14px"><div><div class="sk" style="height:12px;width:50%"></div><div class="sk" style="height:20px;margin-top:10px"></div><div class="sk" style="height:20px;width:80%;margin-top:6px"></div></div><div class="sk" style="height:96px;border-radius:14px"></div></div>';return h}
var WARN='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 17h.01M10.3 4l-8 14a2 2 0 001.7 3h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/></svg>',INB='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5"/></svg>';
var state=function(err,h,p,b,a){return '<div class="es'+(err?' err':'')+'"><div class="ico">'+(err?WARN:INB)+'</div><h3>'+h+'</h3><p>'+p+'</p>'+(b?'<button data-act="'+a+'">'+b+'</button>':'')+'</div>'};
/* ---------- Home and Explore blocks ---------- */
function renderBlock(el){var kind=el.dataset.news;el.innerHTML=(kind==='explore'?'<div class="nw-sec"><h2>Latest news</h2><a href="#" data-view="news">See all</a></div>':'')+'<div class="nw-list">'+skel(kind==='home'?3:2)+'</div>';
Repo.load({region:window.Prefs?window.Prefs.get('region'):'africa',topic:'all'}).then(function(r){var l=$('.nw-list',el);if(l)l.innerHTML=r.items.slice(0,kind==='home'?4:3).map(function(c){return row(c)}).join('')+'<div style="border-top:1px solid var(--rule)"></div>'}).catch(function(){el.innerHTML=''})}
function renderBlocks(){$$('[data-news]').forEach(renderBlock)}
/* ---------- News page ---------- */
var N={region:window.Prefs?window.Prefs.get('region'):(Store.get('news:region')||'africa'),topic:Store.get('news:topic')||'all',saved:false,page:1,loading:false};
function chips(list,cur,key){return '<div class="nw-chips" role="group" aria-label="'+key+'">'+list.map(function(x){return '<button class="nw-chip" aria-pressed="'+(cur===x[0])+'" data-'+key+'="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'}
function shell(){return '<header class="hb"><div class="in"><button class="back" aria-label="Back">'+BACK+'Back</button><span class="t">News</span><span class="rt"></span></div></header><main class="pgw"><div class="nw-top"><div><h1>Top stories</h1><small class="up">Loading</small></div><button class="nw-rf" aria-label="Refresh">'+RF+'</button></div><div class="nwr">'+chips(REGIONS,N.region,'region')+'</div><div class="nwt" style="margin-top:8px">'+'</div><div class="nwl"></div><p class="note" style="margin-top:26px">Sample stories from fictional outlets. Headlines and summaries come from each source, and full stories open at the source.</p></main>'}
function topicRow(){return '<div class="nw-chips" role="group" aria-label="topic">'+TOPICS.map(function(x){return '<button class="nw-chip" aria-pressed="'+(N.topic===x[0])+'" data-topic="'+x[0]+'">'+x[1]+'</button>'}).join('')+'<button class="nw-chip sv" aria-pressed="'+N.saved+'" data-saved="1">'+BM.replace(/20/g,'14')+'Saved '+Object.keys(Saved).filter(function(k){return Saved[k]}).length+'</button></div>'}
function renderNews(first){var pg=$('#v-news .pg');if(first||!$('.nwl',pg)){pg.innerHTML=shell()}
$('.nwr',pg).innerHTML=chips(REGIONS,N.region,'region');$('.nwt',pg).innerHTML=topicRow();loadNews(true)}
function loadNews(reset){var box=$('#v-news .nwl');if(!box)return;if(reset){N.page=1;box.innerHTML=skel(4)}N.loading=true;
Repo.load({region:N.region,topic:N.topic,saved:N.saved,page:N.page}).then(function(r){N.loading=false;var up=$('#v-news .up');if(up)up.textContent='Updated just now';
if(!r.items.length){box.innerHTML=state(0,N.saved?'No saved stories yet':'No stories here right now','Try another region or topic.','Clear filters','reset');return}
var h='';r.items.forEach(function(c,i){h+=i===0?lead(c):row(c,i>0?undefined:false)});box.innerHTML=h+(r.more?'<button class="nw-more" data-more="1">Load more</button>':'<div style="border-top:1px solid var(--rule)"></div>')}).catch(function(e){N.loading=false;var up=$('#v-news .up');if(up)up.textContent='Not updated';box.innerHTML=state(1,e&&e.message==='offline'?'You are offline':'Stories did not load','Check your connection and try again.','Try again','retry')})}
$('#v-news').addEventListener('click',function(e){var t=e.target,b;
if(b=t.closest('[data-region]')){N.region=b.dataset.region;window.Prefs&&window.Prefs.set('region',N.region);renderNews(false);return}
if(b=t.closest('[data-topic]')){N.topic=b.dataset.topic;Store.set('news:topic',N.topic);N.saved=false;renderNews(false);return}
if(t.closest('[data-saved]')){N.saved=!N.saved;renderNews(false);return}
if(t.closest('[data-more]')){N.page++;loadNews(false);return}
if(t.closest('.nw-rf')){var r=t.closest('.nw-rf');r.classList.add('spin');Repo.clear();loadNews(true);setTimeout(function(){r.classList.remove('spin')},700);return}
if(b=t.closest('[data-act]')){if(b.dataset.act==='reset'){N.topic='all';N.saved=false;N.region='africa';window.Prefs&&window.Prefs.set('region','africa');Store.set('news:topic','all')}renderNews(false)}});
/* ---------- Story page ---------- */
var cur=null,tr=false;
window.openStory=function(id){if(!ALL[id])return;cur=ALL[id];tr=!!(window.Prefs&&window.Prefs.get('translate'));App.push('story')};
var LINK={'Kora Freight':['Company','data-ent="kora"'],'Ama Boateng':['Person','data-ent="ama"'],'Aya Health':['Company','data-ent="aya"'],'Helix Semiconductors':['Company','data-ent="helix"'],'Aurora Retail Group':['Company','data-ent="aurora"'],'Lumen Grid':['Company','data-ent="lumen"']};
function renderStory(){var c=cur;if(!c)return;var p=c.primary,t=tr&&p.tr?p.tr:{title:p.title,snippet:p.snippet},ent=p.entities.filter(function(x){return LINK[x]});
$('#v-story .pg').innerHTML='<header class="hb"><div class="in"><button class="back" aria-label="Back">'+BACK+'Back</button><span class="t">Story</span><span class="rt"><button class="sv" aria-label="Save story" aria-pressed="'+!!Saved[c.id]+'">'+BM+'</button></span></div></header><main class="pgw">'+
'<div style="margin-top:22px">'+meta(c)+'</div><h1 style="margin:10px 0 0">'+esc(t.title)+'</h1>'+
'<figure class="nw-fig">'+imgTag(c)+'<figcaption>'+esc(p.imageCredit||'Illustration: Meridian Studio')+'</figcaption></figure>'+
(p.tr?'<button class="nw-tr" data-tr="1">'+(tr?'Show original ('+p.lang.toUpperCase()+')':'Translate to English')+'</button>'+(tr?'<span style="font-size:12px;color:var(--mute);margin-left:8px">Translated by Meridian AI</span>':''):'')+
'<p class="nw-lede">'+esc(t.snippet)+'</p>'+
(c.africaNote?'<div class="nw-why"><b>Why it matters for African readers</b><p>'+esc(c.africaNote)+'</p><span>Written by Meridian AI. Sample.</span></div>':'')+
(ent.length?'<h2 style="font:500 22px Newsreader,serif;margin:28px 0 0">Mentioned</h2><div class="nw-ent">'+ent.map(function(x){return '<button '+LINK[x][1]+'><small>'+LINK[x][0]+'</small>'+esc(x)+'</button>'}).join('')+'</div>':'')+
'<div class="nw-act"><a class="p3b go" href="'+esc(p.url)+'" target="_blank" rel="noopener noreferrer">Read at '+esc(p.source)+'</a><button class="p3b o" data-share="1">Share to community</button></div>'+
(c.others.length?'<h2 style="font:500 22px Newsreader,serif;margin:30px 0 4px">Coverage from '+c.sources.length+' sources</h2><div>'+c.sources.map(function(s){return '<a class="nw-cov" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+tile(s.source)+'<div><b>'+esc(s.title)+'</b><small>'+esc(s.source)+', '+ago(s.at)+'</small></div></a>'}).join('')+'<div style="border-top:1px solid var(--rule)"></div></div>':'')+
'<p class="nw-rights">Headline and summary from '+esc(p.source)+'. Full stories open at the source and are not republished here. <button class="nw-rep" data-rep="1">Report a problem</button></p></main>'}
$('#v-story').addEventListener('click',function(e){var t=e.target;
if(t.closest('.sv')){Saved[cur.id]=!Saved[cur.id];Store.set('news:saved',Saved);t.closest('.sv').setAttribute('aria-pressed',!!Saved[cur.id]);window.toast(Saved[cur.id]?'Saved':'Removed from saved');return}
if(t.closest('[data-tr]')){tr=!tr;renderStory();return}
if(t.closest('[data-rep]')){window.toast('Thanks, we will review this');return}
if(t.closest('[data-share]')){var id=cur.id;App.tab('community');setTimeout(function(){window.openCompose&&window.openCompose();window.Tray&&window.Tray.addStory(id)},60)}});
/* story card used in posts */
window.storyEmbed=function(id){var c=ALL[id];if(!c)return '';var p=c.primary;return '<button class="sc" data-story="'+id+'">'+imgTag(c)+'<div><small>'+esc(p.source)+', '+ago(c.at)+'</small><b>'+esc(ttl(p))+'</b></div></button>'};
window.storyThumb=function(id){var c=ALL[id];return c?(c.primary.image||artFor(c)):''};
window.News={Repo:Repo,cluster:cluster,normA:normA,normB:normB,jac:jac,toks:toks,ALL:ALL};
/* ---------- hooks ---------- */
var prev=window.onView;
window.onView=function(v){prev&&prev(v);if(v==='news'){if(window.Prefs)N.region=window.Prefs.get('region');renderNews(true)}if(v==='story')renderStory();if(v==='home'||v==='explore')renderBlocks()};
window.addEventListener('online',function(){var v=$('.view.on');if(v&&v.id==='v-news'&&$('#v-news [data-act="retry"]'))loadNews(true);if(v&&(v.id==='v-home'||v.id==='v-explore'))renderBlocks()});
renderBlocks();
})();
