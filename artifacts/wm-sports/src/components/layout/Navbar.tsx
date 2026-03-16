import { useState } from 'react';
import { Link } from 'wouter';
import { ShoppingBag, Menu, X, ExternalLink, ChevronRight } from 'lucide-react';
import { useCart } from '@/store/use-cart';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Camisas de Futebol', href: '#camisas' },
  { label: 'NBA', href: '#nba' },
  { label: 'Shorts & Acessórios', href: '#outros' },
  { label: 'Infantil', href: '#infantil' },
];

export function Navbar() {
  const { items, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium text-white/70 hover:text-primary transition-colors"
                >
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

            <div className="flex items-center gap-2">
              <button
                onClick={openDrawer}
                className="relative p-2.5 text-white hover:text-primary transition-colors"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden p-2.5 text-white hover:text-primary transition-colors"
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
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
              <nav className="flex-1 py-4">
                {NAV_LINKS.map(link => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-white/80 hover:text-primary hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    {link.label}
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
