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
 industryPacks.forEach(p=>{const el=document.createElement('button');el.className='industry-pack';el.type='button';el.innerHTML='<strong>'+p.name+'</strong><small>'+p.desc+'</small>';el.onclick=()=>{category=p.cat;document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));search.value=p.name.split(' ')[0];render();renderIndustryPacks();document.getElementById('libraryGrid').scrollIntoView({behavior:'smooth',block:'start'})};wrap.appendChild(el)})
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
search.oninput=render;sort.onchange=render;initCampaignBuilder();initProductInput();initCorrectionEngine();initRepurposeEngine();initAudienceEngine();initCampaignBuilder2();document.getElementById('generateContent')?.addEventListener('click',generateContent);document.getElementById('libraryFavorites').onclick=()=>{category=category==='mine'?'all':'mine';document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));render()};render();