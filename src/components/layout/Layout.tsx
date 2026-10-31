import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="min-h-screen-mobile flex flex-col">
      <Header />
      <main className="flex-1 pb-[calc(var(--aero-taskbar-height)+env(safe-area-inset-bottom))] lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
