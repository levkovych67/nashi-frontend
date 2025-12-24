import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { components } from '../generated/types';

type ArtistCreateRequestDTO = components['schemas']['ArtistCreateRequestDTO'];
type EventCreateRequestDTO = components['schemas']['EventCreateRequestDTO'];

interface SubmitArtistData {
  data: ArtistCreateRequestDTO;
  images?: File[];
  demoTracks?: File[];
}

interface SubmitEventData {
  data: EventCreateRequestDTO;
  image: File;
}

export function useSubmitArtist() {
  return useMutation({
    mutationFn: async ({ data, images, demoTracks }: SubmitArtistData) => {
      const formData = new FormData();
      
      // CRITICAL FIX: Add filename 'data.json' for Spring Boot to recognize JSON
      const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      formData.append('data', jsonBlob, 'data.json'); // ← filename is required!
      
      // Add images
      if (images) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      // Add demo tracks
      if (demoTracks) {
        demoTracks.forEach((track) => {
          formData.append('demoTracks', track);
        });
      }
      
      return apiClient.postFormData<string>('/api/v1/artists', formData);
    },
  });
}

export function useSubmitEvent() {
  return useMutation({
    mutationFn: async ({ data, image }: SubmitEventData) => {
      const formData = new FormData();
      
      // CRITICAL FIX: Add filename 'data.json' for Spring Boot to recognize JSON
      const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      formData.append('data', jsonBlob, 'data.json'); // ← filename is required!
      
      // Add image
      formData.append('image', image);
      
      return apiClient.postFormData<void>('/api/v1/events/suggest', formData);
    },
  });
}
