# Background Submission UX Pattern

This document explains how to use the Background Submission pattern for Forms with Optimistic UI.

## Overview

The Background Submission pattern allows forms to submit data in the background without blocking the UI. When a user submits a form:

1. **Modal closes immediately** - User is returned to the map/main view
2. **Progress widget appears** - Shows upload progress in bottom-right corner
3. **Simulated progress** - Bar animates to ~90% and waits for server
4. **Completion feedback** - Success (green) or Error (red) with retry option

## Components

### 1. Zustand Store (`useSubmissionStore`)

Manages global submission state:

```typescript
import { useSubmissionStore } from '@/stores/useSubmissionStore';

const {
  status,        // 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'
  startSubmission,
  setSuccess,
  setError,
  retry,
  reset
} = useSubmissionStore();
```

### 2. Progress Widget (`SubmissionProgressWidget`)

Floating widget that appears during submission. Already integrated in `Layout.tsx`.

## Usage in Forms

### Example: Artist Submission Form

```typescript
import { useNavigate } from 'react-router-dom';
import { useSubmissionStore } from '@/stores/useSubmissionStore';
import { useSubmitArtist } from '@/lib/api/hooks/useSubmissions';

export function CreateArtistForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const submitArtist = useSubmitArtist();
  const { startSubmission, setSuccess, setError } = useSubmissionStore();

  const handleSubmit = async (data: ArtistFormData) => {
    // 1. Start background submission (progress widget appears)
    startSubmission('ARTIST', data);
    
    // 2. Close modal immediately - user returns to map
    onClose();
    navigate('/'); // Navigate to map
    
    // 3. Submit in background
    try {
      await submitArtist.mutateAsync({ data, images, demoTracks });
      
      // 4. Show success
      setSuccess('Артиста успішно додано!');
    } catch (error: any) {
      // 5. Show error with retry option
      setError(error.message || 'Помилка при додаванні', data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  );
}
```

### Example: Event Submission Form

```typescript
export function CreateEventForm({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const submitEvent = useSubmitEvent();
  const { startSubmission, setSuccess, setError } = useSubmissionStore();

  const handleSubmit = async (data: EventFormData) => {
    startSubmission('EVENT', data);
    onClose();
    navigate('/');
    
    try {
      await submitEvent.mutateAsync({ data, image });
      setSuccess('Подію успішно додано!');
    } catch (error: any) {
      setError(error.message || 'Помилка при додаванні', data);
    }
  };

  return <form onSubmit={handleSubmit}>{/* fields */}</form>;
}
```

## Retry Functionality

When an error occurs, users can click "Retry" button in the error widget. The widget dispatches a custom event:

```typescript
// Listen for retry events in your form component
useEffect(() => {
  const handleRetry = (event: CustomEvent) => {
    const { formData } = event.detail;
    // Re-open form with saved data
    setFormData(formData);
    setIsOpen(true);
  };

  window.addEventListener('submission:retry', handleRetry as EventListener);
  return () => window.removeEventListener('submission:retry', handleRetry as EventListener);
}, []);
```

## Store API Reference

### `startSubmission(type, formData?)`
Starts the submission process. Shows progress widget and animates to 90%.
- `type`: 'ARTIST' | 'EVENT'
- `formData`: (optional) Form data to save for retry

### `updateProgress(progress, message?)`
Updates progress bar and message.
- `progress`: number 0-100
- `message`: (optional) Status message

### `setSuccess(message?)`
Shows success state (green, checkmark). Auto-hides after 3 seconds.
- `message`: (optional) Success message

### `setError(error, formData?)`
Shows error state (red, X icon, retry button).
- `error`: Error message
- `formData`: (optional) Form data for retry

### `retry()`
Triggers retry by dispatching custom event and resetting state.

### `reset()`
Manually reset to IDLE state.

## Progress Animation

The progress bar uses a simulated animation pattern:

1. **0% → 90%**: Animated in 2-second interval (10% per 200ms)
2. **Waiting at 90%**: Until server responds
3. **90% → 100%**: When `setSuccess()` is called
4. **Auto-hide**: Widget disappears after 3 seconds

## Visual States

### Uploading
- 🔵 Blue accent color
- ⏳ Spinning loader icon
- 📊 Animated progress bar
- 📝 Status message

### Success
- 🟢 Green background
- ✅ Checkmark icon
- 📊 Full progress bar (100%)
- ⏱️ Auto-hides after 3s

### Error
- 🔴 Red background
- ❌ X icon
- 📝 Error message
- 🔄 Retry button

## Best Practices

1. **Always navigate away**: Close modal and navigate to map/list view
2. **Save form data**: Pass formData to enable retry
3. **Clear error messages**: Provide user-friendly error text
4. **Test retry flow**: Ensure users can retry failed submissions
5. **Don't block UI**: Let users continue browsing while upload happens

## Integration Checklist

- [x] Install Zustand (`npm install zustand`)
- [x] Install Framer Motion (`npm install framer-motion`)
- [x] Create `useSubmissionStore.ts`
- [x] Create `SubmissionProgressWidget.tsx`
- [x] Add widget to `Layout.tsx`
- [ ] Update artist form with background submission
- [ ] Update event form with background submission
- [ ] Test retry functionality
- [ ] Test success/error states

## Example: Complete Form Integration

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSubmissionStore } from '@/stores/useSubmissionStore';
import { useSubmitArtist } from '@/lib/api/hooks/useSubmissions';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ArtistSubmissionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit, reset, setValue } = useForm();
  const submitArtist = useSubmitArtist();
  const { startSubmission, setSuccess, setError } = useSubmissionStore();

  // Listen for retry events
  useEffect(() => {
    const handleRetry = (event: CustomEvent) => {
      const { formData } = event.detail;
      // Populate form with saved data
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
      setIsOpen(true);
    };

    window.addEventListener('submission:retry', handleRetry as EventListener);
    return () => window.removeEventListener('submission:retry', handleRetry as EventListener);
  }, [setValue]);

  const onSubmit = async (data: any) => {
    // 1. Start background process
    startSubmission('ARTIST', data);
    
    // 2. Close dialog and navigate
    setIsOpen(false);
    navigate('/');
    
    // 3. Submit in background
    try {
      await submitArtist.mutateAsync(data);
      setSuccess('Артиста успішно додано!');
      reset();
    } catch (error: any) {
      setError(error.message, data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Your form fields */}
        <Button type="submit">Надіслати</Button>
      </form>
    </Dialog>
  );
}
```

## Troubleshooting

**Widget doesn't appear:**
- Check that `SubmissionProgressWidget` is added to `Layout.tsx`
- Verify you're calling `startSubmission()` before closing modal

**Progress stuck at 90%:**
- Make sure you call `setSuccess()` or `setError()` after API response
- Check for unhandled promise rejections

**Retry doesn't work:**
- Ensure formData is passed to `setError(message, formData)`
- Add event listener in form component for 'submission:retry'

**Widget doesn't hide:**
- Success state auto-hides after 3 seconds
- For error/manual close, user clicks X button or calls `reset()`
