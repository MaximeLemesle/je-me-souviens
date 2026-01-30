export const UserUtils = {
  getInitials: (
    profile?: { first_name?: string | null; last_name?: string | null } | null,
  ) => {
    const first = profile?.first_name?.trim()?.[0];
    const last = profile?.last_name?.trim()?.[0];
    const letters = [first, last].filter(Boolean).join("");
    return letters ? letters.toUpperCase() : "?";
  },
};
