import supabase from "../lib/supabase";

export type MemoryEntity = {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
};

export const fetchMemoriesByThemeId = (themeId: string) =>
  supabase
    .from("memories")
    .select("id, text, created_at, user_id")
    .eq("theme_id", themeId)
    .order("created_at", { ascending: false });
