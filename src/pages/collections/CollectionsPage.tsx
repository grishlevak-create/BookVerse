import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import {
  useCreateCollection,
  useDeleteCollection,
  useUserCollections,
} from '@/features/collections/model/use-collections-api';
import { ru } from '@/shared/i18n';
import { CollectionBooks } from '@/widgets/collections/CollectionBooks';
import { Button, EmptyState, Input, Modal } from '@/shared/ui';

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(80),
});

type FormValues = z.infer<typeof schema>;

export default function CollectionsPage() {
  const collections = useUserCollections();
  const create = useCreateCollection();
  const remove = useDeleteCollection();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const items = collections.data ?? [];

  return (
    <div className="space-y-8">
      <Helmet>
        <title>{ru.collections.metaTitle}</title>
        <meta name="description" content={ru.collections.metaDescription} />
      </Helmet>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-50">
            {ru.collections.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">{ru.collections.intro}</p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          {ru.collections.new}
        </Button>
      </div>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title={ru.collections.modalCreateTitle}
        description={ru.collections.modalCreateDesc}
      >
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await create.mutateAsync(values.name.trim());
            form.reset();
            setOpen(false);
          })}
        >
          <div>
            <label
              className="mb-1 block text-xs font-medium text-slate-400"
              htmlFor="new-collection-name"
            >
              {ru.collections.name}
            </label>
            <Input id="new-collection-name" autoComplete="off" {...form.register('name')} />
            {form.formState.errors.name?.message ? (
              <p className="mt-1 text-xs text-rose-300">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            {ru.collections.submit}
          </Button>
        </form>
      </Modal>

      {collections.isLoading ? (
        <p className="text-sm text-slate-400">{ru.common.loading}</p>
      ) : items.length === 0 ? (
        <EmptyState
          title={ru.collections.emptyPageTitle}
          description={ru.collections.emptyPageText}
          action={
            <Button asChild variant="primary">
              <Link to="/books">{ru.collections.emptyPageCta}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-border/60 bg-surface-elevated/30 p-5 shadow-glass backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-slate-50">{c.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {ru.collections.countBooks(c.bookCount)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={ru.collections.deleteList}
                  disabled={remove.isPending}
                  onClick={() => void remove.mutateAsync(c.id)}
                >
                  <Trash2 className="h-4 w-4 text-rose-300" />
                </Button>
              </div>
              <div className="mt-4">
                <CollectionBooks collectionId={c.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
