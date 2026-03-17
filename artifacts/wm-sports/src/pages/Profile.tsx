import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth, type AuthUser } from '@/hooks/use-auth';
import { User, MapPin, Phone, Mail, LogOut, Save, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, login, logout, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Nome é obrigatório.'); return; }
    setSaving(true);
    const data: AuthUser = { name: name.trim(), email: email.trim(), address: address.trim(), phone: phone.trim() };
    if (user) {
      updateProfile(data);
    } else {
      login(data);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    setName(''); setEmail(''); setAddress(''); setPhone('');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-black text-white">Meu Perfil</h1>
        </div>

        {/* Logged-in header */}
        {user && (
          <div className="bg-card border border-white/10 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{user.name}</p>
              {user.email && <p className="text-sm text-muted-foreground truncate">{user.email}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        )}

        {/* Form */}
        <div className="bg-card border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white text-lg mb-1">
            {user ? 'Dados de Entrega' : 'Preencha seus dados'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Estes dados serão incluídos automaticamente nos seus pedidos via WhatsApp.
          </p>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white/80 mb-1.5">
                <User className="w-3.5 h-3.5" /> Nome completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                required
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white/80 mb-1.5">
                <Mail className="w-3.5 h-3.5" /> E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="seu@email.com"
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

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {user ? 'Dados atualizados com sucesso!' : 'Perfil criado! Seus dados serão incluídos nos pedidos.'}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : user ? 'Salvar Dados' : 'Criar Perfil'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
