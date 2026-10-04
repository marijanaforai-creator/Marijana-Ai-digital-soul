const MAX_PROMPT_LENGTH=4000;
const MAX_IMAGE_DATA_LENGTH=12_000_000;

function json(res,status,payload){
  res.status(status).json(payload);
}

function dataUrlToBlob(dataUrl){
  const match=String(dataUrl||'').match(/^data:(image\/(?:png|jpe?g|webp|gif));base64,([A-Za-z0-9+/=]+)$/i);
  if(!match)return null;
  const mime=match[1].toLowerCase().replace('jpg','jpeg');
  const bytes=Buffer.from(match[2],'base64');
  return new Blob([bytes],{type:mime});
}

function chooseSize(prompt){
  const text=String(prompt||'').toLowerCase();
  if(/story|reel|portrait|portret|vertikal|uspravn|1080x1920|1024x1536/.test(text))return '1024x1536';
  if(/square|kvadrat|1200x1200|1024x1024/.test(text))return '1024x1024';
  return '1536x1024';
}

function scenePrompt(userPrompt,hasReference){
  const referenceInstruction=hasReference
    ? `Use the uploaded design/image as the primary reference. Preserve the supplied design's identity, colors, layout, and visible text as much as possible. Place that design naturally into the requested physical mockup scene rather than replacing it with a different design. The requested scene is a visual mockup, not a redesign of the supplied artwork.`
    : `Create the requested mockup scene from scratch. If the user mentions a design on a screen, document, card, poster, or product, leave a believable surface for it.`;
  return [
    'Create a professional, photorealistic product mockup scene for Marijana AI Digital Soul.',
    referenceInstruction,
    'Follow the user description for device, environment, materials, camera angle, lighting, background, color palette, and 3D perspective.',
    'Make the main requested object clearly visible and recognizable. If the user asks for a laptop, it MUST be a complete physical 3D laptop, not a flat front-facing screen: show the display panel with bezel, visible hinge, substantial lower chassis/base, keyboard deck with recognizable individual keys, trackpad, side thickness, and realistic perspective. The screen must be open at a natural angle and connected to the base. Show enough three-quarter camera angle that the depth and construction are unmistakable. Never render only the front of a laptop, a black rectangle, a floating screen, or a screen without keyboard and base.'
    'Keep the composition clean, premium, realistic, commercially usable, with natural contact shadows and studio lighting.',
    'Do not add watermarks. Do not invent logos or unrelated text.',
    'User description: '+userPrompt
  ].join('\n\n');
}

async function generateImage(prompt,imageData){
  const model=process.env.OPENAI_IMAGE_MODEL||'gpt-image-2.5-flare';
  const size=chooseSize(prompt);
  const quality=process.env.OPENAI_IMAGE_QUALITY||'medium';
  const url=imageData?'https://api.openai.com/v1/images/edits':'https://api.openai.com/v1/images/generations';
  const finalPrompt=scenePrompt(prompt,!!imageData);

  let response;
  if(imageData){
    const blob=dataUrlToBlob(imageData);
    if(!blob)throw new Error('Nepodržan format slike.');
    const form=new FormData();
    form.append('model',model);
    form.append('prompt',finalPrompt);
    form.append('size',size);
    form.append('quality',quality);
    form.append('output_format','png');
    form.append('image',blob,'mockup-reference.png');
    response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},body:form});
  }else{
    response=await fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+process.env.OPENAI_API_KEY},
      body:JSON.stringify({model,prompt:finalPrompt,size,quality,output_format:'png',n:1})
    });
  }

  const raw=await response.json().catch(()=>({}));
  if(!response.ok){
    console.error('OpenAI image error',raw);
    const detail=raw?.error?.message||'AI servis trenutno nije vratio sliku.';
    throw new Error(detail);
  }
  const image=raw?.data?.[0];
  if(!image?.b64_json)throw new Error('AI servis nije vratio sliku.');
  return {imageData:image.b64_json,revisedPrompt:image.revised_prompt||'',size,model};
}

export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed.'});
  if(!process.env.OPENAI_API_KEY)return json(res,500,{error:'OPENAI_API_KEY nije podešen na Vercelu. Dodaj ga kao Secret pa redeploy.'});

  const prompt=typeof req.body?.prompt==='string'?req.body.prompt.trim():'';
  const imageData=typeof req.body?.imageData==='string'?req.body.imageData:'';

  if(!prompt)return json(res,400,{error:'Prompt je obavezan.'});
  if(prompt.length>MAX_PROMPT_LENGTH)return json(res,400,{error:'Prompt je predugačak.'});
  if(imageData&&imageData.length>MAX_IMAGE_DATA_LENGTH)return json(res,413,{error:'Slika je prevelika za AI generisanje.'});

  try{
    const result=await generateImage(prompt,imageData||null);
    return json(res,200,result);
  }catch(error){
    console.error('Scene generator error:',error);
    return json(res,502,{error:error?.message||'Greška na AI serveru.'});
  }
}
