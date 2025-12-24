import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-heading mb-4">404</h1>
      <p className="text-xl mb-8">Сторінку не знайдено</p>
      <Button asChild>
        <Link to="/">Повернутися на головну</Link>
      </Button>
    </div>
  );
}
