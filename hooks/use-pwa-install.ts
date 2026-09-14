"use client";

//* Libraries Imports
import { useEffect, useState } from "react";

// `beforeinstallprompt` ainda não está no lib.dom do TypeScript.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaInstallState = {
  /** Navegador entregou o prompt nativo (Chrome, Edge, Android). */
  canPrompt: boolean;
  /** iOS/iPadOS não tem prompt: a instalação é manual pelo menu Compartilhar. */
  isIos: boolean;
  /** App já aberto como PWA instalado. */
  isInstalled: boolean;
};

// O evento dispara uma única vez, logo no carregamento — às vezes antes do botão montar (ex.: o
// usuário chega na landing e só depois navega pro dashboard). Guardar em módulo evita perdê-lo.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

function readState(): PwaInstallState {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // iPadOS se apresenta como Mac; o toque é o que diferencia.
  const isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  return { canPrompt: deferredPrompt !== null, isIos, isInstalled: isStandalone };
}

export function usePwaInstall() {
  const [state, setState] = useState<PwaInstallState>({ canPrompt: false, isIos: false, isInstalled: false });

  useEffect(() => {
    function sync() {
      setState(readState());
    }

    // Leitura do navegador só existe no cliente; no build estático o estado inicial é "sem botão".
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  async function install() {
    if (!deferredPrompt) return "unavailable" as const;

    const promptEvent = deferredPrompt;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    // O mesmo evento não pode ser reutilizado depois de exibido.
    deferredPrompt = null;
    notify();
    return outcome;
  }

  return { ...state, install };
}
