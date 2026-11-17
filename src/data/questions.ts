import type {QuestionEdits,Step} from "../types";
const P=["Option A (edit me)","Option B (edit me)","Option C (edit me)","Option D (edit me)"];
const G="Noted! 💌";
const Q=(m:string,ch:string,q:string,o:string[],e:string,r:string|string[],x:Partial<Step>={}):Step=>({k:"q",m,ch,q,o,e,r,...x});
export const STEPS:Step[]=[
{k:"name",m:"intro"},{k:"welcome",m:"intro"},
{k:"trans",m:"quiz",h:"Chapter 2 — Physical Investigation",t:"Let’s start with your measurements, shall we? 👀",b:"MEASURE ME →"},
{k:"phys",m:"quiz"},{k:"sza",m:"quiz"},
{k:"trans",m:"quiz",h:"Chapter 3 — Getting to Know You",t:"Now let’s see how well you know yourself... and how well you know me.",b:"LET’S GO →"},
Q("quiz","Ch 3","Where is YOUR favourite destination?",P,"🏝🏔🏙🌴",G),
Q("quiz","Ch 3","Now let’s see if you know where Jahnevi wants to go!",P,"✈️🗺🧳🌍",G),
Q("quiz","Ch 3","What kind of music do you enjoy the most?",P,"🎵🎸🎤🎧",G),
Q("quiz","Ch 3","Okay, what music genre does Jahnevi love the most?",P,"🎶🎹🥁🎻",G),
Q("quiz","Ch 3","Who is your celebrity crush?",P,"⭐🎬🎭🌟",G),
Q("quiz","Ch 3","Now, who do you think Jahnevi’s celebrity crush is?",["Chirag photo 1","Chirag photo 2","Chirag photo 3","Chirag photo 4"],"😎😏🤓😘","HAHAHAHA! LOOK AT YOU.\n\nObviously, it’s you, dumbo. Who else did you expect? 😂❤️",{fx:"hearts"}),
Q("quiz","Ch 3","Where do you love hanging out the most?",P,"☕🏞🎮🍕",G),
Q("quiz","Ch 3","And where does Jahnevi love hanging out?",P,"🛍📚🌆🍦",G),
Q("quiz","Ch 3","Who is your favourite superhero?",["Hero A (edit me)","Hero B (edit me)","Hero C (edit me)","Hero D (edit me)"],"🦸🦸‍♂️⚡🦇",G),
Q("quiz","Ch 3","If you could become any superhero in real life, who would you choose?",["Hero A (edit me)","Hero B (edit me)","Hero C (edit me)","Hero D (edit me)"],"💪🕷🔥🛡",G),
Q("quiz","Ch 3","Which superwoman do you think Jahnevi would love to be?",["Heroine A (edit me)","Heroine B (edit me)","Heroine C (edit me)","Heroine D (edit me)"],"🦸‍♀️👑✨🌟",G),
Q("quiz","Ch 3","What would be YOUR perfect date?",P,"🕯🎡🎬🌅",G),
Q("quiz","Ch 3","Now guess Jahnevi’s perfect date.",P,"🍷🎠📸🌙",G),
{k:"trans",m:"quiz",h:"Chapter 4 — The Food Investigation",t:"Time to investigate your stomach. 🍽",b:"FEED ME →"},
Q("quiz","Ch 4","What is your favourite type of food?",["Spicy 🌶️","Sweet 🍰","Healthy 🥗","All three, depending on my mood!"],"🌶🍰🥗🍽",["OH, YOU LIKE IT HOT? 😏🌶️","AWWWW, YOU ARE SWEET! 🍰❤️","OK MOOOO COW! 🐮🥬","Indecisive much? You just want everything! 😂"],{em:"😏😊🐮🤪"}),
{k:"trans",m:"quiz",h:"THE HATE DEPARTMENT 🚨",t:"Let’s investigate what gets on your nerves... and what gets on Jahnevi’s nerves.",b:"FILE COMPLAINT →"},
Q("quiz","Ch 5","What does Jahnevi hate the most?",["Chirag is living far away.","Chirag is not watching the reels she sends him.","Chirag is working.","Chirag is sleeping."],"🌏📱💼😴",["Distance is the villain here. Case noted. 😤","EXACTLY! I send you reels for a reason. WATCH THEM! 😭","Work again? Jahnevi would like to file a complaint.","Yes, because apparently sleep is more important than me. UNBELIEVABLE."]),
Q("quiz","Ch 5","What does Chirag hate?",["Not getting enough sleep.","Skipping gym.","Getting loads of work.","ALL OF THE ABOVE."],"😴🏋️💼💯",["Sleep deprivation. Valid. 😴","Skipping gym?! The muscles will be notified. 💪","Loads of work. Chirag, hydrate and survive. 💼","OH PLEASE. We both know you hate ALL OF THESE. 😂"]),
{k:"trans",m:"brain",h:"Chapter 6 — The Brain Test 🧠",t:"Okay, smarty boy... let’s check how smart you actually are.",b:"BEGIN TEST →"},
Q("brain","Ch 6","What is 6 + 4?",["1","5","9","10"],"","",{ok:3,rs:"YASSSS! Because YOU ARE A TEN! 😘❤️",rg:"CHIRAG. BABE. WE NEED TO TALK ABOUT YOUR MATHEMATICS. 😭",fx:"hearts"}),
Q("brain","Ch 6","You are running a race and you overtake the person in 2nd place. What place are you in now?",["1st place.","2nd place.","3rd place.","Disqualified for running too fast."],"🥇🥈🥉🚫","",{ok:1,rs:"OKAYYY! Someone is actually thinking! 👏",rg:"HAHAHA! I thought you were smarter than this. 😂"}),
Q("brain","Ch 6","If an attractive stranger flirts with you at a coffee shop, what is your legally and morally correct response?",["“I have a girlfriend, and she’s terrifying in a loving way.”","Pretend I’m deaf and mute until they walk away.","Hand them a business card of mine.","Say “Thanks, my mom thinks I’m handsome too.”"],"😇🤐💼🙈",["PERFECT. Jahnevi is terrifying AND proud. 💅","Acting career unlocked. Oscar pending. 🎭","A BUSINESS CARD?! Chirag. We’re revisiting this. 😤","Mom approved, girlfriend approved. 😂"]),
Q("brain","Ch 6","You are taking a photo of her in a cute outfit. How many photos do you take?",["One quick blurry shot and hand the phone back.","At least 47 photos from 6 different angles until she says “stop.”","Two photos, both with her eyes closed.","I start a burst shot and hope for a miracle."],"📱📸😑🎞","",{ok:1,rs:"CORRECT! That’s the bare minimum, actually. 📸❤️",rg:"PLEASE TAKE NOTES. WE NEED AT LEAST 47 GOOD PICTURES."}),
{k:"trans",m:"letter",h:"Chapter 7 — The Final Examination",t:"Well, Chirag...\n\nYou’ve made it this far.\n\nNow comes the most important part. Let’s see how much you actually know about Jahnevi.",b:"I’M READY →"},
Q("letter","Ch 7","What do you like most about Jahnevi?",P,"💞📷🌹💌",G),
Q("letter","Ch 7","If you had to brag about me to a stranger, what is your #1 selling point?",["My unmatched beauty and elite fashion sense.","My incredible humour (even when you don’t laugh at my jokes).","My elite snack-sharing skills and big heart.","ALL OF THE ABOVE."],"💄😂🍟💯",["Beauty AND taste. Acceptable. 💅","You laugh. I SEE you laughing. 😤","Snacks are a love language. 🍟","CORRECT ANSWER. FINALLY, SOMEONE UNDERSTANDS MY VALUE. 💅❤️"]),
Q("letter","Ch 7","What is your favourite thing we do together?",["Doing absolutely nothing.","Going on food runs and eating in the car.","Roasting each other until one of us laughs.","Deep late-night talks about random life stuff."],"🛋🚗🔥🌙",["Nothing with you is never nothing. 🛋❤️","Car snacks forever. 🚗🍔","Roast champion: still undecided. 🔥😂","Late-night talks are the best kind. 🌙❤️"],{fx:"hearts"}),
{k:"trans",m:"letter",h:"NOW LET’S TURN THE TABLES...",t:"Let’s see if you know what Jahnevi actually likes about YOU.",b:"TURN THEM →"},
Q("letter","Ch 8","What did Jahnevi like about you at first sight?",["How tall you were.","How pretty your eyes and smile were.","How sweet and low your voice sounded when you were talking to me.","ALL OF THE ABOVE."],"📏😍🗣💯",["Tall. Yes. Very. 😏","Those eyes. That smile. Dangerous. 😍","That voice, though. 🥺","ALL OF IT. Obviously. 😘"]),
Q("letter","Ch 8","What does Jahnevi admire most about you?",["How smart you are.","How enthusiastic you are.","How passionate you are.","How much you love me."],"🧠🔥💪❤️","IT’S EVERYTHING, DUMBOO! ❤️\n\nYour intelligence, your enthusiasm, your passion, your smile, the way you love me... EVERYTHING.",{fx:"hearts"}),
{k:"final",m:"letter"}
];
export function defaultQuestionEdits():QuestionEdits{
const edits:QuestionEdits={};
STEPS.forEach((step,index)=>{if(step.k==="q")edits[String(index)]={q:step.q??"",o:[...(step.o??[])],hidden:false}});
return edits;
}
export function parseQuestionEdits(value:unknown):QuestionEdits{
if(typeof value!=="object"||value===null||Array.isArray(value))return {};
const result:QuestionEdits={};
for(const [key,raw] of Object.entries(value as Record<string,unknown>)){
const index=Number(key),step=STEPS[index];
if(!Number.isInteger(index)||step?.k!=="q"||typeof raw!=="object"||raw===null||Array.isArray(raw))continue;
const edit=raw as Record<string,unknown>,optionsUnknown=edit.o;
if(typeof edit.q!=="string"||!Array.isArray(optionsUnknown)||optionsUnknown.length!==step.o?.length)continue;
const options=optionsUnknown.filter((option:unknown):option is string=>typeof option==="string");
if(options.length!==optionsUnknown.length)continue;
result[key]={q:edit.q,o:options,hidden:typeof edit.hidden==="boolean"?edit.hidden:false};
}
return result;
}
export function applyQuestionEdits(edits:QuestionEdits):Step[]{
return STEPS.map((step,index)=>{const edit=edits[String(index)];return step.k==="q"&&edit?{...step,q:edit.q,o:edit.o,hidden:edit.hidden??false}:step});
}
