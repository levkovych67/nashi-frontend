import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitArtistPage } from './SubmitArtistPage';
import { SubmitEventPage } from './SubmitEventPage';
import { Palette, Calendar } from 'lucide-react';

export function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-3">Запропонувати</h1>
          <p className="text-muted-foreground text-lg">
            Оберіть, що ви хочете додати до платформи
          </p>
        </div>

        <Tabs defaultValue="artist" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-transparent p-0 h-auto mb-10">
            <TabsTrigger 
              value="artist"
              className="flex flex-col items-center gap-4 p-8 rounded-xl border-2 bg-card
                         data-[state=active]:border-accent data-[state=active]:bg-accent/5
                         data-[state=inactive]:border-border
                         hover:border-accent/50 hover:scale-[1.02]
                         transition-all duration-300 ease-out
                         shadow-sm data-[state=active]:shadow-elegant
                         group cursor-pointer h-auto"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center
                              group-data-[state=active]:bg-accent/10 transition-colors">
                <Palette className="w-8 h-8 text-muted-foreground group-data-[state=active]:text-accent transition-colors" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Артист
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Додайте музиканта, гурт або виконавця
                </p>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="event"
              className="flex flex-col items-center gap-4 p-8 rounded-xl border-2 bg-card
                         data-[state=active]:border-accent data-[state=active]:bg-accent/5
                         data-[state=inactive]:border-border
                         hover:border-accent/50 hover:scale-[1.02]
                         transition-all duration-300 ease-out
                         shadow-sm data-[state=active]:shadow-elegant
                         group cursor-pointer h-auto"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center
                              group-data-[state=active]:bg-accent/10 transition-colors">
                <Calendar className="w-8 h-8 text-muted-foreground group-data-[state=active]:text-accent transition-colors" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-heading text-2xl font-bold text-foreground">
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
