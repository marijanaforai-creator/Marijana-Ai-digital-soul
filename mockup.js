const imageUpload=document.getElementById('imageUpload');
const previewImage=document.getElementById('previewImage');
const sceneSelect=document.getElementById('sceneSelect');
const scaleRange=document.getElementById('scaleRange');
const rotateRange=document.getElementById('rotateRange');
const bgColor=document.getElementById('bgColor');
const mockupStage=document.getElementById('mockupStage');
const mockupObject=document.getElementById('mockupObject');
const deviceFrame=document.querySelector('.device-frame');
const sceneTitle=document.getElementById('sceneTitle');
const sceneLabel=document.getElementById('sceneLabel');
const scaleValue=document.getElementById('scaleValue');
const rotateValue=document.getElementById('rotateValue');
const statusText=document.getElementById('statusText');
const resetBtn=document.getElementById('resetBtn');
const downloadBtn=document.getElementById('downloadBtn');

let imageData='';
let objectScale=100;
let objectRotation=0;

function updateTransform(){
  mockupObject.style.transform=`scale(${objectScale/100}) rotate(${objectRotation}deg)`;
  scaleValue.textContent=`${objectScale}%`;
  rotateValue.textContent=`${objectRotation}°`;
}

function setScene(value){
  const names={phone:'Telefon',laptop:'Laptop',planner:'Planner',poster:'Poster',business:'Business scena',fitness:'Fitness scena',hotel:'Hotel scena',restaurant:'Restoran scena',yoga:'Yoga scena',beauty:'Beauty scena'};
  mockupObject.className=`mockup-object ${value}-object`;
  mockupStage.className=`mockup-stage scene-${value}`;
  sceneTitle.textContent=names[value]||'Mockup';
  sceneLabel.textContent=(names[value]||'DIGITAL SOUL STUDIO').toUpperCase();
  if(imageData) statusText.textContent=`Slika je postavljena u scenu: ${names[value]||value}.`;
}

function loadImage(file){
  if(!file)return;
  if(!file.type.startsWith('image/')){statusText.textContent='Izaberi sliku u formatu PNG, JPG ili WEBP.';return;}
  const reader=new FileReader();
  reader.onload=()=>{
    imageData=reader.result;
    previewImage.src=imageData;
    previewImage.style.display='block';
    statusText.textContent='Slika je spremna. Možeš menjati scenu, veličinu i rotaciju.';
  };
  reader.readAsDataURL(file);
}

function resetAll(){
  imageUpload.value='';
  imageData='';
  previewImage.removeAttribute('src');
  previewImage.style.display='none';
  sceneSelect.value='phone';
  scaleRange.value=100;
  rotateRange.value=0;
  bgColor.value='#E8DED0';
  objectScale=100;
  objectRotation=0;
  mockupStage.style.background=bgColor.value;
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

function downloadMockup(){
  if(!imageData){statusText.textContent='Prvo ubaci sliku pre preuzimanja.';return;}
  const canvas=document.createElement('canvas');
  canvas.width=1200;canvas.height=900;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=bgColor.value;ctx.fillRect(0,0,canvas.width,canvas.height);

  const type=sceneSelect.value;
  const img=new Image();
  img.onload=()=>{
    ctx.save();
    ctx.globalAlpha=.15;
    ctx.fillStyle='#173C32';
    ctx.beginPath();ctx.arc(120,100,190,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#C8A96B';
    ctx.beginPath();ctx.arc(1120,820,230,0,Math.PI*2);ctx.fill();
    ctx.restore();

    const configs={
      phone:{x:470,y:120,w:260,h:520,r:30},
      laptop:{x:300,y:190,w:600,h:365,r:14},
      planner:{x:410,y:140,w:380,h:510,r:5},
      poster:{x:390,y:120,w:420,h:550,r:5},
      business:{x:340,y:230,w:520,h:380,r:6},
      fitness:{x:340,y:230,w:520,h:380,r:6},
      hotel:{x:340,y:230,w:520,h:380,r:6},
      restaurant:{x:340,y:230,w:520,h:380,r:6},
      yoga:{x:340,y:230,w:520,h:380,r:6},
      beauty:{x:340,y:230,w:520,h:380,r:6}
    };
    const c=configs[type]||configs.phone;

    ctx.save();
    ctx.translate(c.x+c.w/2,c.y+c.h/2);
    ctx.rotate(objectRotation*Math.PI/180);
    const scale=objectScale/100;
    ctx.scale(scale,scale);

    ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=45;ctx.shadowOffsetY=25;
    ctx.fillStyle=type==='phone'||type==='laptop'?'#181918':'#fff';
    roundedRect(ctx,-c.w/2,-c.h/2,c.w,c.h,c.r);
    ctx.fill();
    ctx.shadowColor='transparent';

    const pad=(type==='phone'||type==='laptop')?12:0;
    ctx.save();
    roundedRect(ctx,-c.w/2+pad,-c.h/2+pad,c.w-pad*2,c.h-pad*2,Math.max(2,c.r-6));
    ctx.clip();

    const ratio=Math.max((c.w-pad*2)/img.width,(c.h-pad*2)/img.height);
    const iw=img.width*ratio,ih=img.height*ratio;
    ctx.drawImage(img,-iw/2,-ih/2,iw,ih);
    ctx.restore();

    ctx.restore();

    ctx.fillStyle='rgba(23,60,50,.65)';
    ctx.font='700 14px Montserrat, sans-serif';
    ctx.textAlign='center';
    ctx.letterSpacing='3px';
    ctx.fillText('DIGITAL SOUL STUDIO',600,850);

    const link=document.createElement('a');
    link.download=`digital-soul-mockup-${type}.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
    statusText.textContent='Mockup je spreman za preuzimanje.';
  };
  img.src=imageData;
}

imageUpload.addEventListener('change',e=>loadImage(e.target.files[0]));
sceneSelect.addEventListener('change',e=>setScene(e.target.value));
scaleRange.addEventListener('input',e=>{objectScale=Number(e.target.value);updateTransform();});
rotateRange.addEventListener('input',e=>{objectRotation=Number(e.target.value);updateTransform();});
bgColor.addEventListener('input',e=>{mockupStage.style.background=e.target.value;});
resetBtn.addEventListener('click',resetAll);
downloadBtn.addEventListener('click',downloadMockup);
mockupStage.style.background=bgColor.value;
updateTransform();
