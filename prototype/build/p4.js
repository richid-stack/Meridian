(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s).replace(/</g,'&lt;')};
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var CK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
var CKB='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
var WARN='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 17h.01M10.3 4l-8 14a2 2 0 001.7 3h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"/></svg>';
var SEND='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
var BM='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 4h12v17l-6-4-6 4z"/></svg>';
function hb(t,r,noback){return '<header class="hb"><div class="in">'+(noback?'<span></span>':'<button class="back" aria-label="Back">'+BACK+'Back</button>')+'<span class="t">'+(t||'')+'</span><span class="rt">'+(r||'')+'</span></div></header>'}
var D=function(){return window.Deals},RND={aya:'Seed',kora:'Community round',zuri:'Community round'};
var m2=function(n){return '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})},m0=function(n){return '$'+Number(n).toLocaleString('en-US')};
/* shared state */
var Port=[{id:'aya',amt:250,date:'Sep 12',st:'Committed',ref:'MRD-1A7C20'},{id:'kora',amt:500,date:'Sep 28',st:'In review',ref:'MRD-7D93E1'}];
var Act=[['Committed $500 in Kora Freight','Sep 28'],['Committed $250 in Aya Health','Sep 12']];
var W={aya:1,kora:1,zuri:1},alerts=true;
window.isWatch=function(id){return !!W[id]};
function syncPort(){
var tot=Port.reduce(function(a,p){return a+p.amt},0),yp=$('#v-you .panel');
if(yp)yp.innerHTML='<div class="ph">Total invested</div><div class="big">'+m0(tot)+'<span>in '+Port.length+' round'+(Port.length===1?'':'s')+'</span></div>'+(window.Money?window.Money.line(tot,'fx2'):'')+Port.map(function(p){var d=D()[p.id];return '<div class="pos"><div class="co">'+d.n.charAt(0)+'</div><div><b>'+d.n+'</b><small>'+RND[p.id]+', '+d.inst+'</small></div><em>'+m0(p.amt)+'<small'+(p.st==='Committed'?' class="g"':'')+'>'+p.st+'</small></em></div>'}).join('');
var s=$$('#v-capital .pf .g strong');if(s.length===3){s[0].textContent=m0(tot);s[1].textContent=Port.length;s[2].textContent=Object.keys(W).filter(function(k){return W[k]}).length}}
/* ---- invest flow ---- */
var I={};
window.startInvest=function(id,amt){I={id:id,amt:amt||250,step:1,ack:[0,0,0],m:null,pv:null,ph:'',st:'idle',ref:''};App.push('invest')};
var ACK=['I understand I could lose all of this investment.','I understand this investment is illiquid and may not be sold for years.','I have read the investment terms and the due diligence summary.'];
function seg(){return '<div class="sg">'+[1,2,3].map(function(n){return '<i'+(n<=I.step?' class="on"':'')+'></i>'}).join('')+'</div>'}
function fee(){return Math.round(I.amt*2)/100}
function renderInvest(){
var d=D()[I.id],h,main='<main class="pgw">';
if(I.st==='proc'){$('#v-invest .pg').innerHTML=hb('Processing','',1)+main+'<div class="fin"><div class="sk" style="width:60px;height:60px;border-radius:50%;margin:0 auto 18px"></div><h1>'+(I.m==='momo'?'Approve on your phone':'Processing payment')+'</h1><p>'+(I.m==='momo'?'Enter your PIN when the prompt appears. This usually takes under a minute.':'Please keep this page open.')+'</p></div></main>';return}
if(I.st==='done'){$('#v-invest .pg').innerHTML=hb('Receipt','',1)+main+'<div class="fin"><div class="ic2">'+CKB+'</div><h1>Commitment received</h1><p>You committed '+m0(I.amt)+' to '+d.n+'. We emailed your receipt, and the founder will share updates with backers.</p><div class="rf">Reference '+I.ref+'</div><button class="cta" data-a="port">View portfolio</button><button class="cta o" data-a="cap">Back to Capital</button><p class="lg2">Sample flow. No real payment was made.</p></div></main>';return}
if(I.st==='fail'||I.st==='off'){$('#v-invest .pg').innerHTML=hb('Payment','')+main+'<div class="fin bad"><div class="ic2">'+WARN+'</div><h1>'+(I.st==='off'?'You are offline':'Payment not completed')+'</h1><p>'+(I.st==='off'?'Check your connection and try again. You were not charged.':'The payment was declined. You were not charged.')+'</p><button class="cta" data-a="retry">Try again</button><button class="cta o" data-a="chg">Change payment method</button></div></main>';return}
h=hb(['Review','Payment','Confirm'][I.step-1])+main+seg();
if(I.step===1)h+='<h1 style="margin-top:20px">Invest in '+d.n+'</h1><p class="lead">Choose how much to commit.</p><div class="amt"><span>$</span><input inputmode="numeric" aria-label="Amount in dollars" value="'+I.amt+'"></div><div class="qc">'+[100,250,500,1000].map(function(v){return '<button data-q="'+v+'" aria-pressed="'+(I.amt===v)+'">'+m0(v)+'</button>'}).join('')+'</div><div class="er"></div><div class="fxl"></div>'+
'<div class="sm"><div><span>Instrument</span><b class="sx">'+d.inst+'</b></div><div><span>Valuation cap</span><b>'+d.cap+'</b></div><div><span>Platform fee, 2%</span><b class="fe"></b></div><div><span>Total today</span><b class="to"></b></div></div>'+
'<h2 class="ackh">Before you continue</h2>'+ACK.map(function(a,i){return '<button class="ackr" aria-pressed="'+!!I.ack[i]+'" data-k="'+i+'"><span class="tick">'+CK+'</span><span>'+a+'</span></button>'}).join('')+'<button class="cta nx" data-a="n"></button><p class="lg2">Sample flow with placeholder fees. Investing involves risk, including loss of capital.</p>';
if(I.step===2)h+='<h1 style="margin-top:20px">How do you want to pay?</h1><p class="lead">Total today: '+m2(I.amt+fee())+(window.Money&&window.Money.approx(I.amt+fee())?' '+window.Money.approx(I.amt+fee()):'')+'</p>'+
[['momo','Mobile money','MTN MoMo, Telecel Cash, or AirtelTigo'],['card','Card','Visa or Mastercard, entered on a secure page'],['bank','Bank transfer','We show account details after you confirm']].map(function(x){return '<button class="ro" aria-pressed="'+(I.m===x[0])+'" data-m="'+x[0]+'"><div><b>'+x[1]+'</b><small>'+x[2]+'</small></div><span class="tick">'+CK+'</span></button>'}).join('')+
(I.m==='momo'?'<div class="pv" role="group" aria-label="Provider">'+['MTN MoMo','Telecel Cash','AirtelTigo'].map(function(p){return '<button aria-pressed="'+(I.pv===p)+'" data-p="'+p+'">'+p+'</button>'}).join('')+'</div><div class="fld2"><label for="ph">Mobile money number</label><input id="ph" inputmode="tel" placeholder="024 000 0000" value="'+esc(I.ph)+'"></div>':'')+
'<button class="cta nx" data-a="n"></button>';
if(I.step===3)h+='<h1 style="margin-top:20px">Confirm your investment</h1><p class="lead">Check the details, then confirm.</p><div class="sm"><div><span>Round</span><b class="sx">'+d.n+'</b></div><div><span>Amount</span><b>'+m2(I.amt)+'</b></div><div><span>Platform fee</span><b>'+m2(fee())+'</b></div><div><span>Total today</span><b>'+m2(I.amt+fee())+(window.Money&&window.Money.approx(I.amt+fee())?'<small class="fx3">'+window.Money.approx(I.amt+fee())+'</small>':'')+'</b></div><div><span>Pay with</span><b class="sx">'+(I.m==='momo'?I.pv+', '+esc(I.ph):I.m==='card'?'Card':'Bank transfer')+'</b></div></div><button class="cta" data-a="pay">Confirm and pay '+m2(I.amt+fee())+'</button><p class="lg2">By confirming you agree to the investment terms. You can cancel until the round closes.</p>';
$('#v-invest .pg').innerHTML=h+'</main>';upd();
}
function upd(){var v=$('#v-invest'),nx=$('.nx',v);
if(I.step===1){var ok=I.amt>=100&&I.ack.every(Boolean);$('.fe',v).textContent=m2(I.amt>=0?fee():0);$('.to',v).textContent=m2(I.amt+fee());$('.er',v).textContent=I.amt>0&&I.amt<100?'Enter at least $100.':'';var ap=window.Money?window.Money.approx(I.amt+fee()):'';$('.fxl',v).textContent=ap?'Total today '+ap+' at sample rates':'';$$('[data-q]',v).forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.q===I.amt)});nx.textContent='Continue';nx.disabled=!ok}
if(I.step===2){nx.textContent='Continue';nx.disabled=!(I.m&&(I.m!=='momo'||(I.pv&&/^0\d{9}$/.test(I.ph.replace(/\s/g,'')))))}}
$('#v-invest').addEventListener('input',function(e){var t=e.target;if(t.getAttribute('aria-label')==='Amount in dollars'){var n=parseInt(t.value.replace(/\D/g,''),10)||0;I.amt=Math.min(n,100000);if(n>100000)t.value=I.amt;upd()}if(t.id==='ph'){I.ph=t.value;upd()}});
$('#v-invest').addEventListener('click',function(e){var t=e.target,b;
if(b=t.closest('[data-q]')){I.amt=+b.dataset.q;$('#v-invest .amt input').value=I.amt;upd();return}
if(b=t.closest('[data-k]')){var k=+b.dataset.k;I.ack[k]=I.ack[k]?0:1;b.setAttribute('aria-pressed',!!I.ack[k]);upd();return}
if(b=t.closest('[data-m]')){I.m=b.dataset.m;renderInvest();return}
if(b=t.closest('[data-p]')){I.pv=b.dataset.p;$$('#v-invest [data-p]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});upd();return}
if(b=t.closest('[data-a]')){var a=b.dataset.a;
if(a==='n'&&!b.disabled){I.step++;renderInvest();window.scrollTo(0,0)}
if(a==='pay')pay();
if(a==='retry')pay();
if(a==='chg'){I.st='idle';I.step=2;renderInvest()}
if(a==='port'){App.tab('capital');App.push('portfolio')}
if(a==='cap')App.tab('capital')}});
function pay(){
if(!navigator.onLine){I.st='off';renderInvest();return}
I.st='proc';renderInvest();window.scrollTo(0,0);
setTimeout(function(){
if(I.st!=='proc')return;
if(/0000$/.test(I.ph.replace(/\s/g,''))){I.st='fail';renderInvest();return}
I.ref='MRD-'+Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase().padStart(6,'0');
var p=Port.filter(function(x){return x.id===I.id})[0];
if(p){p.amt+=I.amt}else Port.push({id:I.id,amt:I.amt,date:'Today',st:'Committed',ref:I.ref});
Act.unshift(['Committed '+m0(I.amt)+' in '+D()[I.id].n,'Today']);
I.st='done';syncPort();renderInvest();window.scrollTo(0,0)},1800)}
/* ---- portfolio ---- */
var open_='';
function renderPort(){
var tot=Port.reduce(function(a,p){return a+p.amt},0),by=function(s){return Port.filter(function(p){return p.st===s}).reduce(function(a,p){return a+p.amt},0)};
var sec={};Port.forEach(function(p){var s=D()[p.id].sec;sec[s]=(sec[s]||0)+p.amt});var cols=['var(--accent)','var(--ink)','var(--mute)'],ks=Object.keys(sec);
$('#v-portfolio .pg').innerHTML=hb('Portfolio')+'<main class="pgw"><div class="panel"><div class="ph">Total invested</div><div class="big">'+m0(tot)+'<span>in '+Port.length+' round'+(Port.length===1?'':'s')+'</span></div>'+(window.Money?window.Money.line(tot,'fx2'):'')+'<div class="g"><div><span>Committed</span><strong>'+m0(by('Committed'))+'</strong></div><div><span>In review</span><strong>'+m0(by('In review'))+'</strong></div><div><span>Funded</span><strong>'+m0(by('Funded'))+'</strong></div></div></div>'+
'<h2>Allocation by sector</h2><div class="uf2">'+ks.map(function(s,i){return '<i style="width:'+Math.round(sec[s]/tot*100)+'%;background:'+cols[i%3]+'"></i>'}).join('')+'</div><div class="lg3">'+ks.map(function(s,i){return '<div><i style="background:'+cols[i%3]+'"></i>'+s+'<b>'+Math.round(sec[s]/tot*100)+'%</b></div>'}).join('')+'</div>'+
'<h2>Positions</h2><div>'+Port.map(function(p){var d=D()[p.id],o=open_===p.id;return '<div class="ps"><button class="ph2" data-o="'+p.id+'" aria-expanded="'+o+'"><div class="ct">'+d.n.charAt(0)+'</div><div><b>'+d.n+'</b><small>'+RND[p.id]+', '+d.inst+'</small></div><em>'+m0(p.amt)+'<small'+(p.st==='Committed'?' class="gd"':'')+'>'+p.st+'</small></em></button><div class="pd"'+(o?'':' hidden')+'><div class="sm"><div><span>Invested</span><b>'+m0(p.amt)+'</b></div><div><span>Valuation cap</span><b>'+d.cap+'</b></div><div><span>Date</span><b class="sx">'+p.date+'</b></div><div><span>Reference</span><b>'+p.ref+'</b></div></div><div class="up"><small>Latest from the founder</small><p>'+d.up[0]+'</p></div><button class="p3b o" data-deal="'+p.id+'">View round</button></div></div>'}).join('')+'<div style="border-top:1px solid var(--rule)"></div></div>'+
'<h2>Activity</h2><div class="act2">'+Act.map(function(a){return '<div>'+a[0]+'<small>'+a[1]+'</small></div>'}).join('')+'<div style="padding:0"></div></div><p class="note">Sample portfolio with placeholder data. Investing involves risk, including loss of capital.</p></main>'}
$('#v-portfolio').addEventListener('click',function(e){var o=e.target.closest('[data-o]');if(o){open_=open_===o.dataset.o?'':o.dataset.o;renderPort()}});
/* ---- watchlist ---- */
function renderWatch(){
var ids=Object.keys(D()).filter(function(k){return W[k]});
$('#v-watch .pg').innerHTML=hb('Watchlist')+'<main class="pgw"><h1 style="margin-top:26px">Watching</h1><p class="cap" style="font-size:15px">Rounds you follow. We tell you when something changes.</p><div class="al"><span>Notify me about updates</span><button role="switch" aria-checked="'+alerts+'" aria-label="Notify me about updates"></button></div>'+
(ids.length?ids.map(function(k){var d=D()[k];return '<div class="wr" data-deal="'+k+'"><div class="rg2" style="--p:'+d.pct+'"><span>'+d.pct+'%</span></div><div><b>'+d.n+'</b><small>'+d.raised+' raised, '+d.days+' days left</small></div><button class="bm" data-w="'+k+'" aria-pressed="true" aria-label="Stop watching">'+BM+'</button></div>'}).join('')+'<div style="border-top:1px solid var(--rule)"></div>':'<div class="es"><div class="ico">'+BM+'</div><h3>Nothing on your watchlist</h3><p>Tap the bookmark on any round to follow it here.</p><button data-tab="capital">Browse rounds</button></div>')+'</main>'}
$('#v-watch').addEventListener('click',function(e){var t=e.target,b=t.closest('[data-w]');
if(b){W[b.dataset.w]=0;syncPort();renderWatch();window.toast('Removed from watchlist');e.stopPropagation();return}
var s=t.closest('[role=switch]');if(s){alerts=!alerts;s.setAttribute('aria-checked',alerts)}},true);
$('#v-deal').addEventListener('click',function(e){var b=e.target.closest('.wt');if(!b)return;var id=window.curDeal(),on=!W[id];W[id]=on?1:0;b.setAttribute('aria-pressed',on);syncPort();window.toast(on?'Added to watchlist':'Removed from watchlist')});
/* ---- compare ---- */
var C={a:'aya',b:'kora'};
function renderCompare(){
var ks=Object.keys(D()),A=D()[C.a],B=D()[C.b];
var sel=function(k){return '<div class="sel"><p>Round '+k.toUpperCase()+'</p><div class="qc" style="gap:8px">'+ks.map(function(x){return '<button data-c="'+k+x+'" aria-pressed="'+(C[k.toLowerCase()]===x)+'" style="font-family:\'Instrument Sans\',sans-serif">'+D()[x].n+'</button>'}).join('')+'</div></div>'};
var row=function(l,f){return '<tr><td>'+l+'</td><td>'+f(A)+'</td><td>'+f(B)+'</td></tr>'};
var lead=A.pct>B.pct?A:B,trail=A.pct>B.pct?B:A;
$('#v-compare .pg').innerHTML=hb('Compare rounds')+'<main class="pgw"><h1 style="margin-top:26px">Side by side</h1>'+sel('A')+sel('B')+
'<table class="cm"><thead><tr><th></th><th>'+A.n+'</th><th>'+B.n+'</th></tr></thead><tbody>'+
row('Raised',function(d){return d.raised+'<span class="sub3">of '+d.target+'</span>'})+row('Funded',function(d){return d.pct+'%<div class="bar2"><i style="width:'+d.pct+'%"></i></div>'})+row('Valuation cap',function(d){return d.cap})+row('Minimum',function(d){return d.min})+row('Investors',function(d){return d.inv})+row('Days left',function(d){return d.days})+row('Sector',function(d){return '<span class="sx2">'+d.sec+'</span>'})+'</tbody></table>'+
'<div class="ai2"><b>Comparison summary</b><p>'+lead.n+' is further along at '+lead.pct+'% funded, against '+trail.pct+'% for '+trail.n+'. '+A.n+' has '+A.days+' days left and '+B.n+' has '+B.days+'.</p><p>Valuation caps of '+A.cap+' and '+B.cap+' reflect different company stages, so they are not directly comparable.</p><p>Main risk for '+A.n+': '+A.Rk[0].replace(/\.$/,'')+'. For '+B.n+': '+B.Rk[0].replace(/\.$/,'')+'.</p><span>Written by Meridian AI from the deal rooms. Not investment advice.</span></div>'+
'<div class="acts" style="display:flex;gap:8px;margin-top:22px"><button class="p3b o" data-deal="'+C.a+'">Open '+A.n+'</button><button class="p3b o" data-deal="'+C.b+'">Open '+B.n+'</button></div></main>'}
$('#v-compare').addEventListener('click',function(e){var c=e.target.closest('[data-c]');if(!c)return;var side=c.dataset.c.charAt(0).toLowerCase(),id=c.dataset.c.slice(1),o=side==='a'?'b':'a';
if(C[o]===id)C[o]=C[side];C[side]=id;renderCompare()});
/* ---- AI assistant ---- */
var M=[],busy=false;
var STARTS=['Compare Aya Health and Kora Freight','What are the risks of Zuri Energy?','Who is Ama Boateng?','Explain how a SAFE works'];
function nameIn(q){var ks=Object.keys(D()).filter(function(k){return q.indexOf(D()[k].n.toLowerCase())>-1||q.indexOf(k)>-1});return ks}
var src=function(l,a,v){return {l:l,a:a,v:v}};
function answer(q){var l=q.toLowerCase(),ks=nameIn(l),d=D(),out;
if(/compar|versus|\bvs\b/.test(l)){var a=ks[0]||'aya',b=ks[1]||(a==='kora'?'aya':'kora'),A=d[a],B=d[b];
return {h:'<p>'+A.n+' is '+A.pct+'% funded with '+A.days+' days left. '+B.n+' is '+B.pct+'% funded with '+B.days+' days left.</p><ul><li>'+A.n+': '+A.raised+' raised toward '+A.target+', '+A.inv+' investors, '+A.sec+'.</li><li>'+B.n+': '+B.raised+' raised toward '+B.target+', '+B.inv+' investors, '+B.sec+'.</li></ul><p>Their valuation caps ('+A.cap+' and '+B.cap+') sit at different company stages, so compare the risks as well as the numbers.</p>',s:[src(A.n+' round','data-deal',a),src(B.n+' round','data-deal',b),src('Compare tool','data-view','compare')]}}
if(/risk/.test(l)){var k=ks[0]||'kora',R=d[k];return {h:'<p>These are the main risks listed in the '+R.n+' due diligence summary:</p><ul>'+R.Rk.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>',s:[src(R.n+' round','data-deal',k)]}}
if(/ama|boateng/.test(l))return {h:'<p>Ama Boateng founded Kora Freight in 2019 after working in port operations in Tema. The company connects more than 9,000 truck operators with manufacturers in Ghana, Côte d\'Ivoire and Nigeria.</p><ul><li>Raised $64M across a Series A and Series B.</li><li>Recommends The Goal and Zero to One.</li></ul>',s:[src('Ama Boateng','data-view','profile'),src('Kora Freight','data-view','company'),src('Kora round','data-deal','kora')]};
if(/payment|rail|remittance|cross-border/.test(l))return {h:'<p>Three fintechs are competing to build a shared settlement network for West Africa. The aim is to remove the foreign intermediary that adds days and fees to cross-border payments.</p><ul><li>Average cost today is about 7.8%, with settlement taking around two days.</li><li>Two central banks have signalled support, but none has set a date.</li></ul>',s:[src('Lead story','data-view','article')]};
if(/safe|valuation cap|how.*invest|explain/.test(l))return {h:'<p>A SAFE is an agreement to receive equity later, usually when the company raises a priced round. You pay now and hold no shares until that event.</p><ul><li>The valuation cap limits the price you convert at, so a lower cap can mean more shares for the same money.</li><li>It is illiquid, and the company may never reach a priced round.</li></ul><p class="nt2">General information, not investment advice.</p>',s:[src('Kora Freight round','data-deal','kora')]};
if(ks.length){var K=ks[0],R2=d[K];return {h:'<p>'+R2.n+' is raising '+R2.target+' to '+R2.blurb.replace(/^[^ ]+ (capital |)to /,'').replace(/^[A-Z]/,function(c){return c.toLowerCase()})+' It is '+R2.pct+'% funded with '+R2.days+' days left.</p><ul>'+R2.S.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>',s:[src(R2.n+' round','data-deal',K)]}}
return {h:'<p>I can help with companies, people, books, and open rounds on Meridian. Try one of these:</p><ul>'+STARTS.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>',s:[]}}
function renderAI(){
var body=M.length?'<div class="cv2">'+M.map(function(m){return m.u?'<div class="um">'+esc(m.u)+'</div>':'<div class="am"><b class="k">Meridian AI</b>'+m.h+(m.s.length?'<div class="sr"><small>Sources</small>'+m.s.map(function(s){return '<button '+s.a+'="'+s.v+'">'+s.l+'</button>'}).join('')+'</div>':'')+'</div>'}).join('')+(busy?'<div class="am"><div class="th2"><span></span><span></span><span></span></div></div>':'')+'</div>':'<div class="intro"><h1>Ask Meridian</h1><p>Answers drawn from the people, companies, and rounds on the platform, with sources.</p></div><div class="sg2">'+STARTS.map(function(s){return '<button data-s="'+s+'">'+s+'</button>'}).join('')+'</div>';
$('#v-ai .pg').innerHTML=hb('Ask Meridian')+'<main class="aw">'+body+'<p class="nt2" style="font-size:12px;color:var(--mute);margin-top:22px">Sample answers in this prototype, built from the placeholder data.</p></main><div class="tin"><div><input aria-label="Ask a question" placeholder="Ask about a company, person, or round"><button aria-label="Send">'+SEND+'</button></div></div>';
window.scrollTo(0,document.body.scrollHeight)}
function ask(q){q=q.trim();if(!q||busy)return;M.push({u:q});busy=true;renderAI();setTimeout(function(){var a=answer(q);M.push({h:a.h,s:a.s});busy=false;renderAI();var i=$('#v-ai .tin input');i&&i.focus&&0},900)}
$('#v-ai').addEventListener('click',function(e){var s=e.target.closest('[data-s]');if(s){ask(s.dataset.s);return}if(e.target.closest('.tin button')){var i=$('#v-ai .tin input');ask(i.value);return}});
$('#v-ai').addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('.tin input'))ask(e.target.value)});
window.askAI=function(qq){App.push('ai');setTimeout(function(){var i=$('#v-ai .tin input');i&&i.focus();if(qq)ask(qq)},60)};window.syncPort=syncPort;
/* hooks */
var pg=window.guardBack;
window.guardBack=function(v){
if(v==='invest'){if(I.st==='proc')return true;if(I.st==='idle'&&I.step>1){I.step--;renderInvest();return true}}
return pg?pg(v):false};
var prev=window.onView;
window.onView=function(v){prev&&prev(v);
if(v==='invest')renderInvest();if(v==='portfolio')renderPort();if(v==='watch')renderWatch();if(v==='compare')renderCompare();if(v==='ai')renderAI()};
syncPort();
})();
