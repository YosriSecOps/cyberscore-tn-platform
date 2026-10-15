"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, Sparkles, Wifi, WifiOff } from "lucide-react";
import ChatMessage from "./ChatMessage";
import AminaSuggestions from "./AminaSuggestions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const GREETING = `Bonjour ! 👋 Je suis **Amina**, votre assistante IA en cybersécurité.

Je peux vous aider à :
- 🔍 **Comprendre** les résultats de vos scans de sécurité
- 🔧 **Corriger** les vulnérabilités avec des commandes précises
- 📋 **Générer** des plans d'action et rapports

Posez-moi une question ou utilisez une suggestion ci-dessous !`;

// ── Mock responses for demo mode ────────────────────────

const MOCK_RESPONSES: Record<string, string> = {
  score: `## 📊 Explication du Score

Le score de sécurité est calculé sur **100 points** en évaluant **16 facteurs** :

| Catégorie | Poids |
|-----------|-------|
| 🔒 SSL/TLS | 15% |
| 🛡️ Headers HTTP | 12% |
| 🍪 Cookies | 8% |
| 🌐 DNS | 10% |
| 🚪 Ports | 10% |

### Raisons fréquentes d'un score bas :
1. **Certificat SSL expiré** → -15 points
2. **Absence de Content-Security-Policy** → -10 points
3. **Ports FTP/Telnet ouverts** → -8 points

> 💡 Commencez par corriger le SSL et les headers — c'est le plus simple et le plus impactant.`,

  correction: `## 🔧 Plan de Correction

### 1. ⚠️ CRITIQUE — Renouveler le Certificat SSL
**Impact : +15 points**

\`\`\`bash
sudo certbot --nginx -d votre-site.gov.tn
sudo systemctl restart nginx
\`\`\`

### 2. ⚠️ HAUTE — Headers de Sécurité
**Impact : +12 points**

\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000" always;
add_header Content-Security-Policy "default-src 'self'" always;
\`\`\`

### 3. 🔶 MOYENNE — Fermer les Ports
**Impact : +5 points**

\`\`\`bash
sudo ufw deny 21/tcp
sudo systemctl disable vsftpd
\`\`\`

> 📈 **Score estimé après corrections** : ~42 → ~77/100 (Grade B)`,

  plan: `## 📋 Roadmap de Remédiation — 30 jours

### Semaine 1 : Fondations
- [ ] ⚠️ Renouveler le certificat SSL/TLS
- [ ] ⚠️ Configurer HSTS
- [ ] ⚠️ Ajouter les headers de sécurité

### Semaine 2 : Réseau
- [ ] 🔶 Fermer les ports inutiles (FTP, Telnet)
- [ ] 🔶 Configurer le firewall
- [ ] 🔶 Activer le rate limiting

### Semaine 3 : Application
- [ ] 🟢 Sécuriser les cookies
- [ ] 🟢 Implémenter CSP
- [ ] 🟢 Mettre à jour les dépendances

### Semaine 4 : DNS & Validation
- [ ] Configurer SPF, DKIM, DMARC
- [ ] Relancer un scan CyberScore TN

> 🎯 **Objectif** : Passer de Grade D/F à Grade B/A en 30 jours`,

  default: `## 🔍 Analyse

Je suis **Amina**, votre experte en cybersécurité tunisienne.

Pour vous donner une réponse précise, vous pouvez :
1. **Scanner un site** via l'onglet Scanner, puis revenir me poser des questions
2. **Utiliser les suggestions** ci-dessous pour des analyses rapides
3. **Me poser une question technique** sur la sécurité web

Je suis spécialisée dans la sécurisation des sites gouvernementaux tunisiens (.gov.tn) et je maîtrise les référentiels OWASP, NIST et ISO 27002.`
};

function getMockResponse(message: string): string {
  const msg = message.toLowerCase();
  if (msg.match(/score|note|pourquoi|bas|faible|expliqu/)) return MOCK_RESPONSES.score;
  if (msg.match(/corrig|fix|répar|command|comment|nginx|apache/)) return MOCK_RESPONSES.correction;
  if (msg.match(/plan|roadmap|action|étape|recommand|résumé/)) return MOCK_RESPONSES.plan;
  return MOCK_RESPONSES.default;
}

// ── Simulate streaming for mock mode ────────────────────

async function* simulateStream(text: string): AsyncGenerator<string> {
  const words = text.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise(r => setTimeout(r, 15 + Math.random() * 25));
  }
}

// ── Main Component ──────────────────────────────────────

export default function AminaChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "assistant", content: GREETING }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<"online" | "mock">("mock");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check AI backend status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/ai/status");
        if (res.ok) {
          const data = await res.json();
          setAiStatus(data.ollama?.available ? "online" : "mock");
        }
      } catch {
        setAiStatus("mock");
      }
    };
    checkStatus();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", isStreaming: true };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Try backend streaming first
      const backendUrl = `http://localhost:8000/api/v1/ai/chat/stream?message=${encodeURIComponent(text.trim())}&language=fr`;
      let usedBackend = false;

      try {
        const response = await fetch(backendUrl);
        if (response.ok && response.body) {
          usedBackend = true;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

            for (const line of lines) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  accumulated += data.content;
                  setMessages(prev => prev.map(m =>
                    m.id === assistantId ? { ...m, content: accumulated } : m
                  ));
                }
                if (data.done) break;
              } catch { /* skip malformed */ }
            }
          }
        }
      } catch {
        // Backend not available, use mock
      }

      // Fallback: mock streaming
      if (!usedBackend) {
        const mockResponse = getMockResponse(text);
        let accumulated = "";

        for await (const word of simulateStream(mockResponse)) {
          accumulated += word;
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          ));
        }
      }
    } finally {
      // Mark streaming as done
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      ));
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 140px)",
      maxHeight: "800px",
      background: "var(--bg-primary)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--border-primary)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--bg-secondary)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              Amina
              <span style={{
                padding: "2px 8px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
                color: "#059669",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}>
                <Sparkles size={10} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
                IA
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
              Assistante Cybersécurité — CyberScore TN
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "12px",
          background: aiStatus === "online" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
          color: aiStatus === "online" ? "#059669" : "#d97706",
          fontSize: "11px",
          fontWeight: 500,
        }}>
          {aiStatus === "online" ? <Wifi size={12} /> : <WifiOff size={12} />}
          {aiStatus === "online" ? "Ollama" : "Démo"}
        </div>
      </div>

      {/* Messages Area */}
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

        {/* Suggestions (only show when no conversation yet) */}
        {messages.length <= 1 && (
          <div style={{ marginTop: "var(--space-xl)" }}>
            <AminaSuggestions onSelect={sendMessage} disabled={isLoading} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid var(--border-primary)",
        background: "var(--bg-secondary)",
      }}>
        {/* Suggestions below conversation */}
        {messages.length > 1 && (
          <div style={{ marginBottom: "12px" }}>
            <AminaSuggestions onSelect={sendMessage} disabled={isLoading} />
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à Amina..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid var(--border-primary)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-primary)"}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "none",
              background: input.trim() && !isLoading ? "var(--color-accent)" : "var(--bg-tertiary)",
              color: input.trim() && !isLoading ? "#ffffff" : "var(--text-tertiary)",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
