const templates = [
  {id:'t1',name:'Phone Clean',cat:'device',label:'Telefon',type:'free',price:0,author:'Digital Soul',license:'Lična upotreba',bg:'#e8ded0',wide:false},
  {id:'t2',name:'Laptop Business',cat:'business',label:'Business',type:'premium',price:9,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#dde4ea',wide:true},
  {id:'t3',name:'Planner Luxury',cat:'product',label:'Planner',type:'premium',price:12,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#171717',wide:false},
  {id:'t4',name:'Fitness Campaign',cat:'wellness',label:'Fitness',type:'free',price:0,author:'Digital Soul',license:'Lična upotreba',bg:'#dce7de',wide:true},
  {id:'t5',name:'Hotel Premium',cat:'business',label:'Hotel',type:'premium',price:15,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#e5ded2',wide:true},
  {id:'t6',name:'Restaurant Menu',cat:'business',label:'Restoran',type:'premium',price:12,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#e1d5c5',wide:true},
  {id:'t7',name:'Yoga Calm',cat:'wellness',label:'Yoga',type:'free',price:0,author:'Digital Soul',license:'Lična upotreba',bg:'#dce7de',wide:true},
  {id:'t8',name:'Beauty Editorial',cat:'product',label:'Beauty',type:'premium',price:10,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#e8dde0',wide:true},
  {id:'t9',name:'Social Story',cat:'social',label:'Social Media',type:'free',price:0,author:'Digital Soul',license:'Lična upotreba',bg:'#e1e7e3',wide:false},
  {id:'t10',name:'Office Pro',cat:'lifestyle',label:'Kancelarija',type:'premium',price:9,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#d9ddd7',wide:true},
  {id:'t11',name:'Creator Desk',cat:'lifestyle',label:'Radni sto',type:'free',price:0,author:'Digital Soul',license:'Lična upotreba',bg:'#e4d8c8',wide:true},
  {id:'t12',name:'Packaging Studio',cat:'product',label:'Ambalaža',type:'premium',price:14,author:'Digital Soul',license:'Komercijalna upotreba',bg:'#d8c9b0',wide:false}
];

const industryPacks = [
  {id:'food-store',name:'Prehrambena prodavnica',desc:'Akcije, proizvodi nedelje, nova ponuda, sezonske kampanje',cat:'business'},
  {id:'local-producer',name:'Domaći proizvođač',desc:'Priča o proizvođaču, proizvod, porudžbine i lokalna promocija',cat:'product'},
  {id:'bakery',name:'Pekara',desc:'Svež proizvod, dnevna ponuda, akcije i jutarnje kampanje',cat:'business'},
  {id:'butcher',name:'Mesara',desc:'Ponuda, sveži proizvodi, vikend akcije i promocije',cat:'business'},
  {id:'honey',name:'Med i pčelarstvo',desc:'Proizvod, poreklo, edukacija i prodajna promocija',cat:'product'},
  {id:'dairy',name:'Sir i mlečni proizvodi',desc:'Novi proizvodi, degustacije, ponude i lokalna prodaja',cat:'product'},
  {id:'winter',name:'Zimnica i domaće prerađevine',desc:'Sezonska prodaja, poklon paketi i porudžbine',cat:'product'},
  {id:'farm',name:'Poljoprivredno gazdinstvo',desc:'Proizvodi sa gazdinstva, sezona, dostupnost i porudžbine',cat:'lifestyle'}
];

const promoFormats = [
  {id:'promo-card',name:'Promo kartica',size:'1200 × 1200'},
  {id:'instagram-post',name:'Instagram objava',size:'1080 × 1350'},
  {id:'instagram-story',name:'Instagram Story',size:'1080 × 1920'},
  {id:'reel-cover',name:'Reel cover',size:'1080 × 1920'},
  {id:'facebook',name:'Facebook vizual',size:'1200 × 1500'},
  {id:'pinterest',name:'Pinterest Pin',size:'1000 × 1500'},
  {id:'tiktok',name:'TikTok cover',size:'1080 × 1920'},
  {id:'linkedin',name:'LinkedIn vizual',size:'1200 × 627'},
  {id:'email-header',name:'Email header',size:'1200 × 600'},
  {id:'web-banner',name:'Web banner',size:'1600 × 600'},
  {id:'promo-poster',name:'Promo poster',size:'1080 × 1350'},
  {id:'a4',name:'A4 poster',size:'2480 × 3508'},
  {id:'a5',name:'A5 poster',size:'1748 × 2480'},
  {id:'flyer',name:'Letak',size:'1748 × 2480'},
  {id:'price-list',name:'Cenovnik',size:'1748 × 2480'},
  {id:'sticker',name:'Promo nalepnica',size:'1200 × 1200'}
];

const promoStyles = {
  luxury:{bg:'#171717',text:'#f7f4ed',accent:'#c7a76c',font:'Georgia,serif'},
  minimal:{bg:'#f7f4ed',text:'#20211f',accent:'#8ea386',font:'Arial,sans-serif'},
  wellness:{bg:'#e8eee7',text:'#20211f',accent:'#8ea386',font:'Georgia,serif'},
  business:{bg:'#e3e8eb',text:'#20211f',accent:'#536675',font:'Arial,sans-serif'},
  bold:{bg:'#20211f',text:'#ffffff',accent:'#8ea386',font:'Arial,sans-serif'}
};

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
const readJSON = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value ?? fallback; }
  catch { return fallback; }
};
const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const textValue = id => String(document.getElementById(id)?.value || '').trim();
const productFields = ['productName','productPrice','productBenefit','productProof','productLocation','productCta','productDescription'];

let category = 'all';
let favorites = readJSON('digitalSoulTemplateFavorites', []);
let savedTemplates = readJSON('digitalSoulMockupTemplates', []);
let correctionHistory = readJSON('digitalSoulCorrectionHistory', []);
let promoState = {style:'luxury',format:'promo-card',variant:0};
let promoPackState = {channels:['instagram','story','facebook','pinterest','tiktok','linkedin','email','web'],results:[]};
let ccoState = {plan:[]};
let calendarItems = readJSON('digitalSoulContentCalendar', []);
let calendarEditIndex = null;

const grid = document.getElementById('libraryGrid');
const details = document.getElementById('templateDetails');
const search = document.getElementById('librarySearch');
const count = document.getElementById('libraryCount');
const empty = document.getElementById('libraryEmpty');
const sort = document.getElementById('librarySort');

function initProductInput(){
  const save = document.getElementById('saveProductInput');
  if(!save) return;
  const data = readJSON('digitalSoulProductInput', {});
  productFields.forEach(id => { const el=document.getElementById(id); if(el && data[id] != null) el.value=data[id]; });
  save.onclick = () => {
    const out={};
    productFields.forEach(id => out[id]=textValue(id));
    writeJSON('digitalSoulProductInput',out);
    const ok=document.getElementById('productSaved');
    if(ok){ok.hidden=false;setTimeout(()=>ok.hidden=true,2200);}
    refreshGeneratedAreas();
  };
}

function productData(){
  const p=readJSON('digitalSoulProductInput',{});
  return {
    name:p.productName||'Naziv proizvoda',
    price:p.productPrice||'Cena',
    benefit:p.productBenefit||'Glavna korist proizvoda',
    proof:p.productProof||'Kvalitet i razlog za poverenje',
    location:p.productLocation||'',
    cta:p.productCta||'Saznaj više',
    description:p.productDescription||''
  };
}

const correctionActions = {
  proofread: text => {
    let x=cleanText(text);
    x=x.replace(/\s+([,.!?;:])/g,'$1');
    if(x && !/[.!?]$/.test(x)) x+='.';
    return x.charAt(0).toUpperCase()+x.slice(1);
  },
  clarity: text => cleanText(text).replace(/\b(u\s+suštini|zapravo|generalno|bukvalno)\b/gi,'').replace(/\s{2,}/g,' ').trim(),
  shorten: text => {
    const parts=cleanText(text).split(/(?<=[.!?])\s+/).filter(Boolean);
    return parts.slice(0,2).join(' ') || cleanText(text).slice(0,180);
  },
  expand: text => cleanText(text)+' '+productData().benefit+'. '+(productData().proof||'Jasno predstavljena vrednost olakšava odluku kupca.'),
  professional: text => 'Jasna i profesionalna verzija: '+cleanText(text),
  sales: text => cleanText(text)+' '+productData().benefit+'. '+productData().cta+'.',
  cta: text => cleanText(text)+(/[.!?]$/.test(cleanText(text))?'':' .')+' '+productData().cta+'.',
  seo: text => cleanText(text)+' Ključne teme: '+[productData().name,productData().benefit].filter(Boolean).join(', ')+'.'
};

function cleanText(text){return String(text||'').replace(/\s+/g,' ').trim();}

function initCorrectionEngine(){
  document.querySelectorAll('.correction-action').forEach(button=>{
    button.onclick=()=>{
      const input=textValue('correctionInput');
      if(!input){showCorrection('Unesi tekst koji želiš da obradiš.','warning');return;}
      const action=button.dataset.action;
      let result=correctionActions[action]?correctionActions[action](input):input;
      if(document.getElementById('correctionKeepStyle')?.checked) result=preserveStyle(input,result);
      correctionHistory.unshift({action,result,created:new Date().toISOString()});
      correctionHistory=correctionHistory.slice(0,20);
      writeJSON('digitalSoulCorrectionHistory',correctionHistory);
      showCorrection(result,'success');
      renderQuality(result);
    };
  });
  renderCorrectionHistory();
}

function preserveStyle(original,result){
  if(!original) return result;
  if(original===original.toUpperCase()) return result.toUpperCase();
  if(/^[a-z]/.test(original.trim())) return result.charAt(0).toLowerCase()+result.slice(1);
  return result;
}

function showCorrection(result,type){
  const box=document.getElementById('correctionResult');
  if(!box)return;
  box.hidden=false;
  box.className='correction-result '+type;
  box.innerHTML='<strong>Rezultat</strong><textarea readonly>'+esc(result)+'</textarea><button type="button" class="btn" id="copyCorrection">Kopiraj</button>';
  document.getElementById('copyCorrection').onclick=()=>copyText(result);
}

function renderCorrectionHistory(){
  const box=document.getElementById('correctionHistory');
  if(!box)return;
  if(!correctionHistory.length){box.hidden=true;return;}
  box.hidden=false;
  box.innerHTML='<strong>Poslednje izmene</strong>'+correctionHistory.slice(0,5).map((x,i)=>'<div class="history-row"><span>'+esc(x.action)+'</span><button class="btn" data-history="'+i+'">Otvori</button></div>').join('');
  box.querySelectorAll('[data-history]').forEach(b=>b.onclick=()=>showCorrection(correctionHistory[Number(b.dataset.history)].result,'success'));
}

function renderQuality(text){
  const box=document.getElementById('qualityResult');
  if(!box)return;
  const value=cleanText(text);
  const words=value?value.split(/\s+/).length:0;
  const sentences=value?value.split(/[.!?]+/).filter(Boolean).length:0;
  const hasCta=/poruči|kupi|saznaj|javi|kontakt|rezerv|prijav|klikni|pozovi/i.test(value);
  const score=Math.min(100,Math.max(0,40+(words>=10?20:0)+(sentences>=2?15:0)+(hasCta?25:0)));
  const advice=[];
  if(words<10)advice.push('Dodaj malo više konteksta.');
  if(!hasCta)advice.push('Dodaj jasan poziv na akciju.');
  if(!sentences)advice.push('Dodaj glavnu poruku u punoj rečenici.');
  box.hidden=false;
  box.innerHTML='<div class="quality-score"><strong>'+score+'/100</strong><span>Kvalitet sadržaja</span></div><div class="quality-meta">Reči: '+words+' · Rečenice: '+sentences+' · CTA: '+(hasCta?'da':'ne')+'</div><ul>'+((advice.length?advice:['Sadržaj ima dobru osnovu za dalju obradu.']).map(x=>'<li>'+esc(x)+'</li>').join(''))+'</ul>';
}

const audienceProfiles={
 general:'Jasna i razumljiva komunikacija bez pretpostavki o predznanju.',
 local:'Naglasak na lokaciji, dostupnosti, poverenju i praktičnim informacijama.',
 b2c:'Fokus na korist za pojedinca i jednostavan sledeći korak.',
 b2b:'Fokus na poslovnu vrednost, rezultat i proces.',
 professionals:'Precizniji terminološki i stručniji ton.',
 beginners:'Jednostavno, korak po korak, bez nepotrebnog žargona.',
 returning:'Nadoveži se na postojeći odnos i prethodno iskustvo.'
};
const platformProfiles={
 Instagram:'Vizuelno, kratko, jak početak i jasan CTA.',
 Facebook:'Razgovorno i pogodno za detaljniji opis.',
 Pinterest:'Opisno, korisno i fokusirano na pretragu i dugoročnu vrednost.',
 LinkedIn:'Profesionalno i konkretno, usmereno na poslovnu vrednost.',
 TikTok:'Brz hook, kratke scene i prirodan govor.',
 Email:'Jasan subject, uvod, vrednost i jedan primarni CTA.',
 Web:'Informativno, strukturisano i prilagođeno skeniranju.'
};
const formatProfiles={
 Objava:'Hook → glavna poruka → benefit → CTA.',
 Story:'Jedna poruka po ekranu.',
 'Reel / TikTok':'Hook → problem/tema → benefit → CTA.',
 Pin:'Naslov → koristan opis → ključna tema → CTA.',
 Email:'Subject → uvod → vrednost → CTA.',
 Oglas:'Hook → ponuda/benefit → dokaz → CTA.',
 Blog:'Naslov → uvod → podnaslovi → vrednost → zaključak.'
};

function initAudienceEngine(){
  const apply=document.getElementById('applyAudience');
  if(!apply)return;
  const saved=readJSON('digitalSoulAudienceSettings',{});
  if(saved.audience)document.getElementById('audienceType').value=saved.audience;
  if(saved.platform)document.getElementById('contentPlatform').value=saved.platform;
  if(saved.format)document.getElementById('contentFormat').value=saved.format;
  apply.onclick=()=>{
    const a=textValue('audienceType')||document.getElementById('audienceType').value;
    const p=document.getElementById('contentPlatform').value;
    const f=document.getElementById('contentFormat').value;
    writeJSON('digitalSoulAudienceSettings',{audience:a,platform:p,format:f});
    const box=document.getElementById('audienceGuidance');
    if(box){box.hidden=false;box.innerHTML='<strong>Prilagođavanje:</strong><br>'+esc(audienceProfiles[a]||'Prilagodi komunikaciju publici.')+'<br><br><strong>'+esc(p)+':</strong> '+esc(platformProfiles[p]||'Prilagodi sadržaj platformi.')+'<br><strong>'+esc(f)+':</strong> '+esc(formatProfiles[f]||'Prilagodi strukturu formatu.');}
  };
}

const channelNames={
  Instagram:'Instagram objava',Story:'Story / Reel',Facebook:'Facebook',Pinterest:'Pinterest',LinkedIn:'LinkedIn',Email:'Email',Oglas:'Oglas','Video scenario':'Video scenario'
};

function baseContent(){
  const p=productData();
  const offer=readJSON('digitalSoulOffer',{});
  return {p,offer};
}

function makeChannelContent(channel){
  const {p,offer}=baseContent();
  const price=offer.offerPrice||p.price;
  const headline=offer.offerMessage||p.benefit;
  if(channel==='Instagram')return {title:headline,body:headline+'. '+p.benefit+'. '+(p.proof? p.proof+'. ':'')+'Cena: '+price+'. '+p.cta+'.'};
  if(channel==='Story / Reel')return {title:'Hook: '+headline,body:'0–3s: '+headline+'\n3–7s: '+p.benefit+'\n7–12s: '+p.proof+'\n12–15s: '+p.cta};
  if(channel==='Facebook')return {title:headline,body:p.name+'\n\n'+p.description+'\n\n'+p.benefit+'. '+p.proof+'.\nCena: '+price+'.\n\n'+p.cta};
  if(channel==='Pinterest')return {title:p.name+' | '+p.benefit,body:p.name+' — '+p.benefit+'. '+p.proof+'. '+p.cta+'.'};
  if(channel==='LinkedIn')return {title:headline,body:p.name+' donosi: '+p.benefit+'. '+p.proof+'. '+p.cta+'.'};
  if(channel==='Email')return {title:'Subject: '+headline,body:'Zdravo,\n\n'+p.description+'\n\n'+p.benefit+'. '+p.proof+'.\n\nCena: '+price+'.\n\n'+p.cta};
  if(channel==='Oglas')return {title:headline,body:headline+'\n\n'+p.benefit+'.\nCena: '+price+'.\n\n'+p.cta};
  return {title:'Video scenario: '+headline,body:'Scena 1 — Hook: '+headline+'\nScena 2 — Benefit: '+p.benefit+'\nScena 3 — Dokaz: '+p.proof+'\nScena 4 — CTA: '+p.cta};
}

function initRepurposeEngine(){
  document.querySelectorAll('.repurpose-action').forEach(button=>{
    button.onclick=()=>{
      const input=cleanText(textValue('correctionInput'))||productData().description||productData().benefit;
      if(!input){showRepurpose('Unesi sadržaj ili podatke o proizvodu.');return;}
      const channel=button.dataset.channel;
      const result=makeChannelContent(channel);
      result.body=input+'\n\n'+result.body;
      const box=document.getElementById('repurposeResult');
      if(!box)return;
      box.hidden=false;
      box.innerHTML='<article><strong>'+esc(channelNames[channel]||channel)+'</strong><h3>'+esc(result.title)+'</h3><textarea readonly>'+esc(result.body)+'</textarea><button class="btn" id="copyRepurpose">Kopiraj</button></article>';
      document.getElementById('copyRepurpose').onclick=()=>copyText(result.title+'\n\n'+result.body);
    };
  });
}
function showRepurpose(msg){
  const box=document.getElementById('repurposeResult');if(box){box.hidden=false;box.textContent=msg;}
}

function generateContent(){
  const p=productData();
  const style=document.getElementById('contentStyle')?.value||'professional';
  const styleMap={professional:'Jasno i profesionalno',sales:'Prodajno i direktno',natural:'Prirodno i razgovorno',emotional:'Toplo i emotivno',short:'Kratko i konkretno',seo:'SEO orijentisano'};
  const prefix=style==='sales'?'Zašto da izabereš '+p.name+': ':style==='emotional'?'Priča iza vrednosti koju dobijaš: ':style==='short'?'': 'Predstavljamo '+p.name+'. ';
  const result=prefix+p.benefit+'. '+p.proof+'. '+(p.location?'Dostupno: '+p.location+'. ':'')+p.cta+'.';
  const channels=['Instagram','Facebook','Pinterest','LinkedIn','Email'];
  const box=document.getElementById('generatedContent');
  if(!box)return;
  box.hidden=false;
  box.innerHTML='<div class="generated-head"><strong>'+esc(styleMap[style]||style)+'</strong><button class="btn" id="copyGenerated">Kopiraj sve</button></div>'+channels.map(c=>{const x=makeChannelContent(c);return '<article><h3>'+esc(channelNames[c])+'</h3><textarea readonly>'+esc(result+'\n\n'+x.body)+'</textarea></article>';}).join('');
  document.getElementById('copyGenerated').onclick=()=>copyText(result);
  renderQuality(result);
}

function initOfferEngine(){
  const build=document.getElementById('buildOffer');
  if(!build)return;
  const saved=readJSON('digitalSoulOffer',{});
  ['offerPrice','offerOldPrice','offerDiscount','offerDeadline','offerCode','offerMessage'].forEach(id=>{const el=document.getElementById(id);if(el&&saved[id]!=null)el.value=saved[id]});
  build.onclick=()=>{
    const offer={
      offerType:document.getElementById('offerType').value,
      offerPrice:textValue('offerPrice'),offerOldPrice:textValue('offerOldPrice'),offerDiscount:textValue('offerDiscount'),
      offerDeadline:textValue('offerDeadline'),offerCode:textValue('offerCode'),offerMessage:textValue('offerMessage')
    };
    const price=parseFloat((offer.offerPrice||'').replace(',','.').replace(/[^\d.]/g,''));
    const old=parseFloat((offer.offerOldPrice||'').replace(',','.').replace(/[^\d.]/g,''));
    if(!offer.offerDiscount && price && old && old>price)offer.offerDiscount=Math.round((1-price/old)*100)+'%';
    writeJSON('digitalSoulOffer',offer);
    const preview=document.getElementById('offerPreview');
    if(preview){preview.hidden=false;preview.innerHTML='<strong>'+esc(offer.offerType)+'</strong><h3>'+esc(offer.offerMessage||'Posebna ponuda')+'</h3><div class="offer-price">'+esc(offer.offerPrice||'Cena')+'</div>'+(offer.offerOldPrice?'<del>'+esc(offer.offerOldPrice)+'</del> ':'')+(offer.offerDiscount?'<span>'+esc(offer.offerDiscount)+'</span> ':'')+(offer.offerDeadline?'<small>Rok: '+esc(offer.offerDeadline)+'</small>':'')+(offer.offerCode?'<small>Promo kod: '+esc(offer.offerCode)+'</small>':'');}
    const result=document.getElementById('offerResult');
    if(result){result.hidden=false;result.innerHTML='<strong>Ponuda je sačuvana.</strong> Možeš je sada koristiti u Campaign Builder-u i Promo Pack-u.';}
    refreshGeneratedAreas();
  };
}

function initCampaignBuilder2(){
  const box=document.getElementById('campaign2Channels');
  const build=document.getElementById('buildCampaign2');
  if(!box||!build)return;
  const channels=['Instagram','Facebook','Pinterest','TikTok','LinkedIn','Email','Web'];
  box.innerHTML=channels.map((x,i)=>'<button type="button" class="campaign2-channel '+(i<3?'active':'')+'" data-channel="'+x+'">'+x+'</button>').join('');
  box.querySelectorAll('.campaign2-channel').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
  build.onclick=()=>{
    const p=productData();
    const selected=[...box.querySelectorAll('.active')].map(x=>x.dataset.channel);
    if(!selected.length){showBox('campaign2Result','Izaberi bar jedan kanal.');return;}
    const goal=document.getElementById('campaign2Goal').value;
    const audience=document.getElementById('campaign2Audience').value;
    const offer=document.getElementById('campaign2Offer').value;
    const cta=textValue('campaign2Cta')||p.cta;
    const result=document.getElementById('campaign2Result');
    result.hidden=false;
    result.innerHTML='<div class="campaign-summary"><strong>'+esc(p.name)+'</strong><span>'+esc(goal)+'</span><span>'+esc(audience)+'</span><span>'+selected.length+' kanala</span></div><div class="campaign-channel-list">'+selected.map(ch=>'<article><strong>'+esc(ch)+'</strong><p>'+esc(p.benefit)+' · '+esc(offer)+' · CTA: '+esc(cta)+'</p></article>').join('')+'</div><button class="btn" id="campaign2Mockup">Nastavi u Mockup Studio</button>';
    document.getElementById('campaign2Mockup').onclick=()=>location.href='mockup.html';
    writeJSON('digitalSoulLastCampaign',{goal,audience,offer,cta,channels:selected});
  };
}

const campaignPurposes=['Reklama','Prodaja','Akcija','Novi proizvod','Brend','Edukacija','Sezona','Lokalna promocija'];
const campaignFormats=['Instagram objava','Story / Reel','Facebook objava','Pinterest pin','Promo poster','Banner'];

function initCampaignBuilder(){
  const ci=document.getElementById('campaignIndustry');
  const cp=document.getElementById('campaignPurpose');
  const cf=document.getElementById('campaignFormats');
  const build=document.getElementById('buildCampaign');
  if(!ci||!cp||!cf||!build)return;
  ci.innerHTML=industryPacks.map(p=>'<option value="'+p.id+'">'+esc(p.name)+'</option>').join('');
  cp.innerHTML=campaignPurposes.map(p=>'<option>'+esc(p)+'</option>').join('');
  cf.innerHTML=campaignFormats.map((p,i)=>'<button type="button" class="campaign-format '+(i<3?'active':'')+'">'+esc(p)+'</button>').join('');
  cf.querySelectorAll('.campaign-format').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
  build.onclick=()=>{
    const ind=industryPacks.find(p=>p.id===ci.value)||industryPacks[0];
    const selected=[...cf.querySelectorAll('.active')].map(x=>x.textContent);
    const purpose=cp.value;
    const result=document.getElementById('campaignResult');
    if(!selected.length){result.hidden=false;result.textContent='Izaberi bar jedan format.';return;}
    result.hidden=false;
    result.innerHTML='<strong>'+esc(ind.name)+' · '+esc(purpose)+'</strong><p>Pripremljen paket za '+selected.length+' formata.</p><ul>'+selected.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><button class="btn" id="openCampaignMockup">Nastavi u Mockup Studio</button>';
    document.getElementById('openCampaignMockup').onclick=()=>location.href='mockup.html';
    const brief=document.getElementById('contentBrief');
    if(brief){brief.hidden=false;brief.innerHTML='<h3>Content Brief · '+esc(ind.name)+'</h3><div class="brief-grid">'+[['Hook','Privuci pažnju'],['Naslov','Jasna glavna poruka'],['Benefit','Objasni korist'],['Dokaz','Pokaži razlog za poverenje'],['CTA','Usmeri sledeći korak'],['Kanali',selected.join(' · ')]].map(x=>'<div class="brief-item"><strong>'+x[0]+'</strong>'+esc(x[1])+'</div>').join('')+'</div>';}
  };
}

function initIndustryPacks(){
  const wrap=document.getElementById('industryPacks');if(!wrap)return;
  wrap.innerHTML=industryPacks.map(p=>'<button type="button" class="industry-pack" data-cat="'+p.cat+'"><strong>'+esc(p.name)+'</strong><small>'+esc(p.desc)+'</small></button>').join('');
  wrap.querySelectorAll('.industry-pack').forEach(b=>b.onclick=()=>{
    category=b.dataset.cat;
    document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));
    search.value='';
    renderLibrary();
    document.getElementById('libraryGrid')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

function renderLibrary(){
  if(!grid)return;
  let q=search.value.toLowerCase().trim();
  let list;
  if(category==='mine'){
    list=savedTemplates.map((t,i)=>({id:'saved-'+i,name:t.name||('Sačuvan šablon '+(i+1)),cat:'mine',label:'Moji šabloni',type:'saved',price:0,bg:t.bg||'#eee',wide:false,saved:t}));
  }else{
    list=templates.filter(t=>(category==='all'||t.cat===category)&&(!q||[t.name,t.label,t.cat].join(' ').toLowerCase().includes(q)));
  }
  if(sort?.value==='az')list.sort((a,b)=>a.name.localeCompare(b.name,'sr'));
  if(sort?.value==='new')list=list.slice().reverse();
  if(count)count.textContent=list.length+' šablona';
  grid.innerHTML='';
  if(empty)empty.hidden=list.length>0;
  list.forEach(t=>{
    const el=document.createElement('article');el.className='template-card';
    el.innerHTML='<div class="template-preview '+(t.wide?'wide':'')+'" style="background:'+t.bg+'"></div><div class="template-info"><strong class="template-name">'+esc(t.name)+'</strong><small>'+esc(t.label)+'</small><div class="template-actions"><button class="btn use">Koristi šablon</button><button class="btn fav">'+(favorites.includes(t.id)?'♥':'♡')+'</button></div></div>';
    el.querySelector('.fav').onclick=e=>{e.stopPropagation();favorites=favorites.includes(t.id)?favorites.filter(x=>x!==t.id):[...favorites,t.id];writeJSON('digitalSoulTemplateFavorites',favorites);renderLibrary();};
    el.querySelector('.use').onclick=()=>{location.href='mockup.html'+(t.saved?'':'?template='+encodeURIComponent(t.id));};
    el.querySelector('.template-name').onclick=()=>showTemplateDetails(t);
    grid.appendChild(el);
  });
}

function showTemplateDetails(t){
  if(!details)return;
  details.hidden=false;
  details.innerHTML='<div class="template-details-preview '+(t.wide?'wide':'')+'" style="background:'+t.bg+'"></div><div class="template-details-info"><div class="kicker">TEMPLATE</div><h2>'+esc(t.name)+'</h2><p>Gotov šablon za '+esc(t.label)+'. Prilagodi sadržaj, boje, poziciju i format u Mockup Studio.</p><div class="template-tags"><span class="template-tag">'+esc(t.label)+'</span><span class="template-tag">'+(t.type==='premium'?'Premium':'Besplatno')+'</span><span class="template-tag">'+(t.price?'€'+t.price:'0 €')+'</span><span class="template-tag">'+esc(t.license||'Prilagodljiv')+'</span></div><div class="template-details-actions"><button id="detailUse" class="btn">Koristi ovaj šablon</button><button id="detailFav" class="btn">'+(favorites.includes(t.id)?'♥ U favoritima':'♡ Dodaj u favorite')+'</button><button id="detailClose" class="btn template-details-close">Zatvori</button></div></div>';
  details.querySelector('#detailUse').onclick=()=>location.href='mockup.html'+(t.saved?'':'?template='+encodeURIComponent(t.id));
  details.querySelector('#detailFav').onclick=()=>{favorites=favorites.includes(t.id)?favorites.filter(x=>x!==t.id):[...favorites,t.id];writeJSON('digitalSoulTemplateFavorites',favorites);showTemplateDetails(t);renderLibrary();};
  details.querySelector('#detailClose').onclick=()=>details.hidden=true;
  details.scrollIntoView({behavior:'smooth',block:'start'});
}

function initLibrary(){
  document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{
    category=b.dataset.category;
    document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));
    renderLibrary();
  });
  search?.addEventListener('input',renderLibrary);
  sort?.addEventListener('change',renderLibrary);
  document.getElementById('libraryFavorites')?.addEventListener('click',()=>{
    category=category==='mine'?'all':'mine';
    document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));
    renderLibrary();
  });
  renderLibrary();
}

const ccoChannels=['Instagram','Facebook','Pinterest','TikTok','LinkedIn','Email','Web'];
const ccoContent=[
  ['Hook','Privuci pažnju','Objava'],
  ['Problem → rešenje','Pokaži potrebu','Objava'],
  ['Edukacija','Izgradi poverenje','Carousel / Pin'],
  ['Benefit','Objasni vrednost','Reel'],
  ['Dokaz','Podrži odluku','Objava'],
  ['Story','Poveži se sa publikom','Story'],
  ['Ponuda','Pokreni akciju','Promo'],
  ['FAQ','Ukloni prepreku','Objava'],
  ['Behind the scenes','Humanizuj brend','Reel'],
  ['CTA','Usmeri sledeći korak','Objava'],
  ['Reminder','Podseti publiku','Story'],
  ['Recap','Zaokruži kampanju','Objava']
];

function initCco(){
  const box=document.getElementById('ccoChannels');
  if(!box)return;
  box.innerHTML=ccoChannels.map(x=>'<button type="button" class="cco-channel" data-channel="'+x+'">'+x+'</button>').join('');
  box.querySelectorAll('.cco-channel').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
  document.getElementById('buildCco')?.addEventListener('click',()=>buildCco(false));
  document.getElementById('regenCco')?.addEventListener('click',()=>buildCco(true));
  document.getElementById('saveCco')?.addEventListener('click',saveCco);
  document.getElementById('copyCco')?.addEventListener('click',copyCco);
  renderSavedCco();
}

function buildCco(regen){
  const days=Number(document.getElementById('ccoDays')?.value||7);
  const goal=document.getElementById('ccoGoal')?.value||'Prodaja';
  const intensity=document.getElementById('ccoIntensity')?.value||'balanced';
  const primary=document.getElementById('ccoPrimary')?.value||'Instagram';
  const extras=[...document.querySelectorAll('.cco-channel.active')].map(x=>x.dataset.channel).filter(x=>x!==primary);
  const channels=[primary,...extras];
  const p=productData();
  ccoState.plan=Array.from({length:days},(_,i)=>{
    let type=ccoContent[(i+(regen?1:0))%ccoContent.length];
    if(intensity==='sales'&&i%3===2)type=['Ponuda','Pokreni akciju','Promo'];
    if(intensity==='education'&&i%3===0)type=['Edukacija','Obrazuj publiku','Carousel / Pin'];
    if(intensity==='brand'&&i%3===1)type=['Story','Brend priča','Story'];
    const channel=channels[i%channels.length];
    return {day:i+1,channel,type:type[0],purpose:type[1],format:type[2],topic:p.name+' — '+p.benefit,cta:p.cta};
  });
  const box=document.getElementById('ccoResult');if(!box)return;
  box.hidden=false;
  box.innerHTML='<div class="cco-summary"><strong>'+esc(p.name)+'</strong><span>'+esc(goal)+'</span><span>'+days+' dana</span><span>Primarni: '+esc(primary)+'</span></div><div class="cco-timeline">'+ccoState.plan.map(x=>'<article class="cco-day"><div class="cco-day-num">DAN '+x.day+'</div><div><strong>'+esc(x.type)+'</strong><small>'+esc(x.channel)+' · '+esc(x.format)+'</small><p>'+esc(x.topic)+'</p><em>'+esc(x.purpose)+'</em><div class="cco-next">CTA: '+esc(x.cta)+'</div></div></article>').join('')+'</div>';
}

function saveCco(){
  if(!ccoState.plan.length)buildCco(false);
  const plans=readJSON('digitalSoulContentCampaignPlans',[]);
  plans.unshift({id:Date.now(),name:productData().name+' kampanja',goal:document.getElementById('ccoGoal')?.value||'Prodaja',days:ccoState.plan.length,plan:ccoState.plan,created:new Date().toISOString()});
  writeJSON('digitalSoulContentCampaignPlans',plans.slice(0,20));
  renderSavedCco();
}
function renderSavedCco(){
  const box=document.getElementById('ccoSavedList');if(!box)return;
  const plans=readJSON('digitalSoulContentCampaignPlans',[]);
  box.innerHTML=plans.length?plans.map((p,i)=>'<article class="cco-saved-item"><strong>'+esc(p.name)+'</strong><small>'+p.days+' dana · '+new Date(p.created).toLocaleDateString('sr-RS')+'</small><button class="btn cco-open" data-i="'+i+'">Otvori</button><button class="btn cco-delete" data-i="'+i+'">Obriši</button></article>').join(''):'<span class="cco-empty">Još nema sačuvanih planova.</span>';
  box.querySelectorAll('.cco-open').forEach(b=>b.onclick=()=>{const p=plans[Number(b.dataset.i)];ccoState.plan=p.plan||[];const result=document.getElementById('ccoResult');if(result){result.hidden=false;result.innerHTML='<div class="cco-summary"><strong>'+esc(p.name)+'</strong><span>'+esc(p.goal)+'</span><span>'+p.days+' dana</span></div><div class="cco-timeline">'+ccoState.plan.map(x=>'<article class="cco-day"><div class="cco-day-num">DAN '+x.day+'</div><div><strong>'+esc(x.type)+'</strong><small>'+esc(x.channel)+' · '+esc(x.format)+'</small><p>'+esc(x.topic)+'</p><em>'+esc(x.purpose)+'</em></div></article>').join('')+'</div>';}}});
  box.querySelectorAll('.cco-delete').forEach(b=>b.onclick=()=>{plans.splice(Number(b.dataset.i),1);writeJSON('digitalSoulContentCampaignPlans',plans);renderSavedCco();});
}
function copyCco(){if(!ccoState.plan.length)buildCco(false);copyText(ccoState.plan.map(x=>'Dan '+x.day+' | '+x.channel+' | '+x.type+' | '+x.topic+' | CTA: '+x.cta).join('\n'));}

function initContentCalendar(){
  calendarItems=readJSON('digitalSoulContentCalendar',[]);
  document.getElementById('calendarView')?.addEventListener('change',renderCalendar);
  document.getElementById('calendarFilter')?.addEventListener('change',renderCalendar);
  document.getElementById('calendarAdd')?.addEventListener('click',()=>openCalendarEditor());
  document.getElementById('calendarImportPlan')?.addEventListener('click',importLatestCalendarPlan);
  document.getElementById('calSave')?.addEventListener('click',saveCalendarItem);
  document.getElementById('calCancel')?.addEventListener('click',closeCalendarEditor);
  renderCalendar();
}
const calendarStatuses=['Ideja','U izradi','Spremno','Zakazano','Objavljeno'];
function saveCalendar(){writeJSON('digitalSoulContentCalendar',calendarItems);}
function openCalendarEditor(index=null){
  calendarEditIndex=index;
  const editor=document.getElementById('calendarEditor');if(!editor)return;
  const item=index==null?{title:'',date:new Date().toISOString().slice(0,10),channel:'Instagram',status:'Ideja',note:''}:calendarItems[index];
  document.getElementById('calTitle').value=item.title||'';
  document.getElementById('calDate').value=item.date||new Date().toISOString().slice(0,10);
  document.getElementById('calChannel').value=item.channel||'Instagram';
  document.getElementById('calStatus').value=item.status||'Ideja';
  document.getElementById('calNote').value=item.note||'';
  editor.hidden=false;
  editor.scrollIntoView({behavior:'smooth',block:'center'});
}
function closeCalendarEditor(){const x=document.getElementById('calendarEditor');if(x)x.hidden=true;calendarEditIndex=null;}
function saveCalendarItem(){
  const item={title:textValue('calTitle')||'Novi sadržaj',date:textValue('calDate')||new Date().toISOString().slice(0,10),channel:document.getElementById('calChannel').value,status:document.getElementById('calStatus').value,note:textValue('calNote')};
  if(calendarEditIndex==null)calendarItems.push({...item,id:Date.now()});else calendarItems[calendarEditIndex]={...calendarItems[calendarEditIndex],...item};
  saveCalendar();closeCalendarEditor();renderCalendar();
}
function importLatestCalendarPlan(){
  const plans=readJSON('digitalSoulContentCampaignPlans',[]);
  if(!plans.length){showBox('calendarBoard','Nema sačuvanog kampanjskog plana.');return;}
  const start=new Date();
  const imported=(plans[0].plan||[]).map((x,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return{id:Date.now()+i,title:x.type+' — '+x.topic,date:d.toISOString().slice(0,10),channel:x.channel,status:'Ideja',note:x.purpose+' · CTA: '+x.cta};});
  calendarItems=[...calendarItems,...imported];saveCalendar();renderCalendar();
}
function renderCalendar(){
  const board=document.getElementById('calendarBoard');if(!board)return;
  const filter=document.getElementById('calendarFilter')?.value||'all';
  const items=calendarItems.filter(x=>filter==='all'||x.status===filter).sort((a,b)=>a.date.localeCompare(b.date));
  const stats=document.getElementById('calendarStats');
  if(stats)stats.innerHTML=calendarStatuses.map(s=>'<div class="calendar-stat"><strong>'+calendarItems.filter(x=>x.status===s).length+'</strong><span>'+s+'</span></div>').join('');
  if(!items.length){board.innerHTML='<div class="calendar-empty">Nema sadržaja za izabrani filter. Dodaj sadržaj ili uvezi kampanjski plan.</div>';return;}
  board.innerHTML='<div class="calendar-list">'+items.map(x=>{const i=calendarItems.indexOf(x);return '<article class="calendar-card"><div class="calendar-card-top"><small>'+esc(x.date)+'</small><span class="calendar-channel">'+esc(x.channel)+'</span></div><strong>'+esc(x.title)+'</strong><p>'+esc(x.note)+'</p><select class="calendar-status" data-i="'+i+'">'+calendarStatuses.map(s=>'<option '+(x.status===s?'selected':'')+'>'+s+'</option>').join('')+'</select><button class="btn calendar-edit" data-i="'+i+'">Uredi</button><button class="btn calendar-delete" data-i="'+i+'">Obriši</button></article>';}).join('')+'</div>';
  board.querySelectorAll('.calendar-edit').forEach(b=>b.onclick=()=>openCalendarEditor(Number(b.dataset.i)));
  board.querySelectorAll('.calendar-delete').forEach(b=>b.onclick=()=>{calendarItems.splice(Number(b.dataset.i),1);saveCalendar();renderCalendar();});
  board.querySelectorAll('.calendar-status').forEach(s=>s.onchange=()=>{calendarItems[Number(s.dataset.i)].status=s.value;saveCalendar();renderCalendar();});
}

function initVisualPromoEngine(){
  const fs=document.getElementById('promoFormat');if(!fs)return;
  fs.innerHTML=promoFormats.map(x=>'<option value="'+x.id+'">'+esc(x.name)+' · '+esc(x.size)+'</option>').join('');
  fs.value=promoState.format;
  document.getElementById('promoStyle').onchange=e=>{promoState.style=e.target.value;renderPromo();};
  fs.onchange=e=>{promoState.format=e.target.value;renderPromo();};
  document.getElementById('promoBrand').onchange=renderPromo;
  document.getElementById('buildPromo').onclick=()=>{promoState.variant=0;renderPromo();};
  document.getElementById('makeFivePromos').onclick=()=>renderPromoVariants();
  document.getElementById('visualOnly').onclick=()=>{const keys=Object.keys(promoStyles),i=keys.indexOf(promoState.style);promoState.style=keys[(i+1)%keys.length];document.getElementById('promoStyle').value=promoState.style;renderPromo();};
  document.getElementById('textOnly').onclick=()=>{promoState.variant++;renderPromo();};
  document.getElementById('priceOnly').onclick=()=>{promoState.variant++;renderPromo();};
  document.getElementById('ctaOnly').onclick=()=>{promoState.variant++;renderPromo();};
  document.getElementById('downloadPromoPack').onclick=downloadPromoPack;
  document.getElementById('createWholePromo').onclick=()=>renderPromoVariants(true);
  renderPromo();
}
function promoData(){
  const p=productData(),o=readJSON('digitalSoulOffer',{});
  return {name:p.name,price:o.offerPrice||p.price,oldPrice:o.offerOldPrice||'',discount:o.offerDiscount||'',deadline:o.offerDeadline||'',code:o.offerCode||'',message:o.offerMessage||p.benefit,cta:p.cta};
}
function promoCopy(d,v){
  const headlines=[d.message,d.name+' — sada dostupno','Posebna ponuda za '+d.name,'Vreme je za '+d.name,'Otkrij '+d.name];
  const ctas=[d.cta,'Poruči danas','Saznaj više','Javi se za detalje','Iskoristi ponudu'];
  return {headline:headlines[v%headlines.length],cta:ctas[v%ctas.length]};
}
function renderPromo(){
  const box=document.getElementById('promoPreview');if(!box)return;
  const d=promoData(),copy=promoCopy(d,promoState.variant),style=promoStyles[promoState.style],fmt=promoFormats.find(x=>x.id===promoState.format)||promoFormats[0];
  box.hidden=false;
  box.innerHTML='<div class="promo-canvas" style="background:'+style.bg+';color:'+style.text+';font-family:'+style.font+'"><div class="promo-brand">'+esc(document.getElementById('promoBrand').value==='Bez brenda'?'':document.getElementById('promoBrand').value)+'</div><div class="promo-badge" style="color:'+style.accent+'">'+esc(d.discount||'PROMO')+'</div><div class="promo-copy"><div class="promo-format-label" style="color:'+style.accent+'">'+esc(fmt.name)+'</div><h3>'+esc(copy.headline)+'</h3><p>'+esc(d.message)+'</p><div class="promo-prices">'+(d.oldPrice?'<del>'+esc(d.oldPrice)+'</del> ':'')+'<strong>'+esc(d.price)+'</strong></div><div class="promo-meta">'+(d.deadline?'Rok: '+esc(d.deadline)+' · ':'')+(d.code?'Kod: '+esc(d.code):'')+'</div><button type="button">'+esc(copy.cta)+'</button></div></div><div class="promo-spec"><strong>'+esc(fmt.name)+'</strong><span>'+esc(fmt.size)+'</span><span>Stil: '+esc(promoState.style)+'</span></div>';
}
function renderPromoVariants(full){
  const wrap=document.getElementById('promoVariants');if(!wrap)return;
  const d=promoData();wrap.hidden=false;
  wrap.innerHTML=Object.keys(promoStyles).map((style,i)=>{const c=promoCopy(d,i),s=promoStyles[style];return '<article class="promo-variant"><div class="promo-mini" style="background:'+s.bg+';color:'+s.text+';font-family:'+s.font+'"><small style="color:'+s.accent+'">'+esc(d.discount||'PROMO')+'</small><strong>'+esc(c.headline)+'</strong><span>'+esc(d.price)+'</span><em>'+esc(c.cta)+'</em></div><div class="promo-variant-info">Varijanta '+(i+1)+' · '+esc(style)+'</div></article>';}).join('');
  wrap.querySelectorAll('.promo-variant').forEach((el,i)=>el.onclick=()=>{promoState.style=Object.keys(promoStyles)[i];promoState.variant=i;document.getElementById('promoStyle').value=promoState.style;renderPromo();});
  if(full)document.getElementById('promoPreview')?.scrollIntoView({behavior:'smooth',block:'center'});
}
function downloadPromoPack(){
  const d=promoData(),fmt=promoFormats.find(x=>x.id===promoState.format)||promoFormats[0];
  downloadText('digital-soul-promo-'+fmt.id+'.txt',[fmt.name,fmt.size,'',d.name,d.message,d.oldPrice?'Stara cena: '+d.oldPrice:'',d.price?'Cena: '+d.price:'',d.discount?'Popust: '+d.discount:'',d.deadline?'Rok: '+d.deadline:'',d.code?'Promo kod: '+d.code:'',d.cta?'CTA: '+d.cta:''].filter(Boolean).join('\n'));
}

const packChannels=[
  {id:'instagram',name:'Instagram objava',channel:'Instagram'},
  {id:'story',name:'Story / Reel',channel:'Story / Reel'},
  {id:'facebook',name:'Facebook',channel:'Facebook'},
  {id:'pinterest',name:'Pinterest',channel:'Pinterest'},
  {id:'tiktok',name:'TikTok',channel:'Video scenario'},
  {id:'linkedin',name:'LinkedIn',channel:'LinkedIn'},
  {id:'email',name:'Email',channel:'Email'},
  {id:'web',name:'Web',channel:'Oglas'}
];

function initPromoPackOrchestrator(){
  const wrap=document.getElementById('packChannels');if(!wrap)return;
  const draft=readJSON('digitalSoulPromoPackDraft',{});
  if(draft.channels)promoPackState.channels=draft.channels;
  if(draft.name)document.getElementById('packName').value=draft.name;
  wrap.innerHTML=packChannels.map(x=>'<button type="button" class="pack-channel '+(promoPackState.channels.includes(x.id)?'active':'')+'" data-id="'+x.id+'">'+esc(x.name)+'</button>').join('');
  wrap.querySelectorAll('.pack-channel').forEach(b=>b.onclick=()=>{const id=b.dataset.id;promoPackState.channels=promoPackState.channels.includes(id)?promoPackState.channels.filter(x=>x!==id):[...promoPackState.channels,id];b.classList.toggle('active',promoPackState.channels.includes(id));});
  document.getElementById('buildPack').onclick=()=>buildPromoPack(false);
  document.getElementById('refreshPack').onclick=()=>buildPromoPack(true);
  document.getElementById('copyPack').onclick=copyPromoPack;
  document.getElementById('savePack').onclick=savePromoPack;
  document.getElementById('openPackMockup').onclick=()=>location.href='mockup.html';
  renderSavedPromoPacks();
}
function buildPromoPack(regenerate){
  if(!promoPackState.channels.length){showBox('packWarnings','Izaberi najmanje jedan kanal.');return;}
  const p=productData(),o=readJSON('digitalSoulOffer',{});
  const channels=promoPackState.channels.map(id=>packChannels.find(x=>x.id===id)).filter(Boolean);
  promoPackState.results=channels.map((x,i)=>{const content=makeChannelContent(x.channel);if(regenerate)content.body+='\\n\\nVarijanta '+(i+1)+' generisana ponovo.';return {id:x.id,channel:x.name,title:content.title,body:content.body,meta:p.name+' · '+(o.offerPrice||p.price)};});
  const result=document.getElementById('packResult');if(!result)return;
  result.hidden=false;
  result.innerHTML='<div class="pack-summary"><strong>'+esc(p.name)+'</strong><span>'+esc(document.getElementById('packGoal').value)+'</span><span>'+promoPackState.results.length+' kanala</span></div><div class="pack-cards">'+promoPackState.results.map((x,i)=>'<article class="pack-card"><div class="pack-card-head"><strong>'+esc(x.channel)+'</strong><button class="btn pack-copy" data-i="'+i+'">Kopiraj</button></div><h4>'+esc(x.title)+'</h4><textarea readonly>'+esc(x.body)+'</textarea><small>'+esc(x.meta)+'</small></article>').join('')+'</div>';
  result.querySelectorAll('.pack-copy').forEach(b=>b.onclick=()=>copyText(promoPackState.results[Number(b.dataset.i)].title+'\n\n'+promoPackState.results[Number(b.dataset.i)].body));
}
function copyPromoPack(){if(!promoPackState.results.length)buildPromoPack(false);copyText(promoPackState.results.map(x=>'## '+x.channel+'\n'+x.title+'\n\n'+x.body).join('\n\n'));}
function savePromoPack(){
  if(!promoPackState.results.length)buildPromoPack(false);
  const packs=readJSON('digitalSoulPromoPacks',[]);
  const name=textValue('packName')||'Promo paket '+new Date().toLocaleDateString('sr-RS');
  packs.unshift({id:Date.now(),name,goal:document.getElementById('packGoal').value,channels:promoPackState.channels,results:promoPackState.results,created:new Date().toISOString()});
  writeJSON('digitalSoulPromoPacks',packs.slice(0,20));
  writeJSON('digitalSoulPromoPackDraft',{name,channels:promoPackState.channels});
  renderSavedPromoPacks();
}
function renderSavedPromoPacks(){
  const box=document.getElementById('savedPacks');if(!box)return;
  const packs=readJSON('digitalSoulPromoPacks',[]);
  box.innerHTML=packs.length?packs.map((p,i)=>'<article class="saved-pack"><strong>'+esc(p.name)+'</strong><small>'+p.channels.length+' kanala · '+new Date(p.created).toLocaleDateString('sr-RS')+'</small><div><button class="btn load-pack" data-i="'+i+'">Otvori</button><button class="btn delete-pack" data-i="'+i+'">Obriši</button></div></article>').join(''):'<div class="saved-pack-empty">Još nema sačuvanih promo paketa.</div>';
  box.querySelectorAll('.load-pack').forEach(b=>b.onclick=()=>{const p=packs[Number(b.dataset.i)];document.getElementById('packName').value=p.name;document.getElementById('packGoal').value=p.goal;promoPackState.channels=p.channels;promoPackState.results=p.results;buildPromoPack(false);});
  box.querySelectorAll('.delete-pack').forEach(b=>b.onclick=()=>{packs.splice(Number(b.dataset.i),1);writeJSON('digitalSoulPromoPacks',packs);renderSavedPromoPacks();});
}

function refreshGeneratedAreas(){
  const correction=textValue('correctionInput');
  if(correction)renderQuality(correction);
  if(document.getElementById('promoPreview')&&!document.getElementById('promoPreview').hidden)renderPromo();
}

function showBox(id,message){
  const box=document.getElementById(id);if(!box)return;box.hidden=false;box.textContent=message;
}
function copyText(text){
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(String(text)).catch(()=>downloadText('digital-soul-copy.txt',String(text)));
  else downloadText('digital-soul-copy.txt',String(text));
}
function downloadText(filename,text){
  const blob=new Blob([String(text)],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

document.addEventListener('DOMContentLoaded',()=>{
  initLibrary();
  initIndustryPacks();
  initProductInput();
  initCorrectionEngine();
  initRepurposeEngine();
  initAudienceEngine();
  initCampaignBuilder();
  initCampaignBuilder2();
  initOfferEngine();
  initCco();
  initContentCalendar();
  initVisualPromoEngine();
  initPromoPackOrchestrator();
  document.getElementById('generateContent')?.addEventListener('click',generateContent);
  renderQuality(textValue('correctionInput'));
});