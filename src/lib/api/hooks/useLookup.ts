import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type RegionDTO = components['schemas']['RegionDTO'];
type CityLookupResponse = components['schemas']['CityLookupResponse'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

export function useRegions() {
  return useQuery({
    queryKey: ['lookup', 'regions'],
    queryFn: () => apiClient.get<RegionDTO[]>('/api/v1/lookup/regions'),
    staleTime: Infinity, // Regions don't change
  });
}

export function useCities(region: Region, query: string) {
  return useQuery({
    queryKey: ['lookup', 'cities', region, query],
    queryFn: () =>
      apiClient.get<CityLookupResponse[]>('/api/v1/lookup/cities', { region, query }),
    enabled: !!region && query.length >= 2,
  });
}
