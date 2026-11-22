/* Identification des invités par numéro de téléphone.
   Tant que WORKER_URL est vide, le site reste ouvert à tous (rien ne change). */
(function(){
var WORKER_URL='https://invites.ornella-moise.workers.dev/';
var KEY='ww_guest2';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function save(g){try{localStorage.setItem(KEY,JSON.stringify(g))}catch(e){}}
var guest=load();

/* RSVP : le nom est déjà connu → on cache le champ et on le pré-remplit */
function rsvp(){
 var f=document.getElementById('rsvp-form');if(!f||!guest)return;
 var n=f.querySelector('input[name=nom]');if(!n)return;
 n.value=guest.f||guest.p;n.type='hidden';n.removeAttribute('required');
 var p=n.previousElementSibling;
 if(p&&p.tagName==='P'){p.textContent='Réponse de '+(guest.f||guest.p);p.style.textTransform='uppercase';}
 var t=document.createElement('input');t.type='hidden';t.name='telephone';t.value=guest.t||'';f.appendChild(t);
 var acc=guest.a||[];
 if(acc.length){
  var first=f.querySelector('input[name=mairie]');var list=first&&first.closest('div');
  if(list){
   var people=[guest.p].concat(acc),ev=[['Mairie','La Mairie'],['Welcome','La Welcome'],['Houppa','La Houppa'],['Aucun','Aucun']];
   var esc=function(x){return String(x).replace(/[<>&"]/g,'')};
   var wrap=document.createElement('div');wrap.className='wwfam';
   people.forEach(function(nm){
    var b=document.createElement('div');b.className='wwp';
    var h='<div class="wwn">'+esc(nm)+'</div><div class="wwg2">';
    ev.forEach(function(e){h+='<label class="wwo"><input class="chk" type="checkbox" name="Présence – '+esc(nm)+'" value="'+e[0]+'"><span class="box"></span><span class="wwl">'+e[1]+'</span></label>'});
    b.innerHTML=h+'</div>';wrap.appendChild(b);
   });
   list.parentNode.replaceChild(wrap,list);
   var cap=wrap.previousElementSibling;if(cap&&cap.tagName==='P')cap.textContent='Cochez les moments auxquels chacun participera.';
   var h2=document.createElement('input');h2.type='hidden';h2.name='Personnes';h2.value=people.join(', ');f.appendChild(h2);
   var st=document.createElement('style');
   st.textContent='.wwfam{width:100%;display:flex;flex-direction:column}.wwp{padding:22px 0 18px;border-top:1px solid rgba(43,24,18,.14)}.wwfam .wwp:last-child{border-bottom:1px solid rgba(43,24,18,.14)}.wwn{font-family:"Instrument Serif",serif;font-size:24px;line-height:28px;letter-spacing:.02em;text-transform:uppercase;color:#000;margin:0 0 14px;text-align:center}.wwg2{display:grid;grid-template-columns:auto auto;justify-content:space-between;gap:6px 18px}.wwo{display:flex;align-items:center;gap:14px;position:relative;padding:10px 0;cursor:pointer}.wwl{font-family:"Instrument Serif",serif;font-size:24px;line-height:28px;letter-spacing:.01em;text-transform:uppercase;color:#C03325}';
   document.head.appendChild(st);
  }
 }

}

function open_(a){
 var box=a.parentNode,mob=!!box.style.position;
 var fs=mob?'12.5px':'15px',h=mob?'42px':'60px',w=mob?'270px':'400px';
 var ff="font-family:Anybody,system-ui,sans-serif;font-variation-settings:'wdth' 125;font-weight:500;font-size:"+fs+";letter-spacing:.14em;text-transform:uppercase;";
 var st='box-sizing:border-box;border:1px solid #000;border-radius:0;background:transparent;color:#000;width:'+w+';max-width:100%;height:'+h+';padding:0 16px;'+ff;
 if(!document.getElementById('wwph')){var c=document.createElement('style');c.id='wwph';c.textContent='.btn-in input::placeholder{color:#000;opacity:.55;font-size:'+(mob?'11px':'15px')+';letter-spacing:'+(mob?'.1em':'.14em')+'}.btn-in input:focus{outline:2px solid #C03325;outline-offset:2px}';document.head.appendChild(c);}
 box.innerHTML='<form novalidate style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%"><input type="tel" inputmode="tel" autocomplete="tel" placeholder="Numéro de téléphone" aria-label="Numéro de téléphone" style="'+st+'text-align:center;'+(mob?'font-size:16px;':'')+'"><button type="submit" style="'+st+'cursor:pointer;text-align:center">Entrer</button><div class="e" role="alert" style="min-height:0;font:400 '+(mob?'15px':'17px')+' \'Instrument Serif\',serif;color:#000;text-align:center"></div></form>';
 var form=box.querySelector('form'),inp=box.querySelector('input'),err=box.querySelector('.e'),btn=box.querySelector('button');

 form.addEventListener('submit',function(ev){ev.preventDefault();
  var tel=inp.value.replace(/\D/g,'');
  if(tel.length<9){err.textContent='Numéro invalide.';return}
  btn.disabled=true;err.textContent='';try{mbegin()}catch(e){}
  fetch(WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tel:tel})})
  .then(function(r){if(r.status===404)throw 404;if(!r.ok)throw 0;return r.json()})
  .then(function(g){guest={p:g.prenom,f:g.nom,t:tel,a:g.acc||[]};save(guest);
   buildShell('programme.html');})
  .catch(function(c){mstop();mset(MK,'off');btn.disabled=false;err.textContent=c===404?'Numéro non reconnu. Contactez Ornella et William.':'Un problème est survenu, réessayez.';});
 });
}
function welcome(){
 if(!guest||!/programme\.html/.test(location.pathname))return;
 var h=document.querySelector('header');if(!h)return;
 var m=location.pathname.indexOf('/m/')>=0,d=document.createElement('div');
 d.textContent='Bienvenue '+(guest.p||'');
 d.style.cssText="position:relative;z-index:1;text-align:center;font-family:'Inter Tight',system-ui,sans-serif;text-transform:uppercase;color:#C03325;"+(m?'font-size:16px;line-height:21px;letter-spacing:.14em;padding-top:24.5px;margin-bottom:-11.5px':'font-size:21px;line-height:27px;letter-spacing:.16em;padding-top:34.5px;margin-bottom:-17.5px');
 h.parentNode.insertBefore(d,h.nextSibling);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',welcome);else welcome();
function init(){
 if(guest||!WORKER_URL)return;
 var home=/(^|\/)(index\.html)?$/.test(location.pathname);
 if(!home){try{top.location.replace('index.html')}catch(e){location.replace('index.html')}return}
 var a=document.querySelector('.btn-in a');if(!a)return;
 a.textContent="Je m'identifie";a.addEventListener('click',function(e){e.preventDefault();open_(a);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rsvp);else rsvp();

/* Musique : The Braxtons - The Boss (lecteur YouTube caché + bouton son) */
var MID='3QV_776uMOY',MK='ww_music',TK='ww_mt',mf=null,mb=null,mon=false;
function mget(k){try{return localStorage.getItem(k)}catch(e){return null}}
function mset(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function micon(on){mon=on;if(!mb)return;mb.setAttribute('aria-label',on?'Couper la musique':'Activer la musique');mb.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/>'+(on?'<path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>':'<path d="M17 9l5 6M22 9l-5 6"/>')+'</svg>'}
var AUD=null,AUDOK=false,AUDURL=(location.pathname.indexOf('/m/')>=0?'../':'')+'assets/musique.mp3';
try{fetch(AUDURL,{method:'HEAD'}).then(function(r){AUDOK=r.ok&&/audio|mpeg|octet/.test(r.headers.get('content-type')||'audio')}).catch(function(){})}catch(e){}
function mstart(sec){
 if(AUDOK){
  if(AUD)return;AUD=new Audio(AUDURL);AUD.loop=true;AUD.preload='auto';
  AUD.addEventListener('playing',function(){micon(true)});
  AUD.addEventListener('loadedmetadata',function(){try{if(sec&&AUD.duration)AUD.currentTime=sec%AUD.duration}catch(e){}});
  var pr=AUD.play();if(pr&&pr.catch)pr.catch(function(){micon(false)});return;
 }
 if(mf||!document.body)return;
 mf=document.createElement('iframe');mf.setAttribute('allow','autoplay');mf.setAttribute('aria-hidden','true');mf.tabIndex=-1;
 mf.style.cssText='position:fixed;left:0;bottom:0;width:2px;height:2px;border:0;opacity:0;pointer-events:none';
 mf.src='https://www.youtube.com/embed/'+MID+'?autoplay=1&loop=1&playlist='+MID+'&playsinline=1&controls=0&enablejsapi=1&start='+(sec||0);
 mf.addEventListener('load',function(){try{mf.contentWindow.postMessage(JSON.stringify({event:'listening',id:1,channel:'widget'}),'*')}catch(e){}});
 document.body.appendChild(mf);
}
function mstop(){if(AUD){AUD.pause();AUD=null}if(mf){mf.remove();mf=null}micon(false)}
function mbegin(){mset(MK,'on');mset(TK,String(Date.now()));mstart(0)}
window.addEventListener('message',function(e){
 if(String(e.origin).indexOf('youtube.com')<0)return;var d;try{d=JSON.parse(e.data)}catch(x){return}
 if(d.event==='onStateChange'&&d.info===1)micon(true);
 if(d.event==='infoDelivery'&&d.info&&d.info.playerState===1)micon(true);
 if(d.event==='onError'){mstop();mset(MK,'off');if(mb){mb.remove();mb=null}}
});
var OKP=/^(programme|hebergement|rsvp)\.html$/;
function mbtn(){
 if(mb)return;var m=location.pathname.indexOf('/m/')>=0;
 mb=document.createElement('button');mb.type='button';
 mb.style.cssText='position:fixed;top:'+(m?'6px':'10px')+';left:'+(m?'8px':'18px')+';z-index:2147483000;width:36px;height:36px;padding:0;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent';
 document.body.appendChild(mb);micon(!!mf&&mon);
 mb.addEventListener('click',function(){if(mon){mstop();mset(MK,'off')}else{mstop();mbegin()}});
}
function buildShell(target){
 if(document.getElementById('wwshell'))return;
 if(!OKP.test(target))target='programme.html';
 var f=document.createElement('iframe');f.id='wwshell';f.src=target;
 f.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;border:0;background:#FCF7EC;z-index:100';
 document.documentElement.style.overflow='hidden';document.body.appendChild(f);mbtn();
}
function shellInit(){
 var file=location.pathname.split('/').pop()||'index.html';
 var framed=false;try{framed=window.top!==window}catch(e){framed=true}
 if(framed||!guest)return;
 if(OKP.test(file)){location.replace('index.html');return}
 var go=(location.search.match(/[?&]go=([a-z]+\.html)/)||[])[1];
 var a=document.querySelector('.btn-in a');
 if(a)a.addEventListener('click',function(e){e.preventDefault();mbegin();buildShell('programme.html')});
 if(go){buildShell(go);if(mget(MK)==='on'){var t0=parseInt(mget(TK),10)||Date.now();mstart(Math.max(0,Math.floor((Date.now()-t0)/1000))%225)}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',shellInit);else shellInit();
})();
