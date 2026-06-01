import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CircleDollarSign,
  FlaskConical,
  LogIn,
  LogOut,
  LineChart,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  UserCircle2,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
  { label: "Benefícios", id: "benefits" },
  { label: "Exemplo", id: "demo" },
  { label: "Começar", id: "cta" },
] as const;

const metrics = [
  { label: "Oportunidades", value: "1,204", detail: "+12% hoje", tone: "mint" },
  { label: "Score Médio", value: "84/100", detail: "top categorias", tone: "electric" },
  { label: "Melhor Margem", value: "42%", detail: "produto vencedor", tone: "ember" },
  { label: "Conversão Est.", value: "3.8%", detail: "perfil atual", tone: "violet" },
] as const;

const topProducts = [
  { name: "Mini impressora térmica", score: 87, tone: "mint" },
  { name: "Suporte magnético", score: 79, tone: "electric" },
  { name: "Luminária gamer RGB", score: 71, tone: "ember" },
] as const;

const steps = [
  {
    icon: <Store size={22} />,
    title: "Informe onde você vende",
    text: "Marketplace, operação, nicho, investimento, experiência e tráfego entram como contexto comercial.",
  },
  {
    icon: <BrainCircuit size={22} />,
    title: "A IA calcula oportunidade",
    text: "O backend cruza margem, concorrência, risco, conversão e aderência ao seu perfil.",
  },
  {
    icon: <Target size={22} />,
    title: "Receba o ranking ideal",
    text: "Veja produtos priorizados com score, lucro estimado, público-alvo e estratégia de venda.",
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
    text: "Compare custo, frete, taxa, margem e lucro provável em uma decisão simples.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Risco visível",
    text: "Saturação, concorrência e complexidade operacional aparecem antes da aposta.",
  },
  {
    icon: <Users size={20} />,
    title: "Perfil do vendedor",
    text: "Afiliado, revendedor, dropshipping e loja própria recebem pesos diferentes.",
  },
] as const;

const demoProducts = [
  { product: "Organizador dobrável premium", score: 91, profit: "R$ 28,40", risk: "baixo" },
  { product: "Massageador facial compacto", score: 86, profit: "R$ 34,10", risk: "médio" },
  { product: "Kit cozinha antiaderente", score: 78, profit: "R$ 52,70", risk: "médio" },
] as const;

const stats = [
  { value: "12", label: "marketplaces simulados" },
  { value: "200+", label: "categorias analisaveis" },
  { value: "100%", label: "decisão explicável" },
  { value: "ML", label: "modelo preparado" },
] as const;

function scrollToSection(id: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function LandingPage({ onStart, onNavigate, user, onLogin, onLogout, isLoggingOut }: LandingPageProps) {
  return (
    <div className="landing-root relative min-h-screen overflow-hidden bg-[#07090d] text-white">
      <div className="landing-dot-grid" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[820px] bg-[radial-gradient(circle_at_50%_0%,rgba(86,111,255,0.2),transparent_42rem)]" />
      <div className="landing-orb landing-orb-a" />
      <div className="landing-orb landing-orb-b" />
      <div className="landing-orb landing-orb-c" />

      <header className="relative z-20 border-b border-white/[0.08] bg-[#07090d]/72 backdrop-blur-2xl">
        <nav className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 md:px-8">
          <button className="group flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200/25 bg-[linear-gradient(135deg,#f8fafc,#d9f99d_48%,#34d399)] text-[#07100d] shadow-[0_0_34px_rgba(52,211,153,0.24)]">
              <Store size={19} strokeWidth={2.4} />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#07100d]/15 bg-white text-[#07100d] shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
                <Search size={10} strokeWidth={3} />
              </span>
            </span>
            <span className="text-base font-extrabold text-white">ProductHunter</span>
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className="text-sm font-medium text-white/58 transition hover:text-white"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <button className="landing-nav-cta hidden items-center gap-2 md:inline-flex" onClick={() => onNavigate("dashboard")}>
                <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white/[0.12]">
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
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-white/64 transition hover:border-ember/30 hover:bg-ember/10 hover:text-ember disabled:opacity-50 md:inline-flex"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="hidden h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 text-sm font-bold text-white/68 transition hover:border-electric/30 hover:text-white md:inline-flex"
                onClick={onLogin}
              >
                <LogIn size={15} />
                Entrar
              </button>
              <button className="landing-nav-cta hidden items-center gap-2 md:inline-flex" onClick={onStart}>
                <Sparkles size={15} />
                Começar grátis
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="relative z-10">
        <section className="relative mx-auto flex min-h-[900px] max-w-[1280px] flex-col items-center px-5 pb-16 pt-20 text-center lg:min-h-[960px] lg:pt-[78px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="landing-pill"
          >
            <Sparkles size={15} />
            Inteligência de Mercado para Vendedores
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: "easeOut" }}
            className="mt-2 max-w-[1040px] text-4xl font-black leading-[1.12] text-white sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[76px]"
          >
            A IA que encontra os melhores produtos para o seu perfil de{" "}
            <span className="landing-text-gradient">venda.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: "easeOut" }}
            className="mt-6 max-w-[700px] text-base leading-8 text-white/56 md:text-xl"
          >
            Informe onde você vende, seu nicho e objetivo. O ProductHunter recomenda produtos com maior chance de
            lucro, conversão e oportunidade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5, ease: "easeOut" }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button className="landing-primary-btn" onClick={onStart}>
              <Sparkles size={17} />
              Encontrar produtos
            </button>
            <button className="landing-secondary-btn" onClick={() => scrollToSection("demo")}>
              <Play size={17} />
              Ver exemplo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 38, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.34, duration: 0.75, ease: "easeOut" }}
            className="landing-mockup-float mt-16 w-full max-w-[840px]"
          >
            <DashboardMockup />
          </motion.div>
        </section>

        <section id="how" className="relative mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="landing-section-label">Como funciona</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">
              Três passos para encontrar seu próximo produto vencedor.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/58">
              O fluxo permanece conectado ao backend atual. A landing apenas apresenta a decisão com mais clareza,
              profundidade e confiança visual.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
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
                <h3 className="mt-3 text-xl font-extrabold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/56">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="benefits" className="relative mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              className="landing-card landing-card-bright min-h-[420px] p-7 md:p-9"
            >
              <p className="landing-section-label">Benefícios</p>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-white md:text-5xl">
                Pare de escolher produtos no achismo.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
                O ProductHunter transforma uma pergunta simples em um painel de decisão: score, margem, risco,
                conversão, estratégia e explicação da IA em um só lugar.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                <MiniSignal icon={<LineChart size={18} />} label="Tendência" value="+18%" />
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
                      <h3 className="font-extrabold text-white">{benefit.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{benefit.text}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="relative mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="landing-section-label">Exemplo</p>
              <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">Veja na prática.</h2>
              <p className="mt-5 text-base leading-8 text-white/60">
                A tela de recomendação continua usando a API atual, mas agora chega com leitura de SaaS premium:
                ranking claro, indicadores fortes e explicação pronta para decisão.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className="landing-primary-btn" onClick={onStart}>
                  <Sparkles size={18} />
                  Rodar análise demo
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
                  <h3 className="mt-2 text-2xl font-black text-white">Casa e organização | Mercado Livre</h3>
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

        <section className="relative mx-auto max-w-[1180px] px-5 py-8">
          <div className="landing-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="p-5 text-center">
                <p className="font-mono text-4xl font-black text-white">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-white/52">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="relative mx-auto max-w-[1180px] px-5 py-20 md:py-24">
          <div className="landing-card landing-card-bright overflow-hidden p-8 text-center md:p-12">
            <p className="landing-section-label">Comece agora</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
              Descubra o produto vencedor para o seu perfil de venda.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/60">
              Simule lucro, compare risco e encontre a melhor aposta antes de investir tempo, estoque ou tráfego.
            </p>
            <div className="mt-8 flex justify-center">
              <button className="landing-primary-btn" onClick={onStart}>
                <Sparkles size={18} />
                Começar análise gratuita
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] px-5 py-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 text-sm text-white/46 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#07090d]">
              <Store size={17} strokeWidth={2.4} />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-300 text-[#07100d]">
                <Search size={9} strokeWidth={3} />
              </span>
            </span>
            <span>ProductHunter</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <button className="transition hover:text-white" onClick={() => onNavigate("profile")}>Perfil</button>
            <button className="transition hover:text-white" onClick={() => onNavigate("profit")}>Simulador</button>
            <button className="transition hover:text-white" onClick={() => onNavigate("ai")}>Laboratório de IA</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="landing-mockup-shell overflow-hidden rounded-[22px]">
      <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-white/[0.035] px-4">
        <span className="h-3 w-3 rounded-full bg-white/22" />
        <span className="h-3 w-3 rounded-full bg-white/14" />
        <span className="h-3 w-3 rounded-full bg-white/10" />
        <div className="ml-5 h-1.5 flex-1 rounded-full bg-white/10" />
        <span className="hidden text-xs font-bold text-white/36 md:inline">ProductHunter</span>
      </div>

      <div className="grid min-h-[398px] bg-[#15171a]/95 lg:grid-cols-[60px_1fr]">
        <aside className="hidden border-r border-white/10 px-3 py-5 lg:block">
          <div className="relative mb-7 flex h-8 w-8 items-center justify-center rounded-lg bg-[#66f6e7] text-[#07090d]">
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

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
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

            <div className="landing-metric-card p-5">
              <div className="mb-4 text-center">
                <p className="text-xs font-black uppercase text-white/42">Tendência do nicho</p>
              </div>
              <svg viewBox="0 0 260 190" className="h-[190px] w-full" role="img" aria-label="Gráfico de tendência">
                <defs>
                  <linearGradient id="trendStroke" x1="0" x2="1">
                    <stop offset="0%" stopColor="#62e6ff" />
                    <stop offset="100%" stopColor="#62e6ff" />
                  </linearGradient>
                  <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#62e6ff" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#62e6ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M24 146 L72 130 L118 112 L150 120 L182 88 L214 74 L236 70 L250 60 L250 180 L24 180 Z" fill="url(#trendFill)" />
                <path d="M24 146 L72 130 L118 112 L150 120 L182 88 L214 74 L236 70 L250 60" fill="none" stroke="url(#trendStroke)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="250" cy="60" r="4" fill="#62e6ff" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
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
