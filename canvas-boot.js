/* Canvas Studio fallback interaction layer */
(function(){
  'use strict';
  function init(){
    // canvas.js is the primary controller. Do not intercept its clicks.
    if(typeof window.addElement==='function' || window.__marijanaCanvasReady) return;
    const canvas=document.getElementById('canvasElements');
    const upload=document.getElementById('canvasUpload');
    function addFallback(type){
      if(!canvas)return;
      const el=document.createElement('div');
      el.className='canvas-element fallback-element';
      el.style.position='absolute';el.style.left='80px';el.style.top='80px';
      el.style.width=type==='circle'?'140px':'220px';el.style.height=type==='circle'?'140px':'120px';
      el.style.background=type==='rect'?'#8EA386':'transparent';
      el.style.border=type==='frame'?'4px solid #C8A96B':'none';
      el.style.borderRadius=type==='circle'?'50%':'12px';
      el.textContent=type==='frame'?'FRAME — ubaci sliku':type==='circle'?'KRUG':type==='image'?'SLIKA':'OBLIK';
      canvas.appendChild(el);
    }
    // canvas.js je glavni kontroler za sve Canvas alate.
    // Ovaj fallback više NE presreće data-add dugmad (posebno Mockup/Frame),
    // jer bi time sprečio pravi Canvas workflow.
    document.addEventListener('click',function(e){
      const b=e.target.closest('#uploadTrigger');
      if(!b)return;
      e.preventDefault();
      upload?.click();
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();