import { supabase } from "../config/supabase.js";

export const saveMessage = async ({ from, text, role }) => {
  await supabase.from("messages").insert([{ from, text, role }]);
};

export const getMessagesByUser = async (from) => {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("from", from)
    .order("created_at", { ascending: true });

  return data || [];
};