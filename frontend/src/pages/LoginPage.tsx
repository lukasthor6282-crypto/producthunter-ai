import { ArrowLeft, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import type { PageKey } from "../components/layout/Sidebar";

type LoginPageProps = {
  googleClientId?: string | null;
  isConfigLoading: boolean;
  isGoogleConfigured: boolean;
  isLoggingIn: boolean;
  error: string | null;
  onGoogleCredential: (credential: string) => Promise<void>;
  onNavigate: (page: PageKey) => void;
};

export function LoginPage({
  googleClientId,
  isConfigLoading,
  isGoogleConfigured,
  isLoggingIn,
  error,
  onGoogleCredential,
  onNavigate,
}: LoginPageProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCredential = useCallback(
    async (credential: string) => {
      setLocalError(null);
      await onGoogleCredential(credential);
    },
    [onGoogleCredential],
  );

  return (
    <div className="landing-root relative min-h-screen overflow-hidden bg-[#07090d] px-4 py-4 text-white sm:px-5 sm:py-6">
      <div className="landing-dot-grid" />
      <div className="landing-orb landing-orb-a" />
      <div className="landing-orb landing-orb-b" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(circle_at_50%_0%,rgba(98,230,255,0.2),transparent_38rem)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1120px] flex-col">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/76 backdrop-blur-xl transition hover:border-electric/30 hover:text-white sm:h-11"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-4 py-2 text-sm font-bold text-mint sm:flex">
            <ShieldCheck size={16} />
            Sessao protegida
          </div>
        </header>

        <main className="grid flex-1 content-start items-start gap-7 py-8 lg:grid-cols-[1fr_420px] lg:items-center lg:py-12">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <div className="landing-pill">
              <Sparkles size={15} />
              ProductHunter AI
            </div>
            <h1 className="mt-4 text-4xl font-black leading-[1.08] text-white md:text-6xl">
              Entre para acessar seu radar de produtos.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/62 md:text-lg md:leading-8">
              O app cria sua conta usando a identidade verificada pelo Google e salva a sessao em cookie seguro.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="landing-card landing-card-bright p-5 md:p-6"
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-electric/25 bg-electric/10 text-electric">
                <LockKeyhole size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Login de cliente</h2>
                <p className="mt-1 text-sm font-semibold text-white/48">Continue com sua conta Google.</p>
              </div>
            </div>

            <div className="mt-6">
              {isConfigLoading ? (
                <div className="shimmer h-11 rounded-full border border-white/10 bg-white/[0.06]" />
              ) : (
                <GoogleSignInButton
                  clientId={googleClientId}
                  disabled={!isGoogleConfigured || isLoggingIn}
                  onCredential={handleCredential}
                  onError={setLocalError}
                />
              )}
            </div>

            {(error || localError) && (
              <div className="mt-5 rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-semibold text-ember">
                {error || localError}
              </div>
            )}

            {isLoggingIn && (
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-electric/20 bg-electric/10 px-4 py-3 text-sm font-bold text-electric">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-electric shadow-[0_0_18px_rgba(98,230,255,0.8)]" />
                Validando conta com o backend...
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </div>
  );
}
