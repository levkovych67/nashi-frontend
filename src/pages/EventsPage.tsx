import { useState, useMemo } from 'react';
import { EventCard } from '@/features/events/components/EventCard';
import { useEvents } from '@/lib/api/hooks/useEvents';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SEO } from '@/components/SEO';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { components } from '@/lib/api/generated/types';

type EventResponseDTO = components['schemas']['EventResponseDTO'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

const EVENTS_PER_PAGE = 12;

export function EventsPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EventResponseDTO | null>(null);
  const [displayCount, setDisplayCount] = useState(EVENTS_PER_PAGE);
  
  const { data: regions } = useRegions();
  const { data: allEvents, isLoading, error } = useEvents(selectedRegion);

  // Client-side pagination: show events progressively
  const visibleEvents = useMemo(
    () => allEvents?.slice(0, displayCount) || [],
    [allEvents, displayCount]
  );

  const hasMore = allEvents && displayCount < allEvents.length;

  // Intersection Observer for infinite scroll
  const sentinelRef = useInfiniteScroll({
    onLoadMore: () => setDisplayCount((prev) => prev + EVENTS_PER_PAGE),
    hasMore: !!hasMore,
    isLoading: false,
    rootMargin: '200px',
  });

  // Reset display count when region changes
  useMemo(() => {
    setDisplayCount(EVENTS_PER_PAGE);
  }, [selectedRegion]);

  const eventDate = selectedEvent?.dateTime ? new Date(selectedEvent.dateTime) : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'Культурні події України',
    description: 'Календар культурних подій по всій Україні',
  };

  return (
    <>
      <SEO
        title="Культурні події України"
        description="Календар культурних подій по всій Україні: концерти, виставки, фестивалі та інші заходи. Знайдіть цікаві події у вашому місті."
        keywords="культурні події, події в Україні, концерти, виставки, фестивалі, культурний календар"
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-heading font-bold">Події</h1>

        {/* Region Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="region-filter" className="text-sm font-medium">
            Область:
          </label>
          <select
            id="region-filter"
            value={selectedRegion || ''}
            onChange={(e) => {
              setSelectedRegion((e.target.value || undefined) as Region | undefined);
              setDisplayCount(EVENTS_PER_PAGE);
            }}
            className="px-3 py-2 bg-background border border-accent/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          >
            <option value="">Усі області</option>
            {regions?.map((region) => (
              <option key={region.key} value={region.key}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Завантаження подій...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-2">Помилка завантаження</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!allEvents || allEvents.length === 0) && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Подій не знайдено</p>
        </div>
      )}

      {/* Events Grid */}
      {visibleEvents.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={setSelectedEvent}
              />
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">Завантаження...</p>
              </div>
            </div>
          )}

          {/* End of List Indicator */}
          {!hasMore && visibleEvents.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Показано всі події {selectedRegion ? 'з обраної області' : ''}
              </p>
            </div>
          )}
        </>
      )}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-3xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Image */}
                {selectedEvent.eventImageKey && (
                  <div className="w-full h-64 rounded-card overflow-hidden">
                    <img
                      src={selectedEvent.eventImageKey}
                      alt={selectedEvent.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Artist */}
                {selectedEvent.artistName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Артист:</p>
                    <p className="font-medium text-accent">{selectedEvent.artistName}</p>
                  </div>
                )}

                {/* Date & Time */}
                {eventDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{format(eventDate, 'd MMMM yyyy', { locale: uk })}</p>
                      <p className="text-sm text-muted-foreground">{format(eventDate, 'HH:mm')}</p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {selectedEvent.venue && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedEvent.venue}</p>
                      {selectedEvent.city && (
                        <p className="text-sm text-muted-foreground">{selectedEvent.city}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Опис:</p>
                    <p className="text-foreground/90 whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Ticket Link */}
                {selectedEvent.ticketUrl && (
                  <Button asChild className="w-full">
                    <a href={selectedEvent.ticketUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Купити квитки
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
