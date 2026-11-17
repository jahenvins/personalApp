export interface Step{k:string;m?:string;ch?:string;q?:string;o?:string[];e?:string;r?:string|string[];ok?:number;rs?:string;rg?:string;fx?:string;em?:string;h?:string;t?:string;b?:string;hidden?:boolean}
export interface QuestionEdit{q:string;o:string[];hidden?:boolean}
export type QuestionEdits=Record<string,QuestionEdit>;
export interface Profile{name:string;age:number|null;height_cm:number|null;weight_kg:number|null}
export interface QuizSession{id:string;step:number;completed:boolean}
export type AnswerMap=Record<string,number>;
