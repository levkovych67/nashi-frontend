import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type EventResponseDTO = components['schemas']['EventResponseDTO'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

export function useEvents(region?: Region) {
  return useQuery({
    queryKey: ['events', { region }],
    queryFn: () => apiClient.get<EventResponseDTO[]>('/api/v1/events', { region }),
  });
}

export function useEventById(id: string) {
  return useQuery({
    queryKey: ['events', 'detail', id],
    queryFn: () => apiClient.get<EventResponseDTO>(`/api/v1/events/${id}`),
    enabled: !!id,
  });
}
