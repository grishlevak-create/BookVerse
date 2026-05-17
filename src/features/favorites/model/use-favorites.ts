import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/model/use-auth';
import { isSupabaseConfigured } from '@/shared/config/env';
import { supabase } from '@/shared/config/supabase';
import { favoriteKeys } from '@/features/favorites/model/favorite-keys';
import { captureFavorite } from '@/shared/lib/analytics';

export { favoriteKeys };

export function useFavoriteBookIds() {
  const { user } = useAuth();

  return useQuery({
    queryKey: favoriteKeys.list(user?.id ?? 'guest'),
    queryFn: async () => {
      const uid = user?.id;
      if (!uid) return [];
      const { data, error } = await supabase.from('favorites').select('book_id').eq('user_id', uid);
      if (error) throw error;
      return (data ?? []).map((r) => String(r.book_id));
    },
    enabled: Boolean(user && isSupabaseConfigured()),
    staleTime: 1000 * 60 * 5,
  });
}

export function useIsFavorite(bookId: string) {
  const q = useFavoriteBookIds();
  const set = new Set(q.data ?? []);
  return {
    isFavorite: set.has(bookId),
    isLoading: q.isLoading,
  };
}

type ToggleFavoriteContext = {
  prev: string[];
};

export function useToggleFavorite(bookId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (shouldFavorite: boolean) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      if (!isSupabaseConfigured()) throw new Error('SUPABASE_NOT_CONFIGURED');
      if (shouldFavorite) {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, book_id: bookId });
        if (error) {
          if (error.code === '23505') return;
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('book_id', bookId);
        if (error) throw error;
      }
    },
    onMutate: async (shouldFavorite): Promise<ToggleFavoriteContext | undefined> => {
      if (!user) return undefined;

      const key = favoriteKeys.list(user.id);
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<string[]>(key) ?? [];
      const next = shouldFavorite
        ? prev.includes(bookId)
          ? prev
          : [...prev, bookId]
        : prev.filter((id) => id !== bookId);

      qc.setQueryData(key, next);
      return { prev };
    },
    onError: (_error, _shouldFavorite, ctx) => {
      if (user && ctx) {
        qc.setQueryData(favoriteKeys.list(user.id), ctx.prev);
      }
    },
    onSuccess: (_, shouldFavorite) => {
      if (user) {
        captureFavorite(shouldFavorite ? 'add' : 'remove', bookId);
      }
    },
  });
}
