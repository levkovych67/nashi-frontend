import { useState } from 'react';
import { NewsCard } from '@/features/news/components/NewsCard';
import { useLatestNews } from '@/lib/api/hooks/useNews';
import { usePlatformStats } from '@/lib/api/hooks/useMetadata';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, CheckCircle, Clock } from 'lucide-react';

export function NewsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useLatestNews({ page, size: 12 });
  const { data: stats } = usePlatformStats();

  const news = data?.content || [];
  const hasMore = data && !data.last;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Новини української культури',
    description: 'Останні новини та оновлення української культурної платформи НАШІ',
  };

  return (
    <>
      <SEO
        title="Новини української культури"
        description="Останні новини української культури, оновлення платформи НАШІ, статистика та досягнення українських митців."
        keywords="новини культури, українська культура, новини мистецтва, культурні новини України"
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="aero-glass px-5 py-4 md:px-6 mb-6">
          <h1 className="text-4xl font-heading font-bold">Новини</h1>
        </div>

        {/* Platform Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-heading font-bold">{stats.totalArtists}</p>
                  <p className="text-sm text-muted-foreground">Всього артистів</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-[var(--aero-grass-deep)]" />
                <div>
                  <p className="text-2xl font-heading font-bold">{stats.approvedArtists}</p>
                  <p className="text-sm text-muted-foreground">Схвалено</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#d9822b]" />
                <div>
                  <p className="text-2xl font-heading font-bold">{stats.pendingArtists}</p>
                  <p className="text-sm text-muted-foreground">На розгляді</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && page === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="aero-glass px-8 py-6 text-center" role="status">
            <div className="aero-spinner mx-auto mb-4" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Завантаження новин...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="aero-glass mx-auto my-12 max-w-md px-8 py-6 text-center">
          <p className="text-[var(--aero-danger)] mb-2">Помилка завантаження</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && news.length === 0 && (
        <div className="aero-glass mx-auto my-12 max-w-md px-8 py-6 text-center">
          <p className="text-lg text-muted-foreground">Новин не знайдено</p>
        </div>
      )}

      {/* News Grid */}
      {news.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button onClick={() => setPage(page + 1)} disabled={isLoading}>
                {isLoading ? 'Завантаження...' : 'Завантажити більше'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}
