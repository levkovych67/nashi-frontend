import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitArtistPage } from './SubmitArtistPage';
import { SubmitEventPage } from './SubmitEventPage';
import { Palette, Calendar } from 'lucide-react';

export function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="aero-glass mb-12 px-6 py-6 text-center">
          <h1 className="text-4xl font-heading font-bold mb-3">Запропонувати</h1>
          <p className="text-muted-foreground text-lg">
            Оберіть, що ви хочете додати до платформи
          </p>
        </div>

        <Tabs defaultValue="artist" className="w-full">
          <TabsList className="mb-10 grid h-auto w-full grid-cols-1 gap-4 bg-transparent p-0 shadow-none backdrop-blur-none md:grid-cols-2 md:gap-6">
            <TabsTrigger 
              value="artist"
              className="aero-glass group flex h-auto cursor-pointer flex-col items-center gap-4 whitespace-normal rounded-lg p-8"
            >
              <div className="aero-orb flex h-16 w-16 items-center justify-center">
                <Palette className="relative z-[2] h-8 w-8" aria-hidden="true" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="aero-heading text-2xl">
                  Артист
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Додайте музиканта, гурт або виконавця
                </p>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="event"
              className="aero-glass group flex h-auto cursor-pointer flex-col items-center gap-4 whitespace-normal rounded-lg p-8"
            >
              <div className="aero-orb aero-orb--grass flex h-16 w-16 items-center justify-center">
                <Calendar className="relative z-[2] h-8 w-8" aria-hidden="true" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="aero-heading text-2xl">
                  Подія
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Запропонуйте концерт чи культурний івент
                </p>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artist" className="mt-0">
            <SubmitArtistPage />
          </TabsContent>

          <TabsContent value="event" className="mt-0">
            <SubmitEventPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
