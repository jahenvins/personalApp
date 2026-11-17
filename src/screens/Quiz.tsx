import {useEffect,useState} from "react";import {AnimatePresence,motion} from "framer-motion";
import {useQuiz} from "../lib/useQuiz";import {audio,sfx} from "../lib/audio";
import {optionImages,polaroidImages,saveProfile} from "../lib/quiz";import {imgUrl} from "../lib/supabase";import ProgressBar from "../components/ProgressBar";import MusicPlayer from "../components/MusicPlayer";
import AnswerCard from "../components/AnswerCard";import ReactionPopup from "../components/ReactionPopup";import Fx from "../components/Fx";import Polaroid from "../components/Polaroid";
import Result from "./Result";
const shell="paper mx-auto flex h-[100dvh] max-w-[430px] flex-col overflow-y-auto px-5 pb-28 pt-24";
export default function Quiz(){const {s,i,a,err,next,answer,finish,retake,steps}=useQuiz();const [imgs,setImgs]=useState<Record<string,string>>({});const [polaroids,setPolaroids]=useState<Record<string,string>>({});const [imageError,setImageError]=useState("");const [pop,setPop]=useState<{e:string;t:string}|null>(null);const [fx,setFx]=useState<"hearts"|"confetti"|null>(null);
const [f,setF]=useState({name:"",age:"",h:"",w:""});const [phase,setPhase]=useState(0);
const st=steps[i];
useEffect(()=>{let active=true;optionImages().then(setImgs).catch(e=>{if(active)setImageError(e instanceof Error?e.message:"Could not load option photos")});polaroidImages().then(setPolaroids).catch(e=>{if(active)setImageError(e instanceof Error?e.message:"Could not load Polaroid photos")});return()=>{active=false}},[]);
useEffect(()=>{if(st?.m)audio.setMood(st.m);setPop(null);setFx(null);setPhase(0);
if(st?.k==="sza"){sfx("pop");const a=setTimeout(()=>{setPhase(1);sfx("final");setFx("confetti")},1600),b=setTimeout(()=>{setPhase(2);setFx("hearts")},3600);return()=>{clearTimeout(a);clearTimeout(b)}}
if(st?.k==="final"){finish();sfx("final");setFx("confetti")}},[i]);
if(err)return <div className={shell}><h2 className="font-serif text-2xl text-crimson">Something went wrong</h2><p>{err}</p></div>;
if(!s||!st)return <div className="grid h-screen place-items-center bg-ivory font-serif text-2xl text-crimson">Loading…</div>;
const qn=steps.slice(0,i+1).filter(x=>x.k==="q"&&!x.hidden).length,total=steps.filter(x=>x.k==="q"&&!x.hidden).length;
const go=()=>{audio.start();sfx("click");next()};
const Btn=({t,on}:{t:string;on:()=>void})=><motion.button whileTap={{scale:.94}} onClick={on} className="mt-8 rounded-full bg-crimson px-8 py-4 font-semibold text-ivory shadow-xl">{t}</motion.button>;
const onPick=(idx:number)=>{audio.start();const g=st.ok==null||idx===st.ok;sfx(st.ok!=null?(g?"ok":"bad"):"fun");void answer(idx,st.o![idx]);
const t=st.ok!=null?(g?st.rs!:st.rg!):Array.isArray(st.r)?st.r[idx]:st.r!;setFx(st.fx==="hearts"||(st.ok!=null&&g)?"hearts":null);setTimeout(()=>setPop({e:st.em?[...st.em][idx]:g?"😘":"💬",t}),450)};
let body;
if(st.k==="name")body=<><h1 className="font-serif text-5xl font-black leading-[.95] text-crimson">Who are we investigating today?</h1><div className="mt-8 space-y-3">
<input className="w-full rounded-full bg-cream px-6 py-4 outline-none focus:ring-2 focus:ring-crimson" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
<p className="h-5 px-4 text-sm italic text-crimson">{f.name&&"Hehehe, I already know that, dumbo! 😂"}</p>
<input type="number" className="w-full rounded-full bg-cream px-6 py-4 outline-none focus:ring-2 focus:ring-crimson" placeholder="Your age" value={f.age} onChange={e=>setF({...f,age:e.target.value})}/>
<p className="h-5 px-4 text-sm italic text-crimson">{f.age&&"Seriously? As if I don’t know how old you are!"}</p></div>
<Btn t="Continue →" on={()=>{void saveProfile({name:f.name,age:+f.age||null});go()}}/></>;
else if(st.k==="welcome")body=<div className="my-auto text-center"><div className="mb-6 flex justify-center -space-x-8"><Polaroid src={polaroids.polaroid_intro_chirag?imgUrl(polaroids.polaroid_intro_chirag):undefined} caption="Chirag" rot={-8}/><Polaroid src={polaroids.polaroid_intro_jahnevi?imgUrl(polaroids.polaroid_intro_jahnevi):undefined} caption="Jahnevi" rot={7} emoji="💌"/></div>
<h1 className="font-serif text-5xl font-black text-crimson">PROJECT CHIRAG</h1><p className="mt-1 text-xs font-semibold uppercase tracking-[.3em]">The Mind Investigation ❤️</p>
<p className="mt-5 font-serif text-lg italic">We are going to find out how compatible you are with Jahnevi herself. Think you know everything?</p><Btn t="Initiate investigation →" on={go}/></div>;
else if(st.k==="trans")body=<div className="my-auto"><h1 className="whitespace-pre-line font-serif text-5xl font-black leading-[.95] text-crimson">{st.h}</h1><p className="mt-5 whitespace-pre-line font-serif text-xl italic">{st.t}</p><Btn t={st.b!} on={go}/></div>;
else if(st.k==="phys")body=<><h1 className="font-serif text-5xl font-black text-crimson">Let’s check the numbers 👀</h1><div className="mt-8 grid grid-cols-2 gap-4">
{([["h","cm","Height"],["w","kg","Weight"]] as const).map(([k,u,l])=><label key={k} className="rounded-[28px] bg-cream p-5"><span className="text-xs font-semibold uppercase tracking-widest text-crimson">{l}</span>
<input type="number" className="mt-2 w-full bg-transparent font-serif text-5xl font-black outline-none" placeholder="0" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/><span className="text-sm">{u}</span></label>)}</div>
<Btn t="Submit →" on={()=>{void saveProfile({height_cm:+f.h||null,weight_kg:+f.w||null});go()}}/></>;
else if(st.k==="sza")body=<div className="my-auto text-center"><AnimatePresence mode="wait"><motion.div key={phase} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{opacity:0}}>
{phase===0&&<h1 className="font-serif text-7xl font-black text-crimson">OMG...</h1>}
{phase===1&&<h1 className="font-serif text-4xl font-black leading-tight text-crimson">YOUNG AND HE FINE AND HE TALL AND HE HANDSOME!</h1>}
{phase===2&&<><Polaroid src={polaroids.polaroid_sza?imgUrl(polaroids.polaroid_sza):undefined} caption="IK YOU GOT MUSCLE.😋👅😛 HEHEHE. 😏"/><div><Btn t="Okay, enough flirting →" on={go}/></div></>}</motion.div></AnimatePresence></div>;
else if(st.k==="q"){const v=st.m==="brain"?"brain":st.m==="letter"?"love":st.o!.some(o=>o.length>24)?"pill":"tile";const sel=a[`q${i}`];
body=<><p className="text-[11px] font-semibold uppercase tracking-[.25em] text-crimson">{st.ch} · Question {String(qn).padStart(2,"0")} / {total}</p>
<h1 className={`mt-2 font-serif text-4xl font-black leading-[1.02] ${v==="brain"?"text-ivory":"text-crimson"}`}>{st.q}</h1>
<div className={v==="tile"?"mt-6 grid grid-cols-2 gap-3":"mt-6 space-y-3"}>{st.o!.map((o,idx)=><AnswerCard key={idx} label={o} emoji={[...st.e!][idx]} path={imgs[`q${i}:${idx}`]} variant={v} tall={v==="tile"&&(idx===0||idx===3)} selected={sel===idx} dim={sel!==undefined} onClick={()=>onPick(idx)}/>)}</div></>}
else body=<Result onRetake={retake}/>;
const bg=st.k==="q"&&st.m==="brain"?"!bg-burgundy !bg-none":"";
return <div className={`${shell} ${bg}`}>{imageError&&<p role="alert" className="mb-2 rounded-lg bg-red-100 p-2 text-sm text-red-700">{imageError}</p>}{st.k!=="final"&&<ProgressBar value={i/(steps.length-1)} label={st.k==="q"?`${qn}/${total}`:""}/>}
<AnimatePresence mode="wait"><motion.div key={i} className="flex min-h-full flex-col" initial={{x:80,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-80,opacity:0}} transition={{type:"spring",damping:22}}>{body}</motion.div></AnimatePresence>
{fx&&<Fx kind={fx}/>}{pop&&<ReactionPopup emoji={pop.e} text={pop.t} onNext={go}/>}<MusicPlayer mood={st.m??"intro"}/></div>}
