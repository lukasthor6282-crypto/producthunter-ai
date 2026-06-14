import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CircleDollarSign,
  Cpu,
  Database,
  FlaskConical,
  LineChart,
  LogIn,
  LogOut,
  Menu,
  MousePointer2,
  Package,
  Play,
  Radar,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  UserCircle2,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { OpportunityRadar } from "../components/dashboard/OpportunityRadar";
import type { PageKey } from "../components/layout/Sidebar";
import type { AuthUser } from "../types/auth";

type LandingPageProps = {
  onStart: () => void;
  onNavigate: (page: PageKey) => void;
  user?: AuthUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

const navLinks = [
  { label: "Produto", id: "how" },
  { label: "Beneficios", id: "benefits" },
  { label: "Exemplo", id: "demo" },
  { label: "Comecar", id: "cta" },
] as const;

const metrics = [
  { label: "Oportunidades", value: "1,204", detail: "+12% hoje", tone: "mint" },
  { label: "Score Medio", value: "84/100", detail: "top categorias", tone: "electric" },
  { label: "Melhor Margem", value: "42%", detail: "produto vencedor", tone: "ember" },
  { label: "Conversao Est.", value: "3.8%", detail: "perfil atual", tone: "violet" },
] as const;

const topProducts = [
  { name: "Suporte veicular magnetico", score: 87, tone: "mint" },
  { name: "Mini impressora termica", score: 79, tone: "electric" },
  { name: "Kit organizador automotivo", score: 71, tone: "ember" },
] as const;

const steps = [
  {
    icon: <Store size={22} />,
    title: "Informe o seu cenario",
    text: "Marketplace, operacao, nicho, investimento, experiencia e trafego entram como contexto comercial.",
  },
  {
    icon: <BrainCircuit size={22} />,
    title: "A IA mede oportunidade",
    text: "O backend cruza margem, concorrencia, risco, conversao, demanda e aderencia ao seu perfil.",
  },
  {
    icon: <Target size={22} />,
    title: "Receba um ranking acionavel",
    text: "Veja produtos priorizados com score, lucro estimado, publico-alvo e estrategia de venda.",
  },
] as const;

const benefits = [
  {
    icon: <TrendingUp size={20} />,
    title: "Radar de tendencia",
    text: "Leia sinais de giro, sazonalidade e demanda antes de montar estoque ou campanha.",
  },
  {
    icon: <CircleDollarSign size={20} />,
    title: "Margem explicada",
    text: "Compare custo, frete, taxa, margem e lucro provavel em uma decisao simples.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Risco visivel",
    text: "Saturacao, concorrencia e complexidade operacional aparecem antes da aposta.",
  },
  {
    icon: <Users size={20} />,
    title: "Perfil do vendedor",
    text: "Afiliado, revendedor, dropshipping e loja propria recebem pesos diferentes.",
  },
] as const;

const demoProducts = [
  { product: "Suporte veicular premium", score: 91, profit: "R$ 28,40", risk: "baixo" },
  { product: "Organizador de porta-malas", score: 86, profit: "R$ 34,10", risk: "medio" },
  { product: "Aspirador automotivo compacto", score: 78, profit: "R$ 52,70", risk: "medio" },
] as const;

const stats = [
  { value: "12", label: "marketplaces simulados" },
  { value: "200+", label: "categorias analisaveis" },
  { value: "100%", label: "decisao explicavel" },
  { value: "ML", label: "modelo preparado" },
] as const;

const SPOTLIGHT_R = 260;

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function LandingPage({ onStart, onNavigate, user, onLogin, onLogout, isLoggingOut }: LandingPageProps) {
  return (
    <div className="landing-root relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      <div className="landing-dot-grid" />
      <LandingNav
        user={user}
        onStart={onStart}
        onNavigate={onNavigate}
        onLogin={onLogin}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="relative z-10">
        <SpotlightSaasHero onStart={onStart} />

        <section id="how" className="relative mx-auto max-w-[1180px] px-4 py-14 sm:px-5 sm:py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="landing-section-label">Como funciona</p>
            <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-white md:text-5xl">
              Um cockpit simples para decidir onde apostar.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/58">
              O fluxo usa o backend atual do ProductHunter, mas apresenta a decisao como uma ferramenta de analise:
              contexto, score, risco e plano de acao.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.07, duration: 0.45 }}
                className="landing-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  {step.icon}
                </div>
                <p className="mt-7 font-mono text-xs font-bold uppercase text-white/36">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/56">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="benefits" className="relative mx-auto max-w-[1180px] px-4 py-14 sm:px-5 sm:py-16 md:py-24">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              className="landing-card landing-card-bright p-6 sm:min-h-[420px] md:p-9"
            >
              <p className="landing-section-label">Beneficios</p>
              <h2 className="font-display mt-5 max-w-2xl text-3xl font-bold leading-tight text-white md:text-5xl">
                Pare de escolher produtos no achismo.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
                O ProductHunter transforma uma pergunta simples em um painel de decisao: score, margem, risco,
                conversao, estrategia e explicacao da IA em um so lugar.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                <MiniSignal icon={<LineChart size={18} />} label="Tendencia" value="+18%" />
                <MiniSignal icon={<Zap size={18} />} label="Velocidade" value="2.4x" />
                <MiniSignal icon={<FlaskConical size={18} />} label="Testes" value="Simulados" />
                <MiniSignal icon={<BarChart3 size={18} />} label="Clareza" value="Score 0-100" />
              </div>
            </motion.article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {benefits.map((benefit, index) => (
                <motion.article
                  key={benefit.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="landing-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-cyan-200">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{benefit.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{benefit.text}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="relative mx-auto max-w-[1180px] px-4 py-14 sm:px-5 sm:py-16 md:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="landing-section-label">Exemplo</p>
              <h2 className="font-display mt-5 text-3xl font-bold leading-tight text-white md:text-5xl">Veja na pratica.</h2>
              <p className="mt-5 text-base leading-8 text-white/60">
                A tela de recomendacao combina ranking claro, indicadores fortes e explicacao pronta para decisao.
                O usuario entende por que aquele produto faz sentido para o cenario dele.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button className="landing-primary-btn" onClick={onStart}>
                  <Sparkles size={18} />
                  Rodar analise demo
                </button>
                <button className="landing-secondary-btn" onClick={() => onNavigate("dashboard")}>
                  Abrir dashboard
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="landing-card p-4 md:p-5"
            >
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-cyan-200/70">Ranking recomendado</p>
                  <h3 className="font-display mt-2 text-2xl font-bold text-white">Automotivo | Shopee | ate R$500</h3>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
                  Alto potencial
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {demoProducts.map((item, index) => (
                  <div key={item.product} className="landing-product-row grid gap-4 p-4 md:grid-cols-[1fr_88px_110px_84px] md:items-center">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] font-mono text-xs font-black text-white/72">
                        0{index + 1}
                      </span>
                      <span className="font-bold text-white">{item.product}</span>
                    </div>
                    <MetricPill label="Score" value={item.score} />
                    <MetricPill label="Lucro" value={item.profit} />
                    <MetricPill label="Risco" value={item.risk} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative mx-auto max-w-[1180px] px-4 py-8 sm:px-5">
          <div className="landing-card grid grid-cols-2 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-3 text-center sm:p-5">
                <p className="font-mono text-2xl font-black text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-white/52">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="relative mx-auto max-w-[1180px] px-4 py-14 sm:px-5 sm:py-16 md:py-24">
          <div className="landing-card landing-card-bright overflow-hidden p-6 text-center md:p-12">
            <p className="landing-section-label">Comece agora</p>
            <h2 className="font-display mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
              Descubra o produto vencedor para o seu perfil de venda.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60">
              Simule lucro, compare risco e encontre a melhor aposta antes de investir tempo, estoque ou trafego.
            </p>
            <div className="mt-8 flex justify-center">
              <button className="landing-primary-btn" onClick={onStart}>
                <Sparkles size={18} />
                Comecar analise gratuita
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] px-5 py-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 text-sm text-white/46 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark small />
            <span>ProductHunter</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <button className="transition hover:text-white" onClick={() => onNavigate("account")}>Perfil</button>
            <button className="transition hover:text-white" onClick={() => onNavigate("profit")}>Simulador</button>
            <button className="transition hover:text-white" onClick={() => onNavigate("ai")}>Laboratorio de IA</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingNav({ user, onStart, onNavigate, onLogin, onLogout, isLoggingOut }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleSectionClick = (id: string) => {
    scrollToSection(id);
    closeMobileMenu();
  };
  const handleNavigate = (page: PageKey) => {
    onNavigate(page);
    closeMobileMenu();
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-4 py-3 sm:p-5">
      <button
        className="group flex min-w-0 items-center gap-2 sm:gap-3"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          closeMobileMenu();
        }}
      >
        <BrandMark />
        <span className="font-display hidden text-lg font-bold text-white min-[380px]:inline sm:text-xl">ProductHunter</span>
      </button>

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-2 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-md md:flex">
        {navLinks.map((link, index) => (
          <button
            key={link.id}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              index === 0 ? "bg-white text-gray-950" : "text-white/[0.76] hover:bg-white/[0.14] hover:text-white"
            }`}
            onClick={() => scrollToSection(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>

      {user ? (
        <div className="flex items-center gap-2">
          <button
            className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-950 shadow-[0_12px_40px_rgba(255,255,255,0.12)] transition hover:bg-gray-100 md:inline-flex"
            onClick={() => onNavigate("dashboard")}
          >
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gray-950/8">
              {user.picture_url ? (
                <img src={user.picture_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserCircle2 size={15} />
              )}
            </span>
            Abrir app
          </button>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            aria-label="Sair"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/76 transition hover:border-ember/40 hover:bg-ember/10 hover:text-ember disabled:opacity-50 md:inline-flex"
          >
            <LogOut size={16} />
          </button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md md:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            className="hidden rounded-full border border-white/[0.16] bg-white/10 px-5 py-2.5 text-sm font-bold text-white/[0.82] backdrop-blur-md transition hover:bg-white/[0.16] hover:text-white md:inline-flex"
            onClick={onLogin}
          >
            <LogIn className="mr-2" size={15} />
            Entrar
          </button>
          <button
            className="hidden rounded-full bg-white px-6 py-2.5 text-sm font-bold text-gray-950 shadow-[0_12px_40px_rgba(255,255,255,0.12)] transition hover:bg-gray-100 md:inline-flex"
            onClick={onStart}
          >
            Comecar gratis
          </button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md md:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      )}

      {mobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="landing-mobile-nav-panel absolute left-3 right-3 top-[calc(100%+0.45rem)] rounded-lg border border-white/15 bg-[#071018]/88 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl md:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className="rounded-lg border border-white/10 bg-white/[0.055] px-3 py-3 text-left text-sm font-bold text-white/78 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white"
                onClick={() => handleSectionClick(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="mt-3 grid gap-2">
              <button className="landing-primary-btn w-full" onClick={() => handleNavigate("dashboard")}>
                <Sparkles size={17} />
                Abrir app
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  closeMobileMenu();
                }}
                disabled={isLoggingOut}
                className="landing-secondary-btn w-full disabled:opacity-50"
              >
                <LogOut size={17} />
                Sair
              </button>
            </div>
          ) : (
            <div className="mt-3 grid gap-2">
              <button
                className="landing-primary-btn w-full"
                onClick={() => {
                  onStart();
                  closeMobileMenu();
                }}
              >
                <Sparkles size={17} />
                Comecar gratis
              </button>
              <button
                className="landing-secondary-btn w-full"
                onClick={() => {
                  onLogin();
                  closeMobileMenu();
                }}
              >
                <LogIn size={17} />
                Entrar
              </button>
            </div>
          )}
        </motion.div>
      ) : null}
    </nav>
  );
}

function SpotlightSaasHero({ onStart }: Pick<LandingPageProps, "onStart">) {
  const cursor = useSmoothedSpotlight();

  return (
    <section className="landing-spotlight-hero relative h-screen w-full overflow-hidden bg-black" style={{ height: "100dvh" }}>
      <div className="absolute inset-0 z-10 hero-zoom">
        <SaasHeroScene />
      </div>

      <SpotlightRevealLayer cursorX={cursor.x} cursorY={cursor.y}>
        <SaasHeroScene revealed />
      </SpotlightRevealLayer>

      <div className="landing-hero-copy pointer-events-none absolute left-0 right-0 top-[14%] z-50 flex flex-col items-center px-5 text-center">
        <div
          className="hero-anim hero-fade mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-cyan-100 sm:hidden"
          style={{ animationDelay: "0.12s" }}
        >
          <Sparkles size={13} />
          Radar IA de produtos
        </div>
        <h1 className="max-w-[1120px] text-white">
          <span
            className="landing-hero-title-line hero-anim hero-reveal block font-display text-5xl font-bold leading-[0.95] sm:text-7xl md:text-8xl"
            style={{ animationDelay: "0.25s" }}
          >
            Produtos certos
          </span>
          {" "}
          <span
            className="landing-hero-title-line hero-anim hero-reveal mt-1 block font-display text-5xl font-normal leading-[0.95] text-white/92 sm:text-7xl md:text-8xl"
            style={{ animationDelay: "0.42s" }}
          >
            no momento certo
          </span>
        </h1>
        <p
          className="hero-anim hero-fade mt-4 max-w-[330px] text-sm font-semibold leading-6 text-white/72 sm:hidden"
          style={{ animationDelay: "0.56s" }}
        >
          Descubra produtos alinhados ao seu nicho, verba, marketplace e nivel de experiencia antes de investir.
        </p>
        <div
          className="landing-mobile-hero-actions hero-anim hero-fade pointer-events-auto mt-5 flex w-full max-w-[330px] flex-col gap-3 sm:hidden"
          style={{ animationDelay: "0.68s" }}
        >
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#67e8f9] px-6 py-3 text-sm font-bold text-[#041016] shadow-lg shadow-cyan-300/24 transition-all hover:bg-[#5ef2b0] active:scale-95"
            onClick={onStart}
          >
            <Sparkles size={16} />
            Fazer analise gratis
          </button>
        </div>
      </div>

      <div
        className="hero-anim hero-fade pointer-events-none absolute bottom-14 left-10 z-50 hidden max-w-[280px] sm:block md:left-14"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="text-sm leading-relaxed text-white/80">
          Leia nicho, verba, marketplace e risco como camadas de decisao antes de investir em estoque,
          anuncios ou afiliacao.
        </p>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-8 left-5 right-5 z-50 hidden max-w-full flex-col items-start gap-4 sm:bottom-8 sm:left-auto sm:right-10 sm:flex sm:max-w-[280px] md:right-14"
        style={{ animationDelay: "0.85s" }}
      >
        <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
          A camada revelada mostra o que a IA enxerga: aderencia ao perfil, margem estimada, risco e proxima acao.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#67e8f9] px-7 py-3 text-sm font-bold text-[#041016] shadow-lg shadow-cyan-300/24 transition-all hover:scale-[1.03] hover:bg-[#5ef2b0] active:scale-95"
            onClick={onStart}
          >
            <Sparkles size={16} />
            Fazer analise gratis
          </button>
        </div>
      </div>
    </section>
  );
}

function useSmoothedSpotlight() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const initial = {
      x: window.innerWidth * 0.58,
      y: window.innerHeight * 0.58,
    };
    mouse.current = initial;
    smooth.current = initial;
    setCursorPos(initial);

    const onPointerMove = (event: PointerEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };

    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return cursorPos;
}

function SpotlightRevealLayer({ cursorX, cursorY, children }: { cursorX: number; cursorY: number; children: ReactNode }) {
  const maskImage = `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorX}px ${cursorY}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`;

  return (
    <div
      className="spotlight-reveal-layer absolute inset-0 z-30 pointer-events-none"
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      {children}
    </div>
  );
}

function SaasHeroScene({ revealed = false }: { revealed?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${revealed ? "saas-scene-revealed" : "saas-scene-base"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(103,232,249,0.12),transparent_24rem),linear-gradient(180deg,#03060a_0%,#071018_48%,#020305_100%)]" />
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:72px_72px]" />

      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={revealed ? "heroLineReveal" : "heroLineBase"} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor={revealed ? "#5ef2b0" : "#67e8f9"} stopOpacity={revealed ? "0.52" : "0.2"} />
            <stop offset="1" stopColor={revealed ? "#67e8f9" : "#ffffff"} stopOpacity={revealed ? "0.28" : "0.08"} />
          </linearGradient>
        </defs>
        <path d="M132 610 C 322 426 510 540 688 376 S 1030 252 1304 372" fill="none" stroke={`url(#${revealed ? "heroLineReveal" : "heroLineBase"})`} strokeWidth="2" />
        <path d="M188 268 C 424 382 456 160 706 276 S 1054 612 1256 490" fill="none" stroke={`url(#${revealed ? "heroLineReveal" : "heroLineBase"})`} strokeWidth="1.4" strokeDasharray="8 18" />
        <path d="M300 740 C 518 640 710 744 878 558 S 1114 412 1340 610" fill="none" stroke={`url(#${revealed ? "heroLineReveal" : "heroLineBase"})`} strokeWidth="1.2" />
      </svg>

      <div className="saas-panel-stage absolute left-1/2 top-[60%] w-[min(780px,90vw)] -translate-x-1/2 -translate-y-1/2 sm:top-[67%] sm:w-[min(780px,86vw)]">
        <div className={`saas-hero-panel ${revealed ? "saas-hero-panel-revealed" : ""}`}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${revealed ? "bg-emerald-300 text-[#041016]" : "bg-white/10 text-cyan-100"}`}>
                {revealed ? <Cpu size={17} /> : <Radar size={17} />}
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/42">Opportunity OS</p>
                <p className="text-sm font-bold text-white">{revealed ? "Camada de IA ativa" : "Radar comercial"}</p>
              </div>
            </div>
            <span className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/[0.62]">
              Live
            </span>
          </div>

          <div className="grid gap-3 p-4 md:grid-cols-[1fr_0.72fr]">
            <div className="space-y-3">
              {[
                ["Suporte veicular magnetico", "96", "Automotivo"],
                ["Aspirador veicular portatil", "88", "Automotivo"],
                ["Kit organizador automotivo", "84", "Automotivo"],
              ].map(([name, score, niche], index) => (
                <div key={name} className="grid grid-cols-[34px_1fr_54px] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-3">
                  <span className="font-mono text-xs font-black text-white/34">0{index + 1}</span>
                  <div>
                    <p className="truncate text-sm font-bold text-white">{name}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/34">{niche}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-center font-mono text-xs font-black ${revealed ? "border-emerald-300/30 bg-emerald-300/[0.12] text-emerald-200" : "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-100"}`}>
                    {score}
                  </span>
                </div>
              ))}
            </div>

            <div className="hidden gap-3 md:grid">
              <HeroMetricTile icon={<Database size={16} />} label="Match de nicho" value="98%" />
              <HeroMetricTile icon={<Activity size={16} />} label="Margem" value="42%" />
              <HeroMetricTile icon={<Route size={16} />} label="Proxima acao" value="Teste leve" />
            </div>
          </div>
        </div>
      </div>

      <SignalNode revealed={revealed} className="left-[8%] top-[34%]" icon={<ShoppingBag size={18} />} label="Shopee" value={revealed ? "+18% giro" : "marketplace"} />
      <SignalNode revealed={revealed} className="right-[8%] top-[38%]" icon={<Package size={18} />} label="Produto" value={revealed ? "baixo risco" : "catalogo"} />
      <SignalNode revealed={revealed} className="left-[16%] bottom-[18%]" icon={<TrendingUp size={18} />} label="Demanda" value={revealed ? "subindo" : "sinal"} />
      <SignalNode revealed={revealed} className="right-[8%] bottom-[29%]" icon={<MousePointer2 size={18} />} label="Decisao" value={revealed ? "validar agora" : "perfil"} />
    </div>
  );
}

function SignalNode({ className, icon, label, value, revealed }: { className: string; icon: ReactNode; label: string; value: string; revealed?: boolean }) {
  return (
    <div className={`saas-signal-node absolute hidden min-w-[154px] rounded-lg border px-4 py-3 text-left backdrop-blur-md sm:block ${className} ${revealed ? "saas-signal-node-revealed" : ""}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${revealed ? "bg-emerald-300 text-[#041016]" : "bg-white/10 text-cyan-100"}`}>
          {icon}
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/38">{label}</p>
          <p className="mt-1 text-sm font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function HeroMetricTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-center gap-2 text-cyan-100">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/38">{label}</span>
      </div>
      <p className="mt-3 font-mono text-lg font-black text-white">{value}</p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="landing-mockup-shell overflow-hidden rounded-lg">
      <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-white/[0.035] px-4">
        <span className="h-3 w-3 rounded-full bg-white/22" />
        <span className="h-3 w-3 rounded-full bg-white/[0.14]" />
        <span className="h-3 w-3 rounded-full bg-white/10" />
        <div className="ml-5 h-1.5 flex-1 rounded-full bg-white/10" />
        <span className="hidden text-xs font-bold text-white/36 md:inline">ProductHunter</span>
      </div>

      <div className="grid min-h-[398px] bg-[#101720]/95 lg:grid-cols-[60px_1fr]">
        <aside className="hidden border-r border-white/10 px-3 py-5 lg:block">
          <div className="relative mb-7 flex h-8 w-8 items-center justify-center rounded-lg bg-[#67e8f9] text-[#05070b]">
            <Store size={15} strokeWidth={2.4} />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#07100d]">
              <Search size={9} strokeWidth={3} />
            </span>
          </div>
          <div className="flex flex-col items-center gap-5 text-white/34">
            <BarChart3 className="text-cyan-200" size={17} />
            <Sparkles size={17} />
            <LineChart size={17} />
            <FlaskConical size={17} />
          </div>
        </aside>

        <div className="p-4 text-left md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="landing-metric-card p-4 text-center">
                <p className="text-[10px] font-black uppercase text-white/42">{metric.label}</p>
                <p className={`mt-3 font-mono text-3xl font-black ${metric.tone === "electric" ? "text-cyan-200" : metric.tone === "mint" ? "text-white" : metric.tone === "ember" ? "text-emerald-200" : "text-amber-200"}`}>
                  {metric.value}
                </p>
                <p className={`mt-3 text-xs font-bold ${metric.tone === "ember" ? "text-emerald-200/65" : metric.tone === "mint" ? "text-emerald-200" : "text-white/42"}`}>
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.92fr]">
            <div className="landing-metric-card p-5">
              <div className="mb-5 text-center">
                <p className="text-xs font-black uppercase text-white/42">Top produtos</p>
              </div>
              <div className="space-y-2">
                {topProducts.map((item, index) => (
                  <div key={item.name} className="grid grid-cols-[34px_1fr_42px] items-center gap-3 border-b border-white/[0.055] py-3 last:border-b-0">
                    <span className="font-mono text-xs font-black text-white/24">0{index + 1}</span>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <span
                      className={`rounded-full border px-2 py-1 text-center font-mono text-xs font-black ${
                        item.tone === "mint"
                          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                          : item.tone === "ember"
                            ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
                            : "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                      }`}
                    >
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <OpportunityRadar compact score={84} subtitle="Leitura combinada de nicho, verba e risco." />
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`relative flex ${small ? "h-9 w-9" : "h-10 w-10"} items-center justify-center rounded-lg border border-cyan-200/25 bg-[linear-gradient(135deg,#67e8f9,#5ef2b0)] text-[#05070b] shadow-[0_0_34px_rgba(103,232,249,0.22)]`}>
      <Store size={small ? 17 : 19} strokeWidth={2.4} />
      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#07100d]/15 bg-white text-[#07100d] shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
        <Search size={10} strokeWidth={3} />
      </span>
    </span>
  );
}

function MiniSignal({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="landing-product-row flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3 text-cyan-100">
        {icon}
        <span className="text-sm font-semibold text-white/58">{label}</span>
      </div>
      <span className="font-mono text-sm font-black text-white">{value}</span>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-white/36">{label}</p>
      <p className="mt-1 font-mono text-sm font-black text-white">{value}</p>
    </div>
  );
}
