export const collectionKeys = {
  all: ['collections'] as const,
  list: (userId: string) => [...collectionKeys.all, userId] as const,
  books: (collectionId: string) => [...collectionKeys.all, 'books', collectionId] as const,
};
