(function(){
var cur='onboarding',stack=[],lastTab='home',TABS=['home','explore','community','capital','you'];
var $=function(s){return document.querySelector(s)};
var BK=function(x){return x.indexOf('Zero to One')>-1?'zero':x.indexOf('The Goal')>-1?'goal':x.indexOf('Things Fall Apart')>-1?'things':null};
function show(v){
cur=v;if(TABS.indexOf(v)>-1)lastTab=v;
document.querySelectorAll('.view').forEach(function(x){x.classList.toggle('on',x.id==='v-'+v)});
$('#nav').hidden=(['onboarding','deal','player','live','thread','edit','claim','invest','ai'].indexOf(v)>-1);
document.querySelectorAll('#nav button').forEach(function(b){b.removeAttribute('aria-current');if(b.dataset.go===lastTab)b.setAttribute('aria-current','page')});
window.scrollTo(0,0);
window.onView&&window.onView(v);
}
function tab(v){stack=[];show(v)}
function push(v){if(v!==cur){stack.push(cur);show(v)}}
function back(){show(stack.pop()||'home')}
window.App={tab:tab,push:push,back:back};
document.addEventListener('click',function(e){
var t=e.target;
var a=t.closest('a[href="#"]');if(a)e.preventDefault();
var g0=t.closest('#v-onboarding [data-i="go"]');
if(g0&&g0.textContent.trim()==='Open my briefing'){e.stopPropagation();tab('home');return}
if(t.closest('#v-onboarding [data-i="ol"]')){tab('home');return}
var g=t.closest('#nav [data-go]');if(g){tab(g.dataset.go);return}
if(t.closest('#v-onboarding'))return;
if(t.closest('[data-w]'))return;
var en=t.closest('[data-ent]');if(en){window.openEntity(en.dataset.ent);return}
var ak=t.closest('[data-ask]');if(ak){window.askAI(ak.dataset.ask);return}
var sy=t.closest('[data-story]');if(sy){window.openStory(sy.dataset.story);return}
var d=t.closest('[data-deal]');if(d){window.openDeal(d.dataset.deal);return}
var tb=t.closest('[data-tab]');if(tb){tab(tb.dataset.tab);return}
var bk0=t.closest('[data-book]');if(bk0){window.openBook(bk0.dataset.book);return}
var ep0=t.closest('[data-ep]');if(ep0){window.openEp(ep0.dataset.ep);return}
var gr0=t.closest('[data-group]');if(gr0&&!t.closest('.jn')){window.openGroup(gr0.dataset.group);return}
if(t.closest('.jn'))return;
var th=t.closest('[data-thread]');if(th){window.openThread(th.dataset.thread);return}
var it=t.closest('[data-intro]');if(it){window.openIntro(it.dataset.intro);return}
var vw=t.closest('[data-view]');if(vw){push(vw.dataset.view);return}
if(t.closest('.bell')){push('notifs');return}
if(t.closest('.msgb')){push('msgs');return}
if(t.closest('.logo')){tab('home');return}
if(t.closest('.av')){tab('you');return}
if(t.closest('#v-home .askf')){window.askAI();return}
if(t.closest('#v-home .lead')){push('article');return}
var hi=t.closest('#v-home .it');if(hi){var hx=hi.textContent;if(hx.indexOf('Aya Health')>-1)window.openDeal('aya');else if(hx.indexOf('Zero to One')>-1)window.openBook('zero');else if(hx.indexOf('empty trucks')>-1)window.openEp('trucks');return}
var p=t.closest('#v-home .ppl .p, #v-company .ppl .p');if(p&&p.textContent.indexOf('Ama Boateng')>-1){push('profile');return}
var sh=t.closest('#v-explore .sh');if(sh){var b0=BK(sh.textContent);if(b0)window.openBook(b0);return}
var r=t.closest('#v-explore a.r');if(r){var x=r.textContent;if(BK(x)&&x.indexOf('Book')>-1||x.indexOf('Zero to One')>-1||x.indexOf('The Goal')>-1){window.openBook(BK(x));return}if(x.indexOf('empty trucks')>-1){window.openEp('trucks');return}if(x.indexOf('community round')>-1)window.openDeal('kora');else if(x.indexOf('Aya Health')>-1)window.openDeal('aya');else if(x.indexOf('Ama Boateng')>-1)push('profile');else if(x.indexOf('Kora Freight')>-1)push('company');return}
if(t.closest('#v-community .emb')){window.openDeal('aya');return}
if(t.closest('#v-company .round .btn')){window.openDeal('kora');return}
if(t.closest('#v-profile .panel .ph b')){push('company');return}
var s=t.closest('#v-you a.r');if(s){var sx=s.textContent;if(sx.indexOf('The Goal')>-1)window.openBook('goal');else if(sx.indexOf('empty trucks')>-1)window.openEp('trucks');else if(sx.indexOf('Kora Freight')>-1)push('company');return}
var pb=t.closest('#v-profile .bk');if(pb){var b1=BK(pb.textContent);if(b1)window.openBook(b1);return}
var pi=t.closest('#v-profile .iv');if(pi){window.openEp(pi.textContent.indexOf('Building Kora')>-1?'kora':'trucks');return}
if(t.closest('#v-community .live .join')){window.openLive();return}
if(t.closest('#v-you .set.out')){stack=[];window.resetOnboarding&&window.resetOnboarding();show('onboarding');return}
if(t.closest('#v-deal .go')){var am=/\$([\d,]+)/.exec(t.closest('.go').textContent);window.startInvest(window.curDeal(),am?+am[1].replace(/,/g,''):250);return}
if(t.closest('#v-deal .wt'))return;
if(t.closest('#v-deal .back')||t.closest('#v-notifs .back')||t.closest('.hb .back')){if(window.guardBack&&window.guardBack(cur))return;back();return}
if(t.closest('#v-community .fab')){window.openCompose&&window.openCompose();return}
},true);
show('onboarding');
})();
