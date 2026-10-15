/**
 * CyberScore TN — API Client
 * Connects the Next.js frontend to the FastAPI backend.
 */

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // Under production domain or reverse proxy, use relative path so cookies are same-origin
    if (window.location.hostname === "cyberscore.tn" || window.location.hostname === "www.cyberscore.tn") {
      return "";
    }
  }
  return "http://localhost:8000";
}

// ── Token Management (Legacy Bearer Support + HttpOnly Migration) ──

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cyberscore_token");
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cyberscore_token", token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cyberscore_token");
    localStorage.removeItem("cyberscore_user");
  }
}

// ── Generic fetch helper ────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  // If explicit Bearer token is present, include it for backward compatibility
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const base = getApiBase();
  const res = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include", // Transmit HttpOnly authentication cookies
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }

  return res.json();
}

// ── Scan API ────────────────────────────────────────────

export interface ScanResult {
  scan_id: number;
  target: string;
  scan_type: string;
  total_score: number;
  grade: string;
  star_rating: number;
  grade_label_ar: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  duration_ms: number;
  scanner_count: number;
  category_breakdown: CategoryBreakdown[];
  findings: Finding[];
  info_findings: Finding[];
}

export interface CategoryBreakdown {
  category: string;
  score: number;
  max_score: number;
  weight: number;
  normalized_score: number;
  weighted_contribution: number;
  findings_count: number;
  label_ar: string;
  label_fr: string;
}

export interface Finding {
  category: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  remediation: string;
  owasp_category?: string;
  nist_control?: string;
  iso27002_control?: string;
}

export interface ScanSummary {
  id: number;
  url: string;
  scan_type: string;
  status: string;
  total_score: number | null;
  grade: string | null;
  star_rating: number | null;
  critical_count: number;
  duration_ms: number | null;
  created_at: string | null;
}

export async function runScan(
  url: string,
  scanType: "quick" | "standard" | "deep" = "standard"
): Promise<ScanResult> {
  return apiFetch<ScanResult>("/api/scans/run", {
    method: "POST",
    body: JSON.stringify({ url, scan_type: scanType }),
  });
}

export async function getRecentScans(limit = 20): Promise<{ scans: ScanSummary[]; total: number }> {
  return apiFetch(`/api/scans/recent?limit=${limit}`);
}

export async function getScanDetail(scanId: number): Promise<ScanResult> {
  return apiFetch(`/api/scans/${scanId}`);
}

export async function getScanHistory(websiteUrl: string): Promise<{ scans: ScanSummary[] }> {
  return apiFetch(`/api/scans/history/${encodeURIComponent(websiteUrl)}`);
}

// ── Dashboard API ───────────────────────────────────────

export interface DashboardStats {
  total_sites: number;
  total_scans: number;
  average_score: number;
  critical_alerts: number;
  scans_today: number;
  recent_scans: ScanSummary[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch("/api/dashboard/stats");
}

// ── Data API ────────────────────────────────────────────

export interface Sector {
  id: number;
  name_ar: string;
  name_fr: string;
  name_en?: string;
  icon?: string;
  org_count: number;
}

export async function getSectors(): Promise<{ sectors: Sector[]; total: number }> {
  return apiFetch("/api/sectors");
}

export async function getOrganizations(sectorId?: number): Promise<{ organizations: any[]; total: number }> {
  const query = sectorId ? `?sector_id=${sectorId}` : "";
  return apiFetch(`/api/organizations${query}`);
}

// ── WebSocket for Scan Progress ─────────────────────────

export function connectScanWebSocket(
  scanId: number,
  onProgress: (data: any) => void,
  onComplete: (data: any) => void
): WebSocket {
  const base = getApiBase();
  let wsUrl: string;
  if (!base && typeof window !== "undefined") {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    wsUrl = `${proto}//${window.location.host}`;
  } else {
    wsUrl = base.replace(/^http/, "ws");
  }
  const ws = new WebSocket(`${wsUrl}/api/scans/ws/${scanId}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "progress") {
      onProgress(data);
    } else if (data.type === "complete") {
      onComplete(data);
    }
  };

  ws.onerror = (err) => console.error("WebSocket error:", err);

  return ws;
}

// ── Health Check ────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string }> {
  return apiFetch("/health");
}

// ── Auth & Accreditation API ────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "auditor" | "viewer";
  organization_name?: string;
  position?: string;
  status: "pending" | "approved" | "rejected";
  preferred_language: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface AccreditationRequestData {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
  position?: string;
  matricule?: string;
  phone?: string;
  role?: string;
  preferred_language?: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // Primary security: JWT is stored in server-issued HttpOnly cookie (immune to XSS).
  // User profile information is saved in localStorage solely for UI display.
  if (res.user && typeof window !== "undefined") {
    localStorage.setItem("cyberscore_user", JSON.stringify(res.user));
  }
  return res;
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Continue cleanup even if server is unreachable
  }
  removeStoredToken();
}

export async function registerAccreditation(data: AccreditationRequestData): Promise<{ status: string; message: string; request_id: number }> {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiFetch("/api/auth/me");
}

export async function getAccreditationRequests(statusFilter?: string): Promise<{ requests: any[]; total: number }> {
  const query = statusFilter ? `?status_filter=${statusFilter}` : "";
  return apiFetch(`/api/auth/requests${query}`);
}

export async function approveAccreditationRequest(userId: number): Promise<{ status: string; message: string }> {
  return apiFetch(`/api/auth/requests/${userId}/approve`, {
    method: "POST",
  });
}

export async function rejectAccreditationRequest(userId: number, reason?: string): Promise<{ status: string; message: string }> {
  return apiFetch(`/api/auth/requests/${userId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

