import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, Info } from 'lucide-react';
import { SIZES, getSizeSurcharge, PERSONALIZATION_PRICE } from '@/lib/constants';
import { useCart } from '@/store/use-cart';
import { formatCurrency, cn } from '@/lib/utils';
import type { Product } from '@workspace/api-client-react';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToCartDialog({ product, isOpen, onClose }: Props) {
  const [size, setSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [wantsPersonalization, setWantsPersonalization] = useState(false);
  const [persName, setPersName] = useState('');
  const [persNumber, setPersNumber] = useState('');
  const [error, setError] = useState('');

  const { addItem } = useCart();

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSize('');
      setQuantity(1);
      setWantsPersonalization(false);
      setPersName('');
      setPersNumber('');
      setError('');
    }
  }, [isOpen]);

  const calculatePreviewPrice = () => {
    let base = product.basePrice;
    if (quantity >= 5 && product.price5) base = product.price5;
    else if (quantity >= 3 && product.price3) base = product.price3;
    
    const sizeExtra = size ? getSizeSurcharge(size) : 0;
    const persExtra = wantsPersonalization ? PERSONALIZATION_PRICE : 0;
    
    return (base + sizeExtra + persExtra) * quantity;
  };

  const handleAddToCart = () => {
    if (!size) {
      setError('Por favor, selecione um tamanho.');
      return;
    }
    if (wantsPersonalization && (!persName || !persNumber)) {
      setError('Preencha o nome e número da personalização.');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      category: product.category,
      basePrice: product.basePrice,
      price3: product.price3,
      price5: product.price5,
      size,
      quantity,
      imageUrl: product.imageUrl,
      personalization: wantsPersonalization ? { name: persName, number: persNumber } : null,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-display font-bold text-white pr-8">{product.name}</h3>
                <p className="text-sm text-primary mt-1">{product.category}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors absolute top-4 right-4">
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-white/90">Selecione o Tamanho</label>
                  {error && !size && <span className="text-xs text-destructive flex items-center gap-1"><Info className="w-3 h-3"/> Obrigatório</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => {
                    const surcharge = getSizeSurcharge(s);
                    return (
                      <button
                        key={s}
                        onClick={() => { setSize(s); setError(''); }}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-all text-sm font-medium",
                          size === s 
                            ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                            : "bg-background border-white/10 text-white/70 hover:border-white/30 hover:bg-white/5"
                        )}
                      >
                        {s} {surcharge > 0 && <span className="opacity-70 text-xs ml-1">(+{surcharge})</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Personalization */}
              {product.allowPersonalization && (
                <div className="bg-background/50 rounded-xl border border-white/5 p-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn(
                      "w-6 h-6 rounded border flex items-center justify-center transition-colors",
                      wantsPersonalization ? "bg-primary border-primary text-primary-foreground" : "bg-card border-white/20 group-hover:border-primary/50"
                    )}>
                      {wantsPersonalization && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-semibold text-white/90 block">Personalização (+R$ 20,00)</span>
                      <span className="text-xs text-muted-foreground">Adicione nome e número à sua camisa</span>
                    </div>
                  </label>

                  <AnimatePresence>
                    {wantsPersonalization && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2 space-y-1">
                            <label className="text-xs text-muted-foreground">Nome (ex: NEYMAR JR)</label>
                            <input 
                              type="text" 
                              value={persName}
                              onChange={e => { setPersName(e.target.value.toUpperCase()); setError(''); }}
                              className="w-full bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase"
                              placeholder="NOME"
                              maxLength={15}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Número</label>
                            <input 
                              type="text" 
                              value={persNumber}
                              onChange={e => { setPersNumber(e.target.value.replace(/\D/g,'')); setError(''); }}
                              className="w-full bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center"
                              placeholder="10"
                              maxLength={2}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-sm font-semibold text-white/90 block mb-3">Quantidade</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-background rounded-lg border border-white/10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-white/70 hover:text-primary transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-white/70 hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {product.price3 && <p>Levando 3+: <span className="text-primary font-medium">R$ {product.price3}</span>/cada</p>}
                    {product.price5 && <p>Levando 5+: <span className="text-primary font-medium">R$ {product.price5}</span>/cada</p>}
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-background/50 flex items-center justify-between gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Calculado</p>
                <p className="font-display font-bold text-2xl text-white">
                  {formatCurrency(calculatePreviewPrice())}
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
