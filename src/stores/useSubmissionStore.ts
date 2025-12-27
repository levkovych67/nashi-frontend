import { create } from 'zustand';

export type SubmissionStatus = 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
export type SubmissionType = 'ARTIST' | 'EVENT';

interface SubmissionState {
  status: SubmissionStatus;
  type: SubmissionType | null;
  progress: number;
  message: string;
  error: string | null;
  formData: any | null; // Store form data for retry
}

interface SubmissionActions {
  startSubmission: (type: SubmissionType, formData?: any) => void;
  updateProgress: (progress: number, message?: string) => void;
  setSuccess: (message?: string) => void;
  setError: (error: string, formData?: any) => void;
  retry: () => void;
  reset: () => void;
}

type SubmissionStore = SubmissionState & SubmissionActions;

const initialState: SubmissionState = {
  status: 'IDLE',
  type: null,
  progress: 0,
  message: '',
  error: null,
  formData: null,
};

export const useSubmissionStore = create<SubmissionStore>((set, get) => {
  let progressInterval: number | null = null;

  return {
    ...initialState,

    startSubmission: (type, formData) => {
      // Clear any existing interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      set({
        status: 'UPLOADING',
        type,
        progress: 0,
        message: 'Завантаження...',
        error: null,
        formData,
      });

      // Simulate progress animation (0% → 90%)
      progressInterval = setInterval(() => {
        const current = get().progress;
        const status = get().status;
        
        // Stop if no longer uploading
        if (status !== 'UPLOADING') {
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          return;
        }
        
        if (current < 90) {
          set({ progress: current + 10 });
        } else {
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
        }
      }, 200);
    },

  updateProgress: (progress, message) => {
    set((state) => ({
      progress,
      message: message || state.message,
    }));
  },

    setSuccess: (message) => {
      console.log('🎉 setSuccess called with message:', message);
      console.log('Current progress before success:', get().progress);
      console.log('Clearing interval:', progressInterval);
      
      // Clear interval immediately
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      set({
        status: 'SUCCESS',
        progress: 100,
        message: message || 'Успішно надіслано!',
        error: null,
      });

      console.log('Success state set. New progress:', get().progress, 'Status:', get().status);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        set(initialState);
      }, 3000);
    },

    setError: (error, formData) => {
      // Clear interval immediately
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      set({
        status: 'ERROR',
        error,
        message: 'Помилка',
        formData: formData || get().formData,
      });
    },

    retry: () => {
      const { formData } = get();
      // Trigger a custom event that forms can listen to
      if (formData) {
        window.dispatchEvent(
          new CustomEvent('submission:retry', { detail: { formData } })
        );
      }
      set(initialState);
    },

    reset: () => {
      // Clear interval on reset
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      set(initialState);
    },
  };
});
