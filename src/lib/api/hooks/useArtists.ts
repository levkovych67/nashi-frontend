import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type ArtistViewDTO = components['schemas']['ArtistViewDTO'];
type PageArtistDTOMinified = components['schemas']['PageArtistDTOMinified'];
type Region = components['schemas']['EventCreateRequestDTO']['region'];

interface ArtistsListParams {
  region?: Region;
  page?: number;
  size?: number;
}

export function useArtists(params?: ArtistsListParams) {
  return useQuery({
    queryKey: ['artists', 'list', params],
    queryFn: () =>
      apiClient.get<PageArtistDTOMinified>('/api/v1/artists', {
        page: params?.page || 0,
        size: params?.size || 20,
        sort: 'createdAt,DESC', // Sort by newest first
        region: params?.region,
      }),
  });
}

interface InfiniteArtistsParams {
  region?: Region;
  size?: number;
}

export function useInfiniteArtists(params?: InfiniteArtistsParams) {
  return useInfiniteQuery({
    queryKey: ['artists', 'infinite', params],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.get<PageArtistDTOMinified>('/api/v1/artists', {
        page: pageParam,
        size: params?.size || 20,
        sort: 'createdAt,DESC', // Sort by newest first
        region: params?.region,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return (lastPage.number ?? 0) + 1;
    },
    initialPageParam: 0,
  });
}

export function useArtistBySlug(slug: string) {
  return useQuery({
    queryKey: ['artists', 'detail', slug],
    queryFn: () => apiClient.get<ArtistViewDTO>(`/api/v1/artists/slug/${slug}`),
    enabled: !!slug,
  });
}
