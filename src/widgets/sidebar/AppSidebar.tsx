import { BookOpen, Compass, Heart, LayoutGrid, Library, User } from 'lucide-react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { ru } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';

export function AppSidebar() {
  const links = useMemo(
    () =>
      [
        { to: '/', label: ru.nav.home, icon: LayoutGrid },
        { to: '/books', label: ru.nav.catalog, icon: BookOpen },
        { to: '/favorites', label: ru.nav.favorites, icon: Heart },
        { to: '/collections', label: ru.nav.collections, icon: Library },
        { to: '/profile', label: ru.nav.profile, icon: User },
      ] as const,
    [],
  );

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-surface-elevated/30 p-4 backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan-400 text-slate-950 shadow-glow">
          <Compass className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-slate-50">{ru.brand.title}</p>
          <p className="text-xs text-slate-500">{ru.brand.subtitle}</p>
        </div>
      </div>
      <nav className="space-y-1" aria-label={ru.a11y.mainNav}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-slate-50',
                isActive && 'bg-white/10 text-slate-50 shadow-inner',
              )
            }
            end={item.to === '/'}
          >
            <item.icon className="h-4 w-4 opacity-80" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
