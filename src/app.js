"use strict";
const $ = id => document.getElementById(id);
function status(text, bad=false){$('status').textContent=text;$('status').className='status'+(bad?' error':'');}
function table(id,headers,rows){const host=$(id);host.replaceChildren();const t=document.createElement('table');const head=t.createTHead().insertRow();headers.forEach(h=>{const th=document.createElement('th');th.scope='col';th.textContent=h;head.append(th);});const body=t.createTBody();rows.forEach(row=>{const tr=body.insertRow();row.forEach(v=>{tr.insertCell().textContent=String(v);});});host.append(t);}
function metrics(items){$('metrics').replaceChildren();items.forEach(([value,label])=>{const box=document.createElement('div');box.className='metric';const strong=document.createElement('strong');strong.textContent=value;const span=document.createElement('span');span.textContent=label;box.append(strong,span);$('metrics').append(box);});}
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
let result=null;
$('export').onclick=()=>{if(result)download(document.title.toLowerCase()+'.json',result);};
function invalidate(){result=null;$('export').disabled=true;$('results').hidden=true;status('Inputs changed. Run again to refresh results.');}
function success(value){result=value;$('export').disabled=false;$('results').hidden=false;status('Analysis complete. Results stay on this device.');}

function run(){try{const r=Engine.inspect($('token').value);success(r);metrics([[r.header.alg,'Declared algorithm'],[Object.keys(r.payload).length,'Claims'],['No','Signature verified']]);$('warnings').textContent=r.warnings.join('\n');$('header').textContent=JSON.stringify(r.header,null,2);$('payload').textContent=JSON.stringify(r.payload,null,2);table('times',['Claim','UTC time','Status'],r.times.map(t=>[t.claim,t.utc,t.state]));}catch(e){invalidate();status(e.message,true);}}
$('run').onclick=run;$('token').oninput=invalidate;
$('example').onclick=()=>{const enc=o=>btoa(JSON.stringify(o)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');$('token').value=enc({alg:'none',typ:'JWT'})+'.'+enc({sub:'demo-user',role:'viewer',iat:1767225600,exp:1767229200})+'.';run();};
