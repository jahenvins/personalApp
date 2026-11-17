import {supabase} from "./supabase";import type {Profile,QuizSession,AnswerMap,QuestionEdits} from "../types";import {parseQuestionEdits} from "../data/questions";
async function uid(){const {data}=await supabase.auth.getSession();if(data.session)return data.session.user.id;
const r=await supabase.auth.signInAnonymously();if(r.error||!r.data.user)throw r.error;return r.data.user.id}
export async function openSession():Promise<QuizSession&{answers:AnswerMap}>{const u=await uid();
const {data}=await supabase.from("sessions").select("*").eq("user_id",u).eq("completed",false).order("started_at",{ascending:false}).limit(1);
let s=data?.[0];if(!s){const r=await supabase.from("sessions").insert({user_id:u}).select().single();if(r.error)throw r.error;s=r.data}
return {...s,answers:await loadAnswers(s.id)}}
export async function newSession(){const u=await uid();const r=await supabase.from("sessions").insert({user_id:u}).select().single();if(r.error)throw r.error;return r.data as QuizSession}
export async function loadAnswers(id:string){const {data}=await supabase.from("answers").select("question_id,option_index").eq("session_id",id);
return Object.fromEntries((data??[]).map(a=>[a.question_id,a.option_index])) as AnswerMap}
export async function saveProfile(p:Partial<Profile>){const u=await uid();const {error}=await supabase.from("profiles").upsert({id:u,...p});if(error)throw error}
export async function saveAnswer(sid:string,qid:string,i:number,text:string){const u=await uid();
const {error}=await supabase.from("answers").upsert({session_id:sid,user_id:u,question_id:qid,option_index:i,answer_text:text},{onConflict:"session_id,question_id"});if(error)throw error}
export const saveStep=(id:string,step:number)=>supabase.from("sessions").update({step}).eq("id",id);
export const complete=(id:string)=>supabase.from("sessions").update({completed:true,completed_at:new Date().toISOString(),compatibility:100}).eq("id",id);
export async function getSetting<T>(k:string,d:T):Promise<T>{const {data}=await supabase.from("settings").select("value").eq("key",k).maybeSingle();return (data?.value as T)??d}
export async function polaroidImages():Promise<Record<string,string>>{const keys=["polaroid_intro_chirag","polaroid_intro_jahnevi","polaroid_sza","polaroid_result_us","polaroid_result_always"];const {data,error}=await supabase.from("settings").select("key,value").in("key",keys);if(error)throw error;const images:Record<string,string>={};for(const row of data??[])if(typeof row.value==="string"&&row.value)images[row.key]=row.value;return images}
export async function loadQuestionEdits():Promise<QuestionEdits>{const {data,error}=await supabase.from("settings").select("value").eq("key","quiz_questions").maybeSingle();if(error)throw error;return parseQuestionEdits(data?.value)}
export async function optionImages(){const {data,error}=await supabase.from("option_images").select("*");if(error)throw error;return Object.fromEntries((data??[]).map(r=>[`${r.question_id}:${r.option_index}`,r.path as string]))}
