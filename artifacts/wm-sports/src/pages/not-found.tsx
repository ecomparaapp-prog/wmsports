import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center p-8 glass-card rounded-3xl max-w-md w-full border border-white/10">
          <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">404</h1>
          <p className="text-lg text-muted-foreground mb-8">
            A página que você está procurando não foi encontrada.
          </p>
          <Link 
            href="/"
            className="inline-flex px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
