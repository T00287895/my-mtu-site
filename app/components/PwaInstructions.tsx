"use client";
import { useEffect, useState } from "react";

export default function PwaInstructions() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia("(display-mode: standalone)");
      setIsStandalone(mediaQuery.matches);
      const handleChange = () => setIsStandalone(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // This is the key: only hide if the app is already installed.
  if (isStandalone) {
    return null;
  }

  return (
    <div className="w-full max-w-lg p-4 text-center bg-gray-100 border">
      <h3 className="font-bold text-lg mb-2">For Quick Access</h3>
      <p className="text-sm text-gray-700">
        You can add this app to your home screen. Use the install icon in your browser's address bar, or the 'Add to Home Screen' option in the Share menu.
      </p>
    </div>
  );
}
