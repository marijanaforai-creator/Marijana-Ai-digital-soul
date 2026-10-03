const formats={square:[1200,1200],portrait:[1080,1350],story:[1080,1920],pin:[1000,1500],landscape:[1600,900]};
const page=document.getElementById('canvasPage'), elementsEl=document.getElementById('canvasElements'), viewport=document.getElementById('canvasViewport');
const layersList=document.getElementById('layersList'), pagesList=document.getElementById('pagesList');
const elName=document.getElementById('elName'),elX=document.getElementById('elX'),elY=document.getElementById('elY'),elW=document.getElementById('elW'),elH=document.getElementById('elH'),elRotation=document.getElementById('elRotation'),elRotationValue=document.getElementById('elRotationValue'),elOpacity=document.getElementById('elOpacity'),elOpacityValue=document.getElementById('elOpacityValue'),elColor=document.getElementById('elColor'),elText=document.getElementById('elText'),elFontSize=document.getElementById('elFontSize');
let pages=[{id:1,name:'Stranica 1',elements:[]}],activePage=0,selectedId=null,zoom=1,nextId=1;
let history=[],future=[];

function current(){return pages[activePage]}
function snapshot(){history.push(JSON.stringify(pages));if(history.length>30)history.shift();future=[]}
function restore(data){pages=JSON.parse(data);pages.forEach(p=>p.elements.forEach(el=>{if(el.visible===undefined)el.visible=true;if(el.locked===undefined)el.locked=false}));selectedId=null;render()}
function render(){
  renderPage();renderLayers();renderPages();renderInspector();
}
function renderPage(){
  const f=formats[document.getElementById('pageFormat').value]||formats.square;
  const scale=Math.min(600/f[0],600/f[1]);
  page.style.width=f[0]*scale+'px';page.style.height=f[1]*scale+'px';
  page.dataset.baseW=f[0]*scale;page.dataset.baseH=f[1]*scale;
  page.style.transform='scale('+zoom+')';
  page.classList.toggle('show-grid',document.getElementById('gridToggle').checked);
  elementsEl.innerHTML='';
  current().elements.forEach(el=>{
    const node=document.createElement('div');
    node.className='canvas-element '+(el.type==='text'?'text-element':el.type==='rect'?'shape':el.type==='circle'?'circle':el.type==='frame'?'frame-element':el.type==='mockup'?'mockup-element':'image-element');
    if(el.id===selectedId)node.classList.add('selected');
    node.dataset.id=el.id;
    node.dataset.locked=el.locked?'true':'false';
    node.style.display=el.visible===false?'none':'';
    node.style.left=el.x+'px';node.style.top=el.y+'px';node.style.width=el.w+'px';node.style.height=el.h+'px';
    node.style.transform='rotate('+el.rotation+'deg)';node.style.opacity=el.opacity/100;
    if(el.type==='text'){node.textContent=el.text;node.style.fontSize=el.fontSize+'px';node.style.color=el.color}
    else if(el.type==='image'){node.innerHTML='<img src="'+el.src+'" alt="">'}
    else if(el.type==='frame'){
      node.style.background=el.src?'#fff':el.color;
      node.classList.add(el.frameShape==='circle'?'frame-circle':'frame-rect');
      if(el.src) node.innerHTML='<img class="frame-content" src="'+el.src+'" alt=""><span class="frame-placeholder">'+(el.frameShape==='circle'?'UBACI SLIKU':'UBACI SLIKU U FRAME')+'</span>';
      else node.innerHTML='<span class="frame-placeholder">＋ UBACI SLIKU</span>';
    }
    else if(el.type==='rect'||el.type==='circle'){node.style.background=el.color}
    else if(el.type==='mockup'){node.textContent='3D MOCKUP';node.style.background=el.color}
    node.addEventListener('pointerdown',startDrag);
    elementsEl.appendChild(node);
  });
}
function renderLayers(){
  layersList.innerHTML='';
  [...current().elements].reverse().forEach(el=>{
    const row=document.createElement('div');
    row.className='layer-row '+(el.id===selectedId?'active':'')+(el.locked?' locked':'')+(el.visible===false?' hidden-layer':'');
    row.innerHTML=`<button class="layer-visibility" title="${el.visible===false?'Prikaži':'Sakrij'}">${el.visible===false?'○':'●'}</button><span class="layer-name" title="Dvoklik za preimenovanje">${escapeHtml(el.name)}</span><span class="layer-actions"><button data-up title="Pomeri gore">↑</button><button data-down title="Pomeri dole">↓</button><button data-lock title="${el.locked?'Otključaj':'Zaključaj'}">${el.locked?'🔒':'🔓'}</button></span>`;
    row.onclick=e=>{if(e.target.tagName==='BUTTON')return;if(el.visible===false)return;selectedId=el.id;render()};
    row.querySelector('.layer-visibility').onclick=e=>{e.stopPropagation();snapshot();el.visible=el.visible===false;render()};
    row.querySelector('[data-lock]').onclick=e=>{e.stopPropagation();snapshot();el.locked=!el.locked;render()};
    row.querySelector('[data-up]').onclick=e=>{e.stopPropagation();moveLayer(el.id,1)};
    row.querySelector('[data-down]').onclick=e=>{e.stopPropagation();moveLayer(el.id,-1)};
    row.querySelector('.layer-name').ondblclick=e=>{
      e.stopPropagation();
      const name=prompt('Naziv sloja:',el.name);
      if(name&&name.trim()){snapshot();el.name=name.trim();render()}
    };
    layersList.appendChild(row);
  });
}
function renderPages(){
  pagesList.innerHTML='';
  pages.forEach((p,i)=>{
    const row=document.createElement('div');
    row.className='page-row '+(i===activePage?'active':'');
    row.innerHTML=`<div class="page-thumb">${i+1}</div><span class="page-name" title="Dvoklik za preimenovanje">${escapeHtml(p.name)}</span><span class="page-actions"><button data-page-up title="Pomeri gore">↑</button><button data-page-down title="Pomeri dole">↓</button><button data-page-copy title="Dupliraj">＋</button><button data-page-delete title="Obriši">×</button></span>`;
    row.onclick=e=>{if(e.target.tagName==='BUTTON'||e.target.classList.contains('page-name'))return;activePage=i;selectedId=null;render()};
    row.querySelector('.page-name').ondblclick=e=>{
      e.stopPropagation();
      const name=prompt('Naziv stranice:',p.name);
      if(name&&name.trim()){snapshot();p.name=name.trim();render()}
    };
    row.querySelector('[data-page-up]').onclick=e=>{e.stopPropagation();movePage(i,-1)};
    row.querySelector('[data-page-down]').onclick=e=>{e.stopPropagation();movePage(i,1)};
    row.querySelector('[data-page-copy]').onclick=e=>{e.stopPropagation();duplicatePage(i)};
    row.querySelector('[data-page-delete]').onclick=e=>{e.stopPropagation();deletePage(i)};
    pagesList.appendChild(row);
  });
}
function movePage(index,delta){
  const target=index+delta;
  if(target<0||target>=pages.length)return;
  snapshot();
  [pages[index],pages[target]]=[pages[target],pages[index]];
  if(activePage===index)activePage=target;
  else if(activePage===target)activePage=index;
  render();
}
function duplicatePage(index){
  snapshot();
  const source=pages[index];
  const copy=JSON.parse(JSON.stringify(source));
  copy.id=Date.now()+Math.random();
  copy.name=source.name+' kopija';
  copy.elements=copy.elements.map(el=>({...el,id:nextId++}));
  pages.splice(index+1,0,copy);
  activePage=index+1;selectedId=null;render();
}
function deletePage(index){
  if(pages.length===1){alert('Canvas mora imati najmanje jednu stranicu.');return}
  if(!confirm('Obrisati ovu stranicu?'))return;
  snapshot();
  pages.splice(index,1);
  if(activePage>=pages.length)activePage=pages.length-1;
  if(activePage>index)activePage--;
  selectedId=null;render();
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
function updateSelected(field,value){const el=findSelected();if(!el||el.locked)return;snapshot();el[field]=value;render()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addElement(type,src){
  snapshot();
  const n=current().elements.length;
  const isFrame=type==='frame';
  const frameShape=isFrame?'rect':'';
  const el={id:nextId++,name:type==='text'?'Tekst':type==='image'?'Slika':type==='mockup'?'Mockup':isFrame?'Frame':'Oblik',type,frameShape,visible:true,locked:false,x:80+n*15,y:80+n*15,w:type==='text'?300:type==='image'?260:type==='mockup'?280:260,h:type==='text'?90:type==='image'?260:type==='mockup'?360:isFrame?260:160,rotation:0,opacity:100,color:type==='circle'?'#C8A96B':'#B9A3E3',text:type==='text'?'Novi tekst':'',fontSize:48,src:src||''};
  current().elements.push(el);selectedId=el.id;render();
}
function moveLayer(id,delta){snapshot();const arr=current().elements,i=arr.findIndex(e=>e.id===id),j=i+delta;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];render()}
function startDrag(e){
  e.preventDefault();const id=Number(e.currentTarget.dataset.id);selectedId=id;render();
  const el=findSelected();if(!el||el.locked)return;const startX=e.clientX,startY=e.clientY,ox=el.x,oy=el.y;
  const move=ev=>{const dx=(ev.clientX-startX)/zoom,dy=(ev.clientY-startY)/zoom;el.x=ox+dx;el.y=oy+dy;if(document.getElementById('snapToggle').checked){el.x=Math.round(el.x/10)*10;el.y=Math.round(el.y/10)*10}renderPage();renderLayers();renderInspector()};
  const up=()=>{snapshot();document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);};
  document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);
}
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.add==='image'){canvasUpload?.click();return;} addElement(b.dataset.add); }));
const canvasUpload=document.getElementById('canvasUpload');
function putImageIntoFrame(src){
  const el=findSelected();
  if(!el||!['rect','circle','frame'].includes(el.type))return false;
  snapshot();
  if(el.type==='rect'){el.type='frame';el.name='Frame';el.frameShape='rect';}
  if(el.type==='circle'){el.type='frame';el.name='Frame';el.frameShape='circle';}
  el.src=src;el.color='#FFFFFF';render();
  requestAnimationFrame(()=>{const node=document.querySelector('.frame-element[data-id="'+el.id+'"] img.frame-content');if(node){node.classList.remove('frame-suck-in');void node.offsetWidth;node.classList.add('frame-suck-in')}});
  return true;
}
document.getElementById('uploadTrigger').addEventListener('click',()=>canvasUpload.click());
canvasUpload.addEventListener('change',e=>{const file=e.target.files&&e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){alert('Molimo izaberi sliku.');return;}const r=new FileReader();r.onload=()=>{if(!putImageIntoFrame(r.result))addElement('image',r.result);};r.onerror=()=>alert('Slika nije mogla da se učita.');r.readAsDataURL(file);e.target.value='';});
document.getElementById('pageFormat').addEventListener('change',render);
document.getElementById('gridToggle').addEventListener('change',renderPage);
document.getElementById('zoomIn').onclick=()=>{zoom=Math.min(1.5,zoom+.1);document.getElementById('zoomValue').textContent=Math.round(zoom*100)+'%';renderPage()};
document.getElementById('zoomOut').onclick=()=>{zoom=Math.max(.5,zoom-.1);document.getElementById('zoomValue').textContent=Math.round(zoom*100)+'%';renderPage()};
document.getElementById('undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(pages));restore(history.pop())};
document.getElementById('redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(pages));restore(future.pop())};
document.getElementById('centerSelected').onclick=()=>{const el=findSelected();if(!el)return;snapshot();el.x=(Number(page.dataset.baseW)-el.w)/2;el.y=(Number(page.dataset.baseH)-el.h)/2;render()};
document.getElementById('duplicateEl').onclick=()=>{const el=findSelected();if(!el)return;snapshot();const copy=JSON.parse(JSON.stringify(el));copy.id=nextId++;copy.name=el.name+' kopija';copy.x+=20;copy.y+=20;current().elements.push(copy);selectedId=copy.id;render()};
document.getElementById('deleteEl').onclick=()=>{if(selectedId==null)return;snapshot();current().elements=current().elements.filter(e=>e.id!==selectedId);selectedId=null;render()};
document.getElementById('addPage').onclick=()=>{snapshot();pages.push({id:Date.now()+Math.random(),name:'Stranica '+(pages.length+1),elements:[]});activePage=pages.length-1;selectedId=null;render()};

[['elName','name',v=>v],['elX','x',Number],['elY','y',Number],['elW','w',Number],['elH','h',Number],['elRotation','rotation',Number],['elOpacity','opacity',Number],['elColor','color',v=>v],['elText','text',v=>v],['elFontSize','fontSize',Number]].forEach(([id,field,fn])=>document.getElementById(id).addEventListener('change',e=>updateSelected(field,fn(e.target.value))));
document.getElementById('elRotation').addEventListener('input',e=>{const el=findSelected();if(!el)return;el.rotation=Number(e.target.value);document.getElementById('elRotationValue').value=el.rotation+'°';renderPage()});
document.getElementById('elOpacity').addEventListener('input',e=>{const el=findSelected();if(!el)return;el.opacity=Number(e.target.value);document.getElementById('elOpacityValue').value=el.opacity+'%';renderPage()});
document.addEventListener('keydown',e=>{if(e.key==='Delete'&&selectedId!=null&&document.activeElement.tagName!=='INPUT')document.getElementById('deleteEl').click();if(e.key==='Escape'){selectedId=null;render()}});
async function renderCanvasToDataURL(){
  const f=formats[document.getElementById('pageFormat').value]||formats.square;
  const w=f[0],h=f[1],c=document.createElement('canvas');c.width=w;c.height=h;
  const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  const baseW=Number(page.dataset.baseW||600),baseH=Number(page.dataset.baseH||600),sx=w/baseW,sy=h/baseH;
  const imageCache={};
  await Promise.all(current().elements.filter(el=>(el.type==='image'||el.type==='frame')&&el.src).map(el=>new Promise(resolve=>{
    const img=new Image();img.onload=()=>{imageCache[el.id]=img;resolve()};img.onerror=resolve;img.src=el.src;
  })));
  current().elements.forEach(el=>{
    ctx.save();ctx.globalAlpha=el.opacity/100;
    ctx.translate(el.x*sx+el.w*sx/2,el.y*sy+el.h*sy/2);
    ctx.rotate(el.rotation*Math.PI/180);
    if(el.type==='text'){
      ctx.fillStyle=el.color;ctx.font='500 '+(el.fontSize*sx)+'px Cormorant Garamond, serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(el.text,0,0);
    }else if((el.type==='image'||el.type==='frame')&&imageCache[el.id]){
      if(el.type==='frame'){
        ctx.beginPath();
        if(el.frameShape==='circle')ctx.arc(0,0,Math.min(el.w*sx,el.h*sy)/2,0,Math.PI*2);else ctx.rect(-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy);
        ctx.clip();
      }
      ctx.drawImage(imageCache[el.id],-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy);
    }else{
      ctx.fillStyle=el.color;ctx.beginPath();
      if(el.type==='circle')ctx.arc(0,0,Math.min(el.w*sx,el.h*sy)/2,0,Math.PI*2);
      else ctx.rect(-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy);
      ctx.fill();
    }
    ctx.restore();
  });
  return c.toDataURL('image/png');
}
async function exportCanvas(){
  const f=formats[document.getElementById('pageFormat').value]||formats.square,w=f[0],h=f[1],c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  const baseW=Number(page.dataset.baseW||600),baseH=Number(page.dataset.baseH||600),sx=w/baseW,sy=h/baseH;
  const imageCache={};
  await Promise.all(current().elements.filter(el=>(el.type==='image'||el.type==='frame')&&el.src).map(el=>new Promise(resolve=>{const img=new Image();img.onload=()=>{imageCache[el.id]=img;resolve()};img.onerror=resolve;img.src=el.src})));
  current().elements.forEach(el=>{ctx.save();ctx.globalAlpha=el.opacity/100;ctx.translate(el.x*sx+el.w*sx/2,el.y*sy+el.h*sy/2);ctx.rotate(el.rotation*Math.PI/180);
    if(el.type==='text'){ctx.fillStyle=el.color;ctx.font='500 '+(el.fontSize*sx)+'px Cormorant Garamond, serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(el.text,0,0)}
    else if((el.type==='image'||el.type==='frame')&&imageCache[el.id]){if(el.type==='frame'){ctx.beginPath();if(el.frameShape==='circle')ctx.arc(0,0,Math.min(el.w*sx,el.h*sy)/2,0,Math.PI*2);else ctx.rect(-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy);ctx.clip();}ctx.drawImage(imageCache[el.id],-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy)}
    else{ctx.fillStyle=el.color;ctx.beginPath();if(el.type==='circle')ctx.arc(0,0,Math.min(el.w*sx,el.h*sy)/2,0,Math.PI*2);else ctx.rect(-el.w*sx/2,-el.h*sy/2,el.w*sx,el.h*sy);ctx.fill()}ctx.restore()});
  const a=document.createElement('a');a.download='marijana-canvas.png';a.href=c.toDataURL('image/png');a.click();
}
document.getElementById('downloadCanvas').onclick=exportCanvas;
document.getElementById('sendToMockup').onclick=async()=>{
  const dataUrl=await renderCanvasToDataURL();
  const scene=document.getElementById('quickMockupScene')?.value||'laptop';
  try{
    sessionStorage.setItem('marijanaMockupSource',dataUrl);
    sessionStorage.setItem('marijanaMockupSourceName',current().name||'Canvas dizajn');
    window.location.href=`mockup.html?from=canvas&scene=${encodeURIComponent(scene)}&layout=blank-white`;
  }catch(err){
    alert('Dizajn je prevelik za direktan prenos. Prvo izvezi PNG pa ga ubaci u 3D Mockup.');
  }
};
render();