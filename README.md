# CyberScore TN — Sovereign Cybersecurity Scoring & Telemetry Platform
### منصة تقييم ومراقبة الأمن السيبراني للمواقع الحكومية والسيادية التونسية

<p align="center">
  <img src="https://img.shields.io/badge/Security-Sovereign%20Defense-red?style=for-the-badge&logo=shield" alt="Sovereign Defense" />
  <img src="https://img.shields.io/badge/Framework-Decree--Law%202023--17-0052cc?style=for-the-badge" alt="Decree-Law 2023-17" />
  <img src="https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/FastAPI-Python%203.12-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/AI%20Inference-Ollama%20(Qwen2.5--Coder%3A7b)-7c3aed?style=for-the-badge&logo=ollama" alt="Ollama Local LLM" />
  <img src="https://img.shields.io/badge/License-Proprietary%20%26%20Confidential-blueviolet?style=for-the-badge" alt="Proprietary License" />
</p>

---

## 📌 Présentation Générale // نظرة عامة

**CyberScore TN** est une plateforme nationale souveraine d'audit continu, de télémétrie de cybermenaces (CTI), de scoring prédictif et de remédiation assistée par intelligence artificielle conçue pour le cyberespace étatique tunisien (`.gov.tn`, domaines régaliens `.tn` et entreprises publiques stratégiques `.com.tn`).

Développée dans le cadre d'un **Projet de Fin d'Année (PFA) d'Ingénieur en Cybersécurité à TEK-UP** en partenariat avec l'**Agence Nationale de la Cybersécurité (ANCS)**, la plateforme répond directement aux exigences du **Décret-loi n° 2023-17 du 11 mars 2023** relatif à la sécurité et à la souveraineté numérique nationale.

---

## 🌟 Fonctionnalités Majeures // المميزات الرئيسية

### 1. 🔍 Moteur d'Audit Modulaire (16 Piliers d'Évaluation Passifs)
* **Certificats SSL/TLS TunTrust** : Analyse cryptographique TLS 1.3, conformité de l'autorité racine nationale, détection de suites dépréciées (RC4, 3DES).
* **En-têtes HTTP de Sécurité** : Vérification de la présence et rigueur des directives HSTS (`max-age`, `preload`), CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
* **Résolution DNS & Intégrité DNSSEC** : Validation de la signature cryptographique des zones DNS, détection de serveurs ouverts et détection de fuites de sous-domaines.
* **Sécurisation des Cookies** : Inspection des flags de protection de session (`Secure`, `HttpOnly`, `SameSite=Lax/Strict`).
* **Protection Email DMARC / SPF / DKIM** : Évaluation de la résistance à l'usurpation d'identité et au phishing étatique.
* **Détection de Souveraineté d'Hébergement** : Vérification de l'appartenance de l'adresse IP au bloc IP national de l'ATI (AS2609).

### 2. 🤖 Sonde d'Audit Autonome Multi-Agents (`probe_agent`)
Pour les environnements autorisés (Mandat ANCS + RoE signé), la plateforme déploie un graphe asynchrone composé de **4 agents spécialisés** :
* **Agent 1 (Reconnaissance Réseau & Services)** : Cartographie non agressive des ports et bannières logicielles, dérivation d'empreinte d'OS par distance TTL.
* **Agent 2 (Analyse des Vulnérabilités & Configuration)** : Corrélation contextuelle avec la base CVE et détection de failles d'en-têtes.
* **Agent 3 (Validation Dynamique PoC)** : Vérification non destructive de l'exploitabilité réelle (élimination des faux positifs).
* **Agent 4 (Remédiation & Scellement SHA-256)** : Élaboration d'une feuille de route d'actions correctives avec commandes Nginx/Apache et scellement d'intégrité cryptographique SHA-256.

### 3. 👩‍💼 Amina 3D — Analyste IA Souveraine On-Premise
* **Modèle LLM 100% Local (Qwen2.5-Coder:7b sous Ollama)** : Zéro fuite de données vers des serveurs cloud tiers étrangers.
* **Avatar 3D WebGL (Three.js)** : Rendu interactif à 60 FPS avec animations synchronisées lors de l'élocution.
* **Streaming SSE (Server-Sent Events)** : Génération fluide des réponses mot par mot avec contrôle d'interruption immédiat (*Kill-Switch*).
* **Synchronisation Dynamique Multi-Scans** : Transmission bidirectionnelle fidèle des scores réels, grades et décomptes de vulnérabilités depuis n'importe quel mode d'audit (*Quick*, *Standard*, *Deep*, *Autonome IA*) avec purge automatique des caches périmés.
* **Génération de Scripts de Durcissement Prêts à l'Emploi** : Fichiers `nginx.conf`, règles Apache `.htaccess` et pare-feu UFW.

### 4. 📊 Command Center & Observatoire Géostratégique
* **Carte Interactive de la Tunisie (SVG/Canvas)** : Visualisation de la posture cyber par gouvernorat et par pôle d'activité.
* **Matrice des Menaces & CTI (War Room)** : Indicateurs en temps réel des vecteurs d'attaques prioritaires.
* **Moteur Prédictif à +30 Jours** : Projections heuristiques de l'évolution des scores selon les délais de remédiation.
* **Gouvernance Granulaire (RBAC)** : Cloisonnement strict des rôles (*Admin ANCS*, *Auditeur RSSI Ministériel*, *Observateur Viewer*) avec verrouillage HTTP 403.
* **Générateur PDF Vectoriel Officiel** : Attestations d'audit certifiées de 7 pages scellées par empreinte cryptographique SHA-256.

---

## 🏗️ Architecture Distribuée Tri-VM (VMware VMnet8)

Pour garantir une isolation étanche conforme au standard **NIST SP 800-115**, l'infrastructure est segmentée en **trois machines virtuelles dédiées** reliées en réseau privé sécurisé :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HÔTE PHYSIQUE WINDOWS 11 (GPU NVIDIA)                    │
│                 Ollama LLM (qwen2.5-coder:7b sur Port 25000)                │
│                           IP : 192.168.98.1                                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Réseau Privé VMnet8 (192.168.98.0/24)
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐
│   VM 1 : FRONTEND DMZ       │ │    VM 2 : CORE BACKEND      │ │   VM 3 : BASTION AGENTS     │
│   (CyberScore-DMZ-Front)    │ │    (CyberScore-Core-Back)   │ │  (CyberScore-Agent-Probe)   │
│   IP : 192.168.98.150       │ │    IP : 192.168.98.149      │ │   IP : 192.168.98.148       │
│                             │ │                             │ │                             │
│ • Next.js 16 (Port 3000)    │ │ • FastAPI (Port 8000)       │ │ • Moteur 4 Agents Autonomes │
│ • Nginx Reverse Proxy (443) │ │ • PostgreSQL 16 (Port 5432) │ │ • RHEL 9.5 Minimal          │
│ • RHEL 10.1 Minimal         │ │ • Valkey 7 / Redis (6379)   │ │ • SELinux Enforcing         │
│ • Rôles DMZ & Certificats   │ │ • Enclave Privée Métier     │ │ • Firewalld DROP Policy     │
└─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
```

---

## 💻 Stack Technologique // التقنيات المستخدمة

| Composant | Technologies Retenues |
| :--- | :--- |
| **Frontend Web** | Next.js 16 (App Router), React 19, TypeScript, Lucide Icons |
| **Styling & 3D** | Vanilla CSS Glassmorphism, Three.js, React Three Fiber |
| **Internationalisation** | Support natif trilingue (Arabe RTL avec police Noto Sans Arabic, Français LTR, Anglais LTR) |
| **Backend & API** | Python 3.12, FastAPI (Asynchrone), Pydantic v2, OpenAPI 3.1 |
| **Base de Données & Cache** | PostgreSQL 16, SQLAlchemy 2.0 (asyncpg), Redis 7 / Valkey |
| **IA & Inférence Locale** | Ollama, Qwen2.5-Coder:7b, Server-Sent Events (SSE) |
| **Sécurité & Confinement** | SELinux Enforcing, Firewalld, Hash cryptographique SHA-256 |
| **Génération PDF** | `@react-pdf/renderer` (Rendu vectoriel A4 haute définition) |

---

## 📂 Structure du Répertoire // بنية المشروع

```
STAGE_PFA/
├── backend/                  # Application Backend FastAPI Python
│   ├── app/
│   │   ├── config.py         # Variables d'environnement & configuration
│   │   ├── database.py       # Connexion asynchrone PostgreSQL 16
│   │   ├── main.py           # Point d'entrée FastAPI & middlewares
│   │   ├── models/           # Modèles de données SQLAlchemy
│   │   ├── routes/           # Routes API (auth, scan, dashboard, ai)
│   │   └── services/         # Logique métier, scoring & CTI
├── frontend/                 # Application Frontend Next.js 16
│   ├── app/                  # Routes dynamiques ([locale], /scan, /assistant, /reports)
│   ├── components/
│   │   ├── ai/               # Avatar Amina 3D, console SOC, suggestions
│   │   ├── dashboard/        # Carte de Tunisie, métriques, radar
│   │   ├── scanner/          # Client d'audit, jauges, workflows d'agents
│   │   └── report/           # Générateur de rapports PDF certifiés
│   ├── lib/                  # Coordinateurs d'audit, référentiels JSON, i18n
├── probe_agent/              # Sonde d'audit autonome multi-agents
│   ├── agents/               # 4 Agents (Recon, CVE, PoC, Remediation)
│   ├── orchestrator.py       # Orchestrateur d'audit asynchrone
│   └── run.py                # Point d'entrée CLI du bastion
├── docs/                     # Documentation académique & technique
│   ├── RAPPORT_PFA.md        # Mémoire de PFA complet (11 chapitres)
│   ├── PRESENTATION.md       # Support de soutenance (32 diapositives)
│   └── latex_tekup/          # Sources LaTeX officielles pour Overleaf
├── docker-compose.yml        # Orchestration multi-conteneurs locale
├── LICENSE                   # Licence propriétaire exclusive (All Rights Reserved)
└── README.md                 # Documentation principale du projet
```

---

## 🚀 Démarrage Rapide // التشغيل السريع

### Prérequis
* Node.js $\ge 18$ et npm
* Python $\ge 3.10$
* Ollama avec le modèle `qwen2.5-coder:7b` (`ollama run qwen2.5-coder:7b`)

### 1. Cloner le Dépôt
```bash
git clone https://github.com/YosriSecOps/cyberscore-tn-platform.git
cd cyberscore-tn-platform
```

### 2. Configuration des Variables d'Environnement
```bash
cp .env.example .env
# Renseigner vos paramètres dans .env
```

### 3. Lancer le Backend FastAPI
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Lancer le Frontend Next.js
```bash
cd ../frontend
npm install
npm run dev
```

Ouvrez ensuite votre navigateur sur **`http://localhost:3000`** (ou l'IP de votre DMZ **`http://192.168.98.150`**).

---

## 📜 Propriété Intellectuelle & Licence // الملكية الفكرية

```
PROPRIETARY AND CONFIDENTIAL (ALL RIGHTS RESERVED)
Copyright (c) 2026 Yosri Hamdouni (YosriSecOps). All Rights Reserved.
```

Ce logiciel et sa documentation sont la propriété intellectuelle exclusive de **Yosri Hamdouni**, conçus dans le cadre d'un Projet de Fin d'Année à **TEK-UP** en partenariat avec l'**Agence Nationale de la Cybersécurité (ANCS)**.  
Toute reproduction, utilisation commerciale, modification ou diffusion publique sans autorisation écrite préalable est strictement interdite. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur & Crédits Académiques // إعداد الباحث

* **Auteur** : **Hamdouni Yosri** ([@YosriSecOps](https://github.com/YosriSecOps))
* **Filière** : Diplôme National d'Ingénieur en Génie Informatique & Cybersécurité
* **Établissement Universitaire** : École Supérieure Privée de Technologie et d'Ingénierie (**TEK-UP**)
* **Organisme Partenaire de Stage** : **Agence Nationale de la Cybersécurité (ANCS)**
* **Cadre Légal** : Décret-loi n° 2023-17 relatif à la cybersécurité en Tunisie
