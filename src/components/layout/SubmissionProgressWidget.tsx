import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useSubmissionStore } from '@/stores/useSubmissionStore';
import { Button } from '@/components/ui/button';

export function SubmissionProgressWidget() {
  const { status, type, progress, message, error, retry, reset } = useSubmissionStore();

  const isVisible = status !== 'IDLE';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
        >
          <div
            className={`rounded-card border shadow-elegant p-4 backdrop-blur-md ${
              status === 'SUCCESS'
                ? 'bg-green-50/90 dark:bg-green-950/90 border-green-200 dark:border-green-800'
                : status === 'ERROR'
                ? 'bg-red-50/90 dark:bg-red-950/90 border-red-200 dark:border-red-800'
                : 'bg-card/90 border-accent/20'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {status === 'UPLOADING' && (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                )}
                {status === 'SUCCESS' && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                {status === 'ERROR' && (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <span className="font-medium text-sm">
                  {type === 'ARTIST' ? 'Додавання артиста' : 'Додавання події'}
                </span>
              </div>

              {status !== 'UPLOADING' && (
                <button
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Закрити"
                >
                  ×
                </button>
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-muted-foreground mb-3">{message}</p>

            {/* Progress Bar */}
            {status === 'UPLOADING' && (
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute left-0 top-0 h-full bg-accent rounded-full"
                />
              </div>
            )}

            {/* Success Progress Bar */}
            {status === 'SUCCESS' && (
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: '90%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute left-0 top-0 h-full bg-green-600 dark:bg-green-400 rounded-full"
                />
              </div>
            )}

            {/* Error State */}
            {status === 'ERROR' && error && (
              <>
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
                <Button
                  onClick={retry}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Спробувати знову
                </Button>
              </>
            )}

            {/* Progress Percentage */}
            {status === 'UPLOADING' && (
              <p className="text-xs text-muted-foreground text-right">{progress}%</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
