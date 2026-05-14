import { Link, NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/library', label: 'Library' },
  { to: '/import', label: 'Import' },
  { to: '/review', label: 'Review' },
  { to: '/settings', label: 'Settings' }
];

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-[var(--card)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-display text-xl font-bold text-[var(--accent)]">
            HUST Quiz
          </Link>
          <nav className="flex gap-2 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 ${isActive ? 'bg-[var(--accent)] text-white' : 'bg-[var(--accent-soft)] text-[var(--ink)]'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
