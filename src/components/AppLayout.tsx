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
      <header className="sticky top-0 z-10 border-b-4 border-black bg-[var(--card)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="font-display text-xl font-black text-black">
            HUST Quiz
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `border-2 border-black px-3 py-1 font-bold shadow-[2px_2px_0_var(--shadow)] ${isActive ? 'bg-[var(--accent)] text-black' : 'bg-[var(--accent-soft)] text-black'}`
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
