import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { components } from '@/lib/api/generated/types';

type EventResponseDTO = components['schemas']['EventResponseDTO'];

interface EventCardProps {
  event: EventResponseDTO;
  onViewDetails?: (event: EventResponseDTO) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const eventDate = event.dateTime ? new Date(event.dateTime) : null;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Event Image */}
      {event.eventImageKey && (
        <div className="relative h-48 overflow-hidden bg-accent/10">
          <img
            src={event.eventImageKey}
            alt={event.title || ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-heading text-xl font-semibold mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Artist Name */}
        {event.artistName && (
          <p className="text-sm text-accent mb-3">{event.artistName}</p>
        )}

        {/* Date & Location */}
        <div className="space-y-2 mb-4">
          {eventDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{format(eventDate, 'd MMMM yyyy, HH:mm', { locale: uk })}</span>
            </div>
          )}
          {event.venue && event.city && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">
                {event.venue}, {event.city}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {event.ticketUrl && (
            <Button size="sm" asChild className="flex-1">
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Квитки
              </a>
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onViewDetails?.(event)}>
            Деталі
          </Button>
        </div>
      </div>
    </Card>
  );
}
