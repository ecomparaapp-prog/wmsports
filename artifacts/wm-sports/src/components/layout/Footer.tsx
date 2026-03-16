import { Truck, Clock, ShieldCheck, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-white/5">
            <Truck className="w-10 h-10 text-primary mb-4" />
            <h4 className="font-bold text-white mb-2">Frete Grátis</h4>
            <p className="text-sm text-muted-foreground">Para todo o Brasil em pedidos com 5 ou mais peças.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-white/5">
            <Clock className="w-10 h-10 text-primary mb-4" />
            <h4 className="font-bold text-white mb-2">Prazos</h4>
            <p className="text-sm text-muted-foreground">Fabricação 2 a 5 dias úteis. Entrega 20 a 30 dias.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-white/5">
            <ShieldCheck className="w-10 h-10 text-primary mb-4" />
            <h4 className="font-bold text-white mb-2">Garantia contra Taxas</h4>
            <p className="text-sm text-muted-foreground">Em caso de taxação na alfândega, o valor é por nossa conta!</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-background/50 rounded-2xl border border-white/5">
            <CreditCard className="w-10 h-10 text-primary mb-4" />
            <h4 className="font-bold text-white mb-2">Pagamento Seguro</h4>
            <p className="text-sm text-muted-foreground">Checkout direto via WhatsApp com opções seguras.</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full overflow-hidden grayscale opacity-70">
                <img src={`${import.meta.env.BASE_URL}logo.jpeg`} alt="Logo" className="w-full h-full object-cover" />
              </div>
            <span className="font-display font-bold text-white/50">WM SPORTS</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} WM Sports. Tailandesas 1.1 diretamente da fábrica.
          </p>
        </div>
      </div>
    </footer>
  );
}
