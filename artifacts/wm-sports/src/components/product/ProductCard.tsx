import { useState } from 'react';
import { ShoppingCart, ZoomIn, X } from 'lucide-react';
import type { Product } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/drive';
import { AddToCartDialog } from './AddToCartDialog';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
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
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
              loading="lazy"
              onClick={() => setIsZoomOpen(true)}
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

          {/* Zoom button */}
          {resolvedImage && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsZoomOpen(true); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              aria-label="Ver foto ampliada"
            >
              <ZoomIn className="w-3.5 h-3.5 text-white" />
            </button>
          )}

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

      {/* Image Zoom Lightbox */}
      <AnimatePresence>
        {isZoomOpen && resolvedImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomOpen(false)}
              className="absolute inset-0 bg-black/92 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 flex flex-col items-center gap-4 max-w-4xl w-full"
            >
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors z-20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={resolvedImage}
                  alt={product.name}
                  className="w-full h-auto max-h-[80vh] object-contain bg-secondary"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">{product.category}</p>
                <p className="font-bold text-white text-lg mt-1">{product.name}</p>
              </div>
              <button
                onClick={() => { setIsZoomOpen(false); setIsDialogOpen(true); }}
                className="px-8 py-3 bg-primary font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all"
                style={{ color: '#000' }}
              >
                <ShoppingCart className="w-4 h-4" />
                Comprar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
