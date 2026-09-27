import * as T from './assets/three.module.min.js';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let scenes=new Map(),observer,raf=0,last=0,visible=true,dirty=true;
const sharedRenderer=new T.WebGLRenderer({alpha:true,antialias:innerWidth>760,powerPreference:'low-power'});
sharedRenderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<761?1:1.35));sharedRenderer.setClearColor(0,0);sharedRenderer.outputColorSpace=T.SRGBColorSpace;sharedRenderer.toneMapping=T.ACESFilmicToneMapping;sharedRenderer.toneMappingExposure=1.4;
sharedRenderer.domElement.className='showroom-canvas';sharedRenderer.domElement.setAttribute('aria-hidden','true');document.body.append(sharedRenderer.domElement);
const paused=()=>reduce.matches||document.body.classList.contains('motion-paused');
const small=()=>innerWidth<761;
const environment=new T.TextureLoader().load('/assets/horizon-800.webp');environment.mapping=T.EquirectangularReflectionMapping;environment.colorSpace=T.SRGBColorSpace;
function create(el){
  if(scenes.has(el)||!el.isConnected)return;
  const renderer=sharedRenderer;
  const scene=new T.Scene();scene.environment=environment;
  const camera=new T.PerspectiveCamera(40,1,.1,70);camera.position.set(0,.3,9);
  const group=new T.Group();scene.add(group);
  const gold=new T.MeshStandardMaterial({color:0xd9b253,metalness:.93,roughness:.27});
  const chrome=new T.MeshStandardMaterial({color:0xd3d1c8,metalness:.95,roughness:.2});
  const glass=new T.MeshPhysicalMaterial({color:0x97876b,metalness:.3,roughness:.16,transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false});
  const dark=new T.MeshStandardMaterial({color:0x22231f,metalness:.8,roughness:.4});
  const glow=new T.MeshBasicMaterial({color:0xebcc75,transparent:true,opacity:.65});
  const red=new T.MeshStandardMaterial({color:0x822b25,metalness:.45,roughness:.3});
  const add=(geo,mat,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);group.add(m);return m;};
  const ring=(r,t,mat=gold)=>add(new T.TorusGeometry(r,t,small()?6:10,small()?52:90),mat);
  const box=(w,h,d,mat=chrome,x=0,y=0,z=0)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z);
  const id=Number(el.dataset.scene);
  if(id===0||id===7){
    const a=ring(2.25,.055,chrome);a.rotation.set(.2,.5,.4);
    const b=ring(2.5,.035,gold);b.rotation.set(.55,-.4,0);
    const c=ring(2.85,.014,glow);c.rotation.set(.3,.7,0);
    for(let i=0;i<6;i++){let g=box(.55,.8,.02,glass,Math.cos(i)*3,Math.sin(i)*2.15,-.8);g.rotation.set(.3,i*.4,.2);}
    if(id===0&&el.classList.contains('featured-scene')){group.position.x=small()?0:2.3;group.position.y=small()?-.8:.3;group.scale.setScalar(small()?.62:.78);}
    if(id===7){group.scale.setScalar(1.05);group.position.y=.45;}
  } else if(id===1){
    const r=ring(2.05,.085,chrome);r.rotation.x=.6;
    box(2.8,.06,.06,gold,0,1.1,-.7);box(.05,1.7,.05,gold,-1.38,.26,-.7);box(.05,1.7,.05,gold,1.38,.26,-.7);
    for(let i=0;i<3;i++){let g=box(.85,.4,.04,glass,-2.2+i*2.2,-1.45,-.2);g.rotation.y=.25;}
  } else if(id===2){
    for(let i=0;i<5;i++){const g=box(4.1-i*.45,.025,.025,i%2?chrome:glow,0,(i-2)*.68,-1+i*.17);g.rotation.z=-.35;}
    for(let i=0;i<3;i++){let g=box(2.7-i*.35,2.3-i*.35,.025,glass,(i-1)*.7,0,-.5-i*.2);g.rotation.y=.4;}
  } else if(id===3){
    for(let i=0;i<5;i++){let g=box(1.0,1.75,.035,glass,(i-2)*1.02,.1,Math.abs(i-2)*.3-1);g.rotation.y=(i-2)*-.2;box(.55,.017,.04,gold,(i-2)*1.02,-.7,Math.abs(i-2)*.3-.94);}
    const r=ring(2.5,.025,gold);r.rotation.x=1.15;r.position.y=-1.1;
  } else if(id===4){
    let r=ring(2.1,.16,red);r.rotation.y=.45;r.rotation.x=.2;
    r=ring(2.45,.035,chrome);r.rotation.x=.5;r.rotation.y=-.4;
    for(let i=0;i<4;i++){let g=box(.65,.65,.06,glass,Math.cos(i*1.5)*2.3,Math.sin(i*1.5)*2,0);g.rotation.z=.4;}
  } else if(id===5){
    for(let i=0;i<3;i++){const g=box(.15,3.9,.12,i===1?gold:chrome,(i-1)*.8,0,-.5);g.rotation.z=-.43;}
    let r=ring(2.1,.026,glow);r.rotation.x=.6;
  } else if(id===6){
    for(let i=0;i<5;i++){const g=ring(2.15-i*.24,.035,i%2?gold:chrome);g.position.z=-i*.35;g.rotation.y=.35;g.scale.y=1.1;}
  } else {
    group.scale.setScalar(.74);camera.position.z=6;
    const type=id%6;
    if(type===4){let r=ring(1.4,.13);r.rotation.set(.6,.3,0);let r2=ring(1.65,.022,chrome);r2.rotation.y=.7;}
    if(type===5){for(let i=0;i<3;i++){const g=box(1.4-i*.18,2-i*.2,.1,i===1?gold:chrome,(i-1)*.55,0,-i*.45);g.rotation.y=.45;}}
    if(type===0){for(let i=0;i<4;i++){let g=box(2.6-i*.35,.13,.12,i%2?gold:chrome,-.15*i,(i-1.5)*.45,0);g.rotation.z=.35;}}
    if(type===1){const g=add(new T.IcosahedronGeometry(1.35,0),gold);g.rotation.set(.2,.4,.1);add(new T.IcosahedronGeometry(1.7,0),new T.MeshBasicMaterial({color:0xcfc3a2,wireframe:true,transparent:true,opacity:.4}));}
    if(type===2){for(let i=0;i<3;i++){let g=ring(1.3,.06,i%2?chrome:gold);g.rotation.set(i*.8,.3+i*.5,0);}}
    if(type===3){for(let i=0;i<4;i++){let g=box(.48,.5+i*.35,.5,i%2?gold:chrome,(i-1.5)*.64,(i*.35)/2-.5,0);g.rotation.y=.35;}}
  }
  scene.add(new T.HemisphereLight(0xffedce,0x191c25,2.3));
  const key=new T.DirectionalLight(0xffe4a2,5);key.position.set(-4,6,5);scene.add(key);
  const edge=new T.PointLight(0xd2e8ff,18,30);edge.position.set(5,1,3);scene.add(edge);
  const pos=new Float32Array((small()?24:65)*3);for(let i=0;i<pos.length;i+=3){pos[i]=(Math.random()-.5)*12;pos[i+1]=(Math.random()-.5)*7;pos[i+2]=(Math.random()-.5)*5;}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));const dust=new T.Points(geo,new T.PointsMaterial({color:0xe6ce89,size:.024,transparent:true,opacity:.45,depthWrite:false}));scene.add(dust);
  const item={renderer,scene,camera,group,dust,el,time:0,pointer:[0,0],w:0,h:0};scenes.set(el,item);
  el.dataset.render='webgl';dirty=true;
}
function render(o,t){
  const {el,renderer,scene,camera,group,dust}=o;const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
  if(w!==o.w||h!==o.h){o.w=w;o.h=h;camera.aspect=w/h;camera.updateProjectionMatrix();}
  if(el.classList.contains('featured-scene')){group.position.set(small()?0:Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.z*camera.aspect*.46,small()?-.8:.3,0);group.scale.setScalar(small()?.62:.78);}
  if(!paused()){o.time+=t;group.rotation.y=Math.sin(o.time*.14)*.09+o.pointer[0]*.09;group.rotation.x=Math.sin(o.time*.1)*.045+o.pointer[1]*.035;dust.rotation.y=o.time*.016;camera.position.x+=(o.pointer[0]*.16-camera.position.x)*.035;camera.position.y=.3+(el.getBoundingClientRect().top/innerHeight-.5)*.08;camera.lookAt(0,0,0);}
  const rect=el.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight||rect.right<0||rect.left>innerWidth)return;
  renderer.setViewport(rect.left,innerHeight-rect.bottom,w,h);renderer.setScissor(Math.max(0,rect.left),Math.max(0,innerHeight-rect.bottom),Math.min(innerWidth,rect.right)-Math.max(0,rect.left),Math.min(innerHeight,rect.bottom)-Math.max(0,rect.top));renderer.render(scene,camera);
}
function dispose(el){const o=scenes.get(el);if(!o)return;o.scene.traverse(x=>{x.geometry?.dispose();if(x.material){const mats=Array.isArray(x.material)?x.material:[x.material];mats.forEach(m=>m.dispose());}});scenes.delete(el);dirty=true;}
function tick(now){raf=requestAnimationFrame(tick);if(!visible||now-last<1000/(small()?24:30))return;const dt=Math.min((now-last)/1000,.1);last=now;if(paused()&&!dirty)return;dirty=false;const canvas=sharedRenderer.domElement;if(canvas.clientWidth!==innerWidth||canvas.clientHeight!==innerHeight||canvas.width!==Math.round(innerWidth*sharedRenderer.getPixelRatio()))sharedRenderer.setSize(innerWidth,innerHeight,false);sharedRenderer.setScissorTest(false);sharedRenderer.clear();sharedRenderer.setScissorTest(true);scenes.forEach(o=>render(o,dt));}
export function mountScenes(){observer?.disconnect();[...scenes.keys()].forEach(dispose);observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)create(e.target);else dispose(e.target);});},{rootMargin:'70px'});document.querySelectorAll('[data-scene]').forEach(el=>{observer.observe(el);el.addEventListener('pointermove',e=>{const s=scenes.get(el);if(!s||small())return;const b=el.getBoundingClientRect();s.pointer=[(e.clientX-b.left)/b.width-.5,(e.clientY-b.top)/b.height-.5];},{passive:true});el.addEventListener('pointerleave',()=>{const s=scenes.get(el);if(s)s.pointer=[0,0];});});if(!raf)raf=requestAnimationFrame(tick);}
addEventListener('resize',()=>{dirty=true;sharedRenderer.setSize(innerWidth,innerHeight,false);},{passive:true});
addEventListener('scroll',()=>dirty=true,{passive:true});
addEventListener('motionchange',()=>dirty=true);
reduce.addEventListener('change',()=>dirty=true);
document.addEventListener('visibilitychange',()=>{visible=!document.hidden});
mountScenes();
