import { Heart, Library } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/model/use-auth';
import {
  useAddBookToCollection,
  useUserCollections,
} from '@/features/collections/model/use-collections-api';
import { useIsFavorite, useToggleFavorite } from '@/features/favorites/model/use-favorites';
import { ru } from '@/shared/i18n';
import { isSupabaseConfigured } from '@/shared/config/env';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

type BookToolbarProps = {
  bookId: string;
};

export function BookToolbar({ bookId }: BookToolbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, isLoading: favLoading } = useIsFavorite(bookId);
  const toggleFavorite = useToggleFavorite(bookId);
  const collectionsQuery = useUserCollections();
  const addToCollection = useAddBookToCollection();

  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const collections = collectionsQuery.data ?? [];

  const disabledRemote = !isSupabaseConfigured();

  const favoriteLabel = useMemo(() => {
    if (!user) return ru.details.loginToSave;
    if (isFavorite) return ru.details.favorited;
    return ru.details.favorite;
  }, [isFavorite, user]);

  const onFavoriteClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (disabledRemote) return;
    toggleFavorite.mutate(!isFavorite);
  };

  const onCollectionsClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (disabledRemote) return;
    setCollectionsOpen(true);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant={isFavorite ? 'secondary' : 'primary'}
        disabled={(Boolean(user) && disabledRemote) || favLoading}
        onClick={onFavoriteClick}
      >
        <Heart
          className={cn(
            'mr-2 h-4 w-4 transition-colors',
            isFavorite && 'fill-red-500 text-red-500',
          )}
          aria-hidden
        />
        {favoriteLabel}
      </Button>

      <Button type="button" variant="secondary" onClick={onCollectionsClick}>
        <Library className="mr-2 h-4 w-4" aria-hidden />
        {ru.details.collections}
      </Button>

      <Modal
        open={collectionsOpen}
        onOpenChange={setCollectionsOpen}
        title={ru.collections.title}
        description={ru.collections.intro}
      >
        <div className="space-y-2">
          {collectionsQuery.isLoading ? (
            <p className="text-sm text-slate-400">{ru.common.loading}</p>
          ) : collections.length === 0 ? (
            <p className="text-sm text-slate-400">{ru.collections.emptyPageText}</p>
          ) : (
            <ul className="space-y-2">
              {collections.map((c) => (
                <li key={c.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => {
                      addToCollection.mutate(
                        { collectionId: c.id, bookId },
                        { onSuccess: () => setCollectionsOpen(false) },
                      );
                    }}
                  >
                    <span className="truncate">{c.title}</span>
                    <span className="text-xs text-slate-500">{c.bookCount}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button type="button" variant="secondary" className="w-full" asChild>
            <Link to="/collections" onClick={() => setCollectionsOpen(false)}>
              {ru.collections.new}
            </Link>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
