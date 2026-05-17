import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '@/features/auth/model/use-auth';
import { useCreateReview } from '@/features/reviews/model/use-reviews';
import { isSupabaseConfigured } from '@/shared/config/env';
import { ru } from '@/shared/i18n';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const schema = z.object({
  text: z.string().min(4, 'Коротко, но не слишком').max(2000),
  rating: z.coerce.number().int().min(1).max(5),
});

type FormValues = z.infer<typeof schema>;

type CreateReviewFormProps = {
  bookId: string;
};

export function CreateReviewForm({ bookId }: CreateReviewFormProps) {
  const { user } = useAuth();
  const create = useCreateReview(bookId);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { text: '', rating: 5 },
  });

  if (!user) return null;
  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-slate-500">{ru.errors.supabaseMissing}</p>;
  }

  return (
    <form
      className="space-y-3 rounded-2xl border border-border/60 bg-surface-elevated/30 p-4 backdrop-blur-xl"
      onSubmit={form.handleSubmit(async (values) => {
        await create.mutateAsync(values);
        form.reset({ text: '', rating: 5 });
      })}
    >
      <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-end">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="rating">
            {ru.details.reviewRating}
          </label>
          <Input id="rating" type="number" min={1} max={5} {...form.register('rating')} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="text">
            {ru.details.reviews}
          </label>
          <Input id="text" placeholder={ru.details.reviewPlaceholder} {...form.register('text')} />
        </div>
      </div>
      {form.formState.errors.text ? (
        <p className="text-xs text-rose-300">{form.formState.errors.text.message}</p>
      ) : null}
      <Button type="submit" disabled={create.isPending}>
        {ru.details.sendReview}
      </Button>
    </form>
  );
}
