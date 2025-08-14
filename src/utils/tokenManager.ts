// src/utils/tokenManager.ts - Global token management system
export interface AuthData {
  access_token: string;
  refresh_token: string;
  created_at: number;
  expires_in: number; // in milliseconds
  user?: any;
}

class TokenManager {
  private checkInterval = 60000; // Check every minute
  private intervalId: number | null = null;
  private onTokenExpiredCallback: (() => void) | null = null;

  constructor() {
    this.startMonitoring();
    this.setupVisibilityListener();
  }

  // Set token expiration time (default: 1 day)
  private getExpirationTime(): number {
    return 24 * 60 * 60 * 1000; // 1 day in milliseconds
  }

  // Store tokens with expiration timestamp
  storeTokens(data: any, customExpiration?: number): void {
    const authData: AuthData = {
      access_token: data.access,
      refresh_token: data.refresh,
      created_at: Date.now(),
      expires_in: customExpiration || this.getExpirationTime(),
      user: data.user || {}
    };

    // Store in new format
    localStorage.setItem("auth_data", JSON.stringify(authData));
    
    // Keep backward compatibility (but these will be cleaned up on expiration)
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    console.log(`🔐 Tokens stored. Will expire in ${authData.expires_in / 1000 / 60} minutes`);
  }

  // Get valid token (returns null if expired)
  getValidToken(): string | null {
    const authDataStr = localStorage.getItem("auth_data");
    if (!authDataStr) {
      // Check for old format tokens
      const oldToken = localStorage.getItem("access_token");
      if (oldToken) {
        console.warn("Found old format token, cleaning up...");
        this.clearAllTokens();
      }
      return null;
    }

    try {
      const authData: AuthData = JSON.parse(authDataStr);
      const now = Date.now();
      const tokenAge = now - authData.created_at;

      if (tokenAge > authData.expires_in) {
        console.log("⏰ Token expired, removing from storage");
        this.clearAllTokens();
        this.handleTokenExpiration();
        return null;
      }

      // Token is still valid
      return authData.access_token;
    } catch (error) {
      console.error("Error parsing auth data:", error);
      this.clearAllTokens();
      return null;
    }
  }

  // Check if user is authenticated with valid token
  isAuthenticated(): boolean {
    return this.getValidToken() !== null;
  }

  // Get user data if token is valid
  getUserData(): any | null {
    const authDataStr = localStorage.getItem("auth_data");
    if (!authDataStr) return null;

    try {
      const authData: AuthData = JSON.parse(authDataStr);
      const now = Date.now();
      const tokenAge = now - authData.created_at;

      if (tokenAge > authData.expires_in) {
        this.clearAllTokens();
        this.handleTokenExpiration();
        return null;
      }

      return authData.user;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Get time remaining until expiration (in minutes)
  getTimeUntilExpiration(): number | null {
    const authDataStr = localStorage.getItem("auth_data");
    if (!authDataStr) return null;

    try {
      const authData: AuthData = JSON.parse(authDataStr);
      const now = Date.now();
      const tokenAge = now - authData.created_at;
      const remainingTime = authData.expires_in - tokenAge;

      if (remainingTime <= 0) {
        this.clearAllTokens();
        this.handleTokenExpiration();
        return null;
      }

      return Math.floor(remainingTime / (1000 * 60)); // Convert to minutes
    } catch (error) {
      console.error("Error calculating expiration time:", error);
      return null;
    }
  }

  // Clear all tokens from localStorage
  clearAllTokens(): void {
    localStorage.removeItem("auth_data");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log("🗑️ All tokens cleared from storage");
  }

  // Start monitoring token expiration
  private startMonitoring(): void {
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Start periodic token validation
    this.intervalId = setInterval(() => {
      this.validateToken();
    }, this.checkInterval);

    console.log("🔍 Token monitoring started");
  }

  // Stop monitoring (cleanup)
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("🛑 Token monitoring stopped");
    }
  }

  // Validate token and handle expiration
  private validateToken(): boolean {
    const authDataStr = localStorage.getItem("auth_data");
    if (!authDataStr) return false;

    try {
      const authData: AuthData = JSON.parse(authDataStr);
      const now = Date.now();
      const tokenAge = now - authData.created_at;

      if (tokenAge > authData.expires_in) {
        console.log("⏰ Token expired during validation");
        this.clearAllTokens();
        this.handleTokenExpiration();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      this.clearAllTokens();
      return false;
    }
  }

  // Handle token expiration
  private handleTokenExpiration(): void {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('tokenExpired', {
      detail: { message: 'Your session has expired. Please log in again.' }
    }));

    // Call callback if set
    if (this.onTokenExpiredCallback) {
      this.onTokenExpiredCallback();
    }

    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      console.log("🔄 Redirecting to login due to token expiration");
      window.location.href = '/login';
    }
  }

  // Setup visibility change listener (check when user switches back to tab)
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log("🔍 Tab became visible, checking token validity");
        this.validateToken();
      }
    });
  }

  // Set callback for token expiration
  onTokenExpired(callback: () => void): void {
    this.onTokenExpiredCallback = callback;
  }

  // Extend token expiration (useful for refresh token scenarios)
  extendExpiration(additionalTime?: number): boolean {
    const authDataStr = localStorage.getItem("auth_data");
    if (!authDataStr) return false;

    try {
      const authData: AuthData = JSON.parse(authDataStr);
      const extension = additionalTime || this.getExpirationTime();
      
      // Reset the creation time to now and extend expiration
      authData.created_at = Date.now();
      authData.expires_in = extension;
      
      localStorage.setItem("auth_data", JSON.stringify(authData));
      console.log(`⏰ Token expiration extended by ${extension / 1000 / 60} minutes`);
      return true;
    } catch (error) {
      console.error("Error extending token expiration:", error);
      return false;
    }
  }
}

// Create and export singleton instance
const tokenManager = new TokenManager();
export default tokenManager;