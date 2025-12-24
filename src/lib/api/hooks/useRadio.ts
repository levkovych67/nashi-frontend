import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type TrackDTO = components['schemas']['TrackDTO'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

export function useRadioMix(region?: Region) {
  return useQuery({
    queryKey: ['radio', 'mix', { region }],
    queryFn: () => apiClient.get<TrackDTO[]>('/api/v1/radio/mix', { region }),
  });
}
