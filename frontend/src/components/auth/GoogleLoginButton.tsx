// src/components/auth/GoogleLoginButton.tsx
import { useEffect, useRef } from "react";

// Nyiapin tipe biar window.google gak error
declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const buttonDivRef = useRef<HTMLDivElement>(null);
  const hasRendered = useRef(false);

  useEffect(() => {
    if (hasRendered.current) return;
    hasRendered.current = true;

    console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogle();
    };
    document.head.appendChild(script);
  }, []);

  // Inisialisasi Google button
  const initializeGoogle = () => {
    if (!window.google?.accounts) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(buttonDivRef.current!, {
      theme: "outline",
      size: "large",
      type: "standard",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: "320",
    });
  };

  // Terima credential lalu kirim ke backend
  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/google/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include", 
        body: JSON.stringify({ credential: response.credential }),
      });

      if (res.ok) {
        window.location.href = "http://localhost:5173/dashboard?login=google";
        onSuccess?.();
      } else {
        const error = await res.json();
        console.error("Google login failed:", error);
        onError?.();
      }
    } catch (err) {
      console.error("Network error:", err);
      onError?.();
    }
  };

  // Tempat tombol Google bakal muncul
  return (
    <div className="flex justify-center mt-6">
      <div ref={buttonDivRef} />
    </div>
  );
}
