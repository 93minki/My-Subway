import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const useInstallPWA = () => {
  console.log("useInstallPWA Hook running");
  const [isInstallable, setIsInstallable] = useState(false);

  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      promptRef.current = e;
      setIsInstallable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const showInstallPrompt = useCallback(() => {
    if (promptRef.current) {
      promptRef.current.prompt();
      promptRef.current.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("사용자가 설치를 수락함");
        } else {
          console.log("사용자가 설치를 거절함");
        }
        promptRef.current = null;
        setIsInstallable(false);
      });
    }
  }, []);

  return { isInstallable, showInstallPrompt };
};

export default useInstallPWA;
