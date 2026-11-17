import {useEffect,useState} from "react";import {Music,Pause,Play,Volume2,VolumeX} from "lucide-react";import {audio} from "../lib/audio";
export default function MusicPlayer({covered=false,error=""}:{covered?:boolean;error?:string}){const [,setVersion]=useState(0),[volume,setVolume]=useState(60);useEffect(()=>audio.subscribe(()=>setVersion(value=>value+1)),[]);
const state=audio.state,on=audio.enabled,muted=audio.muted;
return <div aria-live="polite" title={error|| (state==="error"?"Background music could not be played":undefined)} className={`fixed bottom-[calc(env(safe-area-inset-bottom)+10px)] left-1/2 z-50 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2 rounded-full bg-burgundy/95 px-3 py-2 text-ivory shadow-xl transition-opacity ${covered?"pointer-events-none opacity-0":""}`}>
<Music size={14}/><span className="text-[11px]">{error||state==="error"?"Music unavailable":"Music"}</span>
<button type="button" aria-label={on?"Pause music":"Play music"} className="grid h-8 w-8 place-items-center rounded-full" onClick={()=>audio.toggle()}>{on?<Pause size={16}/>:<Play size={16}/>}</button>
<button type="button" aria-label={muted?"Unmute music":"Mute music"} className="grid h-8 w-8 place-items-center rounded-full" onClick={()=>audio.mute()}>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>}</button>
<input aria-label="Music volume" type="range" min="0" max="100" value={volume} className="w-14 accent-crimson" onChange={event=>{const value=Number(event.target.value);setVolume(value);audio.volume(value/100)}}/>
<span className="sr-only">{error||state==="error"?"Music unavailable":state==="loading"?"Music loading":state==="paused"?"Music paused":state==="idle"?"Music starts after you continue":`Music ${state}`}</span></div>}
