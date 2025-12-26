import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useArtistSearch } from '@/lib/api/hooks/useArtistSearch';
import { config } from '@/lib/config';

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce the query to avoid spamming API
  const debouncedQuery = useDebounce(query, 500);

  // Fetch search results
  const { data: results = [], isFetching } = useArtistSearch(debouncedQuery);

  // Auto-focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setQuery('');
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setQuery('');
      setSelectedIndex(-1);
      return;
    }

    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectArtist(results[selectedIndex]);
    }
  };

  const handleSelectArtist = (artist: typeof results[0]) => {
    navigate(`/artists/${artist.slug}`);
    setIsExpanded(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const showResults = isExpanded && debouncedQuery.length >= 2 && results.length > 0;
  const showNoResults = isExpanded && debouncedQuery.length >= 2 && results.length === 0 && !isFetching;
  const showLoading = isFetching && debouncedQuery.length >= 2;

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? '100%' : '40px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="relative flex items-center">
          {/* Search Icon Button (Collapsed State) */}
          {!isExpanded && (
            <motion.button
              onClick={handleExpand}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Пошук"
            >
              <Search className="w-5 h-5 text-foreground" />
            </motion.button>
          )}

          {/* Expanded Search Input */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="relative">
                  {/* Search Icon (Inside Input) */}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Шукати артистів..."
                    className="w-full h-10 pl-10 pr-10 bg-background/80 backdrop-blur-md border border-accent/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />

                  {/* Loading Spinner or Clear Button */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showLoading ? (
                      <Loader2 className="w-4 h-4 text-accent animate-spin" />
                    ) : query ? (
                      <button
                        onClick={() => setQuery('')}
                        className="hover:bg-secondary rounded-full p-1 transition-colors"
                        aria-label="Очистити"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    ) : (
                      <button
                        onClick={handleCollapse}
                        className="hover:bg-secondary rounded-full p-1 transition-colors"
                        aria-label="Закрити"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {(showResults || showNoResults || showLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-accent/20 rounded-card shadow-elegant max-h-80 overflow-y-auto z-50"
          >
            {/* Loading State */}
            {showLoading && (
              <div className="px-4 py-6 text-center">
                <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Завантаження...</p>
              </div>
            )}

            {/* No Results */}
            {showNoResults && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Нічого не знайдено для "{debouncedQuery}"
                </p>
              </div>
            )}

            {/* Results List */}
            {showResults && (
              <div className="py-2">
                {results.map((artist, index) => (
                  <button
                    key={artist.id}
                    onClick={() => handleSelectArtist(artist)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors text-left ${
                      selectedIndex === index ? 'bg-secondary' : ''
                    }`}
                  >
                    {/* Artist Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                      {artist.imageUrls && artist.imageUrls.length > 0 ? (
                        <img
                          src={`${config.cdnUrl}${artist.imageUrls[0]}`}
                          alt={artist.name || ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Search className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Artist Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {artist.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {artist.city}, {artist.region}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
