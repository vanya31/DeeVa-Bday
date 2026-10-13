const TARGET=new Date(2026,9,19,21,0,0);
// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE (see setup steps). Leave empty for preview mode.
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbyi7SBUv2azu2bN-qDlPRyo8qomyvCrJcEZGMJHkKlxPiuhcLfIzNnz0As8GSSbpjZc/exec";
const $=id=>document.getElementById(id);
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd=(a,b)=>a+Math.random()*(b-a);

/* seal intro */
$('open').addEventListener('click',()=>{$('seal').classList.add('gone');setTimeout(()=>$('seal').remove(),1300);if(!calm)burst(innerWidth/2,innerHeight/2,18)});

/* scroll reveal */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
document.querySelectorAll('.frame').forEach(f=>io?io.observe(f):f.classList.add('in'));

/* floating elements */
const PETAL='<svg viewBox="0 0 10 20"><path d="M5 0C12 4 12 14 5 20C-2 14-2 4 5 0Z" fill="#8a1a38"/></svg>';
const BREATH='<svg viewBox="0 0 30 40"><path d="M15 40V16M15 28L7 18M15 24L23 14" stroke="#b09660" stroke-width="1" fill="none"/><g fill="#f6edd8"><circle cx="15" cy="12" r="3"/><circle cx="7" cy="16" r="2.4"/><circle cx="23" cy="11" r="2.4"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/></g></svg>';
const STAR='<svg viewBox="0 0 10 10"><path d="M5 0L6 4L10 5L6 6L5 10L4 6L0 5L4 4Z" fill="#e6c987"/></svg>';
const BFLY='<svg viewBox="0 0 60 50"><g class="wl"><path d="M30 25C20 2 2 4 4 20C5 32 18 34 30 27ZM30 27C20 30 10 46 20 46C26 46 30 36 30 27Z" fill="url(#sat)" stroke="#e6c987" stroke-width=".8"/></g><g transform="matrix(-1 0 0 1 60 0)"><g class="wl"><path d="M30 25C20 2 2 4 4 20C5 32 18 34 30 27ZM30 27C20 30 10 46 20 46C26 46 30 36 30 27Z" fill="url(#sat)" stroke="#e6c987" stroke-width=".8"/></g></g><path d="M30 18V36" stroke="#e6c987" stroke-width="1.6" stroke-linecap="round"/></svg>';
function add(cls,html,css){const d=document.createElement('div');d.className=cls;d.innerHTML=html;Object.assign(d.style,css);$('fx').appendChild(d)}
if(!calm){
 for(let i=0;i<4;i++)add('bf',BFLY,{top:rnd(8,70)+'%',animationDuration:rnd(24,38)+'s',animationDelay:(-rnd(0,30))+'s',width:rnd(34,56)+'px'});
 for(let i=0;i<14;i++)add('pt',PETAL,{left:rnd(0,98)+'%',animationDuration:rnd(12,22)+'s',animationDelay:(-rnd(0,20))+'s',width:rnd(9,16)+'px'});
 for(let i=0;i<7;i++)add('br',BREATH,{left:rnd(2,94)+'%',top:0,animationDuration:rnd(18,30)+'s',animationDelay:(-rnd(0,28))+'s'});
 for(let i=0;i<14;i++)add('sp',STAR,{left:rnd(0,96)+'%',top:rnd(0,96)+'%',animationDelay:rnd(0,4)+'s'});
}
function burst(x,y,n){for(let i=0;i<n;i++){const d=document.createElement('div');d.innerHTML=PETAL;d.style.cssText='position:fixed;z-index:20;pointer-events:none;width:14px;left:'+x+'px;top:'+y+'px';document.body.appendChild(d);
 const a=rnd(0,6.28),r=rnd(80,200);d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+Math.cos(a)*r+'px,'+(Math.sin(a)*r+90)+'px) rotate('+rnd(-300,300)+'deg) scale(.6)',opacity:0}],{duration:rnd(1100,1800),easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>d.remove()}}

/* countdown */
function tick(){const t=TARGET-new Date();
 if(t<=0){['d','h','m','s'].forEach(k=>$(k).textContent='0');$('cdmsg').textContent='The celebration has begun ♥';return}
 const p=n=>String(n).padStart(2,'0');
 $('d').textContent=Math.floor(t/864e5);$('h').textContent=p(Math.floor(t/36e5)%24);
 $('m').textContent=p(Math.floor(t/6e4)%60);$('s').textContent=p(Math.floor(t/1e3)%60)}
tick();setInterval(tick,1000);

/* guest list */
function fill(ul,arr){ul.innerHTML='';arr.forEach((r,i)=>{const li=document.createElement('li');li.textContent=r.name;li.style.animationDelay=(i*.05)+'s';ul.appendChild(li)})}
function render(list){
 const y=list.filter(r=>r.attending==='yes'),n=list.filter(r=>r.attending!=='yes');
 fill($('yes'),y);fill($('no'),n);
 $('empty').hidden=list.length>0;$('awayBox').hidden=!n.length;
 $('cnt').textContent=y.length?(y.length===1?'1 guest will be attending':y.length+' guests will be attending'):''}

/* storage: shared Google Sheet via Apps Script, or per-device preview mode */
const LS='deepali_rsvps';
let cur=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function localList(){try{return JSON.parse(localStorage.getItem(LS)||'[]')}catch(e){return[]}}
async function load(strict){
 if(!SCRIPT_URL){cur=localList();render(cur);$('loc').textContent='Preview mode — names are only saved on this device. Add your Apps Script URL in script.js so everyone sees the same list.';$('loc').hidden=false;return}
 try{
  const r=await fetch(SCRIPT_URL+(SCRIPT_URL.includes('?')?'&':'?')+'t='+Date.now());
  if(!r.ok)throw new Error('HTTP '+r.status);
  const d=await r.json();                       // throws if Google returned a login/error page instead of JSON
  if(!Array.isArray(d))throw new Error('Unexpected response');
  cur=d.sort((a,b)=>(a.ts||0)-(b.ts||0));render(cur);$('loc').hidden=true;
 }catch(e){
  console.error('RSVP list could not be loaded. Check the Apps Script deployment (access: Anyone) and the /exec URL in script.js.',e);
  $('loc').textContent='Could not refresh the guest list just now. It will retry shortly.';$('loc').hidden=false;
  if(strict)throw e;
 }
}
load();setInterval(()=>{if(!document.hidden)load()},15000);

$('f').addEventListener('submit',async e=>{
 e.preventDefault();
 const name=$('nm').value.trim(),a=(document.querySelector('input[name=a]:checked')||{}).value,ask=$('ask').value.trim(),msg=$('msg');
 msg.className='';
 if(!name){msg.className='err';msg.textContent='Please tell us your name first ♥';return}
 if(!a){msg.className='err';msg.textContent='Will you be joining us? Pick one above ♥';return}
 $('go').disabled=true;
 const has=()=>cur.some(r=>String(r.name).trim().toLowerCase()===name.toLowerCase());
 try{
  if(SCRIPT_URL){
   // no-cors: the browser sends it without needing a readable response (avoids redirect/CORS failures)
   await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',body:JSON.stringify({name,attending:a,ask})});
  }else{
   const l=localList().filter(r=>r.name.toLowerCase()!==name.toLowerCase());l.push({name,attending:a,ts:Date.now()});
   localStorage.setItem(LS,JSON.stringify(l));
  }
  await load(true);
  for(let i=0;i<3&&!has();i++){await sleep(1500);await load(true)}   // give the Sheet a moment
  if(!has())throw new Error('Name not found in list after saving');
  msg.textContent=a==='yes'?'Wonderful, '+name+' — your name is on the list. See you on the 19th ♥':'Thank you for letting us know, '+name+'. You will be missed ♡';
  if(a==='yes'&&!calm){const b=$('go').getBoundingClientRect();burst(b.left+b.width/2,b.top+b.height/2,22)}
  $('f').reset();
 }catch(err){
  console.error('RSVP failed:',err);
  msg.className='err';msg.textContent='Your reply could not be saved. Please try once more.';
 }
 $('go').disabled=false;
});
