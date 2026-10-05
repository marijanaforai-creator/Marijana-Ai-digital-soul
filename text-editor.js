const editor=document.getElementById('editor');
const title=document.getElementById('docTitle');
const type=document.getElementById('docType');
const saveStatus=document.getElementById('saveStatus');
const STORAGE_KEY='marijanaTextEditorDocument';

function updateStats(){
  const text=editor.innerText.replace(/\s+/g,' ').trim();
  const words=text?text.split(' ').length:0;
  const chars=editor.innerText.length;
  const paragraphs=editor.querySelectorAll('p,h1,h2,h3,blockquote,li').length;
  document.getElementById('wordCount').textContent=words;
  document.getElementById('charCount').textContent=chars;
  document.getElementById('paragraphCount').textContent=paragraphs;
}
function saveDocument(){
  const data={title:title.value,type:type.value,html:editor.innerHTML,savedAt:new Date().toISOString()};
  localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
  saveStatus.textContent='Sačuvano lokalno · '+new Date().toLocaleTimeString('sr-RS',{hour:'2-digit',minute:'2-digit'});
}
function loadDocument(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;
    const data=JSON.parse(raw);
    if(data.title)title.value=data.title;
    if(data.type)type.value=data.type;
    if(data.html)editor.innerHTML=data.html;
    saveStatus.textContent='Učitano iz lokalnog čuvanja';
  }catch(e){console.warn('Dokument nije mogao da se učita',e)}
}
function exec(command,value=null){
  editor.focus();
  document.execCommand(command,false,value);
  updateStats();
  scheduleSave();
}
function scheduleSave(){
  clearTimeout(window.__editorSaveTimer);
  window.__editorSaveTimer=setTimeout(saveDocument,700);
}
document.querySelectorAll('[data-cmd]').forEach(btn=>btn.addEventListener('mousedown',e=>{
  e.preventDefault();exec(btn.dataset.cmd,btn.dataset.value||null);
}));
document.getElementById('blockFormat').addEventListener('change',e=>{
  exec('formatBlock',e.target.value);
});
document.getElementById('fontFamily').addEventListener('change',e=>exec('fontName',e.target.value));
document.getElementById('fontSize').addEventListener('change',e=>exec('fontSize',e.target.value));
document.getElementById('insertLink').addEventListener('mousedown',e=>{
  e.preventDefault();editor.focus();
  const url=prompt('Unesi URL linka:','https://');
  if(url)document.execCommand('createLink',false,url);
  scheduleSave();
});
document.getElementById('insertDivider').addEventListener('mousedown',e=>{e.preventDefault();exec('insertHorizontalRule')});
document.getElementById('clearFormat').addEventListener('mousedown',e=>{e.preventDefault();exec('removeFormat')});

document.querySelectorAll('[data-insert]').forEach(btn=>btn.addEventListener('click',()=>{
  const templates={
    heading:'<h1>Naslov dokumenta</h1><p>Kratak uvod koji objašnjava temu i daje čitaocu razlog da nastavi.</p>',
    sections:'<h2>Uvod</h2><p>Uvodni deo dokumenta.</p><h2>Glavni deo</h2><p>Glavni sadržaj i objašnjenja.</p><h2>Zaključak</h2><p>Najvažnije poruke na kraju.</p>',
    checklist:'<h2>Kontrolna lista</h2><ul><li>Prvi korak</li><li>Drugi korak</li><li>Treći korak</li></ul>',
    quote:'<blockquote>Najvažnija poruka koju želiš da čitalac zapamti.</blockquote>',
    cta:'<h2>Sledeći korak</h2><p><strong>Spreman/na si da nastaviš?</strong> Dodaj ovde svoj poziv na akciju.</p>'
  };
  editor.focus();document.execCommand('insertHTML',false,templates[btn.dataset.insert]);updateStats();scheduleSave();
}));
document.querySelectorAll('[data-tool]').forEach(btn=>btn.addEventListener('click',()=>{
  const action=btn.dataset.tool;
  if(action==='translate'){alert('AI prevod će biti povezan kada uključimo AI API.');return;}
  alert('AI akcija „'+btn.textContent.trim()+'“ je spremna za povezivanje sa AI modulom.');
}));
document.querySelectorAll('[data-convert]').forEach(btn=>btn.addEventListener('click',()=>{
  const action=btn.dataset.convert;
  if(action==='outline'){
    editor.innerHTML='<h1>'+escapeHtml(title.value)+'</h1><h2>Uvod</h2><p>Glavna tema i cilj dokumenta.</p><h2>Ključne tačke</h2><ul><li>Tačka 1</li><li>Tačka 2</li><li>Tačka 3</li></ul><h2>Sledeći korak</h2><p>Zaključak i poziv na akciju.</p>';
  }else if(action==='social'){
    editor.innerHTML='<h1>Objava</h1><p>'+escapeHtml(editor.innerText.slice(0,280))+'</p><p><strong>Poziv na akciju:</strong> Saznaj više.</p>';
  }else if(action==='email'){
    editor.innerHTML='<h1>Email</h1><p><strong>Naslov:</strong> Važna poruka za tvoju publiku</p><p>'+escapeHtml(editor.innerText.slice(0,700))+'</p><p><strong>CTA:</strong> Saznaj više →</p>';
  }else if(action==='checklist'){
    const lines=editor.innerText.split(/\n+/).map(x=>x.trim()).filter(Boolean).slice(0,12);
    editor.innerHTML='<h1>Kontrolna lista</h1><ul>'+lines.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
  }
  updateStats();scheduleSave();
}));
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

document.getElementById('saveDocument').addEventListener('click',saveDocument);
document.getElementById('newDocument').addEventListener('click',()=>{
  if(confirm('Napravi novi dokument? Trenutni sadržaj ostaje sačuvan lokalno dok ga ne zameniš.')){
    title.value='Moj novi dokument';type.value='document';editor.innerHTML='<h1>Počni ovde</h1><p>Počni da pišeš...</p>';updateStats();scheduleSave();
  }
});
document.getElementById('exportTxt').addEventListener('click',()=>{
  downloadFile((title.value||'dokument')+'.txt',editor.innerText,'text/plain;charset=utf-8');
});
document.getElementById('exportHtml').addEventListener('click',()=>{
  const html='<!doctype html><html lang="sr"><head><meta charset="utf-8"><title>'+escapeHtml(title.value)+'</title></head><body>'+editor.innerHTML+'</body></html>';
  downloadFile((title.value||'dokument')+'.html',html,'text/html;charset=utf-8');
});
function downloadFile(name,content,type){
  const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);
}
document.getElementById('openCanvas').addEventListener('click',()=>{
  localStorage.setItem('marijanaEditorToCanvas',JSON.stringify({title:title.value,html:editor.innerHTML}));
  location.href='canvas.html?from=text-editor';
});
editor.addEventListener('input',()=>{updateStats();scheduleSave()});
title.addEventListener('input',scheduleSave);type.addEventListener('change',scheduleSave);
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();saveDocument();}
});
loadDocument();updateStats();
