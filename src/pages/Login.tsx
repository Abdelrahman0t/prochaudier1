import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import tokenManager from '../utils/tokenManager'; // Import the token manager
import { useAuth } from '../hooks/useAuth';
import { apiPost } from '../utils/api';

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

// Real Google Login component
interface GoogleLoginProps {
  onLoginSuccess: (data: any) => void;
}

const GoogleLogin = ({ onLoginSuccess }: GoogleLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          window.google.accounts.id.renderButton(
            document.getElementById("googleLoginDiv"),
            {
              theme: "outline",
              size: "large",
              width: 256,
              text: "signin_with",
              shape: "rectangular"
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
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
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
          credential: response.credential
        }),
      });

      console.log("Backend response status:", res.status);

      const data = await res.json();
      console.log("Backend response data:", data);

      if (res.ok) {
        console.log("Google authentication successful!");
              
        // Store tokens and user data
        if (data.access) {
          console.log("Access token received");
        }
        if (data.refresh) {
          console.log("Refresh token received");
        }
        if (data.user) {
          console.log("User info received:", data.user.username);
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
    <div className="w-full">
      <div id="googleLoginDiv" className={`flex justify-center ${isLoading ? "opacity-50" : ""}`}></div>
      {error && (
        <div className="text-red-500 text-sm mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="text-blue-500 text-sm mt-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Authenticating with Google...
          </div>
        </div>
      )}
    </div>
  );
};

interface AuthPageProps {
  onLoginSuccess?: (data: any) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    first_name: "", 
    last_name: "", 
    username: "", 
    email: "", 
    password: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Check if user is already authenticated on component mount


  // Function to merge guest orders after successful authentication
// Function to merge guest orders after successful authentication
// Function to merge guest orders after successful authentication
// Function to merge guest orders after successful authentication
const mergeGuestOrders = async (accessToken: string) => {
  const guestId = localStorage.getItem('guest_id');
  if (!guestId) {
    console.log('No guest_id found, skipping merge');
    return;
  }

  try {
    // Just use the fresh token directly - don't mess with storage
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/merge-guest-orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ guest_id: guestId })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Guest orders merged successfully:', data);
      localStorage.removeItem('guest_id');
    } else {
      console.warn('Failed to merge guest orders:', data);
    }
  } catch (error) {
    console.warn('Error during guest order merge:', error);
  }
};

  // Modified function to handle successful authentication with token management
// Modified function to handle successful authentication with token management
// Modified function to handle successful authentication with token management

const handleSuccessfulAuth = async (data: any) => {
  console.log("Authentication successful:", data);
     
  // Store tokens FIRST so they're available for API calls
  tokenManager.storeTokens(data);
     
  // Try to merge guest orders with the fresh token
  await mergeGuestOrders(data.access);
     
  // Store user data
  const userData = data.user || {};
  const username = userData.username || loginData.username || registerData.username;
     
  // Show success message first
  const welcomeMessage = data.is_new_user 
    ? `Welcome to our platform, ${userData.first_name || userData.email || username}! Your account has been created.`
    : `Welcome back, ${userData.first_name || userData.email || username}!`;
     
  setSuccess(welcomeMessage);
  setRedirecting(true);
   
  // Determine redirect path based on username
  const redirectPath = username === "pro_chaud_admin" ? "/admin" : "/";
     
  // If onLoginSuccess callback is provided, use it
  if (onLoginSuccess) {
    onLoginSuccess({ ...data, redirectPath });
    return;
  }
   
  // Perform actual redirect after showing success message
  setTimeout(() => {
    console.log(`Redirecting ${username} to ${redirectPath}`);
    navigate(redirectPath);
  }, 2000);
};

const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setSuccess(null);
     
  console.log("Attempting login with:", {
    username: loginData.username,
    password: "***"
  });
     
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
           
    console.log("Response status:", res.status);
           
    const data = await res.json();
    console.log("Response data:", data);
       
    if (res.ok) {
      console.log("Login successful, tokens received");
               
      // Handle successful authentication with token management
      handleSuccessfulAuth({
        ...data,
        user: {
          username: loginData.username,
          ...data.user
        }
      });
    } else {
      console.error("Login failed with status:", res.status);
      console.error("Error details:", data);
               
      if (data.details) {
        const errorMessages = [];
        for (const [field, messages] of Object.entries(data.details)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else {
            errorMessages.push(messages);
          }
        }
        setError(errorMessages.join('. '));
      } else {
        const errorMessage = data.error || `Login failed (${res.status})`;
        setError(errorMessage);
      }
    }
  } catch (err) {
    console.error("Network error during login:", err);
    setError("Network error. Please check your connection and try again.");
  } finally {
    setIsLoading(false);
  }
};

 

const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };


  



const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setSuccess(null);
     
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });
           
    const data = await res.json();
           
    if (res.ok) {
      console.log("Registration successful, auto-login initiated");
      
      // Clear form immediately
      setRegisterData({ first_name: "", last_name: "", username: "", email: "", password: "" });
      
      // Check if the backend already returns tokens (auto-login)
      if (data.access && data.refresh) {
        console.log("Registration included auto-login tokens");
        
        // Handle successful registration with auto-login
        await handleSuccessfulAuth({
          ...data,
          is_new_user: true,
          user: {
            username: registerData.username,
            first_name: registerData.first_name,
            last_name: registerData.last_name,
            email: registerData.email,
            ...data.user
          }
        });
      } else {
        // If backend doesn't auto-login, perform manual login
        console.log("Backend doesn't auto-login, performing manual login");
        
        try {
          const loginRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: registerData.username,
              password: registerData.password
            }),
          });
          
          const loginData = await loginRes.json();
          
          if (loginRes.ok) {
            console.log("Auto-login after registration successful");
            
            await handleSuccessfulAuth({
              ...loginData,
              is_new_user: true,
              user: {
                username: registerData.username,
                first_name: registerData.first_name,
                last_name: registerData.last_name,
                email: registerData.email,
                ...loginData.user
              }
            });
          } else {
            // If auto-login fails, show error but don't switch to login form
            console.error("Auto-login failed after registration:", loginData);
            setError("Registration successful but auto-login failed. Please try logging in manually.");
            // Optionally, you could switch to login tab here:
            // setActiveTab('login');
          }
        } catch (loginErr) {
          console.error("Network error during auto-login:", loginErr);
          setError("Registration successful but auto-login failed due to network error. Please try logging in manually.");
          // Optionally switch to login tab:
          // setActiveTab('login');
        }
      }
    } else {
      // Handle registration errors
      if (data.details) {
        const errorMessages = [];
        for (const [field, messages] of Object.entries(data.details)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else {
            errorMessages.push(messages);
          }
        }
        setError(errorMessages.join('. '));
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    }
  } catch (err) {
    console.error("Network error during registration:", err);
    setError("Network error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleGoogleSuccess = (data: any) => {
    console.log("Google login success:", data);
    handleSuccessfulAuth(data);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setRedirecting(false);
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-10 -translate-x-10 sm:translate-y-12 sm:-translate-x-12 opacity-50"></div>
      
      <div className="relative z-10">
        {/* Header with Improved Logo */}
        <div className="flex flex-col justify-center items-center text-center mb-6 sm:mb-8">
          {/* Responsive Logo Container */}
          <div className="w-full flex justify-center mb-4">
            <div className="relative">
              {/* Logo */}
              <img
                src="/Design-sans-titre-2.png"
                alt="Logo Pro Chaudière"
                className="h-16 w-auto object-contain transition-all duration-300
                  xs:h-18
                  sm:h-20 
                  md:h-24 
                  lg:h-28
                  max-w-full"
                style={{ maxHeight: '7rem' }}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              
              {/* Fallback logo */}
              <div className="hidden w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">PC</span>
              </div>
            </div>
          </div>
          
          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base px-2 leading-relaxed">
            {isLogin 
              ? "Connectez-vous pour accéder à votre compte" 
              : "Rejoignez-nous et commencez votre aventure"}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
  <button
    onClick={() => toggleMode(true)} // true for login
    disabled={isLoading || redirecting}
    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
      isLogin
        ? 'bg-white text-cyan-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    Se connecter
  </button>
  <button
    onClick={() => toggleMode(false)} // false for register
    disabled={isLoading || redirecting}
    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
      !isLogin
        ? 'bg-white text-cyan-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    S'inscrire
  </button>
</div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {redirecting ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-green-700 text-sm font-medium block break-words">{success}</span>
                {redirecting && (
                  <span className="text-green-600 text-xs mt-1 block">
                    Redirection vers { (loginData.username === "pro_chaud_admin" || registerData.username === "pro_chaud_admin") ? "le tableau de bord admin" : "la page principale"}...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-red-700 text-sm font-medium break-words">{error}</span>
            </div>
          </div>
        )}

        {/* Forms */}
        <div className="transition-all duration-300">
          {isLogin ? (
            /* Login Form */
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading || redirecting}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading || redirecting}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                />
              </div>
              
              <button 
                onClick={handleLoginSubmit}
                disabled={isLoading || redirecting}
                className="bg-cyan-600 text-white w-full py-3 sm:py-4 font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion...
                  </div>
                ) : redirecting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirection...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          ) : (
            /* Register Form */
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="Jean"
                    value={registerData.first_name}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading || redirecting}
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    placeholder="Dupont"
                    value={registerData.last_name}
                    onChange={handleRegisterChange}
                    required
                    disabled={isLoading || redirecting}
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Choisissez un nom d'utilisateur"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading || redirecting}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Entrez votre e-mail"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading || redirecting}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Créez un mot de passe"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  disabled={isLoading || redirecting}
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all text-sm sm:text-base"
                />
              </div>
              
              <button 
                onClick={handleRegisterSubmit}
                disabled={isLoading || redirecting}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création du compte...
                  </div>
                ) : redirecting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirection...
                  </div>
                ) : (
                  "Créer un compte"
                )}
              </button>
            </div>
          )}
                      <div className="mb-5 sm:mb-6 mt-5 w-full">
              <GoogleLogin onLoginSuccess={handleGoogleSuccess} />
            </div>
        </div>

        {/* Divider */}
        {!redirecting && (
          <>
          
            <div className="flex items-center gap-4 my-5 sm:my-6">
              
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              
              <span className="text-gray-500 text-sm font-medium px-2">ou</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Google Login */}




            {/* Toggle */}


            {!redirecting && (
  <div className="mt-5 sm:mt-6">
    <button
      onClick={() => navigate('/')}
      disabled={isLoading}
      className="w-full py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base flex items-center justify-center gap-2"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z" />
      </svg>
      Continuer en tant qu'invité
    </button>
  </div>
)}
          </>
        )}
      </div>
    </div>
  </div>
);

}