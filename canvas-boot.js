/* Canvas Studio fallback interaction layer */
(function(){
  'use strict';
  function init(){
    if(window.__marijanaCanvasFallback) return;
    window.__marijanaCanvasFallback=true;
    const canvas=document.getElementById('canvasElements');
    const upload=document.getElementById('canvasUpload');

    function addFallback(type){
      if(window.addElement && typeof window.addElement==='function'){
        try{ window.addElement(type); return; }catch(e){}
      }
      if(!canvas) return;
      const el=document.createElement('div');
      el.className='canvas-element fallback-element';
      el.dataset.fallback='true';
      el.style.position='absolute';
      el.style.left='80px';
      el.style.top=(80 + canvas.querySelectorAll('.fallback-element').length*40)+'px';
      el.style.width=type==='circle'?'140px':'220px';
      el.style.height=type==='circle'?'140px':'120px';
      el.style.boxSizing='border-box';
      el.style.background=type==='rect'?'#8EA386':'transparent';
      el.style.border=type==='frame'?'4px solid #C8A96B':'none';
      el.style.borderRadius=type==='circle'?'50%':'12px';
      el.style.display='flex';
      el.style.alignItems='center';
      el.style.justifyContent='center';
      el.style.fontFamily='Montserrat,Arial,sans-serif';
      el.style.fontSize='18px';
      el.style.color='#28222F';
      el.style.zIndex='5';
      if(type==='frame') el.textContent='FRAME — ubaci sliku';
      else if(type==='image') el.textContent='SLIKA';
      else if(type==='circle') el.textContent='KRUG';
      else el.textContent='OBLIK';
      canvas.appendChild(el);
    }

    function toggle(id,other){
      const a=document.getElementById(id), b=document.getElementById(other);
      if(!a) return;
      a.hidden=!a.hidden;
      if(b) b.hidden=true;
    }

    document.addEventListener('click',function(e){
      const b=e.target.closest('[data-add],#openElements,#openTypography,#uploadTrigger');
      if(!b) return;

      if(b.matches('[data-add]')){
        e.preventDefault();
        const type=b.dataset.add;
        if(type==='image'){
          if(upload) upload.click();
          else addFallback('image');
        }else{
          addFallback(type);
        }
        return;
      }

      if(b.id==='openElements'){
        e.preventDefault();
        toggle('elementsPanel','typographyPanel');
        return;
      }

      if(b.id==='openTypography'){
        e.preventDefault();
        toggle('typographyPanel','elementsPanel');
        return;
      }

      if(b.id==='uploadTrigger'){
        e.preventDefault();
        if(upload) upload.click();
      }
    },true);

    window.__marijanaCanvasReady=true;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();