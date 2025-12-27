import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSubmitArtist } from '@/lib/api/hooks/useSubmissions';
import { useRegions } from '@/lib/api/hooks/useLookup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CityAutocomplete } from '@/components/ui/city-autocomplete';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { detectSocialPlatform } from '@/lib/utils/detectSocialPlatform';
import type { components } from '@/lib/api/generated/types';

type ArtistCreateRequestDTO = components['schemas']['ArtistCreateRequestDTO'];
type SocialLinkPlatform = 'INSTAGRAM' | 'FACEBOOK' | 'SPOTIFY' | 'APPLE_MUSIC' | 'YOUTUBE' | 'SOUNDCLOUD' | 'TIKTOK' | 'TELEGRAM' | 'WEBSITE' | 'OTHER';
type SocialLinkDTO = components['schemas']['SocialLinkDTO'];

export function SubmitArtistPage() {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ArtistCreateRequestDTO>();
  const { data: regions } = useRegions();
  const { mutate: submitArtist, isPending } = useSubmitArtist();
  const { toast } = useToast();
  
  const [images, setImages] = useState<File[]>([]);
  const [demoTracks, setDemoTracks] = useState<File[]>([]);
  const [members, setMembers] = useState<Array<{ firstName: string; lastName?: string; role: string; city?: string }>>([]);
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: SocialLinkPlatform; url: string }>>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const selectedRegion = watch('region');

  const onSubmit = (data: ArtistCreateRequestDTO) => {
    setSubmitError(null); // Clear previous errors
    
    if (images.length === 0) {
      toast({ title: 'Помилка', description: 'Додайте хоча б одне фото', variant: 'destructive' });
      return;
    }

    submitArtist(
      { data: { ...data, members, socialLinks, pressRelease: '' }, images, demoTracks },
      {
        onSuccess: () => {
          toast({ title: 'Успіх!', description: 'Вашу заявку надіслано на розгляд' });
          setSubmitError(null);
          reset();
          setImages([]);
          setDemoTracks([]);
          setMembers([]);
          setSocialLinks([]);
        },
        onError: (error: any) => {
          // Handle 413 Payload Too Large error
          if (error.status === 413 || error.message?.includes('File size exceeds')) {
            setSubmitError('Розмір файлів перевищує максимально дозволений (90 МБ). Будь ласка, зменшіть розмір файлів.');
          } else {
            setSubmitError(error.message || 'Сталася помилка при надсиланні форми');
          }
          
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
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDemoTracks([...demoTracks, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Запропонувати артиста</h1>
        <p className="text-muted-foreground">Додайте українського виконавця до нашої платформи</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        {/* Basic Info */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Основна інформація</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Назва артиста *</Label>
            <Input
              id="name"
              {...register('name', { required: true, minLength: 2, maxLength: 100 })}
              placeholder="Назва гурту або ім'я виконавця"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">Обов'язкове поле (2-100 символів)</p>}
          </div>

          <div>
            <Label htmlFor="style">Стиль *</Label>
            <Input
              id="style"
              {...register('style', { required: true })}
              placeholder="напр. Folk, Rock, Electronic"
            />
            {errors.style && <p className="text-sm text-red-500 mt-1">Обов'язкове поле</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foundationYear">Рік створення</Label>
              <Input
                id="foundationYear"
                type="number"
                {...register('foundationYear', { min: 1900, max: new Date().getFullYear(), valueAsNumber: true })}
                placeholder="напр. 2015"
              />
              {errors.foundationYear && <p className="text-sm text-red-500 mt-1">Рік має бути від 1900</p>}
            </div>

            <div>
              <Label htmlFor="disbandYear">Рік розпуску (якщо розпущено)</Label>
              <Input
                id="disbandYear"
                type="number"
                {...register('disbandYear', { min: 1900, max: new Date().getFullYear(), valueAsNumber: true })}
                placeholder="напр. 2020"
              />
              {errors.disbandYear && <p className="text-sm text-red-500 mt-1">Рік має бути від 1900</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="region">Область *</Label>
            <select
              id="region"
              {...register('region', { required: true })}
              className="w-full px-3 py-2.5 bg-background border border-accent/20 rounded-soft text-sm hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer transition-colors"
            >
              <option value="">Виберіть область</option>
              {regions?.map((region) => (
                <option key={region.key} value={region.key}>
                  {region.label}
                </option>
              ))}
            </select>
            {errors.region && <p className="text-sm text-red-500 mt-1">Обов'язкове поле</p>}
          </div>

          <CityAutocomplete
            region={selectedRegion || ''}
            value={selectedCity}
            onCitySelect={(city) => {
              setSelectedCity(city.name || '');
              setValue('city', city.name || '');
              setValue('latitude', city.latitude || 0);
              setValue('longitude', city.longitude || 0);
              // Use the coordinate fields for location
              setValue('latitude', city.latitude || 0);
              setValue('longitude', city.longitude || 0);
            }}
            error={errors.city ? 'Обов\'язкове поле' : undefined}
          />

          <div>
            <Label htmlFor="contactEmail">Email для зв'язку *</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail', { required: true })}
              placeholder="contact@example.com"
            />
            {errors.contactEmail && <p className="text-sm text-red-500 mt-1">Обов'язкове поле</p>}
          </div>
        </div>
        </Card>

        {/* Members */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Учасники (опціонально)</h2>
        
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="border border-accent/20 rounded-soft p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Учасник #{index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMembers(members.filter((_, i) => i !== index))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Ім'я *</Label>
                  <Input
                    value={member.firstName}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index].firstName = e.target.value;
                      setMembers(newMembers);
                    }}
                    placeholder="Ім'я"
                  />
                </div>
                <div>
                  <Label>Прізвище</Label>
                  <Input
                    value={member.lastName || ''}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index].lastName = e.target.value;
                      setMembers(newMembers);
                    }}
                    placeholder="Прізвище"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Роль *</Label>
                  <Input
                    value={member.role}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index].role = e.target.value;
                      setMembers(newMembers);
                    }}
                    placeholder="напр. Вокал, Гітара"
                  />
                </div>
                <div>
                  <Label>Місто</Label>
                  <Input
                    value={member.city || ''}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index].city = e.target.value;
                      setMembers(newMembers);
                    }}
                    placeholder="Місто учасника"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setMembers([...members, { firstName: '', role: '' }])}
            className="w-full"
          >
            + Додати учасника
          </Button>
        </div>
        </Card>

        {/* Social Links */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Соціальні мережі (опціонально)</h2>
        
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <div key={index} className="border border-accent/20 rounded-soft p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Посилання #{index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label>URL *</Label>
                <Input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...socialLinks];
                    const url = e.target.value;
                    newLinks[index].url = url;

                    // Auto-detect platform when URL changes
                    if (url) {
                      const detectedPlatform = detectSocialPlatform(url) as SocialLinkDTO['platform'];
                      newLinks[index].platform = detectedPlatform;
                    }

                    setSocialLinks(newLinks);
                  }}
                  placeholder="https://instagram.com/username"
                />
                {link.platform && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Платформа: <span className="font-medium text-foreground">{
                      link.platform === 'INSTAGRAM' ? 'Instagram' :
                      link.platform === 'FACEBOOK' ? 'Facebook' :
                      link.platform === 'SPOTIFY' ? 'Spotify' :
                      link.platform === 'APPLE_MUSIC' ? 'Apple Music' :
                      link.platform === 'YOUTUBE' ? 'YouTube' :
                      link.platform === 'SOUNDCLOUD' ? 'SoundCloud' :
                      link.platform === 'TIKTOK' ? 'TikTok' :
                      link.platform === 'TELEGRAM' ? 'Telegram' :
                      link.platform === 'WEBSITE' ? 'Website' :
                      'Інше'
                    }</span>
                  </p>
                )}
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setSocialLinks([...socialLinks, { platform: 'OTHER' as SocialLinkPlatform, url: '' }])}
            onClick={() => setSocialLinks([...socialLinks, { platform: 'OTHER' as const, url: '' }])}
            className="w-full"
          >
            + Додати соціальну мережу
          </Button>
        </div>
        </Card>

        {/* Biography */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Біографія *</h2>
        
        <div className="space-y-4">
          <div>
            <Textarea
              id="biography"
              {...register('biography', { required: true, maxLength: 5000 })}
              placeholder="Розкажіть про артиста..."
              rows={6}
            />
            {errors.biography && <p className="text-sm text-red-500 mt-1">Обов'язкове поле (макс 5000 символів)</p>}
          </div>
        </div>
        </Card>

        {/* Media Files */}
        <Card className="p-4 md:p-6">
        <h2 className="text-2xl font-heading font-semibold mb-4">Медіа файли</h2>
        
        <div className="space-y-4">
          {/* Images */}
          <div>
            <Label>Фото * (мінімум 1)</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-accent/30 rounded-card cursor-pointer hover:border-accent transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Натисніть для завантаження фото</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-2 space-y-1">
                {images.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-accent/10 px-3 py-2 rounded">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Demo Tracks */}
          <div>
            <Label>Демо-треки (опціонально)</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-accent/30 rounded-card cursor-pointer hover:border-accent transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Натисніть для завантаження аудіо</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleTrackChange}
                  className="hidden"
                />
              </label>
            </div>
            {demoTracks.length > 0 && (
              <div className="mt-2 space-y-1">
                {demoTracks.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-accent/10 px-3 py-2 rounded">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setDemoTracks(demoTracks.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </Card>

        {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-card">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isPending ? 'Надсилання...' : 'Надіслати заявку'}
      </Button>
      </form>
    </div>
  );
}