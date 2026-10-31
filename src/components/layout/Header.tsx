import { Link, useLocation } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import { isCurrentPath } from '@/lib/utils/isCurrentPath';
import { SearchBar } from './SearchBar';

const NAV_LINKS = [
  { to: '/', label: 'Карта' },
  { to: '/artists', label: 'Артисти' },
  { to: '/events', label: 'Події' },
  { to: '/radio', label: 'Радіо' },
  { to: '/news', label: 'Новини' },
  { to: '/about', label: 'Про нас' },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="aero-frame sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        {/* Logo: a glass orb with the map pin and a title that glows like a Vista caption */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Наші — на головну">
          <span className="aero-orb flex h-10 w-10 flex-none items-center justify-center">
            <MapPin className="relative z-[2] h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="aero-glow-text truncate text-[22px] font-semibold leading-none text-[#0b2d55]">Наші</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Головне меню">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                aria-current={isCurrentPath(pathname, to) ? 'page' : undefined}
                className="aero-hover-row aero-glow-text px-3 py-2 text-sm text-[#0b2d55]"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/submit"
              aria-current={isCurrentPath(pathname, '/submit') ? 'page' : undefined}
              className="aero-gel aero-gel--grass ml-2 inline-flex h-9 items-center gap-1.5 px-4 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
              Додати
            </Link>
          </nav>

          <div className="w-56 max-w-full lg:w-64">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
