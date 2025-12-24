import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type PlatformStatsDTO = components['schemas']['PlatformStatsDTO'];

export function usePlatformStats() {
  return useQuery({
    queryKey: ['metadata', 'stats'],
    queryFn: () => apiClient.get<PlatformStatsDTO>('/api/v1/metadata/stats'),
    staleTime: 10 * 60 * 1000, // Stats don't change often
  });
}
