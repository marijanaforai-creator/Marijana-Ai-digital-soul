const imageUpload=document.getElementById('imageUpload');
const mockupUploadTrigger=document.getElementById('mockupUploadTrigger');
const previewImage=document.getElementById('previewImage');
const previewVideo=document.getElementById('previewVideo');
const mockupPrompt=document.getElementById('mockupPrompt');
const applyMockupPrompt=document.getElementById('applyMockupPrompt');
const mockupPromptStatus=document.getElementById('mockupPromptStatus');
const autoRotate3D=document.getElementById('autoRotate3D');
const imageStrip=document.getElementById('imageStrip');
const uploadCount=document.getElementById('uploadCount');
const sceneSelect=document.getElementById('sceneSelect');
const templateSelect=document.getElementById('templateSelect');
const customWidth=document.getElementById('customWidth');
const customHeight=document.getElementById('customHeight');
const useCustomSize=document.getElementById('useCustomSize');
const formatSelect=document.getElementById('formatSelect');
const fitSelect=document.getElementById('fitSelect');
const perspectiveRange=document.getElementById('perspectiveRange');
const tiltXRange=document.getElementById('tiltXRange');
const tiltYRange=document.getElementById('tiltYRange');
const perspectiveValue=document.getElementById('perspectiveValue');
const tiltXValue=document.getElementById('tiltXValue');
const tiltYValue=document.getElementById('tiltYValue');
const scaleRange=document.getElementById('scaleRange');
const rotateRange=document.getElementById('rotateRange');
const positionX=document.getElementById('positionX');
const positionY=document.getElementById('positionY');
const bgColor=document.getElementById('bgColor');
const colorPrompt=document.getElementById('colorPrompt');
const applyColorPrompt=document.getElementById('applyColorPrompt');
const colorPalette=document.getElementById('colorPalette');
const colorPromptStatus=document.getElementById('colorPromptStatus');

const COLOR_PALETTE=[
  ['Ivory','#F7F3FB'],['White','#FFFFFF'],['Black','#111111'],['Charcoal','#28222F'],
  ['Champagne Gold','#C8A96B'],['Gold','#D4AF37'],['Rose Gold','#B76E79'],['Silver','#C0C0C0'],
  ['Sage Green','#8EA386'],['Deep Sage','#5F765F'],['Mint','#AAF0D1'],['Emerald','#2E8B57'],
  ['Olive','#808000'],['Forest Green','#228B22'],['Teal','#008080'],['Turquoise','#40E0D0'],
  ['Azure','#007FFF'],['Sky Blue','#87CEEB'],['Navy','#0B1F3A'],['Cobalt','#0047AB'],
  ['Royal Blue','#4169E1'],['Lavender','#B57EDC'],['Lilac','#C8A2C8'],['Purple','#6F42C1'],
  ['Plum','#5B2C6F'],['Violet','#8F00FF'],['Magenta','#C2185B'],['Fuchsia','#FF00FF'],
  ['Blush','#F4C2C2'],['Dusty Rose','#C08081'],['Terracotta','#C96F4A'],['Coral','#FF7F50'],
  ['Peach','#FFCBA4'],['Salmon','#FA8072'],['Red','#C62828'],['Burgundy','#800020'],
  ['Wine','#722F37'],['Orange','#F57C00'],['Amber','#FFBF00'],['Yellow','#F4D03F'],
  ['Cream','#FFFDD0'],['Beige','#E8DED0'],['Taupe','#8B7D6B'],['Mocha','#8B5E3C'],
  ['Cocoa','#6F4E37'],['Brown','#795548'],['Sand','#C2B280'],['Stone','#A9A9A9'],
  ['Warm Gray','#8A817C'],['Cool Gray','#7A869A'],['Graphite','#36454F'],['Slate','#708090']
];

const COLOR_ALIASES={
  'ivory':'#F7F3FB','slonova kost':'#F7F3FB','bela':'#FFFFFF','white':'#FFFFFF','crna':'#111111','black':'#111111',
  'charcoal':'#28222F','champagne gold':'#C8A96B','champagne':'#C8A96B','zlatna':'#D4AF37','gold':'#D4AF37',
  'rose gold':'#B76E79','rosegold':'#B76E79','srebrna':'#C0C0C0','silver':'#C0C0C0','sage green':'#8EA386',
  'sage':'#8EA386','zelena žalfija':'#8EA386','mint':'#AAF0D1','menta':'#AAF0D1','emerald':'#2E8B57',
  'smaragdna':'#2E8B57','olive':'#808000','maslinasta':'#808000','forest green':'#228B22','teal':'#008080',
  'tirkizna':'#40E0D0','turquoise':'#40E0D0','azure':'#007FFF','azurna':'#007FFF','sky blue':'#87CEEB',
  'svetlo plava':'#87CEEB','navy':'#0B1F3A','mornarsko plava':'#0B1F3A','cobalt':'#0047AB','kobalt':'#0047AB',
  'royal blue':'#4169E1','lavender':'#B57EDC','lavanda':'#B57EDC','lilac':'#C8A2C8','lila':'#C8A2C8',
  'purple':'#6F42C1','ljubičasta':'#6F42C1','plum':'#5B2C6F','violet':'#8F00FF','ljubičasto':'#6F42C1',
  'magenta':'#C2185B','fuchsia':'#FF00FF','blush':'#F4C2C2','dusty rose':'#C08081','terracotta':'#C96F4A',
  'terakota':'#C96F4A','coral':'#FF7F50','koralna':'#FF7F50','peach':'#FFCBA4','breskva':'#FFCBA4',
  'salmon':'#FA8072','losos':'#FA8072','red':'#C62828','crvena':'#C62828','burgundy':'#800020','bordo':'#800020',
  'wine':'#722F37','vinska':'#722F37','orange':'#F57C00','narandžasta':'#F57C00','amber':'#FFBF00','ćilibar':'#FFBF00',
  'yellow':'#F4D03F','žuta':'#F4D03F','cream':'#FFFDD0','krem':'#FFFDD0','beige':'#E8DED0','bež':'#E8DED0',
  'taupe':'#8B7D6B','mocha':'#8B5E3C','moka':'#8B5E3C','cocoa':'#6F4E37','kakao':'#6F4E37',
  'brown':'#795548','braon':'#795548','sand':'#C2B280','pesak':'#C2B280','stone':'#A9A9A9','kamen':'#A9A9A9',
  'graphite':'#36454F','grafit':'#36454F','slate':'#708090'
};

function normalizeColorPrompt(value){
  const text=String(value||'').trim().toLowerCase();
  const hex=text.match(/#[0-9a-f]{3,8}\b/i);
  if(hex)return hex[0].length===4 ? '#'+hex[0].slice(1).split('').map(x=>x+x).join('') : hex[0].slice(0,7).toUpperCase();
  const rgb=text.match(/rgba?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)/i);
  if(rgb)return rgb[0];
  const ordered=Object.keys(COLOR_ALIASES).sort((a,b)=>b.length-a.length);
  for(const name of ordered) if(text.includes(name)) return COLOR_ALIASES[name];
  return null;
}

function applyPromptColor(value){
  const color=normalizeColorPrompt(value);
  if(!color){
    if(colorPromptStatus)colorPromptStatus.textContent='Nisam prepoznala boju. Probaj naziv boje ili HEX, npr. #8EA386.';
    return false;
  }
  if(color.startsWith('#')) bgColor.value=color;
  mockupStage.style.background=color;
  if(colorPromptStatus)colorPromptStatus.textContent='Pozadina je postavljena na '+color+'.';
  return true;
}

function renderColorPalette(){
  if(!colorPalette)return;
  colorPalette.innerHTML='';
  COLOR_PALETTE.forEach(([name,color])=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='palette-swatch';
    button.title=name+' — '+color;
    button.setAttribute('aria-label',name+' '+color);
    button.style.background=color;
    button.innerHTML='<span>'+name+'</span>';
    button.onclick=()=>{
      bgColor.value=color;
      mockupStage.style.background=color;
      if(colorPrompt)colorPrompt.value=name;
      if(colorPromptStatus)colorPromptStatus.textContent='Izabrana boja: '+name+' ('+color+').';
    };
    colorPalette.appendChild(button);
  });
}

const mockupStage=document.getElementById('mockupStage');
const mockupObject=document.getElementById('mockupObject');
const sceneTitle=document.getElementById('sceneTitle');
const sceneLabel=document.getElementById('sceneLabel');
const scaleValue=document.getElementById('scaleValue');
const rotateValue=document.getElementById('rotateValue');
const positionXValue=document.getElementById('positionXValue');
const positionYValue=document.getElementById('positionYValue');
const statusText=document.getElementById('statusText');
const resetBtn=document.getElementById('resetBtn');
const downloadBtn=document.getElementById('downloadBtn');
const saveTemplateBtn=document.getElementById('saveTemplateBtn');
const myTemplatesBtn=document.getElementById('myTemplatesBtn');
const savedTemplates=document.getElementById('savedTemplates');
const templateGrid=document.getElementById('templateGrid');
const templateSearch=document.getElementById('templateSearch');
const templateCategory=document.getElementById('templateCategory');
const favoritesOnly=document.getElementById('favoritesOnly');

let images=[];
let activeImageIndex=0;
let objectScale=100;
let objectRotation=0;
let offsetX=0;
let offsetY=0;
let perspective=0;
let tiltX=0;
let tiltY=0;
let imageZoom=100;
let imageOffsetX=0;
let imageOffsetY=0;
let imageDrag=null;
const TEMPLATE_KEY='digitalSoulMockupTemplates';
const FAVORITES_KEY='digitalSoulMockupFavorites';
const libraryTemplates=[
 {id:'phone-clean',name:'Phone Clean',scene:'phone',category:'device',bg:'#E8DED0',shape:'tall'},
 {id:'laptop-business',name:'Laptop Business',scene:'laptop',category:'business',bg:'#DDE4EA',shape:'wide'},
 {id:'planner-luxury',name:'Planner Luxury',scene:'planner',category:'product',bg:'#151515',shape:'tall'},
 {id:'poster-minimal',name:'Poster Minimal',scene:'product',category:'product',bg:'#F3F1EB',shape:'tall'},
 {id:'fitness-campaign',name:'Fitness Campaign',scene:'fitness',category:'wellness',bg:'#DCE7DE',shape:'wide'},
 {id:'hotel-premium',name:'Hotel Premium',scene:'hotel',category:'business',bg:'#E5DED2',shape:'wide'},
 {id:'restaurant-menu',name:'Restaurant Menu',scene:'restaurant',category:'business',bg:'#E1D5C5',shape:'wide'},
 {id:'yoga-calm',name:'Yoga Calm',scene:'yoga',category:'wellness',bg:'#DCE7DE',shape:'wide'},
 {id:'beauty-editorial',name:'Beauty Editorial',scene:'beauty',category:'product',bg:'#E8DDE0',shape:'wide'},
 {id:'social-story',name:'Social Story',scene:'social',category:'social',bg:'#E1E7E3',shape:'tall'},
 {id:'office-pro',name:'Office Pro',scene:'office',category:'business',bg:'#D9DDD7',shape:'wide'},
 {id:'premium-product',name:'Premium Product',scene:'product',category:'product',bg:'#E8E0D2',shape:'tall'},
 {id:'packaging-studio',name:'Packaging Studio',scene:'packaging',category:'product',bg:'#D8C9B0',shape:'tall'},
 {id:'desk-creator',name:'Creator Desk',scene:'desk',category:'business',bg:'#E4D8C8',shape:'wide'},
 {id:'laptop-angle',name:'Laptop — ugao',scene:'laptop-angle',category:'3d',bg:'#F4F1EC',shape:'wide'},
 {id:'multi-device',name:'Multi-device scena',scene:'multi-device',category:'3d',bg:'#F4F1EC',shape:'wide'},
 {id:'isometric-cards',name:'Izometrijske kartice',scene:'isometric-cards',category:'3d',bg:'#F2F2F2',shape:'wide'},
 {id:'floating-cards',name:'Lebdeće kartice',scene:'floating-cards',category:'3d',bg:'#DCE7F2',shape:'wide'},
 {id:'paper-stack',name:'Složeni papiri',scene:'paper-stack',category:'3d',bg:'#E6E6E6',shape:'wide'},
 {id:'magazine-spread',name:'Magazine spread',scene:'magazine-spread',category:'3d',bg:'#D8D2C8',shape:'wide'},
 {id:'open-magazine',name:'Otvoreni magazin',scene:'open-magazine',category:'3d',bg:'#D8D2C8',shape:'wide'},
 {id:'desktop-scene',name:'Desktop scena',scene:'desktop-scene',category:'3d',bg:'#F1EEE9',shape:'wide'},
 {id:'sheet-single',name:'List — jedna stranica',scene:'sheet-single',category:'sheets',bg:'#F3F0EA',shape:'wide'},
 {id:'sheet-perspective',name:'List — perspektiva',scene:'sheet-perspective',category:'sheets',bg:'#F3F0EA',shape:'wide'},
 {id:'sheet-scattered',name:'Rasuti listovi',scene:'sheet-scattered',category:'sheets',bg:'#ECECEC',shape:'wide'},
 {id:'sheet-stack',name:'Složeni listovi',scene:'sheet-stack',category:'sheets',bg:'#E6E6E6',shape:'wide'},
 {id:'web-pages',name:'Web stranice — galerija',scene:'web-pages',category:'web',bg:'#F1F1F1',shape:'wide'},
 {id:'web-foldout',name:'Web stranice — harmonika',scene:'web-foldout',category:'web',bg:'#F4F1EC',shape:'wide'},
 {id:'document-stack',name:'Dokument — više strana',scene:'document-stack',category:'sheets',bg:'#E9E9E9',shape:'wide'},
 {id:'ebook-spread',name:'Ebook — otvorene strane',scene:'ebook-spread',category:'sheets',bg:'#DDD5C9',shape:'wide'}
];
const templateNameOverrides={
  'phone-clean':'Telefon — čisti okvir',
  'laptop-business':'Laptop — Business',
  'planner-luxury':'Planner — Luxury',
  'poster-minimal':'Poster — Minimal',
  'fitness-campaign':'Fitness — kampanja',
  'hotel-premium':'Hotel — premium',
  'restaurant-menu':'Restoran — meni',
  'yoga-calm':'Yoga — Calm',
  'beauty-editorial':'Beauty — editorial',
  'social-story':'Društvene mreže — Story',
  'office-pro':'Kancelarija — Pro',
  'premium-product':'Proizvod — premium',
  'packaging-studio':'Ambalaža — studio',
  'desk-creator':'Radni sto — Creator',
  'laptop-angle':'Laptop — ugao',
  'multi-device':'Multi-device scena',
  'isometric-cards':'Izometrijske kartice',
  'floating-cards':'Lebdeće kartice',
  'paper-stack':'Složeni papiri',
  'magazine-spread':'Otvoreni magazin — spread',
  'open-magazine':'Otvoreni magazin',
  'desktop-scene':'Desktop scena',
  'sheet-single':'List — jedna stranica',
  'sheet-perspective':'List — perspektiva',
  'sheet-scattered':'Rasuti listovi',
  'sheet-stack':'Složeni listovi',
  'web-pages':'Web stranice — galerija',
  'web-foldout':'Web stranice — harmonika',
  'document-stack':'Dokument — više strana',
  'ebook-spread':'Ebook — otvorene strane'
};
libraryTemplates.forEach(t=>{if(templateNameOverrides[t.id])t.name=templateNameOverrides[t.id];});

const libraryPalette=['#F7F3FB','#E8DED0','#F3F1EB','#151515','#DCE7DE','#DDE4EA','#E6D7C8','#E8DDE0','#DCE7F2','#EEE9DF','#E4D8C8','#E8E0D2'];
const libraryGroups=[
  {category:'sheets',count:24,prefix:'Listovi',scenes:['sheet-single','sheet-perspective','sheet-scattered','sheet-stack'],styles:['Ivory','Minimal','Editorial','Clean','Soft','Luxury','Classic','Modern']},
  {category:'sheets',count:25,prefix:'Dokumenti i ebook',scenes:['document-stack','ebook-spread','sheet-stack','sheet-perspective'],styles:['Vodič','Ebook','Priručnik','Radna sveska','Planner','Workbook','PDF prezentacija','Premium izdanje']},
  {category:'web',count:23,prefix:'Web prezentacije',scenes:['web-pages','web-foldout','laptop','multi-device'],styles:['Portfolio','Landing','Business','Studio','Minimal','Agency','Shop','Course']},
  {category:'device',count:19,prefix:'Laptop kolekcija',scenes:['laptop','laptop-angle'],styles:['Clean','Business','Creator','Agency','Minimal','Luxury','Soft','Editorial']},
  {category:'device',count:19,prefix:'Telefon kolekcija',scenes:['phone','social'],styles:['Clean','Story','App','Social','Creator','Wellness','Beauty','Business']},
  {category:'3d',count:18,prefix:'Multi-device kolekcija',scenes:['multi-device','desktop-scene','laptop-angle'],styles:['Web','App','Business','Portfolio','Course','Launch','Agency','Studio']},
  {category:'3d',count:12,prefix:'Magazin i knjiga',scenes:['magazine-spread','open-magazine','ebook-spread'],styles:['Editorial','Fashion','Business','Lifestyle','Travel','Wellness','Luxury','Minimal']},
  {category:'3d',count:15,prefix:'3D kartice',scenes:['isometric-cards','floating-cards','paper-stack'],styles:['Minimal','Luxury','Launch','Offer','Quote','Feature','Product','Brand']},
  {category:'3d',count:10,prefix:'Perspektivne kompozicije',scenes:['sheet-perspective','web-foldout','laptop-angle','isometric-cards'],styles:['Hero','Diagonal','Depth','Editorial','Modern','Premium','Soft','Bold']},
  {category:'business',count:5,prefix:'Business scena',scenes:['business','office','hotel','restaurant','desk'],styles:['Pro','Premium','Modern','Clean','Luxury']}
];

const generatedLibraryTemplates=[];
let generatedIndex=0;
libraryGroups.forEach(group=>{
  for(let i=0;i<group.count;i++){
    const style=group.styles[i%group.styles.length];
    const scene=group.scenes[i%group.scenes.length];
    generatedIndex++;
    generatedLibraryTemplates.push({
      id:'library-200-'+String(generatedIndex).padStart(3,'0'),
      name:group.prefix+' — '+style+(i>=group.styles.length?' '+(Math.floor(i/group.styles.length)+1):''),
      scene,
      category:group.category,
      bg:libraryPalette[i%libraryPalette.length],
      shape:(scene==='phone'||scene==='social'||scene==='planner')?'tall':'wide'
    });
  }
});
libraryTemplates.push(...generatedLibraryTemplates);


const sceneNames={
  phone:'Telefon',tablet:'Tablet',laptop:'Laptop',frame:'Obični Frame',planner:'Planner',poster:'Poster',
  business:'Business scena',fitness:'Fitness scena',hotel:'Hotel scena',
  restaurant:'Restoran scena',yoga:'Yoga scena',beauty:'Beauty scena',office:'Kancelarija',desk:'Radni sto',product:'Premium proizvod',packaging:'Ambalaža',social:'Social media ekran', 'laptop-angle':'Laptop — ugao', 'multi-device':'Multi-device scena', 'isometric-cards':'Izometrijske kartice', 'floating-cards':'Lebdeće kartice', 'paper-stack':'Složeni papiri', 'magazine-spread':'Magazine spread', 'open-magazine':'Otvoreni magazin', 'desktop-scene':'Desktop scena', 'sheet-single':'List — jedna stranica', 'sheet-perspective':'List — perspektiva', 'sheet-scattered':'Rasuti listovi', 'sheet-stack':'Složeni listovi', 'web-pages':'Web stranice — galerija', 'web-foldout':'Web stranice — harmonika', 'document-stack':'Dokument — više strana', 'ebook-spread':'Ebook — otvorene strane'
};

const lifestylePresets={
  office:{bg:'#D9DDD7',template:'business'},
  desk:{bg:'#E4D8C8',template:'classic'},
  product:{bg:'#E8E0D2',template:'luxury'},
  packaging:{bg:'#D8C9B0',template:'luxury'},
  social:{bg:'#E1E7E3',template:'minimal'}
};

const templatePresets={
  // Layout određuje samo izgled/boju pozadine.
  // Uređaj/scena se bira potpuno odvojeno.
  'blank-white':{bg:'#FFFFFF'},
  classic:{bg:'#E8DED0'},
  luxury:{bg:'#151515'},
  minimal:{bg:'#F3F1EB'},
  wellness:{bg:'#DCE7DE'},
  business:{bg:'#DDE4EA'}
};

const formatSizes={
  square:[1200,1200],
  portrait:[1080,1350],
  landscape:[1600,900],
  story:[1080,1920],
  pin:[1000,1500]
};

const batchSceneList=[
 ['phone','Telefon'],['laptop','Laptop'],['planner','Planner'],['poster','Poster'],
 ['business','Business scena'],['fitness','Fitness scena'],['hotel','Hotel scena'],
 ['restaurant','Restoran scena'],['yoga','Yoga scena'],['beauty','Beauty scena'],
 ['office','Kancelarija'],['desk','Radni sto'],['product','Premium proizvod'],
 ['packaging','Ambalaža'],['social','Social media ekran']
];
const batchFormatList=[
 ['square','Kvadrat 1200×1200'],['portrait','Portret 1080×1350'],
 ['landscape','Pejzaž 1600×900'],['story','Story / Reel 1080×1920'],
 ['pin','Pinterest 1000×1500']
];
function initBatchEngine(){
  const scenes=document.getElementById('batchScenes'), formats=document.getElementById('batchFormats');
  if(!scenes||!formats)return;
  scenes.innerHTML=batchSceneList.map(([id,label])=>`<label class="batch-option"><input type="checkbox" value="${id}" data-batch-scene> ${label}</label>`).join('');
  formats.innerHTML=batchFormatList.map(([id,label])=>`<label class="batch-option"><input type="checkbox" value="${id}" data-batch-format> ${label}</label>`).join('');
  document.getElementById('selectAllBatch')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.checked=true); updateBatchStatus();
  });
  document.getElementById('clearBatch')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.checked=false); updateBatchStatus();
  });
  document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.addEventListener('change',updateBatchStatus));
  document.getElementById('generateBatch')?.addEventListener('click',generateBatch);
document.getElementById('downloadBatchPngs')?.addEventListener('click',exportBatchPngs);
document.getElementById('downloadBatchZip')?.addEventListener('click',exportBatchZip);
  updateBatchStatus();
}
function getBatchSelections(){
  return {
    scenes:[...document.querySelectorAll('[data-batch-scene]:checked')].map(x=>x.value),
    formats:[...document.querySelectorAll('[data-batch-format]:checked')].map(x=>x.value)
  };
}
function updateBatchStatus(){
  const s=getBatchSelections(), el=document.getElementById('batchStatus');
  if(!el)return;
  const total=s.scenes.length*s.formats.length;
  el.textContent=total? `Biće pripremljeno ${total} mockup kombinacija.`:'Izaberi najmanje jednu scenu i jedan format.';
  el.classList.toggle('ready',!!total);
}
let lastBatch=[];
function slugify(value){return value.toLowerCase().replace(/[^a-z0-9\\u00C0-\\u017F]+/gi,'-').replace(/^-|-$/g,'');}
function getBatchImage(){
  const img=document.getElementById('previewImage');
  return img && img.src && img.src!=='about:blank' ? img : null;
}
function renderBatchCanvas(scene,format){
  const dims=formatSizes[format]||formatSizes.square;
  const size={w:dims[0],h:dims[1]};
  const canvas=document.createElement('canvas');
  canvas.width=size.w; canvas.height=size.h;
  const ctx=canvas.getContext('2d');
  const preset=lifestylePresets[scene];
  ctx.fillStyle=preset?.bg||bgColor.value||'#eee';
  ctx.fillRect(0,0,size.w,size.h);
  const img=getBatchImage();
  const scale=Math.min(size.w,size.h)*0.42;
  const iw=img?.naturalWidth||1, ih=img?.naturalHeight||1;
  const ratio=Math.min(scale/iw,scale/ih);
  const w=iw*ratio,h=ih*ratio;
  const x=(size.w-w)/2,y=(size.h-h)/2;
  if(img)ctx.drawImage(img,x,y,w,h);
  // Čist mockup bez natpisa preko donje ivice.
  return canvas;
}
function createBatchFile(scene,format){
  const canvas=renderBatchCanvas(scene,format);
  return new Promise(resolve=>canvas.toBlob(blob=>resolve({
    blob,
    name:`${slugify(sceneNames[scene]||scene)}-${slugify(format)}.png`
  }),'image/png'));
}
async function exportBatchPngs(){
  const s=getBatchSelections();
  if(!s.scenes.length||!s.formats.length){updateBatchStatus();return;}
  const files=[];
  for(const scene of s.scenes)for(const format of s.formats)files.push(await createBatchFile(scene,format));
  files.forEach(file=>{
    const url=URL.createObjectURL(file.blob);
    const a=document.createElement('a');a.href=url;a.download=file.name;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  const status=document.getElementById('batchStatus');
  if(status)status.textContent=`Preuzeto ${files.length} PNG fajlova.`;
  lastBatch=files;
}
async function exportBatchZip(){
  const s=getBatchSelections();
  if(!s.scenes.length||!s.formats.length){updateBatchStatus();return;}
  const files=[];
  for(const scene of s.scenes)for(const format of s.formats)files.push(await createBatchFile(scene,format));
  if(!window.JSZip){
    const status=document.getElementById('batchStatus');
    if(status)status.textContent='ZIP modul nije učitan. PNG export je dostupan pojedinačno.';
    return;
  }
  const zip=new JSZip();
  files.forEach(file=>zip.file(file.name,file.blob));
  const blob=await zip.generateAsync({type:'blob'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='mockup-batch.zip';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  const status=document.getElementById('batchStatus');
  if(status)status.textContent=`ZIP paket je spreman: ${files.length} PNG fajlova.`;
  lastBatch=files;
}
function generateBatch(){
  const s=getBatchSelections(), results=document.getElementById('batchResults'), status=document.getElementById('batchStatus');
  if(!s.scenes.length||!s.formats.length){updateBatchStatus();return;}
  results.innerHTML='';
  const sceneLabel=id=>(batchSceneList.find(x=>x[0]===id)||[id,id])[1];
  const formatLabel=id=>(batchFormatList.find(x=>x[0]===id)||[id,id])[1];
  s.scenes.forEach(scene=>s.formats.forEach(format=>{
    const wide=['landscape','pinterest'].includes(format);
    const card=document.createElement('div'); card.className='batch-result';
    card.innerHTML=`<div class="batch-result-preview" style="background:${lifestylePresets[scene]?.bg||'#eee'}"><div class="mini-batch-object ${wide?'wide':''}"></div></div>
      <strong>${sceneLabel(scene)}</strong><small>${formatLabel(format)}</small>`;
    results.appendChild(card);
  }));
  status.textContent=`Batch je pripremljen: ${s.scenes.length*s.formats.length} kombinacija.`;
}
function applyLibraryTemplateFromUrl(){
  const id=new URLSearchParams(location.search).get('template');
  if(!id)return;
  const t=libraryTemplates?.find(x=>x.id===id);
  if(!t)return;
  if(sceneSelect)sceneSelect.value=t.scene;
  if(bgColor)bgColor.value=t.bg;
  setScene(t.scene);
  if(statusText)statusText.textContent=`Izabran je šablon „${t.name}“ iz Biblioteke šablona.`;
}
function getFavorites(){
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');
}
let libraryVisibleCount=40;
function renderTemplateLibrary(resetVisible=true){
  if(!templateGrid)return;
  if(resetVisible)libraryVisibleCount=40;
  const query=(templateSearch?.value||'').trim().toLowerCase();
  const category=templateCategory?.value||'all';
  const onlyFavorites=favoritesOnly?.dataset.active==='true';
  const favorites=getFavorites();
  const list=libraryTemplates.filter(t=>{
    const matchesQuery=!query||t.name.toLowerCase().includes(query)||t.scene.toLowerCase().includes(query);
    const matchesCategory=category==='all'||t.category===category;
    const matchesFavorite=!onlyFavorites||favorites.includes(t.id);
    return matchesQuery&&matchesCategory&&matchesFavorite;
  });
  if(!list.length){
    templateGrid.innerHTML='<div class="template-empty">Nema šablona koji odgovaraju izboru.</div>';
    return;
  }
  const visible=list.slice(0,libraryVisibleCount);
  templateGrid.innerHTML='';
  visible.forEach(t=>{
    const card=document.createElement('article');
    card.className='template-card';
    const active=favorites.includes(t.id);
    card.innerHTML=`<div class="template-preview" style="background:${t.bg}"><div class="mini-object ${t.shape}"></div></div>
      <div class="template-meta"><div><strong>${t.name}</strong><small>${sceneNames[t.scene]||t.scene}</small></div>
      <button class="template-fav" type="button" aria-label="Favorit">${active?'♥':'♡'}</button></div>
      <button class="btn primary template-use" type="button">Koristi šablon</button>`;
    card.querySelector('.template-fav').onclick=()=>{
      const next=getFavorites().filter(id=>id!==t.id);
      if(!active)next.push(t.id);
      localStorage.setItem(FAVORITES_KEY,JSON.stringify(next));
      renderTemplateLibrary(false);
    };
    card.querySelector('.template-use').onclick=()=>{
      sceneSelect.value=t.scene;
      templateSelect.value='classic';
      bgColor.value=t.bg;
      mockupStage.style.background=t.bg;
      setScene(t.scene);
      window.scrollTo({top:document.querySelector('.mockup-workspace').offsetTop-20,behavior:'smooth'});
      statusText.textContent=`Izabran je šablon „${t.name}“.`;
    };
    templateGrid.appendChild(card);
  });
  if(list.length>visible.length){
    const more=document.createElement('button');
    more.type='button';
    more.className='btn template-load-more';
    more.textContent=`Prikaži još ${Math.min(40,list.length-visible.length)} šablona`;
    more.onclick=()=>{libraryVisibleCount+=40;renderTemplateLibrary(false);};
    templateGrid.appendChild(more);
  }
}

const PROMPT_SCENE_ALIASES=[
  ['multi-device','multi device','više uređaja','multi-device'],
  ['laptop-angle','laptop pod uglom','laptop ugao','laptop angle'],
  ['tablet','tablet','ipad'],
  ['laptop','laptop','notebook','macbook'],
  ['phone','telefon','phone','mobilni'],
  ['frame','obični frame','obicni frame','ram','okvir','frame'],
  ['planner','planner','planer'],
  ['poster','poster'],
  ['social','social media','instagram','story','reel'],
  ['sheet-single','list','stranica','jedan list'],
  ['web-pages','web stranice','web page','sajt']
];
function getPromptScene(text){
  for(const [scene,...aliases] of PROMPT_SCENE_ALIASES){
    if(aliases.some(a=>text.includes(a))) return scene;
  }
  return null;
}
function applyMockupPromptInstruction(value){
  const text=String(value||'').trim().toLowerCase();
  if(!text){
    if(mockupPromptStatus)mockupPromptStatus.textContent='Napiši instrukciju, npr. „Tablet, video, 3D rotacija, sage green pozadina“.';
    return false;
  }
  const scene=getPromptScene(text);
  const wantsVideo=/\\b(video|snimak|animacija|mp4|webm)\\b/i.test(text);
  const wants3d=/3d|rotacij|vrti|okret|perspektiv/i.test(text);
  const wantsFlat=/\\b(bez 3d|statičan|statično|obicni frame|obični frame)\\b/i.test(text);
  const color=normalizeColorPrompt(text);

  if(scene){
    sceneSelect.value=scene;
    setScene(scene);
  }
  if(color) applyPromptColor(text);
  if(wants3d && !wantsFlat){
    autoRotate3D.checked=true;
    mockupObject.classList.add('is-rotating-3d');
  }else if(wantsFlat){
    autoRotate3D.checked=false;
    mockupObject.classList.remove('is-rotating-3d');
  }
  if(wantsVideo){
    const hasVideo=images.some(x=>x.kind==='video');
    if(hasVideo){
      const idx=images.findIndex(x=>x.kind==='video');
      selectImage(idx);
    }else if(mockupPromptStatus){
      mockupPromptStatus.textContent='Instrukcija traži video. Sada ubaci MP4 ili WEBM fajl, pa će biti prikazan u sceni.';
    }
  }
  const parts=[];
  if(scene)parts.push(sceneNames[scene]);
  if(wantsVideo)parts.push('video');
  if(wants3d&&!wantsFlat)parts.push('3D rotacija');
  if(color)parts.push('pozadina '+color);
  if(!parts.length)parts.push('instrukcija primenjena na postojeća podešavanja');
  if(mockupPromptStatus)mockupPromptStatus.textContent='Primeno: '+parts.join(' · ')+'.';
  return true;
}

function updateTransform(){
  mockupObject.classList.toggle('is-rotating-3d',!!autoRotate3D?.checked);
  mockupObject.style.transform=`perspective(1200px) translate(${offsetX/2}%,${offsetY/2}%) rotateX(${tiltX}deg) rotateY(${perspective}deg) rotateZ(${tiltY}deg) scale(${objectScale/100}) rotate(${objectRotation}deg)`;
  scaleValue.textContent=`${objectScale}%`;
  rotateValue.textContent=`${objectRotation}°`;
  positionXValue.textContent=offsetX;
  positionYValue.textContent=offsetY;
  perspectiveValue.textContent=`${perspective}°`;
  tiltXValue.textContent=`${tiltX}°`;
  tiltYValue.textContent=`${tiltY}°`;
}

function renderImageStrip(){
  imageStrip.innerHTML='';
  images.forEach((item,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className=`image-thumb${index===activeImageIndex?' active':''}`;
    button.setAttribute('aria-label',`Izaberi sliku ${index+1}`);
    button.innerHTML=item.kind==='video'
      ? `<span class="video-thumb">▶ VIDEO</span><span class="thumb-index">${index+1}</span>`
      : `<img src="${item.data}" alt=""><span class="thumb-index">${index+1}</span>`;
    button.addEventListener('click',()=>selectImage(index));
    imageStrip.appendChild(button);
  });
  uploadCount.textContent=`${images.length} ${images.length===1?'slika':'slike'}`;
}

function selectImage(index){
  const item=images[index];
  if(!item)return;
  activeImageIndex=index;
  previewImage.classList.remove('mockup-suck-in');
  previewImage.style.display='none';
  if(previewVideo){previewVideo.pause();previewVideo.removeAttribute('src');previewVideo.style.display='none';}
  if(item.kind==='video'){
    if(previewVideo){
      previewVideo.src=item.data;
      previewVideo.style.display='block';
      previewVideo.play().catch(()=>{});
    }
    mockupObject.style.setProperty('--scene-image','none');
  }else{
    previewImage.src=item.data;
    previewImage.style.display='block';
    mockupObject.style.setProperty('--scene-image', `url("${item.data}")`);
  }
  imageZoom=100; imageOffsetX=0; imageOffsetY=0;
  updateImageTransform();
  // Obični Frame nema „usisavanje“ — sadržaj samo sedi unutar okvira.
  if(sceneSelect.value!=='frame' && item.kind!=='video'){
    void previewImage.offsetWidth;
    previewImage.classList.add('mockup-suck-in');
  }
  renderImageStrip();
  renderSavedTemplates();
  renderTemplateLibrary();
  statusText.textContent=`Aktivan je ${item.kind==='video'?'video':'dizajn'} ${index+1} od ${images.length}.`;
}

function updateImageTransform(){
  const transform=`translate(${imageOffsetX}px,${imageOffsetY}px) scale(${imageZoom/100})`;
  previewImage.style.transform=transform;
  if(previewVideo)previewVideo.style.transform=transform;
  previewImage.style.cursor=images.length?'grab':'default';
  if(previewVideo)previewVideo.style.cursor=images.length?'grab':'default';
}
function clampImagePosition(){
  const frame=document.querySelector('.device-screen');
  if(!frame)return;
  const maxX=Math.max(0,frame.clientWidth*(imageZoom/100-1)/2+frame.clientWidth*.25);
  const maxY=Math.max(0,frame.clientHeight*(imageZoom/100-1)/2+frame.clientHeight*.25);
  imageOffsetX=Math.max(-maxX,Math.min(maxX,imageOffsetX));
  imageOffsetY=Math.max(-maxY,Math.min(maxY,imageOffsetY));
}
function initDirectImageControls(){
  if(!previewImage)return;
  previewImage.addEventListener('pointerdown',e=>{
    if(!images.length)return;
    e.preventDefault();
    previewImage.setPointerCapture?.(e.pointerId);
    imageDrag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:imageOffsetX,baseY:imageOffsetY};
    previewImage.style.cursor='grabbing';
  });
  previewImage.addEventListener('pointermove',e=>{
    if(!imageDrag||imageDrag.pointerId!==e.pointerId)return;
    imageOffsetX=imageDrag.baseX+(e.clientX-imageDrag.startX);
    imageOffsetY=imageDrag.baseY+(e.clientY-imageDrag.startY);
    clampImagePosition();
    updateImageTransform();
  });
  const finishDrag=()=>{if(imageDrag){imageDrag=null;updateImageTransform();}};
  previewImage.addEventListener('pointerup',finishDrag);
  previewImage.addEventListener('pointercancel',finishDrag);
  previewImage.addEventListener('wheel',e=>{
    if(!images.length)return;
    e.preventDefault();
    imageZoom=Math.max(40,Math.min(220,imageZoom+(e.deltaY<0?5:-5)));
    clampImagePosition();
    updateImageTransform();
  },{passive:false});
  previewImage.title='Prevuci za pomeranje • Točkić miša za uvećanje/smanjenje';
}
function resizeImageFromHandle(e){
  if(!images.length)return;
  e.preventDefault();
  e.stopPropagation();
  const startY=e.clientY;
  const startZoom=imageZoom;
  const move=ev=>{
    imageZoom=Math.max(40,Math.min(220,startZoom+(ev.clientY-startY)*0.35));
    clampImagePosition();
    updateImageTransform();
  };
  const up=()=>{
    window.removeEventListener('pointermove',move);
    window.removeEventListener('pointerup',up);
  };
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',up);
}
function setScene(value){
  // Uređaj/scena je potpuno odvojen od Layout-a.
  // Koristimo i klasu i data atribut da izbor uređaja bude pouzdan
  // čak i kada se stilovi menjaju ili proširuju.
  const scene=sceneNames[value] ? value : 'phone';
  mockupObject.className=`mockup-object ${scene}-object`;
  mockupObject.dataset.scene=scene;
  mockupStage.className=`mockup-stage scene-${scene}`;
  mockupStage.dataset.scene=scene;
  mockupStage.classList.toggle('blank-white-layout', templateSelect?.value==='blank-white');
  sceneTitle.textContent=sceneNames[scene]||'Mockup';
  if(images[activeImageIndex]) mockupObject.style.setProperty('--scene-image', `url("${images[activeImageIndex].data}")`);

  // Nateraj browser da osveži geometriju uređaja odmah nakon promene.
  mockupObject.style.display='none';
  void mockupObject.offsetHeight;
  mockupObject.style.display='';

  if(images.length)statusText.textContent=`Slika je postavljena u scenu: ${sceneNames[scene]||scene}.`;
}

function applyTemplate(value){
  const preset=templatePresets[value]||templatePresets.classic;
  bgColor.value=preset.bg;
  mockupStage.style.background=preset.bg;
  setScene(sceneSelect.value);
  statusText.textContent=`Primenen je layout: ${templateSelect.options[templateSelect.selectedIndex].text}.`;
}

function getTemplateState(name){
  return {
    name,
    scene:sceneSelect.value, template:templateSelect.value, format:formatSelect.value,
    fit:fitSelect.value, bg:bgColor.value, scale:objectScale, rotation:objectRotation,
    x:offsetX, y:offsetY, perspective, tiltX, tiltY,
    width:Number(customWidth.value)||1200, height:Number(customHeight.value)||1200,
    custom:useCustomSize.checked
  };
}

function applyTemplateState(t){
  sceneSelect.value=t.scene||'phone';
  templateSelect.value=t.template||'classic';
  formatSelect.value=t.format||'square';
  fitSelect.value=t.fit||'cover';
  bgColor.value=t.bg||'#E8DED0';
  scaleRange.value=t.scale||100;
  rotateRange.value=t.rotation||0;
  positionX.value=t.x||0; positionY.value=t.y||0;
  perspectiveRange.value=t.perspective||0;
  tiltXRange.value=t.tiltX||0; tiltYRange.value=t.tiltY||0;
  customWidth.value=t.width||1200; customHeight.value=t.height||1200;
  useCustomSize.checked=!!t.custom;
  objectScale=Number(scaleRange.value); objectRotation=Number(rotateRange.value);
  offsetX=Number(positionX.value); offsetY=Number(positionY.value);
  perspective=Number(perspectiveRange.value); tiltX=Number(tiltXRange.value); tiltY=Number(tiltYRange.value);
  bgColor.dispatchEvent(new Event('input')); setFit(); setScene(sceneSelect.value); updateTransform();
}

function renderSavedTemplates(){
  const list=JSON.parse(localStorage.getItem(TEMPLATE_KEY)||'[]');
  savedTemplates.hidden=list.length===0;
  savedTemplates.innerHTML=list.length?'<strong>Moji sačuvani šabloni</strong>':'';
  list.forEach((t,i)=>{
    const row=document.createElement('div');
    row.className='saved-template';
    row.innerHTML=`<span>${t.name}</span><span><button type="button" data-load="${i}">Učitaj</button> <button type="button" data-delete="${i}">Obriši</button></span>`;
    row.querySelector('[data-load]').onclick=()=>{applyTemplateState(t);statusText.textContent=`Učitano: ${t.name}.`;};
    row.querySelector('[data-delete]').onclick=()=>{list.splice(i,1);localStorage.setItem(TEMPLATE_KEY,JSON.stringify(list));renderSavedTemplates();};
    savedTemplates.appendChild(row);
  });
}

function saveTemplate(){
  const name=window.prompt('Naziv šablona:',`Moj ${sceneNames[sceneSelect.value]||'mockup'}`);
  if(!name)return;
  const list=JSON.parse(localStorage.getItem(TEMPLATE_KEY)||'[]');
  list.unshift(getTemplateState(name.trim()));
  localStorage.setItem(TEMPLATE_KEY,JSON.stringify(list.slice(0,50)));
  renderSavedTemplates();
  statusText.textContent=`Šablon „${name.trim()}“ je sačuvan na ovom uređaju.`;
}

function setFit(){
  previewImage.classList.remove('fit-cover','fit-contain');
  previewImage.classList.add(`fit-${fitSelect.value}`);
  updateImageTransform();
}

function loadTransferredCanvasDesign(){
  const data=sessionStorage.getItem('marijanaMockupSource');
  if(!data)return;
  images=[{data,name:sessionStorage.getItem('marijanaMockupSourceName')||'Canvas dizajn'}];
  activeImageIndex=0;
  selectImage(0);
  statusText.textContent='Canvas dizajn je automatski prenet u 3D Mockup. Izaberi scenu i prilagodi perspektivu.';
}
function loadImages(files){
  const selected=Array.from(files).filter(file=>file.type.startsWith('image/')||file.type.startsWith('video/')).slice(0,4);
  if(!selected.length){
    statusText.textContent='Izaberi PNG, JPG, WEBP, MP4 ili WEBM fajl.';
    return;
  }
  const readers=selected.map(file=>{
    if(file.type.startsWith('video/')){
      return Promise.resolve({data:URL.createObjectURL(file),name:file.name,kind:'video',mime:file.type});
    }
    return new Promise(resolve=>{
      const reader=new FileReader();
      reader.onload=()=>resolve({data:reader.result,name:file.name,kind:'image',mime:file.type});
      reader.onerror=()=>resolve(null);
      reader.readAsDataURL(file);
    });
  });
  Promise.all(readers).then(result=>{
    images=result.filter(Boolean);
    activeImageIndex=0;
    selectImage(0);
    statusText.textContent=`Učitano je ${images.length} fajlova. Možeš izabrati aktivni sadržaj ispod upload polja.`;
  });
}

function resetAll(){
  imageUpload.value='';
  images=[];
  activeImageIndex=0;
  imageZoom=100; imageOffsetX=0; imageOffsetY=0;
  previewImage.removeAttribute('src');
  previewImage.style.display='none';
  if(previewVideo){previewVideo.pause();previewVideo.removeAttribute('src');previewVideo.load();previewVideo.style.display='none';}
  renderImageStrip();
  sceneSelect.value='phone';
  autoRotate3D.checked=false;
  templateSelect.value='blank-white';
  formatSelect.value='square';
  fitSelect.value='cover';
  scaleRange.value=100;
  rotateRange.value=0;
  positionX.value=0;
  positionY.value=0;
  bgColor.value='#E8DED0';
  objectScale=100;
  objectRotation=0;
  offsetX=0;
  offsetY=0;
  mockupStage.style.background=bgColor.value;
  setFit();
  setScene('phone');
  updateTransform();
  statusText.textContent='Prvo ubaci sliku.';
}

function roundedRect(ctx,x,y,w,h,r){
  const radius=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+radius,y);
  ctx.arcTo(x+w,y,x+w,y+h,radius);
  ctx.arcTo(x+w,y+h,x,y+h,radius);
  ctx.arcTo(x,y+h,x,y,radius);
  ctx.arcTo(x,y,x+w,y,radius);
  ctx.closePath();
}

function drawImageCover(ctx,img,x,y,w,h,fit,px,py){
  const ratio=fit==='contain'
    ? Math.min(w/img.width,h/img.height)
    : Math.max(w/img.width,h/img.height);
  const iw=img.width*ratio;
  const ih=img.height*ratio;
  const extraX=px*w*.0035;
  const extraY=py*h*.0035;
  ctx.drawImage(img,x+w/2-iw/2+extraX,y+h/2-ih/2+extraY,iw,ih);
}

function downloadMockup(){
  if(!images.length){
    statusText.textContent='Prvo ubaci sliku pre preuzimanja.';
    return;
  }

  const [presetWidth,presetHeight]=formatSizes[formatSelect.value]||formatSizes.square;
  const width=useCustomSize.checked?Math.max(300,Math.min(4000,Number(customWidth.value)||1200)):presetWidth;
  const height=useCustomSize.checked?Math.max(300,Math.min(4000,Number(customHeight.value)||1200)):presetHeight;
  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=bgColor.value;
  ctx.fillRect(0,0,width,height);

  const type=sceneSelect.value;
  const configs={
    phone:{x:width*.39,y:height*.12,w:width*.22,h:height*.58,r:30},
    laptop:{x:width*.22,y:height*.25,w:width*.56,h:height*.42,r:14},
    planner:{x:width*.33,y:height*.15,w:width*.34,h:height*.58,r:5},
    poster:{x:width*.33,y:height*.12,w:width*.34,h:height*.65,r:5},
    business:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    office:{x:width*.27,y:height*.30,w:width*.46,h:height*.40,r:10},
    desk:{x:width*.25,y:height*.30,w:width*.50,h:height*.40,r:7},
    product:{x:width*.34,y:height*.22,w:width*.32,h:height*.48,r:20},
    packaging:{x:width*.34,y:height*.17,w:width*.32,h:height*.62,r:5},
    social:{x:width*.38,y:height*.13,w:width*.24,h:height*.62,r:16},
    fitness:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    hotel:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    restaurant:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    yoga:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    beauty:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6}
  };
  const c=configs[type]||configs.phone;
  const img=new Image();

  img.onload=()=>{
    // Bez dekorativnih layout elemenata — layout scenografiju dodajemo naknadno.
    ctx.save();
    ctx.translate(c.x+c.w/2+offsetX*c.w*.0035,c.y+c.h/2+offsetY*c.h*.0035);
    ctx.rotate(objectRotation*Math.PI/180);
    const scale=objectScale/100;
    ctx.scale(scale,scale);
    ctx.shadowColor='rgba(0,0,0,.28)';
    ctx.shadowBlur=45;
    ctx.shadowOffsetY=25;
    ctx.fillStyle=type==='phone'||type==='laptop'?'#181918':'#fff';
    roundedRect(ctx,-c.w/2,-c.h/2,c.w,c.h,c.r);
    ctx.fill();
    ctx.shadowColor='transparent';

    const pad=(type==='phone'||type==='laptop')?12:0;
    ctx.save();
    roundedRect(ctx,-c.w/2+pad,-c.h/2+pad,c.w-pad*2,c.h-pad*2,Math.max(2,c.r-6));
    ctx.clip();
    drawImageCover(ctx,img,-c.w/2+pad,-c.h/2+pad,c.w-pad*2,c.h-pad*2,fitSelect.value,offsetX,offsetY);
    ctx.restore();
    ctx.restore();

    // Bez dodatnog teksta na eksportovanom mockupu.
    const link=document.createElement('a');
    link.download=`digital-soul-mockup-${type}-${formatSelect.value}.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
    statusText.textContent='Mockup je spreman za preuzimanje.';
  };
  img.src=images[activeImageIndex].data;
}

mockupUploadTrigger?.addEventListener('click',()=>imageUpload?.click());
imageUpload.addEventListener('change',e=>loadImages(e.target.files));
sceneSelect.addEventListener('change',e=>setScene(e.target.value));
templateSelect.addEventListener('change',e=>applyTemplate(e.target.value));
formatSelect.addEventListener('change',()=>{
  statusText.textContent=`Izabran format: ${formatSelect.options[formatSelect.selectedIndex].text}.`;
});
fitSelect.addEventListener('change',setFit);
scaleRange.addEventListener('input',e=>{objectScale=Number(e.target.value);updateTransform();});
rotateRange.addEventListener('input',e=>{objectRotation=Number(e.target.value);updateTransform();});
positionX.addEventListener('input',e=>{offsetX=Number(e.target.value);updateTransform();});
positionY.addEventListener('input',e=>{offsetY=Number(e.target.value);updateTransform();});
perspectiveRange.addEventListener('input',e=>{perspective=Number(e.target.value);updateTransform();});
tiltXRange.addEventListener('input',e=>{tiltX=Number(e.target.value);updateTransform();});
tiltYRange.addEventListener('input',e=>{tiltY=Number(e.target.value);updateTransform();});
bgColor.addEventListener('input',e=>{mockupStage.style.background=e.target.value;});
applyColorPrompt?.addEventListener('click',()=>applyPromptColor(colorPrompt?.value));
applyMockupPrompt?.addEventListener('click',()=>applyMockupPromptInstruction(mockupPrompt?.value));
mockupPrompt?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();applyMockupPromptInstruction(mockupPrompt.value);}});
autoRotate3D?.addEventListener('change',updateTransform);
colorPrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applyPromptColor(colorPrompt.value);}});
renderColorPalette();
resetBtn.addEventListener('click',resetAll);
saveTemplateBtn.addEventListener('click',saveTemplate);
templateSearch?.addEventListener('input',renderTemplateLibrary);
templateCategory?.addEventListener('change',renderTemplateLibrary);
favoritesOnly?.addEventListener('click',()=>{
  const active=favoritesOnly.dataset.active==='true';
  favoritesOnly.dataset.active=String(!active);
  favoritesOnly.textContent=!active?'♥ Favoriti':'♡ Favoriti';
  renderTemplateLibrary();
});
myTemplatesBtn.addEventListener('click',()=>{savedTemplates.hidden=!savedTemplates.hidden;renderSavedTemplates();});
downloadBtn.addEventListener('click',downloadMockup);

mockupStage.style.background=bgColor.value;
useCustomSize.addEventListener('change',()=>{statusText.textContent=useCustomSize.checked?'Prilagođena veličina je uključena.':'Koristi se izabrani format.';});
setFit();
updateTransform();
renderImageStrip();


function applyIncomingMockupSettings(){
  const params=new URLSearchParams(window.location.search);
  const incomingScene=params.get('scene');
  const incomingLayout=params.get('layout');
  if(incomingLayout && templateSelect && templatePresets[incomingLayout]){
    templateSelect.value=incomingLayout;
    applyTemplate(incomingLayout);
  }
  if(incomingScene && sceneNames[incomingScene]){
    sceneSelect.value=incomingScene;
    setScene(incomingScene);
  }
  if(incomingLayout==='blank-white'){
    templateSelect.value='blank-white';
    setScene(sceneSelect.value);
    mockupStage.style.background='#FFFFFF';
    bgColor.value='#FFFFFF';
  }
  if(incomingScene){
    statusText.textContent=`Gotov 3D mockup: ${sceneNames[incomingScene]||incomingScene}. Ubaci/izmeni sliku po potrebi.`;
  }
}

// Ako je dizajn poslat direktno iz Canvas Studio, automatski ga preuzmi u Mockup.
loadTransferredCanvasDesign();
applyIncomingMockupSettings();


/* Direktno prevlačenje slike na frame — slika se automatski „usisa“ u površinu. */
const mockupSurface=document.querySelector('.device-screen');
mockupSurface?.addEventListener('dragover',e=>{e.preventDefault();mockupSurface.classList.add('drop-ready');});
mockupSurface?.addEventListener('dragleave',()=>mockupSurface.classList.remove('drop-ready'));
document.querySelectorAll('.frame-resize-handle').forEach(handle=>handle.addEventListener('pointerdown',resizeImageFromHandle));
mockupSurface?.addEventListener('drop',e=>{
  e.preventDefault();
  mockupSurface.classList.remove('drop-ready');
  const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/')||f.type.startsWith('video/')).slice(0,1);
  if(files.length)loadImages(files);
});

initDirectImageControls();
updateImageTransform();
