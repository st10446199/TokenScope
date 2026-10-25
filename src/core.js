"use strict";
(function(root){

function decodePart(part) {
 if(!/^[A-Za-z0-9_-]+$/.test(part)||part.length%4===1)throw Error('Invalid base64url segment.');
 const raw=atob(part.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-part.length%4)%4));
 const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
 const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 if(!data || typeof data!=='object' || Array.isArray(data))throw Error('Header and payload must be JSON objects.');
 return data;
}
function inspect(token,now=Math.floor(Date.now()/1000)) {
 if(typeof token!=='string'||token.length>65536)throw Error('Token must be text under 64 KiB.');
 if(!Number.isFinite(now))throw Error('Invalid inspection time.');
 const parts=token.trim().split('.');
 if(parts.length!==3)throw Error('Expected three segments. Encrypted tokens are not supported.');
 const header=decodePart(parts[0]),payload=decodePart(parts[1]);
 if(typeof header.alg!=='string'||!header.alg)throw Error('Header needs an alg string.');
 if(parts[2]&&!/^[A-Za-z0-9_-]+$/.test(parts[2]))throw Error('Invalid signature encoding.');
 if(parts[2].length%4===1)throw Error('Invalid signature length.');
 const warnings=['Signature NOT verified. Claims are untrusted.'];
 if(header.alg==='none')warnings.push('Unsecured token: alg is none.');
 if(!parts[2])warnings.push('No signature is present.');
 const times=[];
 for(const key of ['iat','nbf','exp'])if(Object.hasOwn(payload,key)){
  const value=payload[key];
  if(typeof value!=='number'||!Number.isFinite(value)||Math.abs(value)>8640000000000){warnings.push(key+' is not a supported NumericDate.');continue;}
  const utc=new Date(value*1000).toISOString();
  let state='Issued';
  if(key==='exp')state=now>=value?'Expired':'Not expired';
  if(key==='nbf')state=now<value?'Not active yet':'Start time reached';
  if(key==='iat'&&value>now)warnings.push('Issued time is in the future.');
  times.push({claim:key,utc,state,secondsFromNow:value-now});
 }
 if(!Object.hasOwn(payload,'exp'))warnings.push('No expiry claim is present.');
 return {header,payload,times,warnings,signatureVerified:false,checkedAt:new Date(now*1000).toISOString()};
}

const api={inspect,decodePart};
if(typeof module!=="undefined" && module.exports)module.exports=api;else root.Engine=api;
})(typeof globalThis!=="undefined"?globalThis:this);
