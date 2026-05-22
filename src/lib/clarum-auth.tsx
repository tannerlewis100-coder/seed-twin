import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const API_BASE = "https://admin.clarumpeptides.com/wp-json";
const TOKEN_KEY = "clarum_jwt";
const UTM_KEY = "clarum_utm";

export type ClarumUser = {
  id?: number;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  marketing_opt_in?: boolean;
  welcome_coupon?: {
    code: string;
    used?: boolean;
    amount?: string | number;
    discount_type?: string;
  } | null;
  orders?: ClarumOrderSummary[];
};

export type ClarumOrderSummary = {
  id: number;
  number?: string;
  status?: string;
  date_created?: string;
  total?: string;
  currency?: string;
  items?: Array<{ name: string; quantity: number }>;
};

export type Utm = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

// ─── Token ────────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// ─── UTM capture ──────────────────────────────────────────────────────────

export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const next: Utm = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      const v = params.get(k);
      if (v) next[k] = v;
    }
    if (Object.keys(next).length === 0) return;
    const existing = getUtm();
    localStorage.setItem(UTM_KEY, JSON.stringify({ ...existing, ...next }));
  } catch {
    /* ignore */
  }
}

export function getUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as Utm) : {};
  } catch {
    return {};
  }
}

// ─── API ─────────────────────────────────────────────────────────────────

async function jsonFetch<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || (data.data && data.data.message))) ||
      `Request failed (${res.status})`;
    throw new Error(String(msg).replace(/<[^>]+>/g, ""));
  }
  return data as T;
}

export type SignupResponse = {
  token: string;
  user: ClarumUser;
  welcome_coupon?: { code: string } | string;
};

export async function signupApi(input: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  marketing_opt_in: boolean;
}): Promise<SignupResponse> {
  const utm = getUtm();
  return jsonFetch<SignupResponse>(`${API_BASE}/clarum/v1/signup`, {
    method: "POST",
    body: JSON.stringify({ ...input, ...utm }),
  });
}

export type LoginResponse = {
  token: string;
  user_email: string;
  user_nicename?: string;
  user_display_name?: string;
};

export async function loginApi(input: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  return jsonFetch<LoginResponse>(`${API_BASE}/jwt-auth/v1/token`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchMe(token: string): Promise<ClarumUser> {
  return jsonFetch<ClarumUser>(`${API_BASE}/clarum/v1/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type NewsletterResponse = { coupon: string | { code: string } };

export async function newsletterApi(email: string): Promise<NewsletterResponse> {
  const utm = getUtm();
  return jsonFetch<NewsletterResponse>(`${API_BASE}/clarum/v1/newsletter`, {
    method: "POST",
    body: JSON.stringify({ email, ...utm }),
  });
}

export function couponCode(c: SignupResponse["welcome_coupon"] | NewsletterResponse["coupon"]): string {
  if (!c) return "";
  if (typeof c === "string") return c;
  if (typeof c === "object" && "code" in c) return c.code;
  return "";
}

// ─── Provider ────────────────────────────────────────────────────────────

type Ctx = {
  user: ClarumUser | null;
  token: string | null;
  loading: boolean;
  setSession: (token: string, user?: ClarumUser | null) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
};

const ClarumAuthCtx = createContext<Ctx | null>(null);

export function ClarumAuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<ClarumUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setTok(null);
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await fetchMe(t);
      setTok(t);
      setUser(me);
    } catch (err) {
      // 401 or other — clear token
      const msg = err instanceof Error ? err.message : "";
      if (/401|unauthor/i.test(msg)) {
        setToken(null);
        setTok(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const setSession = useCallback(async (newToken: string, prefetched?: ClarumUser | null) => {
    setToken(newToken);
    setTok(newToken);
    if (prefetched) {
      setUser(prefetched);
    }
    try {
      const me = await fetchMe(newToken);
      setUser(me);
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setTok(null);
    setUser(null);
  }, []);

  useEffect(() => {
    captureUtmFromUrl();
    refresh();
  }, [refresh]);

  return (
    <ClarumAuthCtx.Provider value={{ user, token, loading, setSession, signOut, refresh }}>
      {children}
    </ClarumAuthCtx.Provider>
  );
}

export function useClarumAuth(): Ctx {
  const ctx = useContext(ClarumAuthCtx);
  if (!ctx) throw new Error("useClarumAuth must be used inside ClarumAuthProvider");
  return ctx;
}
