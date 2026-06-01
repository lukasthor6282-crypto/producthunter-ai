import type { GoogleCredentialResponse } from "./auth";

type GoogleButtonTheme = "outline" | "filled_blue" | "filled_black";
type GoogleButtonSize = "large" | "medium" | "small";
type GoogleButtonText = "signin_with" | "signup_with" | "continue_with" | "signin";
type GoogleButtonShape = "rectangular" | "pill" | "circle" | "square";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: GoogleButtonTheme;
              size?: GoogleButtonSize;
              text?: GoogleButtonText;
              shape?: GoogleButtonShape;
              logo_alignment?: "left" | "center";
              width?: number;
              locale?: string;
            },
          ) => void;
          prompt: () => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export {};
