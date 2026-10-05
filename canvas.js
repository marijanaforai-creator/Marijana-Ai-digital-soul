const formats={square:[1200,1200],portrait:[1080,1350],story:[1080,1920],pin:[1000,1500],landscape:[1600,900],a4:[2480,3508],a5:[1748,2480],presentation:[1920,1080]};
const page=document.getElementById('canvasPage'), elementsEl=document.getElementById('canvasElements'), viewport=document.getElementById('canvasViewport');
const layersList=document.getElementById('layersList'), pagesList=document.getElementById('pagesList');
const elName=document.getElementById('elName'),elFontFamily=document.getElementById('elFontFamily'),elFontWeight=document.getElementById('elFontWeight'),elLetterSpacing=document.getElementById('elLetterSpacing'),elLineHeight=document.getElementById('elLineHeight'),elX=document.getElementById('elX'),elY=document.getElementById('elY'),elW=document.getElementById('elW'),elH=document.getElementById('elH'),elRotation=document.getElementById('elRotation'),elRotationValue=document.getElementById('elRotationValue'),elOpacity=document.getElementById('elOpacity'),elOpacityValue=document.getElementById('elOpacityValue'),elColor=document.getElementById('elColor'),elText=document.getElementById('elText'),elFontSize=document.getElementById('elFontSize');
let pages=[{id:1,name:'Stranica 1',elements:[]}],activePage=0,selectedId=null,zoom=1,nextId=1;
let history=[],future=[];

function current(){return pages[activePage]}
function snapshot(){history.push(JSON.stringify(pages));if(history.length>30)history.shift();future=[]}
function restore(data){pages=JSON.parse(data);pages.forEach(p=>p.elements.forEach(el=>{if(el.visible===undefined)el.visible=true;if(el.locked===undefined)el.locked=false}));selectedId=null;render()}
function render(){
  renderPage();renderLayers();renderPages();renderInspector();
  if(typeof bindFrameDropTargets==='function')bindFrameDropTargets();
}
function renderPage(){
  const f=formats[document.getElementById('pageFormat').value]||formats.square;
  const scale=Math.min(600/f[0],600/f[1]);
  page.style.width=f[0]*scale+'px';page.style.height=f[1]*scale+'px';
  page.dataset.baseW=f[0]*scale;page.dataset.baseH=f[1]*scale;
  page.style.transform='scale('+zoom+')';page.style.background=current().background||'#fff';
  page.classList.toggle('show-grid',document.getElementById('gridToggle').checked);
  elementsEl.innerHTML='';
  current().elements.forEach(el=>{
    const node=document.createElement('div');
    node.className='canvas-element '+(el.designKind?'design-'+el.designKind:el.type==='text'?'text-element':el.type==='rect'?'shape':el.type==='circle'?'circle':el.type==='frame'?'frame-element':el.type==='mockup'?'mockup-element':'image-element');
    if(el.id===selectedId)node.classList.add('selected');
    node.dataset.id=el.id;
    node.dataset.locked=el.locked?'true':'false';
    node.style.display=el.visible===false?'none':'';
    node.style.left=el.x+'px';node.style.top=el.y+'px';node.style.width=el.w+'px';node.style.height=el.h+'px';
    node.style.transform='rotate('+el.rotation+'deg)';node.style.opacity=el.opacity/100;
    if(el.type==='text'){node.textContent=el.text;node.style.fontSize=el.fontSize+'px';node.style.color=el.color;node.style.fontFamily=el.fontFamily||'Cormorant Garamond';node.style.fontWeight=el.fontWeight||500;node.style.letterSpacing=(el.letterSpacing||0)+'px';node.style.lineHeight=el.lineHeight||1.2}
    else if(el.type==='image'){node.innerHTML='<img src="'+el.src+'" alt="">'}
    else if(el.type==='frame'){
      node.style.background=el.src?'#fff':el.color;
      node.classList.add(el.frameShape==='circle'?'frame-circle':'frame-rect');
      if(el.src) node.innerHTML='<img class="frame-content" src="'+el.src+'" alt=""><span class="frame-placeholder">'+(el.frameShape==='circle'?'UBACI SLIKU':'UBACI SLIKU U FRAME')+'</span>';
      else node.innerHTML='<span class="frame-placeholder">＋ UBACI SLIKU</span>';
    }
    else if(el.type==='rect'||el.type==='circle'){node.style.background=el.color}
    else if(el.type==='mockup'){node.textContent='3D MOCKUP';node.style.background=el.color}
    if(el.designKind==='arrow')node.textContent='➜';
    if(el.designKind==='wave')node.textContent='〰';
    if(el.designKind==='table')node.innerHTML='<span>Naslov</span><span>Vrednost</span><span>Status</span><span>1</span><span>Primer</span><span>OK</span><span>2</span><span>Primer</span><span>OK</span><span>3</span><span>Primer</span><span>OK</span>';
    if(el.designKind==='chart')node.innerHTML='<i style="height:35%"></i><i style="height:65%"></i><i style="height:48%"></i><i style="height:82%"></i><i style="height:58%"></i>';

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
  elFontFamily.value=el.fontFamily||'Cormorant Garamond';elFontWeight.value=el.fontWeight||500;elLetterSpacing.value=el.letterSpacing||0;elLineHeight.value=el.lineHeight||1.2;
  document.getElementById('textControl').hidden=el.type!=='text';document.getElementById('fontControl').hidden=el.type!=='text';
  document.getElementById('fontControlsExtra').hidden=el.type!=='text';document.getElementById('fontControlsExtra2').hidden=el.type!=='text';
}
function findSelected(){return current().elements.find(e=>e.id===selectedId)}
function updateSelected(field,value){const el=findSelected();if(!el||el.locked)return;snapshot();el[field]=value;render()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addElement(type,src){
  snapshot();
  const n=current().elements.length;
  const isFrame=type==='frame';
  const frameShape=isFrame?'rect':'';
  const el={id:nextId++,name:type==='text'?'Tekst':type==='image'?'Slika':type==='mockup'?'Mockup':isFrame?'Frame':'Oblik',type,frameShape,visible:true,locked:false,x:80+n*15,y:80+n*15,w:type==='text'?300:type==='image'?260:type==='mockup'?280:260,h:type==='text'?90:type==='image'?260:type==='mockup'?360:isFrame?260:160,rotation:0,opacity:100,color:type==='circle'?'#C8A96B':'#B9A3E3',text:type==='text'?'Novi tekst':'',fontSize:48,fontFamily:'Cormorant Garamond',fontWeight:500,letterSpacing:0,lineHeight:1.2,src:src||''};
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
const elementsPanel=document.getElementById('elementsPanel');
const typographyPanel=document.getElementById('typographyPanel');
document.getElementById('openElements')?.addEventListener('click',()=>{elementsPanel.hidden=!elementsPanel.hidden;typographyPanel.hidden=true});
document.getElementById('openTypography')?.addEventListener('click',()=>{typographyPanel.hidden=!typographyPanel.hidden;elementsPanel.hidden=true});
function addDesignElement(kind){
 snapshot();
 const presets={
  line:{type:'rect',name:'Linija',w:320,h:4,color:'#8EA386'},
  rounded:{type:'rect',name:'Zaobljeni blok',w:300,h:150,color:'#E8EEE7'},
  pill:{type:'rect',name:'Pill',w:220,h:54,color:'#8EA386'},
  badge:{type:'text',name:'Badge',w:180,h:55,color:'#FFFFFF',text:'NOVO',fontSize:22},
  label:{type:'text',name:'Label',w:180,h:55,color:'#252522',text:'LABEL',fontSize:20},
  number:{type:'text',name:'Broj',w:100,h:70,color:'#C8A96B',text:'01',fontSize:48},
  divider:{type:'rect',name:'Divider',w:420,h:2,color:'#C8A96B'},
  button:{type:'text',name:'Dugme',w:220,h:58,color:'#FFFFFF',text:'Saznaj više',fontSize:22},
  quote:{type:'text',name:'Citat',w:380,h:100,color:'#252522',text:'Tvoja glavna poruka',fontSize:30},
  checklist:{type:'text',name:'Checklist',w:340,h:100,color:'#252522',text:'☐ Zadatak 1\n☐ Zadatak 2\n☐ Zadatak 3',fontSize:20},
  price:{type:'text',name:'Cena',w:220,h:80,color:'#C8A96B',text:'€ 00',fontSize:42},
  dotgrid:{type:'rect',name:'Mreža tačaka',w:220,h:160,color:'#F6F2EA'},
  star:{type:'text',name:'Zvezda',w:100,h:100,color:'#C8A96B',text:'✦',fontSize:70},
  spark:{type:'text',name:'Spark',w:100,h:100,color:'#C8A96B',text:'✧',fontSize:70},
  triangle:{type:'text',name:'Trougao',w:100,h:100,color:'#8EA386',text:'△',fontSize:70},
  wave:{type:'text',name:'Talas',w:260,h:80,color:'#8EA386',text:'〰',fontSize:70},
  blob:{type:'rect',name:'Blob',w:220,h:170,color:'#E8EEE7'},
  ribbon:{type:'text',name:'Traka',w:260,h:55,color:'#C8A96B',text:'ISTAKNUTO',fontSize:18},
  'photo-frame':{type:'rect',name:'Foto okvir',w:300,h:220,color:'#F7F3FB',text:'＋ FOTO',fontSize:18},
  arrow:{type:'text',name:'Strelica',w:180,h:90,color:'#7654A8',text:'➜',fontSize:64},
  callout:{type:'text',name:'Callout',w:320,h:120,color:'#28222F',text:'Važna napomena',fontSize:20},
  table:{type:'rect',name:'Tabela',w:360,h:220,color:'#FFFFFF'},
  chart:{type:'rect',name:'Grafikon',w:360,h:220,color:'#FFFFFF'},
  progress:{type:'rect',name:'Progress bar',w:320,h:28,color:'#ECE7DF'},
  checkbox:{type:'text',name:'Checkbox',w:300,h:80,color:'#28222F',text:'☐ Zadatak',fontSize:20},
  'form-field':{type:'text',name:'Polje forme',w:320,h:52,color:'#888888',text:'Unesite tekst…',fontSize:15},
  header:{type:'text',name:'Header',w:500,h:60,color:'#28222F',text:'Zaglavlje dokumenta',fontSize:20},
  footer:{type:'text',name:'Footer',w:500,h:50,color:'#28222F',text:'Podnožje dokumenta',fontSize:16},
  'page-number':{type:'text',name:'Broj stranice',w:80,h:40,color:'#7654A8',text:'01',fontSize:20},
  'brand-block':{type:'text',name:'MF Brand',w:300,h:80,color:'#FFFFFF',text:'MF  MARIJANA AI',fontSize:18},
  instagram:{type:'text',name:'Instagram',w:90,h:90,color:'#28222F',text:'◎',fontSize:64},
  facebook:{type:'text',name:'Facebook',w:90,h:90,color:'#28222F',text:'f',fontSize:64},
  youtube:{type:'text',name:'YouTube',w:100,h:70,color:'#28222F',text:'▶',fontSize:54},
  tiktok:{type:'text',name:'TikTok',w:90,h:90,color:'#28222F',text:'♪',fontSize:64},
  linkedin:{type:'text',name:'LinkedIn',w:90,h:90,color:'#28222F',text:'in',fontSize:48},
  pinterest:{type:'text',name:'Pinterest',w:90,h:90,color:'#28222F',text:'P',fontSize:60},
  threads:{type:'text',name:'Threads',w:90,h:90,color:'#28222F',text:'@',fontSize:52},
  'social-share':{type:'text',name:'Social Share',w:100,h:70,color:'#7654A8',text:'↗',fontSize:54},
  'ad-megaphone':{type:'text',name:'Megafon',w:100,h:100,color:'#C8A96B',text:'📣',fontSize:58},
  'ad-target':{type:'text',name:'Target',w:100,h:100,color:'#8EA386',text:'◎',fontSize:64},
  'ad-click':{type:'text',name:'Klik',w:100,h:100,color:'#7654A8',text:'☝',fontSize:58},
  'ad-sale':{type:'text',name:'Sale',w:110,h:70,color:'#C8A96B',text:'%',fontSize:58},
  'ad-growth':{type:'text',name:'Rast',w:100,h:90,color:'#8EA386',text:'↗',fontSize:64},
  'ad-campaign':{type:'text',name:'Kampanja',w:110,h:90,color:'#7654A8',text:'▣',fontSize:58},
  bulb:{type:'text',name:'Sijalica',w:100,h:100,color:'#C8A96B',text:'💡',fontSize:58},
  'idea-spark':{type:'text',name:'Ideja',w:100,h:100,color:'#C8A96B',text:'✦',fontSize:64},
  'ai-star':{type:'text',name:'AI',w:100,h:100,color:'#7654A8',text:'✧',fontSize:64},
  'magic-wand':{type:'text',name:'Magic',w:100,h:100,color:'#8EA386',text:'✦',fontSize:64},
  paperclip:{type:'text',name:'Spajalica',w:90,h:90,color:'#7654A8',text:'📎',fontSize:54},
  pen:{type:'text',name:'Olovka',w:90,h:90,color:'#28222F',text:'🖊',fontSize:54},
  pencil:{type:'text',name:'Grafitna olovka',w:90,h:90,color:'#28222F',text:'✎',fontSize:58},
  'notebook-icon':{type:'text',name:'Rokovnik',w:100,h:100,color:'#8EA386',text:'▤',fontSize:60},
  'folder-icon':{type:'text',name:'Fascikla',w:100,h:100,color:'#C8A96B',text:'▰',fontSize:60},
  'clipboard-icon':{type:'text',name:'Clipboard',w:100,h:100,color:'#7654A8',text:'▣',fontSize:58},
  'calendar-icon':{type:'text',name:'Kalendar',w:100,h:100,color:'#8EA386',text:'□',fontSize:60},
  stamp:{type:'text',name:'Pečat',w:100,h:100,color:'#C8A96B',text:'▣',fontSize:58},
  brush:{type:'text',name:'Brush',w:110,h:100,color:'#7654A8',text:'🖌',fontSize:58},
  money:{type:'text',name:'Novac',w:100,h:100,color:'#8EA386',text:'💰',fontSize:58},
  cash:{type:'text',name:'Novčanica',w:120,h:80,color:'#8EA386',text:'💵',fontSize:52},
  dinar:{type:'text',name:'Dinar RSD',w:120,h:80,color:'#7654A8',text:'RSD',fontSize:32},
  euro:{type:'text',name:'Evro',w:100,h:80,color:'#7654A8',text:'€',fontSize:58},
  dollar:{type:'text',name:'Dolar',w:100,h:80,color:'#8EA386',text:'
 };
 const p=presets[kind]||presets.rounded;const n=current().elements.length;
 const el={id:nextId++,visible:true,locked:false,x:80+n*10,y:80+n*10,rotation:0,opacity:100,src:'',fontSize:48,text:'',designKind:kind,...p};
 current().elements.push(el);selectedId=el.id;render();elementsPanel.hidden=true;
}
document.querySelectorAll('[data-element]').forEach(b=>b.addEventListener('click',()=>addDesignElement(b.dataset.element)));
const elementSearch=document.getElementById('elementSearch');
elementSearch?.addEventListener('input',()=>{
  const q=elementSearch.value.toLowerCase().trim();
  document.querySelectorAll('#elementsPanel .elements-category').forEach(cat=>{
    let any=false;
    cat.querySelectorAll('button[data-element]').forEach(btn=>{
      const show=!q||btn.textContent.toLowerCase().includes(q);
      btn.style.display=show?'':'none'; if(show)any=true;
    });
    cat.style.display=any?'':'none';
  });
});
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.add==='image'){canvasUpload?.click();return;} addElement(b.dataset.add); }));
const fontSearch=document.getElementById('fontSearch');
fontSearch?.addEventListener('input',()=>{
  const q=fontSearch.value.toLowerCase().trim();
  document.querySelectorAll('.font-group').forEach(group=>{
    let any=false;
    group.querySelectorAll('button[data-font]').forEach(btn=>{const show=!q||btn.dataset.font.toLowerCase().includes(q);btn.style.display=show?'':'none';if(show)any=true});
    group.style.display=any?'':'none';
  });
});
document.querySelectorAll('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{
  const el=findSelected();
  if(!el||el.type!=='text'){alert('Prvo izaberi tekstualni element.');return}
  snapshot();el.fontFamily=btn.dataset.font;render();
}));
const textStyles={
 hero:{name:'Hero naslov',fontFamily:'Playfair Display',fontSize:58,fontWeight:700,letterSpacing:-1.2,lineHeight:1.05},
 editorial:{name:'Editorial naslov',fontFamily:'Cormorant Garamond',fontSize:52,fontWeight:600,letterSpacing:-.5,lineHeight:1.05},
 subtitle:{name:'Podnaslov',fontFamily:'Montserrat',fontSize:24,fontWeight:600,letterSpacing:.4,lineHeight:1.25},
 body:{name:'Body tekst',fontFamily:'DM Sans',fontSize:18,fontWeight:400,letterSpacing:0,lineHeight:1.5},
 quote:{name:'Elegantni citat',fontFamily:'Cormorant Garamond',fontSize:34,fontWeight:500,letterSpacing:.2,lineHeight:1.25},
 caption:{name:'Mali caption',fontFamily:'Montserrat',fontSize:12,fontWeight:600,letterSpacing:1.2,lineHeight:1.3},
 cta:{name:'CTA tekst',fontFamily:'Montserrat',fontSize:18,fontWeight:700,letterSpacing:.3,lineHeight:1.1}
};
document.querySelectorAll('[data-text-style]').forEach(btn=>btn.addEventListener('click',()=>{
  const el=findSelected();
  if(!el||el.type!=='text'){alert('Prvo izaberi tekstualni element.');return}
  snapshot();Object.assign(el,textStyles[btn.dataset.textStyle]);render();
}));
document.getElementById('addTextFromTypography')?.addEventListener('click',()=>{
  addElement('text');const el=findSelected();if(el){el.fontFamily='Playfair Display';el.fontSize=42;el.fontWeight=600;el.text='Novi naslov';render()}
});
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

// Drag & drop slike direktno na Oblik, Krug ili Frame — Canva princip.
function bindFrameDropTargets(){
  document.querySelectorAll('.canvas-element.shape,.canvas-element.circle,.canvas-element.frame-element').forEach(node=>{
    node.addEventListener('dragover',e=>{e.preventDefault();node.classList.add('frame-suck-target');});
    node.addEventListener('dragleave',()=>node.classList.remove('frame-suck-target'));
    node.addEventListener('drop',e=>{
      e.preventDefault();
      node.classList.remove('frame-suck-target');
      const file=e.dataTransfer.files&&e.dataTransfer.files[0];
      if(!file||!file.type.startsWith('image/'))return;
      const id=Number(node.dataset.id);
      selectedId=id;
      const reader=new FileReader();
      reader.onload=()=>putImageIntoFrame(reader.result);
      reader.readAsDataURL(file);
    });
  });
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

[['elName','name',v=>v],['elFontFamily','fontFamily',v=>v],['elFontWeight','fontWeight',Number],['elLetterSpacing','letterSpacing',Number],['elLineHeight','lineHeight',Number],['elX','x',Number],['elY','y',Number],['elW','w',Number],['elH','h',Number],['elRotation','rotation',Number],['elOpacity','opacity',Number],['elColor','color',v=>v],['elText','text',v=>v],['elFontSize','fontSize',Number]].forEach(([id,field,fn])=>document.getElementById(id).addEventListener('change',e=>updateSelected(field,fn(e.target.value))));
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
      ctx.fillStyle=el.color;ctx.font=(el.fontWeight||500)+' '+(el.fontSize*sx)+'px '+(el.fontFamily||'Cormorant Garamond');
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
    if(el.type==='text'){ctx.fillStyle=el.color;ctx.font=(el.fontWeight||500)+' '+(el.fontSize*sx)+'px '+(el.fontFamily||'Cormorant Garamond');ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(el.text,0,0)}
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

// Učitaj layout generisan iz Layout po promptu.
function loadGeneratedLayout(){
  const raw=localStorage.getItem('marijanaGeneratedLayout'); if(!raw)return;
  try{
    const data=JSON.parse(raw); if(!data.pages?.length)return;
    const accentMap={'Ivory + Sage + Gold':'#8EA386','Black + Gold':'#C8A96B','Editorial':'#252522','Business':'#536675','Wellness':'#8EA386','Minimal Luxury':'#C8A96B'};
    const accent=accentMap[data.style]||'#8EA386';
    const fx=data.effects||{};
    const bg=fx.gradientCss||'#FFFFFF';
    pages=data.pages.map((p,i)=>{
      const elements=[
        {id:nextId++,name:'Naslov',type:'text',visible:true,locked:false,x:70,y:60,w:460,h:70,rotation:0,opacity:100,color:'#252522',text:p.title,fontSize:42,src:''},
        {id:nextId++,name:'Akcent',type:'rect',visible:true,locked:false,x:70,y:145,w:180,h:8,rotation:0,opacity:100,color:accent,text:'',fontSize:48,src:''},
        {id:nextId++,name:'Sadržaj',type:'text',visible:true,locked:false,x:70,y:185,w:460,h:120,rotation:0,opacity:100,color:'#555555',text:p.description,fontSize:20,src:''}
      ];
      if(fx.overlayColor&&fx.overlay!=='none') elements.unshift({id:nextId++,name:'Overlay',type:'rect',visible:true,locked:false,x:0,y:0,w:560,h:560,rotation:0,opacity:Number(fx.overlayOpacity||25),color:fx.overlayColor,text:'',fontSize:48,src:''});
      return {id:Date.now()+i,name:'Stranica '+p.number,elements,background:bg};
    });
    activePage=0;selectedId=null;localStorage.removeItem('marijanaGeneratedLayout');render();
  }catch(e){console.warn('Layout nije mogao da se učita',e)}
}
loadGeneratedLayout();;,fontSize:58},
  coin:{type:'text',name:'Novčić',w:90,h:90,color:'#C8A96B',text:'●',fontSize:68},
  wallet:{type:'text',name:'Novčanik',w:110,h:90,color:'#7654A8',text:'▣',fontSize:58},
  'card-icon':{type:'text',name:'Kartica',w:120,h:80,color:'#28222F',text:'▱',fontSize:60},
  bank:{type:'text',name:'Banka',w:110,h:90,color:'#28222F',text:'▥',fontSize:58},
  'chart-money':{type:'text',name:'Finansije',w:110,h:90,color:'#8EA386',text:'↗',fontSize:64},
  'envelope-icon':{type:'text',name:'Koverta',w:110,h:90,color:'#28222F',text:'✉',fontSize:58},
  email:{type:'text',name:'E-mail',w:110,h:90,color:'#7654A8',text:'✉',fontSize:58},
  'email-send':{type:'text',name:'Pošalji email',w:110,h:90,color:'#8EA386',text:'➤',fontSize:58},
  'email-inbox':{type:'text',name:'Inbox',w:110,h:90,color:'#7654A8',text:'▱',fontSize:58},
  notification:{type:'text',name:'Notifikacija',w:100,h:100,color:'#C8A96B',text:'●',fontSize:64},
  contact:{type:'text',name:'Kontakt',w:100,h:100,color:'#7654A8',text:'◎',fontSize:64},
  'phone-icon':{type:'text',name:'Telefon',w:100,h:100,color:'#8EA386',text:'☎',fontSize:58},
  message:{type:'text',name:'Poruka',w:110,h:90,color:'#7654A8',text:'▢',fontSize:58},
  avatar:{type:'text',name:'Avatar',w:100,h:100,color:'#8EA386',text:'●',fontSize:64},
  initials:{type:'text',name:'MF Inicijali',w:130,h:80,color:'#28222F',text:'MF',fontSize:42},
  'name-tag':{type:'text',name:'Ime / Tag',w:180,h:60,color:'#8EA386',text:'IME / TAG',fontSize:18},
  signature:{type:'text',name:'Potpis',w:200,h:70,color:'#28222F',text:'Marijana',fontSize:32},
  'brand-icon':{type:'text',name:'Brand ikonica',w:100,h:100,color:'#C8A96B',text:'MF',fontSize:32},
  'custom-icon':{type:'text',name:'Custom ikonica',w:100,h:100,color:'#7654A8',text:'＋',fontSize:52}
 };
 const p=presets[kind]||presets.rounded;const n=current().elements.length;
 const el={id:nextId++,visible:true,locked:false,x:80+n*10,y:80+n*10,rotation:0,opacity:100,src:'',fontSize:48,text:'',designKind:kind,...p};
 current().elements.push(el);selectedId=el.id;render();elementsPanel.hidden=true;
}
document.querySelectorAll('[data-element]').forEach(b=>b.addEventListener('click',()=>addDesignElement(b.dataset.element)));
const elementSearch=document.getElementById('elementSearch');
elementSearch?.addEventListener('input',()=>{
  const q=elementSearch.value.toLowerCase().trim();
  document.querySelectorAll('#elementsPanel .elements-category').forEach(cat=>{
    let any=false;
    cat.querySelectorAll('button[data-element]').forEach(btn=>{
      const show=!q||btn.textContent.toLowerCase().includes(q);
      btn.style.display=show?'':'none'; if(show)any=true;
    });
    cat.style.display=any?'':'none';
  });
});
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

// Drag & drop slike direktno na Oblik, Krug ili Frame — Canva princip.
function bindFrameDropTargets(){
  document.querySelectorAll('.canvas-element.shape,.canvas-element.circle,.canvas-element.frame-element').forEach(node=>{
    node.addEventListener('dragover',e=>{e.preventDefault();node.classList.add('frame-suck-target');});
    node.addEventListener('dragleave',()=>node.classList.remove('frame-suck-target'));
    node.addEventListener('drop',e=>{
      e.preventDefault();
      node.classList.remove('frame-suck-target');
      const file=e.dataTransfer.files&&e.dataTransfer.files[0];
      if(!file||!file.type.startsWith('image/'))return;
      const id=Number(node.dataset.id);
      selectedId=id;
      const reader=new FileReader();
      reader.onload=()=>putImageIntoFrame(reader.result);
      reader.readAsDataURL(file);
    });
  });
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

// Učitaj layout generisan iz Layout po promptu.
function loadGeneratedLayout(){
  const raw=localStorage.getItem('marijanaGeneratedLayout'); if(!raw)return;
  try{
    const data=JSON.parse(raw); if(!data.pages?.length)return;
    const accentMap={'Ivory + Sage + Gold':'#8EA386','Black + Gold':'#C8A96B','Editorial':'#252522','Business':'#536675','Wellness':'#8EA386','Minimal Luxury':'#C8A96B'};
    const accent=accentMap[data.style]||'#8EA386';
    const fx=data.effects||{};
    const bg=fx.gradientCss||'#FFFFFF';
    pages=data.pages.map((p,i)=>{
      const elements=[
        {id:nextId++,name:'Naslov',type:'text',visible:true,locked:false,x:70,y:60,w:460,h:70,rotation:0,opacity:100,color:'#252522',text:p.title,fontSize:42,src:''},
        {id:nextId++,name:'Akcent',type:'rect',visible:true,locked:false,x:70,y:145,w:180,h:8,rotation:0,opacity:100,color:accent,text:'',fontSize:48,src:''},
        {id:nextId++,name:'Sadržaj',type:'text',visible:true,locked:false,x:70,y:185,w:460,h:120,rotation:0,opacity:100,color:'#555555',text:p.description,fontSize:20,src:''}
      ];
      if(fx.overlayColor&&fx.overlay!=='none') elements.unshift({id:nextId++,name:'Overlay',type:'rect',visible:true,locked:false,x:0,y:0,w:560,h:560,rotation:0,opacity:Number(fx.overlayOpacity||25),color:fx.overlayColor,text:'',fontSize:48,src:''});
      return {id:Date.now()+i,name:'Stranica '+p.number,elements,background:bg};
    });
    activePage=0;selectedId=null;localStorage.removeItem('marijanaGeneratedLayout');render();
  }catch(e){console.warn('Layout nije mogao da se učita',e)}
}
loadGeneratedLayout();;