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

function open_(){
 var css=document.createElement('style');
 css.textContent='#wwg{position:fixed;inset:0;z-index:99999;background:#FCF7EC;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;text-align:center;color:#2B1812}'+
 '#wwg h1{margin:0 0 10px;font:400 44px/1.1 "Instrument Serif",serif;letter-spacing:.01em;text-transform:uppercase;color:#C03325}'+
 '#wwg p{margin:0 0 22px;font:400 22px/1.3 "Instrument Serif",serif;color:#000}'+
 '#wwg input{display:block;width:100%;max-width:320px;margin:0 auto 14px;box-sizing:border-box;padding:14px 16px;border:1px solid #000;border-radius:0;background:transparent;color:#000;font:400 18px "Inter Tight",system-ui,sans-serif;text-align:center}'+
 '#wwg button{min-height:46px;padding:0 28px;border:1px solid #000;border-radius:0;background:transparent;color:#000;font:400 12.5px "Inter Tight",system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}'+
 '#wwg .e{margin:14px 0 0;min-height:20px;font:400 16px "Instrument Serif",serif;color:#C03325}';
 document.head.appendChild(css);
 var o=document.createElement('div');o.id='wwg';
 o.innerHTML='<form novalidate style="width:100%;max-width:420px"><h1>The Wizel Wedding</h1><p>Entrez votre numéro de téléphone pour accéder au site.</p><input type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" aria-label="Numéro de téléphone"><button type="submit">Entrer</button><div class="e" role="alert"></div></form>';
 document.documentElement.appendChild(o);
 var form=o.querySelector('form'),inp=o.querySelector('input'),err=o.querySelector('.e'),btn=o.querySelector('button');
 form.addEventListener('submit',function(ev){ev.preventDefault();
  var tel=inp.value.replace(/\D/g,'');
  if(tel.length<9){err.textContent='Numéro invalide.';return}
  btn.disabled=true;err.textContent='';
  fetch(WORKER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tel:tel})})
  .then(function(r){if(r.status===404)throw 404;if(!r.ok)throw 0;return r.json()})
  .then(function(g){guest={p:g.prenom,f:g.nom,t:tel};save(guest);
   form.innerHTML='<h1>Bienvenue '+String(g.prenom).replace(/[<>&"]/g,'')+'</h1>';
   setTimeout(function(){location.href='programme.html'},1600);})
  .catch(function(c){btn.disabled=false;err.textContent=c===404?'Numéro non reconnu. Vérifiez-le ou contactez Ornella et William.':'Un problème est survenu, réessayez.';});
 });
}
function init(){
 if(guest||!WORKER_URL)return;
 var home=/(^|\/)(index\.html)?$/.test(location.pathname);
 if(!home){location.replace('index.html');return}
 var a=document.querySelector('.btn-in a');if(!a)return;
 a.textContent="Je m'identifie";a.addEventListener('click',function(e){e.preventDefault();open_();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rsvp);else rsvp();
})();
