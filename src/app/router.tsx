import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
      <p className="text-sm text-muted-foreground">Завантаження...</p>
    </div>
  </div>
);

// Lazy load pages for code splitting
const MapPage = lazy(() => import('@/pages/MapPage').then(m => ({ default: m.MapPage })));
const ArtistsListPage = lazy(() => import('@/pages/ArtistsListPage').then(m => ({ default: m.ArtistsListPage })));
const ArtistProfilePage = lazy(() => import('@/pages/ArtistProfilePage').then(m => ({ default: m.ArtistProfilePage })));
const EventsPage = lazy(() => import('@/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const NewsPage = lazy(() => import('@/pages/NewsPage').then(m => ({ default: m.NewsPage })));
const RadioPage = lazy(() => import('@/pages/RadioPage').then(m => ({ default: m.RadioPage })));
const SubmitPage = lazy(() => import('@/pages/SubmitPage').then(m => ({ default: m.SubmitPage })));
const SubmitArtistPage = lazy(() => import('@/pages/SubmitArtistPage').then(m => ({ default: m.SubmitArtistPage })));
const SubmitEventPage = lazy(() => import('@/pages/SubmitEventPage').then(m => ({ default: m.SubmitEventPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <MapPage />
          </Suspense>
        ),
      },
      {
        path: 'artists',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ArtistsListPage />
          </Suspense>
        ),
      },
      {
        path: 'artists/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ArtistProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EventsPage />
          </Suspense>
        ),
      },
      {
        path: 'news',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NewsPage />
          </Suspense>
        ),
      },
      {
        path: 'radio',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RadioPage />
          </Suspense>
        ),
      },
      {
        path: 'submit',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SubmitPage />
          </Suspense>
        ),
      },
      {
        path: 'submit/artist',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SubmitArtistPage />
          </Suspense>
        ),
      },
      {
        path: 'submit/event',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SubmitEventPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
