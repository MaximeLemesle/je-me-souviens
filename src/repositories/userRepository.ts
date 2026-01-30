import supabase from '../lib/supabase'

export type UserProfile = {
  id: string
  first_name: string | null
  last_name: string | null
}

export const fetchCurrentUser = () => supabase.auth.getUser()

export const fetchProfilesByIds = (userIds: string[]) =>
  supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', userIds)

export const fetchProfileById = (userId: string) =>
  supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('id', userId)
    .single()
