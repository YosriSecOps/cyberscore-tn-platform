"""
CyberScore TN — AI Assistant Routes (Amina)
Provides chat endpoint with Ollama (sovereign local LLM Qwen2.5-Coder:7b) and mock expert demo mode.
Note: Cloud AI (Gemini) is disabled by design to strictly adhere to Tunisian digital sovereignty (Décret-loi n° 2023-17).
"""

import json
import os
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/api/v1/ai", tags=["AI Assistant"])


# ── Models ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    site_url: Optional[str] = None
    scan_context: Optional[dict] = None
    language: str = "fr"


class ChatResponse(BaseModel):
    response: str
    source: str  # "ollama" | "gemini" | "mock"


# ── System Prompt ─────────────────────────────────────────

SYSTEM_PROMPT = """Tu es Amina, une experte en cybersécurité travaillant pour le gouvernement tunisien.

TON RÔLE:
- Tu analyses les résultats de scans de sécurité des sites web gouvernementaux tunisiens (.gov.tn)
- Tu expliques les vulnérabilités en langage clair et accessible
- Tu donnes des commandes exactes (Nginx, Apache, Linux) pour corriger les problèmes
- Tu génères des plans d'action priorisés avec estimation d'impact sur le score

TON STYLE:
- Professionnelle mais accessible
- Tu utilises des exemples concrets
- Tu donnes toujours du code/commandes prêts à copier-coller
- Tu priorises: Critique → Haute → Moyenne → Faible
- Tu estimes l'impact de chaque correction sur le score global

CONTEXTE DU SCAN (si disponible):
{scan_context}

LANGUE DE RÉPONSE: {language}
"""


# ── Mock Responses ────────────────────────────────────────

MOCK_RESPONSES = {
    "default": """## 🔍 Analyse de votre question

Je suis **Amina**, votre assistante en cybersécurité. Je suis ici pour vous aider à comprendre et améliorer la sécurité de vos sites gouvernementaux.

### Ce que je peux faire pour vous :
- 🔎 **Analyser** les résultats d'un scan de sécurité
- 🔧 **Corriger** les vulnérabilités avec des commandes précises
- 📋 **Générer** un plan d'action priorisé
- 📊 **Expliquer** votre score et comment l'améliorer

N'hésitez pas à me poser une question précise sur un site scanné !""",

    "score": """## 📊 Explication du Score

Le score de sécurité est calculé sur **100 points** en évaluant **16 facteurs** :

| Catégorie | Poids | Description |
|-----------|-------|-------------|
| 🔒 SSL/TLS | 15% | Certificat valide, protocoles modernes |
| 🛡️ Headers HTTP | 12% | CSP, HSTS, X-Frame-Options |
| 🍪 Cookies | 8% | Flags Secure, HttpOnly, SameSite |
| 🌐 DNS | 10% | DNSSEC, SPF, DMARC, DKIM |
| 🚪 Ports | 10% | Ports ouverts non nécessaires |
| 📧 Email | 5% | Configuration anti-spam |

### Pourquoi un score bas ?
Les raisons les plus fréquentes sont :
1. **Certificat SSL expiré** → -15 points immédiatement
2. **Absence de Content-Security-Policy** → -10 points
3. **Ports FTP/Telnet ouverts** → -8 points

> 💡 **Conseil** : Commencez par corriger le SSL et les headers, c'est le plus simple et ça rapporte le plus de points.""",

    "correction": """## 🔧 Plan de Correction Prioritaire

Voici un plan d'action concret pour améliorer la sécurité de votre site :

### 1. ⚠️ CRITIQUE — Renouveler le Certificat SSL
**Impact estimé : +15 points**

```bash
# Sur Ubuntu/Debian avec Nginx
sudo apt update && sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-site.gov.tn
sudo systemctl restart nginx

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

### 2. ⚠️ HAUTE — Ajouter les Headers de Sécurité
**Impact estimé : +12 points**

```nginx
# Dans /etc/nginx/sites-available/votre-site.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 3. 🔶 MOYENNE — Fermer les Ports Non Utilisés
**Impact estimé : +5 points**

```bash
# Voir les ports ouverts
sudo ss -tlnp

# Fermer le port FTP (21)
sudo ufw deny 21/tcp
sudo systemctl stop vsftpd
sudo systemctl disable vsftpd
```

### 4. 🟢 RECOMMANDÉ — Sécuriser les Cookies
**Impact estimé : +3 points**

```nginx
# Ajouter les flags de sécurité aux cookies
proxy_cookie_flags ~ secure httponly samesite=strict;
```

> 📈 **Score estimé après corrections** : de ~42 à ~77/100 (Grade B)""",

    "plan": """## 📋 Roadmap de Remédiation — 30 jours

### Semaine 1 : Fondations (Jour 1-7)
- [ ] ⚠️ Renouveler le certificat SSL/TLS
- [ ] ⚠️ Configurer HSTS (HTTP Strict Transport Security)
- [ ] ⚠️ Ajouter tous les headers de sécurité HTTP
- [ ] Tester avec [SSL Labs](https://www.ssllabs.com/ssltest/)

### Semaine 2 : Réseau (Jour 8-14)
- [ ] 🔶 Auditer et fermer les ports inutiles (FTP, Telnet)
- [ ] 🔶 Configurer le firewall (UFW/iptables)
- [ ] 🔶 Mettre en place le rate limiting Nginx
- [ ] Activer la journalisation des accès

### Semaine 3 : Application (Jour 15-21)
- [ ] 🟢 Sécuriser les cookies (Secure, HttpOnly, SameSite)
- [ ] 🟢 Implémenter Content-Security-Policy
- [ ] 🟢 Configurer CORS correctement
- [ ] Mettre à jour les dépendances logicielles

### Semaine 4 : DNS & Email (Jour 22-30)
- [ ] Configurer SPF, DKIM, DMARC
- [ ] Activer DNSSEC si disponible
- [ ] Relancer un scan CyberScore TN
- [ ] Documenter les changements

> 🎯 **Objectif** : Passer de Grade D/F à Grade B/A en 30 jours"""
}


def get_mock_response(message: str) -> str:
    """Return a contextual mock response based on keywords in the message."""
    msg = message.lower()
    if any(w in msg for w in ["score", "note", "pourquoi", "bas", "faible"]):
        return MOCK_RESPONSES["score"]
    elif any(w in msg for w in ["corriger", "correction", "fix", "réparer", "commande", "comment"]):
        return MOCK_RESPONSES["correction"]
    elif any(w in msg for w in ["plan", "roadmap", "action", "étapes", "recommandation"]):
        return MOCK_RESPONSES["plan"]
    return MOCK_RESPONSES["default"]


# ── Ollama Integration with Auto-Discovery ────────────────

async def get_active_ollama_info() -> tuple[str | None, str]:
    """Auto-detect running Ollama instance across configured port 25000 and standard 11434."""
    candidate_urls = [
        "http://127.0.0.1:25000",
        settings.OLLAMA_URL,
        "http://127.0.0.1:11434",
    ]
    urls = list(dict.fromkeys(candidate_urls))

    for url in urls:
        try:
            async with httpx.AsyncClient(timeout=1.0) as client:
                resp = await client.get(f"{url}/api/tags")
                if resp.status_code == 200:
                    data = resp.json()
                    models = [m.get("name", "") for m in data.get("models", [])]
                    
                    selected_model = settings.OLLAMA_MODEL
                    for m in models:
                        if "qwen" in m.lower() or "coder" in m.lower() or "llama" in m.lower():
                            selected_model = m
                            break
                    else:
                        if models:
                            selected_model = models[0]

                    return url, selected_model
        except Exception:
            continue

    return None, settings.OLLAMA_MODEL


async def query_ollama(message: str, scan_context: dict | None, language: str):
    """Query local Ollama instance with auto-discovered endpoint."""
    active_url, model_name = await get_active_ollama_info()
    if not active_url:
        return None

    system = SYSTEM_PROMPT.format(
        scan_context=json.dumps(scan_context, indent=2, ensure_ascii=False) if scan_context else "Aucun contexte de scan disponible.",
        language="Français" if language == "fr" else "العربية" if language == "ar" else "English"
    )
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                f"{active_url}/api/chat",
                json={
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": message}
                    ],
                    "stream": False
                }
            )
            response.raise_for_status()
            data = response.json()
            return data.get("message", {}).get("content", "")
    except Exception:
        return None


async def stream_ollama(message: str, scan_context: dict | None, language: str, site_url: str = ""):
    """Stream response from Ollama word by word or fallback gracefully."""
    active_url, model_name = await get_active_ollama_info()
    received_any_chunk = False

    if active_url:
        system = SYSTEM_PROMPT.format(
            scan_context=json.dumps(scan_context, indent=2, ensure_ascii=False) if scan_context else f"Site cible: {site_url}" if site_url else "Aucun contexte de scan disponible.",
            language="Français" if language == "fr" else "العربية" if language == "ar" else "English"
        )
        try:
            timeout = httpx.Timeout(connect=5.0, read=45.0, write=5.0, pool=5.0)
            async with httpx.AsyncClient(timeout=timeout) as client:
                async with client.stream(
                    "POST",
                    f"{active_url}/api/chat",
                    json={
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": system},
                            {"role": "user", "content": message}
                        ],
                        "stream": True
                    }
                ) as response:
                    async for line in response.aiter_lines():
                        if line:
                            try:
                                chunk = json.loads(line)
                                content = chunk.get("message", {}).get("content", "")
                                if content:
                                    received_any_chunk = True
                                    yield f"data: {json.dumps({'content': content})}\n\n"
                                if chunk.get("done"):
                                    yield f"data: {json.dumps({'done': True, 'source': 'ollama'})}\n\n"
                                    return
                            except json.JSONDecodeError:
                                continue
        except Exception:
            pass

    # If Ollama didn't return any text or failed, stream fallback
    if not received_any_chunk:
        mock = get_mock_response(message)
        words = mock.split(" ")
        for i, word in enumerate(words):
            sep = " " if i < len(words) - 1 else ""
            yield f"data: {json.dumps({'content': word + sep})}\n\n"
        yield f"data: {json.dumps({'done': True, 'source': 'mock'})}\n\n"


# ── Endpoints ─────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Non-streaming chat endpoint."""
    result = await query_ollama(request.message, request.scan_context, request.language)
    if result:
        return ChatResponse(response=result, source="ollama")

    return ChatResponse(
        response=get_mock_response(request.message),
        source="mock"
    )


@router.get("/chat/stream")
async def chat_stream(message: str, language: str = "fr", site_url: str = ""):
    """Streaming chat endpoint (SSE)."""
    scan_context = {"site_url": site_url} if site_url else None

    return StreamingResponse(
        stream_ollama(message, scan_context, language, site_url),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/status")
async def ai_status():
    """Check AI service availability with auto-discovery across candidate ports."""
    active_url, model_name = await get_active_ollama_info()

    return {
        "ollama": {
            "available": bool(active_url),
            "url": active_url or settings.OLLAMA_URL,
            "model": model_name,
        },
        "gemini": {
            "available": False,
            "status": "Désactivé (Politique de Souveraineté Territoriale ANCS)"
        },
        "fallback": "mock"
    }
