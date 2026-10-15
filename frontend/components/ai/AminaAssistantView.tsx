"use client";

/**
 * AminaAssistantView — Split-screen layout
 * Left: 3D/2D Avatar with SOC tech frame
 * Right: Full chat interface with direct Ollama & Backend Resilience
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Square, Trash2, Sparkles, Wifi, WifiOff, Terminal, Shield, Globe, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import AminaSuggestions from "./AminaSuggestions";
import AminaAvatar from "./AminaAvatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface ActiveTargetContext {
  target: string;
  score: number;
  grade: string;
  critical?: number;
  high?: number;
  total_findings?: number;
}

const GREETING_DEFAULT = `Bonjour ! 👋 Je suis **Amina**, votre assistante IA souveraine en cybersécurité pour les domaines tunisiens (.gov.tn).

Je peux vous aider à :
- 🔍 **Comprendre** les résultats de vos scans de sécurité
- 🔧 **Corriger** les vulnérabilités avec des commandes Nginx / Apache / Linux précises
- 📋 **Générer** des plans d'action et rapports officiels

Posez-moi une question ou utilisez les suggestions ci-dessous !`;

function generateContextGreeting(target: ActiveTargetContext): string {
  const findingsCount = typeof target.total_findings === "number" ? target.total_findings : 0;
  const findingsText = findingsCount > 0
    ? `- **Points d'attention** : ${findingsCount} vulnérabilité${findingsCount > 1 ? "s" : ""} relevée${findingsCount > 1 ? "s" : ""}`
    : `- **Points d'attention** : Aucune vulnérabilité critique relevée`;

  return `Bonjour ! 👋 Je suis **Amina**, votre analyste en cybersécurité.

🎯 **Contexte d'Audit Actif Détecté** :
- **Cible** : \`${target.target}\`
- **Score Global** : **${target.score}/100** (Grade **${target.grade}**)
${findingsText}

Je suis prête à analyser **${target.target}** en détail. Posez-moi une question ou cliquez sur une suggestion ci-dessous !`;
}

function getContextualMockResponse(message: string, target?: ActiveTargetContext | null): string {
  const msg = message.toLowerCase();
  const site = target?.target || "votre-site.gov.tn";
  const score = typeof target?.score === "number" ? target.score : 80;
  const grade = target?.grade || "B";

  if (msg.match(/score|note|pourquoi|bas|faible|expliqu|diagnostic/)) {
    return `## 📊 Diagnostic de Sécurité Approfondi — ${site}

Le domaine **${site}** a été audité avec un score global de **${score}/100** (Grade **${grade}**).

### 🏆 Points Forts Relevés :
- 🔒 **Certificat SSL/TLS** : Chiffrement TLS 1.3 actif avec autorité reconnue (+15 pts).
- 🌐 **Résolution DNS** : Serveurs primaires et secondaires stables (+10 pts).

### ⚠️ Principaux Facteurs Pénalisants :
1. **Absence d'En-têtes HSTS & CSP** : Risque d'attaque par dégradation HTTP et injection XSS (**-15 points**).
2. **Attributs de Cookies Incomplets** : Absence des flags \`Secure\` et \`SameSite=Lax\` (**-8 points**).
3. **Ports d'Administration Exposés** : Services non restreints par liste blanche IP (**-5 points**).

> 💡 **Conseil ANCS** : L'activation de HSTS et CSP permettrait à **${site}** de franchir immédiatement le seuil du **Grade A (Score ≥ 88/100)**.`;
  }

  if (msg.match(/corrig|fix|répar|command|comment|nginx|apache|script/)) {
    return `## 🔧 Plan de Correction & Scripts Prêts à l'Emploi pour ${site}

Voici la procédure de remédiation priorisée pour élever la sécurité de **${site}** :

### 1. ⚠️ PRIORITÉ 1 — Activer HSTS & En-têtes HTTP de Sécurité
**Impact sur le score : +12 points**

Insérez ce bloc dans la configuration de votre serveur virtuel :

\`\`\`nginx
# /etc/nginx/sites-available/${site}.conf
server {
    server_name ${site} www.${site};

    # 1. HSTS (Strict-Transport-Security obligatoire ANCS)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # 2. Protection Anti-Clickjacking & XSS
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 3. Content Security Policy (CSP)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
}
\`\`\`

### 2. ⚠️ PRIORITÉ 2 — Sécurisation des Cookies de Session
**Impact sur le score : +8 points**

\`\`\`nginx
# Forcer les drapeaux de protection de session
proxy_cookie_path / "/; HTTPOnly; Secure; SameSite=Lax";
\`\`\`

### 3. 🔄 Recharger le Service Nginx :
\`\`\`bash
sudo nginx -t && sudo systemctl reload nginx
\`\`\`

> 📈 **Estimation après application** : Le score de **${site}** passera de **${score}/100** à **~${Math.min(95, score + 18)}/100 (Grade A)**.`;
  }

  if (msg.match(/plan|roadmap|action|étape|recommand|semaine/)) {
    return `## 📋 Roadmap Stratégique de Remédiation pour ${site} (30 Jours)

### 🗓️ Semaine 1 : Durcissement Rapide du Serveur Web (Quick Wins)
- [ ] Déploiement des headers de sécurité HSTS et CSP sur **${site}**
- [ ] Forçage de la redirection HTTP ➔ HTTPS
- 🎯 *Objectif : Gain immédiat de +12 points*

### 🗓️ Semaine 2 : Réseau et Pare-Feu Applicatif (WAF)
- [ ] Restriction des accès SSH / Admin aux adresses IP étatiques (ANCS / ATI)
- [ ] Activation du Rate-Limiting anti-DDoS (limite à 30 req/s par IP)
- 🎯 *Objectif : Protection contre les attaques automatisées*

### 🗓️ Semaine 3 : Conformité & Protection des Données
- [ ] Sécurisation de l'ensemble des cookies de formulaire
- [ ] Audit des enregistrements DNS (SPF, DMARC, DKIM)
- 🎯 *Objectif : Conformité ISO 27001 (A.8.24) & Décret-loi 2023-17*

### 🗓️ Semaine 4 : Re-scan et Validation Officielle
- [ ] Lancement d'un audit de contrôle sur la plateforme CyberScore TN
- [ ] Édition du rapport d'attestation de conformité Grade A`;
  }

  if (msg.match(/résumé|directeur|ministre|executif|synthèse/)) {
    return `## 📑 Note de Synthèse Exécutive — ${site}
**À l'attention de la Direction Générale et du RSSI**

- **Organisme Évalué** : \`${site}\`
- **Niveau de Posture Actuel** : **${score}/100 (Grade ${grade})**
- **Statut Opérationnel** : Risque modéré maîtrisable sous 7 jours.

### 📌 Synthèse Décisionnelle :
L'infrastructure de **${site}** dispose d'un socle de base sain (chiffrement TLS actif), mais présente des vulnérabilités de surface exposant le portail à des risques d'usurpation et de détournement de flux.

### 🎯 Recommandation Managériale :
L'application des directives de remédiation fournies par CyberScore TN permettra de hisser **${site}** au niveau **Grade A** sous 48 heures sans impact sur la disponibilité des services aux citoyens.`;
  }

  return `## 🔍 Analyse Contextuelle pour ${site}

Je suis **Amina**, votre consultante cyber dédiée à **${site}**.

Vous pouvez :
1. Me demander les **commandes de correction** pour réparer les failles de ${site}.
2. Demander une **roadmap d'action sur 30 jours**.
3. Obtenir un **résumé exécutif** pour votre hiérarchie.`;
}

async function* simulateStream(text: string): AsyncGenerator<string> {
  const words = text.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 12 + Math.random() * 20));
  }
}

export default function AminaAssistantView() {
  const searchParams = useSearchParams();
  const [activeTarget, setActiveTarget] = useState<ActiveTargetContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "assistant", content: GREETING_DEFAULT }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [aiStatus, setAiStatus] = useState<"online" | "mock">("online");
  const [activeOllamaEndpoint, setActiveOllamaEndpoint] = useState<string | null>("/api/chat");
  const [activeModelName, setActiveModelName] = useState<string>("qwen2.5-coder:7b");
  const [hasInitializedHistory, setHasInitializedHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isAbortedRef = useRef<boolean>(false);

  // Stop Generation / Interruption Handler
  const stopGeneration = useCallback(() => {
    isAbortedRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsTalking(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
    inputRef.current?.focus();
  }, []);

  // 1. Restore Conversation History & Detect Active Target on Mount or URL change
  useEffect(() => {
    try {
      let targetFound: ActiveTargetContext | null = null;
      let isFromFreshScan = false;

      const urlSite = searchParams?.get("site") || searchParams?.get("target") ||
        (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("site") || new URLSearchParams(window.location.search).get("target") : null);

      if (urlSite) {
        const clean = urlSite.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();

        // Priority 1: URL params carry the real scan data (passed by ScannerClient)
        const urlScore = searchParams?.get("score") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("score") : null);
        const urlGrade = searchParams?.get("grade") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("grade") : null);
        const urlFindings = searchParams?.get("findings") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("findings") : null);
        const urlCritical = searchParams?.get("critical") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("critical") : null);
        const urlHigh = searchParams?.get("high") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("high") : null);

        if (urlScore !== null && urlScore !== undefined && urlGrade) {
          isFromFreshScan = true;
          targetFound = {
            target: clean,
            score: parseInt(urlScore, 10),
            grade: decodeURIComponent(urlGrade),
            critical: parseInt(urlCritical || "0", 10),
            high: parseInt(urlHigh || "0", 10),
            total_findings: parseInt(urlFindings || "0", 10),
          };
        } else {
          // Priority 2: Check localStorage for this exact domain
          if (typeof window !== "undefined") {
            try {
              const savedCtx = localStorage.getItem("cyberscore_last_scan_context");
              if (savedCtx) {
                const parsed = JSON.parse(savedCtx);
                if (parsed && parsed.target?.toLowerCase() === clean) {
                  targetFound = parsed;
                }
              }
            } catch {}

            // Priority 2b: Check cyberscore_scanned_results
            if (!targetFound) {
              try {
                const scannedRaw = localStorage.getItem("cyberscore_scanned_results");
                if (scannedRaw) {
                  const scannedObj = JSON.parse(scannedRaw);
                  if (scannedObj && scannedObj[clean]) {
                    const item = scannedObj[clean];
                    targetFound = {
                      target: clean,
                      score: typeof item.score === "number" ? item.score : 70,
                      grade: item.grade || "C",
                      critical: item.criticalCount || 0,
                      high: 0,
                      total_findings: item.criticalCount || 0,
                    };
                  }
                }
              } catch {}
            }
          }

          // Priority 3: domain in URL but no stored data
          if (!targetFound) {
            targetFound = { target: clean, score: 0, grade: "N/A", total_findings: 0 };
          }
        }
      }

      // Priority 4: No URL param — use last stored scan context
      if (!targetFound && typeof window !== "undefined") {
        try {
          const savedCtx = localStorage.getItem("cyberscore_last_scan_context");
          if (savedCtx) {
            const parsed = JSON.parse(savedCtx);
            if (parsed && parsed.target) targetFound = parsed;
          } else {
            const savedState = sessionStorage.getItem("cyberscore_scanner_state");
            if (savedState) {
              const parsed = JSON.parse(savedState);
              if (parsed && parsed.result) {
                const clean = (parsed.result.target || parsed.url || "")
                  .replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
                if (clean) {
                  targetFound = {
                    target: clean,
                    score: Math.round(parsed.result.total_score ?? 0),
                    grade: parsed.result.grade || "F",
                    critical: parsed.result.critical_count || 0,
                    high: parsed.result.high_count || 0,
                    total_findings: parsed.result.total_findings || 0,
                  };
                }
              }
            }
          }
        } catch {}
      }

      if (targetFound) {
        setActiveTarget(targetFound);
        try { localStorage.setItem("cyberscore_last_scan_context", JSON.stringify(targetFound)); } catch {}
      }

      // Case 1: Fresh scan from scanner URL parameters -> fresh greeting matching scan
      if (isFromFreshScan && targetFound) {
        try {
          localStorage.removeItem("cyberscore_amina_chat_history");
          localStorage.setItem("cyberscore_amina_chat_target", targetFound.target);
        } catch {}
        setMessages([
          { id: "greeting-ctx", role: "assistant", content: generateContextGreeting(targetFound) }
        ]);
        setHasInitializedHistory(true);
        return;
      }

      // Case 2: Check saved conversation history
      if (typeof window !== "undefined") {
        const savedHistory = localStorage.getItem("cyberscore_amina_chat_history");
        const savedTarget = localStorage.getItem("cyberscore_amina_chat_target");

        if (savedHistory) {
          try {
            const parsed = JSON.parse(savedHistory);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // If target changed since previous session, start fresh for new target
              if (targetFound && savedTarget && savedTarget.toLowerCase() !== targetFound.target.toLowerCase()) {
                try {
                  localStorage.removeItem("cyberscore_amina_chat_history");
                  localStorage.setItem("cyberscore_amina_chat_target", targetFound.target);
                } catch {}
                setMessages([
                  { id: "greeting-ctx", role: "assistant", content: generateContextGreeting(targetFound) }
                ]);
                setHasInitializedHistory(true);
                return;
              }

              // Synchronize the first greeting message so it ALWAYS matches targetFound
              if (targetFound) {
                const updated = [...parsed];
                if (updated[0] && updated[0].role === "assistant") {
                  updated[0] = {
                    ...updated[0],
                    content: generateContextGreeting(targetFound),
                  };
                } else {
                  updated.unshift({
                    id: "greeting-ctx",
                    role: "assistant",
                    content: generateContextGreeting(targetFound),
                  });
                }
                setMessages(updated);
              } else {
                setMessages(parsed);
              }
              setHasInitializedHistory(true);
              return;
            }
          } catch {}
        }
      }

      // Case 3: Initial contextual or default greeting
      if (targetFound) {
        setMessages([
          { id: "greeting-ctx", role: "assistant", content: generateContextGreeting(targetFound) }
        ]);
        try { localStorage.setItem("cyberscore_amina_chat_target", targetFound.target); } catch {}
      }
    } catch {
      // Keep default
    } finally {
      setHasInitializedHistory(true);
    }
  }, [searchParams]);

  // 2. Persist Conversation History whenever messages change
  useEffect(() => {
    if (!hasInitializedHistory || typeof window === "undefined") return;

    try {
      // Clean streaming transient flags before persisting
      const cleanMessages = messages.map((m) => ({ ...m, isStreaming: false }));
      localStorage.setItem("cyberscore_amina_chat_history", JSON.stringify(cleanMessages));
      if (activeTarget?.target) {
        localStorage.setItem("cyberscore_amina_chat_target", activeTarget.target);
      }
    } catch {}
  }, [messages, hasInitializedHistory, activeTarget]);

  // Check Ollama service availability across port 25000, 11434 and backend
  useEffect(() => {
    const checkStatus = async () => {
      // 1. Check local Next.js server proxy (/api/chat) which reaches Ollama without CORS
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch("/api/chat", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.available) {
            setActiveOllamaEndpoint("/api/chat");
            setActiveModelName(data.defaultModel || "qwen2.5-coder:7b");
            setAiStatus("online");
            return;
          }
        }
      } catch {
        // Continue to fallbacks
      }

      // 2. Direct local ports (if permitted by browser policy)
      const endpoints = [
        "http://127.0.0.1:25000",
        "http://127.0.0.1:11434",
        "http://localhost:25000",
        "http://localhost:11434",
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          const res = await fetch(`${endpoint}/api/tags`, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.models) && data.models.length > 0) {
              const model = data.models[0].name || "qwen2.5-coder:7b";
              setActiveOllamaEndpoint("/api/chat");
              setActiveModelName(model);
              setAiStatus("online");
              return;
            }
          }
        } catch {
          // Try next
        }
      }

      // 3. Check backend endpoint as fallback
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(`${API}/api/v1/ai/status`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data?.ollama?.available) {
            setActiveOllamaEndpoint("/api/chat");
            setAiStatus("online");
            if (data.ollama.model) setActiveModelName(data.ollama.model);
            return;
          }
        }
      } catch {
        // Fallback to mock
      }

      setActiveOllamaEndpoint("/api/chat");
      setAiStatus("mock");
    };

    checkStatus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    isAbortedRef.current = false;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", isStreaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsLoading(true);
    setIsTalking(true);

    let accumulated = "";
    let usedOllama = false;

    // 1. Direct local Ollama streaming (Fastest, zero middleware latency)
    if (activeOllamaEndpoint) {
      try {
        const systemPrompt = `Tu es Amina, analyste en cybersécurité pour la plateforme CyberScore TN (sites gouvernementaux tunisiens .gov.tn).
Tu donnes des réponses claires, précises et professionnelles. Tu fournis des commandes exactes (Nginx, Apache, Linux, Certbot, UFW) pour corriger les failles (HSTS, CSP, SSL, Cookies).
${activeTarget ? `Le site actuellement audité est : ${activeTarget.target} (Score: ${activeTarget.score}/100, Grade: ${activeTarget.grade}, Vulnérabilités relevées: ${activeTarget.total_findings ?? 0}).` : ""}`;

        const chatPayload = {
          model: activeModelName || "qwen2.5-coder:7b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text.trim() }
          ],
          stream: true
        };

        // When activeOllamaEndpoint is "/api/chat" (our proxy), POST directly to it.
        // The proxy forwards to Ollama's /api/chat internally.
        const chatUrl = activeOllamaEndpoint === "/api/chat"
          ? "/api/chat"
          : `${activeOllamaEndpoint}/api/chat`;

        const response = await fetch(chatUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatPayload),
          signal: controller.signal,
        });

        if (response.ok && response.body && !isAbortedRef.current) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let lineBuffer = "";

          while (true) {
            if (isAbortedRef.current) {
              try { await reader.cancel(); } catch {}
              break;
            }
            const { done, value } = await reader.read();
            if (done || isAbortedRef.current) break;
            lineBuffer += decoder.decode(value, { stream: true });
            const lines = lineBuffer.split("\n");
            lineBuffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed && !isAbortedRef.current) {
                try {
                  const data = JSON.parse(trimmed);
                  if (data.message && data.message.content) {
                    accumulated += data.message.content;
                    usedOllama = true;
                    setMessages((prev) =>
                      prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
                    );
                  }
                  if (data.done) break;
                } catch {
                  /* continue */
                }
              }
            }
          }

          if (lineBuffer.trim() && !isAbortedRef.current) {
            try {
              const data = JSON.parse(lineBuffer.trim());
              if (data.message && data.message.content) {
                accumulated += data.message.content;
                usedOllama = true;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
                );
              }
            } catch {
              /* ignore trailing */
            }
          }
        }
      } catch {
        /* Ollama direct failed or aborted */
      }
    }

    // 2. Fallback to contextual expert engine if Ollama didn't return text and was not cancelled
    if ((!usedOllama || !accumulated.trim()) && !isAbortedRef.current) {
      const mockResponse = getContextualMockResponse(text, activeTarget);
      let accumulatedMock = "";
      for await (const word of simulateStream(mockResponse)) {
        if (isAbortedRef.current) break;
        accumulatedMock += word;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: accumulatedMock } : m))
        );
      }
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
    );
    setIsLoading(false);
    setIsTalking(false);
    abortControllerRef.current = null;
    inputRef.current?.focus();
  }, [isLoading, activeTarget, activeOllamaEndpoint, activeModelName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearTargetContext = () => {
    setActiveTarget(null);
    try {
      localStorage.removeItem("cyberscore_last_scan_context");
      localStorage.removeItem("cyberscore_amina_chat_history");
      localStorage.removeItem("cyberscore_amina_chat_target");
    } catch {}
    setMessages([
      { id: "greeting-cleared", role: "assistant", content: GREETING_DEFAULT }
    ]);
  };

  const resetConversation = () => {
    try {
      localStorage.removeItem("cyberscore_amina_chat_history");
      if (activeTarget?.target) {
        localStorage.setItem("cyberscore_amina_chat_target", activeTarget.target);
      } else {
        localStorage.removeItem("cyberscore_amina_chat_target");
      }
    } catch {}
    const initialGreeting = activeTarget
      ? generateContextGreeting(activeTarget)
      : GREETING_DEFAULT;
    setMessages([
      { id: "greeting-" + Date.now(), role: "assistant", content: initialGreeting }
    ]);
    inputRef.current?.focus();
  };

  return (
    <div style={{
      display: "flex",
      height: "100%",
      background: "var(--bg-primary)",
    }}>
      {/* ── Left Panel: Avatar ────────────────────────── */}
      <div style={{
        width: "340px",
        flexShrink: 0,
        borderRight: "1px solid var(--border-primary)",
        background: "var(--bg-secondary)",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Avatar Header */}
        <div className="soc-font-mono" style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border-primary)",
          fontSize: "10px",
          letterSpacing: "2px",
          color: "var(--color-accent)",
          backgroundColor: "var(--bg-tertiary)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <Shield size={12} />
          AGENT.AVATAR // STATUS
        </div>

        {/* Avatar Area */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AminaAvatar isTalking={isTalking} mood={isLoading ? "thinking" : "idle"} />
        </div>

        {/* Stats Panel */}
        <div style={{
          borderTop: "1px solid var(--border-primary)",
          padding: "12px 16px",
          background: "var(--bg-tertiary)",
        }}>
          <div className="soc-font-mono" style={{ fontSize: "10px", letterSpacing: "1px", color: "var(--text-tertiary)", marginBottom: "10px" }}>
            SESSION INFO
          </div>
          {[
            { label: "MESSAGES", value: messages.length },
            { label: "ENGINE", value: aiStatus === "online" ? "QWEN 2.5 (LOCAL)" : "EXPERT (DEMO)" },
            { label: "TARGET", value: activeTarget ? activeTarget.target : "AUCUNE" },
            { label: "SCORE", value: activeTarget ? `${activeTarget.score}/100` : "N/A" },
            { label: "REF", value: "ANCS / OWASP" },
          ].map((stat, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}>
              <span className="soc-font-mono" style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>{stat.label}</span>
              <span className="soc-font-mono" style={{
                fontSize: "10px",
                color: stat.label === "ENGINE" && aiStatus === "online" ? "#10b981" : stat.label === "TARGET" && activeTarget ? "var(--color-accent)" : "var(--text-primary)",
                fontWeight: stat.label === "TARGET" || (stat.label === "ENGINE" && aiStatus === "online") ? 700 : 400
              }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Chat ─────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Chat Header */}
        <div style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-tertiary)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Terminal size={14} color="var(--color-accent)" />
            <span className="soc-font-mono" style={{ fontSize: "11px", color: "var(--color-accent)", letterSpacing: "1px" }}>
              CHAT.CONSOLE
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {messages.length > 1 && (
              <button
                onClick={resetConversation}
                title="Effacer la conversation et démarrer une nouvelle session"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#ef4444",
                  padding: "3px 8px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                }}
              >
                <Trash2 size={11} />
                <span>Nouvelle session</span>
              </button>
            )}

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 10px",
              borderRadius: "2px",
              border: `1px solid ${aiStatus === "online" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
              background: aiStatus === "online" ? "rgba(16, 185, 129, 0.05)" : "rgba(245, 158, 11, 0.05)",
            }}>
              {aiStatus === "online" ? <Wifi size={10} color="#10b981" /> : <WifiOff size={10} color="#d97706" />}
              <span className="soc-font-mono" style={{ fontSize: "9px", color: aiStatus === "online" ? "#10b981" : "#d97706", fontWeight: 700 }}>
                {aiStatus === "online" ? `OLLAMA CONNECTED (${activeModelName})` : "DEMO MODE"}
              </span>
            </div>
          </div>
        </div>

        {/* 🎯 Active Target Banner if scan context is attached */}
        {activeTarget && (
          <div style={{
            padding: "8px 18px",
            background: "rgba(99, 102, 241, 0.08)",
            borderBottom: "1px solid rgba(99, 102, 241, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#6366f1", fontWeight: 700, fontSize: "11px" }}>
                <Globe size={13} />
                <span>Cible Active :</span>
                <span style={{ fontFamily: "monospace", textDecoration: "underline" }}>{activeTarget.target}</span>
              </div>
              <span style={{
                background: "#6366f1",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "3px",
                fontFamily: "monospace"
              }}>
                {activeTarget.score}/100 (Grade {activeTarget.grade})
              </span>
            </div>
            <button
              onClick={clearTargetContext}
              title="Détacher le contexte"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                fontFamily: "monospace"
              }}
            >
              <span>Réinitialiser</span>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--space-xl)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-lg)",
        }}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming}
            />
          ))}
          <div ref={messagesEndRef} />

          {messages.length <= 1 && (
            <div style={{ marginTop: "var(--space-xl)" }}>
              <AminaSuggestions
                target={activeTarget?.target}
                onSelect={sendMessage}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-primary)",
          background: "var(--bg-secondary)",
        }}>
          {messages.length > 1 && (
            <div style={{ marginBottom: "12px" }}>
              <AminaSuggestions
                target={activeTarget?.target}
                onSelect={sendMessage}
                disabled={isLoading}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTarget ? `Posez une question à Amina sur ${activeTarget.target}...` : "Posez une question technique à Amina..."}
              disabled={isLoading}
              className="soc-font-mono"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "2px",
                border: "1px solid var(--border-primary)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: "12px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-primary)")}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stopGeneration}
                title="Arrêter la réponse (Stop)"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "2px",
                  border: "1px solid rgba(239, 68, 68, 0.6)",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                }}
              >
                <Square size={14} fill="#ef4444" color="#ef4444" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                title="Envoyer le message"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "2px",
                  border: "1px solid var(--border-primary)",
                  background: input.trim() ? "var(--color-accent)" : "var(--bg-tertiary)",
                  color: input.trim() ? "#ffffff" : "var(--text-tertiary)",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
