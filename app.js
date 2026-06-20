const views=[...document.querySelectorAll('.view')];
const navLinks=[...document.querySelectorAll('[data-target]')];
const progressKeys=new Set(JSON.parse(localStorage.getItem('vertice-progress')||'[]'));
const requiredProgress=16;

function saveProgress(key){progressKeys.add(key);localStorage.setItem('vertice-progress',JSON.stringify([...progressKeys]));updateProgress()}
function updateProgress(){const manual=[...document.querySelectorAll('[data-progress]:checked')].length;const value=Math.min(100,Math.round(((progressKeys.size+manual)/requiredProgress)*100));document.getElementById('progressText').textContent=`${value}%`;document.getElementById('progressBar').style.width=`${value}%`}
function showView(id){views.forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.target===id));saveProgress(`view:${id}`);document.querySelector('.course-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');window.scrollTo({top:0,behavior:'smooth'})}
navLinks.forEach(button=>button.addEventListener('click',()=>showView(button.dataset.target)));
document.querySelector('.menu-toggle').addEventListener('click',e=>{const nav=document.querySelector('.course-nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(nav.classList.contains('open')))})

document.querySelectorAll('.risk-dot').forEach(button=>button.addEventListener('click',()=>{document.getElementById('riskTip').textContent=button.dataset.tip;saveProgress('risk-map')}));

const scenarios={
  corte:{title:'Corte o sangrado menor',intro:'Controla el sangrado sin contaminar la herida.',steps:[['1','Guantes'],['2','Presión directa'],['3','Cubrir'],['4','Vigilar']]},
  quemadura:{title:'Quemadura por plancha, secadora o cera',intro:'Retira la fuente y enfría con agua corriente fresca. No uses hielo.',steps:[['1','Alejar calor'],['2','Enfriar'],['3','Retirar accesorios'],['4','Cubrir']]},
  quimico:{title:'Salpicadura en piel u ojos',intro:'Consulta la etiqueta del producto y enjuaga de inmediato con abundante agua.',steps:[['1','Protegerse'],['2','Enjuagar'],['3','Retirar contaminado'],['4','Valorar ayuda']]},
  caida:{title:'Caída o golpe',intro:'No levantes de inmediato. Revisa dolor, conciencia y capacidad de movimiento.',steps:[['1','No mover'],['2','Evaluar'],['3','Aplicar frío envuelto'],['4','Escalar']]}
};
function renderScenario(key){const s=scenarios[key];document.getElementById('scenarioDetail').innerHTML=`<h3>${s.title}</h3><p>${s.intro}</p><div class="protocol-steps">${s.steps.map(x=>`<div><b>${x[0]}</b>${x[1]}</div>`).join('')}</div>`}
document.querySelectorAll('.scenario-tab').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.scenario-tab').forEach(b=>b.classList.remove('active'));button.classList.add('active');renderScenario(button.dataset.scenario);saveProgress(`scenario:${button.dataset.scenario}`)}));renderScenario('corte');

const sequences={choking:1,bandage:1,pass:1};
document.querySelectorAll('[data-sequence]').forEach(group=>group.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{const name=group.dataset.sequence;const expected=sequences[name];if(Number(button.dataset.step)!==expected){button.classList.add('wrong');setTimeout(()=>button.classList.remove('wrong'),650);return}button.classList.add('done');sequences[name]+=1;if(name==='bandage')document.querySelectorAll('.arm span')[Math.max(0,expected-2)]?.classList.add('show');if(name==='choking'&&expected===4){const thrust=document.getElementById('thrust');thrust.classList.remove('animate');void thrust.offsetWidth;thrust.classList.add('animate')}if(name==='pass'&&expected>=3){document.getElementById('spray').classList.add('on');document.getElementById('flame').classList.add(expected===4?'out':'low')}if(expected===4){saveProgress(`practice:${name}`);const feedback=document.getElementById(`${name}Feedback`);if(feedback)feedback.textContent='Secuencia completada. Intercambien roles y repitan.'}})));

const fireCases={paper:{decision:'Puede combatirse si es pequeño',equipment:'PQS ABC',advice:'Mantén la salida detrás de ti y apunta a la base.'},solvent:{decision:'Solo conato pequeño y contenido',equipment:'PQS ABC o CO₂',advice:'No uses agua: puede dispersar el líquido inflamable.'},electric:{decision:'Corta energía si es seguro',equipment:'CO₂ o PQS ABC',advice:'Nunca uses agua sobre equipo energizado.'},large:{decision:'EVACUAR Y LLAMAR AL 911',equipment:'No combatir',advice:'El humo y el crecimiento indican que ya no es un conato.'}};
document.querySelectorAll('.fire-choice').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.fire-choice').forEach(b=>b.classList.remove('active'));button.classList.add('active');const item=fireCases[button.dataset.fire];document.getElementById('fireDecision').textContent=item.decision;document.getElementById('fireEquipment').textContent=item.equipment;document.getElementById('fireAdvice').textContent=item.advice;document.getElementById('flame').className='flame';document.getElementById('spray').className='spray';saveProgress(`fire:${button.dataset.fire}`)}));
const winds=[['→','Hacia la derecha'],['↓','Hacia ti: cambia de posición'],['←','Hacia la izquierda'],['↑','Hacia el fondo']];let wind=0;document.getElementById('rotateWind').addEventListener('click',()=>{wind=(wind+1)%winds.length;document.getElementById('windArrow').textContent=winds[wind][0];document.getElementById('windLabel').textContent=winds[wind][1];saveProgress('wind')});

document.querySelectorAll('[data-progress]').forEach(box=>box.addEventListener('change',updateProgress));
document.getElementById('quizForm').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);const score=['q1','q2','q3','q4'].reduce((n,k)=>n+(data.get(k)==='1'?1:0),0);const pct=score*25;document.getElementById('scoreText').textContent=`${pct}%`;document.getElementById('scoreMessage').textContent=pct>=75?'Aprobado. Completen las cuatro demostraciones prácticas para cerrar la sesión.':'Repasen los módulos señalados antes de repetir la evaluación.';saveProgress('quiz')});
updateProgress();
