(function(){
'use strict';
/* =====================================================================
   M5  Global
   Prefs     region lens, display currency, reading language (persisted)
   Money     sample FX table; rounds stay priced in USD, local amounts are estimates
   Markets   Home strip driven by lens and currency
   Entities  people and companies worldwide, with sourced profiles
   Search    client-side search with typo tolerance across the whole catalogue
   ===================================================================== */
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var Store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var CK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
function hb(t){return '<header class="hb"><div class="in"><button class="back" aria-label="Back">'+BACK+'Back</button><span class="t">'+(t||'')+'</span><span class="rt"></span></div></header>'}
/* ---------- Prefs ---------- */
var REG={africa:'Africa',west:'West Africa',east:'East Africa',south:'Southern Africa',north:'North Africa',global:'Global'};
var RDESC={africa:'People, companies, and news across the continent, plus global stories that matter here.',west:'Ghana, Nigeria, Côte d\'Ivoire, Senegal, and neighbours.',east:'Kenya, Uganda, Tanzania, Ethiopia, and neighbours.',south:'South Africa, Zambia, Botswana, and neighbours.',north:'Egypt, Morocco, Tunisia, Algeria, and neighbours.',global:'Industry leaders and companies from every region.'};
var P=(function(){var d={region:'africa',currency:'USD',translate:true},s=Store.get('prefs')||{},o={};for(var k in d)o[k]=s[k]!==undefined?s[k]:d[k];return o})(),subs=[];
window.Prefs={get:function(k){return k?P[k]:P},set:function(k,v){if(P[k]===v)return;P[k]=v;Store.set('prefs',P);subs.forEach(function(f){f(k,v)})},on:function(f){subs.push(f)}};
/* ---------- Money (sample rates; live rates arrive with the data API) ---------- */
var FX={USD:{r:1,s:'$',n:'US dollar'},GHS:{r:12.18,s:'GH₵',n:'Ghanaian cedi'},NGN:{r:1540,s:'₦',n:'Nigerian naira'},KES:{r:129,s:'KSh ',n:'Kenyan shilling'},ZAR:{r:18.2,s:'R',n:'South African rand'},XOF:{r:605,s:'CFA ',n:'West African CFA franc'},EUR:{r:.92,s:'€',n:'Euro'},GBP:{r:.79,s:'£',n:'Pound sterling'}};
var compact=function(n){var a=Math.abs(n);if(a>=1e9)return(n/1e9).toFixed(1).replace(/\.0$/,'')+'B';if(a>=1e6)return(n/1e6).toFixed(1).replace(/\.0$/,'')+'M';return Math.round(n).toLocaleString('en-US')};
var Money={cur:function(){return P.currency},rate:function(c){return FX[c||P.currency].r},approx:function(usd){var c=P.currency;return c==='USD'?'':'≈ '+FX[c].s+compact(usd*FX[c].r)},line:function(usd,cls){var a=Money.approx(usd);return a?'<span class="fx '+(cls||'')+'">'+a+'</span>':''}};
window.Money=Money;
/* ---------- lens pill and settings subtitle ---------- */
function syncLens(){var t=REG[P.region]+', '+P.currency;$$('.lensb').forEach(function(b){b.textContent=t});$$('[data-prefs-sub]').forEach(function(b){b.textContent=t})}
/* ---------- Markets ---------- */
var IDX={africa:[['Ghana Composite','6,412',.84],['Nigeria All-Share','121,540',.42],['Cocoa','7,860',1.9],['Gold','2,684',-.12]],west:[['Ghana Composite','6,412',.84],['Nigeria All-Share','121,540',.42],['Cocoa','7,860',1.9],['Gold','2,684',-.12]],east:[['Kenya 20','1,812',.31],['Uganda Index','3,205',-.18],['Coffee','312',.9],['Gold','2,684',-.12]],south:[['South Africa All-Share','82,410',.22],['Platinum','985',-.4],['Gold','2,684',-.12],['Copper','4.31',.7]],north:[['Egypt 30','29,870',.55],['Morocco Index','13,240',.12],['Brent crude','81.4',-.6],['Gold','2,684',-.12]],global:[['Global 500','5,310',.35],['Europe 50','4,980',-.14],['Brent crude','81.4',-.6],['Gold','2,684',-.12]]};
var spark=function(seed,up){var a=[],v=up?16:4,i;for(i=0;i<6;i++){a.push((i*12)+','+Math.max(2,Math.min(18,v)).toFixed(0));v+=(up?-1:1)*(1+((seed*(i+3))%4))}return a.join(' ')};
function renderMarkets(){var row=$('#v-home .mk .row');if(!row)return;var c=P.currency==='USD'?(P.region==='global'?'EUR':'GHS'):P.currency,pair=P.region==='global'&&P.currency==='USD'?'EUR/USD':'USD/'+c,rate=P.region==='global'&&P.currency==='USD'?(1/FX.EUR.r).toFixed(3):FX[c].r.toLocaleString('en-US',{maximumFractionDigits:c==='NGN'?0:2});
var list=IDX[P.region].slice(0,1).concat([[pair,rate,-.31]]).concat(IDX[P.region].slice(1));
row.innerHTML=list.map(function(m,i){var up=m[2]>=0,col=up?'#E3B341':'#E8836B';return '<div class="t"><span>'+esc(m[0])+'</span><strong>'+m[1]+'</strong><em class="'+(up?'':'d')+'">'+(up?'+':'')+m[2].toFixed(2)+'%</em><svg viewBox="0 0 60 20" preserveAspectRatio="none"><polyline fill="none" stroke="'+col+'" stroke-width="1.5" points="'+spark(i+3,up)+'"/></svg></div>'}).join('')}
/* ---------- Catalogue: people and companies ---------- */
var BOOKS={zero:['Zero to One','Peter Thiel','#1F4E79'],goal:['The Goal','Eliyahu Goldratt','#5B3A29'],things:['Things Fall Apart','Chinua Achebe','#7A2E3A']};
var SRC=function(a){return a};
var ENT={
ama:{kind:'person',n:'Ama Boateng',i:'AB',role:'Founder and CEO, Kora Freight',view:'profile',reg:'west',keys:'founder logistics freight ghana accra'},
kora:{kind:'org',n:'Kora Freight',l:'K',view:'company',reg:'west',tag:'Digital freight network',keys:'logistics freight ghana accra'},
nia:{kind:'person',n:'Nia Mensah',i:'NM',role:'CEO, Aya Health',loc:'Accra, Ghana',reg:'west',mem:1,keys:'health clinics solar ceo ghana',
lede:'Nia Mensah leads Aya Health, which equips rural clinics with solar-powered diagnostics. She previously ran clinic operations and now raises capital from a community of investors.',
facts:[['Born','1985, Tamale'],['Education','University of Ghana, public health'],['Known for','Solar-powered rural clinics'],['Boards','Aya Health']],
tl:[['2012','Joins clinic operations','Regional health service'],['2018','Runs 40 clinics','Operations lead'],['2023','Founds Aya Health','First 14 clinics powered by solar'],['2026','Opens a $2M seed round','Community investors']],books:['things'],
src:[['Aya Health company site','Company','Sep 2026'],['Regional health service report','Report','Mar 2026']],
snap:{h:'Aya Health',s:'Seed, 2026',g:[['Valuation cap','$12M'],['Raising','$2M'],['Clinics','14'],['Founded','2023']],tr:[1,2,3,5,8,12],lab:'Clinics, three years'}},
kunle:{kind:'person',n:'Kunle Okafor',i:'KO',role:'Partner, Sahel Ventures',loc:'Lagos, Nigeria',reg:'west',mem:1,keys:'investor venture capital seed lagos nigeria',
lede:'Kunle Okafor invests in early-stage companies across West Africa, with a focus on logistics, health, and payments. He writes about diligence and founder-investor trust.',
facts:[['Born','1981, Kano'],['Education','Lagos Business School'],['Known for','Seed investing in logistics and health'],['Boards','Sahel Ventures, Kora Freight']],
tl:[['2009','Joins a regional bank','Corporate lending'],['2016','Co-founds Sahel Ventures','First fund, $40M'],['2021','Leads Kora Freight Series A','Board seat'],['2025','Closes second fund','$140M']],books:['zero'],
src:[['Sahel Ventures website','Company','Aug 2026'],['Fund announcement','Press release','Jun 2025']],
snap:{h:'Sahel Ventures',s:'Venture capital',g:[['Assets','$180M'],['Portfolio','46'],['Cheque size','$100K to $1M'],['Founded','2016']],tr:[2,3,4,6,9,12],lab:'Assets, five years'}},
tunde:{kind:'person',n:'Tunde Dlamini',i:'TD',role:'CFO, Zuri Energy',loc:'Kumasi, Ghana',reg:'west',mem:1,keys:'cfo finance energy solar ghana kumasi',
lede:'Tunde Dlamini is chief financial officer of Zuri Energy, which finances solar systems for small businesses. He previously led finance at a listed utility.',
facts:[['Born','1979, Mbabane'],['Education','University of Cape Town, accounting'],['Known for','Asset-backed energy financing'],['Boards','Zuri Energy']],
tl:[['2005','Joins an audit firm','Qualified accountant'],['2013','Finance lead, listed utility','Capital planning'],['2020','Joins Zuri Energy','Chief financial officer'],['2026','Opens a $1.5M round','Community investors']],books:['goal'],
src:[['Zuri Energy company site','Company','Sep 2026']],
snap:{h:'Zuri Energy',s:'Growth, 2026',g:[['Valuation cap','$24M'],['Raising','$1.5M'],['Customers','1,900'],['Founded','2020']],tr:[1,3,5,8,11,14],lab:'Customers, five years'}},
fatou:{kind:'person',n:'Fatou Keita',i:'FK',role:'Head of operations, Kora Freight',loc:'Accra, Ghana',reg:'west',mem:1,keys:'operations logistics freight ghana',
lede:'Fatou Keita runs operations at Kora Freight, where she built the dispatch playbook for new corridors. She mentors operators across three countries.',
facts:[['Born','1990, Bamako'],['Education','Université de Bamako, logistics'],['Known for','Cross-border dispatch operations'],['Boards','None']],
tl:[['2014','Dispatch coordinator','Port logistics'],['2019','Joins Kora Freight','Operations manager'],['2024','Head of operations','212-person team'],['2026','Opens Abidjan corridor','140 loads a week']],books:['goal'],
src:[['Kora Freight company site','Company','Sep 2026']],
snap:{h:'Kora Freight',s:'Series B, 2025',g:[['Valuation','$180M'],['Total raised','$64M'],['Team','212'],['Founded','2019']],tr:[1,2,4,7,11,16],lab:'Revenue index, five years'}},
priya:{kind:'person',n:'Priya Raman',i:'PR',role:'CEO, Helix Semiconductors',loc:'Singapore',reg:'asia',keys:'chips semiconductors technology ceo singapore asia',
lede:'Priya Raman has led Helix Semiconductors since 2019. A chip architect by training, she steered the company toward low-power processors for data centres and phones.',
facts:[['Born','1979, Chennai'],['Education','Institute of Technology, electrical engineering'],['Known for','Power-efficient processor design'],['Boards','Helix Semiconductors']],
tl:[['2004','Joins the design team','Helix Semiconductors'],['2012','Leads chip architecture','Mobile processors'],['2019','Becomes CEO','Revenue $5.9B'],['2025','Unveils low-power line','Shipping next year']],books:['goal'],
src:[['Helix annual report, 2025','Annual report','Mar 2026'],['Product announcement','Press release','Sep 2026']],
snap:{h:'Helix Semiconductors',s:'Public company',g:[['Market value','$41B'],['Revenue','$9.2B'],['Employees','18,400'],['Founded','2003']],tr:[7.1,7.8,8.6,9.2],lab:'Revenue, four years'}},
mateo:{kind:'person',n:'Mateo Alvarez',i:'MA',role:'CEO, Lumen Grid',loc:'Santiago, Chile',reg:'americas',keys:'energy storage batteries utilities ceo chile americas',
lede:'Mateo Alvarez is chief executive of Lumen Grid, which builds battery storage for utilities. Before joining, he ran grid operations for a national power company.',
facts:[['Born','1976, Valparaíso'],['Education','Universidad de Chile, engineering'],['Known for','Utility-scale battery storage'],['Boards','Lumen Grid']],
tl:[['2001','Grid engineer','National power company'],['2011','Co-founds Lumen Grid','First storage pilot'],['2017','Becomes CEO','Listed on exchange'],['2026','Announces storage plant','Lower costs for utilities']],books:['zero'],
src:[['Lumen Grid investor relations','Company','Sep 2026'],['Plant announcement','Press release','Sep 2026']],
snap:{h:'Lumen Grid',s:'Public company',g:[['Market value','$12B'],['Revenue','$2.4B'],['Employees','6,100'],['Founded','2011']],tr:[1.4,1.7,2.1,2.4],lab:'Revenue, four years'}},
sofia:{kind:'person',n:'Sofia Lindqvist',i:'SL',role:'Founder and chair, Aurora Retail Group',loc:'Stockholm, Sweden',reg:'europe',keys:'retail delivery founder chair sweden europe',
lede:'Sofia Lindqvist founded Aurora Retail Group in 1996 and built it into one of Europe\'s larger multi-format retailers. She now focuses on delivery and emerging-market pilots.',
facts:[['Born','1968, Gothenburg'],['Education','Stockholm School of Economics'],['Known for','Low-cost retail and delivery'],['Boards','Aurora Retail Group']],
tl:[['1996','Founds Aurora','One store'],['2008','Opens online channel','Home delivery'],['2019','Steps up to chair','New CEO appointed'],['2026','Expands delivery pilots','Emerging markets']],books:['zero'],
src:[['Aurora annual report, 2025','Annual report','Apr 2026'],['Pilot announcement','Press release','Sep 2026']],
snap:{h:'Aurora Retail Group',s:'Private company',g:[['Valuation','$6.8B'],['Revenue','$3.1B'],['Employees','12,000'],['Founded','1996']],tr:[2.4,2.7,2.9,3.1],lab:'Revenue, four years'}},
aya:{kind:'org',n:'Aya Health',l:'A',tag:'Solar-powered rural clinics',loc:'Accra, Ghana',reg:'west',mem:1,deal:'aya',sec:'Health',keys:'health clinics solar ghana',
snap:[['Valuation cap','$12M'],['Raising','$2M'],['Clinics','14'],['Founded','2023']],stage:'Seed, 2026',trend:[['2023',1],['2024',4],['2025',9],['2026',14]],unit:'Clinics',
lede:'Aya Health equips rural clinics with solar-powered diagnostics so they stay open through grid failures. It serves 4,200 patient visits a month across 14 sites.',
facts:[['Founded','2023, Accra'],['Sector','Health care'],['Stage','Seed'],['Markets','Ghana']],leaders:['nia'],src:[['Aya Health company site','Company','Sep 2026'],['Regional health service report','Report','Mar 2026']]},
zuri:{kind:'org',n:'Zuri Energy',l:'Z',tag:'Solar finance for small businesses',loc:'Kumasi, Ghana',reg:'west',mem:1,deal:'zuri',sec:'Energy',keys:'energy solar finance ghana',
snap:[['Valuation cap','$24M'],['Raising','$1.5M'],['Customers','1,900'],['Founded','2020']],stage:'Growth, 2026',trend:[['2023',500],['2024',900],['2025',1400],['2026',1900]],unit:'Customers',
lede:'Zuri Energy finances solar systems for small businesses in Kumasi and Tamale, collecting monthly payments over mobile money. Repayment has stayed above 96% for 18 months.',
facts:[['Founded','2020, Kumasi'],['Sector','Energy'],['Stage','Growth'],['Markets','Ghana']],leaders:['tunde'],src:[['Zuri Energy company site','Company','Sep 2026']]},
helix:{kind:'org',n:'Helix Semiconductors',l:'H',tag:'Low-power processors',loc:'Singapore',reg:'asia',sec:'Technology',keys:'chips semiconductors technology singapore asia',
snap:[['Market value','$41B'],['Revenue','$9.2B'],['Employees','18,400'],['Founded','2003']],stage:'Public company',trend:[['2022',7.1],['2023',7.8],['2024',8.6],['2025',9.2]],unit:'Revenue, $B',
lede:'Helix Semiconductors designs power-efficient processors for data centres and phones. Its newest product line cuts energy use and begins shipping next year.',
facts:[['Founded','2003, Singapore'],['Sector','Semiconductors'],['Listing','Public'],['Markets','Global']],leaders:['priya'],src:[['Helix annual report, 2025','Annual report','Mar 2026'],['Product announcement','Press release','Sep 2026']]},
aurora:{kind:'org',n:'Aurora Retail Group',l:'A',tag:'Multi-format retail and delivery',loc:'Stockholm, Sweden',reg:'europe',sec:'Retail',keys:'retail delivery europe sweden',
snap:[['Valuation','$6.8B'],['Revenue','$3.1B'],['Employees','12,000'],['Founded','1996']],stage:'Private company',trend:[['2022',2.4],['2023',2.7],['2024',2.9],['2025',3.1]],unit:'Revenue, $B',
lede:'Aurora Retail Group runs stores and home delivery across Europe. It is piloting cash-on-delivery and locker pickup in emerging-market cities.',
facts:[['Founded','1996, Stockholm'],['Sector','Retail'],['Ownership','Private'],['Markets','Europe, pilots elsewhere']],leaders:['sofia'],src:[['Aurora annual report, 2025','Annual report','Apr 2026'],['Pilot announcement','Press release','Sep 2026']]},
lumen:{kind:'org',n:'Lumen Grid',l:'L',tag:'Utility-scale battery storage',loc:'Santiago, Chile',reg:'americas',sec:'Energy',keys:'energy storage batteries utilities chile americas',
snap:[['Market value','$12B'],['Revenue','$2.4B'],['Employees','6,100'],['Founded','2011']],stage:'Public company',trend:[['2022',1.4],['2023',1.7],['2024',2.1],['2025',2.4]],unit:'Revenue, $B',
lede:'Lumen Grid builds battery storage for utilities and large commercial customers. It has announced a new manufacturing plant aimed at lowering storage costs.',
facts:[['Founded','2011, Santiago'],['Sector','Energy storage'],['Listing','Public'],['Markets','Americas']],leaders:['mateo'],src:[['Lumen Grid investor relations','Company','Sep 2026'],['Plant announcement','Press release','Sep 2026']]}};
window.Entities=ENT;
var entP=null,entO=null,tabsOn={};
window.openEntity=function(id){var e=ENT[id];if(!e)return;if(e.view){App.push(e.view);return}if(e.kind==='org')entO=id;else entP=id;var cv=$('.view.on');if(cv&&cv.id==='v-g'+(e.kind==='org'?'org':'person')){tabsOn.p=0;e.kind==='org'?renderOrg():renderPerson();window.scrollTo(0,0);return}App.push(e.kind==='org'?'gorg':'gperson')};
var follow={};
var banner=function(e){return e.mem?'':'<div class="srcb"><b>Compiled from public sources</b><p>This profile has not been claimed. Each fact links to its source and can be corrected.</p><div><button class="p3b o" data-claim="1">Claim this profile</button><button class="lnk2" data-sug="1">Suggest an edit</button></div></div>'};
var srcList=function(e){return '<div>'+e.src.map(function(s){return '<div class="bkr"><span>'+esc(s[0])+'</span><em>'+esc(s[1])+', '+esc(s[2])+'</em></div>'}).join('')+'</div><p class="note" style="margin-top:14px">Sample sources. Facts on public profiles link to where they come from.</p>'};
function renderPerson(){var ent=entP,e=ENT[ent],s=e.snap,t=['Overview','Timeline'].concat(e.books&&e.books.length?['Books']:[]).concat(['Sources']),tr=s.tr,pct=Math.round((tr[tr.length-1]/tr[0]-1)*100),mx=Math.max.apply(null,tr),mn=Math.min.apply(null,tr),pts=tr.map(function(v,i){return Math.round(2+i*(296/(tr.length-1)))+','+(44-Math.round((v-mn)/((mx-mn)||1)*40))}).join(' '),idx=tabsOn.p||0;
var secs=['<p class="lede">'+esc(e.lede)+'</p><h2>Key facts</h2><dl>'+e.facts.map(function(f){return '<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>'}).join('')+'</dl>','<div class="tl">'+e.tl.map(function(x){return '<div><time>'+x[0]+'</time><p><b>'+esc(x[1])+'</b><span>'+esc(x[2])+'</span></p></div>'}).join('')+'</div>'];
if(e.books&&e.books.length)secs.push(e.books.map(function(k){var b=BOOKS[k];return '<div class="bk" data-book="'+k+'"><div class="sp" style="background:'+b[2]+'">'+esc(b[0])+'</div><div><b>'+esc(b[0])+'</b><span>'+esc(b[1])+'</span><p>Recommended reading</p></div></div>'}).join(''));
secs.push(srcList(e));
$('#v-gperson .pg').innerHTML=hb('Profile')+'<main class="wrap"><div class="head"><div class="mono-box" aria-hidden="true">'+e.i+'</div><div><h1>'+esc(e.n)+'</h1><p class="role">'+esc(e.role)+'. '+esc(e.loc)+'</p></div></div>'+banner(e)+
'<div class="acts"><button class="btn" data-fol="1">'+(follow[ent]?'Following':'Follow')+'</button>'+(e.mem?'<button class="btn o" data-thread="'+ent+'">Message</button><button class="btn o" data-intro="'+ent+'">Request intro</button>':'')+'</div>'+
'<div class="panel"><div class="ph"><b>'+esc(s.h)+'</b><span>'+esc(s.s)+'</span></div><div class="grid">'+s.g.map(function(g){return '<div><span>'+g[0]+'</span><strong>'+g[1]+'</strong></div>'}).join('')+'</div><div class="spark"><svg viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true"><polyline class="line" fill="none" stroke="#E3B341" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="'+pts+'"/></svg><p>'+esc(s.lab)+'<b>'+(pct>=0?'+':'')+pct+'%</b></p></div></div>'+
'<div class="tabs" role="tablist">'+t.map(function(x,i){return '<button class="tab" role="tab" aria-selected="'+(i===idx)+'" data-pt="'+i+'">'+x+'</button>'}).join('')+'</div>'+secs.map(function(h,i){return '<section data-sec="'+i+'"'+(i===idx?'':' hidden')+'>'+h+'</section>'}).join('')+'<p class="note">Sample profile with placeholder data.</p></main>'}
function renderOrg(){var ent=entO,e=ENT[ent],d=e.deal?window.Deals[e.deal]:null,mx=Math.max.apply(null,e.trend.map(function(x){return x[1]})),w=300/(e.trend.length+1),bars=e.trend.map(function(x,i){var h=Math.round(x[1]/mx*78),cx=Math.round((i+1)*w);return '<rect x="'+(cx-28)+'" y="'+(92-h)+'" width="56" height="'+h+'" fill="#E3B341" opacity="'+(i===e.trend.length-1?1:.55)+'" rx="2"/><text x="'+cx+'" y="'+(86-h)+'" text-anchor="middle">'+x[1]+'</text><text class="m" x="'+cx+'" y="108" text-anchor="middle">'+x[0]+'</text>'}).join('');
var news=Object.keys(window.News.ALL).map(function(k){return window.News.ALL[k]}).filter(function(c){return c.primary.entities.indexOf(e.n)>-1}).slice(0,3);
$('#v-gorg .pg').innerHTML=hb('Company')+'<main class="wrap"><div class="head"><div class="lg" aria-hidden="true">'+e.l+'</div><div><h1>'+esc(e.n)+'</h1><p class="tag">'+esc(e.tag)+'<br>'+esc(e.loc)+'</p></div></div>'+banner(e)+
'<div class="acts"><button class="btn" data-fol="1">'+(follow[ent]?'Following':'Follow')+'</button></div>'+
'<div class="panel"><div class="ph"><b>Snapshot</b><span>'+esc(e.stage)+'</span></div><div class="grid">'+e.snap.map(function(g){return '<div><span>'+g[0]+'</span><strong>'+g[1]+'</strong></div>'}).join('')+'</div><div class="chart"><p>'+esc(e.unit)+'</p><svg viewBox="0 0 300 118" role="img" aria-label="'+esc(e.unit)+' by year"><line x1="0" y1="92" x2="300" y2="92" stroke="rgba(233,239,234,.2)"/>'+bars+'</svg></div></div>'+
'<p class="lede">'+esc(e.lede)+'</p><h2>Key facts</h2><dl>'+e.facts.map(function(f){return '<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>'}).join('')+'</dl>'+
'<h2>Leadership</h2><div class="ppl">'+e.leaders.map(function(k){var p=ENT[k];return '<a class="p" href="#" data-ent="'+k+'"><div>'+p.i+'</div><b>'+esc(p.n)+'</b><span>'+esc(p.role.split(', ')[0])+'</span></a>'}).join('')+'</div>'+
(news.length?'<h2>In the news</h2>'+news.map(function(c){return '<div class="news" data-story="'+c.id+'" role="button" tabindex="0"><b>'+esc(c.primary.title)+'</b><span>'+esc(c.primary.source)+'</span></div>'}).join(''):'')+
(d?'<section class="round"><h2>Community round</h2><p>Back '+esc(e.n)+' alongside '+d.inv+' other investors.</p><div class="bar"><i style="width:'+d.pct+'%"></i></div><div class="fund"><span><b>'+d.raised+'</b> raised</span><span>Target '+d.target+'</span></div><button class="btn" data-deal="'+e.deal+'">Review the round</button><small>Available to verified investors in eligible countries. Investing involves risk, including loss of capital.</small></section>':'')+
'<h2>Sources</h2>'+srcList(e)+'<p class="note">Sample page with placeholder data.</p></main>'}
document.addEventListener('click',function(e){var t=e.target,v=t.closest('#v-gperson,#v-gorg');if(!v)return;
var pt=t.closest('[data-pt]');if(pt){tabsOn.p=+pt.dataset.pt;$$('#v-gperson .tab').forEach(function(x){x.setAttribute('aria-selected',x===pt)});$$('#v-gperson section').forEach(function(s){s.hidden=+s.dataset.sec!==tabsOn.p});return}
var cur=v.id==='v-gperson'?entP:entO;
if(t.closest('[data-fol]')){follow[cur]=!follow[cur];t.closest('[data-fol]').textContent=follow[cur]?'Following':'Follow';return}
if(t.closest('[data-sug]')){window.toast('Thanks. Our editors will review your suggestion.');return}
if(t.closest('[data-claim]')){window.claimName=ENT[cur].n;App.push('claim')}});
/* ---------- Preferences page ---------- */
var CURS=['USD','GHS','NGN','KES','ZAR','XOF','EUR','GBP'];
function renderPrefs(){var ex=Money.approx(250)||'(same currency)';
$('#v-prefs .pg').innerHTML=hb('Region and currency')+'<main class="pgw"><h1 style="margin-top:26px">Your lens</h1><p class="cap" style="font-size:15px">Meridian covers business everywhere. These settings choose what you see first.</p>'+
'<h2>Region</h2>'+Object.keys(REG).map(function(k){return '<button class="ro" aria-pressed="'+(P.region===k)+'" data-r="'+k+'"><div><b>'+REG[k]+'</b><small>'+RDESC[k]+'</small></div><span class="tick">'+CK+'</span></button>'}).join('')+
'<h2>Display currency</h2><div class="pv" role="group" aria-label="Currency">'+CURS.map(function(c){return '<button aria-pressed="'+(P.currency===c)+'" data-c="'+c+'">'+c+'</button>'}).join('')+'</div><p class="nt">'+FX[P.currency].n+(P.currency==='USD'?'':', 1 USD = '+FX[P.currency].r.toLocaleString('en-US')+' '+P.currency)+'. Rounds are priced in USD, and local amounts are estimates at sample rates. Live rates arrive with the data API.</p><div class="pvw"><span>Preview</span><b>$250</b>'+(Money.approx(250)?'<em>'+Money.approx(250)+'</em>':'')+'</div>'+
'<h2>Reading language</h2><div class="sw3"><span>Show non-English stories in English<small>Translated by Meridian AI. You can switch back on any story.</small></span><button role="switch" aria-checked="'+P.translate+'" aria-label="Translate non-English stories" data-tr="1"></button></div><div class="sw3"><span>Interface language<small>English. French arrives with the production build.</small></span><span class="mono">EN</span></div></main>'}
$('#v-prefs').addEventListener('click',function(e){var t=e.target,b;
if(b=t.closest('[data-r]')){P.region!==b.dataset.r&&window.Prefs.set('region',b.dataset.r);renderPrefs();window.toast('Region set to '+REG[P.region]);return}
if(b=t.closest('[data-c]')){window.Prefs.set('currency',b.dataset.c);renderPrefs();return}
if(t.closest('[data-tr]')){window.Prefs.set('translate',!P.translate);renderPrefs()}});
/* ---------- Home: people to watch follow the lens ---------- */
var PW={africa:['ama','kunle','nia','tunde','priya','mateo'],west:['ama','kunle','nia','tunde','fatou'],east:['kunle','priya','nia','sofia'],south:['tunde','mateo','priya','kunle'],north:['kunle','sofia','priya','mateo'],global:['priya','mateo','sofia','ama','kunle']};
function renderPeople(){var el=$('#v-home .ppl');if(!el)return;el.innerHTML=PW[P.region].map(function(k){var p=ENT[k];return '<a class="p" href="#" data-ent="'+k+'"><div>'+p.i+'</div><b>'+esc(p.n)+'</b><span>'+esc(p.role)+'</span></a>'}).join('')}
/* ---------- Explore: companies block ---------- */
function resRow(it){var tl={pe:'Person',co:'Company',bk:'Book',po:it.sub2||'Podcast',dl:'Deal',nw:'News'}[it.t],ic=it.t==='pe'?'<div class="pe">'+esc(it.i)+'</div>':it.t==='co'||it.t==='nw'?'<div class="co">'+esc(it.i)+'</div>':it.t==='bk'?'<div class="bk" style="background:'+it.c+'"></div>':it.t==='po'?'<div class="po"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></div>':'<div class="dl" style="background:conic-gradient(var(--accent) '+it.p+'%,var(--rule) 0)"><span>'+it.p+'%</span></div>';
return '<a class="r" href="#" data-t="'+it.t+'" '+it.a+'><div class="ic">'+ic+'</div><div><b>'+esc(it.title)+'</b><span class="m">'+esc(it.sub)+'</span></div><span class="kd">'+tl+'</span></a>'}
function renderEntBlock(){var el=$('[data-ent-block="explore"]');if(!el)return;var ks=P.region==='global'?['helix','aurora','lumen']:['kora','aya','zuri','helix'];
el.innerHTML='<h2>Companies to know</h2>'+ks.map(function(k){var e=ENT[k];return resRow({t:'co',i:e.l,title:e.n,sub:e.tag+', '+e.loc,a:'data-ent="'+k+'"'})}).join('')}
/* ---------- Search ---------- */
function osa(a,b){var d=[],i,j;for(i=0;i<=a.length;i++){d[i]=[i];}for(j=1;j<=b.length;j++)d[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}return d[a.length][b.length]}
var norm=function(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean)};
function index(){var out=[];
Object.keys(ENT).forEach(function(k){var e=ENT[k];out.push({t:e.kind==='org'?'co':'pe',i:e.kind==='org'?e.l:e.i,title:e.n,sub:e.kind==='org'?(e.tag+', '+(e.loc||'')).replace(/, $/,''):e.role,a:'data-ent="'+k+'"',text:e.n+' '+(e.role||e.tag||'')+' '+(e.keys||''),boost:1.2})});
Object.keys(BOOKS).forEach(function(k){var b=BOOKS[k];out.push({t:'bk',c:b[2],title:b[0],sub:b[1],a:'data-book="'+k+'"',text:b[0]+' '+b[1]+' book',boost:1})});
Object.keys(window.Episodes||{}).forEach(function(k){var e=window.Episodes[k];out.push({t:'po',title:e.t,sub:e.by+', '+e.k,sub2:e.type==='video'?'Video':'Podcast',a:'data-ep="'+k+'"',text:e.t+' '+e.by+' '+e.k,boost:1})});
Object.keys(window.Deals||{}).forEach(function(k){var d=window.Deals[k];out.push({t:'dl',p:d.pct,title:d.n+' round',sub:d.raised+' of '+d.target+', '+d.days+' days left',a:'data-deal="'+k+'"',text:d.n+' round raising '+d.sec+' '+d.blurb,boost:1})});
var A=window.News&&window.News.ALL||{};Object.keys(A).forEach(function(k){var c=A[k],p=c.primary;out.push({t:'nw',i:p.source.charAt(0),title:p.tr?p.tr.title:p.title,sub:p.source,a:'data-story="'+k+'"',text:p.titleEn+' '+p.source+' '+c.topic+' '+p.entities.join(' '),boost:.9})});return out}
function tokScore(kt,qt){var tot=0,i,j;for(i=0;i<qt.length;i++){var best=0,q=qt[i];for(j=0;j<kt.length;j++){var k=kt[j];if(k===q)best=Math.max(best,3);else if(k.indexOf(q)===0)best=Math.max(best,2.4);else if(q.length>2&&k.indexOf(q)>-1)best=Math.max(best,1.2);else if(q.length>=4&&k.length>=4&&(osa(q,k.slice(0,q.length))<=1||osa(q,k)<=1))best=Math.max(best,1.5)}if(!best)return 0;tot+=best}return tot}
function score(it,qt){var all=tokScore(norm(it.text),qt);if(!all)return 0;var ti=tokScore(norm(it.title),qt);return(all+ti*2+(norm(it.title).join(' ').indexOf(qt.join(' '))===0?3:0))*it.boost}
function search(q){var qt=norm(q);if(!qt.length)return[];return index().map(function(it){return{it:it,s:score(it,qt)}}).filter(function(x){return x.s>0}).sort(function(a,b){return b.s-a.s}).slice(0,14).map(function(x){return x.it})}
window.MSearch=search;
var sf='all',CODE={all:'all',pe:'pe',co:'co',bk:'bk',po:'po',dl:'dl',nw:'nw'};
function renderResults(){var v=$('#v-explore'),q=$('[data-i="q"]',v);if(!q)return;var val=q.value.trim(),list=$('[data-i="list"]',v);if(!val)return;
var res=search(val),shown=sf==='all'?res:res.filter(function(r){return r.t===sf}),counts={};res.forEach(function(r){counts[r.t]=(counts[r.t]||0)+1});
var ai=$('.ai',v);if(ai){ai.hidden=!res.length;var names={pe:['person','people'],co:['company','companies'],bk:['book','books'],po:['episode','episodes'],dl:['round','rounds'],nw:['story','stories']};ai.innerHTML='<b>Summary</b><p>'+res.length+' result'+(res.length===1?'':'s')+' for \u201c'+esc(val)+'\u201d, led by '+esc(res[0]?res[0].title:'')+'. '+Object.keys(counts).map(function(k){return counts[k]+' '+names[k][counts[k]===1?0:1]}).join(', ')+'.</p><span>From the people, companies, rounds, and stories on Meridian</span><button class="askb" data-ask="'+esc(val)+'">Ask Meridian about this</button>'}
list.innerHTML=shown.length?shown.map(resRow).join(''):'<div class="es" style="padding:34px 10px"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg></div><h3>No results for \u201c'+esc(val)+'\u201d</h3><p>Try a company, a person, or a topic like solar or payments.</p><button data-ask="'+esc(val)+'">Ask Meridian instead</button></div>';
var em=$('[data-i="em"]',v);if(em)em.style.display='none'}
document.addEventListener('input',function(e){if(e.target.matches&&e.target.matches('#v-explore [data-i="q"]'))renderResults()});
function bindChips(){var box=$('#v-explore .chips');if(!box||box.dataset.p8)return;box.dataset.p8=1;var n=document.createElement('button');n.className='chip';n.setAttribute('aria-pressed','false');n.dataset.f='nw';n.textContent='News';box.appendChild(n);
box.addEventListener('click',function(e){var c=e.target.closest('.chip');if(!c)return;e.stopPropagation();e.stopImmediatePropagation();sf=c.dataset.f;$$('.chip',box).forEach(function(x){x.setAttribute('aria-pressed',x===c)});renderResults()},true);
var clr=$('#v-explore [data-i="clr"]');clr&&clr.addEventListener('click',function(){sf='all';$$('.chip',box).forEach(function(x){x.setAttribute('aria-pressed',x.dataset.f==='all')})})}
/* ---------- Onboarding: region and currency ---------- */
function onboardingExtras(){var s=$('#v-onboarding [data-i="s2"]');if(!s||s.dataset.p8)return;s.dataset.p8=1;
var box=document.createElement('div');box.innerHTML='<p class="hint" style="margin:30px 0 12px">Where are you reading from?</p><div class="chips" data-ob="r">'+Object.keys(REG).map(function(k){return '<button class="chip" aria-pressed="'+(P.region===k)+'" data-obr="'+k+'">'+REG[k]+'</button>'}).join('')+'</div><p class="hint" style="margin:26px 0 12px">Show amounts in</p><div class="chips" data-ob="c">'+CURS.map(function(c){return '<button class="chip" aria-pressed="'+(P.currency===c)+'" data-obc="'+c+'">'+c+'</button>'}).join('')+'</div>';s.appendChild(box);
box.addEventListener('click',function(e){var r=e.target.closest('[data-obr]'),c=e.target.closest('[data-obc]');if(r){window.Prefs.set('region',r.dataset.obr);$$('[data-obr]',box).forEach(function(x){x.setAttribute('aria-pressed',x===r)})}if(c){window.Prefs.set('currency',c.dataset.obc);$$('[data-obc]',box).forEach(function(x){x.setAttribute('aria-pressed',x===c)})}})}
/* ---------- wiring ---------- */
window.Prefs.on(function(k){syncLens();renderMarkets();renderPeople();renderEntBlock();window.syncPort&&window.syncPort()});
var prev=window.onView;
window.onView=function(v){prev&&prev(v);
if(v==='gperson'){tabsOn.p=0;renderPerson()}if(v==='gorg')renderOrg();if(v==='prefs')renderPrefs();
if(v==='home'){renderMarkets();renderPeople()}if(v==='explore'){renderEntBlock();bindChips()}syncLens()};
syncLens();renderMarkets();renderPeople();renderEntBlock();bindChips();onboardingExtras();
})();
