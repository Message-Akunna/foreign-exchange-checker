export const hasPermission = (userPermissions: string[], required: string) => {
  if (userPermissions.includes("access-full")) return true;
  if (userPermissions.includes(required)) return true;

  // wildcard support: org-* matches org-view, org-edit, etc.
  const [scope] = required.split("-");
  return userPermissions.includes(`${scope}-*`);
};
