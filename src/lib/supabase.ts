import {createClient} from "@supabase/supabase-js";
export const supabase=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY);
export const imgUrl=(p:string)=>supabase.storage.from("photos").getPublicUrl(p).data.publicUrl;
