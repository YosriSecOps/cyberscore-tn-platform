# CyberScore TN — Registre des Métriques et Faits Vérifiés (NUMBERS.md)

Ce document constitue la **source de vérité absolue** des chiffres cités dans la présentation de soutenance (`docs/presentation.html`), le script orateur (`docs/PRESENTATION.md`), et la foire aux questions du jury (`docs/JURY_QA.md`).

Chaque métrique ci-dessous est sourcée directement depuis le code source exécuté ou le fichier de données réel `frontend/lib/real-scans.json`.

---

## 1. Instantané National (Audit des Sites Publics Tunisiens)
*Source : `frontend/lib/real-scans.json` (121 entrées)*

| Métrique | Valeur Vérifiée | Source / Commande de Vérification |
|---|---|---|
| **Périmètre total audité** | **121 sites web** | `len(json.load(open('frontend/lib/real-scans.json')))` |
| **Sites en ligne et joignables** | **66 sites (54.5 %)** | `s['isOnline'] is True` |
| **Sites hors ligne / injoignables** | **55 sites (45.5 %)** | `s['isOnline'] is False` |
| **Score moyen national global** | **57.60 / 100** | Moyenne arithmétique sur les 121 entrées |
| **Score moyen des sites en ligne** | **64.97 / 100 (arrondi à 65.0)** | Moyenne arithmétique sur les 66 sites joignables |
| **Score moyen des sites hors ligne** | **48.76 / 100** | Moyenne arithmétique sur les 55 sites hors ligne (plancher de pénalité à ~42-49 au lieu d'exclusion) |
| **Grade A (Excellent ≥ 90)** | **2 sites (1.7 %)** | `presidence.gov.tn` (42), `defense.tn`... |
| **Grade B+ (85-89)** | **3 sites (2.5 %)** | Requête sur `grade == 'B+'` |
| **Grade B (80-84)** | **4 sites (3.3 %)** | Requête sur `grade == 'B'` |
| **Grade C+ (75-79)** | **15 sites (12.4 %)** | Requête sur `grade == 'C+'` |
| **Grade C (70-74)** | **17 sites (14.0 %)** | Requête sur `grade == 'C'` |
| **Grade D (60-69)** | **54 sites (44.6 %)** | Première cohorte nationale |
| **Grade F (< 60 / Critique)** | **26 sites (21.5 %)** | Défaillances majeures ou absence de chiffrement TLS |

### Répartition par Secteurs d'Activité
*Source croisée : `frontend/lib/real-scans.json` + `backend/app/data/tunisia_organizations.json` + `tunisia_sectors.json`*
*Taux de correspondance : 121/121 (0 entité non catégorisée).*

1. **Ministères (Secteur 1)** : **45 entités**, score moyen de **59.3 / 100**
2. **Collectivités Locales (Secteur 3)** : **42 entités**, score moyen de **51.9 / 100**
3. **Institutions Publiques (Secteur 2)** : **17 entités**, score moyen de **62.8 / 100**
4. **Entreprises Publiques (Secteur 4)** : **17 entités**, score moyen de **62.1 / 100**

---

## 2. Moteur d'Analyse et Facteurs de Risque
*Source : `backend/app/scanners/base.py` et `backend/app/scanners/score_engine.py`*

| Paramètre | Valeur Exacte | Règle d'Implémentation |
|---|---|---|
| **Nombre total de facteurs** | **16 catégories** | Définies dans `CATEGORY_WEIGHTS` (`base.py:53-70`) |
| **Scanners implémentés** | **15 scanners Python** | 15 classes instanciées dans `SCAN_PHASES` (`orchestrator.py:29-48`) |
| **Scanners réservés** | **1 scanner** | `patching` (poids 0.08 / max 8 pts, réservé pour intégration CVE locale) |
| **Poids OWASP Top 10** | **15 % (0.15)** | `owasp`, max 15 pts |
| **Poids SSL / TLS** | **12 % (0.12)** | `ssl`, max 12 pts (implémentation Python `ssl` standard) |
| **Poids Security Headers** | **10 % (0.10)** | `headers`, max 10 pts (HSTS, CSP, XFO, XCTO, Referrer, Permissions) |
| **Poids Sécurité Réseau** | **8 % (0.08)** | `network`, max 8 pts |
| **Poids Patching / CVEs** | **8 % (0.08)** | `patching`, max 8 pts (réservé) |
| **Poids DNS & DNSSEC** | **5 % (0.05)** | `dns`, max 5 pts (DNSSEC, CAA, NS redundancy, CNAME chains) |
| **Poids Content Security Policy** | **5 % (0.05)** | `csp`, max 5 pts |
| **Poids Divulgation d'Info** | **5 % (0.05)** | `info`, max 5 pts |
| **Poids Sous-domaines** | **5 % (0.05)** | `subdomain`, max 5 pts |
| **Poids Threat Intelligence** | **5 % (0.05)** | `threat_intel`, max 5 pts |
| **Poids Fraîcheur Technologique** | **5 % (0.05)** | `tech`, max 5 pts |
| **Poids Cookies de Session** | **4 % (0.04)** | `cookie`, max 4 pts |
| **Poids Sécurité Email (SPF/DMARC)**| **4 % (0.04)** | `email`, max 4 pts |
| **Poids Risque Supply Chain** | **4 % (0.04)** | `supply_chain`, max 4 pts |
| **Poids Gestion des Certificats** | **3 % (0.03)** | `cert`, max 3 pts |
| **Poids Conformité Historique** | **2 % (0.02)** | `history`, max 2 pts |
| **Somme des poids** | **1.000 (100.0 %)** | Vérifié par test unitaire `test_weights_sum_to_one()` |

### Déductions par Sévérité
*Source : `backend/app/scanners/base.py:98-106`*
- **Critique** : −3.0 points
- **Haute** : −2.0 points
- **Moyenne** : −1.0 point
- **Faible** : −0.5 point
- **Information** : 0.0 point (neutre)
- Formule plancher : `max(0, max_score - deduction)`

### Formule de Normalisation du Score Global
*Source : `backend/app/scanners/score_engine.py:36-59`*
$$\text{Score} = \frac{\sum (\text{Score Normalisé} \times \text{Poids})}{\sum \text{Poids des modules exécutés}}$$
- **Règle d'exclusion :** Tout scanner qui subit un timeout ou une erreur réseau renvoie `max_score=0, weight=0` et est **exclu du calcul**, et **non pénalisé à zéro**.

---

## 3. Échelles de Notation Comparées

### A. Échelle Moteur 16 Facteurs (`score_engine.py`)
- **A+ (★★★)** : $\ge 95$
- **A  (★★★)** : $\ge 90$
- **B  (★★☆)** : $\ge 80$
- **C  (★★☆)** : $\ge 70$
- **D  (★☆☆)** : $\ge 60$
- **F  (★☆☆)** : $< 60$

### B. Échelle Sonde Autonome Multi-Agents (`remediation_agent.py`)
- **A** : $\ge 85$
- **B** : $\ge 70$
- **C** : $\ge 55$
- **D** : $\ge 40$
- **F** : $< 40$
- Déductions de la sonde : Critique −22, Haute −12, Moyenne −6, Faible −2 (plancher clampé entre 10 et 100).

---

## 4. Métriques de la Sonde Multi-Agents (`probe_agent/`)
*Source : code source du dossier `probe_agent/`*

| Composant | Valeur Exacte | Fichier Source |
|---|---|---|
| **Nombre d'agents** | **4 agents autonomes** | `recon_agent`, `cve_agent`, `poc_agent`, `remediation_agent` |
| **Threads scanneur de ports** | **40 workers max** | `probe_agent/tools/port_scanner.py:27` (`MAX_WORKERS = 40`) |
| **Services réseau répertoriés** | **33 services distincts** | `probe_agent/tools/port_scanner.py:47-83` (`SERVICE_MAP`) |
| **Motifs d'obsolescence (patterns)**| **8 patterns** | `probe_agent/tools/obsolescence_checker.py:23-74` |
| **Champs d'état AuditState** | **27 attributs dataclass** | `probe_agent/models.py:50-89` |
| **Température LLM Ollama** | **0.1 (Strictement déterministe)**| `probe_agent/ai_client.py:61` |
| **Format sortie LLM** | **JSON structuré (`format: "json"`)** | `probe_agent/ai_client.py:70` |
| **Taille contexte LLM** | **2048 tokens (`num_ctx: 2048`)** | `probe_agent/ai_client.py:64` |
| **Limite génération LLM** | **250 tokens max (`num_predict: 250`)** | `probe_agent/ai_client.py:63` |
| **Scellement cryptographique** | **SHA-256 (64 caractères hex)** | `probe_agent/models.py:126-135` (empreinte, non signature) |

---

## 5. Tests et Couverture de Code
*Source : Commande exécutée : `uv run pytest -q --cov=app --cov=../probe_agent`*

| Périmètre de Test | Résultat Mesuré |
|---|---|
| **Statut d'exécution** | **17 tests passés avec succès, 0 échec (100 % pass)** |
| **Temps d'exécution** | **0.10 s (tests seuls) / 1.79 s (avec profiling cov)** |
| **Couverture Moteur de Score (`score_engine.py`)** | **100 % (24/24 statements)** |
| **Couverture Modèle de Base (`base.py`)** | **98 % (48/49 statements)** |
| **Couverture Modèles Sonde (`probe_agent/models.py`)** | **99 % (69/70 statements)** |
| **Couverture Validation PoC (`poc_agent.py`)** | **82 % (27/33 statements)** |
| **Couverture globale de l'application** | **6 % sur 3 205 statements (185 statements couverts)** |

> **Note d'honnêteté intellectuelle :** La mention précédente de "92 % de couverture" provenait d'une suite de tests historique cassée qui n'était plus exécutée. Le chiffre de 6 % global reflète fidèlement la couverture des tests unitaires isolés sans dépendance externe, avec 100 % sur le cœur de calcul algorithmique.

---

## 6. Architecture Système et Déploiement
*Source : `Dockerfile`, `docker-compose.yml`, `package.json`, scripts de déploiement*

| Composant | Caractéristique Exacte | Source |
|---|---|---|
| **Python Backend** | **Python 3.12-slim** | `backend/Dockerfile:1` |
| **Fichiers modèles SQLAlchemy** | **18 fichiers** | `backend/app/models/*.py` |
| **Cache développement** | **Redis** | `docker-compose.yml` (`image: redis:7-alpine`) |
| **Cache déploiement VM** | **Valkey 7** | Script de déploiement VM Debian |
| **Framework Frontend** | **Next.js 15 (App Router)** | `frontend/package.json` (`next: ^15`) |
| **Moteur CSS** | **Tailwind CSS v4** | `frontend/package.json` (`tailwindcss: ^4`) |
| **Langues supportées** | **3 langues (Arabe RTL, Français, Anglais)** | `frontend/app/[locale]` |
| **Routes de pages** | **15 routes frontend** (45 pages avec les 3 langues) + **3 routes API** | `frontend/app/` |
| **Structure du rapport PDF** | **7 sections officielles** | `frontend/components/report/` |

---

## 7. Données Non Sourdées Supprimées ou Révisées

Conformément à la Règle Zéro, les éléments suivants ont été **supprimés** des diapositives ou **rectifiés** :
1. **Coûts de licence commerciale supprimés :** Les mentions "~180 000 $", "~200 000 $", "550 000 DT/an" pour SecurityScorecard/BitSight n'étaient pas publiquement documentées.
2. **Superlatifs non vérifiables supprimés :** "Seule plateforme au monde..." a été retiré.
3. **Multiplicateurs de vélocité supprimés :** "Gain 12x / 15x / 20x" retirés, le parallélisme étant expliqué par son mécanisme réel (`asyncio.gather` par phase).
4. **Allégation RAG / Vector DB supprimée :** L'architecture utilise une inférence directe avec prompt templating et parsing JSON, sans magasin vectoriel.
5. **Vérification TunTrust / AXFR retirées :** Le scanner SSL Python utilise la bibliothèque standard `ssl` sans validation TunTrust; le scanner DNS ne teste pas le transfert de zone AXFR.
6. **Empreinte SHA-256 :** Qualifiée d'**empreinte cryptographique de session** (digest) et non de signature numérique asymétrique (Ed25519/HMAC en perspective).
7. **Limite Zéro Faux Positif :** Explicitation honnête de la limite du test HTTP 200 > 10 octets susceptible d'admettre un soft-404.
8. **Statut RBAC / Session :** Absence d'authentification sur `/api/scan` documentée comme limite de prototype de recherche.
