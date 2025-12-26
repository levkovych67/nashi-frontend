import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type ArtistSearchResult = components['schemas']['ArtistDTOMinified'];
type PageArtistDTOMinified = components['schemas']['PageArtistDTOMinified'];

/**
 * Hook to search for artists by query string using the dedicated search endpoint
 * Backend returns Page<ArtistDTOMinified> with pagination metadata
 */
export function useArtistSearch(query: string) {
  return useQuery<ArtistSearchResult[]>({
    queryKey: ['artists', 'search', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      // Use the dedicated search endpoint
      // Backend controller returns Page<ArtistDTOMinified>
      const response = await apiClient.get<PageArtistDTOMinified>('/api/v1/artists/search', {
        q: query,
        status: 'APPROVED', // Only show approved artists in search
        page: 0,
        size: 5, // Limit to 5 results for search dropdown
        sort: 'name,asc',
      });

      // Extract content array from paginated response
      return response.content || [];
    },
    enabled: query.trim().length >= 2, // Only search if query has at least 2 characters
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });
}
