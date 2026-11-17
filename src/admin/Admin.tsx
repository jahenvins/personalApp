import {useEffect,useState} from "react";
import {supabase,imgUrl} from "../lib/supabase";
import {defaultQuestionEdits,parseQuestionEdits,STEPS} from "../data/questions";
import type {QuestionEdits} from "../types";

interface Row{id:string;started_at:string;completed_at:string|null;step:number;completed:boolean;compatibility:number;user_id:string}

export default function Admin(){
const [ok,setOk]=useState(false);
const [cred,setCred]=useState({e:"",p:""});
const [rows,setRows]=useState<Row[]>([]);
const [sel,setSel]=useState<string>();
const [ans,setAns]=useState<{question_id:string;answer_text:string}[]>([]);
const [prof,setProf]=useState<Record<string,string|number|null>>({});
const [letter,setLetter]=useState("");
const [sza,setSza]=useState("");
const [msg,setMsg]=useState("");
const [questionEdits,setQuestionEdits]=useState<QuestionEdits>(()=>defaultQuestionEdits());
const [imagePaths,setImagePaths]=useState<Record<string,string>>({});
const [polaroids,setPolaroids]=useState<Record<string,string>>({});
const [uploadingImage,setUploadingImage]=useState("");
const [uploadingPolaroid,setUploadingPolaroid]=useState("");
const [savingQuestions,setSavingQuestions]=useState(false);
const inp="w-full rounded-xl bg-cream p-3";

const load=async()=>{
const {data:membership,error:membershipError}=await supabase.from("admins").select("user_id").maybeSingle();
if(membershipError){setMsg(membershipError.message);return}
if(!membership){setMsg("This account is not an admin. Add its user ID to public.admins.");return}
const sessions=await supabase.from("sessions").select("*").order("started_at",{ascending:false});
if(sessions.error){setMsg(sessions.error.message);return}
const [settings,optionImages]=await Promise.all([
supabase.from("settings").select("*"),
supabase.from("option_images").select("question_id,option_index,path")
]);
if(settings.error){setMsg(settings.error.message);return}
if(optionImages.error){setMsg(optionImages.error.message);return}
setRows(sessions.data as Row[]);
for(const setting of settings.data??[]){
if(setting.key==="letter")setLetter(typeof setting.value==="string"?setting.value:String(setting.value??""));
if(setting.key==="music_sza")setSza(typeof setting.value==="string"?setting.value:"");
if(setting.key==="quiz_questions")setQuestionEdits({...defaultQuestionEdits(),...parseQuestionEdits(setting.value)});
if(setting.key.startsWith("polaroid_")&&typeof setting.value==="string")setPolaroids(current=>({...current,[setting.key]:setting.value}));
}
setImagePaths(Object.fromEntries((optionImages.data??[]).map(image=>[`${image.question_id}:${image.option_index}`,image.path as string])));
setOk(true);
};

useEffect(()=>{void supabase.auth.getSession().then(({data})=>{if(data.session&&!data.session.user.is_anonymous)void load()})},[]);

const open=async(r:Row)=>{
setSel(r.id);
const [answers,profile]=await Promise.all([
supabase.from("answers").select("question_id,answer_text").eq("session_id",r.id).order("answered_at"),
supabase.from("profiles").select("*").eq("id",r.user_id).maybeSingle()
]);
if(answers.error){setMsg(answers.error.message);return}
if(profile.error){setMsg(profile.error.message);return}
setAns(answers.data??[]);
setProf(profile.data??{});
};

const put=async(key:string,value:string)=>{
const {error}=await supabase.from("settings").upsert({key,value});
setMsg(error?error.message:"Saved ✓");
};

const up=async(f:File)=>{
const path=`gallery/${Date.now()}-${f.name}`;
const upload=await supabase.storage.from("photos").upload(path,f);
if(upload.error){setMsg(upload.error.message);return}
const record=await supabase.from("photos").insert({path,caption:f.name,meta:{size:f.size,type:f.type}});
if(record.error){setMsg(record.error.message);return}
setMsg("Uploaded "+imgUrl(path));
};

const uploadPolaroid=async(key:string,file:File)=>{
if(!file.type.startsWith("image/")){setMsg("Choose an image file.");return}
const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
const path=`polaroids/${key}-${Date.now()}-${safeName}`;
setUploadingPolaroid(key);
try{
const upload=await supabase.storage.from("photos").upload(path,file,{contentType:file.type});
if(upload.error){setMsg(upload.error.message);return}
const save=await supabase.from("settings").upsert({key,value:path});
if(save.error){
const cleanup=await supabase.storage.from("photos").remove([path]);
setMsg(cleanup.error?`${save.error.message} (uploaded file cleanup failed: ${cleanup.error.message})`:save.error.message);
return;
}
const previous=polaroids[key];
setPolaroids(current=>({...current,[key]:path}));
if(previous){
const cleanup=await supabase.storage.from("photos").remove([previous]);
if(cleanup.error){setMsg(`Photo saved, but the previous file could not be removed: ${cleanup.error.message}`);return}
}
setMsg("Polaroid photo uploaded.");
}catch(error){
setMsg(error instanceof Error?error.message:"Polaroid upload failed.");
}finally{
setUploadingPolaroid("");
}
};

const removePolaroid=async(key:string,label:string)=>{
const path=polaroids[key];
if(!path)return;
const {error}=await supabase.from("settings").delete().eq("key",key);
if(error){setMsg(error.message);return}
setPolaroids(current=>{const next={...current};delete next[key];return next});
const cleanup=await supabase.storage.from("photos").remove([path]);
setMsg(cleanup.error?`Removed from the quiz, but file cleanup failed: ${cleanup.error.message}`:`${label} photo removed.`);
};

const updateQuestion=(stepIndex:number,value:string)=>{
setQuestionEdits(current=>{
const key=String(stepIndex),step=STEPS[stepIndex];
if(step.k!=="q")return current;
const edit=current[key]??{q:step.q??"",o:[...(step.o??[])]};
return {...current,[key]:{...edit,q:value}};
});
};

const updateOption=(stepIndex:number,optionIndex:number,value:string)=>{
setQuestionEdits(current=>{
const key=String(stepIndex),step=STEPS[stepIndex];
if(step.k!=="q")return current;
const edit=current[key]??{q:step.q??"",o:[...(step.o??[])]};
const options=[...edit.o];
options[optionIndex]=value;
return {...current,[key]:{...edit,o:options}};
});
};

const toggleQuestionHidden=(stepIndex:number)=>{
const key=String(stepIndex),step=STEPS[stepIndex];
if(step.k!=="q")return;
const edit=questionEdits[key]??{q:step.q??"",o:[...(step.o??[])]};
const updated={...questionEdits,[key]:{...edit,hidden:!edit.hidden}};
setQuestionEdits(updated);
void saveQuestionEdits(updated,"Question visibility saved. Refresh the quiz to apply it.");
};

const saveQuestionEdits=async(edits:QuestionEdits,successMessage:string)=>{
const incomplete=Object.values(edits).some(edit=>!edit.q.trim()||edit.o.some(option=>!option.trim()));
if(incomplete){setMsg("Fill in every question and option before saving.");return}
setSavingQuestions(true);
try{
const {error}=await supabase.from("settings").upsert({key:"quiz_questions",value:edits});
setMsg(error?error.message:successMessage);
}catch(error){
setMsg(error instanceof Error?error.message:"Could not save question settings.");
}finally{
setSavingQuestions(false);
}
};
const saveQuestions=()=>void saveQuestionEdits(questionEdits,"Questions and options saved. Refresh the quiz to see changes.");

const uploadOptionImage=async(stepIndex:number,optionIndex:number,file:File)=>{
if(!file.type.startsWith("image/")){setMsg("Choose an image file.");return}
const imageKey=`q${stepIndex}:${optionIndex}`;
const questionId=`q${stepIndex}`;
const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
const path=`option-images/${questionId}-${optionIndex}-${Date.now()}-${safeName}`;
setUploadingImage(imageKey);
try{
const upload=await supabase.storage.from("photos").upload(path,file,{contentType:file.type});
if(upload.error){setMsg(upload.error.message);return}
const save=await supabase.from("option_images").upsert({question_id:questionId,option_index:optionIndex,path},{onConflict:"question_id,option_index"});
if(save.error){
const cleanup=await supabase.storage.from("photos").remove([path]);
setMsg(cleanup.error?`${save.error.message} (uploaded file cleanup failed: ${cleanup.error.message})`:save.error.message);
return;
}
const previous=imagePaths[imageKey];
setImagePaths(current=>({...current,[imageKey]:path}));
if(previous){
const cleanup=await supabase.storage.from("photos").remove([previous]);
if(cleanup.error){setMsg(`Photo saved, but the previous file could not be removed: ${cleanup.error.message}`);return}
}
setMsg("Option photo uploaded.");
}catch(error){
setMsg(error instanceof Error?error.message:"Photo upload failed.");
}finally{
setUploadingImage("");
}
};

const removeOptionImage=async(stepIndex:number,optionIndex:number)=>{
const imageKey=`q${stepIndex}:${optionIndex}`;
const path=imagePaths[imageKey];
if(!path)return;
const questionId=`q${stepIndex}`;
const {error}=await supabase.from("option_images").delete().eq("question_id",questionId).eq("option_index",optionIndex);
if(error){setMsg(error.message);return}
setImagePaths(current=>{const next={...current};delete next[imageKey];return next});
const cleanup=await supabase.storage.from("photos").remove([path]);
setMsg(cleanup.error?`Photo removed from the quiz, but file cleanup failed: ${cleanup.error.message}`:"Option photo removed.");
};

if(!ok)return <div className="paper mx-auto grid h-screen max-w-sm content-center gap-3 p-6">
<h1 className="font-serif text-3xl font-black text-crimson">Admin</h1>
<input className={inp} placeholder="Email" value={cred.e} onChange={e=>setCred({...cred,e:e.target.value})}/>
<input className={inp} type="password" placeholder="Password" value={cred.p} onChange={e=>setCred({...cred,p:e.target.value})}/>
<button className="rounded-full bg-crimson p-3 text-ivory" onClick={async()=>{const result=await supabase.auth.signInWithPassword({email:cred.e,password:cred.p});if(result.error)setMsg(result.error.message);else void load()}}>Sign in</button>
<p role="alert" className="text-sm text-crimson">{msg}</p>
</div>;

const questionRows=STEPS.flatMap((step,stepIndex)=>step.k==="q"?[{step,stepIndex}]:[]);
const polaroidSlots=[{key:"polaroid_intro_chirag",label:"Opening — Chirag"},{key:"polaroid_intro_jahnevi",label:"Opening — Jahnevi"},{key:"polaroid_sza",label:"Mid-game — Muscle Polaroid"},{key:"polaroid_result_us",label:"Result — Us"},{key:"polaroid_result_always",label:"Result — Always"}];
return <div className="paper h-screen overflow-y-auto p-6">
<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
<section>
<h2 className="font-serif text-2xl font-bold text-crimson">Sessions</h2>
{rows.map(r=><button key={r.id} onClick={()=>void open(r)} className={`mt-2 block w-full rounded-xl p-3 text-left ${sel===r.id?"bg-crimson text-ivory":"bg-cream"}`}>{new Date(r.started_at).toLocaleString()} · {r.completed?`done ${r.compatibility}%`:`step ${r.step}`}</button>)}
{sel&&<div className="mt-4 rounded-xl bg-white p-4 text-sm"><b>{String(prof.name??"")}</b> · age {String(prof.age??"?")} · {String(prof.height_cm??"?")} cm · {String(prof.weight_kg??"?")} kg{ans.map(a=><p key={a.question_id}>{a.question_id}: {a.answer_text}</p>)}</div>}
</section>

<section className="space-y-3">
<h2 className="font-serif text-2xl font-bold text-crimson">Content</h2>
<textarea className={inp} rows={8} value={letter} onChange={e=>setLetter(e.target.value)} placeholder="Birthday letter"/>
<button className="rounded-full bg-crimson px-5 py-2 text-ivory" onClick={()=>void put("letter",letter)}>Save letter</button>
<input className={inp} value={sza} onChange={e=>setSza(e.target.value)} placeholder="SZA – BMF embed/audio URL"/>
<button className="rounded-full bg-crimson px-5 py-2 text-ivory" onClick={()=>void put("music_sza",sza)}>Save music link</button>
<input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(file)void up(file);e.currentTarget.value=""}}/>
</section>

<section className="space-y-4 md:col-span-2">
<div><h2 className="font-serif text-2xl font-bold text-crimson">Game Polaroids</h2><p className="text-sm">Upload or replace the photos shown throughout the quiz.</p></div>
<p role="status" className="text-sm text-crimson">{msg}</p>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
{polaroidSlots.map(slot=>{
const path=polaroids[slot.key];
return <article key={slot.key} className="space-y-3 rounded-2xl bg-white/80 p-4 shadow">
<h3 className="font-semibold text-crimson">{slot.label}</h3>
<div className={path?"h-40 overflow-hidden rounded-lg":"hidden"}>{path&&<img src={imgUrl(path)} alt={slot.label} loading="lazy" decoding="async" className="h-full w-full object-cover"/>}</div>
<label className="block cursor-pointer rounded-full bg-burgundy px-4 py-2 text-center text-sm text-ivory">
{uploadingPolaroid===slot.key?"Uploading…":path?"Replace photo":"Upload photo"}
<input className="sr-only" type="file" accept="image/*" disabled={!!uploadingPolaroid} onChange={e=>{const file=e.target.files?.[0];if(file)void uploadPolaroid(slot.key,file);e.currentTarget.value=""}}/>
</label>
{path&&<button type="button" disabled={!!uploadingPolaroid} className="w-full text-sm underline disabled:opacity-50" onClick={()=>void removePolaroid(slot.key,slot.label)}>Remove photo</button>}
</article>;
})}
</div>
</section>

<section className="space-y-4 md:col-span-2">
<div className="flex flex-wrap items-center justify-between gap-3">
<div><h2 className="font-serif text-2xl font-bold text-crimson">Questions, options & photos</h2><p className="text-sm">Edit each existing question and its four options. Upload a photo for any option. Hidden questions are skipped; saved answers remain.</p></div>
<button type="button" disabled={savingQuestions} className="rounded-full bg-crimson px-5 py-2 text-ivory disabled:opacity-50" onClick={saveQuestions}>{savingQuestions?"Saving…":"Save questions"}</button>
</div>
{questionRows.map(({step,stepIndex},questionNumber)=>{
const edit=questionEdits[String(stepIndex)]??{q:step.q??"",o:[...(step.o??[])]};
return <article key={stepIndex} className="space-y-4 rounded-2xl bg-white/80 p-4 shadow">
<div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-crimson">Question {questionNumber+1}{edit.hidden?" · Hidden":""}</h3><button type="button" disabled={savingQuestions} className="text-sm underline disabled:opacity-50" onClick={()=>toggleQuestionHidden(stepIndex)}>{edit.hidden?"Restore in quiz":"Hide from quiz"}</button></div>
<input className={inp} aria-label={`Question ${questionNumber+1}`} value={edit.q} onChange={e=>updateQuestion(stepIndex,e.target.value)}/>
<div className="grid gap-3 sm:grid-cols-2">
{edit.o.map((option,optionIndex)=>{
const imageKey=`q${stepIndex}:${optionIndex}`;
const path=imagePaths[imageKey];
return <div key={optionIndex} className="space-y-2 rounded-xl bg-cream/60 p-3">
<label className="block text-xs font-semibold uppercase tracking-wide text-crimson">Option {optionIndex+1}</label>
<input className={inp} aria-label={`Question ${questionNumber+1} option ${optionIndex+1}`} value={option} onChange={e=>updateOption(stepIndex,optionIndex,e.target.value)}/>
<div className={path?"h-32 w-full overflow-hidden rounded-lg":"hidden"}>{path&&<img src={imgUrl(path)} alt={`Question ${questionNumber+1}, option ${optionIndex+1}`} className="h-full w-full object-cover"/>}</div>
<div className="flex flex-wrap items-center gap-2">
<label className="cursor-pointer rounded-full bg-burgundy px-4 py-2 text-sm text-ivory">
{uploadingImage===imageKey?"Uploading…":path?"Replace photo":"Upload photo"}
<input className="sr-only" type="file" accept="image/*" disabled={uploadingImage===imageKey} onChange={e=>{const file=e.target.files?.[0];if(file)void uploadOptionImage(stepIndex,optionIndex,file);e.currentTarget.value=""}}/>
</label>
{path&&<button type="button" className="text-sm underline" onClick={()=>void removeOptionImage(stepIndex,optionIndex)}>Remove photo</button>}
</div>
</div>;
})}
</div>
</article>;
})}
</section>
</div>
</div>;
}
