import {useState} from "react";import {Music,Pause,Play,Volume2,VolumeX} from "lucide-react";import {audio} from "../lib/audio";
export default function MusicPlayer({mood}:{mood:string}){const [on,setOn]=useState(true),[mu,setMu]=useState(false);
return <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+14px)] right-3 z-50 flex items-center gap-2 rounded-full bg-burgundy/95 px-3 py-2 text-ivory shadow-xl">
<Music size={14}/><span className="text-[11px] capitalize">{mood}</span>
<button aria-label="play/pause" onClick={()=>setOn(audio.toggle())}>{on?<Pause size={16}/>:<Play size={16}/>}</button>
<button aria-label="mute" onClick={()=>setMu(audio.mute())}>{mu?<VolumeX size={16}/>:<Volume2 size={16}/>}</button>
<input aria-label="volume" type="range" className="w-14 accent-crimson" defaultValue={60} onChange={e=>audio.volume(+e.target.value/100)}/></div>}
