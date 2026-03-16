import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, Info, Minus, Plus } from 'lucide-react';
import { SIZES, getSizeSurcharge, PERSONALIZATION_PRICE } from '@/lib/constants';
import { useCart } from '@/store/use-cart';
import { formatCurrency, cn } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/drive';
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
  const resolvedImage = resolveImageUrl(product.imageUrl);

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

  const getUnitPrice = () => {
    let base = product.basePrice;
    if (quantity >= 5 && product.price5) base = product.price5;
    else if (quantity >= 3 && product.price3) base = product.price3;
    const sizeExtra = size ? getSizeSurcharge(size) : 0;
    const persExtra = wantsPersonalization ? PERSONALIZATION_PRICE : 0;
    return base + sizeExtra + persExtra;
  };

  const handleAddToCart = () => {
    if (!size) { setError('Por favor, selecione um tamanho.'); return; }
    if (wantsPersonalization && (!persName.trim() || !persNumber.trim())) {
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
      imageUrl: resolvedImage,
      personalization: wantsPersonalization ? { name: persName.toUpperCase(), number: persNumber } : null,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-card border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col"
          >
            {/* Handle bar for mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex gap-4 p-5 border-b border-white/10">
              {resolvedImage && (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                  <img src={resolvedImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-bold text-white leading-tight line-clamp-2">{product.name}</h3>
                {product.subcategory && (
                  <p className="text-xs text-muted-foreground mt-1">{product.subcategory}</p>
                )}
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors self-start shrink-0">
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Size */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-white">Tamanho</label>
                  {error && !size && <span className="text-xs text-red-400 flex items-center gap-1"><Info className="w-3 h-3" /> Obrigatório</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => {
                    const surcharge = getSizeSurcharge(s);
                    return (
                      <button
                        key={s}
                        onClick={() => { setSize(s); setError(''); }}
                        className={cn(
                          "px-3.5 py-2 rounded-xl border transition-all text-sm font-semibold",
                          size === s
                            ? "bg-primary border-primary text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                            : "bg-background border-white/10 text-white/70 hover:border-primary/50 hover:text-white"
                        )}
                      >
                        {s}
                        {surcharge > 0 && <span className="text-[10px] ml-1 opacity-70">+R${surcharge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-semibold text-white block mb-3">Quantidade</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-background rounded-xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-primary hover:bg-white/5 transition-colors disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-white text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-primary hover:bg-white/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {product.price3 && <p>3+ peças: <span className="text-primary font-semibold">{formatCurrency(product.price3)}</span>/un</p>}
                    {product.price5 && <p>5+ peças: <span className="text-primary font-semibold">{formatCurrency(product.price5)}</span>/un</p>}
                  </div>
                </div>
              </div>

              {/* Personalization */}
              {product.allowPersonalization && (
                <div className={cn(
                  "rounded-xl border transition-colors",
                  wantsPersonalization ? "border-primary/40 bg-primary/5" : "border-white/10 bg-background/40"
                )}>
                  <button
                    type="button"
                    onClick={() => setWantsPersonalization(v => !v)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                      wantsPersonalization ? "bg-primary border-primary" : "border-white/30"
                    )}>
                      {wantsPersonalization && <Check className="w-4 h-4 text-black" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Personalização</p>
                      <p className="text-xs text-muted-foreground">Nome + número na camisa (+R$ 20,00)</p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {wantsPersonalization && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <label className="text-xs text-muted-foreground block mb-1">Nome (ex: NEYMAR JR)</label>
                            <input
                              type="text"
                              value={persName}
                              onChange={e => { setPersName(e.target.value.toUpperCase()); setError(''); }}
                              className="w-full bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary uppercase"
                              placeholder="NOME"
                              maxLength={15}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">Número</label>
                            <input
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={persNumber}
                              onChange={e => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                                setPersNumber(digits);
                                setError('');
                              }}
                              className="w-full bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary text-center font-bold"
                              placeholder="10"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-white/10 bg-background/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold text-2xl text-white">{formatCurrency(getUnitPrice() * quantity)}</p>
                </div>
                {quantity >= 3 && (product.price3 || product.price5) && (
                  <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-semibold">
                    Desconto aplicado!
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-[0.98] text-base"
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
