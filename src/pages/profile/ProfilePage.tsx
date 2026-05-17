import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '@/features/auth/model/use-auth';
import { supabase } from '@/shared/config/supabase';
import { ru } from '@/shared/i18n';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const schema = z.object({
  username: z.string().min(2).max(40),
  avatar_url: z.union([z.literal(''), z.string().url()]),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id ?? 'guest'],
    queryFn: async () => {
      const uid = user?.id;
      if (!uid) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('username,avatar_url')
        .eq('id', uid)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(user),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', avatar_url: '' },
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    form.reset({
      username: profileQuery.data.username ?? '',
      avatar_url: profileQuery.data.avatar_url ?? '',
    });
  }, [form, profileQuery.data]);

  const save = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user) throw new Error('AUTH_REQUIRED');
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: values.username.trim(),
        avatar_url: values.avatar_url.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: (_data, values) => {
      if (!user) return;
      qc.setQueryData(['profile', user.id], {
        username: values.username.trim(),
        avatar_url: values.avatar_url.trim() || null,
      });
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Helmet>
        <title>{ru.profile.metaTitle}</title>
      </Helmet>

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-50">
          {ru.profile.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{ru.profile.subtitle}</p>
      </div>

      <div className="rounded-3xl border border-border/60 bg-surface-elevated/40 p-6 shadow-glass backdrop-blur-xl">
        {profileQuery.isError ? (
          <p className="text-sm text-rose-300">{ru.profile.loadError}</p>
        ) : profileQuery.isLoading ? (
          <p className="text-sm text-slate-400">{ru.common.loading}</p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await save.mutateAsync(values);
              } catch {
                form.setError('root', { message: ru.profile.saveError });
              }
            })}
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="username">
                {ru.profile.username}
              </label>
              <Input id="username" autoComplete="nickname" {...form.register('username')} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="avatar">
                {ru.profile.avatarUrl}
              </label>
              <Input id="avatar" placeholder="https://..." {...form.register('avatar_url')} />
            </div>
            {form.formState.errors.root?.message ? (
              <p className="text-sm text-rose-300">{form.formState.errors.root.message}</p>
            ) : null}
            <Button type="submit" disabled={save.isPending}>
              {ru.profile.save}
            </Button>
            {save.isSuccess ? <p className="text-xs text-emerald-300">{ru.profile.saved}</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
