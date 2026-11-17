import {useCallback,useEffect,useState} from "react";import type {AnswerMap,QuizSession,Step} from "../types";import {STEPS,applyQuestionEdits} from "../data/questions";
import {newSession,openSession,saveAnswer,saveStep,complete,loadQuestionEdits} from "./quiz";
function nextVisibleStep(steps:Step[],start:number){let index=Math.max(0,Math.min(start,steps.length-1));while(index<steps.length-1&&steps[index]?.k==="q"&&steps[index].hidden)index++;return index}
export function useQuiz(){const [s,setS]=useState<QuizSession>();const [i,setI]=useState(0);const [a,setA]=useState<AnswerMap>({});const [err,setErr]=useState("");
const [steps,setSteps]=useState<Step[]>(STEPS);
useEffect(()=>{Promise.all([openSession(),loadQuestionEdits()]).then(([x,edits])=>{const loadedSteps=applyQuestionEdits(edits),activeStep=nextVisibleStep(loadedSteps,x.step);setSteps(loadedSteps);setS(x);setI(activeStep);setA(x.answers);if(activeStep!==x.step)void saveStep(x.id,activeStep)}).catch(e=>setErr(e.message??"Could not reach Supabase"))},[]);
const next=useCallback(()=>{if(!s)return;const n=nextVisibleStep(steps,i+1);setI(n);void saveStep(s.id,n)},[s,i,steps]);
const answer=useCallback(async(opt:number,text:string)=>{if(!s)return;setA(p=>({...p,[`q${i}`]:opt}));try{await saveAnswer(s.id,`q${i}`,opt,text)}catch(e){setErr((e as Error).message)}},[s,i]);
const finish=useCallback(()=>{if(s)void complete(s.id)},[s]);
const retake=useCallback(async()=>{const n=await newSession();setS(n);setI(0);setA({})},[]);
return {s,i,a,err,next,answer,finish,retake,steps}}
