const imageUpload=document.getElementById('imageUpload');
const mockupUploadTrigger=document.getElementById('mockupUploadTrigger');
const previewImage=document.getElementById('previewImage');
const previewVideo=document.getElementById('previewVideo');
const mockupPrompt=document.getElementById('mockupPrompt');
const applyMockupPrompt=document.getElementById('applyMockupPrompt');

const pixabaySearch=document.getElementById('pixabaySearch');
const pixabaySearchBtn=document.getElementById('pixabaySearchBtn');
const pixabayStatus=document.getElementById('pixabayStatus');
const pixabayResults=document.getElementById('pixabayResults');

async function loadPixabayImage(hit,q){
  if(pixabayStatus)pixabayStatus.textContent='Učitavam izabranu Pixabay fotografiju…';
  try{
    const response=await fetch('/api/pixabay-image?id='+encodeURIComponent(hit.id));
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'Pixabay fotografija nije mogla da se učita.');

    const item={
      data:data.data,
      name:'Pixabay - '+(hit.tags||q||'fotografija'),
      kind:'image',
      mime:'image/jpeg',
      generated:false,
      source:'Pixabay',
      sourceUrl:data.pageURL||hit.pageURL||'',
      author:data.user||hit.user||'Pixabay'
    };

    images=[...images.filter(x=>x.source!=='Pixabay'),item].slice(-4);
    activeImageIndex=images.length-1;
    selectImage(activeImageIndex);

    const referencePrompt='Koristi ovu Pixabay fotografiju kao referencu za scenu: '+(hit.tags||q||'fotografija');
    if(mockupPrompt)mockupPrompt.value=referencePrompt;
    if(heroMockupPrompt)heroMockupPrompt.value=referencePrompt;
    if(pixabayStatus)pixabayStatus.textContent='Pixabay fotografija je ubačena u Mockup i postavljena kao aktivna slika.'+(item.author?' Autor: '+item.author+'.':'');
  }catch(error){
    if(pixabayStatus)pixabayStatus.textContent=error?.message||'Pixabay fotografija trenutno nije dostupna.';
  }
}

async function searchPixabay(){
  const q=String(pixabaySearch?.value||'').trim();
  if(!q)return;
  if(pixabaySearchBtn)pixabaySearchBtn.disabled=true;
  if(pixabayStatus)pixabayStatus.textContent='Pretražujem Pixabay…';
  try{
    const response=await fetch('/api/pixabay-search?q='+encodeURIComponent(q));
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'Pixabay pretraga nije uspela.');
    if(pixabayResults){
      pixabayResults.innerHTML='';
      data.hits.forEach(hit=>{
        const card=document.createElement('button');
        card.type='button';
        card.className='pixabay-result';
        card.title=hit.tags||'Pixabay fotografija';
        card.innerHTML='<img src="'+hit.previewURL+'" alt="">';
        card.addEventListener('click',()=>loadPixabayImage(hit,q));
        pixabayResults.appendChild(card);
      });
    }
    if(pixabayStatus)pixabayStatus.textContent=(data.total||0)+' rezultata. Izaberi fotografiju.';
  }catch(error){
    if(pixabayStatus)pixabayStatus.textContent=error?.message||'Pixabay trenutno nije dostupan.';
  }finally{
    if(pixabaySearchBtn)pixabaySearchBtn.disabled=false;
  }
}
pixabaySearchBtn?.addEventListener('click',searchPixabay);
pixabaySearch?.addEventListener('keydown',e=>{if(e.key==='Enter')searchPixabay();});

const aiQuickActions=document.querySelectorAll('[data-ai-action]');
const aiQuickPrompts={
  scene:'Napravi novu, drugačiju premium mockup scenu za moj dizajn. Zadrži moj dizajn kao glavni sadržaj i promeni samo kompoziciju/scenu.',
  background:'Promeni samo pozadinu i atmosferu scene. Zadrži moj dizajn, njegov sadržaj, proporcije i glavni objekat. Napravi elegantnu premium pozadinu.',
  device:'Promeni uređaj ili nosač mog dizajna u drugi realističan uređaj. Zadrži moj dizajn i njegov sadržaj što je moguće vernije.',
  variants:'Napravi 4 različite premium mockup varijante za moj dizajn. Svaka varijanta treba da ima drugačiju scenu, ugao kamere, kompoziciju ili okruženje, ali moj dizajn mora ostati glavni sadržaj i biti što vernije sačuvan.'
};
aiQuickActions.forEach(button=>button.addEventListener('click',async()=>{
  const action=button.dataset.aiAction;
  const prompt=aiQuickPrompts[action];
  if(!prompt)return;
  if(action==='variants'){
    const variants=[
      prompt+' Varijanta 1: elegantan studio sto, blagi ugao odozgo.',
      prompt+' Varijanta 2: moderan radni prostor, tričetvrtinski ugao sa strane.',
      prompt+' Varijanta 3: premium minimalistička scena, drugačiji raspored i dublja perspektiva.',
      prompt+' Varijanta 4: lifestyle scena sa prirodnim svetlom i drugačijim položajem uređaja.'
    ];
    for(const variant of variants){
      if(mockupPrompt)mockupPrompt.value=variant;
      if(heroMockupPrompt)heroMockupPrompt.value=variant;
      await applyMockupPromptInstruction(variant);
    }
    if(mockupPrompt)mockupPrompt.value='4 varijante su generisane. Izaberi onu koja ti se najviše dopada.';
    if(heroMockupPrompt)heroMockupPrompt.value='4 varijante su generisane. Izaberi onu koja ti se najviše dopada.';
    return;
  }
  if(mockupPrompt)mockupPrompt.value=prompt;
  if(heroMockupPrompt)heroMockupPrompt.value=prompt;
  await applyMockupPromptInstruction(prompt);
}));

const mockupPromptStatus=document.getElementById('mockupPromptStatus');
const heroMockupPrompt=document.getElementById('heroMockupPrompt');
const heroGenerateScene=document.getElementById('heroGenerateScene');
const heroPromptStatus=document.getElementById('heroPromptStatus');
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

const paletteCategory=document.getElementById('paletteCategory');
const paletteLicenseNote=document.getElementById('paletteLicenseNote');
const hexListToggle=document.getElementById('hexListToggle');
const downloadHexList=document.getElementById('downloadHexList');
const hexListDocument=document.getElementById('hexListDocument');
const hexListRows=document.getElementById('hexListRows');

const COLOR_LIBRARY=[
  ['Royal Luxury',['#111111','#2B1B2B','#6F4E7C','#C8A96B','#F7F3FB'],'luxury'],
  ['Champagne Luxe',['#F7F3EA','#E8D5B7','#C8A96B','#8B6B3F','#2B2520'],'luxury'],
  ['Black Gold',['#0F0F0F','#252525','#6B542C','#D4AF37','#FFF8E7'],'luxury'],
  ['Ivory Gold',['#FFFDF5','#F4E9D8','#DCC49A','#B58B4C','#352C22'],'luxury'],
  ['Plum Gold',['#241326','#4C275A','#79518A','#C8A96B','#F6EEDC'],'luxury'],
  ['Soft Luxury',['#F8F4EE','#E7DED2','#C9B8A5','#8E7761','#3B3027'],'luxury'],

  ['Sage Pastel',['#EAF1EA','#D5E2D5','#B9CCB9','#8EA386','#526A55'],'pastel'],
  ['Blush Pastel',['#FFF3F5','#F8DDE4','#F1BFCB','#D99AA9','#9D6674'],'pastel'],
  ['Lavender Pastel',['#F7F2FC','#E9DDF5','#D6C1EA','#BFA3D9','#80639A'],'pastel'],
  ['Peach Pastel',['#FFF6ED','#FFE1C7','#FFC8A3','#EFA47F','#B96D4E'],'pastel'],
  ['Blue Pastel',['#F1F7FC','#DDECF7','#BBD8EA','#8FBBD2','#5C8399'],'pastel'],
  ['Mint Pastel',['#F0FBF6','#D6F0E5','#B4DEC9','#88C1A6','#4F876C'],'pastel'],

  ['Warm Ivory',['#FFFDF8','#F4EEE4','#E7DCCB','#CFC0AB','#8A7A67'],'neutral'],
  ['Cool Neutral',['#FAFBFC','#E9EDF0','#C9D0D6','#8D98A2','#4A535B'],'neutral'],
  ['Stone Neutral',['#F3F1ED','#DDD9D2','#BBB4A8','#898176','#514C45'],'neutral'],
  ['Soft Gray',['#F7F7F7','#E7E7E7','#CFCFCF','#999999','#555555'],'neutral'],
  ['Cream Taupe',['#FFFDF7','#F1E8DA','#D8C9B8','#A58F78','#5D5145'],'neutral'],
  ['Minimal White',['#FFFFFF','#F8F8F6','#EEEEEA','#D8D8D2','#222222'],'neutral'],

  ['Earth Clay',['#F2E4D5','#D8B79C','#B8795E','#81513F','#46332B'],'earth'],
  ['Forest Earth',['#E9EFE7','#C5D3C0','#8EA386','#526A55','#24382A'],'earth'],
  ['Terracotta Earth',['#FAE9DF','#EBC2A9','#C96F4A','#8F4B35','#4B2C23'],'earth'],
  ['Desert Sand',['#FFF6E4','#E8D2A8','#C2B280','#9C7C4D','#5C4630'],'earth'],
  ['Olive Earth',['#F0F0DF','#D8D8B0','#A6A65C','#707033','#39391D'],'earth'],
  ['Mocha Earth',['#F2E6DA','#D4B49A','#A97958','#6F4E37','#33231A'],'earth'],

  ['Azure Studio',['#EAF6FF','#BFE3F8','#66B9E8','#007FFF','#073B66'],'blue'],
  ['Ocean Blue',['#EAF7FA','#B8E0E8','#4CA7B8','#176B87','#0A3442'],'blue'],
  ['Navy Gold',['#EEF3F8','#AFC4D8','#486A88','#0B1F3A','#C8A96B'],'blue'],
  ['Cobalt Clean',['#F0F5FF','#C7D8FF','#6E95E8','#0047AB','#122B63'],'blue'],
  ['Sky Creative',['#F4FAFF','#D5EDFA','#9BD0ED','#4EA3D0','#23617E'],'blue'],
  ['Royal Azure',['#EEF2FF','#BFCBFF','#7185E6','#4169E1','#202F85'],'blue'],

  ['Sage Signature',['#F1F5EF','#D9E3D6','#B5C7B2','#8EA386','#536853'],'green'],
  ['Deep Green',['#EDF5EE','#BFD5C2','#6F9B73','#2E6B3A','#17391E'],'green'],
  ['Emerald Fresh',['#ECFAF1','#BDE8CC','#62C184','#2E8B57','#14502F'],'green'],
  ['Teal Calm',['#EDF9F8','#BCE7E2','#6EC2B8','#008080','#124C4A'],'green'],
  ['Olive Soft',['#F5F4E8','#DCDDAD','#B5B66B','#808000','#454500'],'green'],
  ['Mint Studio',['#F1FCF8','#CFF2E4','#AAF0D1','#58B996','#286D55'],'green'],

  ['Deep Purple',['#F4EFF9','#D8C7E6','#A889C1','#6F42C1','#35205D'],'purple'],
  ['Violet Night',['#F3EEFF','#D2C0F3','#A47BDD','#8F00FF','#3C1268'],'purple'],
  ['Lilac Editorial',['#FBF7FD','#EBDDF1','#C8A2C8','#916A99','#513A58'],'purple'],
  ['Plum Studio',['#F4EDF5','#D5BBD9','#A776AC','#5B2C6F','#301735'],'purple'],
  ['Lavender Calm',['#FBF9FF','#E7DDF8','#C9B4EC','#B57EDC','#65488A'],'purple'],
  ['Purple Gold',['#EEE9F4','#C9B9D7','#7B5B8D','#5B2C6F','#C8A96B'],'purple'],

  ['Blush Rose',['#FFF6F7','#F7DDE3','#F4C2C2','#C08081','#713D48'],'pink'],
  ['Dusty Pink',['#FAF2F4','#E8CBD2','#CFA1AD','#A86D7D','#633D49'],'pink'],
  ['Rose Gold',['#FFF5F3','#F1D0CB','#DCA39A','#B76E79','#6B3E47'],'pink'],
  ['Berry Soft',['#FFF1F5','#F4C8D5','#D97B99','#A63D63','#5B2039'],'pink'],
  ['Mauve',['#FAF3F7','#E7CDD9','#C99AAF','#986A84','#5A3B4C'],'pink'],
  ['Coral Blush',['#FFF4EF','#FFD6C9','#FFAA91','#E47763','#8B4035'],'pink'],

  ['Sunset Warm',['#FFF2E2','#FFD0A8','#FF9A62','#E65F3A','#702F28'],'warm'],
  ['Amber Cream',['#FFF9E8','#FFE6A7','#FFBF00','#D88B00','#684500'],'warm'],
  ['Peach Orange',['#FFF5E8','#FFD3A8','#FFCBA4','#F57C00','#873E00'],'warm'],
  ['Terracotta Warm',['#FFF0E8','#F3C2AA','#C96F4A','#9C4932','#51261D'],'warm'],
  ['Golden Sand',['#FFF9E9','#F3DFB0','#D5AE5A','#9D7227','#4D3914'],'warm'],
  ['Warm Red',['#FFF0EE','#F4B7AF','#D96C61','#C62828','#681A17'],'warm'],

  ['Neon Pop',['#101010','#FF00FF','#00F2FE','#B7FF00','#FFFFFF'],'bold'],
  ['Electric Violet',['#160B22','#8F00FF','#FF00FF','#00F2FE','#FFFFFF'],'bold'],
  ['Cyber Azure',['#08131F','#007FFF','#00F2FE','#B7FF00','#F7F3FB'],'bold'],
  ['Neon Sunset',['#1B0B0B','#FF3B30','#FF9500','#FF00FF','#FFE600'],'bold'],
  ['Candy Bold',['#FF4D8D','#FF8A00','#FFE600','#00D084','#6C5CE7'],'bold'],
  ['Digital Soul',['#0D0818','#3B235F','#7654A8','#C8A96B','#F7F3FB'],'bold'],

  ['Monochrome Black',['#000000','#202020','#444444','#777777','#FFFFFF'],'monochrome'],
  ['Monochrome Navy',['#06111D','#102A43','#1D4E73','#5B8DB8','#EAF4FF'],'monochrome'],
  ['Monochrome Sage',['#1D2A20','#344B39','#526A55','#8EA386','#EAF1EA'],'monochrome'],
  ['Monochrome Purple',['#20132A','#35205D','#513A58','#80639A','#EDE3F5'],'monochrome'],
  ['Monochrome Rose',['#3B1E27','#633D49','#986A84','#C08081','#F8E6EB'],'monochrome'],
  ['Monochrome Gold',['#33270E','#5C4616','#8C6B24','#C8A96B','#FFF5D9'],'monochrome']
];

const GRADIENT_LIBRARY=[
 ['Champagne Glow',['#F7F3EA','#C8A96B']],
 ['Luxury Black Gold',['#111111','#6B542C','#C8A96B']],
 ['Sage Mist',['#EAF1EA','#8EA386']],
 ['Sage Deep',['#D5E2D5','#526A55']],
 ['Lavender Dream',['#F7F2FC','#BFA3D9']],
 ['Lilac Sky',['#E9DDF5','#80639A']],
 ['Blush Sunset',['#FFF3F5','#D99AA9','#9D6674']],
 ['Peach Cream',['#FFF6ED','#FFC8A3','#EFA47F']],
 ['Azure Horizon',['#EAF6FF','#66B9E8','#007FFF']],
 ['Ocean Depth',['#B8E0E8','#176B87','#0A3442']],
 ['Emerald Flow',['#ECFAF1','#62C184','#14502F']],
 ['Teal Wave',['#EDF9F8','#6EC2B8','#008080']],
 ['Terracotta Sun',['#FAE9DF','#C96F4A','#4B2C23']],
 ['Golden Sand',['#FFF9E9','#D5AE5A','#4D3914']],
 ['Violet Electric',['#8F00FF','#FF00FF','#00F2FE']],
 ['Cyber Purple',['#160B22','#6F42C1','#00F2FE']],
 ['Rose Gold Shine',['#FFF5F3','#DCA39A','#B76E79']],
 ['Night Plum',['#241326','#5B2C6F','#C8A96B']],
 ['Ivory Fade',['#FFFFFF','#F7F3EA','#D8C9B8']],
 ['Cool Silver',['#FFFFFF','#C9D0D6','#4A535B']],
 ['Earth Blend',['#F2E4D5','#B8795E','#46332B']],
 ['Forest Fade',['#E9EFE7','#8EA386','#24382A']],
 ['Navy Luxury',['#EEF3F8','#0B1F3A','#C8A96B']],
 ['Candy Dream',['#FF8A00','#FF4D8D','#6C5CE7']],
 ['Rainbow Soft',['#FF9AA2','#FFDAC1','#E2F0CB','#B5EAD7','#C7CEEA']]
];

function renderColorLibrary(){
  if(!colorPalette)return;
  const category=paletteCategory?.value||'all';
  const items=category==='gradient'
    ? GRADIENT_LIBRARY.map(([name,colors],sourceIndex)=>({name,colors,type:'gradient',sourceIndex}))
    : COLOR_LIBRARY.map(([name,colors,cat],sourceIndex)=>({name,colors,type:'palette',category:cat,sourceIndex}))
        .filter(item=>category==='all'||item.category===category);
  colorPalette.innerHTML='';
  items.forEach(item=>{
    const unlocked=item.type==='palette' && item.sourceIndex<8;
    const button=document.createElement('button');
    button.type='button';
    button.className='palette-card '+(item.type==='gradient'?'gradient-card':'')+(unlocked?'':' locked-palette');
    button.title=unlocked ? item.name : item.name+' — Premium';
    button.setAttribute('aria-label',item.name+(unlocked?'':' — zaključano'));
    button.style.background=item.type==='gradient'
      ? `linear-gradient(135deg,${item.colors.join(',')})`
      : `linear-gradient(90deg,${item.colors.join(',')})`;
    button.innerHTML=`<span class="palette-card-name">${item.name}</span><span class="palette-card-hex">${item.colors.join(' · ')}</span>${unlocked?'':'<span class="palette-lock">🔒 Premium</span>'}`;
    button.onclick=()=>{
      if(!unlocked){
        if(colorPromptStatus)colorPromptStatus.textContent='Ova paleta je zaključana. Premium pakete i cenu određujemo kasnije.';
        return;
      }
      if(item.type==='gradient'){
        mockupStage.style.background=`linear-gradient(135deg,${item.colors.join(',')})`;
        if(colorPromptStatus)colorPromptStatus.textContent='Primenen gradient: '+item.name+'.';
      }else{
        bgColor.value=item.colors[0];
        mockupStage.style.background=item.colors[0];
        if(colorPrompt)colorPrompt.value=item.name;
        if(colorPromptStatus)colorPromptStatus.textContent='Primenjena paleta: '+item.name+'.';
      }
    };
    colorPalette.appendChild(button);
  });
}

function renderHexList(){
  if(!hexListRows)return;
  hexListRows.innerHTML='';
  COLOR_LIBRARY.forEach(([name,colors],index)=>{
    const row=document.createElement('div');
    row.className='hex-list-row '+(index<8?'':'hex-list-locked');
    row.innerHTML=`<strong>${name}</strong><span>${colors.join(' · ')}</span><em>${index<8?'OTKLJUČANO':'ZAKLJUČANO'}</em>`;
    hexListRows.appendChild(row);
  });
  const gradientHeading=document.createElement('div');
  gradientHeading.className='hex-list-section';
  gradientHeading.textContent='GRADIENTI / PRELAZI';
  hexListRows.appendChild(gradientHeading);
  GRADIENT_LIBRARY.forEach(([name,colors])=>{
    const row=document.createElement('div');
    row.className='hex-list-row hex-list-locked';
    row.innerHTML=`<strong>${name}</strong><span>${colors.join(' · ')}</span><em>ZAKLJUČANO</em>`;
    hexListRows.appendChild(row);
  });
}
renderHexList();
hexListToggle?.addEventListener('click',()=>{
  const open=hexListToggle.getAttribute('aria-expanded')==='true';
  hexListToggle.setAttribute('aria-expanded',String(!open));
  if(hexListDocument)hexListDocument.hidden=open;
});
downloadHexList?.addEventListener('click',()=>{
  const lines=['MARIJANA AI STUDIO — HEX SPISAK PALETA','','OTKLJUČANE PALETE'];
  COLOR_LIBRARY.forEach(([name,colors],index)=>{
    lines.push(`${name}: ${colors.join(' · ')}${index<8?'':' [ZAKLJUČANO]'}`);
  });
  lines.push('','GRADIENTI / PRELAZI');
  GRADIENT_LIBRARY.forEach(([name,colors])=>lines.push(`${name}: ${colors.join(' · ')} [ZAKLJUČANO]`));
  const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='marijana-ai-studio-hex-spisak.txt';a.click();
  URL.revokeObjectURL(url);
});

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
const promptScenesFolder=document.getElementById('promptScenesFolder');
const promptScenesPanel=document.getElementById('promptScenesPanel');
const libraryTab=document.getElementById('libraryTab');
const promptTab=document.getElementById('promptTab');

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
  restaurant:'Restoran scena',yoga:'Yoga scena',beauty:'Beauty scena',office:'Kancelarija',desk:'Radni sto',product:'Premium proizvod',packaging:'Ambalaža',social:'Social media ekran',
  'coffee-cup':'Čaša za kafu za poneti','travel-mug':'Termo šolja',mug:'Keramička šolja',
  'tote-bag':'Tote torba','paper-bag':'Papirna kesa',bottle:'Flaša',
  'cosmetic-jar':'Kozmetička teglica','food-box':'Kutija za hranu',pouch:'Pouch / vrećica',tshirt:'Majica',
  'laptop-angle':'Laptop — ugao', 'multi-device':'Multi-device scena', 'isometric-cards':'Izometrijske kartice', 'floating-cards':'Lebdeće kartice', 'paper-stack':'Složeni papiri', 'magazine-spread':'Magazine spread', 'open-magazine':'Otvoreni magazin', 'desktop-scene':'Desktop scena', 'sheet-single':'List — jedna stranica', 'sheet-perspective':'List — perspektiva', 'sheet-scattered':'Rasuti listovi', 'sheet-stack':'Složeni listovi', 'web-pages':'Web stranice — galerija', 'web-foldout':'Web stranice — harmonika', 'document-stack':'Dokument — više strana', 'ebook-spread':'Ebook — otvorene strane'
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

/* Interna biblioteka formata — proširena lista za Marijanin rad. */
const internalFormatLibrary=[
  ['Društvene mreže','Instagram objava',1080,1080],
  ['Društvene mreže','Instagram portret',1080,1350],
  ['Društvene mreže','Instagram Story / Reel',1080,1920],
  ['Društvene mreže','Facebook objava',1200,630],
  ['Društvene mreže','Facebook Story',1080,1920],
  ['Društvene mreže','Facebook Cover',1640,856],
  ['Društvene mreže','Facebook Event Cover',1920,1005],
  ['Društvene mreže','LinkedIn objava',1200,627],
  ['Društvene mreže','LinkedIn Cover',1584,396],
  ['Društvene mreže','LinkedIn Company Cover',1128,191],
  ['Društvene mreže','X / Twitter objava',1600,900],
  ['Društvene mreže','X / Twitter Header',1500,500],
  ['Društvene mreže','Threads objava',1080,1350],
  ['Društvene mreže','TikTok video',1080,1920],
  ['Društvene mreže','YouTube Thumbnail',1280,720],
  ['Društvene mreže','YouTube Channel Art',2560,1440],
  ['Društvene mreže','YouTube Shorts',1080,1920],
  ['Društvene mreže','Pinterest Pin',1000,1500],
  ['Društvene mreže','Pinterest Idea Pin',1080,1920],
  ['Društvene mreže','Pinterest Board Cover',600,600],
  ['Društvene mreže','Google Business Profile Cover',1024,576],
  ['Baneri i oglasi','Web leaderboard',728,90],
  ['Baneri i oglasi','Web banner',1920,600],
  ['Baneri i oglasi','Website hero banner',1920,800],
  ['Baneri i oglasi','Website hero wide',1600,600],
  ['Baneri i oglasi','Mobile web banner',1080,300],
  ['Baneri i oglasi','Display square',300,300],
  ['Baneri i oglasi','Display rectangle',300,250],
  ['Baneri i oglasi','Large rectangle',336,280],
  ['Baneri i oglasi','Half page ad',300,600],
  ['Baneri i oglasi','Wide skyscraper',160,600],
  ['Baneri i oglasi','Skyscraper',120,600],
  ['Baneri i oglasi','Billboard ad',970,250],
  ['Baneri i oglasi','Large leaderboard',970,90],
  ['Baneri i oglasi','Facebook ad landscape',1200,628],
  ['Baneri i oglasi','Facebook ad square',1080,1080],
  ['Baneri i oglasi','Instagram ad portrait',1080,1350],
  ['Baneri i oglasi','Story ad',1080,1920],
  ['Web i sajt','Homepage desktop',1440,900],
  ['Web i sajt','Homepage full width',1920,1080],
  ['Web i sajt','Landing page',1440,1200],
  ['Web i sajt','Website section',1440,800],
  ['Web i sajt','Blog header',1600,900],
  ['Web i sajt','Blog featured image',1200,630],
  ['Web i sajt','Open Graph / link preview',1200,630],
  ['Web i sajt','Email newsletter header',1200,400],
  ['Web i sajt','Website popup',600,800],
  ['Prezentacije','16:9 prezentacija',1920,1080],
  ['Prezentacije','4:3 prezentacija',1600,1200],
  ['Prezentacije','A4 prezentacija',2480,3508],
  ['Prezentacije','Presentation portrait',1080,1350],
  ['Prezentacije','LinkedIn carousel',1080,1080],
  ['Prezentacije','Square presentation',1080,1080],
  ['Dokumenti i PDF','A4 portrait',2480,3508],
  ['Dokumenti i PDF','A4 landscape',3508,2480],
  ['Dokumenti i PDF','A5 portrait',1748,2480],
  ['Dokumenti i PDF','A5 landscape',2480,1748],
  ['Dokumenti i PDF','A6 portrait',1240,1748],
  ['Dokumenti i PDF','Letter portrait',2550,3300],
  ['Dokumenti i PDF','Letter landscape',3300,2550],
  ['Dokumenti i PDF','Legal portrait',2550,4200],
  ['Dokumenti i PDF','Square PDF',2400,2400],
  ['Planeri i radne sveske','A4 planner',2480,3508],
  ['Planeri i radne sveske','A5 planner',1748,2480],
  ['Planeri i radne sveske','A6 planner',1240,1748],
  ['Planeri i radne sveske','US Letter planner',2550,3300],
  ['Planeri i radne sveske','Half Letter planner',1650,2550],
  ['Planeri i radne sveske','Daily planner portrait',1600,2400],
  ['Planeri i radne sveske','Weekly planner',1600,1200],
  ['Planeri i radne sveske','Monthly planner',1600,1200],
  ['Planeri i radne sveske','Workbook page',1600,2400],
  ['Planeri i radne sveske','Worksheet',1600,1200],
  ['Knjige i e-knjige','Ebook portrait',1600,2560],
  ['Knjige i e-knjige','Kindle-style page',1600,2560],
  ['Knjige i e-knjige','Book cover portrait',1600,2560],
  ['Knjige i e-knjige','Paperback 6×9',1800,2700],
  ['Knjige i e-knjige','Square ebook',2400,2400],
  ['Štampa','A3 portrait',3508,4961],
  ['Štampa','A3 landscape',4961,3508],
  ['Štampa','A2 portrait',4961,7016],
  ['Štampa','A2 landscape',7016,4961],
  ['Štampa','A1 portrait',7016,9933],
  ['Štampa','A1 landscape',9933,7016],
  ['Štampa','A0 portrait',9933,14043],
  ['Štampa','A0 landscape',14043,9933],
  ['Štampa','Poster 18×24 in',5400,7200],
  ['Štampa','Poster 24×36 in',7200,10800],
  ['Štampa','Flyer A5',1748,2480],
  ['Štampa','Flyer A6',1240,1748],
  ['Štampa','Business card',1050,600],
  ['Štampa','Postcard',1800,1200],
  ['Štampa','Square card',1800,1800],
  ['Štampa','Brochure tri-fold',3508,2480],
  ['Štampa','Menu A4',2480,3508],
  ['Štampa','Certificate A4',3508,2480],
  ['Štampa','Invitation 5×7 in',1500,2100],
  ['Štampa','Bookmark',900,2100],
  ['Marketing','Coupon',1500,1000],
  ['Marketing','Gift certificate',2100,1500],
  ['Marketing','Price list',1600,2400],
  ['Marketing','Media kit page',1600,2400],
  ['Marketing','Lead magnet',1600,2400],
  ['Marketing','Sales page section',1600,1000],
  ['Marketing','Product sheet',1600,2200],
  ['Email','Email header',1200,400],
  ['Email','Email banner',1200,600],
  ['Email','Email promo card',600,800],
  ['Email','Email signature banner',600,200],
  ['Video','Full HD landscape',1920,1080],
  ['Video','4K landscape',3840,2160],
  ['Video','Vertical Full HD',1080,1920],
  ['Video','Square video',1080,1080],
  ['Video','HD landscape',1280,720],
  ['E-commerce','Product image square',2000,2000],
  ['E-commerce','Product image portrait',2000,2500],
  ['E-commerce','Shop banner',1920,600],
  ['E-commerce','Product comparison',1600,1200],
  ['E-commerce','Product feature card',1200,1200],
  ['E-commerce','Marketplace listing',2000,2000],
  ['Business','Business presentation cover',1920,1080],
  ['Business','Proposal cover',1600,2400],
  ['Business','Report cover',1600,2400],
  ['Business','Invoice A4',2480,3508],
  ['Business','Letterhead A4',2480,3508],
  ['Business','Social proof card',1200,1200],
  ['Digital proizvodi','Course cover',1600,900],
  ['Digital proizvodi','Course lesson cover',1600,900],
  ['Digital proizvodi','Digital product cover',1600,2000],
  ['Digital proizvodi','Template preview',1600,1200],
  ['Digital proizvodi','Workbook cover',1600,2400],
  ['Digital proizvodi','Checklist',1600,2400],
  ['Digital proizvodi','Cheat sheet',1600,2400],
  ['Digital proizvodi','Carousel square',1080,1080],
  ['Digital proizvodi','Carousel portrait',1080,1350],
  ['Mockup i scene','Phone mockup',1080,1920],
  ['Mockup i scene','Laptop mockup',1600,1000],
  ['Mockup i scene','Tablet mockup',1200,1600],
  ['Mockup i scene','Desktop mockup',1600,1000],
  ['Mockup i scene','Magazine mockup',1600,1200],
  ['Mockup i scene','Document stack',1600,1200],
  ['Mockup i scene','3D cards',1600,1200],
  ['Mockup i scene','Packaging scene',1600,1200],
  ['Oglasi','Google Display square',300,300],
  ['Oglasi','Google Display medium rectangle',300,250],
  ['Oglasi','Google Display leaderboard',728,90],
  ['Oglasi','Google Display wide',970,250],
  ['Oglasi','Google Display half page',300,600],
  ['Oglasi','Google Ads image landscape',1200,628],
  ['Oglasi','Google Ads image square',1200,1200]
];

const batchSceneList=[
 ['phone','Telefon'],['tablet','Tablet'],['laptop','Laptop'],['frame','Obični Frame'],['planner','Planner'],['poster','Poster'],
 ['business','Business scena'],['fitness','Fitness scena'],['hotel','Hotel scena'],
 ['restaurant','Restoran scena'],['yoga','Yoga scena'],['beauty','Beauty scena'],
 ['office','Kancelarija'],['desk','Radni sto'],['product','Premium proizvod'],
 ['packaging','Ambalaža'],['social','Social media ekran'],
 ['coffee-cup','Čaša za kafu za poneti'],['travel-mug','Termo šolja'],['mug','Keramička šolja'],
 ['tote-bag','Tote torba'],['paper-bag','Papirna kesa'],['bottle','Flaša'],
 ['cosmetic-jar','Kozmetička teglica'],['food-box','Kutija za hranu'],['pouch','Pouch / vrećica'],['tshirt','Majica']
];
const batchFormatList=[
 ['square','Kvadrat 1200×1200'],['portrait','Portret 1080×1350'],
 ['landscape','Pejzaž 1600×900'],['story','Story / Reel 1080×1920'],
 ['pin','Pinterest 1000×1500']
];
const CUSTOM_FORMAT_KEY='marijanaMockupCustomFormats';
function renderInternalFormatLibrary(){
  const root=document.getElementById('internalFormatList');
  const search=document.getElementById('internalFormatSearch');
  if(!root)return;
  const q=(search?.value||'').trim().toLowerCase();
  const rows=internalFormatLibrary.filter(x=>!q||x.join(' ').toLowerCase().includes(q));
  const groups={};
  rows.forEach(x=>(groups[x[0]]??=[]).push(x));
  root.innerHTML=Object.entries(groups).map(([category,items])=>'<div class="internal-format-group"><h4>'+category+'</h4>'+items.map(x=>'<div class="internal-format-row"><span>'+x[1]+'</span><strong>'+x[2]+' × '+x[3]+' px</strong></div>').join('')+'</div>').join('') || '<div class="internal-format-empty">Nema rezultata.</div>';
}
function syncInternalFormatSizes(){
  internalFormatLibrary.forEach(([category,name,w,h])=>{
    const id='internal-'+slugify(name)+'-'+w+'x'+h;
    formatSizes[id]=[w,h];
    if(!batchFormatList.some(x=>x[0]===id)) batchFormatList.push([id,name+' '+w+'×'+h]);
  });
}
function loadCustomFormats(){
  try{
    const saved=JSON.parse(localStorage.getItem(CUSTOM_FORMAT_KEY)||'[]');
    saved.forEach(item=>{
      if(item?.id && Number(item.width)>0 && Number(item.height)>0){
        formatSizes[item.id]=[Number(item.width),Number(item.height)];
        if(!batchFormatList.some(x=>x[0]===item.id)) batchFormatList.push([item.id, item.name+' '+item.width+'×'+item.height]);
      }
    });
  }catch(e){}
}
function renderBatchFormats(){
  const formats=document.getElementById('batchFormats');
  if(!formats)return;
  formats.innerHTML=batchFormatList.map(([id,label])=>'<label class="batch-option"><input type="checkbox" value="'+id+'" data-batch-format> '+label+'</label>').join('');
  document.querySelectorAll('[data-batch-format]').forEach(x=>x.addEventListener('change',updateBatchStatus));
}
function addCustomBatchFormat(){
  const nameEl=document.getElementById('customFormatName');
  const widthEl=document.getElementById('customFormatWidth');
  const heightEl=document.getElementById('customFormatHeight');
  const name=(nameEl?.value||'').trim();
  const width=Number(widthEl?.value), height=Number(heightEl?.value);
  if(!name||!Number.isFinite(width)||!Number.isFinite(height)||width<100||height<100){
    if(nameEl)nameEl.focus();
    return;
  }
  const id='custom-'+slugify(name)+'-'+width+'x'+height;
  const item={id,name,width,height};
  formatSizes[id]=[width,height];
  const existing=batchFormatList.findIndex(x=>x[0]===id);
  if(existing>=0) batchFormatList[existing]=[id,name+' '+width+'×'+height];
  else batchFormatList.push([id,name+' '+width+'×'+height]);
  try{
    const saved=JSON.parse(localStorage.getItem(CUSTOM_FORMAT_KEY)||'[]').filter(x=>x.id!==id);
    saved.push(item);
    localStorage.setItem(CUSTOM_FORMAT_KEY,JSON.stringify(saved.slice(-30)));
  }catch(e){}
  renderBatchFormats();
  const checkbox=document.querySelector('[data-batch-format][value="'+CSS.escape(id)+'"]');
  if(checkbox)checkbox.checked=true;
  updateBatchStatus();
  if(nameEl)nameEl.value='';
  if(widthEl)widthEl.value='';
  if(heightEl)heightEl.value='';
}
function initBatchEngine(){
  syncInternalFormatSizes();
  loadCustomFormats();
  const scenes=document.getElementById('batchScenes'), formats=document.getElementById('batchFormats');
  if(!scenes||!formats)return;
  scenes.innerHTML=batchSceneList.map(([id,label])=>`<label class="batch-option"><input type="checkbox" value="${id}" data-batch-scene> ${label}</label>`).join('');
  renderBatchFormats();
  document.getElementById('selectAllBatch')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.checked=true); updateBatchStatus();
  });
  document.getElementById('clearBatch')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.checked=false); updateBatchStatus();
  });
  document.querySelectorAll('[data-batch-scene],[data-batch-format]').forEach(x=>x.addEventListener('change',updateBatchStatus));
  document.getElementById('generateBatch')?.addEventListener('click',generateBatch);
  document.getElementById('addCustomFormat')?.addEventListener('click',addCustomBatchFormat);
document.getElementById('downloadBatchPngs')?.addEventListener('click',exportBatchPngs);
document.getElementById('downloadBatchZip')?.addEventListener('click',exportBatchZip);
  updateBatchStatus();
  renderInternalFormatLibrary();
  document.getElementById('internalFormatSearch')?.addEventListener('input',renderInternalFormatLibrary);
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
  const sceneSummary=document.getElementById('batchSceneSummary');
  const formatSummary=document.getElementById('batchFormatSummary');
  const buildCount=document.getElementById('batchBuildCount');
  if(sceneSummary)sceneSummary.textContent=`${s.scenes.length} izabrano`;
  if(formatSummary)formatSummary.textContent=`${s.formats.length} izabrano`;
  if(buildCount)buildCount.textContent=total? `${total} mockupova`:'0 mockupova';
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
  const a=document.createElement('a');a.href=url;a.download='paket-mockupova.zip';a.click();
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
  status.textContent=`Izrada je pripremljena: ${s.scenes.length*s.formats.length} kombinacija.`;
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
    const categoryNames={device:'Uređaji',business:'Business',wellness:'Wellness',product:'Proizvodi',social:'Društvene mreže','3d':'3D kompozicije',sheets:'Dokumenti',web:'Web'};
    const categoryLabel=categoryNames[t.category]||'Studio';
    const previewGroups={
      phone:['phone','social'],
      tablet:['tablet'],
      laptop:['laptop','laptop-angle'],
      document:['frame','planner','poster','sheet-single','sheet-perspective','sheet-scattered','sheet-stack','document-stack','ebook-spread'],
      web:['web-pages','web-foldout'],
      cards:['isometric-cards','floating-cards'],
      stack:['paper-stack','magazine-spread','open-magazine','desktop-scene','multi-device'],
      scene:['business','fitness','hotel','restaurant','yoga','beauty','office','desk','product','packaging']
    };
    const previewType=Object.entries(previewGroups).find(([,ids])=>ids.includes(t.scene))?.[0]||'scene';
    card.innerHTML=`<div class="template-preview preview-${previewType}" style="--preview-bg:${t.bg}">
        <div class="template-preview-glow"></div>
        <div class="preview-art" aria-hidden="true">
          <span class="preview-sheet sheet-one"></span>
          <span class="preview-sheet sheet-two"></span>
          <span class="preview-screen"></span>
          <span class="preview-device"></span>
          <span class="preview-card card-one"></span>
          <span class="preview-card card-two"></span>
          <span class="preview-card card-three"></span>
          <span class="preview-web-line line-one"></span>
          <span class="preview-web-line line-two"></span>
          <span class="preview-web-line line-three"></span>
        </div>
        <span class="template-category-badge">${categoryLabel}</span>
      </div>
      <div class="template-meta">
        <div class="template-name-wrap"><strong>${t.name}</strong><small>${sceneNames[t.scene]||t.scene}</small></div>
        <button class="template-fav" type="button" aria-label="Favorit" title="Dodaj u favorite">${active?'♥':'♡'}</button>
      </div>
      <button class="btn primary template-use" type="button"><span>Koristi šablon</span><span aria-hidden="true">→</span></button>`;
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
  ['paper-stack','papira','papiri','listovi','listova','složeni papiri','slozeni papiri','papir stack','paper stack','stack papira'],
  ['sheet-scattered','rasuti papiri','rasute papire','razbacani papiri','scattered papers'],
  ['sheet-perspective','papir pod uglom','list pod uglom','perspektiva papira','perspektiva lista'],
  ['document-stack','dokumenata','dokumenta','dokument','više dokumenata','vise dokumenata','document stack'],
  ['ebook-spread','ebook','e-book','otvorena knjiga','otvoren ebook'],
  ['magazine-spread','magazin','časopis','casopis','magazine'],
  ['open-magazine','otvoren magazin','otvoren časopis','otvoren casopis'],
  ['web-pages','web stranice','web stranica','sajt','website','web page'],
  ['web-foldout','harmonika','web harmonika','foldout'],
  ['isometric-cards','izometrij','izometrijske kartice','izometric cards'],
  ['floating-cards','lebdeće kartice','lebdece kartice','floating cards'],
  ['multi-device','više uređaja','vise uredjaja','multi device'],
  ['laptop-angle','laptop pod uglom','laptop ugao','laptop angle'],
  ['tablet','tablet','ipad'],
  ['laptop','laptop','notebook','macbook'],
  ['phone','telefon','phone','mobilni'],
  ['frame','obični frame','obicni frame','ram','okvir','frame'],
  ['planner','planner','planer'],
  ['poster','poster'],
  ['social','social media','instagram','story','reel'],
  ['sheet-single','jedan list','jedan papir','single sheet'],
  ['business','business scena','poslovna scena','biznis'],
  ['fitness','fitness','fitnes','teretana'],
  ['hotel','hotel'],
  ['restaurant','restoran','restaurant'],
  ['yoga','yoga','joga'],
  ['beauty','beauty','lepota','salon'],
  ['office','kancelarija','office'],
  ['desk','radni sto','desk'],
  ['product','proizvod','product'],
  ['packaging','ambalaža','ambalaza','packaging']
];
function getPromptScene(text){
  for(const [scene,...aliases] of PROMPT_SCENE_ALIASES){
    if(aliases.some(a=>text.includes(a))) return scene;
  }
  return null;
}
function applyMockupPromptInstructionLocal(value){
  const text=String(value||'').trim().toLowerCase();
  if(!text){
    const msg='Napiši šta želiš, npr. „3 bela dokumenta, jedan preko drugog, champagne gold pozadina, luxury stil“.';
    if(mockupPromptStatus)mockupPromptStatus.textContent=msg;
    if(heroPromptStatus)heroPromptStatus.textContent=msg;
    return false;
  }

  const scene=getPromptScene(text);
  const wantsVideo=/\\b(video|snimak|animacija|mp4|webm)\\b/i.test(text);
  const wants3d=/3d|rotacij|vrti|okret|perspektiv|ugao|isometrij/i.test(text);
  const wantsFlat=/\\b(bez 3d|statičan|statično|obicni frame|obični frame)\\b/i.test(text);
  const color=normalizeColorPrompt(text);

  // Stil / layout
  let layout=null;
  if(/luxury|luksuz|elegant|eleganc|premium|champagne/.test(text))layout='luxury';
  else if(/minimal|minimalistič|minimalist/.test(text))layout='minimal';
  else if(/wellness|spa|mirno|prirod/.test(text))layout='wellness';
  else if(/business|poslov|corporate|biznis/.test(text))layout='business';
  if(layout&&templateSelect){templateSelect.value=layout;applyTemplate(layout);}

  if(scene){
    sceneSelect.value=scene;
    setScene(scene);
  }else if(/papir|papira|list|dokument/.test(text)){
    sceneSelect.value='paper-stack';
    setScene('paper-stack');
  }

  if(color) applyPromptColor(text);

  // Broj komada — čuvamo kao podatak scene za buduće slojeve.
  const countMatch=text.match(/\\b([2-9])\\s+(?:komada?|papira?|listova?|dokumenata?|kartica?)\\b/);
  const count=countMatch?Number(countMatch[1]):null;
  if(count) mockupObject.dataset.promptCount=String(count);

  if(wants3d&&!wantsFlat){
    autoRotate3D.checked=true;
    mockupObject.classList.add('is-rotating-3d');
  }else if(wantsFlat){
    autoRotate3D.checked=false;
    mockupObject.classList.remove('is-rotating-3d');
  }

  // Opis „jedan preko drugog / stack“ bira složenu scenu.
  if(/jedan preko drugog|jedan preko drugog|naslagan|složen|slozeni|stack/.test(text) && !scene){
    sceneSelect.value='paper-stack';
    setScene('paper-stack');
  }

  if(wantsVideo){
    const hasVideo=images.some(x=>x.kind==='video');
    if(hasVideo){
      const idx=images.findIndex(x=>x.kind==='video');
      selectImage(idx);
    }
  }

  const parts=[];
  if(scene||sceneSelect.value)parts.push(sceneNames[scene||sceneSelect.value]||'scena');
  if(count)parts.push(count+' komada');
  if(layout)parts.push('stil '+templateSelect.options[templateSelect.selectedIndex].text);
  if(wantsVideo)parts.push('video');
  if(wants3d&&!wantsFlat)parts.push('3D');
  if(color)parts.push('pozadina '+color);

  const result='Generisano: '+parts.join(' · ')+'.';
  if(mockupPromptStatus)mockupPromptStatus.textContent=result;
  if(heroPromptStatus)heroPromptStatus.textContent=result;
  return true;
}
async function applyMockupPromptInstruction(value){
  const text=String(value||'').trim();
  if(!text){
    const msg='Napiši šta želiš, npr. „Laptop na elegantnom stolu, moj dizajn na ekranu, 3D ugao, sage green pozadina“.';
    if(mockupPromptStatus)mockupPromptStatus.textContent=msg;
    if(heroPromptStatus)heroPromptStatus.textContent=msg;
    return false;
  }
  const setStatus=(msg)=>{
    if(mockupPromptStatus)mockupPromptStatus.textContent=msg;
    if(heroPromptStatus)heroPromptStatus.textContent=msg;
  };
  const button=applyMockupPrompt||heroGenerateScene;
  if(button){button.disabled=true;button.classList.add('is-loading');}
  setStatus('Generišem stvarnu AI scenu…');
  try{
    const active=images[activeImageIndex];
    const body={prompt:text};
    if(active?.kind==='image'&&typeof active.data==='string')body.imageData=active.data;

    const response=await fetch('/api/generate-scene',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.imageData)throw new Error(data.error||'AI scena nije vraćena.');

    // Prvo primeni lokalno prepoznavanje scene, stila i boje.
    applyMockupPromptInstructionLocal(text);

    // AI rezultat postaje novi aktivni vizuelni materijal u Mockup Studio-u.
    const generatedData=data.imageData.startsWith('data:')
      ? data.imageData
      : 'data:image/png;base64,'+data.imageData;
    images.push({
      data:generatedData,
      name:'AI scena - '+new Date().toISOString().slice(0,19).replace(/[T:]/g,'-')+'.png',
      kind:'image',
      mime:'image/png',
      generated:true
    });
    // Drži listu pod kontrolom: originalna 4 + AI rezultat.
    if(images.length>5)images.splice(0,images.length-5);
    activeImageIndex=images.length-1;
    selectImage(activeImageIndex);

    // AI rezultat je već kompletna scena; Frame ga prikazuje bez ponovnog
    // ubacivanja u laptop/tablet geometriju.
    if(sceneSelect){
      sceneSelect.value='frame';
      setScene('frame');
    }
    if(fitSelect){
      fitSelect.value='contain';
      setFit();
    }
    objectScale=100;objectRotation=0;offsetX=0;offsetY=0;
    if(scaleRange)scaleRange.value=100;
    if(rotateRange)rotateRange.value=0;
    if(positionX)positionX.value=0;
    if(positionY)positionY.value=0;
    updateTransform();

    const label=data.revisedPrompt?'AI scena je generisana iz tvog opisa i referentne slike.':'AI scena je generisana.';
    setStatus(label+' Možeš je dalje uređivati ili preuzeti.');
    statusText.textContent='AI scena je spremna.';
    return true;
  }catch(error){
    console.warn('AI Scene Generator:',error);
    const fallback=applyMockupPromptInstructionLocal(text);
    if(fallback)setStatus('AI generisanje trenutno nije uspelo. Primenjena je lokalna scena — proveri API ključ i Vercel deploy.');
    else setStatus(error?.message||'AI generator trenutno nije dostupan.');
    return fallback;
  }finally{
    if(button){button.disabled=false;button.classList.remove('is-loading');}
  }
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
  // Obični Frame se ponaša kao pravi okvir: slika se iseče unutar površine
  // i kratkom animacijom vizuelno „usisa“ u Frame.
  if(item.kind!=='video'){
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
  const screen=document.querySelector('.device-screen');
  if(!screen)return;

  screen.addEventListener('pointerdown',e=>{
    if(!images.length)return;
    if(e.target.closest('.frame-resize-handle'))return;
    if(e.target!==previewImage && e.target!==screen)return;
    e.preventDefault();
    screen.setPointerCapture?.(e.pointerId);
    imageDrag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:imageOffsetX,baseY:imageOffsetY};
    screen.classList.add('is-dragging-image');
  });

  screen.addEventListener('pointermove',e=>{
    if(!imageDrag||imageDrag.pointerId!==e.pointerId)return;
    e.preventDefault();
    imageOffsetX=imageDrag.baseX+(e.clientX-imageDrag.startX);
    imageOffsetY=imageDrag.baseY+(e.clientY-imageDrag.startY);
    clampImagePosition();
    updateImageTransform();
  });

  const finishDrag=()=>{
    if(!imageDrag)return;
    imageDrag=null;
    screen.classList.remove('is-dragging-image');
    updateImageTransform();
  };
  screen.addEventListener('pointerup',finishDrag);
  screen.addEventListener('pointercancel',finishDrag);
  screen.addEventListener('lostpointercapture',finishDrag);

  screen.addEventListener('wheel',e=>{
    if(!images.length)return;
    e.preventDefault();
    const delta=e.deltaY<0?5:-5;
    imageZoom=Math.max(40,Math.min(220,imageZoom+delta));
    clampImagePosition();
    updateImageTransform();
  },{passive:false});

  screen.title='Prevuci sliku za pomeranje • Točkić miša za uvećanje/smanjenje';
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

  // Laptop dobija zasebno kućište baze sa tastaturom i touchpadom.
  const existingLaptopBase=mockupObject.querySelector('.laptop-base');
  if(existingLaptopBase)existingLaptopBase.remove();
  if(scene==='laptop'){
    const base=document.createElement('div');
    base.className='laptop-base';
    const keyboard=document.createElement('div');
    keyboard.className='laptop-keyboard';
    const rows=[13,13,13,12,11,9];
    rows.forEach((count,rowIndex)=>{
      const row=document.createElement('div');
      row.className='laptop-key-row';
      for(let i=0;i<count;i++){
        const key=document.createElement('span');
        key.className='laptop-key';
        if(rowIndex===5 && i===0)key.classList.add('key-wide');
        if(rowIndex===5 && i===count-1)key.classList.add('key-wide');
        row.appendChild(key);
      }
      keyboard.appendChild(row);
    });
    const trackpad=document.createElement('div');
    trackpad.className='laptop-trackpad';
    base.append(keyboard,trackpad);
    mockupObject.appendChild(base);
  }

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
  const params=new URLSearchParams(window.location.search);
  const fromCanvas=params.get('from')==='canvas';
  const data=sessionStorage.getItem('marijanaMockupSource');
  const name=sessionStorage.getItem('marijanaMockupSourceName')||'Canvas dizajn';

  // Prenos iz Canvas-a važi samo za ovaj direktni dolazak.
  // Nakon preuzimanja brišemo privremeni podatak da se stari dizajn
  // ne bi ponovo pojavljivao kada korisnik kasnije otvori Mockup Studio.
  if(fromCanvas && data){
    images=[{data,name}];
    activeImageIndex=0;
    selectImage(0);
    statusText.textContent='Canvas dizajn je automatski prenet u 3D Mockup. Izaberi scenu i prilagodi perspektivu.';
  }

  sessionStorage.removeItem('marijanaMockupSource');
  sessionStorage.removeItem('marijanaMockupSourceName');
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
    tablet:{x:width*.31,y:height*.16,w:width*.38,h:height*.55,r:18},
    frame:{x:width*.30,y:height*.12,w:width*.40,h:height*.66,r:3},
    laptop:{x:width*.22,y:height*.25,w:width*.56,h:height*.42,r:14},
    planner:{x:width*.33,y:height*.15,w:width*.34,h:height*.58,r:5},
    poster:{x:width*.33,y:height*.12,w:width*.34,h:height*.65,r:5},
    business:{x:width*.28,y:height*.28,w:width*.44,h:height*.42,r:6},
    office:{x:width*.27,y:height*.30,w:width*.46,h:height*.40,r:10},
    desk:{x:width*.25,y:height*.30,w:width*.50,h:height*.40,r:7},
    product:{x:width*.34,y:height*.22,w:width*.32,h:height*.48,r:20},
    packaging:{x:width*.34,y:height*.17,w:width*.32,h:height*.62,r:5},
    social:{x:width*.38,y:height*.13,w:width*.24,h:height*.62,r:16},
    'coffee-cup':{x:width*.37,y:height*.18,w:width*.26,h:height*.55,r:24},
    'travel-mug':{x:width*.38,y:height*.18,w:width*.24,h:height*.58,r:26},
    mug:{x:width*.35,y:height*.24,w:width*.30,h:height*.44,r:24},
    'tote-bag':{x:width*.27,y:height*.20,w:width*.46,h:height*.56,r:10},
    'paper-bag':{x:width*.31,y:height*.20,w:width*.38,h:height*.56,r:8},
    bottle:{x:width*.39,y:height*.16,w:width*.22,h:height*.62,r:28},
    'cosmetic-jar':{x:width*.34,y:height*.28,w:width*.32,h:height*.32,r:18},
    'food-box':{x:width*.27,y:height*.28,w:width*.46,h:height*.34,r:8},
    pouch:{x:width*.31,y:height*.19,w:width*.38,h:height*.57,r:12},
    tshirt:{x:width*.25,y:height*.16,w:width*.50,h:height*.64,r:5},
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
heroGenerateScene?.addEventListener('click',()=>{
  const value=heroMockupPrompt?.value||'';
  if(mockupPrompt)mockupPrompt.value=value;
  applyMockupPromptInstruction(value);
});
heroMockupPrompt?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();heroGenerateScene?.click();}});
mockupPrompt?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();applyMockupPromptInstruction(mockupPrompt.value);}});
autoRotate3D?.addEventListener('change',updateTransform);
colorPrompt?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applyPromptColor(colorPrompt.value);}});
renderColorLibrary();
paletteCategory?.addEventListener('change',renderColorLibrary);
resetBtn.addEventListener('click',resetAll);
saveTemplateBtn.addEventListener('click',saveTemplate);
templateSearch?.addEventListener('input',renderTemplateLibrary);
templateCategory?.addEventListener('change',renderTemplateLibrary);
document.querySelectorAll('[data-template-category]').forEach(button=>{
  button.addEventListener('click',()=>{
    if(templateCategory){
      templateCategory.value=button.dataset.templateCategory||'all';
      templateSearch.value='';
      favoritesOnly.dataset.active='false';
      favoritesOnly.textContent='♡ Favoriti';
      renderTemplateLibrary();
      document.querySelector('.template-tools')?.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
});
function setLibraryTab(tab){
  const promptOpen=tab==='prompt';
  libraryTab?.classList.toggle('active',!promptOpen);
  promptTab?.classList.toggle('active',promptOpen);
  libraryTab?.setAttribute('aria-selected',String(!promptOpen));
  promptTab?.setAttribute('aria-selected',String(promptOpen));
  if(promptScenesPanel) promptScenesPanel.hidden=!promptOpen;
  document.querySelector('.template-tools')?.classList.toggle('prompt-mode',promptOpen);
}
libraryTab?.addEventListener('click',()=>setLibraryTab('library'));
promptTab?.addEventListener('click',()=>setLibraryTab('prompt'));

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

// Pokreni listu scena i formata za izradu više mockupova.
initBatchEngine();
