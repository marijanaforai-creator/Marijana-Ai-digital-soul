const SCENE_NAMES=[
  'phone','tablet','laptop','frame','planner','poster','business','fitness','hotel','restaurant','yoga','beauty','office','desk','product','packaging','social',
  'laptop-angle','multi-device','isometric-cards','floating-cards','paper-stack','magazine-spread','open-magazine','desktop-scene',
  'sheet-single','sheet-perspective','sheet-scattered','sheet-stack','web-pages','web-foldout','document-stack','ebook-spread'
];
const LAYOUTS=['blank-white','classic','luxury','minimal','wellness','business'];
const schema={type:'object',additionalProperties:false,properties:{
  scene:{type:'string',enum:SCENE_NAMES},layout:{type:'string',enum:LAYOUTS},backgroundColor:{type:'string'},count:{type:'integer',minimum:1,maximum:9},
  rotation:{type:'number',minimum:-180,maximum:180},scale:{type:'number',minimum:40,maximum:180},positionX:{type:'number',minimum:-100,maximum:100},positionY:{type:'number',minimum:-100,maximum:100},
  perspective:{type:'number',minimum:-60,maximum:60},tiltX:{type:'number',minimum:-45,maximum:45},tiltY:{type:'number',minimum:-45,maximum:45},fit:{type:'string',enum:['cover','contain']},
  autoRotate3D:{type:'boolean'},video:{type:'boolean'},summary:{type:'string'}
},required:['scene','layout','backgroundColor','count','rotation','scale','positionX','positionY','perspective','tiltX','tiltY','fit','autoRotate3D','video','summary']};
function json(res,status,payload){res.status(status).json(payload);}
export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed.'});
  if(!process.env.OPENAI_API_KEY)return json(res,500,{error:'OPENAI_API_KEY nije podešen na Vercelu.'});
  const prompt=typeof req.body?.prompt==='string'?req.body.prompt.trim():'';
  if(!prompt)return json(res,400,{error:'Prompt je obavezan.'});
  if(prompt.length>4000)return json(res,400,{error:'Prompt je predugačak.'});
  const instructions=[
    'Ti si AI Scene Director za Marijana AI Studio.',
    'Razumeš srpski i engleski, ali rezultat mora biti JSON prema zadatoj šemi.',
    'Pretvori slobodan opis korisnika u najbolju scenu iz dozvoljene liste. Ne izmišljaj nove scene.',
    'Ako korisnik traži dokumente ili papire koji se preklapaju, koristi paper-stack ili odgovarajuću sheet/document scenu.',
    'Ako traži telefon, tablet, laptop, web, ebook, magazin, kartice ili uređaje, izaberi najbližu postojeću scenu.',
    'Broj komada je 1 ako korisnik nije naveo broj.',
    'Luxury, luksuz, premium i champagne obično znače luxury layout; minimal znači minimal; wellness/spa/prirodno znači wellness; business/corporate znači business.',
    'Prepoznaj boje na srpskom i engleskom i vrati HEX kada je moguće.',
    'Koristi umerene transformacije. Ne pravi ekstremne vrednosti osim ako korisnik izričito traži jak ugao ili rotaciju.',
    'summary napiši kratko na srpskom. Ovo je planer scene, ne generator slike: ne menjaj tekst ili sadržaj korisnikovog dizajna.'
  ].join(' ');
  try{
    const openaiResponse=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+process.env.OPENAI_API_KEY},
      body:JSON.stringify({model:'gpt-6-luna',instructions,input:prompt,max_output_tokens:800,text:{format:{type:'json_schema',name:'marijana_scene_plan',strict:true,schema}}})
    });
    const raw=await openaiResponse.json().catch(()=>({}));
    if(!openaiResponse.ok){console.error('OpenAI error',raw);return json(res,502,{error:'AI servis trenutno nije vratio scenu.'});}
    if(!raw.output_text)return json(res,502,{error:'AI nije vratio strukturisanu scenu.'});
    let scenePlan;try{scenePlan=JSON.parse(raw.output_text);}catch{return json(res,502,{error:'AI odgovor nije validan JSON.'});}
    return json(res,200,{scenePlan});
  }catch(error){console.error('Scene generator error',error);return json(res,500,{error:'Greška na AI serveru.'});}
}