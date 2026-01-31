import * as userRepository from "../repositories/userRepository";

export type UserProfile = userRepository.UserProfile;

export const getCurrentUserId = async () => {
  const { data, error } = await userRepository.fetchCurrentUser();
  if (error || !data.user) {
    return {
      userId: null,
      error: error ?? new Error("Utilisateur non connecté."),
    };
  }
  return { userId: data.user.id, error: null };
};

export const getProfileById = async (userId: string) => {
  const { data, error } = await userRepository.fetchProfileById(userId);
  if (error || !data) {
    return { profile: null, error: error ?? new Error("Profil introuvable.") };
  }
  return {
    profile: {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
    },
    error: null,
  };
};
