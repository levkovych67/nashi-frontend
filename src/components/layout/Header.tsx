import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-2xl font-heading font-bold">
          Наші
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Карта
            </Link>
            <Link to="/artists" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Артисти
            </Link>
            <Link to="/events" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Події
            </Link>
            <Link to="/radio" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Радіо
            </Link>
            <Link to="/news" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Новини
            </Link>
            <Link to="/about" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Про нас
            </Link>
            <Link to="/submit" className="text-sm font-nav font-medium hover:text-accent transition-colors">
              Додати
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="w-64 max-w-full">
            <SearchBar />
          </div>
          
        </div>
      </div>
    </header>
  );
}
