(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s).replace(/</g,'&lt;')};
var BACK='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var SEND='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
var CK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
var CKB='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';
function hb(t,r){return '<header class="hb"><div class="in"><button class="back" aria-label="Back">'+BACK+'Back</button><span class="t">'+(t||'')+'</span><span class="rt">'+(r||'')+'</span></div></header>'}
var tEl=document.createElement('div');tEl.id='toast';tEl.hidden=true;tEl.setAttribute('role','status');document.body.appendChild(tEl);
window.toast=function(m){tEl.textContent=m;tEl.hidden=false;clearTimeout(window._tt);window._tt=setTimeout(function(){tEl.hidden=true},2400)};
/* data */
var PPL={ama:['AB','Ama Boateng','Founder and CEO, Kora Freight'],nia:['NM','Nia Mensah','CEO, Aya Health'],kunle:['KO','Kunle Okafor','Partner, Sahel Ventures'],tunde:['TD','Tunde Dlamini','CFO, Zuri Energy'],fatou:['FK','Fatou Keita','Head of operations, Kora Freight']};window.PPL=PPL;
var T={nia:{u:1,m:[[1,'Thanks for the intro to Kunle. We spoke yesterday.','10:12'],[0,'Glad it worked. How did it go?','10:15'],[1,'Good. He wants to see our clinic numbers next week.','10:20']]},
ama:{u:1,m:[[0,'Hi Ama, I enjoyed the podcast on empty trucks.','Mon'],[1,'Thank you! Happy to chat Thursday about the corridor plan.','Mon']]},
kunle:{u:0,m:[[1,'Send me the deck when it is ready.','Tue'],[0,'Will do by Friday.','Tue']]}};
var ORDER=['nia','ama','kunle'],REP=['Sounds good to me.','Let me check and come back to you.','Thanks, I appreciate it.','Great, talk soon.'],rp=0;
var RQ=[{id:1,i:'TD',n:'Tunde Dlamini',t:'Asked you to introduce him to Kunle Okafor',m:'I am raising a small bridge round and would value ten minutes of Kunle\'s time.'},{id:2,i:'FK',n:'Fatou Keita',t:'Asked you to introduce her to Nia Mensah',m:'We are exploring clinic logistics together and I would like to learn from her rollout.'}];
function syncM(){var c=0;for(var k in T)c+=T[k].u;$$('.msgb .dotu').forEach(function(d){d.hidden=!c})}
/* inbox */
var tabI=0;
function renderMsgs(){
$('#v-msgs .pg').innerHTML=hb('Messages')+'<main class="pgw"><div class="tb2" role="tablist"><button role="tab" aria-selected="true">Messages</button><button role="tab" aria-selected="false">Requests<i></i></button></div><div class="mb"></div></main>';
fill()}
function fill(){
var pend=RQ.filter(function(r){return !r.x}).length,tabs=$$('#v-msgs .tb2 button');
tabs.forEach(function(b,i){b.setAttribute('aria-selected',i===tabI)});$('#v-msgs .tb2 i').textContent=pend?pend:'';
var mb=$('#v-msgs .mb');
if(tabI===0){mb.innerHTML='<div style="padding-top:6px">'+ORDER.map(function(k){var p=PPL[k],t=T[k],l=t.m[t.m.length-1];return '<button class="ci'+(t.u?' u':'')+'" data-thread="'+k+'"><div class="pe2">'+p[0]+'</div><div><b>'+p[1]+'</b><p>'+(l[0]?'':'You: ')+esc(l[1])+'</p></div><span class="w">'+l[2]+'</span></button>'}).join('')+'</div>';return}
var list=RQ.filter(function(r){return r.x!==2});
if(!list.length){mb.innerHTML='<div class="es"><div class="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5"/></svg></div><h3>No requests right now</h3><p>When someone asks you for an introduction, it appears here.</p></div>';return}
mb.innerHTML='<div style="padding-top:6px">'+list.map(function(r){return '<div class="rq"><div class="h"><div class="pe2">'+r.i+'</div><div><b>'+r.n+'</b><small>'+r.t+'</small></div></div><p>'+esc(r.m)+'</p>'+(r.x===1?'<div class="done">Introduction sent</div>':'<div class="rb"><button class="p3b" data-ok="'+r.id+'">Introduce</button><button class="p3b o" data-no="'+r.id+'">Decline</button></div>')+'</div>'}).join('')+'</div>'}
$('#v-msgs').addEventListener('click',function(e){var t=e.target,b=t.closest('.tb2 button');
if(b){tabI=$$('#v-msgs .tb2 button').indexOf(b);fill();return}
var o=t.closest('[data-ok]');if(o){RQ.filter(function(r){return r.id==o.dataset.ok})[0].x=1;fill();window.toast('Introduction sent');return}
var n=t.closest('[data-no]');if(n){RQ.filter(function(r){return r.id==n.dataset.no})[0].x=2;fill()}});
/* thread */
var tid='nia';
window.openThread=function(id){tid=id;if(!T[id])T[id]={u:0,m:[]};App.push('thread')};
function bubbles(){return T[tid].m.map(function(m){return '<div class="bb '+(m[0]?'th':'me')+'">'+esc(m[1])+'<small>'+m[2]+'</small></div>'}).join('')}
function renderThread(){var p=PPL[tid];T[tid].u=0;syncM();
$('#v-thread .pg').innerHTML=hb(p[1])+'<main class="pgw tw"><div class="ml">'+bubbles()+'</div>'+(T[tid].m.length?'':'<p style="color:var(--mute);font-size:15px;text-align:center;margin-top:40px">Start the conversation with '+p[1]+'.</p>')+'</main><div class="tin"><div><input aria-label="Message" placeholder="Message '+p[1].split(' ')[0]+'"><button aria-label="Send">'+SEND+'</button></div></div>';
window.scrollTo(0,document.body.scrollHeight)}
function sendT(){var i=$('#v-thread .tin input'),v=i.value.trim();if(!v)return;
if(ORDER.indexOf(tid)<0)ORDER.unshift(tid);T[tid].m.push([0,v,'Now']);i.value='';var id=tid,ml=$('#v-thread .ml');ml.innerHTML=bubbles()+'<div class="bb th ty"><span></span><span></span><span></span></div>';window.scrollTo(0,document.body.scrollHeight);
setTimeout(function(){T[id].m.push([1,REP[rp++%REP.length],'Now']);if(tid===id&&$('#v-thread').classList.contains('on')){$('#v-thread .ml').innerHTML=bubbles();window.scrollTo(0,document.body.scrollHeight)}},1400)}
$('#v-thread').addEventListener('click',function(e){if(e.target.closest('.tin button'))sendT()});
$('#v-thread').addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('.tin input'))sendT()});
/* intro request */
var iSel=null,iMsg='';
window.openIntro=function(id){iSel=null;iMsg='';var p=PPL[id],mut=['kunle','nia'];
$('#v-intro').innerHTML='<div class="ov"><div class="bd"></div><div class="sh"><div class="grab"></div><div class="hd"><button class="cx">Cancel</button><span>Request intro</span><button class="sd2" disabled>Send</button></div><div class="bdy"><h3>'+p[1]+'</h3><p class="sub2">'+p[2]+'</p><p class="lb">Introduce me through</p><div class="cn">'+mut.map(function(k){return '<button class="cc2" aria-pressed="false" data-m="'+k+'">'+PPL[k][1]+'</button>'}).join('')+'</div><p class="lb">Why do you want to connect?</p><textarea maxlength="300" aria-label="Message" placeholder="Share context so your connection can make the case."></textarea><div class="cc">0/300</div></div></div></div>';
$('#v-intro textarea').focus()};
function iUpd(){var ta=$('#v-intro textarea');if(!ta)return;$('#v-intro .cc').textContent=ta.value.length+'/300';$('#v-intro .sd2').disabled=!(iSel&&ta.value.trim().length>=20)}
$('#v-intro').addEventListener('input',iUpd);
$('#v-intro').addEventListener('click',function(e){var t=e.target;
if(t.closest('.bd')||t.closest('.cx')||t.closest('.done2')){$('#v-intro').innerHTML='';return}
var m=t.closest('[data-m]');if(m){iSel=m.dataset.m;$$('#v-intro .cc2').forEach(function(x){x.setAttribute('aria-pressed',x===m)});iUpd();return}
if(t.closest('.sd2')){var nm=PPL[iSel][1];$('#v-intro .bdy').innerHTML='<div class="okb"><div class="ic2">'+CKB+'</div><h3>Request sent</h3><p>'+nm+' will get your message and decide whether to forward it. You will be notified when they respond.</p><button class="p3b done2">Done</button></div>';$('#v-intro .hd').remove()}});
/* edit profile */
var ME={name:'Rich',head:'Founder',loc:'',bio:'',photo:null,cover:null,sec:['Fintech','Logistics','Health'],op:{invest:1,raise:0,hire:0,mentor:1},vis:'Public'},D,dirty=false;
var SECS=['Fintech','Agritech','Logistics','Health','Energy','Media','Retail','Real estate','Education','Manufacturing','Climate','AI and data'],OPN=[['invest','Open to investing'],['raise','Open to raising'],['hire','Open to hiring'],['mentor','Open to mentoring']];
function renderEdit(){D=JSON.parse(JSON.stringify(ME));dirty=false;
$('#v-edit .pg').innerHTML=hb('Edit profile','<button class="svb" disabled>Save</button>')+'<main class="pgw"><div class="dcf" hidden>Discard your changes?<button class="d" data-d="y">Discard</button><button data-d="n">Keep editing</button></div>'+(window.photoBlock?window.photoBlock(D):'')+
'<div class="fld"><label for="ef-n">Name</label><input id="ef-n" data-f="name" maxlength="50" value="'+esc(D.name)+'"></div>'+
'<div class="fld"><label for="ef-h">Headline</label><input id="ef-h" data-f="head" maxlength="80" value="'+esc(D.head)+'" placeholder="Role, company"></div>'+
'<div class="fld"><label for="ef-l">Location</label><input id="ef-l" data-f="loc" maxlength="60" value="'+esc(D.loc)+'" placeholder="City, country"></div>'+
'<div class="fld"><label for="ef-b">Bio</label><textarea id="ef-b" data-f="bio" maxlength="280" rows="4" placeholder="Tell people what you are building and what you care about.">'+esc(D.bio)+'</textarea><div class="cnt">'+D.bio.length+'/280</div></div>'+
'<div class="fld"><span class="lbl">Sectors</span><div class="chips2">'+SECS.map(function(s){return '<button aria-pressed="'+(D.sec.indexOf(s)>-1)+'" data-s="'+s+'">'+s+'</button>'}).join('')+'</div></div>'+
'<div class="fld"><span class="lbl">Open to</span>'+OPN.map(function(o){return '<div class="sw2"><span>'+o[1]+'</span><button role="switch" aria-checked="'+!!D.op[o[0]]+'" aria-label="'+o[1]+'" data-o="'+o[0]+'"></button></div>'}).join('')+'<div style="border-top:1px solid var(--rule)"></div></div>'+
'<div class="fld"><span class="lbl">Who can see your profile</span><div class="seg3">'+['Public','Members','Private'].map(function(v){return '<button aria-pressed="'+(D.vis===v)+'" data-v="'+v+'">'+v+'</button>'}).join('')+'</div></div></main>'}
function eUpd(){dirty=JSON.stringify(D)!==JSON.stringify(ME);var s=$('#v-edit .svb');if(s)s.disabled=!(dirty&&D.name.trim())}
$('#v-edit').addEventListener('input',function(e){var f=e.target.dataset.f;if(!f)return;D[f]=e.target.value;if(f==='bio')$('#v-edit .cnt').textContent=D.bio.length+'/280';eUpd()});
$('#v-edit').addEventListener('click',function(e){var t=e.target;
var s=t.closest('[data-s]');if(s){var on=s.getAttribute('aria-pressed')!=='true';s.setAttribute('aria-pressed',on);D.sec=on?D.sec.concat(s.dataset.s):D.sec.filter(function(x){return x!==s.dataset.s});eUpd();return}
var o=t.closest('[data-o]');if(o){var v=o.getAttribute('aria-checked')!=='true';o.setAttribute('aria-checked',v);D.op[o.dataset.o]=v?1:0;eUpd();return}
var v2=t.closest('[data-v]');if(v2){D.vis=v2.dataset.v;$$('#v-edit [data-v]').forEach(function(x){x.setAttribute('aria-pressed',x===v2)});eUpd();return}
var d=t.closest('[data-d]');if(d){if(d.dataset.d==='y'){dirty=false;App.back()}else $('#v-edit .dcf').hidden=true;return}
if(t.closest('.svb')&&!t.closest('.svb').disabled){ME=JSON.parse(JSON.stringify(D));ME.name=ME.name.trim();var ini=ME.name.charAt(0).toUpperCase();
$('#v-you h1').textContent=ME.name;$('#v-you .hd').textContent=(ME.head.trim()||'Member')+'. Member since 2026';$('#v-you .pe').textContent=ini;$$('.av').forEach(function(a){a.textContent=ini});
$('#v-you .chips').innerHTML=ME.sec.map(function(x){return '<span class="chip">'+x+'</span>'}).join('');
dirty=false;window.Media&&window.Media.setMe(ME.photo,ME.cover,ini);window.toast('Profile saved');App.back()}});
window.editHook={get:function(){return D},set:function(k,v){D[k]=v;eUpd()}};
window.guardBack=function(v){if(v==='edit'&&dirty){$('#v-edit .dcf').hidden=false;return true}return false};
/* claim profile */
var C={st:1,m:null,em:''};
var CM=[['work','Verify with a work email','We send a code to an address at the company'],['domain','Verify with a company domain','Use an email on the company website domain'],['link','Verify by secure link','We email you a one-time verification link']];
function renderClaim(){C={st:1,m:null,em:''};cDraw()}
function cDraw(){var h=hb('Claim profile')+'<main class="pgw clm">';
if(C.st===1)h+='<div class="stp">Step 1 of 3</div><h1>Is this you?</h1><p class="cap" style="font-size:16px;margin-bottom:14px">Claim '+(window.claimName||'Ama Boateng')+'\'s profile to edit it, add sources, and earn a verified badge.</p>'+CM.map(function(m){return '<button class="opt" aria-pressed="'+(C.m===m[0])+'" data-m="'+m[0]+'"><div><b>'+m[1]+'</b><small>'+m[2]+'</small></div><span class="ck">'+CK+'</span></button>'}).join('')+'<div class="acts" style="margin-top:22px"><button class="p3b" data-n="2"'+(C.m?'':' disabled')+'>Continue</button></div>';
if(C.st===2)h+='<div class="stp">Step 2 of 3</div><h1>Enter your email</h1><p class="cap" style="font-size:16px">We will send a 6-digit code to confirm it is you.</p><div class="fld"><label for="cl-e">Email</label><input id="cl-e" type="email" inputmode="email" autocomplete="email" placeholder="name@company.com" value="'+esc(C.em)+'"></div><div class="acts" style="margin-top:22px"><button class="p3b" data-n="3" disabled>Send code</button></div>';
if(C.st===3)h+='<div class="stp">Step 3 of 3</div><h1>Check your email</h1><p class="cap" style="font-size:16px">Enter the 6-digit code we sent to '+esc(C.em)+'.</p><div class="fld"><label for="cl-c">Code</label><input id="cl-c" class="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000"></div><button class="lk" data-r="1">Send a new code</button><div class="acts"><button class="p3b" data-n="4" disabled>Verify</button></div>';
if(C.st===4)h+='<div class="fin"><div class="ic2">'+CKB+'</div><h1>Claim submitted</h1><p>We review claims within two days. Your profile gets a verified badge once approved.</p><button class="p3b" data-n="9">Done</button></div>';
$('#v-claim .pg').innerHTML=h+'</main>'}
$('#v-claim').addEventListener('click',function(e){var t=e.target,m=t.closest('[data-m]');
if(m){C.m=m.dataset.m;cDraw();return}
var n=t.closest('[data-n]');if(n&&!n.disabled){var s=+n.dataset.n;if(s===9){App.back();return}C.st=s;cDraw();return}
if(t.closest('[data-r]'))window.toast('A new code is on its way')});
$('#v-claim').addEventListener('input',function(e){var t=e.target;
if(t.id==='cl-e'){C.em=t.value.trim();$('#v-claim [data-n="3"]').disabled=!/^\S+@\S+\.\S+$/.test(C.em)}
if(t.id==='cl-c'){t.value=t.value.replace(/\D/g,'');$('#v-claim [data-n="4"]').disabled=t.value.length!==6}});
/* founder dashboard */
var F={sub:0,ups:[['5 days ago','Kumasi to Abidjan carried 140 loads this week, ahead of plan.']]},DAY=[12,18,9,30,22,15,41,28,17,35,52,24,31,47];
function renderFounder(){
var mx=Math.max.apply(null,DAY),bars=DAY.map(function(v,i){var h=Math.round(v/mx*62);return '<rect x="'+(i*21+4)+'" y="'+(70-h)+'" width="14" height="'+h+'" rx="2" fill="#E3B341" opacity="'+(i===DAY.length-1?1:.6)+'"/>'}).join('');
var items=[['Verify company',1],['Upload audited financials',1],['Add use of funds',1],['Submit terms for review',F.sub]];
$('#v-founder .pg').innerHTML=hb('Founder dashboard')+'<main class="pgw fdn"><div class="top"><div class="cs">K</div><div><b>Kora Freight</b><small>Community round is live, 19 days left</small></div></div>'+
'<div class="panel"><div class="big">$760K<span>of $2M</span></div><div class="bar"><i style="width:38%"></i></div><div class="g"><div><span>Page views</span><strong>4,820</strong></div><div><span>Backers</span><strong>215</strong></div><div><span>Conversion</span><strong>4.5%</strong></div></div><div class="ch"><p>Commitments per day, $K</p><svg viewBox="0 0 300 84" role="img" aria-label="Daily commitments over the last 14 days"><line x1="0" y1="70.5" x2="300" y2="70.5" stroke="rgba(233,239,234,.2)"/>'+bars+'<text x="4" y="82">14 days ago</text><text x="296" y="82" text-anchor="end">Today</text></svg></div></div>'+
'<h2>Before terms go live</h2><p class="cap">'+items.filter(function(x){return x[1]}).length+' of 4 steps complete</p>'+items.map(function(x,i){return '<div class="cl'+(x[1]?' d':'')+'"><i>'+CK+'</i>'+x[0]+(i===3&&!F.sub?'<em><button class="p3b" data-sub style="padding:8px 14px">Submit</button></em>':(i===3?'<em>In review</em>':''))+'</div>'}).join('')+'<div style="border-top:1px solid var(--rule)"></div>'+
'<h2>Update your backers</h2><p class="cap">Sent to 215 backers by email and in the app.</p><textarea maxlength="280" aria-label="Update" placeholder="Share progress, a win, or a challenge."></textarea><div class="row2"><span class="uc">0/280</span><button class="p3b" data-send disabled>Send update</button></div><div class="uls">'+F.ups.map(function(u){return '<div class="up"><small>'+u[0]+'</small><p>'+esc(u[1])+'</p></div>'}).join('')+'</div>'+
'<h2>Top backers</h2><div class="bk2"><span>Continental Growth Fund</span><em>Lead</em></div><div class="bk2"><span>Sahel Ventures</span><em>$100K</em></div><div class="bk2" style="border-bottom:1px solid var(--rule)"><span>42 individual investors</span><em>Community</em></div><p class="note" style="margin-top:28px;font-size:13px;color:var(--mute)">Sample dashboard with placeholder data.</p></main>'}
$('#v-founder').addEventListener('input',function(e){if(e.target.tagName==='TEXTAREA'){$('#v-founder .uc').textContent=e.target.value.length+'/280';$('#v-founder [data-send]').disabled=!e.target.value.trim()}});
$('#v-founder').addEventListener('click',function(e){var t=e.target;
if(t.closest('[data-sub]')){F.sub=1;renderFounder();window.toast('Terms submitted for review');return}
if(t.closest('[data-send]')){var ta=$('#v-founder textarea'),v=ta.value.trim();if(!v)return;F.ups.unshift(['Just now',v]);ta.value='';$('#v-founder .uc').textContent='0/280';$('#v-founder [data-send]').disabled=true;$('#v-founder .uls').innerHTML=F.ups.map(function(u){return '<div class="up"><small>'+u[0]+'</small><p>'+esc(u[1])+'</p></div>'}).join('');window.toast('Update sent to 215 backers')}});
/* hook */
var prev=window.onView;
window.onView=function(v){prev&&prev(v);
if(v==='msgs'){tabI=0;renderMsgs()}if(v==='thread')renderThread();if(v==='edit')renderEdit();if(v==='claim')renderClaim();if(v==='founder')renderFounder();syncM()};
syncM();
})();
