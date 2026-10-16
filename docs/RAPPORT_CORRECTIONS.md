# CyberScore TN — Liste des Rectifications à Apporter au Rapport PFA (RAPPORT_CORRECTIONS.md)

Ce document recense exhaustivement les divergences identifiées par l'audit technique entre le texte actuel du rapport de stage (`docs/RAPPORT_PFA.md`) et la réalité vérifiée du code source.

> **Consigne de gouvernance :** Conformément au brief, le fichier `RAPPORT_PFA.md` n'a pas été modifié directement par l'agent. Cette liste fournit à l'auteur (Hamdouni Yosri) l'ensemble des corrections factuelles à appliquer dans son rapport écrit avant l'impression définitive et le dépôt au jury.

---

## 1. Moteur de Scan et Parallélisme

| Section du Rapport | Énoncé Actuel du Rapport | Réalité du Code Source | Correction Recommandée |
|---|---|---|---|
| **§ 4.2 & § 6.1** | "16 modules d'audit exécutés en parallèle en 7,4 s" | 15 scanners Python sont implémentés. Le 16ème (`patching`, 8 %) est réservé. L'exécution est orchestrée en 3 phases séquentielles (`quick`: 4, `standard`: +6, `deep`: +5). Les scanners sont parallèles *au sein* de chaque phase via `asyncio.gather`. | Remplacer par : *"15 modules d'analyse implémentés et 1 catégorie réservée (`patching`), orchestrés en 3 phases progressives avec exécution concurrente interne par phase via `asyncio.gather`."* |
| **§ 6.3** | "Gain de vélocité de 12x, 15x à 20x" | Multiplicateurs théoriques non mesurés empiriquement sur banc d'essai standardisé. | Supprimer les multiplicateurs non sourcés ou ajouter la mention *"[à mesurer sur banc d'essai comparatif]"*. |
| **§ 6.4** | "Formule pénalisant à 0 les scanners en échec" | `calculate_total_score` divise par la somme des poids des catégories ayant réussi (`max_score > 0`). Un scanner en timeout est **exclu** du dénominateur, non pénalisé à zéro. | Mettre à jour la formule : $$Score = \frac{\sum (\text{normalisé} \times \text{poids})}{\sum \text{poids des modules exécutés}}$$. |
| **§ 6.2** | Tableau des poids : "Modules 9 à 16 = 38 %" | Les poids exacts (`base.py`) donnent pour les modules 9 à 16 : $5+5+5+4+4+4+3+2 = 32\,\%$ (ou $47\,\%$ si on inclut OWASP 15 % et Network 8 %). | Corriger le tableau avec les poids réels de `CATEGORY_WEIGHTS` (`owasp` 15 %, `ssl` 12 %, `headers` 10 %, `network` 8 %, `patching` 8 %, etc.). |

---

## 2. Modules d'Analyse Réseau et DNS

| Section du Rapport | Énoncé Actuel du Rapport | Réalité du Code Source | Correction Recommandée |
|---|---|---|---|
| **§ 6.5** | "Vérification de l'autorité racine TunTrust et scan via sslyze" | `ssl_scanner.py` utilise la bibliothèque standard Python `import ssl` et `socket`. Aucun appel à `sslyze` n'est présent, et aucune vérification de l'émetteur TunTrust n'est codée. | Remplacer par : *"Inspection SSL/TLS native via la bibliothèque standard Python (`ssl.create_default_context`), analysant la validité du certificat, les versions de protocole supportées et la conformité HSTS."* |
| **§ 6.6** | "Test de transfert de zone DNS AXFR" | `dns_scanner.py` inspecte DNSSEC (flag AD), CAA records, la redondance des serveurs NS et les chaînes CNAME. Il ne teste pas AXFR. | Supprimer la mention du transfert de zone AXFR. Préciser les 4 tests réels : DNSSEC, CAA, redondance NS, résolveurs CNAME. |
| **§ 7.2** | "Scanneur de ports à 150 threads concurrents" | `probe_agent/tools/port_scanner.py` fixe explicitement `MAX_WORKERS = 40`. | Remplacer 150 par **40 threads** (choix de conception justifié par l'évitement du déni de service et le respect de la bande passante). |
| **§ 7.2** | "Cartographie de 30 ou 34 services réseau" | `SERVICE_MAP` dans `port_scanner.py` contient exactement **33 services** répertoriés. | Aligner le texte sur **33 services réseau**. |
| **§ 7.3** | "Base EOL de 7 (ou 9) règles d'obsolescence" | `obsolescence_checker.py` contient exactement **8 motifs (`"pattern"`)** de détection logicielle. | Aligner le texte sur **8 signatures d'obsolescence logicielle**. |

---

## 3. Intelligence Artificielle et RAG

| Section du Rapport | Énoncé Actuel du Rapport | Réalité du Code Source | Correction Recommandée |
|---|---|---|---|
| **§ 5.4 & § 7.4** | "Indexation vectorielle JSONB & RAG (Retrieval-Augmented Generation)" | Le dépôt ne contient ni base vectorielle (pgvector, Chroma, FAISS), ni pipeline RAG. L'IA fonctionne par prompt engineering direct avec injection des vulnérabilités validées en JSON. | Remplacer par : *"Inférence LLM locale souveraine (Qwen2.5-Coder via Ollama) avec prompt templating structuré, température 0.1, et contrainte de sortie JSON (`format: 'json'`)."* |
| **§ 7.5** | "Modèle prédictif à base de réseaux neuronaux LSTM à +90 jours" | `prediction.py` implémente une régression heuristique à +30 jours basée sur la moyenne glissante et les tendances de patch. | Qualifier le modèle prédictif de *"modèle heuristique à +30 jours"* et positionner l'entraînement LSTM/Deep Learning à +90 jours en perspective. |

---

## 4. Données Nationales et Benchmark

| Section du Rapport | Énoncé Actuel du Rapport | Réalité du Code Source | Correction Recommandée |
|---|---|---|---|
| **§ 7.7** | "Audit de 115 ou 120 sites étatiques" | Le jeu de données réel (`frontend/lib/real-scans.json`) compte **121 domaines** (66 en ligne, 55 hors ligne). | Unifier le chiffre à **121 entités publiques auditées** dans l'ensemble des chapitres. |
| **§ 7.7** | Répartition sectorielle variable | La jointure réelle entre `real-scans.json` et `tunisia_organizations.json` donne : 45 Ministères, 42 Collectivités Locales, 17 Institutions Publiques, 17 Entreprises Publiques. | Adopter cette décomposition exacte vérifiée. |
| **§ 7.8** | "Score de la Tunisie comparé aux scores réels de la France, de l'Estonie..." | Les scores des autres nations ne proviennent pas de scans en direct mais d'une baseline illustrative calibrée sur l'indice ITU GCI. | Ajouter la mention : *"Scores internationaux fournis à titre de baseline comparative indicative issue de l'ITU Global Cybersecurity Index."* |
| **§ 1.3** | Coûts commerciaux cités ("~180 000 $", "550 000 DT/an") | Aucune source publique vérifiable et datée n'est fournie. | Remplacer par un argumentaire axé sur la souveraineté des données, l'indépendance technologique et l'évitement des devises fortes sans avancer de chiffres non sourcés. |

---

## 5. Sécurité, Cryptographie et Authentification

| Section du Rapport | Énoncé Actuel du Rapport | Réalité du Code Source | Correction Recommandée |
|---|---|---|---|
| **§ 7.10** | "Attestation scellée par signature numérique SHA-256" | SHA-256 est une fonction de hachage cryptographique produisant une **empreinte (digest)** de 64 caractères hexadécimaux, non une signature numérique asymétrique (qui nécessiterait une clé privée RSA/Ed25519). | Remplacer "signature" par **"empreinte cryptographique de session (digest SHA-256)"**. Mentionner la signature asymétrique Ed25519 / HMAC comme perspective. |
| **§ 7.9** | "Indicateur d'hébergement souverain forçant le Grade F 0/100 (Domaine Suspect)" | Le code (`frontend/app/api/scan/route.ts`) applique une déduction de 12 points sur la catégorie `ports` sans écraser le score global à 0. De plus, la vérification se base sur un test de préfixe IP (193.95.x.x, 41.224-231.x.x, 197.10.x.x) et non un lookup ASN BGP. | Rectifier : *"L'indicateur souverain teste l'appartenance de l'IP aux plages nationales de l'ATI (AS2609) et applique une déduction ciblée de 12 points sur le score réseau sans disqualifier arbitrairement le site."* |
| **§ 7.11** | "Journal d'audit infalsifiable et non-répudiation serveur" | Le journal d'audit est géré côté client (`utils/auditLogger.ts`) dans le `localStorage` du navigateur. | Préciser qu'il s'agit d'un *"journal applicatif d'audit de session"* et proposer la persistance immuable côté serveur (PostgreSQL WORM ou append-only log) en perspectives. |
| **§ 5.2** | "Authentification robuste par cookies HttpOnly avec SameSite=Strict" | L'authentification API utilise des tokens Bearer JWT transmis dans les en-têtes Authorization; aucun cookie HttpOnly n'est généré dans `auth_routes.py`. | Présenter la transition vers des cookies de session `HttpOnly; SameSite=Strict; Secure` comme un axe de durcissement en perspective d'industrialisation. |
| **§ 2.1** | "Principe du Permanent 0-Day imposé par la législation tunisienne" | Il ne s'agit pas d'un article de loi tunisien, mais du parti-pris méthodologique de l'auteur inspiré des standards ANCS. | Reformuler en : *"Méthodologie d'audit continu à posture zéro-confiance (Zero-Day posture) adoptée par le projet en adéquation avec les orientations de l'ANCS."* |

---

## 6. Tests et Validation Logicielle

| Section du Rapport | Énoncé Actuel du Rapport | Réalité du Code Source | Correction Recommandée |
|---|---|---|---|
| **§ 8.2** | "92 % de couverture de code atteinte sur l'ensemble de la plateforme" | La couverture mesurée lors d'une exécution réelle avec `pytest --cov` donne **100 % sur le moteur de scoring (`score_engine.py`)**, **98 % sur les abstractions (`base.py`)**, **99 % sur les modèles de sonde (`models.py`)**, et **6 % au total** sur les 3 205 lignes de l'application complète. | Mettre à jour avec les résultats authentiques : *"Suite de tests automatisée (17 tests unitaires, 100 % de succès) couvrant exhaustivement le cœur algorithmique de notation et les règles de validation anti-faux positifs."* |
| **Général** | Adresse de contact `assistance@anci.tn` | L'ANCS utilise le domaine officiel `ancs.tn` (ancienne dénomination ANCI obsolète). | Remplacer systématiquement `anci.tn` par `ancs.tn`. |
