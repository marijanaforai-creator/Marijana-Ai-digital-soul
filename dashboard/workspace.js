const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);$$('.nav').forEach(b=>b.onclick=()=>{$$('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.view').forEach(v=>v.classList.remove('active'));$('#'+b.dataset.view+'View').classList.add('active')});const editor=$('#editor');function stats(){const t=editor.innerText.trim();$('#words').textContent=t?t.split(/\s+/).length:0;$('#chars').textContent=t.length;$('#paras').textContent=editor.querySelectorAll('p,h1,h2,h3,blockquote,li').length}editor.addEventListener('input',()=>{stats();localStorage.setItem('marijanaWorkspaceText',editor.innerHTML)});$$('[data-cmd]').forEach(b=>b.onclick=()=>{document.execCommand(b.dataset.cmd,false,null);editor.focus();stats()});$('#format').onchange=e=>{document.execCommand('formatBlock',false,e.target.value);editor.focus()};$('#font').onchange=e=>{document.execCommand('fontName',false,e.target.value);editor.focus()};$('#size').onchange=e=>{document.execCommand('fontSize',false,e.target.value);editor.focus()};$('#link').onclick=()=>{const u=prompt('Unesi URL:');if(u)document.execCommand('createLink',false,u)};$$('[data-action]').forEach(b=>b.onclick=()=>{const m={structure:'<h2>Struktura dokumenta</h2><p>Uvod</p><h2>Glavna sekcija</h2><p>...</p><h2>Zaključak</h2><p>...</p>',checklist:'<h2>Kontrolna lista</h2><ul><li>Stavka 1</li><li>Stavka 2</li><li>Stavka 3</li></ul>',quote:'<blockquote>Istaknuta poruka ili važna misao.</blockquote>',cta:'<h2>Šta je sledeći korak?</h2><p>Pozovi čitaoca na jasnu akciju.</p>'};document.execCommand('insertHTML',false,m[b.dataset.action]);stats()});function download(name,type,data){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}$('#exportTxt').onclick=()=>download('marijana-dokument.txt','text/plain',editor.innerText);$('#exportHtml').onclick=()=>download('marijana-dokument.html','text/html','<!doctype html><html lang="sr"><meta charset="utf-8"><body>'+editor.innerHTML+'</body></html>');$('#print').onclick=()=>window.print();function getDocuments(){try{return JSON.parse(localStorage.getItem('marijanaDocuments')||'[]')}catch(_){return[]}}
function setDocuments(d){localStorage.setItem('marijanaDocuments',JSON.stringify(d))}
function saveCurrentDocument(show=true){
  const docs=getDocuments();const id=localStorage.getItem('marijanaCurrentDocument')||('doc-'+Date.now());
  const existing=docs.findIndex(d=>d.id===id);const item={id,title:(editor.querySelector('h1')?.innerText||'Novi dokument').trim()||'Novi dokument',type:$('#docType').value,format:localStorage.getItem('marijanaCurrentFormat')||'A4',html:editor.innerHTML,updatedAt:new Date().toISOString()};
  if(existing>=0)docs[existing]=item;else docs.unshift(item);setDocuments(docs);localStorage.setItem('marijanaCurrentDocument',id);
  localStorage.setItem('marijanaWorkspaceText',editor.innerHTML);localStorage.setItem('marijanaWorkspaceType',$('#docType').value);
  renderDocumentList();if(show)alert('Dokument je sačuvan.');
}
function openDocument(id){
  const d=getDocuments().find(x=>x.id===id);if(!d)return;
  editor.innerHTML=d.html||'<h1>Novi dokument</h1><p></p>';$('#docType').value=d.type||'Dokument';localStorage.setItem('marijanaCurrentDocument',d.id);localStorage.setItem('marijanaWorkspaceText',editor.innerHTML);stats();document.querySelector('[data-view="editor"]').click();renderDocumentList();
}
function deleteDocument(id){
  const d=getDocuments().find(x=>x.id===id);if(!d)return;
  if(!confirm('Obrisati dokument „'+d.title+'“?'))return;
  const docs=getDocuments().filter(x=>x.id!==id);setDocuments(docs);
  if(localStorage.getItem('marijanaCurrentDocument')===id){
    if(docs[0]){openDocument(docs[0].id)}else{localStorage.removeItem('marijanaCurrentDocument');editor.innerHTML='<h1>Novi dokument</h1><p></p>';stats();renderDocumentList()}
  }else renderDocumentList();
}
function renderDocumentList(){
  const g=document.getElementById('documentList');if(!g)return;const docs=getDocuments();
  g.innerHTML=docs.length?docs.map(d=>'<div class="saved-doc"><button class="saved-doc-open" data-doc="'+d.id+'"><span>📄</span><b>'+String(d.title).replace(/[&<>]/g,'')+'</b><small>'+String(d.type||'Dokument').replace(/[&<>]/g,'')+'</small></button><button class="saved-doc-delete" data-delete-doc="'+d.id+'" title="Obriši">🗑</button></div>').join(''):'<div class="empty-docs">Još nema sačuvanih dokumenata.</div>';
  g.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>openDocument(b.dataset.doc));g.querySelectorAll('[data-delete-doc]').forEach(b=>b.onclick=()=>deleteDocument(b.dataset.deleteDoc));
}
function openNewDocumentModal(){const m=document.getElementById('newDocumentModal');if(m){m.classList.add('is-open');m.setAttribute('aria-hidden','false')}}
function closeNewDocumentModal(){const m=document.getElementById('newDocumentModal');if(m){m.classList.remove('is-open');m.setAttribute('aria-hidden','true')}}
function applyDocumentFormat(format,type){
  if(editor.innerText.trim()&&confirm('Sačuvati trenutni dokument pre kreiranja novog?'))saveCurrentDocument(false);
  const id='doc-'+Date.now();localStorage.setItem('marijanaCurrentDocument',id);localStorage.setItem('marijanaCurrentFormat',format);
  editor.innerHTML='<h1>Novi '+format+'</h1><p></p>';$('#docType').value=type||'Dokument';stats();closeNewDocumentModal();document.querySelector('[data-view="editor"]').click();renderDocumentList();editor.focus();
}
function createNewDocument(){openNewDocumentModal()}
$('#save').onclick=()=>saveCurrentDocument(true);$('#newDoc').onclick=createNewDocument;$('#newDoc2')?.addEventListener('click',createNewDocument);
document.querySelectorAll('[data-close-new-doc]').forEach(b=>b.addEventListener('click',closeNewDocumentModal));
document.querySelectorAll('[data-new-format]').forEach(b=>b.addEventListener('click',()=>applyDocumentFormat(b.dataset.newFormat,b.dataset.formatType)));
document.getElementById('newDocumentModal')?.addEventListener('click',e=>{if(e.target.classList.contains('new-doc-backdrop'))closeNewDocumentModal()});const scanImport=localStorage.getItem('marijanaScanToEditor');
if(scanImport){
  editor.innerHTML='';
  const p=document.createElement('p');
  p.textContent=scanImport;
  editor.appendChild(p);
  localStorage.removeItem('marijanaScanToEditor');
}
const saved=localStorage.getItem('marijanaWorkspaceText');if(saved)editor.innerHTML=saved;stats();renderDocumentList();$('#generateCopy').onclick=()=>{const p=$('#copyPrompt').value.trim();$('#copyResult').textContent=p?'PREDLOG COPYJA

'+p+'

HOOK
Privuci pažnju jasnom koristi.

GLAVNA PORUKA
Objasni problem, rezultat i zašto je ponuda relevantna.

CTA
Saznaj više / Pogledaj ponudu / Započni danas.

Napomena: AI generisanje povezujemo kroz API kada postavimo backend.':'Prvo napiši šta želiš da kreiramo.'};$('#copyText').onclick=()=>navigator.clipboard?.writeText($('#copyResult').innerText);const drop=$('#drop'),file=$('#file');drop.onclick=()=>file.click();drop.ondragover=e=>{e.preventDefault()};drop.ondrop=e=>{e.preventDefault();handleFile(e.dataTransfer.files[0])};file.onchange=e=>handleFile(e.target.files[0]);function handleFile(f){if(!f)return;$('#fileStatus').textContent='Izabran fajl: '+f.name+' ('+Math.round(f.size/1024)+' KB)';localStorage.setItem('marijanaConverterFile',f.name)}$('#convert').onclick=()=>{if($('#fileStatus').textContent.startsWith('Nema'))return alert('Izaberi fajl prvo.');alert('Konverter je pripremljen za povezivanje sa serverskim converter/API servisom.')};
const FORM_LIBRARY=[
['document','📄','Profesionalni dokument','Naslovna strana, uvod, sekcije, zaključak'],['document','📘','E-book','Kompletna struktura digitalne knjige'],['document','📋','Radna sveska','Lekcije, vežbe, pitanja i prostor za rad'],['document','📝','Izveštaj','Executive summary, nalazi, zaključak'],['document','💼','Poslovni predlog','Problem, rešenje, ponuda, sledeći korak'],['document','📑','Brief','Cilj, publika, poruka, rokovi'],['document','📃','Ponuda / Proposal','Usluge, obim, cena i uslovi'],['document','📜','Ugovorni obrazac','Struktura za poslovni dokument'],
['business','💼','Business plan','Misija, tržište, model, finansije'],['business','🧾','Račun / Invoice','Stavke, iznos, rok i podaci'],['business','📦','Ponuda proizvoda','Opis, koristi, cena, CTA'],['business','🤝','Partnerstvo','Predlog saradnje i uslovi'],['business','📇','Kontakt forma','Ime, email, telefon, poruka'],['business','📊','Anketa klijenta','Pitanja za potrebe i feedback'],['business','🗂️','Onboarding forma','Podaci novog klijenta'],['business','🔍','Brief za klijenta','Ciljevi, brend, publika i zahtevi'],
['email','✉️','Newsletter','Naslov, uvod, glavna priča, CTA'],['email','📬','Newsletter nedeljni','Novosti, sadržaj, preporuke, ponuda'],['email','🔁','Email sekvenca','Višedelna automatska sekvenca'],['email','🚀','Welcome sekvenca','Dobrodošlica i prvi koraci'],['email','💰','Prodajna sekvenca','Problem, vrednost, dokaz, ponuda, CTA'],['email','🛒','Abandoned cart','Podsetnik, korist, urgencija'],['email','🎁','Launch sekvenca','Najava, otvaranje, podsetnik, poslednji poziv'],['email','❤️','Nurture sekvenca','Edukacija i izgradnja odnosa'],['email','📢','Promotivni email','Ponuda, benefit i CTA'],['email','🙏','Thank-you email','Zahvalnica i sledeći korak'],
['marketing','📣','Oglas','Hook, problem, benefit, dokaz, CTA'],['marketing','📱','Instagram objava','Hook, telo, CTA, hashtag prostor'],['marketing','🎬','Reels skripta','Hook, scene, voiceover, CTA'],['marketing','📌','Pinterest pin','Naslov, opis, ključne reči, CTA'],['marketing','💼','LinkedIn objava','Hook, priča, stručni uvid, CTA'],['marketing','🛍️','Opis proizvoda','Karakteristike, koristi, FAQ, CTA'],['marketing','🌐','Landing page','Hero, problem, rešenje, dokaz, FAQ, CTA'],['marketing','🎯','Sales page','Kompletna prodajna struktura'],['marketing','📖','Case study','Problem, proces, rezultat, zaključak'],['marketing','⭐','Testimonials','Struktura za izjave korisnika'],
['event','💌','Pozivnica','Događaj, datum, vreme, lokacija, RSVP'],['event','🎉','Rođendanska pozivnica','Tema, detalji i potvrda dolaska'],['event','💍','Venčanje','Ceremonija, lokacija, raspored, RSVP'],['event','🥂','Proslava','Detalji događaja i potvrda'],['event','🏢','Poslovni događaj','Agenda, lokacija, registracija'],['event','🎓','Diploma / Certificate','Ime, priznanje, datum i potpis'],['event','📅','Save the Date','Kratka najava događaja'],['event','🎟️','Event ticket','Događaj, karta, datum i QR prostor'],
['social','📆','Content calendar','Plan objava po danima i platformama'],['social','📲','Story sequence','Višestranična Story struktura'],['social','🧵','Threads objava','Hook i kratka serija poruka'],['social','▶️','YouTube opis','Naslov, opis, linkovi i CTA'],['social','🎙️','Podcast show notes','Sažetak, teme, linkovi'],
['personal','🗓️','Dnevni planer','Prioriteti, zadaci, raspored'],['personal','📅','Nedeljni planer','Ciljevi, obaveze, pregled nedelje'],['personal','🎯','Ciljevi','Cilj, koraci, rok, praćenje'],['personal','✅','Checklist','Zadaci i status'],['personal','🧠','Journal','Pitanja za refleksiju'],['personal','💡','Ideje','Baza ideja i sledeći koraci'],
['education','🎓','Lekcija','Cilj, objašnjenje, primer, vežba'],['education','📝','Worksheet','Pitanja, zadaci i prostor za odgovor'],['education','📚','Study guide','Teme, ključni pojmovi i pitanja'],['education','❓','Quiz','Pitanja i odgovori'],['education','📖','Course outline','Moduli, lekcije i ishodi'],
['finance','💶','Budžet','Prihodi, rashodi, kategorije'],['finance','💳','Finansijski pregled','Obaveze, štednja, ciljevi'],['finance','📈','Investicioni pregled','Ciljevi, alokacija, beleške'],['finance','🧾','Expense tracker','Troškovi i kategorije']
];
function renderForms(){const q=($('#formSearch')?.value||'').toLowerCase(),cat=$('#formCategory')?.value||'all',g=$('#formsGrid');if(!g)return;g.innerHTML=FORM_LIBRARY.filter(x=>(cat==='all'||x[0]===cat)&&(!q||x.join(' ').toLowerCase().includes(q))).map(x=>'<button class="form-card" data-form="'+x[2].replace(/"/g,'&quot;')+'"><i>'+x[1]+'</i><b>'+x[2]+'</b><span>'+x[3]+'</span><em>Otvori →</em></button>').join('');g.querySelectorAll('.form-card').forEach(b=>b.onclick=()=>{localStorage.setItem('marijanaSelectedForm',b.dataset.form);document.querySelector('[data-view="editor"]').click();editor.innerHTML='<h1>'+b.dataset.form+'</h1><p>Kreiraj sadržaj koristeći ovu gotovu strukturu.</p><h2>Uvod</h2><p></p><h2>Glavni sadržaj</h2><p></p><h2>Sledeći korak</h2><p></p>';stats()})}
$('#formSearch')?.addEventListener('input',renderForms);$('#formCategory')?.addEventListener('change',renderForms);renderForms();

const modeButtons=$$('.mode-btn');
function setWorkspaceMode(mode){
  document.body.classList.remove('mode-digital','mode-printable','mode-print');
  document.body.classList.add('mode-'+mode);
  modeButtons.forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  localStorage.setItem('marijanaWorkspaceMode',mode);
  if(mode==='print') setTimeout(()=>window.print(),150);
}
modeButtons.forEach(b=>b.addEventListener('click',()=>setWorkspaceMode(b.dataset.mode)));
setWorkspaceMode(localStorage.getItem('marijanaWorkspaceMode')||'digital');

function projectData(){
  return {version:1,app:'Marijana AI Studio',mode:localStorage.getItem('marijanaWorkspaceMode')||'digital',
    documentType:$('#docType').value,html:editor.innerHTML,forms:FORM_LIBRARY.length,
    exportedAt:new Date().toISOString()};
}
$('#exportProject')?.addEventListener('click',()=>{
  const data=JSON.stringify(projectData(),null,2);
  download('marijana-projekat.json','application/json;charset=utf-8',data);
});
$('#importProject')?.addEventListener('click',()=>$('#projectFile')?.click());
$('#projectFile')?.addEventListener('change',e=>{
  const f=e.target.files?.[0]; if(!f)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(data.html) editor.innerHTML=data.html;
      if(data.documentType) $('#docType').value=data.documentType;
      if(data.mode) setWorkspaceMode(data.mode);
      stats(); localStorage.setItem('marijanaWorkspaceText',editor.innerHTML);
      alert('Projekat je uspešno uvezen.');
    }catch(err){alert('Uvoz nije uspeo. Proveri JSON fajl.');}
  };
  reader.readAsText(f);
  e.target.value='';
});


/* Studio insert tools */
function insertEditorHtml(html){editor.focus();document.execCommand('insertHTML',false,html);stats();}
const elementMap={title:'<h1>Naslov</h1>',subtitle:'<h2>Podnaslov</h2>',text:'<p>Unesi tekst ovde...</p>',quote:'<blockquote>Istaknuta poruka ili važna misao.</blockquote>',button:'<p><a href="#" class="inserted-button">Poziv na akciju</a></p>',card:'<div class="inserted-card"><h3>Naslov kartice</h3><p>Tekst kartice, opis ili ključna informacija.</p></div>'};
document.querySelectorAll('[data-element]').forEach(b=>b.addEventListener('click',()=>insertEditorHtml(elementMap[b.dataset.element])));
document.querySelectorAll('[data-insert]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.insert;if(type==='delete'){const sel=window.getSelection();if(sel&&sel.rangeCount&&!sel.isCollapsed){document.execCommand('delete')}else{const node=sel?.anchorNode?.nodeType===3?sel.anchorNode.parentElement:sel?.anchorNode;if(node&&node!==editor)node.remove()}stats();return}if(type==='divider')insertEditorHtml('<hr>');if(type==='table')insertEditorHtml('<table class="insert-table"><thead><tr><th>Kolona 1</th><th>Kolona 2</th><th>Kolona 3</th></tr></thead><tbody><tr><td>Podatak</td><td>Podatak</td><td>Podatak</td></tr><tr><td>Podatak</td><td>Podatak</td><td>Podatak</td></tr></tbody></table>');if(type==='pagebreak')insertEditorHtml('<div class="page-break"></div>');if(type==='footnote'){const n=editor.querySelectorAll('.footnote-ref').length+1;insertEditorHtml('<sup class="footnote-ref"><a href="#fusnota-'+n+'">['+n+']</a></sup>');let notes=editor.querySelector('.footnotes');if(!notes){insertEditorHtml('<section class="footnotes"><h3>Fusnote</h3><ol></ol></section>');notes=editor.querySelector('.footnotes')}const ol=notes.querySelector('ol');const li=document.createElement('li');li.id='fusnota-'+n;li.contentEditable='true';li.innerHTML='Tekst fusnote...';ol.appendChild(li);stats()}if(type==='link'){const u=prompt('Unesi URL:');if(u)insertEditorHtml('<a href="'+u.replace(/"/g,'&quot;')+'">'+u.replace(/</g,'&lt;')+'</a>')}}));
const imageInput=document.getElementById('imageInput');document.getElementById('insertImage')?.addEventListener('click',()=>imageInput?.click());imageInput?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>insertEditorHtml('<p><img class="image-block" src="'+reader.result+'" alt="'+f.name.replace(/"/g,'&quot;')+'"></p>');reader.readAsDataURL(f);e.target.value='' });
document.getElementById('insertBrand')?.addEventListener('click',()=>{const title=document.getElementById('brandTitle').value.trim()||'Marijana AI Studio';const subtitle=document.getElementById('brandSubtitle').value.trim()||'Digitalni sistemi, sadržaj i kreativni alati';insertEditorHtml('<div class="brand-block"><h1 class="brand-title">'+title.replace(/[&<>]/g,'')+'</h1><p class="brand-subtitle">'+subtitle.replace(/[&<>]/g,'')+'</p></div>')});


/* Napredne dokument alatke */
document.querySelectorAll('[data-insert]').forEach(b=>{
  if(b.dataset.insert==='highlight')b.addEventListener('click',()=>{document.execCommand('hiliteColor',false,'#fff3a3');editor.focus()});
  if(b.dataset.insert==='strike')b.addEventListener('click',()=>{document.execCommand('strikeThrough',false,null);editor.focus()});
  if(b.dataset.insert==='textbox')b.addEventListener('click',()=>insertEditorHtml('<div class="studio-textbox" contenteditable="true">Unesi tekst...</div>'));
  if(b.dataset.insert==='sticky')b.addEventListener('click',()=>insertEditorHtml('<div class="studio-sticky" contenteditable="true"><b>📝 Beleška</b><br>Unesi belešku...</div>'));
  if(b.dataset.insert==='bookmark')b.addEventListener('click',()=>{const id='bookmark-'+Date.now();insertEditorHtml('<a id="'+id+'" class="studio-bookmark">🔖 Bookmark</a>')});
  if(b.dataset.insert==='signature')b.addEventListener('click',()=>insertEditorHtml('<div class="studio-signature" contenteditable="true">✍ Potpis<br><span>Ime i prezime</span></div>'));
  if(b.dataset.insert==='stamp')b.addEventListener('click',()=>insertEditorHtml('<div class="studio-stamp" contenteditable="true">PEČAT</div>'));
  if(b.dataset.insert==='watermark')b.addEventListener('click',()=>insertEditorHtml('<div class="studio-watermark" contenteditable="true">WATERMARK</div>'));
});

/* Canvas zoom + desni klik meni + stranice + clipboard */
let canvasZoom=100;let canvasClipboard='';
function applyCanvasZoom(){const e=document.getElementById('editor');if(!e)return;e.style.transform='scale('+canvasZoom/100+')';e.style.width=(100/(canvasZoom/100))+'%';const z=document.getElementById('zoomValue');if(z)z.textContent=canvasZoom+'%';localStorage.setItem('marijanaCanvasZoom',canvasZoom)}
document.getElementById('zoomIn')?.addEventListener('click',()=>{canvasZoom=Math.min(200,canvasZoom+10);applyCanvasZoom()});document.getElementById('zoomOut')?.addEventListener('click',()=>{canvasZoom=Math.max(40,canvasZoom-10);applyCanvasZoom()});document.getElementById('zoomReset')?.addEventListener('click',()=>{canvasZoom=100;applyCanvasZoom()});canvasZoom=Number(localStorage.getItem('marijanaCanvasZoom')||100);applyCanvasZoom();
const contextMenu=document.createElement('div');contextMenu.className='canvas-context-menu';contextMenu.innerHTML='<button data-context="addPage">＋ Dodaj stranicu</button><button data-context="copy">Kopiraj</button><button data-context="paste">Nalepi</button><button data-context="selectAll">Izaberi sve</button><button data-context="delete">Obriši</button>';document.body.appendChild(contextMenu);
function hideContext(){contextMenu.style.display='none'}document.addEventListener('click',e=>{if(!contextMenu.contains(e.target))hideContext()});editor.addEventListener('contextmenu',e=>{e.preventDefault();contextMenu.style.left=e.clientX+'px';contextMenu.style.top=e.clientY+'px';contextMenu.style.display='block'});
contextMenu.addEventListener('click',async e=>{const b=e.target.closest('[data-context]');if(!b)return;const action=b.dataset.context;hideContext();editor.focus();if(action==='addPage'){insertEditorHtml('<div class="canvas-page-separator">Nova stranica</div><div class="canvas-page"><h1>Nova stranica</h1><p></p></div>');return}if(action==='copy'){const sel=window.getSelection();canvasClipboard=sel&&sel.rangeCount?sel.getRangeAt(0).cloneContents():'';try{await navigator.clipboard?.writeText(sel?.toString()||'')}catch(_){}return}if(action==='paste'){let text='';try{text=await navigator.clipboard?.readText()||''}catch(_){}if(text)insertEditorHtml('<p>'+text.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</p>');else if(canvasClipboard){const range=document.createRange();range.selectNodeContents(editor);range.collapse(false);range.insertNode(canvasClipboard.cloneNode(true));stats()}return}if(action==='selectAll'){const range=document.createRange();range.selectNodeContents(editor);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);return}if(action==='delete'){const sel=window.getSelection();if(sel&&sel.rangeCount&&!sel.isCollapsed){document.execCommand('delete');stats()}else{const active=editor.querySelector(':focus');if(active&&active!==editor)active.remove();}}});
editor.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c'){const sel=window.getSelection();if(sel?.toString())canvasClipboard=sel.getRangeAt(0).cloneContents()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='v')setTimeout(stats,50);if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){/* native select-all */} });
/* Slobodno postavljivi komentari — mogu biti postavljeni bilo gde na platnu */
let lastCommentPoint={x:40,y:40};
contextMenu.insertAdjacentHTML('afterbegin','<button data-context="addComment">💬 Dodaj komentar</button>');
editor.addEventListener('contextmenu',e=>{
  const r=editor.getBoundingClientRect(),z=canvasZoom/100;
  lastCommentPoint={x:Math.max(10,(e.clientX-r.left)/z),y:Math.max(10,(e.clientY-r.top)/z)};
});
function addCanvasComment(x=lastCommentPoint.x,y=lastCommentPoint.y,text='Novi komentar...'){
  const box=document.createElement('div');
  box.className='canvas-comment';
  box.contentEditable='false';
  box.style.left=x+'px';box.style.top=y+'px';
  box.innerHTML='<div class="comment-head"><span>💬 Komentar</span><button class="comment-delete" title="Obriši komentar">×</button></div><div class="comment-body" contenteditable="true"></div>';
  const body=box.querySelector('.comment-body');body.textContent=text;
  box.querySelector('.comment-delete').addEventListener('click',e=>{e.stopPropagation();box.remove();stats()});
  box.addEventListener('click',()=>{document.querySelectorAll('.canvas-comment').forEach(x=>x.classList.remove('is-selected'));box.classList.add('is-selected')});
  box.addEventListener('dblclick',()=>body.focus());
  let dragging=false,sx=0,sy=0,ox=0,oy=0;
  box.addEventListener('pointerdown',e=>{
    if(e.target.closest('.comment-body')||e.target.closest('.comment-delete'))return;
    dragging=true;box.setPointerCapture(e.pointerId);const z=canvasZoom/100;
    sx=e.clientX;sy=e.clientY;ox=parseFloat(box.style.left)||0;oy=parseFloat(box.style.top)||0;e.preventDefault();
  });
  box.addEventListener('pointermove',e=>{
    if(!dragging)return;const z=canvasZoom/100;
    box.style.left=Math.max(0,ox+(e.clientX-sx)/z)+'px';
    box.style.top=Math.max(0,oy+(e.clientY-sy)/z)+'px';
  });
  box.addEventListener('pointerup',e=>{dragging=false;try{box.releasePointerCapture?.(e.pointerId)}catch(_){}stats()});
  editor.appendChild(box);body.focus();stats();return box;
}
document.getElementById('addComment')?.addEventListener('click',()=>addCanvasComment(40,40));
contextMenu.addEventListener('click',e=>{
  const b=e.target.closest('[data-context="addComment"]');if(!b)return;
  hideContext();addCanvasComment(); 
});


/* Moderni SVG icon system — bez emoji zavisnosti */
(function initModernIcons(){
 const icons={
  text:'M4 6h16M4 12h12M4 18h9',copy:'M8 4h10v12M6 7H4v13h10v-2',spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3',scan:'M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3',doc:'M6 3h9l4 4v14H6zM15 3v5h5M9 13h6M9 17h6',convert:'M7 7h10M17 7l-3-3M17 7l-3 3M17 17H7M7 17l3-3M7 17l3 3',grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',folder:'M3 7h7l2 2h9v10H3z',tool:'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1',image:'M4 5h16v14H4zM8 10a2 2 0 100-4 2 2 0 000 4M5 17l4-4 3 3 2-2 5 5',table:'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14M15 5v14',link:'M9 15l-2 2a3 3 0 104 4l3-3M15 9l2-2a3 3 0 10-4-4l-3 3',comment:'M4 5h16v12H8l-4 4z',trash:'M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7',undo:'M9 7L4 12l5 5M4 12h10a6 6 0 010 12',redo:'M15 7l5 5-5 5M20 12H10a6 6 0 000 12',plus:'M12 5v14M5 12h14',minus:'M5 12h14',zoom:'M11 5a6 6 0 100 12 6 6 0 000-12zM16 16l5 5',check:'M5 12l4 4L19 6',edit:'M4 20l4-.8L19 8a2 2 0 00-3-3L5 16z',pen:'M4 20l4-.8L19 8a2 2 0 00-3-3L5 16z',quote:'M6 17h5v-6H7c0-2 1-3 3-4M13 17h5v-6h-4c0-2 1-3 3-4',layout:'M4 4h16v16H4zM4 9h16M10 9v11',print:'M6 9V4h12v5M6 17H4V9h16v8h-2M7 14h10v6H7z',save:'M5 4h12l3 3v13H4V4zM8 4v6h8V4M8 20v-6h8v6',upload:'M12 16V4M8 8l4-4 4 4M5 16v4h14v-4',download:'M12 4v12M8 12l4 4 4-4M5 20h14',mail:'M4 6h16v12H4zM4 7l8 6 8-6',calendar:'M5 4v3M19 4v3M4 8h16M5 6h14v14H5z',pin:'M12 21s6-5.1 6-11a6 6 0 10-12 0c0 5.9 6 11 6 11zM12 13a2 2 0 100-4 2 2 0 000 4',star:'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z'
 };
 const map=[
  ['Tekst & Uređivač','text'],['Copywriter','copy'],['Prompt Studio','spark'],['Scan & OCR','scan'],['Dokumenti','doc'],['Converter','convert'],['Šabloni','grid'],['Sve forme','table'],['Biblioteka','folder'],['AI Digital Expert','spark'],['Alati','tool'],
  ['Ubaci sliku','image'],['Komentar','comment'],['Tabela','table'],['Link','link'],['Delete','trash'],['Obriši','trash'],['Undo','undo'],['Redo','redo'],['Sačuvaj','save'],['Uvoz','upload'],['Izvoz','download'],['Štampaj','print'],['PDF','print'],['Novi dokument','plus'],['Kreiraj','spark'],['Generiši','spark'],['Kopiraj','copy'],['Struktura','layout'],['Kontrolna lista','check'],['Istaknuta poruka','quote'],['CTA','spark'],['E-book','doc'],['Radna sveska','doc'],['Planer','calendar'],['Pozivnica','mail'],['Pinterest','pin']
 ];
 function icon(name){const p=icons[name]||icons.spark;return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+p+'"/></svg>'}
 document.querySelectorAll('button,.nav,.doc-card,.template-grid div,.tool-grid div,.form-card').forEach(el=>{
   const raw=el.textContent.trim(); const hit=map.find(([label])=>raw.includes(label)); if(!hit)return;
   if(el.querySelector('.ui-icon'))return;
   el.dataset.iconName=hit[1]; el.title=el.title||raw.replace(/^[^A-Za-zČĆŽŠĐčćžšđ📄📘📋🗓️💼🧾✉️📣⚙✦✎⌁▤⇄▦📁◇🔴📝🔖✍️🖼️💬🗑️↗▣¹＋→❝↶↷]+/,'');
   const textNodes=[...el.childNodes].filter(n=>n.nodeType===3 && n.textContent.trim());
   if(textNodes.length){const first=textNodes[0];first.textContent=first.textContent.replace(/^[^A-Za-zČĆŽŠĐčćžšđ]+/,'').trim();}
   el.insertAdjacentHTML('afterbegin',icon(hit[1]));
 });
 document.querySelectorAll('.toolbar button[data-cmd]').forEach(el=>{el.classList.add('icon-button');const n=el.textContent.trim();el.title=({B:'Podebljano',I:'Kurziv',U:'Podvučeno',S:'Precrtano',L:'Poravnaj levo',C:'Centriraj',R:'Poravnaj desno'}[n]||el.title);});
 document.querySelectorAll('.canvas-controls button').forEach(el=>el.classList.add('icon-button'));
})();
