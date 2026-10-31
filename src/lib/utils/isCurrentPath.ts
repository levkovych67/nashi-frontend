/** True when `pathname` is the page `to` links to, or one of its sub-pages. The map ('/') matches only itself. */
export function isCurrentPath(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}
