/** Decode Nuxt's data-only IIFE with an AST whitelist; never execute site JS. */
import {createRequire}from'node:module';import path from'node:path';
import {REPO,Stop}from'./crawl_shared.mjs';
const require=createRequire(path.join(REPO,'package.json'));
const {parse}=require('next/dist/compiled/acorn');
export function nuxt(html){
 const input=html.match(/window\.__NUXT__=([\s\S]*?)<\/script>/)?.[1];if(!input)throw new Stop('Missing Nuxt data');
 const program=parse(input,{ecmaVersion:2020});const call=program.body[0]?.expression;
 if(program.body.length!==1||call?.type!=='CallExpression'||call.callee.type!=='FunctionExpression')throw new Stop('Unexpected Nuxt envelope');
 const fn=call.callee;if(fn.body.body.length!==1||fn.body.body[0].type!=='ReturnStatement')throw new Stop('Non-data Nuxt function');
 const env=Object.create(null);
 function literal(node,scope){
  if(!node)throw new Stop('Missing literal');
  if(node.type==='Literal'&&!node.regex)return node.value;
  if(node.type==='Identifier'&&Object.hasOwn(scope,node.name))return scope[node.name];
  if(node.type==='ArrayExpression')return node.elements.map(x=>literal(x,scope));
  if(node.type==='ObjectExpression'){const o=Object.create(null);for(const p of node.properties){if(p.type!=='Property'||p.computed||p.method||p.kind!=='init')throw new Stop('Non-data object property');const key=p.key.type==='Identifier'?p.key.name:p.key.value;if(['__proto__','constructor','prototype'].includes(key))throw new Stop('Unsafe data property');o[key]=literal(p.value,scope);}return o;}
  if(node.type==='UnaryExpression'&&node.operator==='-'&&node.argument.type==='Literal'&&typeof node.argument.value==='number')return-node.argument.value;
  throw new Stop('Non-literal Nuxt node '+node.type);
 }
 if(fn.params.length!==call.arguments.length)throw new Stop('Nuxt argument mismatch');
 fn.params.forEach((p,i)=>{if(p.type!=='Identifier')throw new Stop('Non-identifier Nuxt parameter');env[p.name]=literal(call.arguments[i],Object.create(null));});
 return literal(fn.body.body[0].argument,env);
}
