import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/model/use-auth';
import { isSupabaseConfigured } from '@/shared/config/env';
import { collectionKeys } from '@/features/collections/model/collection-keys';
import { supabase } from '@/shared/config/supabase';

export { collectionKeys };

export type UserCollection = {
  id: string;
  title: string;
  bookCount: number;
};

type ListPatchContext = {
  prevList: UserCollection[] | undefined;
};

type BooksPatchContext = {
  prevBooks: string[] | undefined;
  prevList: UserCollection[] | undefined;
};

function patchCollectionList(
  qc: QueryClient,
  userId: string,
  patch: (list: UserCollection[]) => UserCollection[],
): UserCollection[] | undefined {
  const key = collectionKeys.list(userId);
  const prev = qc.getQueryData<UserCollection[]>(key);
  if (prev === undefined) return undefined;
  qc.setQueryData(key, patch(prev));
  return prev;
}

function patchCollectionBooks(
  qc: QueryClient,
  collectionId: string,
  patch: (ids: string[]) => string[],
): string[] | undefined {
  const key = collectionKeys.books(collectionId);
  const prev = qc.getQueryData<string[]>(key);
  const base = prev ?? [];
  qc.setQueryData(key, patch(base));
  return prev;
}

export function useCollectionBookIds(collectionId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: collectionKeys.books(collectionId ?? 'none'),
    queryFn: async () => {
      if (!collectionId) return [];
      const { data, error } = await supabase
        .from('collection_books')
        .select('book_id')
        .eq('collection_id', collectionId);
      if (error) throw error;
      return (data ?? []).map((r) => String(r.book_id));
    },
    enabled: Boolean(user && isSupabaseConfigured() && collectionId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUserCollections() {
  const { user } = useAuth();

  return useQuery({
    queryKey: collectionKeys.list(user?.id ?? 'guest'),
    queryFn: async () => {
      const uid = user?.id;
      if (!uid) return [];

      const { data: cols, error: e1 } = await supabase
        .from('collections')
        .select('id,title')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (e1) throw e1;
      if (!cols?.length) return [] as UserCollection[];

      const ids = cols.map((c) => c.id);
      const { data: counts, error: e2 } = await supabase
        .from('collection_books')
        .select('collection_id')
        .in('collection_id', ids);
      if (e2) throw e2;

      const map = new Map<string, number>();
      for (const row of counts ?? []) {
        const id = String(row.collection_id);
        map.set(id, (map.get(id) ?? 0) + 1);
      }

      return cols.map((c) => ({
        id: String(c.id),
        title: String(c.title),
        bookCount: map.get(String(c.id)) ?? 0,
      }));
    },
    enabled: Boolean(user && isSupabaseConfigured()),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCollection() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { data, error } = await supabase
        .from('collections')
        .insert({ user_id: user.id, title })
        .select('id')
        .single();
      if (error) throw error;
      return { id: String(data.id), title };
    },
    onSuccess: ({ id, title }) => {
      if (!user) return;
      const key = collectionKeys.list(user.id);
      qc.setQueryData<UserCollection[]>(key, (old) => [
        { id, title, bookCount: 0 },
        ...(old ?? []),
      ]);
    },
  });
}

export function useDeleteCollection() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onMutate: async (collectionId): Promise<ListPatchContext | undefined> => {
      if (!user) return undefined;
      const prevList = patchCollectionList(qc, user.id, (list) =>
        list.filter((c) => c.id !== collectionId),
      );
      qc.removeQueries({ queryKey: collectionKeys.books(collectionId) });
      return { prevList };
    },
    onError: (_err, _id, ctx) => {
      if (user && ctx?.prevList !== undefined) {
        qc.setQueryData(collectionKeys.list(user.id), ctx.prevList);
      }
    },
  });
}

export function useAddBookToCollection() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: { collectionId: string; bookId: string }) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase.from('collection_books').insert({
        collection_id: params.collectionId,
        book_id: params.bookId,
      });
      if (error) {
        if (error.code === '23505') return;
        throw error;
      }
    },
    onMutate: async (params): Promise<BooksPatchContext | undefined> => {
      if (!user) return undefined;

      const prevBooks = qc.getQueryData<string[]>(collectionKeys.books(params.collectionId));
      const alreadyInBooks = prevBooks?.includes(params.bookId) ?? false;

      patchCollectionBooks(qc, params.collectionId, (ids) =>
        ids.includes(params.bookId) ? ids : [...ids, params.bookId],
      );

      const prevList = patchCollectionList(qc, user.id, (list) =>
        list.map((c) =>
          c.id === params.collectionId && !alreadyInBooks
            ? { ...c, bookCount: c.bookCount + 1 }
            : c,
        ),
      );

      return { prevBooks, prevList };
    },
    onError: (_err, params, ctx) => {
      if (!user || !ctx) return;
      if (ctx.prevList !== undefined) {
        qc.setQueryData(collectionKeys.list(user.id), ctx.prevList);
      }
      if (ctx.prevBooks !== undefined) {
        qc.setQueryData(collectionKeys.books(params.collectionId), ctx.prevBooks);
      }
    },
  });
}

export function useRemoveBookFromCollection() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: { collectionId: string; bookId: string }) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase
        .from('collection_books')
        .delete()
        .eq('collection_id', params.collectionId)
        .eq('book_id', params.bookId);
      if (error) throw error;
    },
    onMutate: async (params): Promise<BooksPatchContext | undefined> => {
      if (!user) return undefined;

      const prevBooks = patchCollectionBooks(qc, params.collectionId, (ids) =>
        ids.filter((id) => id !== params.bookId),
      );

      const hadBook = prevBooks?.includes(params.bookId) ?? false;
      const prevList = patchCollectionList(qc, user.id, (list) =>
        list.map((c) =>
          c.id === params.collectionId && hadBook
            ? { ...c, bookCount: Math.max(0, c.bookCount - 1) }
            : c,
        ),
      );

      return { prevBooks, prevList };
    },
    onError: (_err, params, ctx) => {
      if (!user || !ctx) return;
      if (ctx.prevList !== undefined) {
        qc.setQueryData(collectionKeys.list(user.id), ctx.prevList);
      }
      if (ctx.prevBooks !== undefined) {
        qc.setQueryData(collectionKeys.books(params.collectionId), ctx.prevBooks);
      }
    },
  });
}
