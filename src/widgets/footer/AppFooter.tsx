import { ru } from '@/shared/i18n';

export function AppFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/60 py-10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          {ru.footer.linePrefix}{' '}
          <a
            className="font-semibold text-slate-300 hover:text-slate-50"
            href="https://openlibrary.org/developers/api"
          >
            Open Library API
          </a>
          . {ru.footer.lineSuffix}
        </p>
      </div>
    </footer>
  );
}
