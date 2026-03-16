import { Link } from 'wouter';
import { ShoppingBag, Menu, ExternalLink } from 'lucide-react';
import { useCart } from '@/store/use-cart';

export function Navbar() {
  const { items, openDrawer } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full glass border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
                <img 
                  src={`${import.meta.env.BASE_URL}logo.jpeg`} 
                  alt="WM Sports Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-wider text-white">WM SPORTS</span>
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Vista a camisa</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white/80 hover:text-primary transition-colors">Início</Link>
            <a 
              href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors flex items-center gap-1"
            >
              Catálogo Completo <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={openDrawer}
              className="relative p-2 text-white hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                  {itemCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
