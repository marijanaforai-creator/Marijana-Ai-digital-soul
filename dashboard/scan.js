const $=s=>document.querySelector(s);
const file=$('#file'),drop=$('#drop'),result=$('#result');
let selectedFile=null;

$('#choose').onclick=()=>file.click();

file.onchange=e=>{
  const f=e.target.files?.[0];
  if(f) load(f);
};

drop.ondragover=e=>{
  e.preventDefault();
  drop.classList.add('dragging');
};
drop.ondragleave=()=>drop.classList.remove('dragging');
drop.ondrop=e=>{
  e.preventDefault();
  drop.classList.remove('dragging');
  const f=e.dataTransfer.files?.[0];
  if(f) load(f);
};

function load(f){
  const allowed=f.type.startsWith('image/')||f.type==='application/pdf';
  if(!allowed){
    result.textContent='Podržani su PNG, JPG/JPEG, WEBP i PDF fajlovi.';
    return;
  }

  selectedFile=f;
  const p=$('#preview');
  p.innerHTML='';

  if(f.type.startsWith('image/')){
    const img=document.createElement('img');
    img.src=URL.createObjectURL(f);
    img.alt='Pregled fajla';
    p.appendChild(img);
  }else{
    p.textContent='PDF: '+f.name;
  }

  result.textContent='Fajl je učitan. Klikni „Prepoznaj tekst“.';
}

$('#ocr').onclick=async()=>{
  if(!selectedFile){
    result.textContent='Prvo izaberi sliku ili PDF.';
    return;
  }

  if(selectedFile.size>4*1024*1024){
    result.textContent='Fajl je veći od 4 MB. Smanji fajl i pokušaj ponovo.';
    return;
  }

  const activeMode=document.querySelector('.mode.active')?.textContent?.trim()||'Dokument';
  const modeMap={'Dokument':'document','Rukopis':'handwriting','Tabela':'table','Screenshot':'screenshot'};
  const language=$('#lang').value;
  const languageMap={
    'Srpski — latinica':'sr-Latn',
    'Srpski — ćirilica':'sr-Cyrl',
    'English':'English',
    'Magyar':'Magyar'
  };

  const form=new FormData();
  form.append('file',selectedFile);
  form.append('language',languageMap[language]||'sr-Latn');
  form.append('mode',modeMap[activeMode]||'document');

  const button=$('#ocr');
  button.disabled=true;
  button.textContent='Prepoznajem…';
  result.textContent='OCR obrađuje fajl…';

  try{
    const response=await fetch('/api/ocr',{method:'POST',body:form});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.detail||data.error||'OCR nije uspeo.');
    result.textContent=data.text||'Nije pronađen tekst.';
  }catch(error){
    result.textContent='Greška: '+(error.message||'OCR servis nije dostupan.');
  }finally{
    button.disabled=false;
    button.textContent='Prepoznaj tekst';
  }
};

$('#copy').onclick=()=>navigator.clipboard?.writeText(result.innerText);

$('#editor').onclick=()=>{
  localStorage.setItem('marijanaScanToEditor',result.innerText);
  location.href='index.html';
};

$('#canvas').onclick=()=>{
  localStorage.setItem('marijanaScanToCanvas',result.innerText);
  location.href='index.html';
};

document.querySelectorAll('.mode').forEach(button=>{
  button.onclick=()=>{
    document.querySelectorAll('.mode').forEach(x=>x.classList.remove('active'));
    button.classList.add('active');
  };
});
