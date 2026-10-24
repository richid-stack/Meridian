(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var DOC='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>';
var CK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
var INBOX='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5"/></svg>';
var WARN='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 17h.01M10.3 4l-8 14a2 2 0 001.7 3h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/></svg>';
var Deals={
aya:{n:'Aya Health',sec:'Health',one:'Solar-powered clinics',blurb:'Seed capital to put solar-powered diagnostics in 60 rural clinics.',raised:'$1.28M',target:'$2M',rv:1280000,tv:2000000,pct:64,inv:38,days:11,cap:'$12M',min:'$100',inst:'SAFE',close:'10 Oct',
S:['Live in 14 clinics, with 4,200 patient visits a month.','Pilot partnerships with two regional health services.','The founder ran clinic operations for six years.'],
Rk:['Depends on public health procurement, which can move slowly.','Early stage, with a short revenue history.','Your investment is illiquid and you could lose all of it.'],
use:[['Clinic rollout',55],['Equipment and solar',30],['Training and operations',15]],docs:[['Investment terms',1],['Pilot results report',1],['Pitch deck',0]],
up:['First 14 clinics run on solar with no outages','Nia Mensah, 5 days ago','Our clinics stayed open through three grid failures last month.']},
kora:{n:'Kora Freight',sec:'Logistics',one:'Three new freight corridors',blurb:'Growth capital to open three new freight corridors across West Africa.',raised:'$760K',target:'$2M',rv:760000,tv:2000000,pct:38,inv:215,days:19,cap:'$180M',min:'$100',inst:'SAFE',close:'18 Oct',
S:['Revenue run rate grew 212% over five years.','Existing backers, including Continental Growth Fund, are joining the round.','Operating in three countries, with a clear path to a fourth.'],
Rk:['Concentrated in road freight, which is sensitive to fuel prices.','Rival Nakala has more operators in Nigeria.','Your investment is illiquid and you could lose all of it.'],
use:[['New corridors',45],['Product and matching engine',35],['Working capital',20]],docs:[['Investment terms',1],['Audited financials, 2025',1],['Pitch deck',0]],
up:['Q3 update: Kumasi to Abidjan is live','Ama Boateng, 2 weeks ago','Our first cross-border corridor is carrying 140 loads a week, ahead of plan.']},
zuri:{n:'Zuri Energy',sec:'Energy',one:'Solar for small businesses',blurb:'Working capital to finance solar systems for small businesses in Kumasi and Tamale.',raised:'$310K',target:'$1.5M',rv:310000,tv:1500000,pct:21,inv:74,days:26,cap:'$24M',min:'$100',inst:'SAFE',close:'25 Oct',isNew:1,
S:['Recurring monthly payments from 1,900 business customers.','Repayment rate above 96% over 18 months.','The CFO previously led finance at a listed utility.'],
Rk:['Equipment is priced in dollars while revenue is in cedis.','Concentrated in two cities.','Your investment is illiquid and you could lose all of it.'],
use:[['Equipment financing',60],['Sales and installers',25],['Working capital',15]],docs:[['Investment terms',1],['Audited financials, 2025',1],['Pitch deck',0]],
up:['Tamale branch reaches 300 customers','Tunde Dlamini, 1 week ago','We opened the branch on schedule and installed 40 systems in the first month.']}};
var N=[{id:1,u:1,k:'deal',t:'<b>Aya Health</b> reached 64% of its funding goal',w:'12m',deal:'aya'},{id:2,u:1,k:'live',t:'<b>Ama Boateng</b> is live: Building a logistics network across borders',w:'20m',live:1},{id:3,u:1,k:'reply',t:'<b>Kunle Okafor</b> answered your question',w:'2h',tab:'community'},{id:4,u:0,k:'up',t:'<b>Kora Freight</b> posted an update: Kumasi to Abidjan is live',w:'1d',deal:'kora'},{id:5,u:0,k:'fol',t:'<b>Nia Mensah</b> started following you',w:'2d'}];
var NI={deal:'<span class="ni r">64</span>',live:'<span class="ni r"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>',reply:'<span class="ni r"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg></span>',up:'<span class="ni">K</span>',fol:'<span class="ni">NM</span>'};
function state(err,h,p,b,a){return '<div class="es'+(err?' err':'')+'"><div class="ico">'+(err?WARN:INBOX)+'</div><h3>'+h+'</h3><p>'+p+'</p>'+(b?'<button data-act="'+a+'">'+b+'</button>':'')+'</div>'}
function sk(n,h){var s='';for(var i=0;i<n;i++)s+='<div class="sk" style="height:'+h+'px;margin-top:14px"></div>';return s}
function sync(){var c=N.filter(function(x){return x.u}).length;$$('.bell .dotu').forEach(function(d){d.hidden=!c});var m=$('#v-notifs .mar');if(m)m.disabled=!c}
/* Capital landing */
var filt='all',cLoaded=false;
function renderCapital(){
var el=$('#v-capital .lst');
if(!navigator.onLine){el.innerHTML=state(1,'You are offline','Check your connection and try again.','Try again','retry');return}
if(!cLoaded){el.innerHTML=sk(3,84);setTimeout(function(){cLoaded=true;renderCapital()},450);return}
var L=Object.keys(Deals).filter(function(k){var d=Deals[k];return filt==='all'||(filt==='soon'&&d.days<=14)||(filt==='new'&&d.isNew)});
if(filt==='closed'||!L.length){el.innerHTML=state(0,filt==='closed'?'No closed rounds yet':'Nothing here right now','Rounds that reach their goal or end will appear here.','See open rounds','all');return}
el.innerHTML=L.map(function(k){var d=Deals[k];return '<button class="rd" data-deal="'+k+'"><div class="ring" style="--p:'+d.pct+'"><span>'+d.pct+'%</span></div><div><b>'+d.n+'</b><small>'+d.one+'</small></div><em>'+d.raised+'<small>'+d.days+' days left</small></em></button>'}).join('')+'<div style="border-top:1px solid var(--rule)"></div>';
}
$('#v-capital').addEventListener('click',function(e){
var f=e.target.closest('.fc');if(f){filt=f.dataset.f;$$('.fc').forEach(function(x){x.setAttribute('aria-pressed',x===f)});renderCapital();return}
var a=e.target.closest('[data-act]');if(a){if(a.dataset.act==='all'){filt='all';$$('#v-capital .fc').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.f==='all')})}renderCapital()}
});
/* Deal room */
var dealId='kora',tok=0;window.curDeal=function(){return dealId};window.Deals=Deals;
window.openDeal=function(id){dealId=id;App.push('deal')};
function hdr(t,w){return '<header><div class="in"><button class="back" aria-label="Back">'+BACK+'Capital</button><span class="t">'+(t||'')+(w?'<button class="wt" aria-label="Watch this round" aria-pressed="'+(!!(window.isWatch&&window.isWatch(w)))+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 4h12v17l-6-4-6 4z"/></svg></button>':'')+'</span></div></header>'}
function dealHTML(d){
var ul=function(a){return '<ul>'+a.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'};
var cols=['var(--accent)','var(--ink)','var(--mute)'];
return hdr(d.days+' days left',dealId)+'<main class="wrap"><div class="top"><small>Community round</small><h1>'+d.n+'</h1><p>'+d.blurb+'</p></div>'+
'<div class="panel"><div class="big">'+d.raised+'<span>of '+d.target+'</span></div>'+(window.Money?window.Money.line(d.rv,'fx2'):'')+'<div class="bar"><i style="width:'+d.pct+'%"></i></div><div class="sub"><span>'+d.pct+'% funded</span><span>'+d.inv+' investors</span></div><div class="grid"><div><span>Valuation cap</span><strong>'+d.cap+'</strong></div><div><span>Minimum</span><strong>'+d.min+'</strong></div><div><span>Instrument</span><strong>'+d.inst+'</strong></div><div><span>Closes</span><strong>'+d.close+'</strong></div></div></div>'+
'<h2>Due diligence summary</h2><p class="cap">Written by Meridian AI from filings, financials, and interviews. Not investment advice.</p><div class="dd"><h3>Strengths</h3>'+ul(d.S)+'<div class="r"><h3>Risks</h3>'+ul(d.Rk)+'</div></div>'+
'<h2>Use of funds</h2><div class="uf">'+d.use.map(function(u,i){return '<i style="width:'+u[1]+'%;background:'+cols[i]+'"></i>'}).join('')+'</div><div class="lg">'+d.use.map(function(u,i){return '<div><i style="background:'+cols[i]+'"></i>'+u[0]+'<b>'+u[1]+'%</b></div>'}).join('')+'</div>'+
'<h2>Documents</h2>'+d.docs.map(function(x){return '<div class="doc">'+DOC+x[0]+(x[1]?'<em>'+CK+'Verified</em>':'<em style="color:var(--mute)">Founder upload</em>')+'</div>'}).join('')+
'<h2>Latest from the founder</h2><div class="upd"><b>'+d.up[0]+'</b><span>'+d.up[1]+'</span><p>'+d.up[2]+'</p></div><p class="note">Sample deal room with placeholder data. Available to verified investors in eligible countries.</p>'+(window.Money&&window.Money.cur()!=='USD'?'<p class="note">Rounds are priced in USD. Local amounts are estimates at sample rates.</p>':'')+'</main>'+
'<div class="act"><div class="in"><div class="chips" role="group" aria-label="Investment amount"><button class="chip" aria-pressed="false">$100</button><button class="chip" aria-pressed="true">$250</button><button class="chip" aria-pressed="false">$500</button><button class="chip" aria-pressed="false">$1,000</button></div><button class="go">Continue with $250</button><small>You review and confirm on the next step.</small></div></div>';
}
function renderDeal(){
var box=$('#v-deal .room'),t=++tok;
if(!navigator.onLine){box.innerHTML=hdr('')+state(1,'You are offline','Check your connection and try again.','Try again','retry');return}
box.innerHTML=hdr('')+'<main class="wrap"><div class="sk" style="height:16px;width:38%;margin-top:28px"></div><div class="sk" style="height:46px;width:70%;margin-top:12px"></div><div class="sk" style="height:250px;border-radius:14px;margin-top:22px"></div><div class="sk" style="height:22px;width:55%;margin-top:38px"></div><div class="sk" style="height:110px;margin-top:14px"></div></main>';
setTimeout(function(){if(t!==tok)return;box.innerHTML=dealHTML(Deals[dealId]);window.scrollTo(0,0)},450);
}
$('#v-deal').addEventListener('click',function(e){
var c=e.target.closest('.chip');if(c){$$('#v-deal .chip').forEach(function(x){x.setAttribute('aria-pressed',x===c)});$('#v-deal .go').textContent='Continue with '+c.textContent;return}
if(e.target.closest('[data-act="retry"]'))renderDeal();
});
/* Notifications */
function renderNotifs(){
var el=$('#v-notifs .nl'),t=++tok;
if(!navigator.onLine){el.innerHTML=state(1,'You are offline','Check your connection and try again.','Try again','retry');return}
el.innerHTML=sk(4,64);
setTimeout(function(){
if(t!==tok)return;
var row=function(n){return '<button class="nr'+(n.u?' u':'')+'" data-nid="'+n.id+'">'+NI[n.k]+'<div><p>'+n.t+'</p><small>'+n.w+'</small></div></button>'};
var nw=N.filter(function(n){return n.u}),old=N.filter(function(n){return !n.u});
el.innerHTML=(nw.length?'<h2>New</h2>'+nw.map(row).join(''):'')+(old.length?'<h2>Earlier</h2>'+old.map(row).join(''):'');
sync();
},400);
}
$('#v-notifs').addEventListener('click',function(e){
if(e.target.closest('.mar')){N.forEach(function(n){n.u=0});sync();renderNotifs();return}
if(e.target.closest('[data-act="retry"]')){renderNotifs();return}
var r=e.target.closest('.nr');if(!r)return;
var n=N.filter(function(x){return x.id==r.dataset.nid})[0];n.u=0;sync();
if(n.deal)window.openDeal(n.deal);else if(n.live)window.openLive();else if(n.tab)App.tab(n.tab);else{r.classList.remove('u')}
});
window.addEventListener('online',function(){var v=$('.view.on');if(v&&v.id==='v-capital')renderCapital()});
window.onView=function(v){if(v==='capital')renderCapital();if(v==='deal')renderDeal();if(v==='notifs')renderNotifs();sync()};
sync();
})();
