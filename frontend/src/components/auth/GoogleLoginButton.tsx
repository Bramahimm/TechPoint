import { useEffect, useRef } from "react";

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

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      console.error("Google credential not found");
      onError?.();
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/google/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include", // penting untuk session Laravel
        body: JSON.stringify({ credential: response.credential }),
      });

      if (res.ok) {
        onSuccess?.();
        window.location.href = "/dashboard";
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
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
        width: 320,
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center mt-6">
      <div ref={buttonDivRef} />
    </div>
  );
}
