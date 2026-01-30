import supabase from '../lib/supabase'

export type MemoryRow = {
  text: string
  created_at: string
  user_id: string | null
}

export const fetchMemoriesByThemeId = (themeId: string) =>
  supabase
    .from('memories')
    .select('text, created_at, user_id')
    .eq('theme_id', themeId)
    .order('created_at', { ascending: false })
