import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {localAnswer,handoff} from '../public_html/assets/chat-engine.mjs';import handler from '../public_html/api/chat.mjs';
const k=JSON.parse(readFileSync(new URL('../public_html/assets/chat-knowledge.json',import.meta.url)));
for(const [q,word] of [['Quiero revisar mi factura','energético'],['Clasificáis correos','Clasificación'],['Podéis leer PDF','PDF'],['Instalaciones solares','fotovoltaica'],['Qué servicios ofrecéis','energético']])test(q,()=>assert.match(localAnswer(q,k).answer,new RegExp(word,'i')));
for(const q of ['Quiero una cita','Cuánto cuesta','Cuál es mi expediente','Quién ganará el partido'])test('derivación: '+q,()=>assert.equal(localAnswer(q,k).answer,handoff));
const res=()=>({setHeader(){},status(n){this.code=n;return this},json(v){this.data=v;return this}});
test('rejects oversized input',async()=>{const r=res();await handler({method:'POST',body:{message:'a'.repeat(2001)}},r);assert.equal(r.code,400);});
test('works when model is unavailable',async()=>{const old=global.fetch;global.fetch=async()=>{throw Error('offline')};try{const r=res();await handler({method:'POST',headers:{},body:{message:'Qué servicios ofrecéis'}},r);assert.equal(r.code,200);assert.match(r.data.answer,/energético/);}finally{global.fetch=old;}});
test('limits repeated requests',async()=>{for(let i=0;i<11;i++){const r=res();await handler({method:'POST',headers:{'x-real-ip':'test'},body:{message:'Hola'}},r);if(i===10)assert.equal(r.code,429);}});
