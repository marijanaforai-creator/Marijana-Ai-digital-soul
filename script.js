
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click', e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
  });
});

const heroSlides=document.querySelectorAll('.hero-slide');
const heroDots=document.querySelectorAll('.hero-dot');
const heroPrev=document.querySelector('.hero-prev');
const heroNext=document.querySelector('.hero-next');
let heroIndex=0;
function showHero(index){
  if(!heroSlides.length)return;
  heroIndex=(index+heroSlides.length)%heroSlides.length;
  heroSlides.forEach((s,i)=>s.classList.toggle('active',i===heroIndex));
  heroDots.forEach((d,i)=>d.classList.toggle('active',i===heroIndex));
}
heroPrev?.addEventListener('click',()=>showHero(heroIndex-1));
heroNext?.addEventListener('click',()=>showHero(heroIndex+1));
heroDots.forEach((d,i)=>d.addEventListener('click',()=>showHero(i)));
