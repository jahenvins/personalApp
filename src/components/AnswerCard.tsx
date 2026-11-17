import {motion} from "framer-motion";import {Check} from "lucide-react";import {imgUrl} from "../lib/supabase";
interface P{label:string;emoji?:string;path?:string;selected:boolean;dim:boolean;onClick:()=>void;variant:"tile"|"pill"|"brain"|"love";tall?:boolean}
export default function AnswerCard({label,emoji,path,selected,dim,onClick,variant,tall}:P){
const base=variant==="pill"||variant==="brain"||variant==="love";
const cls=base?`relative flex w-full items-center gap-3 rounded-full px-5 py-4 text-left text-[15px] ${variant==="brain"?"bg-cream/10 text-ivory ring-1 ring-cream/30":variant==="love"?"bg-ivory font-serif italic":"bg-cream"}`:`relative overflow-hidden rounded-[28px] bg-cream ${tall?"row-span-2 min-h-[260px]":"min-h-[150px]"}`;
return <motion.button layout whileHover={{scale:1.03}} whileTap={{scale:.96}} animate={{opacity:dim&&!selected?.45:1,scale:selected?1.04:1}} transition={{type:"spring",stiffness:300,damping:20}} onClick={onClick} disabled={dim}
className={`${cls} shadow-lg ${selected?"ring-4 ring-crimson":""}`}>
{!base&&(path?<img src={imgUrl(path)} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-110"/>:<span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-ivory text-6xl">{emoji}</span>)}
{!base&&<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy/90 to-transparent p-3 pt-10 text-left text-sm font-semibold text-ivory">{label}</span>}
{base&&<>{path?<img src={imgUrl(path)} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover"/>:<span className="text-xl">{emoji}</span>}<span className="flex-1">{label}</span></>}
{selected&&<motion.span initial={{scale:0}} animate={{scale:1}} className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-crimson text-ivory"><Check size={16}/></motion.span>}
</motion.button>}
