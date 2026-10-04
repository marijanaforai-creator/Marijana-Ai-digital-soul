const templates={
workbook:['Naslovna','Kako koristiti ovu radnu svesku','Uvod u temu','Lekcija / objašnjenje','Radna vežba','Tabela / analiza','Checklist','Prostor za beleške','Plan akcije','Završna strana'],
planner:['Naslovna','Kako koristiti planer','Moji ciljevi','Prioriteti','Dnevni plan','Nedeljni pregled','Habit tracker','Budget / praćenje','Refleksija','Plan narednog perioda'],
document:['Naslovna','Sadržaj','Uvod','Glavni deo','Detalji / sekcija','Tabela ili podaci','Zaključak','Napomene','Kontakt / izvori'],
presentation:['Naslovni slajd','Problem / kontekst','Cilj','Ključna poruka','Podaci / dokaz','Rešenje','Proces','Ponuda','Sledeći korak','Završni slajd'],
cv:['Ime i profesionalni naslov','Profil','Iskustvo','Ključne veštine','Projekti','Obrazovanje','Sertifikati','Jezici','Kontakt'],
ebook:['Naslovna','Impresum / napomena','Sadržaj','Uvod','Poglavlje 1','Poglavlje 2','Poglavlje 3','Vežba / primer','Zaključak','O autoru'],
guide:['Naslovna','Sadržaj','Uvod','Korak 1','Korak 2','Korak 3','Checklist','Najčešće greške','Plan akcije','Završna strana'],
worksheet:['Naslovna / tema','Uputstvo','Pitanja','Vežba 1','Vežba 2','Tabela','Refleksija','Sledeći korak'],
social:['Instagram objava','Story','Reel cover','Pinterest pin','LinkedIn vizual','Facebook objava','Email header','Promo poster']};
const $=id=>document.getElementById(id);
let generated=[];
function makeStructure(){
 const type=$('layoutType').value, count=Math.max(1,Math.min(100,Number($('layoutPages').value)||8));
 const base=templates[type]||templates.workbook;
 generated=Array.from({length:count},(_,i)=>({number:i+1,title:base[i%base.length],description:describe(base[i%base.length],type)}));
 render();
 $('layoutStatus').textContent='Layout je pripremljen. Svaka stranica je zaseban editabilni korak koji možemo dalje povezati sa Canvas editorom.';
}
function describe(title,type){
 if(/Naslov|Ime/.test(title))return 'Glavna hijerarhija, naslov, podnaslov i vizuelni uvod.';
 if(/Tabela|tracker|podaci/.test(title))return 'Strukturisana mreža sa poljima za unos i pregled.';
 if(/vežb|Pitanja|Refleksija/.test(title))return 'Prostor za pitanja, odgovore i praktičan rad.';
 if(/Checklist/.test(title))return 'Lista sa kućicama i jasnim redosledom koraka.';
 if(type==='presentation')return 'Jedna glavna poruka po slajdu, sa jasnom vizuelnom hijerarhijom.';
 return 'Naslov, pomoćni tekst, sadržajni blokovi i prostor za uređivanje.';
}
function render(){
 $('layoutOutput').hidden=false;$('layoutMeta').textContent=generated.length+' stranica · '+$('layoutFormat').value+' · '+$('layoutStyle').value;
 $('pagePreview').classList.remove('empty');$('pagePreview').innerHTML=generated.slice(0,5).map(p=>'<div class="mini-page"><span class="num">'+String(p.number).padStart(2,'0')+'</span><strong>'+p.title+'</strong><small>'+p.description+'</small></div>').join('');
 $('pageCards').innerHTML=generated.map(p=>'<article class="page-card"><span class="num">'+String(p.number).padStart(2,'0')+'</span><h3>'+p.title+'</h3><p>'+p.description+'</p></article>').join('');
}
$('generateLayout').onclick=()=>{if(!$('layoutPrompt').value.trim()){ $('layoutStatus').textContent='Napiši šta želiš da napraviš.';return}makeStructure()};
$('clearLayout').onclick=()=>{generated=[];$('layoutOutput').hidden=true;$('pagePreview').className='page-preview empty';$('pagePreview').textContent='Ovde će se pojaviti generisane stranice.';$('layoutStatus').textContent=''};
$('downloadStructure').onclick=()=>{const blob=new Blob([JSON.stringify({prompt:$('layoutPrompt').value,format:$('layoutFormat').value,style:$('layoutStyle').value,pages:generated},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='marijana-layout.json';a.click();URL.revokeObjectURL(a.href)};
$('openCanvas').onclick=()=>{localStorage.setItem('marijanaGeneratedLayout',JSON.stringify({prompt:$('layoutPrompt').value,format:$('layoutFormat').value,style:$('layoutStyle').value,pages:generated}));location.href='canvas.html'};
