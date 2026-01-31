import supabase from "../lib/supabase";

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error || !data.user) {
    return { error: error ?? new Error("Utilisateur non créé.") };
  }

  return { error: null };
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
