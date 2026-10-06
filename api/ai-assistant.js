const MAX_MESSAGE_LENGTH=4000;
const MODEL=process.env.OPENAI_ASSISTANT_MODEL||'gpt-4.1-mini';

function json(res,status,payload){res.status(status).json(payload)}

const SYSTEM=`Ti si Marijana AI Studio asistent za Canvas Studio i Mockup Studio.
Radiš kao dizajnerski i tehnički pomoćnik. Odgovaraj na srpskom.
Tvoj zadatak je da predložiš i izvršiš samo bezbedne, ograničene radnje nad trenutnim dokumentom.
Nikada ne vraćaj JavaScript kod kao akciju. Vraćaj JSON objekat:
{"reply":"kratko objašnjenje","actions":[...]}
Dozvoljene Canvas akcije:
- set_selected_field: {"type":"set_selected_field","field":"text|fontFamily|fontSize|fontWeight|color|highlightColor|letterSpacing|lineHeight|x|y|w|h|rotation|opacity","value":...}
- set_background: {"type":"set_background","color":"#RRGGBB"}
- add_text: {"type":"add_text","text":"...","x":...,"y":...,"w":...,"h":...,"fontSize":...,"fontFamily":"...","fontWeight":...,"color":"#RRGGBB"}
- add_element: {"type":"add_element","element":"line|rounded|pill|badge|label|number|divider|button|quote|checklist|price|dotgrid|star|spark|triangle|circle-shape|oval|diamond|pentagon|hexagon|octagon|star-shape|heart|ring|plus-shape"}
- fix_typography: {"type":"fix_typography","headingFont":"...","bodyFont":"..."}
Dozvoljene Mockup akcije:
- set_scene: {"type":"set_scene","scene":"phone|tablet|laptop|frame|planner|poster|business|fitness|hotel|restaurant|yoga|beauty|office|desk|product|packaging|social"}
- set_background: {"type":"set_background","color":"#RRGGBB"}
- set_fit: {"type":"set_fit","value":"cover|contain"}
- set_transform: {"type":"set_transform","scale":number,"rotation":number,"x":number,"y":number,"perspective":number,"tiltX":number,"tiltY":number}
Ako zahtev ne može bezbedno ili pouzdano da se izvrši, vrati actions:[] i objasni šta nedostaje.
Ne menjaj GitHub kod kroz ovu funkciju. Ovo je rad sa otvorenim dokumentom.`;

export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed.'});
  if(!process.env.OPENAI_API_KEY)return json(res,500,{error:'OPENAI_API_KEY nije podešen.'});
  const body=req.body||{};
  const message=typeof body.message==='string'?body.message.trim():'';
  if(!message)return json(res,400,{error:'Poruka je obavezna.'});
  if(message.length>MAX_MESSAGE_LENGTH)return json(res,400,{error:'Poruka je predugačka.'});

  const context=body.context&&typeof body.context==='object'?body.context:{};
  const system=SYSTEM+'\\n\\nTrenutni kontekst aplikacije:\\n'+JSON.stringify(context).slice(0,30000);
  try{
    const response=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+process.env.OPENAI_API_KEY},
      body:JSON.stringify({
        model:MODEL,
        temperature:0.2,
        messages:[
          {role:'system',content:system},
          {role:'user',content:message}
        ],
        response_format:{type:'json_object'}
      })
    });
    const raw=await response.json().catch(()=>({}));
    if(!response.ok){
      console.error('AI assistant error',raw);
      return json(res,502,{error:raw?.error?.message||'AI asistent trenutno nije dostupan.'});
    }
    const content=raw?.choices?.[0]?.message?.content||'{}';
    let result;
    try{result=JSON.parse(content)}catch{result={reply:content,actions:[]}}
    if(!Array.isArray(result.actions))result.actions=[];
    return json(res,200,{reply:String(result.reply||'Gotovo.'),actions:result.actions.slice(0,12),model:MODEL});
  }catch(error){
    console.error('AI assistant request failed',error);
    return json(res,502,{error:error?.message||'Greška AI asistenta.'});
  }
}
