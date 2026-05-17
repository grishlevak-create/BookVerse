import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/model/use-auth';
import { isSupabaseConfigured } from '@/shared/config/env';
import { supabase } from '@/shared/config/supabase';

export type ReviewRow = {
  id: string;
  bookId: string;
  userId: string;
  text: string;
  rating: number;
  createdAt: string;
  username: string | null;
  avatarUrl: string | null;
};

export const reviewKeys = {
  book: (bookId: string) => ['reviews', 'book', bookId] as const,
};

function mapReviewRow(r: Record<string, unknown>): ReviewRow {
  const profiles = r.profiles as { username?: string | null; avatar_url?: string | null } | null;
  return {
    id: String(r.id),
    bookId: String(r.book_id),
    userId: String(r.user_id),
    text: String(r.text),
    rating: Number(r.rating),
    createdAt: String(r.created_at),
    username: profiles?.username ?? null,
    avatarUrl: profiles?.avatar_url ?? null,
  };
}

export function useBookReviews(bookId: string) {
  const id = bookId.trim();

  return useQuery({
    queryKey: reviewKeys.book(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id,book_id,user_id,text,rating,created_at,profiles(username,avatar_url)')
        .eq('book_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => mapReviewRow(r as Record<string, unknown>));
    },
    enabled: Boolean(id && isSupabaseConfigured()),
    staleTime: 1000 * 60 * 5,
  });
}

type ReviewMutateContext = {
  prev: ReviewRow[];
  optimisticId: string;
};

export function useCreateReview(bookId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { text: string; rating: number }) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          book_id: bookId,
          text: input.text,
          rating: input.rating,
        })
        .select('id,book_id,user_id,text,rating,created_at,profiles(username,avatar_url)')
        .single();
      if (error) throw error;
      return mapReviewRow(data as Record<string, unknown>);
    },
    onMutate: async (input): Promise<ReviewMutateContext | undefined> => {
      if (!user) return undefined;

      const key = reviewKeys.book(bookId);
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<ReviewRow[]>(key) ?? [];
      const optimisticId = `pending-${Date.now()}`;
      const optimistic: ReviewRow = {
        id: optimisticId,
        bookId,
        userId: user.id,
        text: input.text,
        rating: input.rating,
        createdAt: new Date().toISOString(),
        username: user.email?.split('@')[0] ?? null,
        avatarUrl: null,
      };

      qc.setQueryData(key, [optimistic, ...prev]);
      return { prev, optimisticId };
    },
    onSuccess: (saved, _input, ctx) => {
      const key = reviewKeys.book(bookId);
      qc.setQueryData<ReviewRow[]>(key, (current) => {
        const list = current ?? [];
        const withoutPending = ctx
          ? list.filter((r) => r.id !== ctx.optimisticId)
          : list.filter((r) => !r.id.startsWith('pending-'));
        return [saved, ...withoutPending];
      });
    },
    onError: (_err, _input, ctx) => {
      if (ctx) {
        qc.setQueryData(reviewKeys.book(bookId), ctx.prev);
      }
    },
  });
}

type DeleteReviewContext = {
  prev: ReviewRow[];
};

export function useDeleteReview(bookId: string) {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onMutate: async (reviewId): Promise<DeleteReviewContext | undefined> => {
      const key = reviewKeys.book(bookId);
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<ReviewRow[]>(key) ?? [];
      qc.setQueryData(
        key,
        prev.filter((r) => r.id !== reviewId),
      );
      return { prev };
    },
    onError: (_err, _reviewId, ctx) => {
      if (ctx) {
        qc.setQueryData(reviewKeys.book(bookId), ctx.prev);
      }
    },
  });
}
