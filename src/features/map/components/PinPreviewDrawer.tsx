import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useNavigate } from 'react-router-dom';
import type { components } from '@/lib/api/generated/types';

type MapPinDTO = components['schemas']['MapPinDTO'];

interface PinPreviewDrawerProps {
  pin: MapPinDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PinPreviewDrawer({ pin, isOpen, onClose }: PinPreviewDrawerProps) {
  const navigate = useNavigate();

  if (!pin) return null;

  const handleViewProfile = () => {
    if (pin.type === 'ARTIST' && pin.slug) {
      navigate(`/artists/${pin.slug}`);
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] max-h-[85vh] md:h-auto md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-t-xl"
      >
        {/* Mobile drag handle indicator */}
        <div className="flex justify-center mb-2 md:hidden">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl md:text-3xl">{pin.name}</SheetTitle>
          <SheetDescription className="sr-only">
            {pin.type === 'ARTIST' ? 'Інформація про артиста' : 'Інформація про подію'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 pb-safe">
          {/* Avatar/Image */}
          {pin.avatarUrl && (
            <OptimizedImage
              src={pin.avatarUrl}
              alt={pin.name || ''}
              containerClassName="w-full h-48 rounded-card"
            />
          )}

          {/* Info */}
          <div className="space-y-2">
            {pin.style && (
              <div>
                <span className="text-sm text-muted-foreground">Стиль:</span>{' '}
                <span className="font-medium">{pin.style}</span>
              </div>
            )}

            {pin.type && (
              <div>
                <span className="text-sm text-muted-foreground">Тип:</span>{' '}
                <span className="font-medium">
                  {pin.type === 'ARTIST' ? 'Артист' : 'Подія'}
                </span>
              </div>
            )}
          </div>

          {/* Audio preview */}
          {pin.audioUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Попередній прослуховування:</p>
              <audio controls className="w-full">
                <source src={pin.audioUrl} type="audio/mpeg" />
                Ваш браузер не підтримує аудіо елемент.
              </audio>
            </div>
          )}

          {/* Actions */}
          {pin.type === 'ARTIST' && pin.slug && (
            <Button onClick={handleViewProfile} className="w-full">
              Переглянути профіль
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
