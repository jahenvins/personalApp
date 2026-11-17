import {createClient} from "@supabase/supabase-js";
export const supabase=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY);
export const publicUrl=(p:string)=>supabase.storage.from("photos").getPublicUrl(p).data.publicUrl;
export const imgUrl=publicUrl;
