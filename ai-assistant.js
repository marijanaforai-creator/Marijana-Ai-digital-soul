(()=>{
  const mode=location.pathname.endsWith('canvas.html')?'canvas':location.pathname.endsWith('mockup.html')?'mockup':null;
  if(!mode)return;

  const style=document.createElement('style');
  style.textContent=`
    .marijana-ai-assistant{position:fixed;right:24px;bottom:24px;width:360px;z-index:9999;background:#fff;border:1px solid rgba(40,34,47,.14);box-shadow:0 24px 70px rgba(30,20,40,.22);border-radius:18px;overflow:hidden;font-family:inherit;color:#28222F}
    .marijana-ai-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#3B235F;color:#fff}
    .marijana-ai-head strong{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600}.marijana-ai-head button{border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer}
    .marijana-ai-body{padding:14px}.marijana-ai-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
    .marijana-ai-chip{border:1px solid #d9d0e4;background:#faf8fc;border-radius:999px;padding:7px 10px;font-size:11px;cursor:pointer}
    .marijana-ai-input{width:100%;min-height:82px;resize:vertical;border:1px solid #d9d0e4;border-radius:10px;padding:10px;font:inherit;font-size:13px;box-sizing:border-box}
    .marijana-ai-actions{display:flex;gap:8px;margin-top:9px}.marijana-ai-actions button{flex:1;border:0;border-radius:10px;padding:10px;cursor:pointer;font-weight:700}
    .marijana-ai-send{background:#C8A96B;color:#fff}.marijana-ai-fix{background:#3B235F;color:#fff}
    .marijana-ai-status{font-size:11px;color:#666;margin-top:9px;line-height:1.4;max-height:130px;overflow:auto}
    .marijana-ai-toggle{position:fixed;right:24px;bottom:24px;z-index:9998;border:0;border-radius:999px;padding:13px 17px;background:#3B235F;color:#fff;box-shadow:0 15px 40px rgba(59,35,95,.3);font-weight:800;cursor:pointer}
    @media(max-width:600px){.marijana-ai-assistant{right:12px;bottom:12px;width:calc(100vw - 24px)}.marijana-ai-toggle{right:12px;bottom:12px}}
  `;
  document.head.appendChild(style);

  const panel=document.createElement('section');
  panel.className='marijana-ai-assistant';
  panel.innerHTML=`
    <div class="marijana-ai-head"><strong>✨ Marijana AI Asistent</strong><button type="button" aria-label="Zatvori">×</button></div>
    <div class="marijana-ai-body">
      <div class="marijana-ai-chips">
        <button class="marijana-ai-chip" data-ai-task="Sredi dizajn da izgleda profesionalnije. Uskladi tipografiju, razmake i boje.">Uredi dizajn</button>
        <button class="marijana-ai-chip" data-ai-task="Ispravi greške i poboljšaj raspored elemenata.">🔧 Popravi</button>
        <button class="marijana-ai-chip" data-ai-task="Predloži bolju tipografiju i primeni je.">🔤 Tipografija</button>
        <button class="marijana-ai-chip" data-ai-task="Uskladi boje i napravi elegantnu paletu.">🎨 Boje</button>
        <button class="marijana-ai-chip" data-ai-task="Dodaj sadržaj koji nedostaje i organizuj ga pregledno.">✍️ Dopuni</button>
      </div>
      <textarea class="marijana-ai-input" placeholder="Napiši šta želiš da uradim umesto tebe…"></textarea>
      <div class="marijana-ai-actions"><button class="marijana-ai-send" type="button">✨ Uradi</button><button class="marijana-ai-fix" type="button">🔧 Analiziraj</button></div>
      <div class="marijana-ai-status">Asistent je spreman.</div>
    </div>`;
  document.body.appendChild(panel);

  const toggle=document.createElement('button');toggle.className='marijana-ai-toggle';toggle.type='button';toggle.textContent='✨ AI Asistent';document.body.appendChild(toggle);
  toggle.style.display='none';

  const input=panel.querySelector('.marijana-ai-input'),status=panel.querySelector('.marijana-ai-status');
  const setStatus=t=>{status.textContent=t};

  panel.querySelector('.marijana-ai-head button').onclick=()=>{panel.style.display='none';toggle.style.display='block'};
  toggle.onclick=()=>{toggle.style.display='none';panel.style.display='block'};
  panel.querySelectorAll('[data-ai-task]').forEach(b=>b.onclick=()=>{input.value=b.dataset.aiTask;input.focus()});

  function canvasContext(){
    return {
      mode:'canvas',
      pageFormat:document.getElementById('pageFormat')?.value||'',
      selectedId:typeof selectedId!=='undefined'?selectedId:null,
      page:typeof current==='function'?current():null
    };
  }
  function mockupContext(){
    return {
      mode:'mockup',
      scene:typeof sceneSelect!=='undefined'&&sceneSelect?sceneSelect.value:'',
      fit:typeof fitSelect!=='undefined'&&fitSelect?fitSelect.value:'',
      scale:typeof objectScale!=='undefined'?objectScale:null,
      rotation:typeof objectRotation!=='undefined'?objectRotation:null,
      x:typeof offsetX!=='undefined'?offsetX:null,
      y:typeof offsetY!=='undefined'?offsetY:null,
      perspective:typeof perspective!=='undefined'?perspective:null,
      tiltX:typeof tiltX!=='undefined'?tiltX:null,
      tiltY:typeof tiltY!=='undefined'?tiltY:null,
      activeImage:typeof activeImageIndex!=='undefined'&&typeof images!=='undefined'?images[activeImageIndex]?.name||'':''
    };
  }

  function canvasAction(a){
    if(!a||!a.type)return;
    if(a.type==='set_selected_field'&&typeof updateSelected==='function'){
      const allowed=['text','fontFamily','fontSize','fontWeight','color','highlightColor','letterSpacing','lineHeight','x','y','w','h','rotation','opacity'];
      if(allowed.includes(a.field))updateSelected(a.field,a.value);
      return;
    }
    if(a.type==='set_background'&&typeof current==='function'&&typeof snapshot==='function'){
      snapshot();current().background=a.color||'#FFFFFF';typeof render==='function'&&render();return;
    }
    if(a.type==='add_text'&&typeof addElement==='function'){
      addElement('text');const el=typeof findSelected==='function'?findSelected():null;
      if(el){snapshot();Object.assign(el,{text:a.text||'',x:a.x??el.x,y:a.y??el.y,w:a.w??el.w,h:a.h??el.h,fontSize:a.fontSize??el.fontSize,fontFamily:a.fontFamily??el.fontFamily,fontWeight:a.fontWeight??el.fontWeight,color:a.color??el.color});render();}
      return;
    }
    if(a.type==='add_element'&&typeof addDesignElement==='function'){addDesignElement(a.element);return}
    if(a.type==='fix_typography'&&typeof current==='function'&&typeof snapshot==='function'){
      snapshot();current().elements.forEach(el=>{if(el.type==='text'){const isHeading=(el.fontSize||0)>=30;el.fontFamily=isHeading?(a.headingFont||'Cormorant Garamond'):(a.bodyFont||'Montserrat')}});render();
    }
  }

  function mockupAction(a){
    if(!a||!a.type)return;
    if(a.type==='set_scene'&&typeof sceneSelect!=='undefined'&&sceneSelect){sceneSelect.value=a.scene||sceneSelect.value;sceneSelect.dispatchEvent(new Event('change',{bubbles:true}));return}
    if(a.type==='set_background'&&typeof bgColor!=='undefined'&&bgColor){bgColor.value=a.color||'#FFFFFF';bgColor.dispatchEvent(new Event('input',{bubbles:true}));return}
    if(a.type==='set_fit'&&typeof fitSelect!=='undefined'&&fitSelect){fitSelect.value=a.value||'cover';fitSelect.dispatchEvent(new Event('change',{bubbles:true}));return}
    if(a.type==='set_transform'){
      const map=[['scale',scaleRange,'objectScale'],['rotation',rotateRange,'objectRotation'],['x',positionX,'offsetX'],['y',positionY,'offsetY'],['perspective',perspectiveRange,'perspective'],['tiltX',tiltXRange,'tiltX'],['tiltY',tiltYRange,'tiltY']];
      map.forEach(([key,el])=>{if(el&&a[key]!==undefined){el.value=a[key];el.dispatchEvent(new Event('input',{bubbles:true}))}});
    }
  }

  async function run(forceFix=false){
    const message=(input.value||'').trim()||(forceFix?'Analiziraj trenutni rad i predloži i primeni najkorisnije popravke.':'');
    if(!message)return;
    setStatus('AI analizira trenutni rad…');
    panel.querySelectorAll('button').forEach(b=>b.disabled=true);
    try{
      const context=mode==='canvas'?canvasContext():mockupContext();
      const response=await fetch('/api/ai-assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,context})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||'AI asistent nije dostupan.');
      const actions=Array.isArray(data.actions)?data.actions:[];
      actions.forEach(a=>mode==='canvas'?canvasAction(a):mockupAction(a));
      setStatus((data.reply||'Gotovo.')+(actions.length?' • Primenjeno akcija: '+actions.length:''));
    }catch(e){setStatus('Greška: '+(e.message||'AI asistent trenutno nije dostupan.'))}
    finally{panel.querySelectorAll('button').forEach(b=>b.disabled=false)}
  }
  panel.querySelector('.marijana-ai-send').onclick=()=>run(false);
  panel.querySelector('.marijana-ai-fix').onclick=()=>run(true);
})();