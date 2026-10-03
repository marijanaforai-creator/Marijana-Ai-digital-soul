const templates=[
{id:'t1',name:'Phone Clean',cat:'device',label:'Telefon',bg:'#e8ded0',wide:false},
{id:'t2',name:'Laptop Business',cat:'business',label:'Business',bg:'#dde4ea',wide:true},
{id:'t3',name:'Planner Luxury',cat:'product',label:'Planner',bg:'#171717',wide:false},
{id:'t4',name:'Fitness Campaign',cat:'wellness',label:'Fitness',bg:'#dce7de',wide:true},
{id:'t5',name:'Hotel Premium',cat:'business',label:'Hotel',bg:'#e5ded2',wide:true},
{id:'t6',name:'Restaurant Menu',cat:'business',label:'Restoran',bg:'#e1d5c5',wide:true},
{id:'t7',name:'Yoga Calm',cat:'wellness',label:'Yoga',bg:'#dce7de',wide:true},
{id:'t8',name:'Beauty Editorial',cat:'product',label:'Beauty',bg:'#e8dde0',wide:true},
{id:'t9',name:'Social Story',cat:'social',label:'Social Media',bg:'#e1e7e3',wide:false},
{id:'t10',name:'Office Pro',cat:'lifestyle',label:'Kancelarija',bg:'#d9ddd7',wide:true},
{id:'t11',name:'Creator Desk',cat:'lifestyle',label:'Radni sto',bg:'#e4d8c8',wide:true},
{id:'t12',name:'Packaging Studio',cat:'product',label:'Ambalaža',bg:'#d8c9b0',wide:false}
];
let category='all',favorites=JSON.parse(localStorage.getItem('digitalSoulTemplateFavorites')||'[]'),saved=JSON.parse(localStorage.getItem('digitalSoulMockupTemplates')||'[]');
const grid=document.getElementById('libraryGrid'),search=document.getElementById('librarySearch'),count=document.getElementById('libraryCount'),empty=document.getElementById('libraryEmpty'),sort=document.getElementById('librarySort');
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
 grid.appendChild(el)
})}
document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
search.oninput=render;sort.onchange=render;document.getElementById('libraryFavorites').onclick=()=>{category=category==='mine'?'all':'mine';document.querySelectorAll('.category').forEach(x=>x.classList.toggle('active',x.dataset.category===category));render()};render();