import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/use-auth';
import { User, MapPin, Phone, LogOut, Save, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, loading, logout, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await updateProfile({ fullName, address, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <User className="w-10 h-10 text-white/30" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-2">Faça login para acessar seu perfil</h2>
            <p className="text-muted-foreground text-sm mb-6">Salve seus dados de entrega e facilite seus pedidos futuros.</p>
          </div>
          <a
            href="/api/auth/google"
            className="flex items-center gap-3 px-6 py-3.5 bg-white text-gray-800 font-semibold rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </a>
          <Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar à loja
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black text-white">Meu Perfil</h1>
        </div>

        {/* Google account info */}
        <div className="bg-card border border-white/10 rounded-2xl p-6 mb-6 flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-primary/40 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Conta Google
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Delivery info form */}
        <div className="bg-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white text-lg mb-1">Dados de Entrega</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Estes dados serão incluídos automaticamente nos seus pedidos via WhatsApp.
          </p>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white/80 mb-1.5">
                <User className="w-3.5 h-3.5" /> Nome para entrega
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="Nome completo para receber o pedido"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white/80 mb-1.5">
                <MapPin className="w-3.5 h-3.5" /> Endereço completo
              </label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                placeholder="Rua, número, complemento, bairro, cidade – CEP"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white/80 mb-1.5">
                <Phone className="w-3.5 h-3.5" /> Telefone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="(61) 99999-9999"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Dados salvos com sucesso!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Dados'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
