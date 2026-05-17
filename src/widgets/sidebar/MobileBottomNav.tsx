import { BookOpen, Heart, Home, Library } from 'lucide-react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { ru } from '@/shared/i18n';
import { cn } from '@/shared/lib/cn';

export function MobileBottomNav() {
  const items = useMemo(
    () =>
      [
        { to: '/', label: ru.nav.home, icon: Home },
        { to: '/books', label: ru.nav.catalog, icon: BookOpen },
        { to: '/favorites', label: ru.nav.saved, icon: Heart },
        { to: '/collections', label: ru.nav.lists, icon: Library },
      ] as const,
    [],
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-surface/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      aria-label={ru.a11y.bottomNav}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between py-2 pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-[max(0.5rem,env(safe-area-inset-right,0px))]">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-medium text-slate-400 transition',
                isActive && 'text-accent',
              )
            }
            end={item.to === '/'}
          >
            <item.icon className="h-5 w-5" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
