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
        className="max-h-[85vh] md:bottom-6 md:left-auto md:right-6 md:max-h-[80vh] md:w-[420px] md:rounded-lg"
      >

        <SheetHeader>
          <SheetTitle className="pr-6 text-2xl md:text-[26px]">{pin.name}</SheetTitle>
          <SheetDescription className="sr-only">
            {pin.type === 'ARTIST' ? 'Інформація про артиста' : 'Інформація про подію'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Avatar/Image */}
          {pin.avatarUrl && (
            <OptimizedImage
              src={pin.avatarUrl}
              alt={pin.name || ''}
              containerClassName="w-full h-48 rounded-md border border-[#9cc6ec] shadow-elegant"
            />
          )}

          {/* Info */}
          <div className="flex flex-wrap items-center gap-2">
            {pin.type && <span className="aero-tag">{pin.type === 'ARTIST' ? 'Артист' : 'Подія'}</span>}
            {pin.style && <span className="aero-tag">{pin.style}</span>}
          </div>

          {/* Audio preview */}
          {pin.audioUrl && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Слухати:</p>
              <audio controls className="w-full rounded-full">
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
