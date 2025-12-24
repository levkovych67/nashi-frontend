import { Link, useLocation } from 'react-router-dom';
import { Map, Users, Calendar, Newspaper } from 'lucide-react';

export function MobileNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-accent/20">
      <div className="flex items-center justify-around h-16">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-accent' : ''}`}>
          <Map size={20} />
          <span className="text-xs">Карта</span>
        </Link>
        <Link to="/artists" className={`flex flex-col items-center gap-1 ${isActive('/artists') ? 'text-accent' : ''}`}>
          <Users size={20} />
          <span className="text-xs">Артисти</span>
        </Link>
        <Link to="/events" className={`flex flex-col items-center gap-1 ${isActive('/events') ? 'text-accent' : ''}`}>
          <Calendar size={20} />
          <span className="text-xs">Події</span>
        </Link>
        <Link to="/news" className={`flex flex-col items-center gap-1 ${isActive('/news') ? 'text-accent' : ''}`}>
          <Newspaper size={20} />
          <span className="text-xs">Новини</span>
        </Link>
      </div>
    </nav>
  );
}
