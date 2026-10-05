/* Canvas emergency interaction bridge — keeps toolbar controls clickable even if a later Canvas handler fails. */
(function(){
  function bootCanvasControls(){
    const sidebar=document.querySelector('.left-sidebar');
    if(!sidebar || sidebar.dataset.bootBound==='true') return;
    sidebar.dataset.bootBound='true';

    sidebar.addEventListener('click',function(e){
      const btn=e.target.closest('[data-add],#openElements,#openTypography,#uploadTrigger');
      if(!btn) return;

      if(btn.dataset.add){
        e.preventDefault();
        e.stopImmediatePropagation();
        const type=btn.dataset.add;
        if(type==='image'){
          document.getElementById('canvasUpload')?.click();
        }else if(typeof window.addElement==='function'){
          window.addElement(type);
        }
        return;
      }

      if(btn.id==='openElements'){
        e.preventDefault();
        e.stopImmediatePropagation();
        const panel=document.getElementById('elementsPanel');
        const typography=document.getElementById('typographyPanel');
        if(panel){panel.hidden=!panel.hidden;}
        if(typography) typography.hidden=true;
        return;
      }

      if(btn.id==='openTypography'){
        e.preventDefault();
        e.stopImmediatePropagation();
        const panel=document.getElementById('typographyPanel');
        const elements=document.getElementById('elementsPanel');
        if(panel){panel.hidden=!panel.hidden;}
        if(elements) elements.hidden=true;
        return;
      }

      if(btn.id==='uploadTrigger'){
        e.preventDefault();
        e.stopImmediatePropagation();
        document.getElementById('canvasUpload')?.click();
      }
    },true);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bootCanvasControls,{once:true});
  }else{
    bootCanvasControls();
  }
})();