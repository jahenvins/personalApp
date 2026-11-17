type MusicState="idle"|"loading"|"playing"|"paused"|"error";

let context:AudioContext|undefined;
let player:HTMLAudioElement|undefined;
let trackUrl="";
let volume=.6;
let muted=false;
let enabled=true;
let activated=false;
let state:MusicState="idle";
const listeners=new Set<()=>void>();

function notify(){listeners.forEach(listener=>listener())}
function setState(next:MusicState){state=next;notify()}

function getPlayer(){
if(!player){
player=new Audio();
player.loop=true;
player.preload="auto";
player.volume=volume;
player.muted=muted;
player.addEventListener("playing",()=>setState("playing"));
player.addEventListener("pause",()=>{if(state!=="error")setState(trackUrl?"paused":"idle")});
player.addEventListener("error",()=>setState("error"));
}
return player;
}

function playMusic(){
if(!trackUrl){setState("idle");return}
const element=getPlayer();
setState("loading");
void element.play().then(()=>setState("playing")).catch(error=>{
setState("error");
console.error("Could not play background music:",error);
});
}

function playEffect(kind:"click"|"swoosh"){
if(!context||muted)return;
const now=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();
const duration=kind==="click"?.07:.25;
oscillator.type="sine";
gain.gain.setValueAtTime(.0001,now);
if(kind==="click"){
oscillator.frequency.setValueAtTime(740,now);
oscillator.frequency.exponentialRampToValueAtTime(520,now+.06);
gain.gain.exponentialRampToValueAtTime(Math.max(.0001,.08*volume),now+.06);
gain.gain.exponentialRampToValueAtTime(.0001,now+.07);
}else{
oscillator.type="triangle";
oscillator.frequency.setValueAtTime(760,now);
oscillator.frequency.exponentialRampToValueAtTime(180,now+.24);
gain.gain.linearRampToValueAtTime(Math.max(.0001,.05*volume),now+.03);
gain.gain.exponentialRampToValueAtTime(.0001,now+.24);
}
oscillator.connect(gain);
gain.connect(context.destination);
oscillator.start(now);
oscillator.stop(now+duration);
}

export function sfx(kind:"click"|"swoosh"){
if(muted)return;
if(!context)context=new AudioContext();
if(context.state==="running"){playEffect(kind);return}
void context.resume().then(()=>playEffect(kind)).catch(error=>console.error("Could not play interface sound:",error));
}

export const audio={
setTrack(url:string){
if(trackUrl===url)return;
trackUrl=url;
if(!url){
player?.pause();
if(player)player.removeAttribute("src");
setState("idle");
return;
}
const element=getPlayer();
element.src=url;
element.load();
if(activated&&enabled)playMusic();
},
start(){
activated=true;
if(enabled)playMusic();
},
stop(){player?.pause()},
toggle(){
enabled=!enabled;
if(enabled){activated=true;playMusic()}else{player?.pause();setState("paused")}
return enabled;
},
mute(){
muted=!muted;
if(player)player.muted=muted;
notify();
return muted;
},
volume(value:number){
volume=Math.max(0,Math.min(1,value));
if(player)player.volume=volume;
},
subscribe(listener:()=>void){
listeners.add(listener);
return()=>{listeners.delete(listener)};
},
get state(){return state},
get enabled(){return enabled},
get muted(){return muted}
};
