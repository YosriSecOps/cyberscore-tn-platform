/**
 * CyberScore TN — Global Scan Coordinator & State Manager
 * 
 * Ensures continuous, uninterrupted scan execution across:
 * - Language switches (FR <-> AR <-> EN)
 * - Soft client-side route transitions
 * - Dynamic remounts of Next.js page components
 * 
 * Maintains a live in-memory singleton in the browser bundle, synchronized with sessionStorage.
 */

import realScansData from "@/lib/real-scans.json";
import { dispatchCyberNotification } from "@/utils/notifications";
import { recordAuditLog } from "@/utils/auditLogger";

export type ScanType = "quick" | "standard" | "deep" | "autonomous";
export type ScanStatus = "idle" | "scanning" | "complete" | "error";

export interface ScanResult {
  scan_id: number | string;
  target: string;
  total_score: number;
  grade: string;
  grade_label_ar?: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  duration_ms: number;
  sha256_hash?: string;
  is_autonomous_agent?: boolean;
  mandat_reference?: string;
  auditor_signature?: string;
  roe_certified?: boolean;
  resolved_ip?: string;
  ipv6_address?: string | null;
  os_detection?: {
    os_family: string;
    os_detailed: string;
    ttl_received?: number;
    hops_distance?: number;
    rtt_ms?: number;
    confidence: number;
    method?: string;
  } | null;
  software_obsolescence?: Array<{
    component: string;
    detected_string: string;
    release_year: number;
    age_years: number;
    eol_status: string;
    cve_count?: number;
    sample_cves?: string[];
    recommendation?: string;
  }>;
  web_surface?: {
    page_title?: string;
    http_methods?: string[];
    has_robots_txt?: boolean;
  } | null;
  open_ports?: Array<{ port: number; service: string; banner?: string; is_risky?: boolean; severity?: string }>;
  remediation_roadmap?: Array<{
    step_number: number;
    title: string;
    severity: string;
    estimated_score_gain: number;
    commands: string;
    description: string;
  }>;
  remediation_source?: string;
  category_breakdown: Array<{
    category: string;
    score: number;
    max_score: number;
    label_ar?: string;
    label_fr?: string;
    label_en?: string;
  }>;
  findings: Array<{
    title: any;
    severity: string;
    category: string;
    description: any;
    remediation: any;
    evidence?: any;
    owasp_category?: string;
    cvss_score?: number | string;
    poc_verified?: boolean;
  }>;
}

export interface ScanState {
  url: string;
  scanType: ScanType;
  status: ScanStatus;
  progress: number;
  result: ScanResult | null;
  error: string;
  startTime: number;
  expectedDurationMs: number;
  isAutonomousUnlocked: boolean;
  mandatCode: string;
  auditorSignature: string;
}

const STORAGE_KEY = "cyberscore_scanner_state_v1";

// Map pre-audited realistic scans for offline fallback
const REAL_SCANS_MAP = new Map<string, any>();
if (Array.isArray(realScansData)) {
  for (const item of realScansData) {
    if (item && item.domain) {
      REAL_SCANS_MAP.set(item.domain.toLowerCase(), item);
    }
  }
}

export function getCachedScanResult(targetUrl: string): ScanResult | null {
  const clean = targetUrl.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
  const cached = REAL_SCANS_MAP.get(clean);
  if (!cached) return null;

  return {
    scan_id: Math.floor(Date.now() / 1000),
    target: clean,
    total_score: cached.score,
    grade: cached.grade,
    grade_label_ar: cached.grade,
    total_findings: cached.totalFindings || (cached.findings ? cached.findings.length : 0),
    critical_count: cached.criticalCount || 0,
    high_count: cached.highCount || 0,
    medium_count: cached.mediumCount || 0,
    low_count: cached.lowCount || 0,
    duration_ms: cached.durationMs || 850,
    category_breakdown: cached.category_breakdown || [],
    findings: cached.findings || [],
  };
}

function computeProgress(elapsed: number, expectedDurationMs: number): number {
  const fraction = elapsed / expectedDurationMs;
  if (fraction < 0.7) {
    return Math.min(Math.round(fraction * 100), 70);
  } else if (fraction < 1.0) {
    const sub = (fraction - 0.7) / 0.3;
    return Math.min(Math.round(70 + sub * 22), 92);
  } else {
    // Smooth continuous crawl up to 98% while LLM finishes
    const extraSec = (elapsed - expectedDurationMs) / 1000;
    const slowCrawl = 92 + Math.min(6, Math.log2(1 + extraSec * 0.5) * 2.5);
    return Math.min(Math.round(slowCrawl), 98);
  }
}

class ScanCoordinator {
  private state: ScanState = {
    url: "",
    scanType: "standard",
    status: "idle",
    progress: 0,
    result: null,
    error: "",
    startTime: 0,
    expectedDurationMs: 8000,
    isAutonomousUnlocked: false,
    mandatCode: "ANCS-2026",
    auditorSignature: "Admin ANCS",
  };

  private listeners = new Set<(state: ScanState) => void>();
  private ticker: NodeJS.Timeout | null = null;
  private isScanningInProgress = false;
  private abortCtrl: AbortController | null = null;

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    if (typeof window === "undefined") return;

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          this.state = {
            ...this.state,
            url: parsed.url || this.state.url,
            scanType: parsed.scanType || this.state.scanType,
            status: parsed.status || "idle",
            progress: parsed.progress || (parsed.status === "complete" ? 100 : 0),
            result: parsed.result || null,
            error: parsed.error || "",
            startTime: parsed.startTime || 0,
            expectedDurationMs: parsed.expectedDurationMs || 8000,
            isAutonomousUnlocked: parsed.isAutonomousUnlocked ?? this.state.isAutonomousUnlocked,
            mandatCode: parsed.mandatCode || this.state.mandatCode,
            auditorSignature: parsed.auditorSignature || this.state.auditorSignature,
          };

          // If scan was recorded as "scanning"
          if (parsed.status === "scanning" && parsed.startTime) {
            const elapsed = Date.now() - parsed.startTime;
            const maxDuration = (parsed.expectedDurationMs || 75000) + 60000;
            if (elapsed < maxDuration) {
              // Scan is actively running or recent, resume ticker & recovery
              this.resumeScan();
            } else {
              // Too old, reset to idle
              this.state.status = "idle";
              this.state.progress = 0;
              this.persist();
            }
          }
        }
      }
    } catch {}
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {}
  }

  private notify() {
    const snap = { ...this.state };
    this.listeners.forEach((fn) => {
      try {
        fn(snap);
      } catch (err) {
        console.error("Error in scan listener:", err);
      }
    });
  }

  public getState(): ScanState {
    return { ...this.state };
  }

  public subscribe(listener: (state: ScanState) => void): () => void {
    this.listeners.add(listener);
    // Send immediate snapshot to subscriber
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setUrl(url: string) {
    this.state.url = url;
    this.persist();
    this.notify();
  }

  public setScanType(scanType: ScanType) {
    this.state.scanType = scanType;
    this.persist();
    this.notify();
  }

  public unlockAutonomous(code: string, signature: string) {
    this.state.isAutonomousUnlocked = true;
    this.state.mandatCode = code;
    this.state.auditorSignature = signature;
    this.persist();
    this.notify();
  }

  private startProgressTicker() {
    if (this.ticker) clearInterval(this.ticker);

    this.ticker = setInterval(() => {
      if (this.state.status !== "scanning") {
        if (this.ticker) clearInterval(this.ticker);
        return;
      }

      const elapsed = Date.now() - this.state.startTime;
      const nextProgress = computeProgress(elapsed, this.state.expectedDurationMs);
      this.state.progress = nextProgress;
      this.persist();
      this.notify();
    }, 200);
  }

  private stopProgressTicker() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  }

  private resumeScan() {
    if (this.isScanningInProgress) return;
    this.isScanningInProgress = true;
    this.startProgressTicker();

    // Re-fetch in background to finish the scan if it was a page refresh
    this.executeScanNetworkCall({
      url: this.state.url,
      scanType: this.state.scanType,
      authCode: this.state.mandatCode,
      authSig: this.state.auditorSignature,
    });
  }

  public async startScan(params: {
    url: string;
    scanType: ScanType;
    authCode?: string;
    authSig?: string;
    loggedUserRole?: string;
    loggedUserEmail?: string;
    loggedUserName?: string;
  }) {
    const { url, scanType, authCode, authSig, loggedUserEmail, loggedUserName } = params;
    const cleanUrl = (url || "").trim();
    if (!cleanUrl) return;

    // Client-side domain syntax validation
    const rawClean = cleanUrl
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")
      .trim();

    if (!rawClean || rawClean.length < 3 || !rawClean.includes(".") || rawClean.endsWith(".")) {
      this.state.status = "error";
      this.state.progress = 0;
      this.state.error = "Format d'URL ou de domaine invalide. Veuillez renseigner un nom de domaine valide (ex: tunisair.com.tn).";
      this.persist();
      this.notify();
      return;
    }

    if (this.abortCtrl) {
      try {
        this.abortCtrl.abort();
      } catch {}
    }
    this.abortCtrl = new AbortController();

    const expectedDurationMs =
      scanType === "autonomous" ? 110000 : scanType === "deep" ? 35000 : scanType === "standard" ? 15000 : 5000;

    this.state = {
      ...this.state,
      url: cleanUrl,
      scanType,
      status: "scanning",
      progress: 0,
      result: null,
      error: "",
      startTime: Date.now(),
      expectedDurationMs,
      mandatCode: authCode || this.state.mandatCode,
      auditorSignature: authSig || this.state.auditorSignature,
    };

    this.isScanningInProgress = true;
    this.persist();
    this.notify();
    this.startProgressTicker();

    await this.executeScanNetworkCall({
      url: cleanUrl,
      scanType,
      authCode,
      authSig,
      loggedUserEmail,
      loggedUserName,
    });
  }

  private async executeScanNetworkCall(params: {
    url: string;
    scanType: ScanType;
    authCode?: string;
    authSig?: string;
    loggedUserEmail?: string;
    loggedUserName?: string;
  }) {
    const { url, scanType, authCode, authSig, loggedUserEmail, loggedUserName } = params;
    const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    let scanData: ScanResult | null = null;
    let scanError: string | null = null;

    try {
      if (scanType === "autonomous") {
        try {
          const liveRes = await fetch("/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
              scan_type: "autonomous",
              authorization_code: authCode || this.state.mandatCode || "ANCS-2026",
              auditor_signature: authSig || this.state.auditorSignature || "Admin ANCS",
              roe_accepted: true,
            }),
            signal: this.abortCtrl?.signal,
          });
          const liveJson = await liveRes.json();
          if (liveRes.ok && liveJson && !liveJson.error) {
            scanData = liveJson;
          } else if (liveJson?.error || liveJson?.detail) {
            scanError = liveJson.error || liveJson.detail;
          } else {
            scanError = `Échec de l'audit autonome (Code HTTP ${liveRes.status})`;
          }
        } catch (err: any) {
          if (err?.name !== "AbortError") {
            scanError = err?.message || "Échec de connexion réseau pour l'audit autonome.";
          }
        }
      } else {
        // 1. Try FastAPI backend first (via Nginx reverse proxy /api/ or direct backend API)
        const endpoints = [
          "/api/scans/run",
          `${API}/api/scans/run`,
          "http://192.168.98.149:8000/api/scans/run",
        ];

        let validationErrorOccurred = false;

        for (const ep of endpoints) {
          try {
            const fastApiCtrl = new AbortController();
            const timeoutId = setTimeout(() => fastApiCtrl.abort(), 35000);
            const res = await fetch(ep, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url, scan_type: scanType }),
              signal: fastApiCtrl.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              if (data && !data.error && typeof data.total_score === "number") {
                scanData = data;
                break;
              }
            } else {
              try {
                const errData = await res.json();
                if (errData?.detail || errData?.error) {
                  scanError = errData.detail || errData.error;
                }
              } catch {}
              if (res.status === 400 || res.status === 422) {
                validationErrorOccurred = true;
                break;
              }
            }
          } catch {
            /* Try next candidate endpoint */
          }
        }

        // 2. Fallback to /api/scan route ONLY if all FastAPI backend attempts fail and no explicit validation error
        if (!scanData && !validationErrorOccurred && this.state.status === "scanning") {
          try {
            const liveRes = await fetch("/api/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url, scan_type: scanType }),
              signal: this.abortCtrl?.signal,
            });
            const liveJson = await liveRes.json();
            if (liveRes.ok && liveJson && !liveJson.error) {
              scanData = liveJson;
            } else if (liveJson?.error || liveJson?.detail) {
              scanError = liveJson.error || liveJson.detail;
            }
          } catch (err: any) {
            if (err?.name !== "AbortError") {
              scanError = err?.message || "Échec de connexion réseau pour l'audit.";
            }
          }
        }
      }

      this.stopProgressTicker();
      this.isScanningInProgress = false;

      if (scanError || !scanData) {
        this.state.status = "error";
        this.state.progress = 0;
        this.state.error = scanError || "Impossible d'auditer cette cible. Vérifiez que l'URL est correcte et active.";
        this.persist();
        this.notify();
        return;
      }

      // Successful completion
      this.state.progress = 100;
      this.state.result = scanData;
      this.state.status = "complete";
      this.state.error = "";
      this.persist();
      this.notify();

      // Record in LocalStorage & Dispatch SOC Notifications
      if (typeof window !== "undefined") {
        try {
          const cleanTarget = (scanData.target || url).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
          if (cleanTarget) {
            const existingRaw = localStorage.getItem("cyberscore_scanned_results");
            const existing = existingRaw ? JSON.parse(existingRaw) : {};
            existing[cleanTarget] = {
              domain: cleanTarget,
              score: typeof scanData.total_score === "number" ? Math.round(scanData.total_score) : 70,
              grade: scanData.grade || "D",
              criticalCount: scanData.critical_count || 0,
              lastScan: "À l'instant (Audit Live)",
              scannedAt: new Date().toISOString(),
            };
            localStorage.setItem("cyberscore_scanned_results", JSON.stringify(existing));
            window.dispatchEvent(new Event("storage"));
            window.dispatchEvent(new CustomEvent("cyberscore_scan_completed", { detail: existing[cleanTarget] }));

            localStorage.setItem(
              "cyberscore_last_scan_context",
              JSON.stringify({
                target: cleanTarget,
                score: typeof scanData.total_score === "number" ? Math.round(scanData.total_score) : 70,
                grade: scanData.grade || "B",
                critical: scanData.critical_count || 0,
                high: scanData.high_count || 0,
                total_findings: typeof scanData.total_findings === "number" ? scanData.total_findings : ((scanData.critical_count || 0) + (scanData.high_count || 0)),
              })
            );

            // SOC Alert Notification
            dispatchCyberNotification({
              type: scanData.critical_count > 0 ? "critical" : scanData.total_score >= 80 ? "success" : "warning",
              title: {
                ar: `اكتمل الفحص: ${cleanTarget}`,
                fr: `Audit terminé : ${cleanTarget}`,
                en: `Scan complete: ${cleanTarget}`,
              },
              desc: {
                ar: `النتيجة: ${Math.round(scanData.total_score)}/100 (الرتبة ${scanData.grade}). ${scanData.critical_count} ثغرات حرجة.`,
                fr: `Score : ${Math.round(scanData.total_score)}/100 (Grade ${scanData.grade}). ${scanData.critical_count} faille(s) critique(s).`,
                en: `Score: ${Math.round(scanData.total_score)}/100 (Grade ${scanData.grade}). ${scanData.critical_count} critical issue(s).`,
              },
              href: `/scan?domain=${cleanTarget}`,
            });

            // Audit Trail
            const actorEmail = loggedUserEmail || "admin@cyberscore.tn";
            recordAuditLog({
              user: actorEmail.split("@")[0],
              action: {
                fr: `Exécution audit de sécurité (${scanType.toUpperCase()} — Score ${Math.round(scanData.total_score || 70)}/100)`,
                ar: `إجراء تدقيق أمني (${scanType.toUpperCase()} — النتيجة ${Math.round(scanData.total_score || 70)}/100)`,
                en: `Executed security audit (${scanType.toUpperCase()} — Score ${Math.round(scanData.total_score || 70)}/100)`,
              },
              target: cleanTarget,
              severity: scanData.critical_count > 0 ? "critical" : scanData.total_score >= 80 ? "info" : "warning",
            });
          }
        } catch (e) {
          console.error("Storage record error:", e);
        }
      }
    } catch (err: any) {
      this.stopProgressTicker();
      this.isScanningInProgress = false;

      const cleanTarget = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
      const cached = getCachedScanResult(cleanTarget);
      if (cached) {
        this.state.progress = 100;
        this.state.result = cached;
        this.state.status = "complete";
      } else {
        this.state.progress = 0;
        this.state.status = "error";
        this.state.error = err?.message || "Erreur de connexion réseau lors de l'audit.";
      }
      this.persist();
      this.notify();
    }
  }

  public resetScan() {
    this.stopProgressTicker();
    if (this.abortCtrl) {
      try {
        this.abortCtrl.abort();
      } catch {}
    }
    this.isScanningInProgress = false;

    this.state = {
      ...this.state,
      status: "idle",
      progress: 0,
      result: null,
      error: "",
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }

    this.notify();
  }
}

// Global module-level singleton
export const scanCoordinator = new ScanCoordinator();
