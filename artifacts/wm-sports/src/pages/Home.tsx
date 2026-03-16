import { useState, useMemo } from 'react';
import { useListProducts } from '@workspace/api-client-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { FALLBACK_PRODUCTS } from '@/lib/constants';
import {
  ExternalLink, Zap, Medal, Star, Search, X, SlidersHorizontal,
  Truck, ShieldCheck, Clock, LayoutGrid, Shirt, CircleDot,
  Shield, Gauge, Tag, Baby, Dumbbell, Layers, Globe, Trophy, Activity,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryMeta {
  label: string;
  Icon: LucideIcon;
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  'CAMISAS':     { label: 'Camisas',     Icon: Shirt },
  'NBA':         { label: 'NBA',         Icon: CircleDot },
  'NFL':         { label: 'NFL',         Icon: Shield },
  'FÓRMULA 1':  { label: 'Fórmula 1',   Icon: Gauge },
  'SHORTS':      { label: 'Shorts',      Icon: Activity },
  'ACESSÓRIOS':  { label: 'Acessórios',  Icon: Tag },
  'INFANTIL':    { label: 'Infantil',    Icon: Baby },
  'TREINO':      { label: 'Treino',      Icon: Dumbbell },
  'ACADEMIA':    { label: 'Academia',    Icon: Dumbbell },
  'COMPRESSÃO':  { label: 'Compressão',  Icon: Layers },
  'SELEÇÕES':    { label: 'Seleções',    Icon: Globe },
  'CAMPEONATOS': { label: 'Campeonatos', Icon: Trophy },
};

export default function Home() {
  const { data: apiProducts, isLoading, error } = useListProducts();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('TODOS');

  const allProducts = useMemo(() =>
    apiProducts && apiProducts.length > 0 ? apiProducts : FALLBACK_PRODUCTS,
    [apiProducts]
  );

  const categories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category));
    return ['TODOS', ...Array.from(cats)];
  }, [allProducts]);

  const subcategories = useMemo(() => {
    if (activeCategory === 'TODOS') return [];
    const subs = new Set(
      allProducts
        .filter(p => p.category === activeCategory && p.subcategory)
        .map(p => p.subcategory as string)
    );
    return Array.from(subs).sort();
  }, [allProducts, activeCategory]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchCat = activeCategory === 'TODOS' || p.category === activeCategory;
      const matchSub = activeSubcategory === 'TODOS' || p.subcategory === activeSubcategory;
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.subcategory || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSub && matchSearch;
    });
  }, [allProducts, activeCategory, activeSubcategory, search]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory('TODOS');
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.12)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(34,197,94,0.06)_0%,_transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              Tailandesas 1.1 · Direto da Fábrica
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] mb-6">
              VISTA A CAMISA DO SEU{' '}
              <span className="text-primary">TIME DO CORAÇÃO</span>
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed">
              Qualidade premium, personalização oficial e os melhores preços.
              Compre 3+ peças e garanta descontos exclusivos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl font-bold text-black bg-primary hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(34,197,94,0.25)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)] text-center"
              >
                Ver Catálogo
              </button>
              <a
                href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-2xl font-bold text-white bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25 transition-all flex items-center justify-center gap-2"
              >
                Catálogo Drive <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="absolute bottom-8 right-8 hidden xl:flex flex-col gap-3">
          {[
            { icon: <Truck className="w-4 h-4" />, text: 'Frete Grátis em 5+ peças' },
            { icon: <ShieldCheck className="w-4 h-4" />, text: 'Taxação por nossa conta' },
            { icon: <Clock className="w-4 h-4" />, text: 'Entrega 20-30 dias' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-card/80 backdrop-blur-sm border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/70">
              <span className="text-primary">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* Quick features bar */}
      <div className="border-y border-white/5 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-white/60">
            <span className="flex items-center gap-2"><Medal className="w-4 h-4 text-primary" /> Qualidade Tailandesa 1.1</span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> Desconto progressivo (3+ ou 5+)</span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Personalização +R$20</span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Frete grátis em 5+ peças</span>
          </div>
        </div>
      </div>

      {/* Catalog section */}
      <section id="catalogo" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Catálogo Completo</h2>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} produtos encontrados</p>
          </div>

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar camisa, time, categoria..."
                className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-white/10 rounded-xl px-3 py-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none -mx-1 px-1" id="camisas">
            {categories.map(cat => {
              const meta = CATEGORY_MAP[cat];
              const Icon = meta?.Icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 border",
                    isActive
                      ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                      : "bg-card border-white/10 text-white/70 hover:text-white hover:border-white/25"
                  )}
                >
                  {cat === 'TODOS'
                    ? <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                    : Icon && <Icon className="w-3.5 h-3.5 shrink-0" />
                  }
                  {cat === 'TODOS' ? 'Todos' : (meta?.label || cat)}
                </button>
              );
            })}
          </div>

          {/* Subcategory pills (teams) */}
          {subcategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none -mx-1 px-1">
              <button
                onClick={() => setActiveSubcategory('TODOS')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 border",
                  activeSubcategory === 'TODOS'
                    ? "bg-white/15 border-white/30 text-white"
                    : "bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                )}
              >
                Todos os times
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 border",
                    activeSubcategory === sub
                      ? "bg-white/15 border-white/30 text-white"
                      : "bg-transparent border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-card border border-white/5 rounded-2xl aspect-[3/4]" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-destructive/10 border border-destructive/20 rounded-2xl">
              <p className="text-destructive font-bold text-lg mb-1">Erro ao carregar produtos.</p>
              <p className="text-muted-foreground text-sm">Tente recarregar a página.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-white font-semibold mb-1">Nenhum produto encontrado</p>
              <p className="text-muted-foreground text-sm mb-4">Tente outros filtros ou termos de busca</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('TODOS'); setActiveSubcategory('TODOS'); }}
                className="text-primary hover:underline text-sm font-medium"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" id="nba">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Anchor divs for nav scroll */}
          <div id="outros" className="h-0" />
          <div id="infantil" className="h-0" />

          <div className="mt-12 flex items-center justify-center">
            <a
              href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-card border border-white/10 hover:border-primary/40 transition-all hover:-translate-y-0.5 text-sm"
            >
              Ver todas as categorias no Drive
              <ExternalLink className="w-4 h-4 text-primary" />
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
