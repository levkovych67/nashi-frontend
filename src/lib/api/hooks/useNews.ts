import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type NewsPostViewDTO = components['schemas']['NewsPostViewDTO'];
type PageNewsPostViewDTO = components['schemas']['PageNewsPostViewDTO'];

export function useLatestNews(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['news', 'latest', params],
    queryFn: () =>
      apiClient.get<PageNewsPostViewDTO>('/api/v1/metadata/news/latest', {
        page: params?.page || 0,
        size: params?.size || 10,
      }),
  });
}

export function useLastNews(limit: number = 3) {
  return useQuery({
    queryKey: ['news', 'last', limit],
    queryFn: () => apiClient.get<NewsPostViewDTO[]>('/api/v1/metadata/news/last', { limit }),
  });
}
