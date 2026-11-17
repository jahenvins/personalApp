import {motion} from "framer-motion";import {ArrowRight} from "lucide-react";
export default function ReactionPopup({emoji,text,onNext}:{emoji:string;text:string;onNext:()=>void}){
return <motion.div className="fixed inset-0 z-40 flex items-end bg-burgundy/60 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}}>
<motion.div className="paper mx-auto w-full max-w-[430px] rounded-t-[36px] p-7 pb-[calc(env(safe-area-inset-bottom)+24px)] text-center" initial={{y:"100%"}} animate={{y:0}} transition={{type:"spring",damping:18}}>
<motion.div className="text-6xl" animate={{rotate:[0,-12,12,0]}} transition={{repeat:2,duration:.5}}>{emoji}</motion.div>
<p className="mt-3 whitespace-pre-line font-serif text-2xl font-bold leading-snug text-crimson">{text}</p>
<button onClick={onNext} className="mt-6 inline-flex items-center gap-2 rounded-full bg-crimson px-8 py-4 font-semibold text-ivory shadow-lg active:scale-95">Continue <ArrowRight size={18}/></button></motion.div></motion.div>}
