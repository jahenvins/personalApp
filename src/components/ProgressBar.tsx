import {motion} from "framer-motion";
export default function ProgressBar({value,label}:{value:number;label:string}){return <div className="fixed inset-x-0 top-0 z-30 mx-auto max-w-[430px] px-5 pt-[calc(env(safe-area-inset-top)+14px)]">
<div className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[.25em] text-crimson"><span>Project Chirag</span><span>{label}</span></div>
<div className="h-1.5 rounded-full bg-cream"><motion.div className="h-full rounded-full bg-crimson" animate={{width:`${value*100}%`}} transition={{type:"spring",stiffness:80}}/></div></div>}
