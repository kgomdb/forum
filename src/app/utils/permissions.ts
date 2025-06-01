export const RoleIds = {
  Admin: 0,
  Guest: 1,
  Silver: 2,
  Gold: 3,
};

export const PermissionBits = {
  ReadComments: 1,
  AddDeleteComments: 2,
  AddDeleteTopics: 4,
  DeleteOthers: 8,
};

export const PermissionLabels: Record<number, string> = {
  1: 'Read Comments',
  2: 'Add/Delete Comments',
  4: 'Add/Delete Topics',
  8: "Delete Others' Comments/Topics",
};

export const RolePermissions: Record<number, number> = {
  0: 1 | 2 | 4 | 8,  // Admin
  1: 1,              // Guest
  2: 1 | 2,          // Silver
  3: 1 | 2 | 4,      // Gold
};
