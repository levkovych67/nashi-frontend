import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, X } from 'lucide-react';
import { useSubmissionStore } from '@/stores/useSubmissionStore';
import { Button } from '@/components/ui/button';

export function SubmissionProgressWidget() {
  const { status, type, progress, message, error, retry, reset } = useSubmissionStore();

  const isVisible = status !== 'IDLE';
  const edge =
    status === 'SUCCESS' ? 'border-l-[var(--aero-grass-ink)]' : status === 'ERROR' ? 'border-l-[var(--aero-danger)]' : 'border-l-[var(--aero-aqua)]';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-[calc(var(--aero-taskbar-height)+env(safe-area-inset-bottom)+1rem)] right-4 z-50 w-80 max-w-[calc(100vw-2rem)] md:bottom-6 md:right-6"
          role="status"
          aria-live="polite"
        >
          <div className={`aero-glass border-l-4 p-4 ${edge}`}>
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status === 'UPLOADING' && <div className="aero-spinner !h-5 !w-5 !border-[3px]" aria-hidden="true" />}
                {status === 'SUCCESS' && <CheckCircle2 className="h-5 w-5 text-[var(--aero-grass-ink)]" aria-hidden="true" />}
                {status === 'ERROR' && <XCircle className="h-5 w-5 text-[var(--aero-danger)]" aria-hidden="true" />}
                <span className="aero-heading text-sm">{type === 'ARTIST' ? 'Додавання артиста' : 'Додавання події'}</span>
              </div>

              {status !== 'UPLOADING' && (
                <button
                  onClick={reset}
                  className="aero-hover-row -mr-2 -mt-2 flex h-11 w-11 items-center justify-center text-muted-foreground"
                  aria-label="Закрити"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Message */}
            <p className="mb-3 text-sm text-muted-foreground">{message}</p>

            {/* Windows 7 progress bar */}
            {(status === 'UPLOADING' || status === 'SUCCESS') && (
              <div className="aero-progress mb-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={status === 'SUCCESS' ? 100 : progress}>
                <div className="aero-progress__bar" style={{ width: `${status === 'SUCCESS' ? 100 : progress}%` }} />
              </div>
            )}

            {/* Error State */}
            {status === 'ERROR' && error && (
              <>
                <p className="mb-3 text-sm text-[var(--aero-danger)]">{error}</p>
                <Button onClick={retry} size="sm" variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Спробувати знову
                </Button>
              </>
            )}

            {/* Progress Percentage */}
            {status === 'UPLOADING' && <p className="text-right text-xs text-muted-foreground">{progress}%</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
