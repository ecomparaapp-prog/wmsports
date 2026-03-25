import { useState, useMemo } from 'react';
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@workspace/api-client-react';
import { resolveImageUrl, driveUrlToImageUrl } from '@/lib/drive';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Pencil, Plus, X, ExternalLink, Image, CheckCircle2, Lock, Search } from 'lucide-react';

const ADMIN_PASSWORD = "wmsports2024";

const CATEGORIES = [
  "BRASILEIRAO", "SHORTS", "ACESSÓRIOS", "INFANTIL", "TREINO",
  "NBA", "ACADEMIA", "NFL", "FÓRMULA 1", "COMPRESSÃO",
  "SELEÇÕES", "CAMPEONATOS"
];

const SIZES_AVAILABLE = ["PP", "P", "M", "G", "GG", "XG", "XGG", "2XL", "3XL", "4XL"];

interface ProductForm {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  imageUrl: string;
  driveUrl: string;
  basePrice: string;
  price3: string;
  price5: string;
  allowPersonalization: boolean;
  active: boolean;
  sortOrder: string;
}

const emptyForm: ProductForm = {
  name: "",
  category: "BRASILEIRAO",
  subcategory: "",
  description: "",
  imageUrl: "",
  driveUrl: "",
  basePrice: "",
  price3: "",
  price5: "",
  allowPersonalization: true,
  active: true,
  sortOrder: "0",
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [driveError, setDriveError] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('TODOS');

  const { data: products, isLoading, refetch } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const filteredAdminProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchSearch = !adminSearch ||
        p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
        (p.subcategory || '').toLowerCase().includes(adminSearch.toLowerCase());
      const matchCat = adminCategoryFilter === 'TODOS' || p.category === adminCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, adminSearch, adminCategoryFilter]);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  }

  function handleDriveUrlChange(url: string) {
    setForm(f => ({ ...f, driveUrl: url }));
    const resolved = resolveImageUrl(url);
    if (resolved) {
      setImagePreview(resolved);
      setDriveError(false);
      setForm(f => ({ ...f, imageUrl: resolved }));
    } else {
      setImagePreview(null);
    }
  }

  function handleDirectImageUrl(url: string) {
    setForm(f => ({ ...f, imageUrl: url }));
    if (url) {
      setImagePreview(url);
      setDriveError(false);
    }
  }

  function startEdit(product: any) {
    setForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      driveUrl: product.driveUrl || "",
      basePrice: String(product.basePrice),
      price3: product.price3 != null ? String(product.price3) : "",
      price5: product.price5 != null ? String(product.price5) : "",
      allowPersonalization: product.allowPersonalization,
      active: product.active,
      sortOrder: String(product.sortOrder),
    });
    setImagePreview(resolveImageUrl(product.imageUrl));
    setEditingId(product.id);
    setShowForm(true);
  }

  function cancelForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImagePreview(null);
    setDriveError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory || null,
      description: form.description,
      imageUrl: form.imageUrl || null,
      driveUrl: form.driveUrl || null,
      basePrice: parseFloat(form.basePrice),
      price3: form.price3 ? parseFloat(form.price3) : null,
      price5: form.price5 ? parseFloat(form.price5) : null,
      allowPersonalization: form.allowPersonalization,
      active: form.active,
      sortOrder: parseInt(form.sortOrder) || 0,
    };

    try {
      if (editingId !== null) {
        await updateProduct.mutateAsync({ id: editingId, data: payload });
      } else {
        await createProduct.mutateAsync({ data: payload });
      }
      cancelForm();
      refetch();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await deleteProduct.mutateAsync({ id });
    refetch();
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin WM Sports</h1>
              <p className="text-sm text-muted-foreground">Área restrita</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Senha</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="Digite a senha..."
                autoFocus
              />
              {passwordError && <p className="text-red-400 text-sm mt-2">Senha incorreta.</p>}
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="WM Sports" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <span className="font-bold text-white">WM Sports</span>
              <span className="text-xs text-muted-foreground ml-2">Admin</span>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Ver site
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Novo Produto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
            <div className="bg-card border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{editingId ? "Editar Produto" : "Novo Produto"}</h2>
                <button onClick={cancelForm} className="text-muted-foreground hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Nome do Produto *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                      placeholder="Ex: Versão Torcedor Brasil 2024" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Categoria *</label>
                    <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Time / Subcategoria</label>
                    <input type="text" value={form.subcategory} onChange={e => setForm(f => ({...f, subcategory: e.target.value.toUpperCase()}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-muted-foreground focus:outline-none focus:border-primary uppercase"
                      placeholder="ex: FLAMENGO, REAL MADRID, BRASIL..." />
                    <p className="text-xs text-muted-foreground mt-1">Usado para filtrar por time na loja</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Ordem de Exibição</label>
                    <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({...f, sortOrder: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      placeholder="0" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Descrição</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
                      rows={2} placeholder="Breve descrição do produto..." />
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl p-4 bg-secondary/30 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                    <Image className="w-4 h-4" /> Imagem do Produto
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Link do Google Drive (compartilhável)</label>
                    <input
                      value={form.driveUrl}
                      onChange={e => handleDriveUrlChange(e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-muted-foreground focus:outline-none focus:border-primary text-sm"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Cole o link "Compartilhar" da imagem no Drive. A URL da imagem será gerada automaticamente.</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-white/10" />ou cole a URL direta da imagem<div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">URL direta da imagem</label>
                    <input
                      value={form.imageUrl}
                      onChange={e => handleDirectImageUrl(e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-muted-foreground focus:outline-none focus:border-primary text-sm"
                      placeholder="https://..."
                    />
                  </div>

                  {imagePreview && (
                    <div className="flex items-start gap-3 mt-2">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0 border border-white/10">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={() => setDriveError(true)}
                          onLoad={() => setDriveError(false)}
                        />
                      </div>
                      <div>
                        {driveError ? (
                          <p className="text-red-400 text-xs">Não foi possível carregar a imagem. Certifique-se que o arquivo está compartilhado como "Qualquer pessoa com o link".</p>
                        ) : (
                          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Imagem carregada com sucesso!
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Para imagens do Drive, compartilhe o arquivo e selecione "Qualquer pessoa com o link pode visualizar".</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Preço Base (R$) *</label>
                    <input required type="number" step="0.01" value={form.basePrice} onChange={e => setForm(f => ({...f, basePrice: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      placeholder="150.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Preço 3+ peças</label>
                    <input type="number" step="0.01" value={form.price3} onChange={e => setForm(f => ({...f, price3: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      placeholder="145.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Preço 5+ peças</label>
                    <input type="number" step="0.01" value={form.price5} onChange={e => setForm(f => ({...f, price5: e.target.value}))}
                      className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                      placeholder="140.00" />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.allowPersonalization} onChange={e => setForm(f => ({...f, allowPersonalization: e.target.checked}))}
                      className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-white/80">Permite personalização (+R$20)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))}
                      className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-white/80">Produto ativo</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={cancelForm}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-colors font-semibold">
                    Cancelar
                  </button>
                  <button type="submit"
                    disabled={createProduct.isPending || updateProduct.isPending}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
                    {editingId ? "Salvar Alterações" : "Adicionar Produto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Catálogo de Produtos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredAdminProducts.length} de {products?.length || 0} produtos
            </p>
          </div>
          <a
            href="https://drive.google.com/drive/folders/11DK2iU4tMSXfpkvxP62hbEiLGO3sxtYA?usp=drive_link"
            target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Abrir Drive
          </a>
        </div>

        {/* Search + filter bar for admin */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              placeholder="Buscar produto por nome, time ou categoria..."
              className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <select
            value={adminCategoryFilter}
            onChange={e => setAdminCategoryFilter(e.target.value)}
            className="bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary min-w-[160px]"
          >
            <option value="TODOS">Todas as categorias</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(adminSearch || adminCategoryFilter !== 'TODOS') && (
            <button
              onClick={() => { setAdminSearch(''); setAdminCategoryFilter('TODOS'); }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
            >
              <X className="w-4 h-4" /> Limpar
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-xl h-64 border border-white/5" />
            ))}
          </div>
        ) : filteredAdminProducts.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Nenhum produto encontrado</p>
            <p className="text-muted-foreground text-sm">Tente outros termos de busca ou filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAdminProducts.map(product => {
              const imgSrc = resolveImageUrl(product.imageUrl);
              return (
                <div key={product.id} className="bg-card border border-white/5 rounded-xl overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="aspect-square bg-secondary/50 relative">
                    {imgSrc ? (
                      <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Image className="w-8 h-8 opacity-30" />
                        <span className="text-xs">Sem imagem</span>
                      </div>
                    )}
                    {!product.active && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-xs bg-red-500/80 text-white px-2 py-1 rounded-full font-semibold">Inativo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-primary font-semibold mb-1">{product.category}</p>
                    {product.subcategory && (
                      <p className="text-xs text-muted-foreground mb-0.5">{product.subcategory}</p>
                    )}
                    <p className="text-sm font-semibold text-white line-clamp-2 mb-2">{product.name}</p>
                    <p className="text-xs font-bold text-white mb-3">{formatCurrency(product.basePrice)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-white text-xs font-medium transition-colors">
                        <Pencil className="w-3 h-3" /> Editar
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 bg-card border border-primary/20 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" /> Como adicionar imagens do Google Drive
          </h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>No Google Drive, clique com o botão direito na imagem da camisa</li>
            <li>Selecione <strong className="text-white">"Compartilhar"</strong></li>
            <li>Mude para <strong className="text-white">"Qualquer pessoa com o link"</strong> e clique em Concluído</li>
            <li>Clique em <strong className="text-white">"Copiar link"</strong></li>
            <li>Cole no campo <strong className="text-white">"Link do Google Drive"</strong> ao criar/editar produto</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
