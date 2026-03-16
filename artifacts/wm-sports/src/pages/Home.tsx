import { useListProducts } from '@workspace/api-client-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/product/ProductCard';
import { FALLBACK_PRODUCTS } from '@/lib/constants';
import { ExternalLink, Zap, Medal, Star } from 'lucide-react';

export default function Home() {
  const { data: products, isLoading, error } = useListProducts();

  // Use DB products if available and not empty, otherwise fallback
  const displayProducts = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-stadium.png`} 
            alt="Stadium Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Tailandesas 1.1 Direto da Fábrica
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
              VISTA A CAMISA DO SEU <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">TIME DO CORAÇÃO</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-light">
              Qualidade premium, personalização oficial e os melhores preços. Compre 3 ou mais peças e garanta descontos exclusivos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#produtos"
                className="px-8 py-4 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.3)] text-center"
              >
                Ver Destaques
              </a>
              <a 
                href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link" 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                Catálogo Completo Drive <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="border-y border-white/5 bg-secondary/30 relative">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern-bg.png)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-medium text-white/80">
            <div className="flex items-center gap-2"><Medal className="text-primary w-5 h-5"/> Qualidade Tailandesa 1.1</div>
            <div className="flex items-center gap-2"><Star className="text-primary w-5 h-5"/> Desconto Progressivo (3+ ou 5+)</div>
            <div className="flex items-center gap-2"><Zap className="text-primary w-5 h-5"/> Personalização Oficial (+R$20)</div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="produtos" className="py-24 relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern-bg.png)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Destaques da Loja</h2>
              <p className="text-muted-foreground">As camisas mais procuradas do momento</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="animate-pulse bg-card border border-white/5 rounded-2xl h-[400px]" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-destructive/10 border border-destructive/20 rounded-2xl">
              <p className="text-destructive font-bold text-lg">Erro ao carregar produtos.</p>
              <p className="text-muted-foreground">Tente recarregar a página.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <a 
              href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-secondary border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1 group"
            >
              Ver Todas as Categorias no Drive
              <ExternalLink className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
