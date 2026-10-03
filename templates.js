const templates=[
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
const industryPacks=[
 {id:'food-store',name:'Prehrambena prodavnica',desc:'Akcije, proizvodi nedelje, nova ponuda, sezonske kampanje',cat:'business'},
 {id:'local-producer',name:'Domaći proizvođač',desc:'Priča o proizvođaču, proizvod, porudžbine i lokalna promocija',cat:'product'},
 {id:'bakery',name:'Pekara',desc:'Svež proizvod, dnevna ponuda, akcije i jutarnje kampanje',cat:'business'},
 {id:'butcher',name:'Mesara',desc:'Ponuda, sveži proizvodi, vikend akcije i promocije',cat:'business'},
 {id:'honey',name:'Med i pčelarstvo',desc:'Proizvod, poreklo, edukacija i prodajna promocija',cat:'product'},
 {id:'dairy',name:'Sir i mlečni proizvodi',desc:'Novi proizvodi, degustacije, ponude i lokalna prodaja',cat:'product'},
 {id:'winter',name:'Zimnica i domaće prerađevine',desc:'Sezonska prodaja, poklon paketi i porudžbine',cat:'product'},
 {id:'farm',name:'Poljoprivredno gazdinstvo',desc:'Proizvodi sa gazdinstva, sezona, dostupnost i porudžbine',cat:'lifestyle'}
];



const productInputFields=['productName','productPrice','productBenefit','productProof','productLocation','productCta','productDescription'];
function initProductInput(){
 const save=document.getElementById('saveProductInput');if(!save)return;
 const key='digitalSoulProductInput';const data=JSON.parse(localStorage.getItem(key)||'{}');
 productInputFields.forEach(id=>{const el=document.getElementById(id);if(el&&data[id])el.value=data[id]});
 save.onclick=()=>{const out={};productInputFields.forEach(id=>{const el=document.getElementById(id);if(el)out[id]=el.value.trim()});localStorage.setItem(key,JSON.stringify(out));const ok=document.getElementById('productSaved');ok.hidden=false;setTimeout(()=>ok.hidden=true,2200)};
}
\n
const audienceProfiles={
 general:'Koristi jasnu i razumljivu komunikaciju bez pretpostavki o predznanju.',
 local:'Naglasak na lokaciji, dostupnosti, poverenju i praktičnim informacijama.',
 b2c:'Fokus na korist za pojedinca, jednostavnu ponudu i jasan sledeći korak.',
 b2b:'Fokus na poslovnu vrednost, rezultat, proces i relevantne informacije.',
 professionals:'Koristi precizniji terminološki i stručniji ton.',
 beginners:'Objasni jednostavno, korak po korak, bez nepotrebnog žargona.',
 returning:'Nadoveži se na postojeći odnos, prethodno iskustvo i sledeću vrednost.'
};
const platformProfiles={
 Instagram:'Vizuelno, kratko, jak početak i jasan CTA.',
 Facebook:'Kontekstualnije, razgovorno i pogodno za detaljniji opis.',
 Pinterest:'Opisno, korisno i fokusirano na temu, pretragu i dugoročnu vrednost.',
 LinkedIn:'Profesionalno, konkretno i usmereno na poslovnu vrednost.',
 TikTok:'Brz hook, kratke scene i prirodan govor.',
 Email:'Jasan subject, uvod, vrednost i jedan primarni CTA.',
 Web:'Informativno, strukturisano i prilagođeno skeniranju.'
};
const formatProfiles={
 Objavа:'Strukturirana objava sa hookom, glavnom porukom i CTA-om.',
 'Story':'Kratke sekvence sa jednom porukom po ekranu.',
 'Reel / TikTok':'Hook → problem/tema → benefit → CTA.',
 Pin:'Naslov + koristan opis + ključna tema + CTA.',
 Email:'Subject → uvod → vrednost → CTA.',
 Oglas:'Hook → ponuda/benefit → dokaz → CTA.',
 Blog:'Naslov → uvod → podnaslovi → vrednost → zaključak.'
};
function initAudienceEngine(){
 const apply=document.getElementById('applyAudience');if(!apply)return;
 apply.onclick=()=>{
  const a=document.getElementById('audienceType').value,p=document.getElementById('contentPlatform').value,f=document.getElementById('contentFormat').value;
  localStorage.setItem('digitalSoulAudienceSettings',JSON.stringify({audience:a,platform:p,format:f}));
  const box=document.getElementById('audienceGuidance');box.hidden=false;
  box.innerHTML='<strong>Prilagođavanje:</strong><br>'+audienceProfiles[a]+'<br><br><strong>'+p+':</strong> '+platformProfiles[p]+'<br><strong>'+f+':</strong> '+(formatProfiles[f]||'Prilagodi strukturu izabranom formatu.');
 };
}
\nconst purposeBriefs={
 'Reklama':{hook:'Pažnja / problem / potreba',headline:'Jasna glavna poruka ponude',benefit:'Zašto je ponuda korisna kupcu',proof:'Dokaz, kvalitet ili razlog za poverenje',cta:'Pozovi kupca na sledeći korak'},
 'Prodaja':{hook:'Ponuda koja privlači pažnju',headline:'Šta se prodaje i zašto sada',benefit:'Ključna korist proizvoda',proof:'Cena, dostupnost ili konkretna vrednost',cta:'Poruči / kupi / javi se'},
 'Akcija':{hook:'Akcija / ograničena ponuda',headline:'Šta je sniženo ili posebno',benefit:'Ušteda ili dodatna vrednost',proof:'Period važenja ili dostupnost',cta:'Iskoristi ponudu'},
 'Novi proizvod':{hook:'Predstavljanje noviteta',headline:'Novi proizvod u fokusu',benefit:'Glavna karakteristika i korist',proof:'Poreklo, kvalitet ili posebnost',cta:'Saznaj više / poruči'},
 'Brend':{hook:'Priča koja gradi prepoznatljivost',headline:'Ko smo i po čemu smo posebni',benefit:'Vrednost za kupca',proof:'Priča, poreklo, iskustvo ili standard',cta:'Upoznaj brend'},
 'Edukacija':{hook:'Korisna činjenica ili pitanje',headline:'Šta kupac treba da zna',benefit:'Praktična korist informacije',proof:'Činjenica ili izvor koji podržava poruku',cta:'Saznaj više'},
 'Sezona':{hook:'Sezonska potreba',headline:'Ponuda za aktuelni period',benefit:'Zašto je sada pravi trenutak',proof:'Dostupnost / sezonski detalj',cta:'Poruči na vreme'},
 'Lokalna promocija':{hook:'Poziv lokalnoj zajednici',headline:'Ponuda dostupna u vašem kraju',benefit:'Blizina, svežina ili lokalna vrednost',proof:'Lokacija / radno vreme / dostupnost',cta:'Poseti nas / javi se'}
};
function renderContentBrief(ind,purpose){
 const brief=purposeBriefs[purpose]||purposeBriefs.Reklama, box=document.getElementById('contentBrief');if(!box)return;
 box.hidden=false;box.innerHTML='<h3>Content Brief · '+ind.name+'</h3><div class="brief-grid">'+[['Hook',brief.hook],['Naslov',brief.headline],['Benefit',brief.benefit],['Dokaz',brief.proof],['CTA',brief.cta],['Kanali','Instagram · Facebook · Pinterest · Story / Reel']].map(x=>'<div class="brief-item"><strong>'+x[0]+'</strong>'+x[1]+'</div>').join('')+'</div>';
}
\nconst campaignPurposes=['Reklama','Prodaja','Akcija','Novi proizvod','Brend','Edukacija','Sezona','Lokalna promocija'];
const campaignFormats=['Instagram objava','Story / Reel','Facebook objava','Pinterest pin','Promo poster','Banner'];
const ci=document.getElementById('campaignIndustry'),cp=document.getElementById('campaignPurpose'),cf=document.getElementById('campaignFormats'),cr=document.getElementById('campaignResult');
function initCampaignBuilder(){
 if(!ci)return;
 ci.innerHTML=industryPacks.map(p=>'<option value="'+p.id+'">'+p.name+'</option>').join('');
 cp.innerHTML=campaignPurposes.map(p=>'<option>'+p+'</option>').join('');
 cf.innerHTML=campaignFormats.map((p,i)=>'<button type="button" class="campaign-format '+(i<3?'active':'')+'">'+p+'</button>').join('');
 cf.querySelectorAll('.campaign-format').forEach(b=>b.onclick=()=>b.classList.toggle('active'));
 document.getElementById('buildCampaign').onclick=()=>{
   const ind=industryPacks.find(p=>p.id===ci.value)||industryPacks[0];
   const selected=[...cf.querySelectorAll('.campaign-format.active')].map(x=>x.textContent);
   if(!selected.length){cr.hidden=false;cr.innerHTML='<strong>Izaberi bar jedan format.</strong>';return}
   cr.hidden=false;
   renderContentBrief(ind,cp.value); cr.innerHTML='<strong>'+ind.name+' · '+cp.value+'</strong><div>Pripremljen paket za '+selected.length+' formata:</div><ul>'+selected.map(x=>'<li>'+x+'</li>').join('')+'</ul><div style="margin-top:12px"><button id="openCampaignMockup" class="btn" type="button">Nastavi u Mockup Studio</button></div>';
   document.getElementById('openCampaignMockup').onclick=()=>location.href='mockup.html';
 };
}
\nlet category='all',favorites=JSON.parse(localStorage.getItem('digitalSoulTemplateFavorites')||'[]'),saved=JSON.parse(localStorage.getItem('digitalSoulMockupTemplates')||'[]');
const grid=document.getElementById('libraryGrid'),details=document.getElementById('templateDetails'),search=document.getElementById('librarySearch'),count=document.getElementById('libraryCount'),empty=document.getElementById('libraryEmpty'),sort=document.getElementById('librarySort');
function renderIndustryPacks(){
 const wrap=document.getElementById('industryPacks'); if(!wrap)return;
 wrap.innerHTML='';
 industryPacks.forEach(p=>{const el=document.createElement('button');el.className='industry-pack';el.type='button';el.innerHTML='<strong>'+p.name+'</strong><small>'+p.desc+'</small>';el.onclick=()=>{category=p.cat;const promoFormats=[
{id:'promo-card',name:'Promo kartica',size:'1200 × 1200',group:'digital'},
{id:'instagram-post',name:'Instagram objava',size:'1080 × 1350',group:'digital'},
{id:'instagram-story',name:'Instagram Story',size:'1080 × 1920',group:'digital'},
{id:'reel-cover',name:'Reel cover',size:'1080 × 1920',group:'digital'},
{id:'facebook',name:'Facebook vizual',size:'1200 × 1500',group:'digital'},
{id:'pinterest',name:'Pinterest Pin',size:'1000 × 1500',group:'digital'},
{id:'tiktok',name:'TikTok cover',size:'1080 × 1920',group:'digital'},
{id:'linkedin',name:'LinkedIn vizual',size:'1200 × 627',group:'digital'},
{id:'email-header',name:'Email header',size:'1200 × 600',group:'digital'},
{id:'web-banner',name:'Web banner',size:'1600 × 600',group:'digital'},
{id:'promo-poster',name:'Promo poster',size:'1080 × 1350',group:'print'},
{id:'a4',name:'A4 poster',size:'2480 × 3508',group:'print'},
{id:'a5',name:'A5 poster',size:'1748 × 2480',group:'print'},
{id:'flyer',name:'Letak',size:'1748 × 2480',group:'print'},
{id:'price-list',name:'Cenovnik',size:'1748 × 2480',group:'print'},
{id:'sticker',name:'Promo nalepnica',size:'1200 × 1200',group:'print'}
];
const promoBadges=['Akcija','Novo','-20%','Ograničena ponuda','Bestseller','Domaće','Ručno rađeno','Lokalno','Premium','Besplatna dostava','Novo u ponudi','Poslednji komadi','Sezonski proizvod','Poklon'];
const promoStyles={
luxury:{bg:'#171717',text:'#f7f4ed',accent:'#c7a76c',font:'Georgia,serif'},
minimal:{bg:'#f7f4ed',text:'#20211f',accent:'#8ea386',font:'Arial,sans-serif'},
wellness:{bg:'#e8eee7',text:'#20211f',accent:'#8ea386',font:'Georgia,serif'},
business:{bg:'#e3e8eb',text:'#20211f',accent:'#536675',font:'Arial,sans-serif'},
bold:{bg:'#20211f',text:'#ffffff',accent:'#8ea386',font:'Arial,sans-serif'}
};
let promoState={style:'luxury',format:'promo-card',variant:0};
function promoData(){
 const product=JSON.parse(localStorage.getItem('digitalSoulProductInput')||'{}');
 const offer=JSON.parse(localStorage.getItem('digitalSoulOffer')||'{}');
 return {
 name:product.productName||'Naziv proizvoda',
 price:offer.offerPrice||product.productPrice||'Cena',
 oldPrice:offer.offerOldPrice||'',
 discount:offer.offerDiscount||'',
 deadline:offer.offerDeadline||'',
 code:offer.offerCode||'',
 message:offer.offerMessage||product.productBenefit||product.productDescription||'Glavna korist proizvoda',
 cta:product.productCta||'Saznaj više'
 };
}
function initVisualPromoEngine(){
 const fs=document.getElementById('promoFormat');if(!fs)return;
 fs.innerHTML=promoFormats.map(x=>'<option value="'+x.id+'">'+x.name+' · '+x.size+'</option>').join('');
 fs.value='promo-card';
 const style=document.getElementById('promoStyle');
 style.onchange=()=>{promoState.style=style.value;renderPromo()};
 fs.onchange=()=>{promoState.format=fs.value;renderPromo()};
 document.getElementById('promoBrand').onchange=renderPromo;
 document.getElementById('buildPromo').onclick=()=>{promoState.variant=0;renderPromo()};
 document.getElementById('makeFivePromos').onclick=()=>{promoState.variant=0;renderPromoVariants()};
 document.getElementById('visualOnly').onclick=()=>{promoState.style=promoState.style==='luxury'?'minimal':promoState.style==='minimal'?'wellness':'luxury';style.value=promoState.style;renderPromo()};
 document.getElementById('textOnly').onclick=()=>{promoState.variant++;renderPromo()};
 document.getElementById('priceOnly').onclick=()=>{promoState.variant++;renderPromo()};
 document.getElementById('ctaOnly').onclick=()=>{promoState.variant++;renderPromo()};
 document.getElementById('downloadPromoPack').onclick=()=>downloadPromoPack();
 document.getElementById('createWholePromo').onclick=()=>{renderPromoVariants(true)};
 renderPromo();
}
function promoCopy(d,v){
 const headlines=[
 d.message,
 d.name+' — sada dostupno',
 'Posebna ponuda za '+d.name,
 'Vreme je za '+d.name,
 'Otkrij '+d.name
 ];
 const ctas=[d.cta,'Poruči danas','Saznaj više','Javi se za detalje','Iskoristi ponudu'];
 return {headline:headlines[v%headlines.length],cta:ctas[v%ctas.length]};
}
function renderPromo(){
 const box=document.getElementById('promoPreview');if(!box)return;
 const d=promoData(),p=promoCopy(d,promoState.variant),s=promoStyles[promoState.style],fmt=promoFormats.find(x=>x.id===promoState.format)||promoFormats[0];
 box.hidden=false;
 box.innerHTML='<div class="promo-canvas promo-'+promoState.style+'" style="--promo-bg:'+s.bg+';--promo-text:'+s.text+';--promo-accent:'+s.accent+';--promo-font:'+s.font+'"><div class="promo-brand">'+(document.getElementById('promoBrand').value==='Bez brenda'?'':document.getElementById('promoBrand').value)+'</div><div class="promo-badge">'+(d.discount||'PROMO')+'</div><div class="promo-copy"><div class="promo-format-label">'+fmt.name+'</div><h3>'+p.headline+'</h3><p>'+d.message+'</p><div class="promo-prices">'+(d.oldPrice?'<del>'+d.oldPrice+'</del> ':'')+'<strong>'+d.price+'</strong></div><div class="promo-meta">'+(d.deadline?'Rok: '+d.deadline+' · ':'')+(d.code?'Kod: '+d.code:'')+'</div><button type="button">'+p.cta+'</button></div></div><div class="promo-spec"><strong>'+fmt.name+'</strong><span>'+fmt.size+'</span><span>Stil: '+promoState.style+'</span></div>';
}
function renderPromoVariants(full=false){
 const wrap=document.getElementById('promoVariants');if(!wrap)return;
 const d=promoData();wrap.hidden=false;
 wrap.innerHTML='';
 const variants=Array.from({length:5},(_,i)=>({style:Object.keys(promoStyles)[i%5],variant:i}));
 variants.forEach((v,i)=>{
  const p=promoCopy(d,v.variant),s=promoStyles[v.style];
  const el=document.createElement('article');el.className='promo-variant';
  el.innerHTML='<div class="promo-mini" style="background:'+s.bg+';color:'+s.text+';font-family:'+s.font+'"><small style="color:'+s.accent+'">'+(d.discount||'PROMO')+'</small><strong>'+p.headline+'</strong><span>'+(d.price||'Cena')+'</span><em>'+p.cta+'</em></div><div class="promo-variant-info">Varijanta '+(i+1)+' · '+v.style+'</div>';
  el.onclick=()=>{promoState.style=v.style;promoState.variant=v.variant;document.getElementById('promoStyle').value=v.style;renderPromo()};
  wrap.appendChild(el);
 });
 if(full) document.getElementById('promoPreview').scrollIntoView({behavior:'smooth',block:'center'});
}
function downloadPromoPack(){
 const d=promoData(),fmt=promoFormats.find(x=>x.id===promoState.format)||promoFormats[0];
 const text=[fmt.name,fmt.size,'',d.name,d.message,d.oldPrice?'Stara cena: '+d.oldPrice:'',d.price?'Cena: '+d.price:'',d.discount?'Popust: '+d.discount:'',d.deadline?'Rok: '+d.deadline:'',d.code?'Promo kod: '+d.code:'',d.cta?'CTA: '+d.cta:''].filter(Boolean).join('\n');
 const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='digital-soul-promo-'+fmt.id+'.txt';a.click();URL.revokeObjectURL(url);
}

const promoPackChannels=[
 {id:'instagram',name:'Instagram objava',format:'Objava'},
 {id:'story',name:'Story / Reel',format:'Story'},
 {id:'facebook',name:'Facebook',format:'Objava'},
 {id:'pinterest',name:'Pinterest',format:'Pin'},
 {id:'tiktok',name:'TikTok',format:'Reel / TikTok'},
 {id:'linkedin',name:'LinkedIn',format:'Objava'},
 {id:'email',name:'Email',format:'Email'},
 {id:'web',name:'Web',format:'Blog'}
];
let promoPackState={channels:promoPackChannels.map(x=>x.id),results:[]};
function getPromoPackData(){
 const product=JSON.parse(localStorage.getItem('digitalSoulProductInput')||'{}');
 const offer=JSON.parse(localStorage.getItem('digitalSoulOffer')||'{}');
 const audience=JSON.parse(localStorage.getItem('digitalSoulAudienceSettings')||'{}');
 const campaign=JSON.parse(localStorage.getItem('digitalSoulLastCampaign')||'{}');
 return {
  name:product.productName||'Naziv proizvoda',
  benefit:product.productBenefit||'Glavna korist proizvoda',
  proof:product.productProof||'Kvalitet i razlog za poverenje',
  location:product.productLocation||'',
  cta:product.productCta||'Saznaj više',
  description:product.productDescription||'',
  price:offer.offerPrice||product.productPrice||'Cena',
  oldPrice:offer.offerOldPrice||'',
  discount:offer.offerDiscount||'',
  deadline:offer.offerDeadline||'',
  code:offer.offerCode||'',
  offerMessage:offer.offerMessage||'',
  audience:audience.audience||'general',
  goal:campaign.goal||document.getElementById('packGoal')?.value||'Prodaja'
 };
}
function initPromoPackOrchestrator(){
 const wrap=document.getElementById('packChannels');if(!wrap)return;
 const saved=JSON.parse(localStorage.getItem('digitalSoulPromoPackDraft')||'null');
 const name=document.getElementById('packName');
 if(saved){name.value=saved.name||'';promoPackState.channels=saved.channels||promoPackState.channels}
 wrap.innerHTML=promoPackChannels.map(x=>'<button type="button" class="pack-channel '+(promoPackState.channels.includes(x.id)?'active':'')+'" data-id="'+x.id+'">'+x.name+'</button>').join('');
 wrap.querySelectorAll('.pack-channel').forEach(b=>b.onclick=()=>{
  const id=b.dataset.id;
  promoPackState.channels=promoPackState.channels.includes(id)?promoPackState.channels.filter(x=>x!==id):[...promoPackState.channels,id];
  b.classList.toggle('active',promoPackState.channels.includes(id));
 });
 document.getElementById('buildPack').onclick=buildPromoPack;
 document.getElementById('refreshPack').onclick=()=>buildPromoPack(true);
 document.getElementById('copyPack').onclick=copyPromoPack;
 document.getElementById('savePack').onclick=savePromoPack;
 document.getElementById('openPackMockup').onclick=()=>location.href='mockup.html';
 renderSavedPromoPacks();
}
function makeChannelCopy(channel,d){
 const base=d.offerMessage||d.benefit;
 const headline=d.discount?d.name+' — '+d.discount+'':'Ponuda: '+d.name;
 const price=d.oldPrice?d.oldPrice+' → '+d.price:d.price;
 if(channel==='instagram')return {title:headline,body:base+' '+d.name+'. '+d.benefit+'.'+(d.proof?' '+d.proof+'.':'')+' '+d.cta+'.',meta:'Cena: '+price+(d.deadline?' · '+d.deadline:'')};
 if(channel==='story')return {title:'STORY / REEL HOOK',body:headline+'\n\n'+d.benefit+'\n\nCena: '+price+'\n\n'+d.cta,meta:d.code?'Kod: '+d.code:''};
 if(channel==='facebook')return {title:headline,body:base+'\n\n'+d.description+'\n\n'+d.proof+'\nCena: '+price+(d.deadline?'\nRok: '+d.deadline:'')+'\n\n'+d.cta,meta:d.location};
 if(channel==='pinterest')return {title:d.name+' | '+(d.benefit||'Ponuda'),body:base+' '+d.proof+'. '+d.benefit+'. '+d.cta+'.',meta:'Ključne teme: '+d.name+', ponuda, proizvod, '+(d.location||'lokalna kupovina')};
 if(channel==='tiktok')return {title:'Hook: '+headline,body:'0–3s: '+headline+'\n3–7s: '+d.benefit+'\n7–12s: '+base+'\n12–15s: '+d.cta,meta:'CTA: '+d.cta};
 if(channel==='linkedin')return {title:headline,body:d.name+' donosi: '+d.benefit+'.\n\n'+d.proof+'.\n\n'+(d.offerMessage||'Ponuda je dostupna sada.')+'\n\n'+d.cta,meta:'Cilj: '+d.goal};
 if(channel==='email')return {title:'Subject: '+headline,body:'Zdravo,\n\n'+base+'\n\n'+d.benefit+'. '+d.proof+'.\n\nCena: '+price+(d.deadline?'\nRok: '+d.deadline:'')+(d.code?'\nKod: '+d.code:'')+'\n\n'+d.cta,meta:'Email kampanja'};
 return {title:headline,body:d.name+'\n\n'+base+'\n\nKorist: '+d.benefit+'\nKvalitet: '+d.proof+'\nCena: '+price+'\n\n'+d.cta,meta:'Web sadržaj'};
}
function buildPromoPack(regenerate=false){
 const result=document.getElementById('packResult'),warnings=document.getElementById('packWarnings');
 if(!promoPackState.channels.length){warnings.hidden=false;warnings.innerHTML='<strong>Izaberi najmanje jedan kanal.</strong>';return}
 const d=getPromoPackData();
 const missing=[];if(d.name==='Naziv proizvoda')missing.push('naziv proizvoda');if(d.price==='Cena')missing.push('cena');if(d.cta==='Saznaj više')missing.push('CTA');
 warnings.hidden=!missing.length;warnings.innerHTML=missing.length?'<strong>Preporuka:</strong> dopuni: '+missing.join(', ')+'. Paket može biti generisan i bez ovih podataka.':'';
 promoPackState.results=promoPackState.channels.map((id,i)=>({id,channel:promoPackChannels.find(x=>x.id===id).name,...makeChannelCopy(id,d),variant:regenerate?Date.now()+i:i}));
 result.hidden=false;
 result.innerHTML='<div class="pack-summary"><strong>'+d.name+'</strong><span>'+d.goal+'</span><span>'+promoPackState.results.length+' kanala</span></div><div class="pack-cards">'+promoPackState.results.map((x,i)=>'<article class="pack-card"><div class="pack-card-head"><strong>'+x.channel+'</strong><button type="button" class="btn pack-copy" data-index="'+i+'">Kopiraj</button></div><h4>'+x.title+'</h4><textarea readonly>'+x.body+'</textarea><small>'+x.meta+'</small></article>').join('')+'</div>';
 result.querySelectorAll('.pack-copy').forEach(b=>b.onclick=()=>{const x=promoPackState.results[Number(b.dataset.index)];navigator.clipboard?.writeText(x.title+'\n\n'+x.body);b.textContent='Kopirano ✓';setTimeout(()=>b.textContent='Kopiraj',1500)});
}
function copyPromoPack(){
 if(!promoPackState.results.length)buildPromoPack();
 const text=promoPackState.results.map(x=>'## '+x.channel+'\n'+x.title+'\n\n'+x.body+'\n'+x.meta).join('\n\n');
 navigator.clipboard?.writeText(text);
}
function savePromoPack(){
 if(!promoPackState.results.length)buildPromoPack();
 const name=document.getElementById('packName').value.trim()||'Promo paket '+new Date().toLocaleDateString('sr-RS');
 const packs=JSON.parse(localStorage.getItem('digitalSoulPromoPacks')||'[]');
 packs.unshift({id:Date.now(),name,goal:document.getElementById('packGoal').value,channels:promoPackState.channels,results:promoPackState.results,created:new Date().toISOString()});
 localStorage.setItem('digitalSoulPromoPacks',JSON.stringify(packs.slice(0,20)));
 localStorage.setItem('digitalSoulPromoPackDraft',JSON.stringify({name,channels:promoPackState.channels}));
 renderSavedPromoPacks();
}
function renderSavedPromoPacks(){
 const wrap=document.getElementById('savedPacks');if(!wrap)return;
 const packs=JSON.parse(localStorage.getItem('digitalSoulPromoPacks')||'[]');
 if(!packs.length){wrap.innerHTML='<div class="saved-pack-empty">Još nema sačuvanih promo paketa.</div>';return}
 wrap.innerHTML=packs.map((p,i)=>'<article class="saved-pack"><strong>'+p.name+'</strong><small>'+p.channels.length+' kanala · '+new Date(p.created).toLocaleDateString('sr-RS')+'</small><div><button class="btn load-pack" data-index="'+i+'">Otvori</button><button class="btn delete-pack" data-index="'+i+'">Obriši</button></div></article>').join('');
 wrap.querySelectorAll('.load-pack').forEach(b=>b.onclick=()=>{const p=packs[Number(b.dataset.index)];document.getElementById('packName').value=p.name;document.getElementById('packGoal').value=p.goal;promoPackState.channels=p.channels;promoPackState.results=p.results;initPromoPackOrchestrator();document.getElementById('packResult').hidden=false;document.getElementById('packResult').innerHTML='<div class="pack-summary"><strong>'+p.name+'</strong><span>'+p.goal+'</span><span>'+p.results.length+' kanala</span></div><div class="pack-cards">'+p.results.map(x=>'<article class="pack-card"><div class="pack-card-head"><strong>'+x.channel+'</strong></div><h4>'+x.title+'</h4><textarea readonly>'+x.body+'</textarea><small>'+x.meta+'</small></article>').join('')+'</div>'});
 wrap.querySelectorAll('.delete-pack').forEach(b=>b.onclick=()=>{packs.splice(Number(b.dataset.index),1);localStorage.setItem('digitalSoulPromoPacks',JSON.stringify(packs));renderSavedPromoPacks()});
}
\ndocument.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));search.value=p.name.split(' ')[0];render();renderIndustryPacks();document.getElementById('libraryGrid').scrollIntoView({behavior:'smooth',block:'start'})};wrap.appendChild(el)})
}
function render(){
let q=(search.value||'').toLowerCase().trim(), list;
if(category==='mine'){
 list=saved.map((t,i)=>({id:'saved-'+i,name:t.name||('Sačuvan šablon '+(i+1)),cat:'mine',label:'Moji šabloni',bg:t.bg||'#eee',wide:false,saved:t}));
}else{
 list=templates.filter(t=>(category==='all'||category===t.cat)&&(!q||[t.name,t.label,t.cat].join(' ').toLowerCase().includes(q)));
}
if(sort.value==='az')list.sort((a,b)=>a.name.localeCompare(b.name));else if(sort.value==='new')list.reverse();
count.textContent=list.length+' šablona';grid.innerHTML='';empty.hidden=!!list.length;
list.forEach(t=>{
 const el=document.createElement('article');el.className='template-card';
 el.innerHTML='<div class="template-preview '+(t.wide?'wide':'')+'" style="background:'+t.bg+'"></div><div class="template-info"><strong>'+t.name+'</strong><small>'+t.label+'</small><div class="template-actions"><button class="btn use">Koristi šablon</button><button class="btn fav">'+(favorites.includes(t.id)?'♥':'♡')+'</button></div></div>';
 el.querySelector('.fav').onclick=()=>{favorites=favorites.includes(t.id)?favorites.filter(x=>x!==t.id):[...favorites,t.id];localStorage.setItem('digitalSoulTemplateFavorites',JSON.stringify(favorites));render()};
 el.querySelector('.use').onclick=()=>location.href='mockup.html'+(t.saved?'':'?template='+encodeURIComponent(t.id));
el.querySelector('.template-info strong').onclick=()=>showDetails(t);
 grid.appendChild(el)
})}
function showDetails(t){
 if(!details)return;
 details.hidden=false;
 details.innerHTML='<div class="template-details-preview '+(t.wide?'wide':'')+'" style="background:'+t.bg+'"></div><div class="template-details-info"><div class="kicker">TEMPLATE</div><h2>'+t.name+'</h2><p>Gotov šablon za '+t.label+'. Prilagodi boje, sadržaj, poziciju i format u Mockup Studio.</p><div class="template-tags"><span class="template-tag">'+t.label+'</span><span class="template-tag">'+(t.type==='premium'?'Premium':'Besplatno')+'</span><span class="template-tag">'+(t.price?'€'+t.price:'0 €')+'</span><span class="template-tag">'+(t.license||'Prilagodljiv')+'</span></div><div class="template-details-actions"><button id="detailUse" class="btn">Koristi ovaj šablon</button><button id="detailFav" class="btn">'+(favorites.includes(t.id)?'♥ U favoritima':'♡ Dodaj u favorite')+'</button><button id="detailClose" class="btn template-details-close">Zatvori</button></div></div>';
 details.querySelector('#detailUse').onclick=()=>location.href='mockup.html'+(t.saved?'':'?template='+encodeURIComponent(t.id));
 details.querySelector('#detailFav').onclick=()=>{favorites=favorites.includes(t.id)?favorites.filter(x=>x!==t.id):[...favorites,t.id];localStorage.setItem('digitalSoulTemplateFavorites',JSON.stringify(favorites));showDetails(t);render()};
 details.querySelector('#detailClose').onclick=()=>{details.hidden=true};
 details.scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
search.oninput=render;sort.onchange=render;initCampaignBuilder();initProductInput();initCorrectionEngine();initRepurposeEngine();initAudienceEngine();initCampaignBuilder2();initOfferEngine();initVisualPromoEngine();initPromoPackOrchestrator();document.getElementById('generateContent')?.addEventListener('click',generateContent);document.getElementById('libraryFavorites').onclick=()=>{category=category==='mine'?'all':'mine';document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));render()};render();