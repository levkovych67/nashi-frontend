import { useState } from 'react';
import { EventCard } from '@/features/events/components/EventCard';
import { useEvents } from '@/lib/api/hooks/useEvents';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { components } from '@/lib/api/generated/types';

type EventResponseDTO = components['schemas']['EventResponseDTO'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

export function EventsPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EventResponseDTO | null>(null);
  const { data: regions } = useRegions();
  const { data: events, isLoading, error } = useEvents(selectedRegion);

  const eventDate = selectedEvent?.dateTime ? new Date(selectedEvent.dateTime) : null;

  return (
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
            onChange={(e) => setSelectedRegion(e.target.value || undefined)}
            className="px-3 py-2 bg-background border border-accent/20 rounded-soft text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
      {!isLoading && !error && (!events || events.length === 0) && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Подій не знайдено</p>
        </div>
      )}

      {/* Events Grid */}
      {events && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={setSelectedEvent}
            />
          ))}
        </div>
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
  );
}
