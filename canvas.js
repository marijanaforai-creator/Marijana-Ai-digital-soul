const formats={square:[1200,1200],portrait:[1080,1350],story:[1080,1920],pin:[1000,1500],landscape:[1600,900]};
const page=document.getElementById('canvasPage'), elementsEl=document.getElementById('canvasElements'), viewport=document.getElementById('canvasViewport');
const layersList=document.getElementById('layersList'), pagesList=document.getElementById('pagesList');
let pages=[{id:1,name:'Stranica 1',elements:[]}],activePage=0,selectedId=null,zoom=1,nextId=1;
let history=[],future=[];

function current(){return pages[activePage]}
function snapshot(){history.push(JSON.stringify(pages));if(history.length>30)history.shift();future=[]}
function restore(data){pages=JSON.parse(data);selectedId=null;render()}
function render(){
  renderPage();renderLayers();renderPages();renderInspector();
}
function renderPage(){
  const f=formats[document.getElementById('pageFormat').value]||formats.square;
  const scale=Math.min(600/f[0],600/f[1]);
  page.style.width=f[0]*scale+'px';page.style.height=f[1]*scale+'px';
  page.dataset.baseW=f[0];page.dataset.baseH=f[1];
  page.style.transform='scale('+zoom+')';
  page.classList.toggle('show-grid',document.getElementById('gridToggle').checked);
  elementsEl.innerHTML='';
  current().elements.forEach(el=>{
    const node=document.createElement('div');
    node.className='canvas-element '+(el.type==='text'?'text-element':el.type==='rect'?'shape':el.type==='circle'?'circle':el.type==='mockup'?'mockup-element':'image-element');
    if(el.id===selectedId)node.classList.add('selected');
    node.dataset.id=el.id;
    node.style.left=el.x+'px';node.style.top=el.y+'px';node.style.width=el.w+'px';node.style.height=el.h+'px';
    node.style.transform='rotate('+el.rotation+'deg)';node.style.opacity=el.opacity/100;
    if(el.type==='text'){node.textContent=el.text;node.style.fontSize=el.fontSize+'px';node.style.color=el.color}
    else if(el.type==='image'){node.innerHTML='<img src="'+el.src+'" alt="">'}
    else if(el.type==='rect'||el.type==='circle'){node.style.background=el.color}
    else if(el.type==='mockup'){node.textContent='3D MOCKUP';node.style.background=el.color}
    node.addEventListener('pointerdown',startDrag);
    elementsEl.appendChild(node);
  });
}
function renderLayers(){
  layersList.innerHTML='';
  [...current().elements].reverse().forEach(el=>{
    const row=document.createElement('div');row.className='layer-row '+(el.id===selectedId?'active':'');
    row.innerHTML='<span class="layer-name">'+escapeHtml(el.name)+'</span><span class="layer-actions"><button data-up>↑</button><button data-down>↓</button></span>';
    row.onclick=e=>{if(e.target.tagName==='BUTTON')return;selectedId=el.id;render()};
    row.querySelector('[data-up]').onclick=e=>{e.stopPropagation();moveLayer(el.id,1)};
    row.querySelector('[data-down]').onclick=e=>{e.stopPropagation();moveLayer(el.id,-1)};
    layersList.appendChild(row);
  });
}
function renderPages(){
  pagesList.innerHTML='';
  pages.forEach((p,i)=>{
    const row=document.createElement('div');row.className='page-row '+(i===activePage?'active':'');
    row.innerHTML='<div class="page-thumb">'+(i+1)+'</div><span>'+escapeHtml(p.name)+'</span>';
    row.onclick=()=>{activePage=i;selectedId=null;render()};
    pagesList.appendChild(row);
  });
}
function renderInspector(){
  const empty=document.getElementById('emptyInspector'), box=document.getElementById('inspector'),el=findSelected();
  empty.hidden=!!el;box.hidden=!el;if(!el)return;
  elName.value=el.name;elX.value=Math.round(el.x);elY.value=Math.round(el.y);elW.value=Math.round(el.w);elH.value=Math.round(el.h);
  elRotation.value=el.rotation;elRotationValue.value=el.rotation+'°';elOpacity.value=el.opacity;elOpacityValue.value=el.opacity+'%';elColor.value=el.color||'#8EA386';
  elText.value=el.text||'';elFontSize.value=el.fontSize||48;
  document.getElementById('textControl').hidden=el.type!=='text';document.getElementById('fontControl').hidden=el.type!=='text';
}
function findSelected(){return current().elements.find(e=>e.id===selectedId)}
function updateSelected(field,value){const el=findSelected();if(!el)return;snapshot();el[field]=value;render()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addElement(type,src){
  snapshot();
  const n=current().elements.length;
  const el={id:nextId++,name:type==='text'?'Tekst':type==='image'?'Slika':type==='mockup'?'Mockup':'Oblik',type,x:80+n*15,y:80+n*15,w:type==='text'?300:type==='image'?260:type==='mockup'?280:220,h:type==='text'?90:type==='image'?260:type==='mockup'?360:160,rotation:0,opacity:100,color:type==='circle'?'#C8A96B':'#8EA386',text:type==='text'?'Novi tekst':'',fontSize:48,src:src||''};
  current().elements.push(el);selectedId=el.id;render();
}
function moveLayer(id,delta){snapshot();const arr=current().elements,i=arr.findIndex(e=>e.id===id),j=i+delta;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];render()}
function startDrag(e){
  e.preventDefault();const id=Number(e.currentTarget.dataset.id);selectedId=id;render();
  const el=findSelected(),startX=e.clientX,startY=e.clientY,ox=el.x,oy=el.y;
  const move=ev=>{const dx=(ev.clientX-startX)/zoom,dy=(ev.clientY-startY)/zoom;el.x=ox+dx;el.y=oy+dy;if(document.getElementById('snapToggle').checked){el.x=Math.round(el.x/10)*10;el.y=Math.round(el.y/10)*10}renderPage();renderLayers();renderInspector()};
  const up=()=>{snapshot();document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);};
  document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);
}
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>addElement(b.dataset.add)));
document.getElementById('canvasUpload').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>addElement('image',r.result);r.readAsDataURL(file)});
document.getElementById('pageFormat').addEventListener('change',render);
document.getElementById('gridToggle').addEventListener('change',renderPage);
document.getElementById('zoomIn').onclick=()=>{zoom=Math.min(1.5,zoom+.1);document.getElementById('zoomValue').textContent=Math.round(zoom*100)+'%';renderPage()};
document.getElementById('zoomOut').onclick=()=>{zoom=Math.max(.5,zoom-.1);document.getElementById('zoomValue').textContent=Math.round(zoom*100)+'%';renderPage()};
document.getElementById('undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(pages));restore(history.pop())};
document.getElementById('redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(pages));restore(future.pop())};
document.getElementById('centerSelected').onclick=()=>{const el=findSelected();if(!el)return;snapshot();el.x=(Number(page.dataset.baseW)-el.w)/2;el.y=(Number(page.dataset.baseH)-el.h)/2;render()};
document.getElementById('duplicateEl').onclick=()=>{const el=findSelected();if(!el)return;snapshot();const copy=JSON.parse(JSON.stringify(el));copy.id=nextId++;copy.name=el.name+' kopija';copy.x+=20;copy.y+=20;current().elements.push(copy);selectedId=copy.id;render()};
document.getElementById('deleteEl').onclick=()=>{if(selectedId==null)return;snapshot();current().elements=current().elements.filter(e=>e.id!==selectedId);selectedId=null;render()};
document.getElementById('addPage').onclick=()=>{snapshot();pages.push({id:pages.length+1,name:'Stranica '+(pages.length+1),elements:[]});activePage=pages.length-1;selectedId=null;render()};

[['elName','name',v=>v],['elX','x',Number],['elY','y',Number],['elW','w',Number],['elH','h',Number],['elRotation','rotation',Number],['elOpacity','opacity',Number],['elColor','color',v=>v],['elText','text',v=>v],['elFontSize','fontSize',Number]].forEach(([id,field,fn])=>document.getElementById(id).addEventListener('change',e=>updateSelected(field,fn(e.target.value))));
document.getElementById('elRotation').addEventListener('input',e=>{const el=findSelected();if(!el)return;el.rotation=Number(e.target.value);document.getElementById('elRotationValue').value=el.rotation+'°';renderPage()});
document.getElementById('elOpacity').addEventListener('input',e=>{const el=findSelected();if(!el)return;el.opacity=Number(e.target.value);document.getElementById('elOpacityValue').value=el.opacity+'%';renderPage()});
document.addEventListener('keydown',e=>{if(e.key==='Delete'&&selectedId!=null&&document.activeElement.tagName!=='INPUT')document.getElementById('deleteEl').click();if(e.key==='Escape'){selectedId=null;render()}});
function exportCanvas(){
  const f=formats[document.getElementById('pageFormat').value]||formats.square,w=f[0],h=f[1],c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  const sx=w/Number(page.dataset.baseW||w),sy=h/Number(page.dataset.baseH||h);
  current().elements.forEach(el=>{ctx.save();ctx.globalAlpha=el.opacity/100;ctx.translate(el.x*sx+el.w*sx/2,el.y*sy+el.h*sy/2);ctx.rotate(el.rotation*Math.PI/180);
    if(el.type==='text'){ctx.fillStyle=el.color;ctx.font='500 '+(el.fontSize*sx)+'px Cormorant Garamond, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(el.text,0,0)}
    else if(el.type==='image'&&el.src){const img=new Image();img.src=el.src;ctx.drawImage(img,-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy)}
    else{ctx.fillStyle=el.color;ctx.beginPath();if(el.type==='circle')ctx.arc(0,0,Math.min(el.w*sx,el.h*sy)/2,0,Math.PI*2);else ctx.rect(-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy);ctx.fill()}ctx.restore()});
  const a=document.createElement('a');a.download='marijana-canvas.png';a.href=c.toDataURL('image/png');a.click();
}
document.getElementById('downloadCanvas').onclick=exportCanvas;
render();