import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSubmitEvent } from '@/lib/api/hooks/useSubmissions';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import type { components } from '@/lib/api/generated/types';

type EventCreateRequestDTO = components['schemas']['EventCreateRequestDTO'];

export function SubmitEventPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventCreateRequestDTO>();
  const { data: regions } = useRegions();
  const { mutate: submitEvent, isPending } = useSubmitEvent();
  const { toast } = useToast();
  
  const [image, setImage] = useState<File | null>(null);

  const onSubmit = (data: EventCreateRequestDTO) => {
    if (!image) {
      toast({ title: 'Помилка', description: 'Додайте фото події', variant: 'destructive' });
      return;
    }

    // Validate that the event date is in the future
    const eventDate = new Date(data.dateTime);
    const now = new Date();
    if (eventDate <= now) {
      toast({ 
        title: 'Помилка', 
        description: 'Дата і час події мають бути в майбутньому', 
        variant: 'destructive' 
      });
      return;
    }

    submitEvent(
      { data, image },
      {
        onSuccess: () => {
          toast({ title: 'Успіх!', description: 'Подію надіслано на розгляд' });
          reset();
          setImage(null);
        },
        onError: (error) => {
          toast({ 
            title: 'Помилка', 
            description: error.message,
            variant: 'destructive' 
          });
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Запропонувати подію</h1>
        <p className="text-muted-foreground">Додайте концерт або захід до нашої платформи</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        {/* Basic Info */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Інформація про подію</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Назва події *</Label>
            <Input
              id="title"
              {...register('title', { 
                required: 'Обов\'язкове поле',
                minLength: { value: 2, message: 'Мінімум 2 символи' },
                maxLength: { value: 200, message: 'Максимум 200 символів' }
              })}
              placeholder="Назва події або концерту"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="artistName">Ім'я артиста *</Label>
            <Input
              id="artistName"
              {...register('artistName', { 
                required: 'Обов\'язкове поле',
                minLength: { value: 2, message: 'Мінімум 2 символи' },
                maxLength: { value: 100, message: 'Максимум 100 символів' }
              })}
              placeholder="Хто виступає?"
            />
            {errors.artistName && <p className="text-sm text-red-500 mt-1">{errors.artistName.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Опис *</Label>
            <Textarea
              id="description"
              {...register('description', { 
                required: 'Обов\'язкове поле',
                minLength: { value: 10, message: 'Мінімум 10 символів' },
                maxLength: { value: 2000, message: 'Максимум 2000 символів' }
              })}
              placeholder="Опишіть подію..."
              rows={6}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateTime">Дата і час події *</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                {...register('dateTime', { 
                  required: 'Обов\'язкове поле',
                  validate: (value) => {
                    const eventDate = new Date(value);
                    const now = new Date();
                    return eventDate > now || 'Дата і час події мають бути в майбутньому';
                  }
                })}
              />
              {errors.dateTime && <p className="text-sm text-red-500 mt-1">{errors.dateTime.message}</p>}
            </div>

            <div>
              <Label htmlFor="region">Область *</Label>
              <select
                id="region"
                {...register('region', { required: 'Оберіть область' })}
                className="w-full px-3 py-2.5 bg-background border border-accent/20 rounded-soft text-sm hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer transition-colors"
              >
                <option value="">Виберіть область</option>
                {regions?.map((region) => (
                  <option key={region.key} value={region.key}>
                    {region.label}
                  </option>
                ))}
              </select>
              {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Місто *</Label>
              <Input
                id="city"
                {...register('city', { 
                  required: 'Обов\'язкове поле',
                  minLength: { value: 2, message: 'Мінімум 2 символи' },
                  maxLength: { value: 50, message: 'Максимум 50 символів' }
                })}
                placeholder="Київ, Львів, тощо"
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="venue">Місце проведення *</Label>
              <Input
                id="venue"
                {...register('venue', { 
                  required: 'Обов\'язкове поле',
                  minLength: { value: 2, message: 'Мінімум 2 символи' },
                  maxLength: { value: 100, message: 'Максимум 100 символів' }
                })}
                placeholder="напр. Палац Спорту"
              />
              {errors.venue && <p className="text-sm text-red-500 mt-1">{errors.venue.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="ticketUrl">Посилання на квитки *</Label>
            <Input
              id="ticketUrl"
              type="url"
              {...register('ticketUrl', { 
                required: 'Обов\'язкове поле',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Введіть коректне посилання (має починатися з http:// або https://)'
                }
              })}
              placeholder="https://..."
            />
            {errors.ticketUrl && <p className="text-sm text-red-500 mt-1">{errors.ticketUrl.message}</p>}
          </div>
        </div>
        </Card>

        {/* Image */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Фото події</h2>
        
        <div>
          <Label>Фото *</Label>
          <div className="mt-2">
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-accent/30 rounded-card cursor-pointer hover:border-accent transition-colors">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-accent mb-2" />
                <p className="text-sm text-muted-foreground">Натисніть для завантаження фото</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {image && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm bg-accent/10 px-3 py-2 rounded">
                <span className="truncate">{image.name}</span>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isPending ? 'Надсилання...' : 'Надіслати подію'}
      </Button>
      </form>
    </div>
  );
}
