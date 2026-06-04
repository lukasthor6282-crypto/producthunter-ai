import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Sidebar, type PageKey } from "./components/layout/Sidebar";
import { AccountPage } from "./pages/AccountPage";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RecommendationProfile } from "./pages/RecommendationProfile";
import { RecommendationResults } from "./pages/RecommendationResults";
import { ProductDetail } from "./pages/ProductDetail";
import { ProfitSimulator } from "./pages/ProfitSimulator";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { AILab } from "./pages/AILab";
import { AUTH_REQUIRED_EVENT, isUnauthorizedError } from "./services/api";
import { useAuth } from "./hooks/useAuth";
import { useRecommendations } from "./hooks/useRecommendations";
import type { RecommendationItem } from "./types/recommendation";
import { defaultProfile, type UserProfile } from "./types/userProfile";

const protectedPages = new Set<PageKey>(["dashboard", "account", "profile", "results", "product", "profit", "billing", "ai"]);
const restorablePages = new Set<PageKey>(["dashboard", "account", "profile", "profit", "billing", "ai"]);
const activePageStorageKey = "producthunter.activePage";

function readInitialPage(): PageKey {
  if (typeof window === "undefined") {
    return "landing";
  }

  const storedPage = window.localStorage.getItem(activePageStorageKey) as PageKey | null;
  return storedPage && restorablePages.has(storedPage) ? storedPage : "landing";
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
      profile: <RecommendationProfile onGenerate={generate} isLoading={isRecommendationLoading} />,
      results: <RecommendationResults data={data} selectedItem={selectedItem} onSelect={setSelectedItem} onNavigate={navigate} />,
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
    selectedItem,
    startDemo,
    user,
  ]);

  const isPublicPage = activePage === "landing" || activePage === "login";
  const isCompactShell = activePage === "profit" || activePage === "ai";
  const shouldShowRecommendationError = Boolean(error && !isUnauthorizedError(rawRecommendationError));

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
            {page}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
