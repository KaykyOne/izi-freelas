"use client";

//* Libraries Imports
import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    // O GitHub Pages pode servir o app num basePath; o link do manifest já vem com ele aplicado,
    // então o sw.js é resolvido relativo a esse link em vez da URL da página atual.
    const manifestHref = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href;
    const swUrl = new URL("sw.js", manifestHref ?? window.location.origin + "/");

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.error("Falha ao registrar o service worker:", error);
    });
  }, []);

  return null;
}
