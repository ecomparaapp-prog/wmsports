import { useCart, calculateItemUnitPrice, calculateCartTotal, getCartTotalItems } from '@/store/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, User, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity } = useCart();
  const { user } = useAuth();
  const total = calculateCartTotal(items);
  const totalItems = getCartTotalItems(items);

  const missingProfile = user && (!user.address);

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = `*NOVO PEDIDO - WM SPORTS*\n\n`;

    if (user) {
      message += `*Cliente:* ${user.name}\n`;
      if (user.email) message += `*Email:* ${user.email}\n`;
      if (user.phone) message += `*Telefone:* ${user.phone}\n`;
      if (user.address) message += `*Endereço:* ${user.address}\n`;
      message += `\n`;
    }

    items.forEach((item, index) => {
      const unitPrice = calculateItemUnitPrice(item, totalItems);
      message += `*Item ${index + 1}:* ${item.name}\n`;
      message += `Tamanho: ${item.size}\n`;
      message += `Qtd: ${item.quantity}x (${formatCurrency(unitPrice)} un.)\n`;

      if (item.personalization) {
        message += `Personalização: ${item.personalization.name} #${item.personalization.number}\n`;
      } else {
        message += `Sem personalização\n`;
      }

      if (item.sponsors) {
        message += `Todos os patrocínios: Sim (+R$ 35,00)\n`;
      }

      message += `Subtotal: ${formatCurrency(unitPrice * item.quantity)}\n\n`;
    });

    message += `*Total do Pedido: ${formatCurrency(total)}*\n`;
    message += `_Frete Grátis em pedidos com 5+ peças!_`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
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
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Seu Carrinho
                {totalItems > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({totalItems} peça{totalItems !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Discount banner */}
            {totalItems > 0 && totalItems < 3 && (
              <div className="mx-4 mt-3 flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-medium">
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                Adicione {3 - totalItems} peça{3 - totalItems > 1 ? 's' : ''} para ganhar desconto!
              </div>
            )}
            {totalItems >= 3 && totalItems < 5 && (
              <div className="mx-4 mt-3 flex items-center gap-2 p-3 bg-primary/15 border border-primary/30 rounded-xl text-xs text-primary font-semibold">
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                Desconto de 3+ peças ativo! Adicione {5 - totalItems} mais para desconto maior.
              </div>
            )}
            {totalItems >= 5 && (
              <div className="mx-4 mt-3 flex items-center gap-2 p-3 bg-primary/20 border border-primary/40 rounded-xl text-xs text-black font-bold bg-primary">
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                Desconto máximo de 5+ peças ativo! 🎉
              </div>
            )}

            {/* Profile banner */}
            {!user ? (
              <div className="mx-4 mt-3 flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                <User className="w-4 h-4 text-white/40 shrink-0" />
                <p className="text-white/60 text-xs flex-1">
                  <Link href="/profile" onClick={closeDrawer} className="text-primary font-semibold hover:underline">
                    Crie seu perfil
                  </Link>
                  {' '}para incluir nome e endereço automaticamente no pedido.
                </p>
              </div>
            ) : missingProfile ? (
              <div className="mx-4 mt-3 flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                <p className="text-white/70 text-xs flex-1">
                  <Link href="/profile" onClick={closeDrawer} className="text-yellow-400 font-semibold hover:underline">
                    Adicione seu endereço
                  </Link>
                  {' '}para facilitar a entrega.
                </p>
              </div>
            ) : (
              <div className="mx-4 mt-3 flex items-center gap-3 p-3 bg-primary/5 border border-primary/15 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.address}</p>
                </div>
                <Link href="/profile" onClick={closeDrawer} className="text-xs text-primary hover:underline shrink-0">Editar</Link>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 mt-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <button onClick={closeDrawer} className="mt-4 text-primary hover:underline">
                    Continuar comprando
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const unitPrice = calculateItemUnitPrice(item, totalItems);
                  return (
                    <div key={item.cartItemId} className="flex gap-3 bg-background p-4 rounded-xl border border-white/5">
                      <div className="w-20 h-24 bg-secondary rounded-lg overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem img</div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm leading-tight text-white/90 line-clamp-2">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            aria-label="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <p>Tamanho: <span className="text-white">{item.size}</span></p>
                          {item.personalization && (
                            <p className="text-primary font-medium">
                              {item.personalization.name} #{item.personalization.number}
                            </p>
                          )}
                          {item.sponsors && (
                            <p className="text-primary font-medium">Com todos os patrocínios</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1">
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
                            {formatCurrency(unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-background/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-2xl text-white">{formatCurrency(total)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold text-black bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar no WhatsApp
                </button>
                <p className="text-xs text-center text-muted-foreground mt-3">
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
