import re,os
HERE=os.path.dirname(os.path.abspath(__file__));os.chdir(HERE)
O=os.path.join(HERE,'..','screens','meridian-%s.html')
rd=lambda n:open(O%n).read()

def split_top(s):
    out=[];d=0;cur=''
    for c in s:
        if c in '([':d+=1
        if c in ')]':d-=1
        if c==',' and d==0: out.append(cur);cur=''
        else: cur+=c
    out.append(cur);return out

def scope_css(css,pref):
    out=[];i=0;n=len(css)
    while i<n:
        j=css.find('{',i)
        if j<0:break
        pre=css[i:j].strip();d=1;k=j+1
        while d:
            c=css[k];d+=(c=='{')-(c=='}');k+=1
        inner=css[j+1:k-1];i=k
        if pre.startswith('@keyframes'):out.append(pre+'{'+inner+'}')
        elif pre.startswith('@media'):
            if 'prefers-color-scheme' in pre:continue
            r=scope_css(inner,pref)
            if r:out.append(pre+'{'+r+'}')
        else:
            keep=[]
            for p in split_top(pre):
                p=p.strip()
                if p in('html','body','*') or p.startswith(':root') or p=='nav' or p.startswith('nav '):continue
                p=re.sub(r'#([A-Za-z_][\w-]*)',r'[data-i="\1"]',p)
                keep.append(pref+' '+p)
            if keep:out.append(','.join(keep)+'{'+inner+'}')
    return ''.join(out)

def tjs(js):
    def gid(m):
        a=m.group(1).strip();lit=re.fullmatch(r"'([^']*)'",a)
        return "R.querySelector('[data-i=\"%s\"]')"%lit.group(1) if lit else "R.querySelector('[data-i=\"'+%s+'\"]')"%a
    js=re.sub(r'document\.getElementById\(([^()]+)\)',gid,js)
    def q(m):
        return "R.%s('%s')"%(m.group(1),re.sub(r'#([A-Za-z_][\w-]*)',r'[data-i="\1"]',m.group(2)))
    return re.sub(r"document\.(querySelectorAll|querySelector)\('([^']*)'\)",q,js)

def parts(n):
    h=rd(n)
    css=re.search(r'<style>(.*?)</style>',h,re.S).group(1)
    body=re.search(r'<body[^>]*>(.*)</body>',h,re.S).group(1)
    js='\n'.join(re.findall(r'<script>(.*?)</script>',body,re.S))
    body=re.sub(r'<script>.*?</script>','',body,flags=re.S)
    body=re.sub(r'<nav .*?</nav>','',body,flags=re.S)
    body=body.replace('48 min','3 min').replace('48:00','3:00').replace('22 min','2 min')
    body=re.sub(r'(\s)id="([^"]+)"',r'\1data-i="\2"',body)
    return css,body,js

BELL='<button class="bell" aria-label="Notifications"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15zM10 21h4"/></svg><i class="dotu"></i></button>'
MSG='<button class="msgb" aria-label="Messages"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4V6z"/></svg><i class="dotu"></i></button>'
BELL=MSG+BELL
views=['onboarding','home','explore','community','capital','profile','company','you']
css_all='';html_all='';js_all=''
for n in views+['compose']:
    css,body,js=parts(n)
    vid='v-'+('deal' if n=='capital' else n)
    if n=='capital': body='<div class="room"></div>'; js=''
    css_all+=scope_css(css,'#'+vid)
    if n=='profile': css_all+=scope_css(css,'#v-gperson')
    if n=='company': css_all+=scope_css(css,'#v-gorg')
    if n in('home','community'): body=body.replace('<span class="av" aria-hidden="true">R</span>','<span class="hr2">'+BELL+'<span class="av" aria-hidden="true">R</span></span>')
    if n=='onboarding':
        body=body.replace('Everyone in African business, in one place.','Everyone in business, in one place.').replace('People, companies, books, and deals, with an AI that explains it all.','People, companies, books, and deals from around the world, set to your region, with an AI that explains it all.')
    if n=='home':
        body=body.replace('<div class="date">Tuesday, 29 September</div>','<div class="date" style="display:flex;justify-content:space-between;align-items:center">Tuesday, 29 September<button class="lensb" data-view="prefs">Africa, USD</button></div>',1)
        rail='<h3 class="sec">Watch and listen<a href="#">See all</a></h3><div class="rail">'+''.join('<button class="rc" data-ep="%s"><div class="vth" data-art="%s" data-seed="%s" role="img" aria-label="%s thumbnail"><span class="vp"><span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span></span><em>%s</em></div><b>%s</b><small>%s</small></button>'%(i,a,s,t,d,t,m) for i,a,s,t,d,m in [('trucks','route',5,'Why empty trucks cost Africa billions','3:00','Podcast, Ama Boateng'),('kora','network',2,'Building Kora from a single route','2:00','Video interview, Ama Boateng'),('payments','rail',2,'Inside the race for a continental payments rail','2:30','Video explainer, Meridian Desk')])+'</div>'
        body=body.replace('<h3 class="sec">For you</h3>',rail+'<h3 class="sec">For you</h3>',1)
        body=body.replace('<h3 class="sec">People to watch','<h3 class="sec">Top stories<a href="#" data-view="news">See all</a></h3><div data-news="home"></div><h3 class="sec">People to watch',1)
        body=body.replace('<small>Lead story</small>','<div class="hrw" data-hero=\'{"art":"rail","seed":2,"alt":"Illustration of converging railway lines meeting at a gold point","credit":"Illustration: Meridian Studio"}\'></div><small>Lead story</small>',1)
        body=re.sub(r'<div class="iv"><button class="play" aria-label="Play"><svg[^>]*><path[^>]*></svg></button>','<div class="iv"><div class="vth" data-art="route" data-seed="5" role="img" aria-label="Interview thumbnail"><span class="vp"><span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span></span><em>3:00</em></div>',body,count=1)
    if n=='community':
        yc='<article class="post"><div class="pe" aria-hidden="true">KO</div><div class="bd"><div class="who"><b>Kunle Okafor</b><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-label="Verified"><path d="M5 12l5 5 9-10"/></svg><span>4h</span></div><div class="role">Partner, Sahel Ventures</div><p class="tx s">Worth two minutes: Ama on how Kora started from a single route.</p><div data-yc=\'{"ep":"kora","dur":"2:00","art":"network","seed":2}\'></div></div></article>'
        body=body.replace('<article class="post"><div class="pe" aria-hidden="true">TD</div>',yc+'<article class="post"><div class="pe" aria-hidden="true">TD</div>',1)
        body=body.replace('not the average one.</p>','not the average one.</p><div data-mg=\'[{"art":"clinic","seed":3,"alt":"Illustration of a clinic cross above a pulse line","credit":"Illustration: Meridian Studio"}]\'></div>',1)
        fk='<article class="post"><div class="pe" aria-hidden="true">FK</div><div class="bd"><div class="who"><b>Fatou Keita</b><span>3h</span></div><div class="role">Head of operations, Kora Freight</div><p class="tx s">Week one on the Kumasi to Abidjan corridor. Three routes, one dashboard.</p><div data-mg=\'[{"art":"route","seed":8,"alt":"Illustration of a freight route across three stops","credit":"Illustration: Meridian Studio"},{"art":"network","seed":4,"alt":"Illustration of a network of connected depots"},{"art":"rail","seed":6,"alt":"Illustration of converging lines"}]\'></div><div class="act"><button><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>9</button><button><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-4 4M3 11V9a2 2 0 012-2h16M7 21l-4-4 4-4M21 13v2a2 2 0 01-2 2H3"/></svg>14</button><button class="lk" aria-pressed="false" data-n="57"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></svg><span>57</span></button></div></div></article>'
        body=body.replace('<article class="post"><div class="pe" aria-hidden="true">TD</div>',fk+'<article class="post"><div class="pe" aria-hidden="true">TD</div>',1)
    if n=='profile':
        body=body.replace('<button class="btn o">Save</button><button class="btn o">Share</button>','<button class="btn o" data-thread="ama">Message</button><button class="btn o" data-intro="ama">Request intro</button>')
        body=body.replace('<p class="note">Sample profile with placeholder data, used to set the design language.</p>','<p class="note">Sample profile with placeholder data. <a href="#" data-view="claim" style="color:var(--accent);text-decoration:underline;text-underline-offset:3px">Is this you? Claim this profile</a></p>')
    if n=='you':
        body=body.replace('<a class="set" href="#"><span>Notifications','<a class="set" href="#" data-view="prefs"><span>Region and currency<br><small data-prefs-sub>Africa, USD</small></span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></a><a class="set" href="#"><span>Notifications',1)
        body=body.replace('<h2>Your investments<a href="#">History</a></h2>','<div class="p3a"><button class="p3b" data-view="edit">Edit profile</button><button class="p3b o" data-view="msgs">Messages</button></div><h2>Your investments<a href="#" data-view="portfolio">History</a></h2>')
        body=body.replace('<h2>Settings</h2>','<h2>Founder tools</h2><a class="r" href="#" data-view="founder" style="border-top:1px solid var(--rule)"><div class="ic"><div class="cs">K</div></div><div><b>Kora Freight dashboard</b><span class="m">Round, backers, and updates</span></div></a><h2>Settings</h2>')
    if n=='explore': body=body.replace('<h2>Rankings</h2>','<div data-ent-block="explore"></div><h2>Rankings</h2>',1)
    if n=='explore': body=body.replace('<h2>Trending this week</h2>','<div data-news="explore"></div><h2>Trending this week</h2>',1)
    if n=='explore': body='<div data-mode="browse" data-i="b">'+body+'</div>'
    if n=='compose':
        body=body[body.index('<div class="ov"'):]
        body=body.replace('class="ov" data-i="ov"','class="ov" data-i="ov" hidden')
        js=js.replace("if(!t)return false;","var hm=window.Tray&&window.Tray.n();if(window.Tray&&window.Tray.busy())return false;if(!t&&!hm)return false;",1)
        js=js.replace('function reset(){','function reset(){window.Tray&&window.Tray.clear();',1)
        js=js.replace('||att}','||att||(window.Tray&&window.Tray.n())}',1)
        js=js.replace("$('fab').onclick=function(){$('ov').hidden=false;$('tx').focus()};","window.openCompose=function(){$('ov').hidden=false;$('tx').focus()};")
        new=r"""$('pst').onclick=function(){
if(!valid())return;
var esc=function(s){return s.replace(/</g,'&lt;')},t=esc($('tx').value.trim()),k={question:'Question',poll:'Poll',insight:''}[type];
var h='<div class="pe" aria-hidden="true">R</div><div class="bd">'+(k?'<span class="kd">'+k+'</span>':'')+'<div class="who"><b>Rich</b><span>Just now</span></div><div class="role">Founder</div>'+(t?'<p class="tx s">'+t+'</p>':'')+(window.Tray?window.Tray.html():'');
if(type==='poll')h+='<div class="pl">'+opts().filter(function(o){return o.value.trim()}).map(function(o){return '<div class="op"><span>'+esc(o.value.trim())+'</span></div>'}).join('')+'</div>';
if(att)h+='<div class="emb"><div><b>'+A[att].t+'</b><small>'+A[att].s+'</small></div></div>';
h+='</div>';
var p=document.createElement('article');p.className='post';p.innerHTML=h;
document['querySelector']('#v-community .live').after(p);
var w=AUD[aud];reset();close();
$('ts').textContent='Posted to '+w;$('ts').hidden=false;setTimeout(function(){$('ts').hidden=true},2600);
};
"""
        js=re.sub(r"\$\('pst'\)\.onclick=function\(\)\{.*?\n\};\n(?=upd\(\);)",lambda m:new,js,flags=re.S)
    if n=='profile': js=js.replace('s.id','s.dataset.i')
    if n=='compose': js=js.replace('id="rm"','data-i="rm"')
    js=tjs(js)
    if n=='onboarding':
        js+="\nwindow.resetOnboarding=function(){S=[];P=[];I=[];R.querySelectorAll('[aria-pressed=\"true\"]').forEach(function(x){x.setAttribute('aria-pressed','false')});R.querySelectorAll('.fl').forEach(function(f){f.textContent='Follow'});show(0)};\n"
    if n=='compose':
        html_all+='<div id="v-compose">'+body+'</div>'
    else:
        html_all+='<div class="view" id="%s">%s</div>'%(vid,body)
    if js.strip(): js_all+="(function(){var R=document.getElementById('%s');\n%s\n})();\n"%(vid,js)

P1H=open('p1.html').read().replace('BELL',BELL)
html_all+=P1H
css_all+=open('p1.css').read()
js_all+=open('p1.js').read()+'\n'
html_all+=open('p2.html').read()
css_all+=open('p2.css').read()
js_all+=open('p2.js').read()+'\n'
html_all+=open('p3.html').read()
css_all+=open('p3.css').read()
js_all+=open('p3.js').read()+'\n'
html_all+=open('p4.html').read()
css_all+=open('p4.css').read()
js_all+=open('p4.js').read()+'\n'
html_all+=''
html_all+=open('p7.html').read()
html_all+=open('p8.html').read()
css_all+=open('p5.css').read()
css_all+=open('p6.css').read()
css_all+=open('p7.css').read()
css_all+=open('p8.css').read()
js_all+=open('p5.js').read()+'\n'
js_all+=open('p6.js').read()+'\n'
js_all+=open('p7.js').read()+'\n'
js_all+=open('p8.js').read()+'\n'
base=""":root{--bg:#F1F4F2;--ink:#0E1A16;--mute:#55635D;--rule:#D3DAD6;--accent:#8F6708;--panel:#0B2A21;--panel-ink:#E9EFEA;--panel-mute:#8DA69B;--gold:#E3B341;--down:#E8836B;--surface:#FAFBFA;--risk:#A4432B;--live:#C0392B;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#08120F;--ink:#E8EEEA;--mute:#93A29B;--rule:#21312B;--accent:#E3B341;--panel:#0F3A2D;--surface:#0D1A16;--risk:#E8836B;--live:#E8836B}}
:root[data-theme="dark"]{--bg:#08120F;--ink:#E8EEEA;--mute:#93A29B;--rule:#21312B;--accent:#E3B341;--panel:#0F3A2D;--surface:#0D1A16;--risk:#E8836B;--live:#E8836B}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.5 "Instrument Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.view{display:none}.view.on{display:block}
.logo,.av{cursor:pointer}
#v-profile .panel .ph b,#v-company .round .btn{cursor:pointer}
#v-profile .panel .ph b{text-decoration:underline;text-decoration-color:var(--gold);text-decoration-thickness:1.5px;text-underline-offset:3px}
#nav{position:fixed;left:0;right:0;bottom:0;background:var(--bg);border-top:1px solid var(--rule);padding-bottom:env(safe-area-inset-bottom,0px);z-index:6}
#nav[hidden]{display:none}
#nav div{max-width:720px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr)}
#nav button{border:0;background:none;color:var(--mute);padding:10px 0 9px;font:500 11px "Instrument Sans",sans-serif;display:flex;flex-direction:column;align-items:center;gap:3px}
#nav button[aria-current="page"]{color:var(--ink)}
#nav button[aria-current="page"] svg{color:var(--accent)}
"""
ico={'home':'<path d="M4 11l8-7 8 7v9H4z"/>','explore':'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>','community':'<path d="M4 5h16v11H9l-5 4z"/>','capital':'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>','you':'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'}
lab={'home':'Today','explore':'Explore','community':'Community','capital':'Capital','you':'You'}
nav='<nav id="nav" aria-label="Main" hidden><div>'+''.join('<button data-go="%s"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">%s</svg>%s</button>'%(k,ico[k],lab[k]) for k in ico)+'</div></nav>'

shell=open('shell_new.js').read()

out='<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Meridian</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">\n<style>\n'+base+css_all+'\n</style></head><body>\n'+html_all+nav+'\n<script>\n'+js_all+shell+'</script></body></html>'
os.makedirs(os.path.join(HERE,'..','dist'),exist_ok=True)
open(os.path.join(HERE,'..','dist','meridian-app.html'),'w').write(out)
print('bytes',len(out))
