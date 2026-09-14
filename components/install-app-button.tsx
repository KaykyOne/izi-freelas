"use client";

//* Components Imports
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";

//* Libraries Imports
import { useState } from "react";
import { Download, PlusSquare, Share } from "lucide-react";
import { toast } from "sonner";

//* Hooks Imports
import { usePwaInstall } from "@/hooks/use-pwa-install";

//* Types Imports
import type { ComponentProps } from "react";

type InstallAppButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "children"> & {
  label?: string;
};

export function InstallAppButton({ label = "Instalar app", ...buttonProps }: InstallAppButtonProps) {
  const { canPrompt, isIos, isInstalled, install } = usePwaInstall();
  const [isIosHelpOpen, setIsIosHelpOpen] = useState(false);

  // Sem prompt nativo e fora do iOS não há como instalar por clique — melhor não mostrar um botão morto.
  if (isInstalled || (!canPrompt && !isIos)) return null;

  async function handleInstall() {
    if (!canPrompt) {
      setIsIosHelpOpen(true);
      return;
    }

    const outcome = await install();
    if (outcome === "accepted") toast.success("izi Freelas instalado", { description: "Abra pelo ícone na sua tela." });
  }

  return (
    <>
      <Button {...buttonProps} onClick={handleInstall}>
        <Download className="size-4" />
        {label}
      </Button>

      <Dialog.DialogRoot open={isIosHelpOpen} onOpenChange={setIsIosHelpOpen}>
        <Dialog.DialogContent className="bg-background p-6 sm:max-w-sm sm:p-8">
          <Dialog.DialogHeader>
            <Dialog.DialogTitle className="text-xl font-semibold tracking-[-0.03em]">Instalar no iPhone</Dialog.DialogTitle>
            <Dialog.DialogDescription>
              O Safari não tem botão de instalação automática. Leva 3 toques:
            </Dialog.DialogDescription>
          </Dialog.DialogHeader>

          <ol className="mt-2 flex flex-col gap-3 text-sm text-foreground">
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Share className="size-4 shrink-0" />
              Toque em <strong>Compartilhar</strong> na barra do Safari.
            </li>
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <PlusSquare className="size-4 shrink-0" />
              Escolha <strong>Adicionar à Tela de Início</strong>.
            </li>
            <li className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Download className="size-4 shrink-0" />
              Confirme em <strong>Adicionar</strong>.
            </li>
          </ol>
        </Dialog.DialogContent>
      </Dialog.DialogRoot>
    </>
  );
}
