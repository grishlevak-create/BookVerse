export const bookKeys = {
  all: ['books'] as const,
  home: () => [...bookKeys.all, 'home'] as const,
  details: (workId: string) => [...bookKeys.all, 'details', workId] as const,
  similar: (workId: string) => [...bookKeys.all, 'similar', workId] as const,
  searchInfinite: (params: string) => [...bookKeys.all, 'search-infinite', params] as const,
};
