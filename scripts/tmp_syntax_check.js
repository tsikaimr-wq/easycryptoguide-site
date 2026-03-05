const fs=require('fs');
const pages=['mobile.html','markets.html','index.html','buy-sell.html'];
for (const p of pages){
  const html=fs.readFileSync(p,'utf8');
  const re=/<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let m; let i=0; let ok=true;
  while((m=re.exec(html))){
    i++;
    const attrs=m[1]||'';
    const code=m[2]||'';
    if(/\bsrc\s*=/.test(attrs)) continue;
    if(/type\s*=\s*['\"]module['\"]/.test(attrs)) continue;
    try { new Function(code); }
    catch(e){ ok=false; console.log(p,'script#'+i,'ERROR',e.message); }
  }
  if(ok) console.log(p,'non-module scripts OK');
}
