import { getProfileById } from "../services/userService";

export const UserUtils = {
  getInitials: async (userId: string) => {
    const { profile } = await getProfileById(userId);
    if (!profile) return "Profil introuvable";

    const firstNameInitial = profile?.first_name?.trim()?.[0];
    const lastNameInitial = profile?.last_name?.trim()?.[0];
    const initials = [firstNameInitial, lastNameInitial]
      .filter(Boolean)
      .join("");
    return initials ? initials.toUpperCase() : "?";
  },
  getFullName: async (userId: string) => {
    const { profile } = await getProfileById(userId);
    if (!profile) return "Profil introuvable";

    const firstName = profile?.first_name?.trim() ?? "";
    const lastName = profile?.last_name?.trim() ?? "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    return fullName || "?";
  },
};
