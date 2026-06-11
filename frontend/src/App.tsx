import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Sidebar, type PageKey } from "./components/layout/Sidebar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { AUTH_REQUIRED_EVENT, getApiErrorDetail, isPlanLimitError, isUnauthorizedError } from "./services/api";
import { hasStoredAuthSession } from "./services/authToken";
import { useAuth } from "./hooks/useAuth";
import { useRecommendations } from "./hooks/useRecommendations";
import type { RecommendationItem, RecommendationQuotaError } from "./types/recommendation";
import { defaultProfile, type UserProfile } from "./types/userProfile";

const AccountPage = lazy(() => import("./pages/AccountPage").then((module) => ({ default: module.AccountPage })));
const Dashboard = lazy(() => import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })));
const RecommendationProfile = lazy(() => import("./pages/RecommendationProfile").then((module) => ({ default: module.RecommendationProfile })));
const RecommendationHistoryPage = lazy(() => import("./pages/RecommendationHistory").then((module) => ({ default: module.RecommendationHistoryPage })));
const RecommendationResults = lazy(() => import("./pages/RecommendationResults").then((module) => ({ default: module.RecommendationResults })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then((module) => ({ default: module.ProductDetail })));
const ProfitSimulator = lazy(() => import("./pages/ProfitSimulator").then((module) => ({ default: module.ProfitSimulator })));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage").then((module) => ({ default: module.SubscriptionPage })));
const AILab = lazy(() => import("./pages/AILab").then((module) => ({ default: module.AILab })));

const protectedPages = new Set<PageKey>(["dashboard", "account", "profile", "results", "history", "product", "profit", "billing", "ai"]);
const restorablePages = new Set<PageKey>(["dashboard", "account", "profile", "history", "profit", "billing", "ai"]);
const activePageStorageKey = "producthunter.activePage";

function readInitialPage(): PageKey {
  if (typeof window === "undefined") {
    return "landing";
  }

  const storedPage = window.localStorage.getItem(activePageStorageKey) as PageKey | null;
  return storedPage && restorablePages.has(storedPage) && hasStoredAuthSession() ? storedPage : "landing";
}

function storeActivePage(page: PageKey) {
  if (typeof window === "undefined" || !protectedPages.has(page)) {
    return;
  }

  window.localStorage.setItem(activePageStorageKey, restorablePages.has(page) ? page : "dashboard");
}

function clearStoredActivePage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(activePageStorageKey);
}

function firstProfileCompatibleRecommendation(data: { profile: UserProfile; recommendations: RecommendationItem[] } | null) {
  if (!data) {
    return undefined;
  }

  return data.recommendations.find((item) => item.product.niche === data.profile.niche);
}

function recommendationQuotaErrorFrom(error: unknown): RecommendationQuotaError | null {
  if (!isPlanLimitError(error)) {
    return null;
  }

  const detail = getApiErrorDetail(error);
  return {
    code: detailString(detail, "code") ?? "PLAN_LIMIT_ERROR",
    message: detailString(detail, "message") ?? error.message,
    planSlug: detailString(detail, "plan_slug"),
    planName: detailString(detail, "plan_name"),
    periodMonth: detailString(detail, "period_month"),
    generatedCount: detailNumber(detail, "generated_count"),
    monthlyLimit: detailNumber(detail, "monthly_limit"),
    remaining: detailNumber(detail, "remaining"),
    maxResultsPerAnalysis: detailNumber(detail, "max_results_per_analysis"),
  };
}

function detailString(detail: Record<string, unknown> | null, key: string) {
  const value = detail?.[key];
  return typeof value === "string" ? value : null;
}

function detailNumber(detail: Record<string, unknown> | null, key: string) {
  const value = detail?.[key];
  return typeof value === "number" ? value : null;
}

function PageLoader({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="kombai-card p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
          <Loader2 size={22} className="animate-spin" />
        </span>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>(() => readInitialPage());
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageKey>("dashboard");
  const [selectedItem, setSelectedItem] = useState<RecommendationItem | undefined>();
  const {
    data,
    isLoading: isRecommendationLoading,
    error,
    rawError: rawRecommendationError,
    run,
    reset: resetRecommendation,
  } = useRecommendations();
  const {
    authConfig,
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    isConfigLoading,
    isGoogleConfigured,
    isLoggingIn,
    isLoggingOut,
    loginWithGoogle,
    logout,
    clearSession,
    error: authError,
  } = useAuth();

  useEffect(() => {
    setSelectedItem(firstProfileCompatibleRecommendation(data));
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    storeActivePage(activePage);
  }, [activePage]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && protectedPages.has(activePage)) {
      setRedirectAfterLogin(activePage);
      setActivePage("login");
    }
    if (!isAuthLoading && isAuthenticated && activePage === "login") {
      setActivePage(protectedPages.has(redirectAfterLogin) ? redirectAfterLogin : "dashboard");
    }
  }, [activePage, isAuthenticated, isAuthLoading, redirectAfterLogin]);

  useEffect(() => {
    function handleAuthRequired() {
      clearSession();
      resetRecommendation();
      setSelectedItem(undefined);

      if (protectedPages.has(activePage)) {
        setRedirectAfterLogin(activePage);
        setActivePage("login");
      }
    }

    window.addEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
    return () => window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
  }, [activePage, clearSession, resetRecommendation]);

  const navigate = useCallback((page: PageKey) => {
    if (protectedPages.has(page) && !isAuthenticated) {
      setRedirectAfterLogin(page);
      setActivePage("login");
      return;
    }
    setActivePage(page);
  }, [isAuthenticated]);

  const recommendationQuotaError = useMemo(
    () => recommendationQuotaErrorFrom(rawRecommendationError),
    [rawRecommendationError],
  );

  const generate = useCallback(async (profile: UserProfile) => {
    if (!isAuthenticated) {
      setRedirectAfterLogin("profile");
      setActivePage("login");
      return;
    }

    try {
      const response = await run(profile);
      setSelectedItem(firstProfileCompatibleRecommendation(response));
      setActivePage("results");
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        clearSession();
        resetRecommendation();
        setSelectedItem(undefined);
        setRedirectAfterLogin("profile");
        setActivePage("login");
      }
    }
  }, [clearSession, isAuthenticated, resetRecommendation, run]);

  const startDemo = useCallback(async () => {
    if (!isAuthenticated) {
      setRedirectAfterLogin("profile");
      setActivePage("login");
      return;
    }
    await generate(defaultProfile);
  }, [generate, isAuthenticated]);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    await loginWithGoogle(credential);
    setActivePage(protectedPages.has(redirectAfterLogin) ? redirectAfterLogin : "dashboard");
  }, [loginWithGoogle, redirectAfterLogin]);

  const handleLogout = useCallback(async () => {
    await logout();
    clearStoredActivePage();
    resetRecommendation();
    setSelectedItem(undefined);
    setActivePage("landing");
  }, [logout, resetRecommendation]);

  const page = useMemo(() => {
    const pages: Record<PageKey, ReactNode> = {
      landing: (
        <LandingPage
          onStart={startDemo}
          onNavigate={navigate}
          user={user}
          onLogin={() => navigate("login")}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      ),
      login: (
        <LoginPage
          googleClientId={authConfig?.google_client_id}
          isConfigLoading={isConfigLoading}
          isGoogleConfigured={isGoogleConfigured}
          isLoggingIn={isLoggingIn}
          error={authError}
          onGoogleCredential={handleGoogleCredential}
          onNavigate={navigate}
        />
      ),
      dashboard: <Dashboard />,
      account: <AccountPage user={user} onLogout={handleLogout} isLoggingOut={isLoggingOut} />,
      profile: (
        <RecommendationProfile
          onGenerate={generate}
          isLoading={isRecommendationLoading}
          onOpenPlans={() => navigate("billing")}
          quotaError={recommendationQuotaError}
          onClearQuotaError={resetRecommendation}
        />
      ),
      results: <RecommendationResults data={data} selectedItem={selectedItem} onSelect={setSelectedItem} onNavigate={navigate} />,
      history: <RecommendationHistoryPage onNavigate={navigate} />,
      product: <ProductDetail item={selectedItem} />,
      profit: <ProfitSimulator item={selectedItem} />,
      billing: <SubscriptionPage />,
      ai: <AILab item={selectedItem} />,
    };
    return pages[activePage];
  }, [
    activePage,
    authConfig?.google_client_id,
    authError,
    data,
    generate,
    handleGoogleCredential,
    handleLogout,
    isAuthenticated,
    isConfigLoading,
    isGoogleConfigured,
    isLoggingIn,
    isLoggingOut,
    isRecommendationLoading,
    navigate,
    recommendationQuotaError,
    resetRecommendation,
    selectedItem,
    startDemo,
    user,
  ]);

  const isPublicPage = activePage === "landing" || activePage === "login";
  const isCompactShell = activePage === "profit" || activePage === "ai";
  const shouldShowRecommendationError = Boolean(error && !isUnauthorizedError(rawRecommendationError) && !recommendationQuotaError);
  const shouldHoldProtectedPage = protectedPages.has(activePage) && (isAuthLoading || !isAuthenticated);

  return (
    <div className={isPublicPage ? "min-h-screen bg-[#07090d] text-white" : "kombai-shell min-h-screen text-white"}>
      {!isPublicPage && (
        <>
          <div className="kombai-depth-bg" />
          <Sidebar
            activePage={activePage}
            onNavigate={navigate}
            mode={isCompactShell ? "compact" : "wide"}
            user={user}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        </>
      )}

      <main
        className={
          isPublicPage
            ? "min-h-screen"
            : isCompactShell
              ? "min-h-screen min-w-0 px-3 pb-28 pt-0 sm:px-4 lg:ml-16 lg:px-8 lg:pb-24 xl:px-10"
              : "min-h-screen min-w-0 px-3 pb-28 pt-0 sm:px-4 lg:ml-60 lg:px-8 lg:pb-24 xl:px-10"
        }
      >
        {!isPublicPage && shouldShowRecommendationError && (
          <div className="mb-4 flex items-center gap-3 rounded-md border border-ember/30 bg-ember/10 p-4 text-sm text-ember">
            <AlertTriangle size={18} />
            Backend indisponivel ou erro na API: {error}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={isPublicPage ? "min-h-screen" : undefined}
          >
            <Suspense fallback={<PageLoader />}>
              {shouldHoldProtectedPage ? <PageLoader label="Validando sessao..." /> : page}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
