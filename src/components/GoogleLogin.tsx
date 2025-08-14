import { useEffect, useState } from "react";

interface GoogleLoginProps {
  onLoginSuccess: (data: any) => void;
}

export default function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id:
              import.meta.env.VITE_GOOGLE_CLIENT_ID ||,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(
            document.getElementById("googleLoginDiv"),
            {
              theme: "outline",
              size: "large",
              width: 256,
              text: "signin_with",
              shape: "rectangular",
            }
          );
        } catch (err) {
          setError("Failed to initialize Google Sign-In");
          console.error("Google initialization error:", err);
        }
      }
    };

    // Load Google Script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => setError("Failed to load Google Sign-In script");
      document.head.appendChild(script);

      return () => {
        try {
          document.head.removeChild(script);
        } catch (e) {
          // Script might have been removed already
        }
      };
    } else {
      initializeGoogle();
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    console.log("Google credential response received:", response);
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending credential to backend...");

      // Send the Google credential to your backend
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/auth/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      console.log("Backend response status:", res.status);

      const data = await res.json();
      console.log("Backend response data:", data);

      if (res.ok) {
        console.log("Google authentication successful!", data.access);
              
        // ✅ Store tokens in localStorage
        if (data.access) {
  localStorage.setItem("access_token", data.access);
  console.log("Access token stored:", data.access);
}
if (data.refresh) {
  localStorage.setItem("refresh_token", data.refresh);
  console.log("Refresh token stored:", data.refresh);
}
if (data.user) {
  localStorage.setItem("user", JSON.stringify(data.user));
  console.log("User info stored:", data.user.username);
}


        onLoginSuccess(data);
      } else {
        console.error("Google authentication failed:", data);
        setError(data.error || "Google authentication failed");
      }
    } catch (err) {
      console.error("Network error during Google authentication:", err);
      setError("Network error during Google authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64">
      <div id="googleLoginDiv" className={isLoading ? "opacity-50" : ""}></div>
      {error && (
        <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="text-blue-500 text-sm mt-2">
          Authenticating with Google...
        </div>
      )}
    </div>
  );
}

// Type declaration for the Google API
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

