import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

interface MapPinsParams {
  region?: Region;
  style?: string;
  tags?: string[];
  types?: ('EVENT' | 'ARTIST')[];
}

export function useMapPins(params?: MapPinsParams) {
  return useQuery({
    queryKey: ['map', 'pins', params],
    queryFn: () => apiClient.get<MapPinDTO[]>('/api/v1/map/pins', params),
  });
}
