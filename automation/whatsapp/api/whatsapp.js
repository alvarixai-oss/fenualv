import {createHmac,timingSafeEqual,createHash} from 'node:crypto';
import {answer,HANDOFF} from '../lib/agent.mjs';
export const config={api:{bodyParser:false}};
export function validSignature(body,signature,secret){
  if(!secret||!/^sha256=[a-f0-9]{64}$/.test(signature||''))return false;
  return timingSafeEqual(Buffer.from(signature.slice(7),'hex'),createHmac('sha256',secret).update(body).digest());
}
export function incoming(body,phoneId){
  if(body.object!=='whatsapp_business_account')return [];
  return (body.entry||[]).flatMap(e=>(e.changes||[]).flatMap(c=>c.field==='messages'&&c.value?.metadata?.phone_number_id===phoneId?(c.value.messages||[]):[]));
}
const memoryState=new Map();
async function state(command,env){
  if(env.UPSTASH_REDIS_REST_URL&&env.UPSTASH_REDIS_REST_TOKEN){
    const r=await fetch(env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(5000)});
    if(!r.ok)throw new Error('State unavailable');
    const data=await r.json();if(data.error)throw new Error('State unavailable');return data.result;
  }
  const [op,key,...args]=command;
  const now=Date.now();
  const current=memoryState.get(key);
  if(current&&current.expires<=now)memoryState.delete(key);
  if(op==='GET')return memoryState.get(key)?.value??null;
  if(op==='DEL'){const existed=memoryState.delete(key);return existed?1:0;}
  if(op==='SET'){
    const nx=args.includes('NX');
    if(nx&&memoryState.has(key))return null;
    const exIndex=args.indexOf('EX');
    const ttl=exIndex>=0?Number(args[exIndex+1]):300;
    memoryState.set(key,{value:args[0],expires:now+(Number.isFinite(ttl)?ttl:300)*1000});
    return 'OK';
  }
  return null;
}
export default async function handler(req,res){
  const env=process.env;
  res.setHeader('Cache-Control','no-store');
  if(req.method==='GET'){
    const q=new URL(req.url,'https://localhost').searchParams;
    if(env.WHATSAPP_VERIFY_TOKEN&&q.get('hub.mode')==='subscribe'&&q.get('hub.verify_token')===env.WHATSAPP_VERIFY_TOKEN)return res.status(200).send(q.get('hub.challenge'));
    return res.status(403).send('Forbidden');
  }
  if(req.method!=='POST')return res.status(405).send('Method not allowed');
  if(!env.META_APP_SECRET)return res.status(503).send('Not configured');
  let raw;try{const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>262144)return res.status(413).send('Too large');chunks.push(c);}raw=Buffer.concat(chunks);}catch{return res.status(400).send('Invalid body');}
  if(!validSignature(raw,req.headers['x-hub-signature-256'],env.META_APP_SECRET))return res.status(401).send('Invalid signature');
  let messages;try{messages=incoming(JSON.parse(raw),env.WHATSAPP_PHONE_NUMBER_ID);}catch{return res.status(400).send('Invalid JSON');}
  console.log('WhatsApp webhook received; matching messages:',messages.length);
  if(!messages.length)return res.status(200).send('EVENT_RECEIVED');
  const missing=['WHATSAPP_ACCESS_TOKEN','WHATSAPP_PHONE_NUMBER_ID','META_GRAPH_VERSION'].filter(k=>!env[k]);
  if(missing.length){console.error('WhatsApp configuration missing:',missing.join(','));return res.status(503).send('Not configured');}
  try{
    for(const m of messages){
      if(!m.id||!/^\d{5,20}$/.test(m.from||''))continue;
      // Never send a freeform response outside the customer's 24-hour window.
      const timestamp=Number(m.timestamp);if(!Number.isFinite(timestamp)||Date.now()/1000-timestamp>86400||timestamp>Date.now()/1000+300)continue;
      const key='fenualv:wa:'+createHash('sha256').update(m.id).digest('hex');
      const state=await state(['GET',key],env);if(state==='sent'||state==='uncertain')continue;
      if(!await state(['SET',key,'processing','NX','EX',120],env))return res.status(503).send('Processing');
      let sending=false;
      try{
        const response=m.type==='text'?await answer(m.text?.body||'',env):'Solo puedo responder consultas escritas. Resume tu pregunta por texto. '+HANDOFF;
        // Persist before delivery. An ambiguous network failure must not cause repeated customer messages.
        await state(['SET',key,'uncertain','EX',604800],env);sending=true;
        const r=await fetch(`https://graph.facebook.com/${env.META_GRAPH_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,{method:'POST',headers:{Authorization:`Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(10000),body:JSON.stringify({messaging_product:'whatsapp',to:m.from,type:'text',text:{body:response,preview_url:false}})});
        if(!r.ok){console.error('Meta rejected response status:',r.status);await state(['DEL',key],env);throw new Error('Meta rejected response');}
        await state(['SET',key,'sent','EX',604800],env);
      }catch(error){if(!sending)await state(['DEL',key],env);console.error('WhatsApp delivery requires review; no customer content logged');throw error;}
    }
    return res.status(200).send('EVENT_RECEIVED');
  }catch{return res.status(503).send('Retry later');}
}
