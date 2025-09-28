"use client";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<Event & { prompt: () => Promise<void> } | null>(null);

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as Event & { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
  };

  const isInstallable = !!installPrompt;

  return (
    <Button 
      onClick={handleInstallClick} 
      disabled={!isInstallable}
      className="px-6 py-3 text-base w-full sm:w-auto"
    >
      {isInstallable ? "Install App" : "Installation not available on this platform"}
    </Button>
  );
}
