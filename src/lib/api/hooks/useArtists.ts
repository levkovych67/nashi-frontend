import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type ArtistDTOMinified = components['schemas']['ArtistDTOMinified'];
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
        'pageable.page': params?.page || 0,
        'pageable.size': params?.size || 20,
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
        'pageable.page': pageParam,
        'pageable.size': params?.size || 20,
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
