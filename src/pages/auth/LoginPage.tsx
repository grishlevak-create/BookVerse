import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { supabase } from '@/shared/config/supabase';
import { isSupabaseConfigured } from '@/shared/config/env';
import { ru } from '@/shared/i18n';
import { mapAuthErrorMessage } from '@/shared/lib/auth-error-message';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/profile';

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Helmet>
        <title>{ru.auth.metaLogin}</title>
      </Helmet>

      <div className="rounded-3xl border border-border/60 bg-surface-elevated/40 p-6 shadow-glass backdrop-blur-xl">
        <h1 className="font-display text-2xl font-semibold text-slate-50">{ru.auth.loginTitle}</h1>
        <p className="mt-2 text-sm text-slate-400">{ru.auth.loginSubtitle}</p>

        {!isSupabaseConfigured() ? (
          <div
            className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100"
            role="status"
          >
            <p className="font-semibold text-amber-50">{ru.auth.supabaseSetupTitle}</p>
            <p className="mt-2 leading-relaxed text-amber-100/90">{ru.auth.supabaseSetupBody}</p>
          </div>
        ) : null}

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            if (!isSupabaseConfigured()) {
              form.setError('root', { message: ru.errors.supabaseMissing });
              return;
            }
            try {
              const { error } = await supabase.auth.signInWithPassword({
                email: values.email.trim(),
                password: values.password,
              });
              if (error) {
                form.setError('root', { message: mapAuthErrorMessage(error.message) });
                return;
              }
              navigate(from, { replace: true });
            } catch {
              form.setError('root', { message: ru.auth.networkError });
            }
          })}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="login-email">
              {ru.auth.email}
            </label>
            <Input id="login-email" type="email" autoComplete="email" {...form.register('email')} />
            {form.formState.errors.email?.message ? (
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-medium text-slate-400"
              htmlFor="login-password"
            >
              {ru.auth.password}
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...form.register('password')}
            />
            {form.formState.errors.password?.message ? (
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.password.message}</p>
            ) : null}
          </div>

          {form.formState.errors.root?.message ? (
            <p className="text-sm text-rose-300">{form.formState.errors.root.message}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || !isSupabaseConfigured()}
          >
            {ru.auth.submitLogin}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          {ru.auth.noAccount}{' '}
          <Link className="font-semibold text-accent hover:text-accent/90" to="/register">
            {ru.nav.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
