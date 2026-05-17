import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import HomePage from '@/pages/home/HomePage';
import { MainLayout } from '@/widgets/layout/MainLayout';
import { Loader } from '@/shared/ui';

import { ProtectedRoute } from '@/app/router/ProtectedRoute';

const loadLazyPages = () => import('@/pages/lazy-route-pages');

const BooksPage = lazy(() => loadLazyPages().then((m) => ({ default: m.BooksPage })));
const BookDetailsPage = lazy(() => loadLazyPages().then((m) => ({ default: m.BookDetailsPage })));
const FavoritesPage = lazy(() => loadLazyPages().then((m) => ({ default: m.FavoritesPage })));
const CollectionsPage = lazy(() => loadLazyPages().then((m) => ({ default: m.CollectionsPage })));
const LoginPage = lazy(() => loadLazyPages().then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => loadLazyPages().then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => loadLazyPages().then((m) => ({ default: m.ProfilePage })));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="books/:id" element={<BookDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
