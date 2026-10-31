import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Users, Calendar, Newspaper, Plus, UserPlus, CalendarPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { isCurrentPath } from '@/lib/utils/isCurrentPath';

const LEFT_TASKS = [
  { to: '/', label: 'Карта', Icon: Map },
  { to: '/artists', label: 'Артисти', Icon: Users },
];
const RIGHT_TASKS = [
  { to: '/events', label: 'Події', Icon: Calendar },
  { to: '/news', label: 'Новини', Icon: Newspaper },
];

export function MobileNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSubmitMenuOpen, setIsSubmitMenuOpen] = useState(false);

  const handleSubmit = (path: string) => {
    setIsSubmitMenuOpen(false);
    navigate(path);
  };

  const task = ({ to, label, Icon }: (typeof LEFT_TASKS)[number]) => (
    <Link
      key={to}
      to={to}
      aria-current={isCurrentPath(pathname, to) ? 'page' : undefined}
      className="aero-task flex min-h-[52px] min-w-[64px] flex-col items-center justify-center gap-1 px-1"
    >
      <Icon size={20} aria-hidden="true" />
      <span className="text-[11px] leading-none">{label}</span>
    </Link>
  );

  return (
    <>
      {/* The Windows 7 taskbar: dark glass along the bottom, the start orb in the middle */}
      <nav
        className="aero-taskbar fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Головне меню"
      >
        <div className="relative flex h-16 items-center justify-around px-2">
          {LEFT_TASKS.map(task)}

          <div className="w-16 flex-none" aria-hidden="true" />
          <button
            onClick={() => setIsSubmitMenuOpen(true)}
            className="aero-orb aero-orb--grass absolute -top-5 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center"
            aria-label="Додати"
          >
            <Plus className="relative z-[2]" size={28} strokeWidth={2.6} aria-hidden="true" />
          </button>

          {RIGHT_TASKS.map(task)}
        </div>
      </nav>

      {/* What to add: a small Aero window */}
      <Sheet open={isSubmitMenuOpen} onOpenChange={setIsSubmitMenuOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[70vh]">
          <SheetHeader className="mb-2">
            <SheetTitle className="text-center text-2xl">Що ви хочете додати?</SheetTitle>
            <SheetDescription className="text-center">
              Оберіть, що ви хочете запропонувати до платформи
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-3 pb-2">
            <Button
              onClick={() => handleSubmit('/submit/artist')}
              variant="outline"
              size="lg"
              className="h-16 w-full justify-start gap-4 text-lg"
            >
              <span className="aero-orb flex h-11 w-11 flex-none items-center justify-center">
                <UserPlus className="relative z-[2] !h-5 !w-5" aria-hidden="true" />
              </span>
              <span className="text-left">
                <span className="block font-semibold">Запропонувати артиста</span>
                <span className="block text-xs text-muted-foreground">Додайте українського виконавця</span>
              </span>
            </Button>

            <Button
              onClick={() => handleSubmit('/submit/event')}
              variant="outline"
              size="lg"
              className="h-16 w-full justify-start gap-4 text-lg"
            >
              <span className="aero-orb aero-orb--grass flex h-11 w-11 flex-none items-center justify-center">
                <CalendarPlus className="relative z-[2] !h-5 !w-5" aria-hidden="true" />
              </span>
              <span className="text-left">
                <span className="block font-semibold">Запропонувати подію</span>
                <span className="block text-xs text-muted-foreground">Додайте концерт або захід</span>
              </span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
