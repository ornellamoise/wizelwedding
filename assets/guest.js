/* Identification des invités par numéro de téléphone.
   Tant que WORKER_URL est vide, le site reste ouvert à tous (rien ne change). */
(function(){
var WORKER_URL='https://invites.ornella-moise.workers.dev/';
var KEY='ww_guest';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function save(g){try{localStorage.setItem(KEY,JSON.stringify(g))}catch(e){}}
var guest=load();

/* RSVP : le nom est déjà connu → on cache le champ et on le pré-remplit */
function rsvp(){
 var f=document.getElementById('rsvp-form');if(!f||!guest)return;
 var n=f.querySelector('input[name=nom]');if(!n)return;
 n.value=guest.f||guest.p;n.type='hidden';n.removeAttribute('required');
 var p=n.previousElementSibling;
 if(p&&p.tagName==='P'){p.textContent='Réponse de '+(guest.f||guest.p)+'.';}
 var t=document.createElement('input');t.type='hidden';t.name='telephone';t.value=guest.t||'';f.appendChild(t);
}

function open_(a){
 var box=a.parentNode,mob=!!box.style.position;
 var fs=mob?'12.5px':'15px',h=mob?'42px':'60px',w=mob?'270px':'400px';
 var ff="font-family:Anybody,system-ui,sans-serif;font-variation-settings:'wdth' 125;font-weight:500;font-size:"+fs+";letter-spacing:.14em;text-transform:uppercase;";
 var st='box-sizing:border-box;border:1px solid #000;border-radius:0;background:transparent;color:#000;width:'+w+';max-width:100%;height:'+h+';padding:0 16px;'+ff;
 if(!document.getElementById('wwph')){var c=document.createElement('style');c.id='wwph';c.textContent='.btn-in input::placeholder{color:#000;opacity:.55;font-size:'+(mob?'11px':'15px')+';letter-spacing:'+(mob?'.1em':'.14em')+'}.btn-in input:focus{outline:2px solid #C03325;outline-offset:2px}';document.head.appendChild(c);}
 box.innerHTML='<form novalidate style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%"><input type="tel" inputmode="tel" autocomplete="tel" placeholder="Numéro de téléphone" aria-label="Numéro de téléphone" style="'+st+'text-align:center;'+(mob?'font-size:16px;':'')+'"><button type="submit" style="'+st+'cursor:pointer;text-align:center">Entrer</button><div class="e" role="alert" style="min-height:0;font:400 '+(mob?'15px':'17px')+' \'Instrument Serif\',serif;color:#C03325;text-align:center"></div></form>';
 var form=box.querySelector('form'),inp=box.querySelector('input'),err=box.querySelector('.e'),btn=box.querySelector('button');

 form.addEventListener('submit',function(ev){ev.preventDefault();
  var tel=inp.value.replace(/\D/g,'');
  if(tel.length<9){err.textContent='Numéro invalide.';return}
  btn.disabled=true;err.textContent='';
  fetch(WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tel:tel})})
  .then(function(r){if(r.status===404)throw 404;if(!r.ok)throw 0;return r.json()})
  .then(function(g){guest={p:g.prenom,f:g.nom,t:tel};save(guest);
   location.href='programme.html';})
  .catch(function(c){btn.disabled=false;err.textContent=c===404?'Numéro non reconnu. Contactez Ornella et William.':'Un problème est survenu, réessayez.';});
 });
}
function welcome(){
 if(!guest||!/programme\.html/.test(location.pathname))return;
 var h=document.querySelector('header');if(!h)return;
 var m=location.pathname.indexOf('/m/')>=0,d=document.createElement('div');
 d.textContent='Bienvenue '+(guest.p||'');
 d.style.cssText="text-align:center;font-family:'Inter Tight',system-ui,sans-serif;text-transform:uppercase;color:#C03325;"+(m?'font-size:12px;line-height:16px;letter-spacing:.14em;padding-top:27px;margin-bottom:-9px':'font-size:16px;line-height:20px;letter-spacing:.16em;padding-top:38px;margin-bottom:-14px');
 h.parentNode.insertBefore(d,h.nextSibling);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',welcome);else welcome();
function init(){
 if(guest||!WORKER_URL)return;
 var home=/(^|\/)(index\.html)?$/.test(location.pathname);
 if(!home){location.replace('index.html');return}
 var a=document.querySelector('.btn-in a');if(!a)return;
 a.textContent="Je m'identifie";a.addEventListener('click',function(e){e.preventDefault();open_(a);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rsvp);else rsvp();
})();
