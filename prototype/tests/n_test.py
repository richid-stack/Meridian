from playwright.sync_api import sync_playwright
U="file:///home/claude/meridian/dist/meridian-app.html"
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,color_scheme="light")
    pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(U,wait_until="domcontentloaded"); pg.wait_for_timeout(300); pg.click("#v-onboarding [data-i=ol]")
    on=lambda:pg.evaluate("[...document.querySelectorAll('.view.on')].map(v=>v.id).join()")
    ovx=lambda:pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    # ---- unit: normalise + cluster
    r=pg.evaluate("""(()=>{const N=window.News;
      const a=N.normA({source:{name:'X'},title:'Mobile money transfers pass a new monthly record across West Africa',description:'d',url:'u1',publishedAt:new Date().toISOString(),category:'fintech',region:'west',urlToImage:'data:image/png;base64,AAAA'});
      const b=N.normB({src:'Y',title:{en:'Mobile money use reaches record high in West Africa'},summary:{en:'s'},link:'u2',pub:new Date().toISOString(),cat:'fintech',loc:'west',lang:'en'});
      const c=N.normB({src:'Z',title:{en:'Hospitals adopt solar power to cut outages'},summary:{en:'s'},link:'u3',pub:new Date().toISOString(),cat:'fintech',loc:'west',lang:'en'});
      const cl=N.cluster([a,b,c]);
      return {imgCredit:a.imageCredit,sim:+N.jac(N.toks(a.titleEn),N.toks(b.titleEn)).toFixed(2),clusters:cl.length,sizes:cl.map(x=>x.sources.length).join(','),primaryHasImage:cl.filter(x=>x.sources.length===2)[0].primary.image!==null}})()""")
    print("unit:",r)
    pg.wait_for_timeout(1000)
    print("home top stories rows:",pg.evaluate("document.querySelectorAll('#v-home [data-news=home] .nw-row').length"),"| skeleton gone:",pg.evaluate("!document.querySelector('#v-home [data-news=home] .sk')"))
    pg.evaluate("document.querySelector('#v-home [data-news=home]').scrollIntoView({block:'start'})"); pg.evaluate("window.scrollBy(0,-90)"); pg.wait_for_timeout(200); pg.screenshot(path="n-home.png")
    # open first story
    pg.click("#v-home [data-news=home] .nw-row >> nth=0"); pg.wait_for_timeout(200)
    print("story page:",on(),"| h1:",pg.inner_text("#v-story h1")[:60],"| ovx",ovx())
    print("CTA:",pg.evaluate("(()=>{const a=document.querySelector('#v-story .nw-act a');return a.textContent+' | '+a.target+' | '+a.rel})()"),"| coverage items:",pg.evaluate("document.querySelectorAll('#v-story .nw-cov').length"),"| credit:",pg.inner_text("#v-story figcaption")); pg.screenshot(path="n-story.png")
    pg.click("#v-story .sv"); print("saved toggle:",pg.get_attribute("#v-story .sv","aria-pressed"),"|",pg.inner_text("#toast"))
    pg.click("#v-story .back")
    # News page
    pg.click("#v-home .sec a[data-view=news]"); pg.wait_for_timeout(1200); print("news page:",on(),"| default region pressed:",pg.evaluate("document.querySelector('#v-news [data-region][aria-pressed=true]').textContent"),"| items:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"),"| load more:",pg.evaluate("!!document.querySelector('#v-news [data-more]')"),"| updated:",pg.inner_text("#v-news .up")); pg.screenshot(path="n-news.png")
    pg.click("#v-news [data-more]"); pg.wait_for_timeout(1000); print("after load more:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"),"| more btn:",pg.evaluate("!!document.querySelector('#v-news [data-more]')"))
    print("cluster badges:",pg.evaluate("[...document.querySelectorAll('#v-news .nw-co span:last-child')].map(s=>s.textContent).join(' / ')"))
    pg.click("#v-news [data-region=west]"); pg.wait_for_timeout(1000); print("west:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"),"| sources:",pg.evaluate("[...document.querySelectorAll('#v-news .nw-meta b')].map(b=>b.textContent).slice(0,5).join(', ')"))
    print("fr badge present:",pg.evaluate("!![...document.querySelectorAll('#v-news .nw-badge')].find(b=>b.textContent==='FR')"))
    pg.click("#v-news [data-region=global]"); pg.wait_for_timeout(1000); print("global:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"),"| global badges:",pg.evaluate("[...document.querySelectorAll('#v-news .nw-badge')].filter(b=>b.textContent==='Global').length")); pg.screenshot(path="n-global.png")
    pg.click("#v-news [data-region=north]"); pg.click("#v-news [data-topic=health]"); pg.wait_for_timeout(900); print("empty state:",pg.inner_text("#v-news .es h3")); pg.screenshot(path="n-empty.png")
    pg.click("#v-news .es button"); pg.wait_for_timeout(1000); print("after clear:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"),"| region:",pg.evaluate("document.querySelector('#v-news [data-region][aria-pressed=true]').textContent"),"| topic:",pg.evaluate("document.querySelector('#v-news [data-topic][aria-pressed=true]').textContent"))
    # french story + translate
    pg.click("#v-news [data-region=west]"); pg.wait_for_timeout(900)
    pg.click("#v-news .nw-row:has(.nw-badge:text('FR')) >> nth=0"); pg.wait_for_timeout(200)
    print("fr story h1:",pg.inner_text("#v-story h1")[:50]); pg.click("#v-story [data-tr]"); print("translated h1:",pg.inner_text("#v-story h1")[:50],"| note:",pg.evaluate("document.querySelector('#v-story .nw-tr').nextElementSibling?.textContent")); pg.screenshot(path="n-french.png")
    pg.click("#v-story .back")
    # entity story -> company & deal
    pg.click("#v-news [data-region=africa]"); pg.wait_for_timeout(900)
    pg.click("#v-news [data-story]:has-text('Freight network adds') >> nth=0"); pg.wait_for_timeout(200)
    print("entities:",pg.evaluate("[...document.querySelectorAll('#v-story .nw-ent button')].map(b=>b.textContent).join(' | ')"))
    pg.click("#v-story .nw-ent button:has-text('Kora Freight')"); print("entity->",on()); pg.evaluate("App.back()")
    # Africa-lens note on global story
    pg.click("#v-story .back"); pg.click("#v-news [data-story]:has-text('Commodity prices') >> nth=0"); pg.wait_for_timeout(200); print("africa note:",pg.inner_text("#v-story .nw-why b"),"| sources:",pg.inner_text("#v-story h2").strip()); pg.screenshot(path="n-africa-note.png")
    # share to community
    pg.click("#v-story [data-share]"); pg.wait_for_timeout(500); print("compose open with story:",pg.evaluate("!document.querySelector('#v-compose [data-i=ov]').hidden && !!document.querySelector('#v-compose .ti .bd2')"),"| post enabled:",not pg.is_disabled("#v-compose [data-i=pst]")); pg.screenshot(path="n-compose-story.png")
    pg.fill("#v-compose [data-i=tx]","Useful context for anyone exporting cocoa."); pg.click("#v-compose [data-i=pst]"); pg.wait_for_timeout(400); pg.evaluate("window.scrollTo(0,0)")
    print("feed story card:",pg.evaluate("document.querySelector('#v-community .live + .post .sc b')?.textContent"))
    pg.click("#v-community .live + .post .sc"); pg.wait_for_timeout(200); print("card->",on(),pg.inner_text("#v-story h1")[:40])
    # saved filter persists + region persistence across reload
    pg.click("#v-story .back"); pg.click("#nav [data-go=home]")
    pg.click("#v-home .sec a[data-view=news]"); pg.wait_for_timeout(900); pg.click("#v-news [data-saved]"); pg.wait_for_timeout(900); print("saved filter items:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"),"|",pg.inner_text("#v-news [data-saved]"))
    pg.click("#v-news [data-region=east]"); pg.reload(wait_until="domcontentloaded"); pg.wait_for_timeout(400); pg.click("#v-onboarding [data-i=ol]"); pg.click("#v-home .sec a[data-view=news]"); pg.wait_for_timeout(1000)
    print("region persisted after reload:",pg.evaluate("document.querySelector('#v-news [data-region][aria-pressed=true]').textContent"))
    # explore block
    pg.click("#nav [data-go=explore]"); pg.wait_for_timeout(1000); print("explore news rows:",pg.evaluate("document.querySelectorAll('#v-explore [data-news=explore] .nw-row').length"))
    pg.evaluate("window.scrollTo(0,0)"); pg.screenshot(path="n-explore.png")
    # offline
    pg.click("#nav [data-go=home]"); pg.click("#v-home .sec a[data-view=news]"); pg.wait_for_timeout(800)
    ctx.set_offline(True); pg.click("#v-news .nw-rf"); pg.wait_for_timeout(700); print("offline:",pg.inner_text("#v-news .es h3"),"|",pg.inner_text("#v-news .up")); pg.screenshot(path="n-offline.png")
    ctx.set_offline(False); pg.wait_for_timeout(1500); print("auto recovered:",pg.evaluate("document.querySelectorAll('#v-news [data-story]').length"))
    print("ovx",ovx(),"ERRORS",errs)
    b.close()
