import { useEffect, useRef, useState } from "react";

const googleScriptId = "google-identity-services";

function loadGoogleIdentityScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(googleScriptId) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Nao foi possivel carregar o Google Sign-In.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = googleScriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Nao foi possivel carregar o Google Sign-In."));
    document.head.appendChild(script);
  });
}

type GoogleSignInButtonProps = {
  clientId?: string | null;
  disabled?: boolean;
  onCredential: (credential: string) => void | Promise<void>;
  onError?: (message: string) => void;
};

export function GoogleSignInButton({ clientId, disabled, onCredential, onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!clientId || disabled) {
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
          return;
        }

        const width = Math.max(260, Math.min(360, buttonRef.current.clientWidth || 320));
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              void onCredential(response.credential);
              return;
            }
            onError?.("O Google nao retornou uma credencial valida.");
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width,
          locale: "pt-BR",
        });
        setStatus("ready");
      })
      .catch((error: Error) => {
        setStatus("error");
        onError?.(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, disabled, onCredential, onError]);

  if (!clientId) {
    return (
      <div className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-semibold text-ember">
        Configure GOOGLE_CLIENT_ID no backend para ativar o login Google.
      </div>
    );
  }

  return (
    <div className="min-h-[44px] w-full">
      <div ref={buttonRef} className={disabled ? "pointer-events-none opacity-55" : undefined} />
      {status === "loading" && (
        <div className="shimmer mt-3 h-11 rounded-full border border-white/10 bg-white/[0.06]" aria-hidden="true" />
      )}
      {status === "error" && (
        <p className="mt-3 text-sm font-semibold text-ember">Nao foi possivel iniciar o botao do Google.</p>
      )}
    </div>
  );
}
