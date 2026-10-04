function json(res,status,payload){res.status(status).json(payload);}

export default async function handler(req,res){
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed.'});

  const key=process.env.PIXABAY_API_KEY;
  if(!key)return json(res,500,{error:'PIXABAY_API_KEY nije podešen na Vercelu.'});

  const id=String(req.query?.id||'').trim();
  if(!/^\d+$/.test(id))return json(res,400,{error:'Neispravan Pixabay ID.'});

  try{
    const lookup=new URLSearchParams({key,id});
    const response=await fetch('https://pixabay.com/api/?'+lookup.toString());
    const raw=await response.json().catch(()=>({}));

    if(!response.ok)return json(res,response.status,{error:'Pixabay slika nije pronađena.'});

    const hit=Array.isArray(raw.hits)?raw.hits[0]:null;
    if(!hit?.largeImageURL&&!hit?.webformatURL){
      return json(res,404,{error:'Pixabay slika nije dostupna.'});
    }

    const imageUrl=hit.largeImageURL||hit.webformatURL;
    const imageResponse=await fetch(imageUrl);
    if(!imageResponse.ok)return json(res,502,{error:'Preuzimanje Pixabay slike nije uspelo.'});

    const contentType=imageResponse.headers.get('content-type')||'image/jpeg';
    if(!contentType.startsWith('image/')){
      return json(res,502,{error:'Pixabay rezultat nije slika.'});
    }

    const buffer=Buffer.from(await imageResponse.arrayBuffer());
    const dataUrl=`data:${contentType};base64,${buffer.toString('base64')}`;

    return json(res,200,{
      id:hit.id,
      data:dataUrl,
      pageURL:hit.pageURL,
      user:hit.user||'Pixabay',
      tags:hit.tags||'',
      width:hit.imageWidth||hit.webformatWidth||0,
      height:hit.imageHeight||hit.webformatHeight||0
    });
  }catch(error){
    return json(res,502,{error:error?.message||'Pixabay servis trenutno nije dostupan.'});
  }
}