import { Link } from 'react-router-dom';

import { useCollectionBookIds } from '@/features/collections/model/use-collections-api';
import { ru } from '@/shared/i18n';

type CollectionBooksProps = {
  collectionId: string;
};

export function CollectionBooks({ collectionId }: CollectionBooksProps) {
  const q = useCollectionBookIds(collectionId);

  if (q.isLoading) {
    return <p className="text-xs text-slate-500">{ru.common.loading}</p>;
  }

  const ids = q.data ?? [];
  if (ids.length === 0) {
    return <p className="text-sm text-slate-500">{ru.collections.emptyListText}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {ids.map((id) => (
        <li key={id}>
          <Link
            className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:border-accent/40"
            to={`/books/${encodeURIComponent(id)}`}
          >
            {id}
          </Link>
        </li>
      ))}
    </ul>
  );
}
