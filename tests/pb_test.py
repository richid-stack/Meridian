from playwright.sync_api import sync_playwright
U="file:///home/claude/meridian/dist/meridian-app.html"
FAKE="""
window.__yt={calls:[],t:0,playing:false};
window.YT={PlayerState:{PLAYING:1},Player:function(el,opts){var self=this,host=typeof el==='string'?document.getElementById(el):el;window.__yt.calls.push(['new',opts.videoId,opts.host,opts.playerVars.start]);
var f=document.createElement('iframe');f.title='fake youtube';host.appendChild(f);
this.getCurrentTime=function(){return window.__yt.t};this.getDuration=function(){return 120};
this.seekTo=function(s){window.__yt.t=s;window.__yt.calls.push(['seek',s])};
this.playVideo=function(){window.__yt.playing=true;opts.events.onStateChange({data:1})};this.pauseVideo=function(){window.__yt.playing=false;opts.events.onStateChange({data:2})};
this.setPlaybackRate=function(r){window.__yt.calls.push(['rate',r])};this.destroy=function(){window.__yt.calls.push(['destroy'])};
setTimeout(function(){opts.events.onReady({target:self});opts.events.onStateChange({data:1});window.__yt.playing=true},60)}};
"""
with sync_playwright() as p:
    b=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    ctx=b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,color_scheme="light")
    pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(U,wait_until="domcontentloaded"); pg.wait_for_timeout(400); pg.click("#v-onboarding [data-i=ol]"); pg.wait_for_timeout(300)
    on=lambda:pg.evaluate("[...document.querySelectorAll('.view.on')].map(v=>v.id).join()")
    ovx=lambda:pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    st=lambda:pg.evaluate("window.Playback.state()")
    print("home rail cards:",pg.evaluate("document.querySelectorAll('#v-home .rc').length"),"| thumbs bg:",pg.evaluate("[...document.querySelectorAll('#v-home .rc .vth')].every(v=>getComputedStyle(v).backgroundImage.startsWith('url'))"),"| durations text:",pg.evaluate("[...document.querySelectorAll('#v-home .vth em')].map(e=>e.textContent).join(',')"))
    pg.evaluate("document.querySelector('#v-home .rail').scrollIntoView({block:'center'})"); pg.wait_for_timeout(200); pg.screenshot(path="pb-home-rail.png")
    # ---------- A: real audio
    pg.click("#v-home .rc[data-ep=trucks]"); pg.wait_for_timeout(2600)
    s=st(); print("A open:",on(),"| state:",s,"| ovx",ovx())
    print("A time shown:",pg.inner_text("#v-player .cu"),"| remaining:",pg.inner_text("#v-player .rm"),"| icon pause:",pg.evaluate("document.querySelector('#v-player .pl').innerHTML.includes('M6 4h4')"))
    print("A media session:",pg.evaluate("navigator.mediaSession&&navigator.mediaSession.metadata?navigator.mediaSession.metadata.title+' | '+navigator.mediaSession.metadata.artist:null"))
    pg.screenshot(path="pb-audio.png")
    pg.click("#v-player [data-sk='30']"); pg.wait_for_timeout(200); print("A +30:",pg.inner_text("#v-player .cu"))
    pg.click("#v-player .chp >> nth=2"); pg.wait_for_timeout(400); print("A chapter jump:",pg.inner_text("#v-player .cu"),"| active chapter:",pg.inner_text("#v-player .chp.on"))
    pg.click("#v-player .sd"); print("A speed:",pg.inner_text("#v-player .sd"),"| audio rate:",st()["rate"])
    pg.click("#v-player [data-tab3='1']"); pg.wait_for_timeout(400); print("A transcript lines:",pg.evaluate("document.querySelectorAll('#v-player .tl').length"),"| current line:",pg.evaluate("document.querySelector('#v-player .tl.on .tx')?.textContent.slice(0,40)")); pg.screenshot(path="pb-transcript.png")
    pg.fill("#v-player .tsb input","borders"); print("A search:",pg.inner_text("#v-player .tsb .mc"),"| visible:",pg.evaluate("[...document.querySelectorAll('#v-player .tl')].filter(l=>!l.hidden).length"),"| marks:",pg.evaluate("document.querySelectorAll('#v-player .tl mark').length")); pg.screenshot(path="pb-search.png")
    pg.fill("#v-player .tsb input",""); pg.click("#v-player .tl >> nth=8"); pg.wait_for_timeout(300); print("A tap line seek:",pg.inner_text("#v-player .cu"))
    pg.click("#v-player [data-tab3='2']"); print("A mentions:",pg.evaluate("[...document.querySelectorAll('#v-player .mc2')].map(m=>m.textContent).join(' | ')"))
    pg.click("#v-player .mc2 >> nth=2"); print("A mention->book:",on(),pg.inner_text("#v-book h1"))
    pg.evaluate("App.back()"); pg.wait_for_timeout(200)
    pg.click("#v-player .back"); pg.wait_for_timeout(300)
    print("A mini visible:",pg.evaluate("!document.getElementById('mini').hidden"),"|",pg.inner_text("#mini small")); pg.screenshot(path="pb-mini.png")
    pg.click("#mini button"); pg.wait_for_timeout(300); print("A mini paused:",not st()["playing"])
    pos=st()["pos"]; pg.click("#nav [data-go=home]"); pg.wait_for_timeout(300); print("A rail progress bar:",pg.evaluate("!!document.querySelector('#v-home .rc[data-ep=trucks] .prg i')"),"| width:",pg.evaluate("document.querySelector('#v-home .rc[data-ep=trucks] .prg i')?.style.width"))
    # resume after reload
    pg.reload(wait_until="domcontentloaded"); pg.wait_for_timeout(400); pg.click("#v-onboarding [data-i=ol]"); pg.click("#v-home .rc[data-ep=trucks]"); pg.wait_for_timeout(900)
    print("A resumed pos after reload:",round(st()["pos"]),"(saved ~",round(pos),")")
    # ---------- C: blocked embed fallback
    pg.click("#v-player .back"); pg.click("#v-home .rc[data-ep=kora]"); pg.wait_for_timeout(300); pg.screenshot(path="pb-video-facade.png")
    print("C facade:",pg.evaluate("!!document.querySelector('#v-player .vfc')"),"| privacy note:",pg.inner_text("#v-player .vnote")[:40],"| mini hidden for video:",pg.evaluate("document.getElementById('mini').hidden"))
    pg.click("#v-player .vfc"); pg.wait_for_timeout(1500)
    print("C fallback:",pg.evaluate("document.querySelector('#v-player .vfb a')?.href"),"| text:",pg.inner_text("#v-player .vfb b")); pg.screenshot(path="pb-video-fallback.png")
    print("ovx",ovx(),"ERRORS",errs)
    # ---------- B: video with fake YouTube API
    pg2=ctx.new_page(); pg2.add_init_script(FAKE); e2=[]; pg2.on("pageerror",lambda e:e2.append(str(e)))
    pg2.goto(U,wait_until="domcontentloaded"); pg2.wait_for_timeout(400); pg2.click("#v-onboarding [data-i=ol]"); pg2.click("#v-home .rc[data-ep=kora]"); pg2.wait_for_timeout(200)
    pg2.click("#v-player .vfc"); pg2.wait_for_timeout(500)
    print("B calls:",pg2.evaluate("window.__yt.calls.map(c=>c.join(':')).join(' | ')"),"| iframe mounted:",pg2.evaluate("!!document.querySelector('#v-player .vstage iframe')"),"| loader gone:",pg2.evaluate("!document.querySelector('#v-player .vload')"))
    pg2.click("#v-player [data-tab3='1']"); pg2.evaluate("window.__yt.t=47"); pg2.wait_for_timeout(700)
    print("B synced line @47s:",pg2.evaluate("document.querySelector('#v-player .tl.on .tt')?.textContent"),"|",pg2.evaluate("window.Playback.state().pos"))
    pg2.click("#v-player .tl >> nth=6"); pg2.wait_for_timeout(200); print("B tap line -> seek calls:",pg2.evaluate("window.__yt.calls.filter(c=>c[0]==='seek').map(c=>c[1]).join(',')"))
    pg2.click("#v-player [data-tab3='0']"); pg2.click("#v-player .chp >> nth=1"); pg2.wait_for_timeout(200); print("B chapter -> seek:",pg2.evaluate("window.__yt.calls.filter(c=>c[0]==='seek').map(c=>c[1]).join(',')")); pg2.screenshot(path="pb-video-playing.png")
    pg2.click("#v-player .back"); pg2.wait_for_timeout(200); print("B destroyed on leave:",pg2.evaluate("window.__yt.calls.some(c=>c[0]==='destroy')"))
    pg2.click("#v-home .rc[data-ep=kora]"); pg2.wait_for_timeout(200); pg2.click("#v-player .vfc"); pg2.wait_for_timeout(400); print("B resume start param:",pg2.evaluate("window.__yt.calls.filter(c=>c[0]==='new').map(c=>c[3]).join(',')"))
    # ---------- D: composer YouTube link + E: seeded card
    pg2.click("#v-player .back"); pg2.click("#nav [data-go=community]"); pg2.wait_for_timeout(300)
    pg2.click("#v-community .yc[data-ep=kora]"); pg2.wait_for_timeout(300); print("E seeded card ->",pg2.evaluate("[...document.querySelectorAll('.view.on')].map(v=>v.id).join()"),pg2.inner_text("#v-player h1")); pg2.click("#v-player .back")
    pg2.click("#v-community .fab"); pg2.wait_for_timeout(400)
    pg2.fill("#v-compose [data-i=tx]","Great watch https://youtu.be/dQw4w9WgXcQ?si=abc worth it"); pg2.wait_for_timeout(200)
    print("D tray card:",pg2.evaluate("!!document.querySelector('#v-compose .ti.vid .bd2')"),"| text left:",repr(pg2.input_value("#v-compose [data-i=tx]")),"| post enabled:",not pg2.is_disabled("#v-compose [data-i=pst]")); pg2.screenshot(path="pb-compose-link.png")
    pg2.click("#v-compose [data-i=pst]"); pg2.wait_for_timeout(400); pg2.evaluate("window.scrollTo(0,0)")
    print("D feed card:",pg2.evaluate("document.querySelector('#v-community .live + .post .yc')?.dataset.yt"))
    pg2.click("#v-community .live + .post .yc .ycv"); pg2.wait_for_timeout(500); print("D inline embed:",pg2.evaluate("window.__yt.calls.filter(c=>c[0]==='new').map(c=>c[1]).join(',')"),"| iframe:",pg2.evaluate("!!document.querySelector('#v-community .live + .post .yc iframe')")); pg2.screenshot(path="pb-feed-embed.png")
    print("ovx",pg2.evaluate("document.documentElement.scrollWidth - window.innerWidth"),"ERRORS",e2)
    b.close()
