import { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Menu, X, ExternalLink, ChevronRight, LogOut, User, UserCircle, Flame, Sparkles, Trophy } from 'lucide-react';
import { useCart } from '@/store/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { AnimatePresence, motion } from 'framer-motion';
import { useCatalogFilter } from '@/store/use-catalog-filter';

const NAV_LINKS = [
  { label: 'Mais Buscados', href: '#catalogo', filter: 'MAIS_BUSCADOS', Icon: Flame },
  { label: 'Novidades', href: '#catalogo', filter: 'NOVIDADES', Icon: Sparkles },
  { label: 'Brasileirão', href: '#catalogo', filter: 'BRASILEIRAO', Icon: Trophy },
];

export function Navbar() {
  const { items, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { setNavFilter } = useCatalogFilter();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (filter: string) => {
    setMenuOpen(false);
    setNavFilter(filter);
    setTimeout(() => {
      const el = document.getElementById('catalogo');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}logo.jpeg`}
                  alt="WM Sports Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-wider text-white leading-none">WM SPORTS</span>
                <span className="text-[9px] uppercase tracking-widest text-primary font-semibold">Vista a camisa</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <button
                  key={link.filter}
                  onClick={() => handleNavClick(link.filter)}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-primary transition-colors"
                >
                  <link.Icon className="w-3.5 h-3.5" />
                  {link.label}
                </button>
              ))}
              <a
                href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-white/70 hover:text-primary transition-colors flex items-center gap-1"
              >
                Catálogo Drive <ExternalLink className="w-3 h-3" />
              </a>
            </nav>

            <div className="flex items-center gap-1">
              {/* Cart */}
              <button onClick={openDrawer} className="relative p-2.5 text-white hover:text-primary transition-colors" aria-label="Abrir carrinho">
                <ShoppingBag className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* User — desktop */}
              {user ? (
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-white/80 max-w-[100px] truncate">{firstName}</span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-card border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                          <div className="p-4 border-b border-white/10">
                            <p className="font-semibold text-white text-sm truncate">{user.name}</p>
                            {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                          </div>
                          <div className="py-1">
                            <Link
                              href="/profile"
                              onClick={() => setProfileOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <UserCircle className="w-4 h-4" /> Meu Perfil
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Sair
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/profile"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-all"
                >
                  <User className="w-4 h-4" />
                  Meu Perfil
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden p-2.5 text-white hover:text-primary transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-72 bg-card border-l border-white/10 z-40 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <span className="font-bold text-white">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* User — mobile */}
              {user ? (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{user.name}</p>
                    {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                  </div>
                </div>
              ) : (
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 border-b border-white/10 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors"
                >
                  <User className="w-5 h-5 text-primary" />
                  Criar Perfil
                </Link>
              )}

              <nav className="flex-1 py-4 overflow-y-auto">
                {NAV_LINKS.map(link => (
                  <button
                    key={link.filter}
                    onClick={() => handleNavClick(link.filter)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-white/80 hover:text-primary hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <link.Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </button>
                ))}
                <div className="h-px bg-white/10 mx-5 my-3" />
                <a
                  href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-white/80 hover:text-primary hover:bg-white/5 transition-colors text-sm font-medium"
                >
                  Catálogo Completo (Drive)
                  <ExternalLink className="w-4 h-4 opacity-40" />
                </a>
                {user && (
                  <>
                    <div className="h-px bg-white/10 mx-5 my-3" />
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-white/80 hover:text-primary hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      Meu Perfil <UserCircle className="w-4 h-4 opacity-40" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                    >
                      Sair <LogOut className="w-4 h-4 opacity-60" />
                    </button>
                  </>
                )}
              </nav>

              <div className="p-5 border-t border-white/10">
                <button
                  onClick={() => { openDrawer(); setMenuOpen(false); }}
                  className="w-full py-3 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver Carrinho {itemCount > 0 && `(${itemCount})`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
