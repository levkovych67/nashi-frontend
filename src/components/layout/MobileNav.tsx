import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Users, Calendar, Newspaper, Plus, UserPlus, CalendarPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitMenuOpen, setIsSubmitMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleSubmitArtist = () => {
    setIsSubmitMenuOpen(false);
    navigate('/submit/artist');
  };
  
  const handleSubmitEvent = () => {
    setIsSubmitMenuOpen(false);
    navigate('/submit/event');
  };
  
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-accent/20">
        <div className="flex items-center justify-around h-16 px-2 relative">
          <Link to="/" className={`flex flex-col items-center gap-1 min-w-[60px] ${isActive('/') ? 'text-accent' : 'text-foreground'}`}>
            <Map size={20} />
            <span className="text-xs font-nav">Карта</span>
          </Link>

          <Link to="/artists" className={`flex flex-col items-center gap-1 min-w-[60px] ${isActive('/artists') ? 'text-accent' : 'text-foreground'}`}>
            <Users size={20} />
            <span className="text-xs font-nav">Артисти</span>
          </Link>

          {/* Floating Action Button */}
          <button
            onClick={() => setIsSubmitMenuOpen(true)}
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-elegant-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Додати"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>

          <Link to="/events" className={`flex flex-col items-center gap-1 min-w-[60px] ${isActive('/events') ? 'text-accent' : 'text-foreground'}`}>
            <Calendar size={20} />
            <span className="text-xs font-nav">Події</span>
          </Link>

          <Link to="/news" className={`flex flex-col items-center gap-1 min-w-[60px] ${isActive('/news') ? 'text-accent' : 'text-foreground'}`}>
            <Newspaper size={20} />
            <span className="text-xs font-nav">Новини</span>
          </Link>
        </div>
      </nav>

      {/* Submission Options Sheet */}
      <Sheet open={isSubmitMenuOpen} onOpenChange={setIsSubmitMenuOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[50vh] rounded-t-3xl">
          <div className="flex justify-center mb-4 md:hidden">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-heading text-center">
              Що ви хочете додати?
            </SheetTitle>
            <SheetDescription className="text-center">
              Оберіть, що ви хочете запропонувати до платформи
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-3 pb-4">
            <Button
              onClick={handleSubmitArtist}
              variant="outline"
              size="lg"
              className="w-full h-16 text-lg justify-start gap-4 border-2 hover:border-accent hover:bg-accent/5"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Запропонувати артиста</div>
                <div className="text-xs text-muted-foreground font-normal">Додайте українського виконавця</div>
              </div>
            </Button>

            <Button
              onClick={handleSubmitEvent}
              variant="outline"
              size="lg"
              className="w-full h-16 text-lg justify-start gap-4 border-2 hover:border-accent hover:bg-accent/5"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <CalendarPlus className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Запропонувати подію</div>
                <div className="text-xs text-muted-foreground font-normal">Додайте концерт або захід</div>
              </div>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
