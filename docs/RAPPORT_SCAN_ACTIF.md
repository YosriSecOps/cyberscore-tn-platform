# RÉPUBLIQUE TUNISIENNE
## MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE SCIENTIFIQUE
### ÉCOLE SUPÉRIEURE DES TECHNOLOGIES ET DU MANAGEMENT (TEK-UP)
#### DIPLÔME NATIONAL D'INGÉNIEUR EN GÉNIE INFORMATIQUE & CYBERSÉCURITÉ

---

<br>

# RAPPORT DE PROJET DE FIN D'ANNÉE
## Scan Actif & Audit Autonome Multi-Agents
### **CyberScore TN — Probe Agent : Conception et Déploiement d'un Moteur d'Audit Offensif Éthique et d'une Infrastructure Souveraine Cloisonnée**

<br>

---

| **Fiche de Synthèse du Projet Académique** | **Détails Officiels** |
| :--- | :--- |
| **Auteurs / Candidats** | **Yosri HAMDOUNI & Wajdi HAMDI** |
| **Filière** | Cycle Ingénieur en Informatique — Spécialité Cybersécurité |
| **Établissement** | TEK-UP University |
| **Organisme d'Application** | Agence Nationale de la Cybersécurité (ANCS) |
| **Cadre Réglementaire** | Décret-loi n° 2023-17 du 11 mars 2023 |
| **Année Académique** | 2025 – 2026 |

---

## Sommaire

1. [Chapitre 1 : Introduction Générale & Contexte Académique](#chapitre-1--introduction-générale--contexte-académique)
   - 1.1 Contexte du Projet
   - 1.2 Problématique du Scan Conventionnel
   - 1.3 Objectifs Visés
2. [Chapitre 2 : Cadrage Réglementaire & Doctrine « Zéro Faux Positif »](#chapitre-2--cadrage-réglementaire--doctrine--zéro-faux-positif-)
   - 2.1 Audit Passif vs Audit Actif
   - 2.2 Les Règles d'Engagement (RoE) et Décret ANCS 2023-17
   - 2.3 Le Principe Cardinal du Zéro Faux Positif
3. [Chapitre 3 : Architecture du Pipeline Multi-Agents](#chapitre-3--architecture-du-pipeline-multi-agents)
   - 3.1 Vue d'Ensemble du Pipeline Séquentiel
   - 3.2 Agent 1 : Cartographie Réseau Sans Déni de Service
   - 3.3 Agent 2 : Qualification CVE & Assistance IA Souveraine Locale
   - 3.4 Agent 3 : Validation Active Sécurisée (PoC Safe)
   - 3.5 Agent 4 : Calcul du CyberScore, Remédiation & Sceau SHA-256
4. [Chapitre 4 : Infrastructure de Déploiement & Sécurité Réseau](#chapitre-4--infrastructure-de-déploiement--sécurité-réseau)
   - 4.1 Architecture Tri-VM Cloisonnée
   - 4.2 Confinement de la VM Bastion de Scan
   - 4.3 Nom de Domaine National & Reverse Proxy Nginx
   - 4.4 Terminaison TLS & En-têtes de Durcissement
5. [Chapitre 5 : Réalisation de l'Interface & Démonstration](#chapitre-5--réalisation-de-linterface--démonstration)
   - 5.1 Modal d'Engagement et Vérification du Mandat
   - 5.2 Suivi Graphique en Temps Réel du Pipeline
   - 5.3 Restitution d'Audit & Portail de Vérification Publique
6. [Chapitre 6 : Tests, Résultats & Validation Expérimentale](#chapitre-6--tests-résultats--validation-expérimentale)
   - 6.1 Environnement et Protocole d'Essai
   - 6.2 Analyse des Performances et Précision
   - 6.3 Comparaison avec les Scanners Traditionnels
7. [Chapitre 7 : Conclusion Générale & Perspectives](#chapitre-7--conclusion-générale--perspectives)

---

## Chapitre 1 : Introduction Générale & Contexte Académique

### 1.1 Contexte du Projet
Dans le cadre de notre formation d'ingénieurs à TEK-UP, nous avons mené la conception et le déploiement d'un moteur d'audit offensif éthique intitulé **CyberScore TN — Probe Agent**. Ce module constitue le cœur actif de la plateforme nationale d'évaluation de la cybersécurité des sites institutionnels tunisiens. 

Alors que l'évaluation passive se limite à inspecter les informations publiques émises par les serveurs (certificats SSL, en-têtes HTTP, DNSSEC), de nombreuses vulnérabilités critiques ne peuvent être attestées sans une interaction réseau directe avec les services hébergés. Le projet vise à combler ce besoin par une solution automatisée, souveraine et rigoureuse.

### 1.2 Problématique du Scan Conventionnel
Les outils d'audit traditionnels du marché (tels que Nessus, OpenVAS ou Acunetix) présentent deux limites majeures en environnement étatique :
1. **L'accumulation des faux positifs** : Ces outils se basent fréquemment sur la seule bannière logicielle (par exemple « Apache 2.4.41 ») pour lister des dizaines de CVE, alors même que les modules vulnérables sont désactivés ou protégés par un pare-feu applicatif (WAF). Cela noie les administrateurs sous des rapports massifs inexploitables.
2. **Le risque de perturbation de service** : Les tirs massifs de requêtes agressives risquent de provoquer des dénis de service (DoS) involontaires sur des plateformes administratives fragiles.
3. **La dépendance envers des solutions cloud tierces** : L'envoi de résultats d'audit vers des infrastructures cloud étrangères expose la souveraineté numérique nationale.

### 1.3 Objectifs Visés
Notre projet académique répond à ces enjeux à travers quatre objectifs précis :
- **Automatiser un audit actif sécurisé** en moins de 45 secondes sans perturber la cible.
- **Appliquer la règle du Zéro Faux Positif** en exigeant une démonstration bénigne (PoC) avant toute confirmation de faille.
- **Intégrer une IA locale souveraine** (Ollama / modèle 7B) pour l'analyse sémantique, sans aucune fuite de données hors de l'infrastructure nationale.
- **Héberger la solution sur une architecture Tri-VM isolée** garantissant la haute disponibilité et le respect des normes strictes de l'ANCS.

---

## Chapitre 2 : Cadrage Réglementaire & Doctrine « Zéro Faux Positif »

### 2.1 Audit Passif vs Audit Actif
Le tableau suivant résume la distinction fondamentale établie entre les deux modes d'audit dans CyberScore TN :

| Critère | Scan Passif (16 Piliers) | Scan Actif (Probe Agent) |
| :--- | :--- | :--- |
| **Nature des opérations** | Lecture DNS, TLS, en-têtes publics, OSINT | Connexions TCP SYN ciblées, sondes applicatives HTTP |
| **Impact sur le serveur** | Strictement nul (zéro paquet agressif) | Sollicitation réseau contrôlée et mesurée |
| **Exigence légale** | Libre consultation publique | Mandat officiel obligatoire (Décret 2023-17) |
| **Rôle d'accès** | Consultation ouverte (Viewer) | Auditeur habilité / Officier ANCS |

### 2.2 Les Règles d'Engagement (RoE) et Décret ANCS 2023-17
Conformément au cadre fixé par le Décret-loi n° 2023-17 relatif à la sécurité du cyberespace tunisien, aucun audit actif ne peut être lancé sans respecter un protocole juridique strict :
1. **Mandat officiel obligatoire** : Un code de mandat (ex: `ANCS-2026`) est renseigné et tracé pour chaque tir.
2. **Périmètre d'action souverain** : Vérification des plages d'adresses IP tunisiennes (AS2609 de l'ATI, `193.95.*`, `41.22.*`) afin d'interdire tout tir accidentel hors de la juridiction nationale.
3. **Classification TLP:AMBER** : Les données produites sont confidentielles et réservées aux parties prenantes directes, avec signature numérique de l'auditeur.

### 2.3 Le Principe Cardinal du Zéro Faux Positif
La doctrine de notre projet repose sur un postulat technique simple : **« Une vulnérabilité non prouvée est considérée comme inexistante »**. 

Contrairement aux approches déductives qui estiment la présence d'une faille à partir d'un numéro de version théorique, notre moteur n'inscrit une anomalie dans le bilan officiel que si une sonde d'expérimentation inoffensive a reçu une réponse anormale confirmant l'exploitabilité effective du service. Si le test échoue ou si un WAF bloque la tentative, la vulnérabilité est déclassée.

```
[Bannière détectée : OpenSSH 7.4] 
           │
           ▼
[Recherche CVE théorique : CVE-2018-15473 (User Enumeration)]
           │
           ▼
[Vérification active bénigne par PoC]
     ├── Test négatif ou filtré ──────────► [Rejet : Faux Positif écarté]
     └── Réponse timing anormale validée ─► [Certification : Faille confirmée + Score déduit]
```

---

## Chapitre 3 : Architecture du Pipeline Multi-Agents

Le moteur d'audit est décomposé en **4 agents logiciels spécialisés**, développés en Python asynchrone (`asyncio`) et orchestrés de manière séquentielle pour garantir traçabilité et rapidité d'exécution.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Agent 1     │     │     Agent 2     │     │     Agent 3     │     │     Agent 4     │
│  Cartographie   │ ──► │ Détection CVE   │ ──► │ Validation PoC  │ ──► │  Synthèse Score │
│  Réseau (Ports) │     │ & IA Souveraine │     │  Non-Destructive│     │ & Sceau SHA-256 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
    [0% – 25%]              [25% – 50%]             [50% – 75%]             [75% – 100%]
```

### 3.1 Agent 1 : Cartographie Réseau Sans Déni de Service
L'Agent 1 a pour mission de découvrir les services exposés sur la cible sans saturer la bande passante :
- **Scan de ports ciblés** : Analyse sélective des ports standards d'administration et de production (ports 21, 22, 80, 443, 3306, 3389, 8080).
- **Empreinte de pile TCP/IP (OS Fingerprinting)** : Détection du système d'exploitation sous-jacent (Linux, Windows Server, BSD) par l'analyse du champ TTL (Time-To-Live) et de la taille de fenêtre TCP, sans envoyer de sondes intrusives.
- **Réduction de charge** : Utilisation de timeouts courts (800 ms) et de connexions semi-ouvertes pour préserver les ressources du serveur distant.

### 3.2 Agent 2 : Qualification CVE & Assistance IA Souveraine Locale
L'Agent 2 prend en entrée les services découverts par l'Agent 1 pour qualifier les vecteurs de risque :
- **Corrélation déterministe** : Comparaison des en-têtes applicatifs avec les bases nationales de vulnérabilités connues (NVD / CVE).
- **Inférence par LLM local souverain** : Intégration d'un modèle d'intelligence artificielle locale (Qwen2.5-Coder:7B exécuté via Ollama sur GPU/CPU dédié). L'IA est sollicitée avec un prompt structuré en format JSON strict. Elle permet de :
  - Éliminer le bruit des bannières complexes.
  - Déterminer la pertinence réelle d'un test PoC.
  - Formuler une explication claire en français pour les administrateurs système.
- **Confidentialité absolue** : Aucune donnée ne quitte le réseau interne, évitant tout recours aux APIs cloud propriétaires américaines.

### 3.3 Agent 3 : Validation Active Sécurisée (PoC Safe)
L'Agent 3 est le garant de la règle du Zéro Faux Positif. Il prend les failles candidates proposées par l'Agent 2 et exécute des tests inoffensifs prédéfinis :
- **Injections SQL aveugles bénignes** : Test d'échappement par guillemets simples surveillant la structure de la réponse HTTP sans chercher à altérer ni extraire de données.
- **Vérification de Directory Traversal** : Requête de lecture de fichiers d'en-tête inoffensifs sans écriture système.
- **Contrôle d'accès RDP / SSH** : Vérification de la disponibilité du handshake cryptographique sans attaque par force brute sur les mots de passe.
- **Sécurité des tests** : Dès qu'une anomalie est prouvée, le test s'arrête immédiatement afin d'éviter toute dégradation des performances de la cible.

### 3.4 Agent 4 : Calcul du CyberScore, Remédiation & Sceau SHA-256
L'Agent 4 clôture le cycle d'audit et produit les livrables :
- **Calcul de la note CyberScore** : Déduction mathématique pondérée à partir de la note de base (100 points) en fonction de la gravité des failles validées par l'Agent 3 (Critique: -25 pts, Haute: -15 pts, Moyenne: -8 pts, Faible: -3 pts).
- **Génération de la Roadmap de Remédiation** : Production des directives système prêtes à l'emploi (commandes `ufw`, `iptables`, `chmod`, ou directives de configuration Nginx/Apache) copiables en un clic.
- **Sceau d'intégrité SHA-256** : Calcul de l'empreinte cryptographique du rapport final afin de prévenir toute altération a posteriori.

---

## Chapitre 4 : Infrastructure de Déploiement & Sécurité Réseau

Dans le cadre des exigences de déploiement de notre projet d'ingénieur, l'ensemble de l'écosystème a été virtualisé sur un cluster composé de **trois Machines Virtuelles (Tri-VM)** sous Red Hat Enterprise Linux / Rocky Linux.

```
                           ┌───────────────────────────────┐
                           │      Utilisateur / Auditeur   │
                           └───────────────┬───────────────┘
                                           │ HTTPS (Port 443)
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  VM 1 : FRONTEND (DMZ)  [192.168.98.150]                                               │
│  - Interface Next.js 16 (React, Tailwind CSS)                                          │
│  - Reverse Proxy Nginx & Terminaison TLS (cyberscore.tn)                                │
└──────────────────────────┬─────────────────────────────────────────────────────────────┘
                           │ Proxy interne API HTTP (Port 8000)
                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  VM 2 : BACKEND & DATA  [192.168.98.149]                                               │
│  - Moteur FastAPI asynchrone (16 piliers passifs)                                      │
│  - Base de données PostgreSQL & Cache Redis                                            │
│  - Modèle IA Local Ollama (Qwen2.5-Coder:7B)                                           │
└──────────────────────────┬─────────────────────────────────────────────────────────────┘
                           │ Déclenchement orchestré (RPC / Socket)
                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  VM 3 : BASTION SCAN ACTIF  [192.168.98.151]                                           │
│  - Probe Agent autonome (4 Agents Python)                                              │
│  - Confinement réseau strict & Sondes TCP sortantes vers la cible                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Architecture Tri-VM Cloisonnée
Le découpage en trois machines virtuelles répond à un impératif d'isolation des responsabilités :
- **VM 1 — Frontend (DMZ)** : Accessible via le port HTTPS 443. Elle héberge l'application web Next.js 16 et assure le rôle de passerelle d'accès sécurisée.
- **VM 2 — Backend & Persistance** : Héberge les APIs FastAPI, la base de données relationnelle des scores ainsi que le serveur d'inférence Ollama.
- **VM 3 — Bastion de Scan Actif** : Dédiée exclusivement à l'exécution du Probe Agent.

### 4.2 Confinement de la VM Bastion de Scan
Isoler le scan actif sur la VM 3 offre deux garanties capitales :
1. **Protection de la plateforme hôte** : Si un site cible dispose d'un système de blocage IP automatique (Fail2ban, IPS), seule l'adresse IP de la VM 3 risque d'être mise en liste noire, garantissant que le portail web principal (VM 1) reste accessible sans interruption.
2. **Cloisonnement des privilèges** : Les sockets réseaux bruts nécessaires à l'analyse fine des paquets TCP s'exécutent dans un environnement restreint sans accès direct aux bases de données du projet.

### 4.3 Nom de Domaine National & Reverse Proxy Nginx
Pour résoudre les problématiques de partage de cookies de session et de politique de même origine (CORS / SameSite), l'ensemble des services est unifié sous le nom de domaine national **`cyberscore.tn`** :
- Les requêtes web sur `https://cyberscore.tn/` sont servies directement par le serveur Next.js.
- Les appels d'API sur `https://cyberscore.tn/api/` sont redirigés en interne par Nginx vers le backend FastAPI (`192.168.98.149:8000`).

### 4.4 Terminaison TLS & En-têtes de Durcissement
La sécurité des flux est renforcée par une configuration Nginx stricte :
- **Redirection automatique HTTP vers HTTPS** avec code d'état 301.
- **En-têtes de sécurité obligatoires** :
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS).
  - `X-Frame-Options: DENY` (protection contre le clickjacking).
  - `X-Content-Type-Options: nosniff` (protection contre les dérives de type MIME).

---

## Chapitre 5 : Réalisation de l'Interface & Démonstration

L'interface graphique a été conçue pour combiner élégance ergonomique et rigueur opérationnelle.

### 5.1 Modal d'Engagement et Vérification du Mandat
Avant tout lancement d'un scan actif, l'auditeur est soumis à une barrière de validation obligatoire :
- Saisie du **Code de Mandat Officiel ANCS** (ex : `ANCS-2026`).
- Validation formelle des 3 clauses des Règles d'Engagement (détention du mandat, respect des plages horaires, classification TLP:AMBER).
- Signature numérique de l'officier responsable avant l'activation du bouton « Valider & Autoriser l'audit ».

### 5.2 Suivi Graphique en Temps Réel du Pipeline
Pendant les ~35 secondes du scan, l'interface affiche le composant interactif `AgentWorkflowGraph` :
- **Indicateur de progression chiffré** (0 % à 100 %).
- **Bandes d'avancement par agent** : Activation visuelle progressive de l'Agent 1 (Cyan), de l'Agent 2 (Violet), de l'Agent 3 (Orange) et de l'Agent 4 (Vert).
- **Console de télémétrie intégrée** : Affichage en direct des logs techniques (résolution DNS, ports scannés, temps de réponse).

### 5.3 Restitution d'Audit & Portail de Vérification Publique
À la fin de l'opération, la page de résultats expose :
- Le badge de certification ANCS et la note globale sur 100.
- La roadmap de remédiation technique avec commandes de correction prêtes à copier.
- L'empreinte SHA-256 du rapport.

Un portail public (`cyberscore.tn/verify`) permet à toute autorité de téléverser un rapport ou de scanner son QR Code afin de vérifier son authenticité en comparant son empreinte avec la signature d'origine.

---

## Chapitre 6 : Tests, Résultats & Validation Expérimentale

### 6.1 Environnement et Protocole d'Essai
Pour valider l'efficacité du moteur sans risque pour des infrastructures de production sensibles, les tests ont été conduits sur :
- Des environnements de laboratoire virtualisés (serveurs Linux intentionnellement vulnérables avec services SSH obsolètes et ports exposés).
- Le domaine de test académique `tek-up.de`.

### 6.2 Analyse des Performances et Précision
Les résultats observés confirment la viabilité de l'approche :

| Indicateur mesuré | Valeur observée | Objectif fixé | Statut |
| :--- | :--- | :--- | :--- |
| **Temps d'exécution global** | 32 à 37 secondes | < 45 secondes | Validé |
| **Consommation mémoire sonde** | ~180 Mo RAM | < 512 Mo RAM | Validé |
| **Latence d'inférence LLM local** | 3.2 secondes | < 5 secondes | Validé |
| **Taux de faux positifs certifiés** | **0 %** | 0 % | **Objectif atteint** |
| **Taux de perturbation de service** | 0 incident / 0 downtime | 0 | Validé |

### 6.3 Comparaison avec les Scanners Traditionnels

```
Scanners Traditionnels (Nessus / OpenVAS) :
  ├── Analyse de bannière seule
  ├── 35 vulnérabilités signalées
  └── Résultat : 28 faux positifs (80% d'alertes inutiles)

CyberScore TN — Probe Agent :
  ├── Analyse de bannière + Inférence IA locale
  ├── Filtrage actif par PoC bénin (Agent 3)
  └── Résultat : 7 vulnérabilités confirmées réelles, 0 faux positif
```

---

## Chapitre 7 : Conclusion Générale & Perspectives

### 7.1 Bilan des Réalisations
Ce projet de fin d'année a permis de concevoir, développer et déployer un moteur de scan actif autonome qui répond concrètement aux exigences de la cybersécurité moderne :
- **Respect du cadre légal** : Intégration native des exigences du Décret ANCS 2023-17 et des règles d'engagement RoE.
- **Fiabilité technique** : Éradication des faux positifs grâce à l'orchestration séquentielle de 4 agents logiciels et la validation par PoC safe.
- **Souveraineté des données** : Inférence par modèle de langage local 7B sans aucune fuite vers l'extérieur.
- **Architecture industrielle robuste** : Déploiement en cluster Tri-VM cloisonné avec reverse proxy Nginx et terminaison TLS.

### 7.2 Perspectives d'Évolution
Dans le cadre de travaux futurs, plusieurs extensions sont envisageables :
- **Intégration de tests d'API REST** : Détection automatique des failles OWASP API Security Top 10 (tokens JWT faibles, IDOR).
- **Extension multi-nœuds distribuée** : Déploiement de sondes actives réparties sur plusieurs réseaux régionaux tunisiens.
- **Intégration continue DevSecOps** : Fourniture d'un connecteur CI/CD permettant aux ministères de déclencher un audit automatique avant chaque mise en production de portail public.

---

### Références & Bibliographie
1. **République Tunisienne**, *Décret-loi n° 2023-17 du 11 mars 2023 relatif à la cybersécurité*, Journal Officiel de la République Tunisienne (JORT), 2023.
2. **Agence Nationale de la Cybersécurité (ANCS)**, *Guide méthodologique des audits de sécurité des systèmes d'information*, Tunis, 2024.
3. **OWASP Foundation**, *OWASP Top 10 Web Application Security Risks*, Référentiel technique mondial, 2021.
4. **NIST**, *Cybersecurity Framework (CSF) Version 2.0*, National Institute of Standards and Technology, 2024.
5. **Ollama Project**, *Local LLM Runtime Architecture & Quantization*, Documentation technique open-source, 2025.
