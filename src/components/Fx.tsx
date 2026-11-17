import {motion} from "framer-motion";
export default function Fx({kind,n=24}:{kind:"hearts"|"confetti";n?:number}){const c=["#A52C38","#70212B","#EBE6CB"];
return <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">{Array.from({length:n},(_,i)=>{const x=Math.random()*100,d=Math.random()*.8;
return kind==="hearts"?<motion.span key={i} className="absolute bottom-0 text-3xl" style={{left:`${x}%`}} initial={{y:0,opacity:1}} animate={{y:-900,opacity:0}} transition={{duration:3,delay:d}}>{["❤️","💕","😏"][i%3]}</motion.span>
:<motion.i key={i} className="absolute top-0 h-3 w-2 rounded-sm" style={{left:`${x}%`,background:c[i%3]}} initial={{y:-20,rotate:0}} animate={{y:900,rotate:720}} transition={{duration:2.6,delay:d}}/>})}</div>}
