import { BookOpen, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/features/auth/model/use-auth';
import { ru } from '@/shared/i18n';
import { Button } from '@/shared/ui/Button';

export function AppHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-surface/70 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan-400 text-slate-950 shadow-glow">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-50">
            {ru.brand.title}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => void signOut()}
            >
              {ru.nav.logout}
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">{ru.nav.login}</Link>
            </Button>
          )}

          <Button asChild variant="secondary" size="sm">
            <Link to="/books">
              <SearchIcon className="h-4 w-4 sm:mr-2" aria-hidden />
              <span className="hidden sm:inline">{ru.nav.findBooks}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
