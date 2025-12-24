import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitArtistPage } from './SubmitArtistPage';
import { SubmitEventPage } from './SubmitEventPage';

export function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-2">Запропонувати</h1>
        <p className="text-muted-foreground mb-8">
          Оберіть, що ви хочете додати до платформи
        </p>

        <Tabs defaultValue="artist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="artist" className="text-base">
              🎨 Артист
            </TabsTrigger>
            <TabsTrigger value="event" className="text-base">
              🎭 Подія
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
