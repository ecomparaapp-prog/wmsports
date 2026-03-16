import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/drive';
import { AddToCartDialog } from './AddToCartDialog';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const resolvedImage = resolveImageUrl(product.imageUrl);

  return (
    <>
      <div className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)] flex flex-col h-full">
        {/* Image Area */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          {resolvedImage ? (
            <img 
              src={resolvedImage} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
              Sem Imagem
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Hover Overlay Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Comprar
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
          
          <div className="pt-4 border-t border-white/5 mt-auto flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">A partir de</p>
              <p className="font-display font-bold text-2xl text-white">
                {formatCurrency(product.basePrice)}
              </p>
            </div>
            
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors lg:hidden"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AddToCartDialog 
        product={product} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
}
