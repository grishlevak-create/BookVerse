import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { getTrendingBooks } from '@/entities/book/api/getTrendingBooks';
import { bookKeys } from '@/entities/book/model/query-keys';
import { AppFooter } from '@/widgets/footer/AppFooter';
import { AppHeader } from '@/widgets/header/AppHeader';
import { AppSidebar } from '@/widgets/sidebar/AppSidebar';
import { MobileBottomNav } from '@/widgets/sidebar/MobileBottomNav';

const HOME_STALE_MS = 1000 * 60 * 10;

export function MainLayout() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: bookKeys.home(),
      queryFn: getTrendingBooks,
      staleTime: HOME_STALE_MS,
    });
  }, [queryClient]);

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 gap-0 px-0 sm:px-4 lg:px-8">
        <AppSidebar />
        <main className="relative min-w-0 flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <div className="pb-16 lg:pb-0">
        <AppFooter />
      </div>
      <MobileBottomNav />
    </div>
  );
}
