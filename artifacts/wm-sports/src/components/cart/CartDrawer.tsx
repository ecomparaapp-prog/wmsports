import { useCart, calculateItemUnitPrice, calculateCartTotal } from '@/store/use-cart';
import { formatCurrency } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, clearCart } = useCart();

  const total = calculateCartTotal(items);

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = `*NOVO PEDIDO - WM SPORTS*\n\n`;
    
    items.forEach((item, index) => {
      const unitPrice = calculateItemUnitPrice(item);
      message += `*Item ${index + 1}:* ${item.name}\n`;
      message += `Tamanho: ${item.size}\n`;
      message += `Qtd: ${item.quantity}x (${formatCurrency(unitPrice)} un.)\n`;
      
      if (item.personalization) {
        message += `Personalização: ${item.personalization.name} - ${item.personalization.number}\n`;
      } else if (item.category !== 'SHORTS DE FUTEBOL' && item.category !== 'MEIAS ANTIDERRAPANTES') {
        message += `Sem personalização\n`;
      }
      
      message += `Subtotal: ${formatCurrency(unitPrice * item.quantity)}\n\n`;
    });

    message += `*Total do Pedido: ${formatCurrency(total)}*\n`;
    message += `_Frete Grátis em pedidos com 5+ peças!_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    
    // Optional: clear cart after checkout
    // clearCart();
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Seu Carrinho
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <button 
                    onClick={closeDrawer}
                    className="mt-4 text-primary hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 bg-background p-4 rounded-xl border border-white/5 relative group">
                    <div className="w-20 h-24 bg-secondary rounded-lg overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem img</div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight text-white/90 line-clamp-2">{item.name}</h4>
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <p>Tamanho: <span className="text-white">{item.size}</span></p>
                          {item.personalization && (
                            <p className="text-primary">
                              {item.personalization.name} ({item.personalization.number})
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-secondary rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-bold text-primary">
                          {formatCurrency(calculateItemUnitPrice(item) * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="absolute -top-2 -right-2 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/80"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-background/50">
                <div className="flex justify-between items-center mb-4 text-lg">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-display font-bold text-2xl text-white">{formatCurrency(total)}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar no WhatsApp
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  O pagamento e envio serão combinados via WhatsApp.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
