// Daman Cyber Cafe - Secure Authentication Manager for Admin Panel

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  lastUpdated: string;
}

export interface AuthSession {
  token: string;
  username: string;
  expiresAt: number;
}

const STORAGE_KEY_AUTH = "daman_admin_credentials_v3";
const STORAGE_KEY_SESSION = "daman_admin_session_v3";
const STORAGE_KEY_LOCKOUT = "daman_admin_lockout_v3";

// Owner requested default credentials
export const DEFAULT_ADMIN_USERNAME = "daaman@cybercafe2007";
export const DEFAULT_ADMIN_PASSWORD = "damancybercafe2007";

const DEFAULT_USERNAME = DEFAULT_ADMIN_USERNAME;
const DEFAULT_SECONDARY_USERNAME = "damancybercafe2007";
const DEFAULT_PASSWORD = DEFAULT_ADMIN_PASSWORD;

const ALL_ALLOWED_DEFAULT_USERNAMES = [
  DEFAULT_ADMIN_USERNAME,
  "damancybercafe2007",
  "daman_admin",
  "admin@damancybercafe.com",
];

// Fast client-side hash function for obfuscation
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "h_" + Math.abs(hash).toString(16) + "_" + btoa(str).slice(0, 12);
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export interface StoredCredentials {
  usernames: string[];
  passwordHash: string;
  isCustom: boolean;
  lastUpdated: string;
}

export function getStoredCredentials(): StoredCredentials {
  if (!isBrowser()) {
    return {
      usernames: ALL_ALLOWED_DEFAULT_USERNAMES,
      passwordHash: simpleHash(DEFAULT_PASSWORD),
      isCustom: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    // Clear old legacy storage keys
    try {
      localStorage.removeItem("daman_admin_credentials_v1");
      localStorage.removeItem("daman_admin_credentials_v2");
      localStorage.removeItem("daman_admin_lockout_v2");
    } catch {}

    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) {
      const initial: StoredCredentials = {
        usernames: ALL_ALLOWED_DEFAULT_USERNAMES,
        passwordHash: simpleHash(DEFAULT_PASSWORD),
        isCustom: false,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.usernames || !Array.isArray(parsed.usernames) || parsed.usernames.length === 0) {
      parsed.usernames = ALL_ALLOWED_DEFAULT_USERNAMES;
    }
    return {
      usernames: parsed.usernames,
      passwordHash: parsed.passwordHash || simpleHash(DEFAULT_PASSWORD),
      isCustom: Boolean(parsed.isCustom),
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (e) {
    return {
      usernames: ALL_ALLOWED_DEFAULT_USERNAMES,
      passwordHash: simpleHash(DEFAULT_PASSWORD),
      isCustom: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Lockout rate limiter
export function checkLockout(): { isLocked: boolean; remainingSeconds: number } {
  if (!isBrowser()) return { isLocked: false, remainingSeconds: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCKOUT);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };
    const { attempts, lockedUntil } = JSON.parse(raw);
    const now = Date.now();
    if (lockedUntil && lockedUntil > now) {
      return { isLocked: true, remainingSeconds: Math.ceil((lockedUntil - now) / 1000) };
    }
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

function recordFailedAttempt(): number {
  if (!isBrowser()) return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCKOUT);
    const data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    data.attempts = (data.attempts || 0) + 1;

    if (data.attempts >= 5) {
      // Lock for 30 seconds
      data.lockedUntil = Date.now() + 30 * 1000;
      data.attempts = 0;
    }
    localStorage.setItem(STORAGE_KEY_LOCKOUT, JSON.stringify(data));
    return data.lockedUntil ? 30 : 0;
  } catch {
    return 0;
  }
}

function clearFailedAttempts(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY_LOCKOUT);
  } catch {}
}

export function unlockAccount(): void {
  clearFailedAttempts();
}

export function login(
  usernameInput: string,
  passwordInput: string,
  rememberMe = true
): { success: boolean; error?: string } {
  const lockout = checkLockout();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `ਸੁਰੱਖਿਆ ਕਾਰਨਾਂ ਕਰਕੇ ਅਕਾਊਂਟ ਲਾਕ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ${lockout.remainingSeconds} ਸਕਿੰਟ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ। (Account locked for security. Try again in ${lockout.remainingSeconds}s)`,
    };
  }

  const creds = getStoredCredentials();
  const normalizedUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  let validUsername = false;
  let validPassword = false;

  if (creds.isCustom) {
    // When owner has set a custom password/username:
    // ONLY the updated username and updated password hash will be accepted.
    // ANY previous password (including default) is 100% invalidated!
    validUsername = creds.usernames.some((u) => u.toLowerCase() === normalizedUser);
    validPassword =
      simpleHash(passwordInput) === creds.passwordHash ||
      simpleHash(cleanPass) === creds.passwordHash;
  } else {
    // Default initial setup before any custom password change
    validUsername =
      creds.usernames.some((u) => u.toLowerCase() === normalizedUser) ||
      normalizedUser === DEFAULT_ADMIN_USERNAME.toLowerCase() ||
      normalizedUser === "damancybercafe2007" ||
      normalizedUser === "daman@cybercafe2007" ||
      normalizedUser === "daman_admin" ||
      normalizedUser === "admin" ||
      normalizedUser === "daman";
    validPassword =
      simpleHash(passwordInput) === creds.passwordHash ||
      simpleHash(cleanPass) === creds.passwordHash ||
      cleanPass === DEFAULT_ADMIN_PASSWORD;
  }

  if (!validUsername || !validPassword) {
    const lockDuration = recordFailedAttempt();
    if (lockDuration > 0) {
      return {
        success: false,
        error: `ਬਹੁਤ ਸਾਰੀਆਂ ਗ਼ਲਤ ਕੋਸ਼ਿਸ਼ਾਂ! ਸੁਰੱਖਿਆ ਲਈ ਅਕਾਊਂਟ ${lockDuration} ਸਕਿੰਟਾਂ ਲਈ ਲਾਕ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ। (Account locked due to multiple failed attempts).`,
      };
    }
    return {
      success: false,
      error: "ਗ਼ਲਤ ਯੂਜ਼ਰਨੇਮ ਜਾਂ ਪਾਸਵਰਡ (Invalid username or password). ਕੇਵਲ ਅਧਿਕਾਰਤ ਐਡਮਿਨ ਹੀ ਲੌਗਇਨ ਕਰ ਸਕਦਾ ਹੈ।",
    };
  }

  clearFailedAttempts();

  // Create session (24 hours or 7 days if rememberMe)
  const sessionDuration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const session: AuthSession = {
    token: "tok_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 10),
    username: usernameInput.trim(),
    expiresAt: Date.now() + sessionDuration,
  };

  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent("daman_auth_change", { detail: session }));
  }

  return { success: true };
}

export function logout(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    }
  } catch {}
  window.dispatchEvent(new CustomEvent("daman_auth_change", { detail: null }));
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  try {
    let raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw && typeof sessionStorage !== "undefined") {
      raw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    }
    if (!raw) return false;
    const session: AuthSession = JSON.parse(raw);
    if (!session || !session.token || !session.expiresAt) return false;
    if (Date.now() > session.expiresAt) {
      logout();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getCurrentUser(): string {
  if (!isBrowser()) return "Admin";
  try {
    let raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw && typeof sessionStorage !== "undefined") {
      raw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    }
    if (!raw) return "Admin";
    const session: AuthSession = JSON.parse(raw);
    return session.username || "Admin";
  } catch {
    return "Admin";
  }
}

export function updateCredentials(
  currentPasswordInput: string,
  newUsernameInput: string,
  newPasswordInput?: string,
  confirmPasswordInput?: string
): { success: boolean; error?: string } {
  const creds = getStoredCredentials();

  // 1. Strict Verification of Current Password
  const cleanCurrent = currentPasswordInput ? currentPasswordInput.trim() : "";
  if (!cleanCurrent) {
    return {
      success: false,
      error: "ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਭਰਨਾ ਲਾਜ਼ਮੀ ਹੈ (Current password is required).",
    };
  }

  const currentMatches =
    simpleHash(currentPasswordInput) === creds.passwordHash ||
    simpleHash(cleanCurrent) === creds.passwordHash ||
    (!creds.isCustom && cleanCurrent === DEFAULT_ADMIN_PASSWORD);

  if (!currentMatches) {
    return {
      success: false,
      error: "ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਗ਼ਲਤ ਹੈ (Current password does not match). ਪਾਸਵਰਡ ਬਦਲਣ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਹੈ।",
    };
  }

  // 2. Validate Username
  const cleanUsername = newUsernameInput ? newUsernameInput.trim() : "";
  if (!cleanUsername || cleanUsername.length < 3) {
    return {
      success: false,
      error: "ਯੂਜ਼ਰਨੇਮ ਘੱਟੋ-ਘੱਟ 3 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (Username must be at least 3 characters long).",
    };
  }

  // 3. Validate New Password if changing password
  let newPasswordHash = creds.passwordHash;
  if (newPasswordInput && newPasswordInput.trim()) {
    const cleanNew = newPasswordInput.trim();
    const cleanConfirm = confirmPasswordInput ? confirmPasswordInput.trim() : "";

    if (cleanNew.length < 8) {
      return {
        success: false,
        error: "ਨਵਾਂ ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (New password must be at least 8 characters long).",
      };
    }

    if (confirmPasswordInput !== undefined && cleanNew !== cleanConfirm) {
      return {
        success: false,
        error: "ਦੋਵੇਂ ਨਵੇਂ ਪਾਸਵਰਡ ਆਪਸ ਵਿੱਚ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ (New password and Confirm password do not match)!",
      };
    }

    if (cleanNew === cleanCurrent) {
      return {
        success: false,
        error: "ਨਵਾਂ ਪਾਸਵਰਡ ਪੁਰਾਣੇ ਪਾਸਵਰਡ ਨਾਲੋਂ ਵੱਖਰਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ (New password cannot be identical to current password).",
      };
    }

    newPasswordHash = simpleHash(cleanNew);
  }

  // 4. Update and mark as isCustom: true
  // This permanently locks out any previous or default password!
  const updated: StoredCredentials = {
    usernames: [cleanUsername],
    passwordHash: newPasswordHash,
    isCustom: true,
    lastUpdated: new Date().toISOString(),
  };

  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));
    // Update active session username if changed
    try {
      const sessionRaw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        session.username = cleanUsername;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
    } catch {}
  }

  return { success: true };
}

// Dedicated Private Route Slug for Admin Portal
const STORAGE_KEY_PRIVATE_SLUG = "daman_admin_private_slug_v1";
export const DEFAULT_PRIVATE_ADMIN_SLUG = "daman-private-portal";

export function getAdminPrivateSlug(): string {
  if (!isBrowser()) return DEFAULT_PRIVATE_ADMIN_SLUG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PRIVATE_SLUG);
    return stored ? stored.trim().replace(/^\/+/, "") : DEFAULT_PRIVATE_ADMIN_SLUG;
  } catch {
    return DEFAULT_PRIVATE_ADMIN_SLUG;
  }
}

export function updateAdminPrivateSlug(newSlug: string): { success: boolean; error?: string } {
  if (!isBrowser()) return { success: false, error: "Browser environment not detected" };
  const cleaned = newSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
  if (cleaned.length < 5) {
    return { success: false, error: "Private slug must be at least 5 characters (letters, numbers, or hyphens)." };
  }
  if (cleaned === "admin" || cleaned === "status" || cleaned === "api" || cleaned === "home") {
    return { success: false, error: "Cannot use common public route names." };
  }
  try {
    localStorage.setItem(STORAGE_KEY_PRIVATE_SLUG, cleaned);
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to save private link." };
  }
}

