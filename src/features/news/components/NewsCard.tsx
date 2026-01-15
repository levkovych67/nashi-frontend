import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { components } from '@/lib/api/generated/types';

type NewsPostViewDTO = components['schemas']['NewsPostViewDTO'];

interface NewsCardProps {
  post: NewsPostViewDTO;
}

export function NewsCard({ post }: NewsCardProps) {
  const createdDate = post.createdAt ? new Date(post.createdAt) : null;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      {post.imageUrl && (
        <OptimizedImage
          src={post.imageUrl}
          alt=""
          containerClassName="h-48 bg-accent/10"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      )}

      {/* Content */}
      <div className="p-4">
        {/* Date */}
        {createdDate && (
          <div className="flex items-center text-xs text-muted-foreground/70 mb-2">
            <Calendar className="w-3 h-3 mr-1" />
            <time>{format(createdDate, 'd MMMM yyyy', { locale: uk })}</time>
          </div>
        )}

        {/* Content Text */}
        {post.content && (
          <p className="text-sm text-foreground/90 line-clamp-4 mb-3">{post.content}</p>
        )}

        {/* Artist Link */}
        {post.artistName && post.artistSlug && (
          <Link
            to={`/artists/${post.artistSlug}`}
            className="text-sm text-accent hover:underline font-medium"
          >
            {post.artistName} →
          </Link>
        )}

        {/* Audio */}
        {post.audioUrl && (
          <div className="mt-3">
            <audio controls className="w-full">
              <source src={post.audioUrl} type="audio/mpeg" />
              Ваш браузер не підтримує аудіо елемент.
            </audio>
          </div>
        )}
      </div>
    </Card>
  );
}
