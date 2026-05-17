export const favoriteKeys = {
  all: ['favorites'] as const,
  list: (userId: string) => [...favoriteKeys.all, userId] as const,
};
