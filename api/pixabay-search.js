function json(res,status,payload){res.status(status).json(payload);}
export default async function handler(req,res){
  if(req.method!=='GET')return json(res,405,{error:'Method not allowed.'});
  const key=process.env.PIXABAY_API_KEY;
  if(!key)return json(res,500,{error:'PIXABAY_API_KEY nije podešen na Vercelu.'});
  const rawQuery=String(req.query?.q||'').trim();
  if(!rawQuery)return json(res,400,{error:'Unesi pojam za pretragu.'});

  // Normalizuj najčešće načine na koje korisnik upisuje naziv uređaja.
  // Pixabay bolje razume "laptop" kao jednu reč nego "lap top".
  const aliases={
    'lap top':'laptop',
    'lap-top':'laptop',
    'lap top computer':'laptop',
    'laptop computer':'laptop',
    'laptop racunar':'laptop',
    'laptop računar':'laptop',
    'notebook computer':'notebook'
  };
  let q=rawQuery.toLowerCase();
  Object.entries(aliases).forEach(([from,to])=>{
    q=q.replace(new RegExp(from.replace(/[.*+?^$\\{}()|[\\]\\]/g,'\\\\  const q=String(req.query?.q||'').trim();
  if(!q)return json(res,400,{error:'Unesi pojam za pretragu.'});
  const params=new URLSearchParams({
    key,q:q.slice(0,100),lang:'sr',image_type:'photo',orientation:'all',per_page:'24'
  });'),'gi'),to);
  });
  q=q.replace(/\\s+/g,' ').trim();

  const params=new URLSearchParams({
    key,q:q.slice(0,100),lang:'en',image_type:'photo',orientation:'all',per_page:'24'
  });
  try{
    const response=await fetch('https://pixabay.com/api/?'+params.toString());
    const raw=await response.json().catch(()=>({}));
    if(!response.ok)return json(res,response.status,{error:'Pixabay pretraga nije uspela.'});
    const hits=Array.isArray(raw.hits)?raw.hits:[];
    return json(res,200,{
      total:raw.total||0,
      hits:hits.map(x=>({
        id:x.id,
        pageURL:x.pageURL,
        previewURL:x.previewURL,
        webformatURL:x.webformatURL,
        largeImageURL:x.largeImageURL,
        tags:x.tags,
        width:x.webformatWidth||x.imageWidth,
        height:x.webformatHeight||x.imageHeight,
        user:x.user
      }))
    });
  }catch(error){
    return json(res,502,{error:error?.message||'Pixabay servis trenutno nije dostupan.'});
  }
}