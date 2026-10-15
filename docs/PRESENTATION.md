# CyberScore TN — Présentation Complète & Détaillée de Soutenance
## عرض مشروع تخرج نهاية الدراسات الهندسية — الدليل الشامل والمفصل

---

> **Durée flexible** : 25 à 35 minutes (+ session complète de Questions/Réponses)
> **Objectif** : Clarté absolue, rigueur scientifique, démonstration technique approfondie
> **Cible** : Jury d'ingénieurs, experts en cybersécurité et décideurs de l'ANCS
> **Dernière mise à jour** : 27 Septembre 2026

---

## Slide 1: Page de Titre & Contexte Institutionnel
### الصفحة الرئيسية — الإطار المؤسساتي والسيادي

# CyberScore TN
## منصة تقييم ومراقبة الأمن السيبراني للمواقع الحكومية والسيادية التونسية
### Plateforme Souveraine d'Évaluation, de Télémétrie et de Remédiation Continue de la Posture Cyber des Domaines Étatiques Tunisiens (.gov.tn, .tn souverains & .com.tn)

- **Candidat** : Hamdouni Yosri
- **Filière** : Ingénierie des Systèmes Informatiques & Cybersécurité
- **Type de Projet** : Projet de Fin d'Année (PFA) d'Ingénieur
- **Organisme Partenaire & Référentiel** : Agence Nationale de la Cybersécurité (ANCS)
- **Année Universitaire** : 2025 / 2026

[VISUEL : Logo officiel CyberScore TN en haute résolution + Capture panoramique du Command Center Widescreen avec carte de Tunisie]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 1 (Durée : ~1 min 30 s) :
« Monsieur le Président du jury, Madame, Monsieur les membres du jury, chers enseignants,

J'ai l'honneur de vous présenter aujourd'hui mon projet de fin d'études d'ingénieur, intitulé **CyberScore TN**. 

Ce projet répond à un impératif d'ingénierie : donner à l'ANCS et aux 120+ institutions étatiques la capacité d'évaluer et de corriger leur posture web en continu, sans dépendre de solutions étrangères ni exposer leurs vulnérabilités sur des serveurs externes.

Face à la multiplication des cyberattaques ciblant les infrastructures publiques, l'évaluation de la sécurité doit être **systématique, continue, automatisée et 100% souveraine**. 

C'est précisément l'objectif de **CyberScore TN** : doter l'ANCS et l'ensemble des institutions tunisiennes d'une plateforme d'État capable d'auditer en temps réel le patrimoine web national sous ses extensions souveraines (`.gov.tn`, les ministères régaliens en `.tn` direct comme la Défense Nationale, et les entreprises publiques stratégiques en `.com.tn`), de quantifier leur niveau de risque selon les standards internationaux (OWASP, NIST, ISO 27001) et d'apporter, grâce à une Intelligence Artificielle locale, des solutions de remédiation directes et concrètes. »

---

## Slide 2: Plan Structuré de la Soutenance
### خطة العرض التفصيلية

1. **Contexte Stratégique & Problématique Nationale** (Les défis du patrimoine web étatique tunisien)
2. **État de l'Art & Benchmark des Plateformes Internationales** (Étude critique de SecurityScorecard, BitSight, CISA CDM et China CCL)
3. **Architecture Système & Choix Technologiques** (Microservices asynchrones, Next.js 16, FastAPI, PostgreSQL 16, Docker)
4. **Moteur d'Audit Passif & Décomposition des 16 Piliers** (Explication technique des vecteurs TLS, DNSSEC, CSP, Cookies, Ports, etc.)
5. **Algorithme de Scoring Dual & Mapping Réglementaire** (Modélisation mathématique sur 100, lettres A-F, étoiles et corrélation ISO/NIST/OWASP)
6. **Command Center National & Ergonomie SOC** (Télémétrie Live Sync, cartographie vectorielle des 24 gouvernorats, gestion sectorielle)
7. **Intelligence Artificielle Souveraine On-Premise** (Analyste IA Amina 3D WebGL, LLM Qwen2.5-Coder:7b 100% local, flux SSE)
8. **Moteur Prédictif & Projection Sécuritaire à +30 Jours** (Séries temporelles SVG, radar hexagonal multidimensionnel)
9. **Centre de Rapports & Livrable Officiel « Chancellerie »** (Génération PDF A4 vectorielle 7 pages, empreinte SHA-256, QR Code)
10. **Sceau Public de Confiance & Gamification Professionnelle** (XP, 12 badges SOC, widget d'intégration vectoriel)
11. **Portail Souverain de Vérification Citoyenne & Hygiène Numérique** (Route /verify/[domain], interface trilingue AR/FR/EN, slider interactif citoyen)
12. **Modélisation des Menaces & Résilience du QR Code Anti-Fraude** (Threat modeling, piège du Domain Mismatch, 3 lignes de défense anti-phishing)
13. **Gouvernance, Sécurité des Accès & Cloisonnement RBAC** (Supervision ANCS, profilage RSSI ministériel, écran d'interdiction HTTP 403)
14. **Démonstration Opérationnelle en Direct** (Scénario complet multi-rôles, audit live ~8s, assistance IA, export certifié)
15. **Bilan Métrique, Difficultés Techniques & Perspectives d'Homologation** (120 domaines modélisés, 44 pages Next.js 16 validées)

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 2 (Durée : ~1 min) :
« Pour vous exposer l'ensemble de ce travail de manière rigoureuse, j'ai articulé cette soutenance autour de douze axes. 

Nous commencerons par poser la problématique et comparer notre démarche aux plateformes existantes dans le monde. Nous examinerons ensuite l'architecture technique : les 16 modules du moteur d'audit passif, le modèle mathématique de scoring et notre pipeline d'Intelligence Artificielle locale. 

Nous consacrerons ensuite une part majeure de notre temps à une démonstration opérationnelle en conditions réelles, avant de clore sur les résultats métriques obtenus sur les 120 institutions du pays et les perspectives de raccordement au SOC national de l'ANCS. »

---

## Slide 3: Contexte Stratégique & Cadre Réglementaire Tunisien
### السياق الوطني العام والإطار التشريعي للسلامة السيبرانية

- **Un Patrimoine Web Stratégique et Hétérogène** :
  - Plus de **120 domaines publics officiels** recensés sous le ccTLD national `.tn` :
    * **Les Ministères Centraux sous `.gov.tn`** : `finances.gov.tn`, `sante.gov.tn`, `interieur.gov.tn`, `justice.gov.tn`, etc.
    * **Les Ministères & Institutions Régaliennes sous `.tn` direct** : **`defense.tn`** (Ministère de la Défense Nationale), **`mes.tn`** (Enseignement Supérieur), **`ancs.tn`** (ANCS), **`cni.tn`**, **`ati.tn`**, **`poste.tn`**.
    * **Les Entreprises Publiques Stratégiques sous `.com.tn`** : **`steg.com.tn`** (Électricité/Gaz), **`sonede.com.tn`** (Eau), **`tunisietelecom.tn`**.
    * **Les Réseaux Sectoriels d'État** : `.nat.tn` (Santé RNS, Registre), `.edunet.tn` (Éducation nationale), `.agrinet.tn` (Recherche agricole).
  - Des portails manipulant quotidiennement les téléservices vitaux des citoyens : impôts, douanes, inscription scolaire, marchés publics, santé.
- **Une Menace Cybernétique en Forte Croissance** :
  - Augmentation des attaques par défiguration (*deface*), attaques DDoS, vol d'identifiants et usurpation de nom de domaine étatique.
  - Exploitation fréquente de faiblesses d'hygiène numérique basiques : certificats expirés, absence de politique CSP, failles de cookies.
- **Le Cadre Légal : Décret-loi n° 2023-17** :
  - Texte fondateur promulgué le 11 mars 2023 relatif à la cybersécurité en Tunisie.
  - Transformation de l'ancienne ANSI en **ANCS** (Agence Nationale de la Cybersécurité) avec des prérogatives étendues d'audit, de contrôle et d'homologation obligatoire des systèmes informatiques publics.
- **La Lacune Opérationnelle Constatée** :
  - Les audits traditionnels de l'État sont périodiques (souvent annuels ou bien n'ont lieu qu'après un incident avéré).
  - Absence d'un tableau de bord public et centralisé permettant de mesurer au jour le jour l'évolution de la posture de chaque ministère.

[DIAGRAMME : Organigramme institutionnel reliant la Présidence du Gouvernement, l'ANCS, le CERT-TN et les RSSIs des 24 ministères]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 3 (Durée : ~2 min) :
« Pour bien comprendre la genèse de ce projet, il faut observer l'état actuel de notre cyberespace national. La Tunisie compte plus de 120 portails étatiques majeurs. Ces sites ne sont pas de simples vitrines passives : ils hébergent les formulaires fiscaux du Ministère des Finances, les systèmes d'orientation du Ministère de l'Enseignement Supérieur, ou encore les téléprocédures du Ministère de l'Intérieur.

*Précision stratégique pour le jury* : Ce patrimoine public ne se limite pas à l'extension `.gov.tn`. Si `.gov.tn` est la nomenclature de référence pour les ministères centraux, des institutions souveraines de premier rang opèrent directement sous le domaine national `.tn`, à l'instar du **Ministère de la Défense Nationale (`defense.tn`)**, du **Ministère de l'Enseignement Supérieur (`mes.tn`)**, ou de l'**ANCS elle-même (`ancs.tn`)**. De plus, les entreprises publiques stratégiques comme la **STEG (`steg.com.tn`)** et la **SONEDE (`sonede.com.tn`)** sont au cœur de notre sécurité d'infrastructure. Notre plateforme CyberScore TN intègre et audite avec la même rigueur l'ensemble de cet écosystème républicain.

Sur le plan réglementaire, le pays a franchi une étape décisive avec le Décret-loi n° 2023-17 du 11 mars 2023, qui a créé l'Agence Nationale de la Cybersécurité (ANCS) avec pour mission d'imposer des audits rigoureux et continus.

Pourtant, sur le terrain, une faille majeure subsistait : l'audit conventionnel se fait par des experts humains une fois tous les 1 ou 2 ans. Entre deux audits, un site peut voir son certificat SSL expirer, un sous-domaine orphelin être piraté, ou un serveur de pré-production être oublié en ligne avec des ports d'administration ouverts. 

Il manquait à l'État tunisien un outil de **supervision continue automatisée**, capable de détecter ces dérives en quelques secondes sans attendre l'incident. C'est le vide stratégique que comble CyberScore TN. »

---

## Slide 4: Problématique & Verrous Technologiques
### الإشكالية الهندسية والتحديات التقنية

### Comment concevoir une plateforme souveraine capable d'évaluer, de quantifier et d'orienter la remédiation cyber de l'ensemble des portails gouvernementaux tunisiens sans intrusion, sans dépendance étrangère et avec une rigueur mathématique incontestable ?

**Les 5 Grands Défis Techniques Résolus** :
1. **Le Défi de la Légalité & de la Non-Intrusion** : Comment auditer en profondeur sans jamais être assimilé à une attaque informatique (zéro déni de service, respect strict du passif) ?
2. **Le Défi de la Normalisation Mathématique** : Comment agréger 16 facteurs techniques hétérogènes (des versions de TLS, des codes HTTP, des scores CVSS, des enregistrements DNS) en une note unique et cohérente sur 100 ?
3. **Le Défi de la Souveraineté de l'IA** : Comment fournir des explications et des scripts de remédiation intelligents sans envoyer la moindre ligne de code ou adresse IP sur les serveurs de géants étrangers comme OpenAI ou Google ?
4. **Le Défi de la Temporalité** : Comment passer d'un temps de scan classique de 15 minutes par site à un diagnostic exhaustif en **moins de 8 secondes** ?
5. **Le Défi de l'Adoption Institutionnelle** : Comment concilier une interface en langue arabe native pour les décideurs avec les exigences techniques anglophones des ingénieurs SOC ?

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 4 (Durée : ~2 min) :
« En tant qu'ingénieurs, nous avons dû résoudre une équation complexe à cinq inconnues :

Premier verrou : la **légalité de l'audit**. Nous devions impérativement développer un moteur d'audit passif qui inspecte les configurations publiques sans jamais injecter de payload malveillant ni risquer de saturer la bande passante des serveurs de l'État.

Deuxième verrou : la **pondération algorithmique**. Comment comparer l'absence d'une directive HSTS avec un port SSH ouvert ou un cookie sans flag HttpOnly ? Il nous a fallu modéliser une fonction de scoring scientifique basée sur l'OWASP Top 10 et les métriques de criticité CVSS v3.1.

Troisième verrou, et c'est l'une de nos plus grandes fiertés : la **souveraineté absolue de l'Intelligence Artificielle**. Nous refusions catégoriquement d'utiliser l'API d'OpenAI pour analyser les vulnérabilités de nos ministères, car cela aurait constitué une fuite de métadonnées d'État vers des serveurs étrangers. Nous avons donc intégré notre propre modèle de langage de 7 milliards de paramètres, exécuté 100% en local sur notre infrastructure.

Enfin, nous devions offrir une vitesse d'exécution fulgurante : passer de 15 minutes à moins de 8 secondes grâce à l'asynchronisme de Python FastAPI. »

---

## Slide 5: État de l'Art Mondial & Benchmark des Plateformes
### الإطار النظري — مقارنة متعمقة بالمنصات العالمية

| Critères d'Évaluation | SecurityScorecard (USA) | BitSight Technologies (USA) | CISA CDM (USA Federal) | China CCL (Chine) | **CyberScore TN (Tunisie)** |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Échelle de Notation** | Lettres A à F (0-100) | Score financier 250 à 900 | Indicateurs bruts NIST | Étoiles de conformité (1 à 3) | **Double : A-F + Étoiles (1 à 3)** |
| **Moteur d'IA Intégré** | TITAN AI (Cloud US) | Modèles propriétaires fermés | Aucun (Tableaux statiques) | Aucun | **Ollama Local (Qwen2.5-Coder:7b)** |
| **Périmètre Cible** | Multinationales privées | Grandes banques & Assurances | Agences fédérales américaines | Produits certifiés nationaux | **120 Domaines Étatiques .gov.tn** |
| **Souveraineté des Données** | Cloud commercial US | Cloud commercial US | Réseau gouvernemental US | Réseau souverain chinois | **100% On-Premise (Territoire Tunisien)** |
| **Génération de Livrables** | Rapports PDF génériques | Fiches de risque financières | Tableaux Excel de conformité | Certificats papier | **Attestations d'État 7 Pages (Chancellerie)** |
| **Prise en charge Trilingue** | Anglais (partiel FR) | Anglais uniquement | Anglais uniquement | Chinois uniquement | **Arabe RTL natif, Français, Anglais** |
| **Coût pour l'État** | Licence annuelle très onéreuse | Licence annuelle très onéreuse | Réservé aux USA | Inaccessible | **100% Libre & Gratuit (Open-Source)** |

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 5 (Durée : ~2 min) :
« Avant d'écrire la moindre ligne de code, j'ai conduit une étude approfondie de l'état de l'art mondial. 

Aux États-Unis, deux géants dominent : **SecurityScorecard** et **BitSight**. SecurityScorecard a popularisé la notation A-F, extrêmement claire pour un conseil d'administration. BitSight utilise un système de score calqué sur les cotes de crédit bancaires. Mais ces deux solutions posent trois problèmes rédhibitoires pour la Tunisie : premièrement, le coût exorbitant des licences annuelles pour 120 sites ; deuxièmement, le transfert de nos métadonnées de failles sur des clouds américains ; et troisièmement, l'absence totale de prise en compte des décrets tunisiens et de la langue arabe.

En Chine, le système **CCL** utilise une notation en étoiles très valorisante pour la confiance citoyenne. 

Avec CyberScore TN, nous avons fusionné le meilleur de ces mondes : nous avons repris la clarté technique de la note A-F de SecurityScorecard, l'impact visuel des 3 étoiles du système chinois, tout en développant une solution **100% souveraine, trilingue avec support RTL arabe parfait, enrichie d'une IA locale et adaptée aux normes de l'ANCS**. »

---

## Slide 6: Facteurs Distinctifs & Ruptures Technologiques
### العوامل الفارقة والقفزات التكنولوجية لمنظومة CyberScore TN

- **Rupture 1 : Audit 100% Passif & Non-Intrusif** :
  - Zéro injection de code malveillant, zéro risque de déni de service pour les serveurs ministériels.
  - Conformité totale avec le cadre légal tunisien et les décrets de l'ANCS.
- **Rupture 2 : IA Locale Souveraine vs Dépendance aux API Cloud** :
  - Modèle Qwen2.5-Coder:7b hébergé sur site via Ollama (port 25000), sans aucune fuite de données vers des serveurs étrangers.
- **Rupture 3 : Modèle Dual de Notation & Sceau de Confiance Vérifiable** :
  - Score quantitatif (0-100), notation de lettre (A+ à F) et classification qualitative par étoiles ANCS (★☆☆ à ★★★).
  - QR Code vectoriel dynamique lié au domaine légitime avec piège anti-phishing (*Domain Mismatch Trap*).
- **Rupture 4 : Ancrage Souverain & Référentiel Décret 2023-17** :
  - Conçu spécifiquement pour le périmètre gouvernemental tunisien (`.gov.tn`), trilingue natif (Arabe RTL, Français, Anglais).

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 6 (Durée : ~1 min 30 s) :
« Face aux solutions existantes, notre plateforme opère quatre ruptures majeures :
Premièrement, la sécurité juridique : un audit 100% passif qui ne perturbe jamais les téléservices publics.
Deuxièmement, la souveraineté technologique : notre IA de remédiation fonctionne sur nos propres serveurs en Tunisie, protégeant le secret d'État.
Troisièmement, le modèle dual : nous traduisons la complexité technique en un score limpide pour le citoyen et le décideur.
Enfin, notre ancrage républicain : CyberScore TN a été bâti sur mesure pour faire respecter le décret-loi 2023-17 de l'ANCS. »

---

## Slide 7: Architecture Système & Modèle 4 Couches
### Une architecture scalable, sécurisée et orientée IA
### الهيكلة العامة للنظام وتوزيع الوحدات البرمجية

```
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│        1. FRONTEND        │  ➔   │      2. BACKEND / API     │  ➔   │    3. INTELLIGENCE IA     │  ↔   │  4. PERSISTANCE & CACHE   │
│  Next.js 16 · React 19    │      │  FastAPI (Python 3.11)    │      │  Ollama (Port 25000)      │      │  PostgreSQL 16 (19 tables)│
│  Three.js · Tailwind CSS  │      │  AsyncIO & SSE Streaming  │      │  Qwen2.5-Coder-7B         │      │  JSONB pour télémétrie    │
│  i18n (Arabe RTL, FR, EN) │      │  REST API (JSON)          │      │  Inférence locale souveraine│   │  Redis 7 (Cache/Sessions) │
│  Rendu Hybride SSR/SSG    │      │  JWT + RBAC · Bcrypt      │      │  Indexation RAG contextuel│      │  Migrations & Sauvegardes │
│  Web · Desktop · Mobile   │      │  Générateur PDF Vectoriel │      │  Fallback Déterministe    │      │  Fiable · Rapide · Dispo  │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

**Bandeau Central — 16 Modules Spécialisés** :
`Audit & Logs` • `Corrélation` • `Sessions` • `Menaces` • `Rapports` • `Réponse` • `& plus encore...`

**Bandeau de Synthèse Normative & Métadonnées** :
- **Conformité & Normes** : ANCS • OWASP Top 10 • NIST CSF • ISO 27001
- **Sécurité & Auth** : RBAC • JWT • Bcrypt • Contrôle d'accès granulaire
- **Performance & Résilience** : Cache Redis • SSE • AsyncIO • Fallback Offline
- **Observabilité & Audit** : Logs centralisés • Traçabilité • Télémétrie • PDF

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 7 (Durée : ~2 min 30 s) :
« Mesdames et messieurs les membres du jury, cette diapositive présente notre architecture logicielle modulaire, conçue pour concilier performance temps réel, souveraineté des données et extensibilité. Elle s'articule autour de 4 couches claires :

1. **La Couche Frontend (Next.js 16 & React 19)** : Propulsée par le compilateur Turbopack. Elle assure un rendu hybride SSR/SSG pour une rapidité d'affichage optimale, intègre un avatar 3D WebGL à 60 FPS avec Three.js, et gère nativement le bilinguisme arabe RTL grâce aux CSS Logical Properties.
2. **La Couche Backend & API (FastAPI & Python 3.11 asynchrone)** : Elle orchestre nos 16 modules d'audit en parallèle via `asyncio.gather` pour délivrer des scans en moins de 8 secondes, tout en assurant l'authentification sécurisée JWT Bcrypt et la génération de nos rapports vectoriels.
3. **La Couche Intelligence IA (Ollama & Qwen2.5-Coder:7b)** : Un modèle de 7 milliards de paramètres spécialisé dans le code et la sécurité, exécuté 100% en local on-premise sans aucune fuite de données vers des clouds étrangers, avec flux de streaming direct SSE mot-par-mot.
4. **La Couche Persistance & Cache (PostgreSQL 16 & Redis 7)** : Une base relationnelle solide de 19 tables avec indexation JSONB pour stocker la télémétrie des 120 ministères, adossée à un cache Redis 7 haute disponibilité.

L'ensemble alimente nos **16 modules d'audit spécialisés** et garantit une stricte conformité aux décrets de l'ANCS, à l'OWASP Top 10, au NIST CSF et à la norme ISO 27001. »

---

## Slide 8: Stack Technique & Justifications d'Ingénierie
### المنظومة التكنولوجية المعتمدة ومبررات الاختيار

| Couche Système | Technologie Retenue | Bénéfices Techniques & Rôle Opérationnel |
| :--- | :--- | :--- |
| **Frontend Web** | **Next.js 16 (Turbopack), React 19** | Rendu SSR/SSG hybride, compilation instantanée, App Router sécurisé. |
| **Rendu 3D** | **Three.js, React Three Fiber** | Modélisation WebGL fluide à 60 FPS pour l'avatar conversationnel Amina. |
| **Internationalisation** | **next-intl (CSS Logical Props)** | Inversion dynamique LTR ⇄ RTL pour l'arabe officiel sans recalcul de layout. |
| **Backend API** | **Python 3.11, FastAPI, AsyncIO** | Exécution asynchrone non-bloquante des 16 scanners (gain de vitesse x15). |
| **Persistance** | **PostgreSQL 16, SQLAlchemy Async** | Intégrité relationnelle stricte (19 tables) et indexation JSONB de la télémétrie. |
| **Intelligence Artificielle** | **Ollama, Qwen2.5-Coder:7b** | Modèle open-source de pointe (88.4% HumanEval), 100% hors-ligne. |

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 8 (Durée : ~1 min 30 s) :
« Pour concrétiser cette architecture, chaque brique technologique a été sélectionnée pour des critères d'ingénierie stricts :
Next.js 16 avec Turbopack nous confère un affichage quasi-instantané et une compatibilité bilingue RTL sans latence.
Python FastAPI avec AsyncIO permet de lancer 10 audits simultanément et de descendre le temps de diagnostic de 15 minutes à 7.4 secondes.
Et PostgreSQL 16 garantit l'intégrité absolue de notre historique d'audit sur l'ensemble des 120 institutions de l'État. »

---

## Slide 9: Le Moteur d'Audit Passif — Analyse des 16 Vecteurs de Sécurité
### محرك الفحص التقني غير الاقتحامي — تفصيل الـ 16 مؤشراً

| # | Vecteur de Sécurité | Poids | Objectif de Contrôle & Mécanisme d'Inspection Technique | Vulnérabilité / Risque Prévenu |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Chiffrement SSL / TLS** | **12%** | Négociation TLS 1.2 / TLS 1.3, suites cryptographiques robustes (ECDHE), validité de la chaîne X.509 TunTrust. | Attaques Man-in-the-Middle (MitM), déchiffrement passif, POODLE, Heartbleed. |
| **2** | **En-têtes HTTP (HSTS, etc.)** | **10%** | Contrôle strict de \`Strict-Transport-Security\` (min 6 mois), \`X-Frame-Options\`, \`X-Content-Type-Options\`. | Déclassement HTTP (SSL Strip), Clickjacking, reniflage de type MIME. |
| **3** | **Politique CSP** | **8%** | Analyse des directives \`Content-Security-Policy\`, vérification de l'absence de \`'unsafe-inline'\` et \`'unsafe-eval'\`. | Injections de scripts malveillants XSS (*Cross-Site Scripting*), vol de sessions. |
| **4** | **Attributs des Cookies** | **7%** | Vérification systématique des drapeaux \`HttpOnly\`, \`Secure\`, et de la politique \`SameSite=Lax/Strict\`. | Vol de jetons de session par JavaScript, attaques CSRF (*Cross-Site Request Forgery*). |
| **5** | **Hygiène & Santé DNS** | **6%** | Vérification de la signature DNSSEC, redondance des serveurs NS faisant autorité, refus de transfert de zone (AXFR). | Empoisonnement de cache DNS (*DNS Spoofing*), détournement de trafic étatique. |
| **6** | **Sécurité Messagerie (Mail)** | **6%** | Présence et conformité syntaxique des enregistrements TXT DNS : SPF (\`v=spf1\`), DKIM et politique DMARC (\`p=reject\`). | Usurpation d'identité d'un ministère par e-mail (*Phishing*, *CEO Fraud*). |
| **7** | **Surface Réseau & Ports** | **8%** | Détection passive des services sensibles ouverts sur l'IP hôte (SSH:22, RDP:3389, Telnet:23, MySQL:3306). | Prise de contrôle à distance du serveur, attaques par force brute sur interfaces de gestion. |
| **8** | **Divulgation d'Infos (Info Leak)** | **5%** | Détection de la divulgation des versions de serveurs dans les bannières \`Server\`, \`X-Powered-By\`, fichiers \`.git\`. | Reconnaissance facilitée pour les pirates cherchant des exploits spécifiques à une version. |
| **9-16** | **Piliers Avancés & CTI** | **38%** | Cartographie de sous-domaines, réputation IP (AbuseIPDB), vérification de la supply-chain JS, historique d'incidents. | Compromission de dépendances externes, détournement de sous-domaines orphelins. |

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 9 (Durée : ~3 min) :
« Mesdames et messieurs les membres du jury, attardons-nous sur le cœur technique de notre plateforme : **le moteur d'audit passif et ses 16 piliers de sécurité**.

Pourquoi avoir choisi 16 piliers et comment sont-ils calculés ?
Nous avons calibré notre moteur pour couvrir à la fois la couche réseau, la couche transport, la couche applicative et la réputation externe :

- **Le pilier SSL/TLS (12%)** : Nous établissons un handshake SSL complet avec le serveur cible. Nous inspectons la version du protocole (nous pénalisons sévèrement TLS 1.0 et 1.1 qui sont obsolètes et vulnérables), nous contrôlons la solidité de l'échange de clés (présence de cryptographie à courbes elliptiques avec secret parfait - *Forward Secrecy*), et nous validons la chaîne d'autorité de certification, en accordant un bonus de confiance aux certificats délivrés par **TunTrust**, l'Agence Nationale de Certification Électronique.

- **Le pilier En-têtes HTTP (10%)** : Nous inspectons les en-têtes de réponse. L'absence de la directive HSTS (*HTTP Strict Transport Security*) est l'une des failles les plus courantes sur le web étatique : elle permet à un attaquant sur un réseau public de rétrograder la connexion en HTTP clair via une attaque *SSL Strip*. Nous vérifions également la protection contre le *Clickjacking* via \`X-Frame-Options: DENY\`.

- **Le pilier CSP (8%)** : La *Content Security Policy* est le rempart le plus efficace contre les attaques XSS. Notre moteur parse la politique et pénalise lourdement l'usage de \`'unsafe-inline'\`, qui autorise l'exécution de scripts injectés directement dans le DOM.

- **La sécurité de la messagerie (6%)** : Nous interrogeons les serveurs DNS du ministère pour vérifier les enregistrements SPF, DKIM et DMARC. Si un ministère n'a pas de politique DMARC avec rejet (\`p=reject\`), n'importe quel cybercriminel sur Terre peut envoyer un faux e-mail au nom du ministre des Finances à un citoyen tunisien sans qu'aucun serveur de messagerie ne le bloque !

Chacun de ces 16 vecteurs fait l'objet d'un calcul normalisé entre 0 et 100, avant d'être injecté dans notre fonction de pondération globale. »

---

## Slide 10: Niveaux de Scan (Quick, Standard, Deep) & Moteur Scanner
### مستويات التدقيق الثلاثة ومحرك الفحص الفوري

- **Quick Scan (~2.8 secondes)** :
  - Vérification superficielle de connectivité, certificat TLS/SSL et redirection HTTPS forcée.
- **Standard Scan (~7.4 secondes)** :
  - Analyse complète des 10 piliers passifs fondamentaux (HSTS, CSP, Cookies, Ports ouverts, Détection de CMS, DNSSEC).
- **Deep Scan (~18 secondes)** :
  - Télémétrie CTI approfondie, cartographie des sous-domaines orphelins et audit de réputation IP.

[VISUEL : Interface du Scanner passif et restitution de la fiche technique (assets/scanner.png)]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 10 (Durée : ~1 min 30 s) :
« Pour adapter le diagnostic aux besoins opérationnels de l'ANCS, nous avons implémenté trois profondeurs de scan :
Le Quick Scan permet une vérification rapide en 2 secondes lors des rondes de sécurité.
Le Standard Scan est le mode de référence : en 7.4 secondes, il exécute les 10 modules passifs et produit le score officiel.
Le Deep Scan pousse l'investigation jusqu'à l'interrogation des bases de réputation CTI mondiales pour débusquer les sous-domaines dormants. »

---

## Slide 10B: Moteur d'Audit Autonome & Architecture Tri-VM en Défense en Profondeur
### محرك التدقيق الذاتي متعدد الوكلاء وبنية الـ 3 أجهزة افتراضية (Tri-VM)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               ARCHITECTURE DISTRIBUÉE SOUVERAINE TRI-VM (VMware Workstation)          │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│  VM 1 : FRONT-END DMZ      │  VM 2 : BACK-END CORE       │  VM 3 : BASTION D'AUDIT     │
│  (CyberScore-DMZ-Front)    │  (CyberScore-Core-Back)     │  (CyberScore-Agent-Probe)   │
│  • RHEL 10.1 Minimal (CLI) │  • RHEL 10.1 Minimal (CLI)  │  • RHEL 9.5 Minimal (CLI)   │
│  • Next.js 16 + React 19   │  • FastAPI REST (Port 8000) │  • 4 Agents IA Autonomes    │
│  • Nginx 1.26 (Port 80)    │  • PostgreSQL 16 (Seedée)   │  • Nmap & Sockets TCP       │
│  • Systemd Démon Supervisé │  • Valkey 7 & Celery Worker │  • SELinux Enforcing        │
│  • SELinux Enforcing       │  • SELinux Enforcing        │  • Firewalld DROP Policy    │
│  • IP : 192.168.98.150     │  • IP : 192.168.98.149      │  • IP : 192.168.98.148      │
├────────────────────────────┴─────────────────────────────┴─────────────────────────────┤
│  HÔTE WINDOWS (GPU NVIDIA) : Ollama Qwen 2.5 Coder 7B (Port 25000 — 192.168.98.1)      │
│  Réseau Virtuel Dédié : VMware NAT VMnet8 (192.168.98.0/24) — Confinement Étanche       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Le Pipeline des 4 Agents Autonomes Spécialisés (VM 3 Durcie — 192.168.98.148)** :
  1. 🔍 **Agent 1 : Reconnaissance Réseau (`recon_agent.py`)** — Scan de ports asynchrone non intrusif par sockets TCP, capture des bannières réelles (`OpenSSH`, `Apache`) et inspection HTTP/TLS.
  2. 🧠 **Agent 2 : Corrélation CVE Contextuelle (`cve_agent.py`)** — Analyse de l'empreinte technologique par le LLM souverain local contraint en JSON Schema (avec fallback heuristique en cas de coupure).
  3. 🎯 **Agent 3 : Validation Dynamique PoC (`poc_agent.py`)** — Vérification non destructive de l'exploitabilité avec **règle stricte Zéro Faux Positif** (éradication des fausses alertes SQLi ou XSS non prouvées).
  4. 🛡️ **Agent 4 : Remédiation & Scellement Cryptographique (`remediation_agent.py`)** — Notation catégorisée, feuille de route priorisée avec commandes copier-coller et **sceau d'intégrité SHA-256**.

- **Les 4 Piliers de Sécurité Validés pour le Jury** :
  - **Défense en Profondeur (Defense in Depth)** : Compromission du Web (VM 1 `.150`) $\rightarrow$ la base de données PostgreSQL (VM 2 `.149`) reste inaccessible.
  - **Confinement d'Audit (Bastion Jetable)** : Riposte ou contre-scan d'une cible $\rightarrow$ seule l'appliance isolée (VM 3 `.148`) est exposée.
  - **Architecture 100% Headless** : 3 VMs sous RHEL Minimal sans interface graphique, éliminant les vulnérabilités de serveurs d'affichage et consommant < 3.5 Go de RAM cumulée.
  - **Découplage IA (AIaaS)** : La sonde dans la VM 3 consomme < 50 Mo de RAM et interroge l'IA locale sur l'hôte Windows (`192.168.98.1:25000`) en réseau privé.

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 10B (Durée : ~2 min 15 s) :
« Monsieur le Président, honorables membres du jury, cette diapositive matérialise l'une des contributions majeures de notre travail d'ingénieur : **le déploiement et la validation en conditions réelles d'une architecture distribuée à 3 Machines Virtuelles cloisonnées (Architecture Tri-VM sous VMware Workstation)**.

Pourquoi avons-nous refusé de déployer notre plateforme sur un serveur monolithique ?
En tant que futurs ingénieurs en cybersécurité, nous avons appliqué les directives de l'ANCS et de la norme ISO 27001 :
1. **Dans la VM 1 (`CyberScore-DMZ-Front`, IP 192.168.98.150)** : Nous isolons l'interface Next.js 16 et le reverse proxy Nginx 1.26 sous RHEL 10.1 Minimal.
2. **Dans la VM 2 (`CyberScore-Core-Back`, IP 192.168.98.149)** : Nous sanctuarisons notre API FastAPI, notre base PostgreSQL 16 seedée avec les ministères tunisiens, et le broker Valkey 7. Cette VM n'a aucune exposition publique directe.
3. **Dans la VM 3 (`CyberScore-Agent-Probe`, IP 192.168.98.148)** : Nous hébergeons notre moteur de 4 agents autonomes sous Red Hat Enterprise Linux 9.5 durcie, avec SELinux actif en mode Enforcing et une politique Firewalld DROP.
Cette VM 3 agit comme une *sonde d'audit jetable*. Même si un serveur étatique audité tentait une attaque en retour ou un blocage agressif, nos serveurs Web et nos bases ministérielles demeurent parfaitement isolés et intègres.

Toutes nos VMs sont 100% Headless, sans interface graphique inutile, supervisées par des services systemd. Enfin, notre modèle d'IA souverain Qwen 2.5 Coder s'exécute sur le GPU de l'hôte Windows physique (192.168.98.1) sur le port 25000. Nous allions ainsi une sonde ultra-légère de moins de 50 Mo de RAM avec la puissance d'un grand modèle de langage 100% souverain. »

---

## Slide 10C: Le Scan Actif Autonome — Détails d'Ingénierie, Mandat Légal & Zéro Faux Positif
### الفحص النشط المستقل — التفاصيل التقنية والإذن القانوني وتصفية الإنذارات الخاطئة

| Composant du Scan Actif | Mécanisme Technique Précis | Restitution & Preuve d'Audit |
| :--- | :--- | :--- |
| **Cadre Légal & Mandat** | **Décret 2023-17** : Saisie obligatoire du Code Mandat ANCS + Signature numérique de l'auditeur. | Traçabilité immuable dans l'historique et en-tête légal du rapport PDF. |
| **Reconnaissance Réseau (Agent 1)** | Balayage non destructif des 25 ports critiques + Fingerprinting OS via TTL (64/128) et bannières réelles. | Page Dédiée PDF : *Cartographie Réseau & Empreinte Système*. |
| **Dette Technique & EOL (Agent 2)** | Détection des versions en fin de vie (*End-Of-Life*, ex: PHP 7.4, Apache obsolète) qualifiées de *Permanent 0-Day*. | Page Dédiée PDF : *Obsolescence Logicielle & CVEs (Score CVSS)*. |
| **Validation PoC (Agent 3)** | Sondes applicatives neutres (réflexion XSS bénigne, anomalies SQLi, fuzzing `.git` / `.env`). | **Règle Zéro Faux Positif** : Rejet automatique des failles non prouvées. |
| **Remédiation & Sceau (Agent 4)** | Génération de directives Bash prêtes à l'emploi + Calcul de l'empreinte **SHA-256** infalsifiable. | QR Code de vérification souveraine et sceau cryptographique officiel. |

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 10C (Durée : ~2 min) :
« Mesdames et messieurs du jury, une question clé se pose souvent : **Quelle est la différence fondamentale entre nos scans passifs et notre scan actif autonome ?**

1. **La Dimension Déontologique et Légale** : Le scan passif peut tourner en continu sans mandat car il n'envoie aucune requête intrusive. En revanche, le **Scan Actif** effectue des connexions directes aux services. En stricte conformité avec le **Décret-loi n° 2023-17**, nous avons imposé un verrouillage logiciel : l'auditeur doit obligatoirement fournir son code de mandat d'accréditation et sa signature avant de pouvoir débloquer ce mode.

2. **La Détection de la Dette Technique et de l'Obsolescence (EOL)** : Dans les administrations, le risque n'est pas seulement une mauvaise configuration, c'est l'oubli de serveurs non mis à jour. L'Agent 2 identifie spécifiquement les bibliothèques et serveurs qui ne reçoivent plus de correctifs de sécurité depuis des années.

3. **Notre Règle Cardinale : Le Zéro Faux Positif** : Beaucoup de scanners commerciaux inondent les RSSI d'alertes théoriques sans valeur. Avec l'Agent 3, si une anomalie SQLi ou XSS n'est pas expérimentalement démontrée en direct par une preuve de concept inoffensive, elle est **déclassée et éliminée du rapport**.

4. **Deux Pages Dédiées dans le Rapport PDF Certifié** : Ces résultats actifs sont gravés dans deux pages exclusives de notre rapport officiel vectoriel : la cartographie réseau avec empreinte OS d'un côté, et la dette technique EOL corrélée aux CVEs de l'autre. »

---

## Slide 11: Algorithme de Notation Mathématique, Modèle Dual & Journal d'Audit
### خوارزمية التقييم الرياضي ومنظومة التصنيف المزدوج وسجل التتبع

[VISUEL : Capture d'écran du Journal d'Audit et de traçabilité /history (assets/history.png)]

### 1. Formulation Mathématique du Score Global :

$$\text{CyberScore}_{\text{Global}} = \sum_{i=1}^{16} \left( \text{Score}_{i} \times \omega_{i} \right) \quad \text{avec} \quad \sum_{i=1}^{16} \omega_{i} = 1.00$$

Où $\text{Score}_{i} \in [0, 100]$ représente la note obtenue sur le vecteur technique $i$, et $\omega_{i}$ représente le coefficient de pondération associé selon sa sévérité CVSS.

---

### 2. Grille de Correspondance du Modèle Dual :

| Plage de Score Global | Grade Technique | Sceau Souverain | Niveau de Risque | Impact Opérationnel & Statut de Sécurité |
| :---: | :---: | :---: | :---: | :--- |
| **95 - 100** | **A+** | ★★★ | **Négligeable** | **Excellence Nationale** — Posture cyber exemplaire, conforme aux décrets ANCS. Éligible au Sceau de Confiance ministériel. |
| **90 - 94** | **A** | ★★★ | **Faible** | **Posture Forte** — Résilience solide, risques résiduels mineurs sans impact sur l'intégrité des données. |
| **80 - 89** | **B** | ★★☆ | **Modéré** | **Bon Niveau** — Bonnes pratiques en place mais des faiblesses de configuration (ex: CSP manquant ou bannières visibles). |
| **70 - 79** | **C** | ★★☆ | **Substantiel** | **Seuil d'Alerte** — Niveau minimal acceptable. Déclenchement automatique d'un rapport de recommandation d'urgence. |
| **60 - 69** | **D** | ★☆☆ | **Élevé** | **Posture Vulnérable** — Failles critiques exploitables (ex: TLS obsolète, ports sensibles ouverts). Remédiation requise sous 30 jours. |
| **0 - 59** | **F** | ★☆☆ | **Critique** | **Danger Immédiat** — Risque de compromission imminente. Signalement prioritaire au centre de crise de l'ANCS. |

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 11 (Durée : ~2 min) :
« Passons à la rigueur mathématique de notre algorithme de notation.

Le calcul repose sur une combinaison linéaire pondérée : chaque score de catégorie est multiplié par son poids normalisé. Mais pourquoi avons-nous opté pour un **modèle dual** combinant une note alphabétique (de A+ à F) et des étoiles (de 1 à 3) ?

Pour deux raisons fondamentales :
Premièrement, la **lisibilité technique pour les experts du SOC** : un ingénieur sécurité sait immédiatement qu'un site noté **D** ou **F** a des faiblesses critiques de chiffrement ou des ports exposés.
Deuxièmement, la **transparence pour le citoyen et les secrétaires généraux** : un ministre n'a pas nécessairement le temps de lire 50 pages de logs techniques. En revanche, voir que le portail de son ministère affiche **2 étoiles sur 3** et une note **C** lui donne une mesure instantanée du travail de modernisation à financer.

De plus, notre système intègre un **seuil de rupture** : si un vecteur critique (comme l'exposition d'un port d'administration non protégé ou un certificat totalement invalide) est avéré, le score global est plafonné mathématiquement, empêchant un site d'obtenir une note A grâce à des facteurs secondaires s'il présente une faille béante. »

---

## Slide 12: Corrélation aux Référentiels Nationaux et Internationaux
### المواءمة الاستراتيجية مع المعايير والأطر التنظيمية

Chaque faiblesse identifiée lors d'un audit passif est mappée de manière bidirectionnelle vers **4 référentiels formels** :

\`\`\`
                                  ┌─────────────────────────────────────┐
                                  │      ANOMALIE CYBER DÉTECTÉE        │
                                  │ (Ex: Absence d'en-tête Strict HSTS) │
                                  └──────────────────┬──────────────────┘
                                                     │
         ┌───────────────────────────┬───────────────┴───────────────┬───────────────────────────┐
         ▼                           ▼                               ▼                           ▼
┌──────────────────┐       ┌──────────────────┐            ┌──────────────────┐        ┌──────────────────┐
│ DIRECTIVES ANCS  │       │  OWASP TOP 10    │            │  NIST CSF v2.0   │        │ ISO/IEC 27001    │
│ Décret 2023-17   │       │ Catégorie A05:   │            │ Fonction PR.DS:  │        │ Contrôle A.8.24: │
│ Guide de Sécurité│       │ Security         │            │ Data Security    │        │ Utilisation de   │
│ des Sites Web    │       │ Misconfiguration │            │ & Protection     │        │ la Cryptographie │
└──────────────────┘       └──────────────────┘            └──────────────────┘        └──────────────────┘
\`\`\`

- **Intérêt Opérationnel pour les Auditeurs de l'ANCS** :
  - Fournir aux audités un rapport qui ne se contente pas de dire *« c'est vulnérable »*, mais qui cite l'article de décret et la norme internationale enfreints.
  - Faciliter la mise en conformité des organismes publics lors des audits de certification ISO 27001.

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 12 (Durée : ~1 min 30 s) :
« Un aspect fondamental qui différencie un projet universitaire ordinaire d'un projet d'ingénierie professionnelle de niveau étatique est la **conformité normative**.

Lorsqu'un auditeur de l'ANCS remet un rapport à un directeur général d'administration, ce dernier pose systématiquement la question : *« Sur quelle loi ou quelle norme vous basez-vous pour exiger ce changement ? »*.

Dans CyberScore TN, chaque constat est nativement relié à quatre cadres :
1. **Les guides et décrets de l'ANCS** (Décret-loi n° 2023-17).
2. **L'OWASP Top 10**, qui est la référence mondiale en sécurité web.
3. **Le cadre américain NIST CSF v2.0**, articulé autour des fonctions Identifier, Protéger, Détecter et Réagir.
4. **La norme ISO/IEC 27001:2022**, plus particulièrement les contrôles A.8.20 sur la sécurité des réseaux et A.8.24 sur la cryptographie.

Cette traçabilité donne à nos rapports une valeur juridique et réglementaire immédiate. »

---

## Slide 13: Le Command Center National & Ergonomie SOC
[VISUEL : Capture panoramique du Command Center national / (assets/dashboard.png)]
### مركز القيادة الوطني ومتابعة البنية التحتية التونسية

- **Architecture Live Sync Temps Réel** :
  - Télémétrie continue synchronisée avec la base PostgreSQL 16 (zéro rafraîchissement manuel de page nécessaire).
- **Cartographie Vectorielle Calibrée des 24 Gouvernorats** :
  - Rendu SVG précis sans rognage, de Bizerte au nord jusqu'à Borj El Khadra à l'extrême sud.
  - Coloration dynamique selon la posture cyber moyenne des institutions présentes dans chaque région.
- **Classement National Interactif** :
  - Vue sectorielle instantanée : Ministères, Institutions Constitutionnelles, Collectivités Locales, Entreprises Publiques.
  - Clic interactif sur n'importe quel organisme pour ouvrir directement l'aperçu complet de son audit.
- **Panneau des Vecteurs d'Exposition** :
  - Détection statistique des faiblesses les plus répandues sur l'ensemble du territoire tunisien pour guider les campagnes de sensibilisation nationales.

[VISUEL : Capture d'écran du Command Center avec la carte de Tunisie et le flux d'alertes en direct]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 13 (Durée : ~1 min 30 s) :
« Voici l'interface principale du centre de commandement national. 

Nous avons conçu ce tableau de bord selon les principes ergonomiques d'un véritable centre opérationnel de sécurité (SOC) :
Au centre, une carte vectorielle intégrale de la Tunisie modélisant les 24 gouvernorats. Dès qu'un scan est exécuté, la télémétrie *Live Sync* met à jour les indicateurs sans aucun rafraîchissement de page.

La partie droite affiche le classement national par catégorie : ministères régaliens, régulateurs publics, municipalités et entreprises étatiques comme la STEG ou la SONEDE. 

En un coup d'œil, le directeur de l'ANCS peut voir que le secteur des finances affiche par exemple une moyenne de 82/100, tandis que d'autres secteurs sont à la traîne à 58/100. Cette vision macroscopique est indispensable pour piloter la politique cyber d'un pays. »

---

## Slide 14: Cartographie Sectorielle & Gouvernance Territoriale (/sectors)
### التقسيم القطاعي وتوزيع المؤسسات الحكومية حسب درجات الحماية

- **4 Familles d'Institutions Publiques Modélisées (.gov.tn, .tn, .com.tn)** :
  - **Ministères** : 30 sites majeurs (Score moyen : 78/100 · ministères sous `.gov.tn` et `defense.tn`).
  - **Institutions & Agences Nationales** : 20 sites (Score moyen : 85/100 · agences régaliennes `ancs.tn`, `cni.tn`, `ati.tn`).
  - **Collectivités Locales & Municipalités** : 50 municipalités (Score moyen : 62/100).
  - **Établissements & Entreprises d'État** : 15 sites (Score moyen : 73/100 · opérateurs vitaux `steg.com.tn`, `sonede.com.tn`).
- **Heatmap Régionale des 24 Gouvernorats** :
  - Coloration vectorielle en temps réel : Vert (≥80 Élevé), Gris (65-79 Correct), Jaune (50-64 Modéré), Rouge (<50 Faible).
- **Pilotage Stratégique des Budgets de Cybersécurité** :
  - Détection précoce des collectivités territoriales les plus fragiles pour y dépêcher en priorité les équipes d'intervention de l'ANCS.

[VISUEL : Capture d'écran de la vue sectorielle et cartographie des ministères /sectors (assets/sectors.png)]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 14 (Durée : ~1 min 30 s) :
« Avec la vue sectorielle (/sectors), l'ANCS dispose d'un outil d'aide à la décision macroscopique.
Le patrimoine de l'État y est segmenté en quatre grandes familles couvrant l'ensemble des extensions officielles tunisiennes : les ministères centraux sous .gov.tn et la Défense en defense.tn, les agences nationales en .tn comme l'ANCS et le CNI, les collectivités locales et enfin les entreprises d'État stratégiques comme la STEG et la SONEDE sous .com.tn.
La carte vectorielle met immédiatement en évidence les disparités territoriales : si les ministères régaliens de Tunis affichent d'excellentes notes, certaines municipalités de l'intérieur présentent des vulnérabilités critiques de configuration.
Cela permet au gouvernement d'allouer les budgets de formation et de remédiation là où le risque est le plus élevé. »

---

## Slide 15: Surveillance des Menaces & CTI War Room
[VISUEL : Capture de la War Room CTI avec trajectoires balistiques mondiales /threats (assets/threats.png)]
### مرصد استخبارات التهديدات وغرفة العمليات السيبرانية للمراقبة الاستباقية (/threats)

- **Architecture Duale : Télémétrie CTI Réelle & Modélisation War Room** :
  - Offre aux analystes de l'ANCS et des ministères une tour de contrôle unifiée d'interception et de contextualisation des cybermenaces ciblant le cyberespace tunisien.
  - **Pipeline de Données Réelles (`GET /api/threats/stats`)** :
    - Requêtes asynchrones corrélant les scans de vulnérabilités réels avec les flux mondiaux **AbuseIPDB** et **VirusTotal**.
    - 🔴 *3 IPs sur Liste Noire* : Adresses IP compromises ou utilisées comme relais d'attaque.
    - 🟠 *12 CVEs Détectées* : Failles matérielles et logicielles actives répertoriées aux catalogues mondiaux (NIST NVD, CISA KEV).
    - 🟢 *105 IPs Saines & Sécurisées* : Taux de santé globale du patrimoine public (98% sains).
- **Mappemonde Balistique 60 FPS (HTML5 Canvas & WebGL)** :
  - Tracé dynamique en temps réel des trajectoires d'attaques par courbes de Bézier quadratiques reliant 12 foyers mondiaux (Russie, Chine, Iran, Corée du Nord, Allemagne, USA) aux coordonnées souveraines de la Tunisie (`33.88° N, 9.53° E`).
  - Détection d'impact visuelle et simulation des requêtes bloquées par le pare-feu étatique.
- **Flux d'Attaques en Direct & Réactivité SOC** :
  - Journal temps réel des flux malveillants (*Live Threat Feed*) classé par sévérité (`CRITICAL`, `HIGH`, `MEDIUM`).
  - Bouton d'action directe : **Audit Immédiat en 1 Clic** pour isoler et scanner instantanément tout portail d'État ciblé (ex: `diplomatie.gov.tn`, `finances.gov.tn`).

[VISUEL : Capture d'écran de la War Room /threats avec la mappemonde balistique 60 FPS et le flux d'attaques en temps réel]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 15 (Durée : ~1 min 30 s) :
« Après avoir visualisé la posture interne des 24 gouvernorats sur le Command Center, nous basculons sur notre module de **Cyber Threat Intelligence (CTI)** accessible sur \`/threats\`.

Cette page transforme CyberScore TN en une véritable **War Room opérationnelle** pour l'ANCS :
Sur la mappemonde animée à 60 FPS, vous observez les flux d'attaques en temps réel convergeant vers l'infrastructure tunisienne. Chaque trajectoire est calculée mathématiquement par des courbes de Bézier reliant les pays sources — comme la Russie, la Chine ou l'Iran — à notre dorsale nationale AS2609.

Mais il ne s'agit pas d'une simple animation : en dessous, nous corrélons ces menaces avec nos audits réels en interrogeant les bases mondiales d'AbuseIPDB et de VirusTotal. 
Si une adresse IP gouvernementale est compromise ou si une attaque DDoS vise le portail de la diplomatie ou des finances, l'analyste voit l'alerte clignoter en rouge vif et peut déclencher un audit immédiat en un clic. 

C'est le pont parfait entre la veille géopolitique mondiale et la remédiation tactique sur le terrain. »

---

## Slide 16: L'Analyste IA Souveraine 'Amina 3D' & Architecture Locale
[VISUEL : Console conversationnelle avec l'analyste IA Amina /assistant (assets/assistant.png)]
### المحللة الافتراضية الذكية أمينة — هندسة الذكاء الاصطناعي السيادي

- **Avatar 3D WebGL Haute Performance** :
  - Rendu 3D temps réel à 60 FPS propulsé par Three.js et React Three Fiber.
  - Animations synchronisées avec le dialogue textuel de l'analyste.
- **Moteur LLM Souverain Qwen2.5-Coder:7b** :
  - Modèle de 7 milliards de paramètres spécialisé en génération de code et durcissement réseau (Score HumanEval de 88.4%).
  - Déployé en local sur port dédié (25000) via le runtime **Ollama**.
  - **Zéro fuite de données** : Aucune configuration serveur, aucune IP et aucun nom de ministère ne transite par l'Internet public.
- **Diffusion en Streaming SSE (Server-Sent Events)** :
  - Réponse fluide mot par mot en direct dans le navigateur sans effet de blocage.
  - Contrôle d'arrêt immédiat (*Kill-Switch*) par l'utilisateur via l'\`AbortController\` de React.
- **Génération Actionnable de Scripts de Durcissement** :
  - Amina ne se contente pas de décrire les failles : elle génère directement les blocs de configuration pour Nginx, Apache, ou les règles de pare-feu UFW prêtes à copier/coller.
- **Synchronisation Dynamique Multi-Scans & Intégrité Contextuelle** :
  - Connexion automatique avec les 4 modes de scan (Quick, Standard, Deep, Autonome IA) : le premier message d'Amina et les indicateurs SOC sont 100% fidèles aux scores et vulnérabilités réels de la cible analysée, avec invalidation immédiate de tout cache résiduel.

[VISUEL : Capture d'écran de l'interface de discussion avec l'avatar 3D Amina et un bloc de code Nginx généré]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 16 (Durée : ~2 min 30 s) :
« L'un des volets les plus innovants de notre projet est notre analyste cyber virtuelle, baptisée **Amina 3D**.

Pourquoi un avatar 3D et une IA générative ?
Dans beaucoup d'administrations, les officiers RSSI sont submergés par des rapports d'audit de 100 pages remplis de termes abscons. Amina sert d'interface intelligente et pédagogique entre la donnée brute de l'audit et l'administrateur système.

Sur le plan technique, nous avons refusé la facilité qui aurait consisté à appeler l'API de ChatGPT. Dans un contexte gouvernemental de sécurité nationale, envoyer à un serveur commercial étranger la liste des failles critiques et l'adresse IP du Ministère de l'Intérieur ou de la Défense est tout simplement inacceptable !

Nous avons donc conteneurisé le modèle open-source **Qwen2.5-Coder:7b** sur notre propre infrastructure via Ollama. Grâce à son fine-tuning poussé sur le code informatique, lorsqu'un scan révèle que \`finances.gov.tn\` n'a pas de politique CSP ou utilise des suites TLS dépréciées, Amina injecte ce contexte en mémoire vive et génère en moins de 3 secondes le fichier \`nginx.conf\` ou \`.htaccess\` exact avec les directives corrigées.

L'officier n'a plus qu'à cliquer sur Copier et déployer la solution. »

---

## Slide 17: Moteur Prédictif & Projection Sécuritaire à +30 Jours
[VISUEL : Courbes de projection temporelle et radar multidimensionnel /predictions (assets/predictions.png)]
### منظومة التحليلات التنبؤية بالذكاء الاصطناعي والتوقعات المستقبلية

- **Au-delà du Constat Statique : L'Anticipation du Risque** :
  - La plupart des scanners se contentent de photographier l'état d'un site à un instant $T$.
  - CyberScore TN intègre un modèle prédictif calculant la trajectoire de sécurité sur 30, 60 et 90 jours.
- **Série Temporelle 12 Mois & Zone d'Intervalle de Confiance** :
  - Visualisation graphique SVG continue modélisant l'historique des audits réels.
  - Projection future en pointillés avec zone de déviation probabiliste (intervalle de confiance à $\pm 5$ points).
- **Radar Hexagonal Multidimensionnel (Actuel vs Prédit)** :
  - Décomposition comparative sur les 6 piliers majeurs : Chiffrement SSL, Headers HTTP, Vulnérabilités OWASP, Surface Réseau, Cookies, et Santé DNS.
- **Diagnostic Prédictif Contextualisé par Amina** :
  - Synthèse automatisée prévenant le RSSI : *« Si le certificat expirant dans 18 jours n'est pas renouvelé et si les en-têtes HSTS ne sont pas déployés, la note de votre ministère chutera de 82 (B) à 64 (D) d'ici le mois prochain »*.

[VISUEL : Capture d'écran du module /predictions montrant la courbe temporelle et le radar hexagonal]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 17 (Durée : ~1 min 30 s) :
« La cybersécurité moderne ne consiste plus seulement à réagir après une attaque, elle consiste à **anticiper**. C'est le rôle de notre module de prédiction (/predictions).

Connecté aux données d'audit enregistrées dans PostgreSQL, ce composant modélise la courbe de tendance de chaque organisme sur 12 mois. Grâce à un algorithme de régression pondérée qui surveille la date d'expiration des certificats SSL, la récurrence des anomalies d'en-têtes et l'apparition de nouvelles CVEs publiques, il projette la posture de l'organisme à 30 jours.

Le radar hexagonal permet à l'ingénieur de voir immédiatement quel vecteur tire la note vers le bas. Cela transforme le rapport d'audit en un outil d'aide à la décision proactive. »

---

## Slide 18: Livrable Officiel « Chancellerie » — Rapport PDF 7 Pages
[VISUEL : Hub de téléchargement et attestation officielle SHA-256 /reports (assets/reports.png)]
### مركز التقارير والشهادة الرسمية للمطابقة — وثيقة الدولة عالية الموثوقية

- **Design Haute Fidélité Inspiré des Chancelleries d'État** :
  - Format A4 vectoriel généré côté client via \`@react-pdf/renderer\` sans dépendance de rendu serveur externe.
  - Palette chromatique officielle : Fond ivoire (\`#FBF8F2\`), encre noir absolu (\`#1A1A18\`), rouge institutionnel tunisien (\`#C1272D\`).
  - Typographie sobre, grille géométrique rigoureuse, élimination totale des arrondis informels pour conférer une allure de décret officiel.
- **Décomposition Exhaustive en 7 Pages Normalisées** :
  - **Page 1** : Attestation officielle de conformité, score global /100, grade (A-F), étoiles et empreinte de souveraineté.
  - **Page 2** : Synthèse exécutive pour décideurs, triptyque de conformité (ANCS, ISO 27001, OWASP) et radar des 16 piliers.
  - **Pages 3-5** : Fiches techniques détaillées de chaque vulnérabilité détectée avec sévérité, impact et preuve de constat.
  - **Page 6** : Plan d'action et matrice de remédiation avec snippets de configuration (Nginx, Apache, UFW).
  - **Page 7** : Glossaire terminologique, mentions légales d'audit et clause de non-divulgation (TLP:AMBER+STRICT).
- **Sécurité Cryptographique & Non-Répudiation** :
  - Calcul automatique du hachage **SHA-256** sur l'intégralité des données d'audit.
  - **QR Code officiel** intégré permettant à toute autorité de vérifier instantanément sur la plateforme que le rapport n'a pas été falsifié.

[VISUEL : Aperçu des pages 1 et 2 du rapport officiel PDF style Chancellerie avec le sceau rouge et le QR code]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 18 (Durée : ~2 min) :
« Voici l'aboutissement documentaire de CyberScore TN : notre **Livrable d'État Haute Fidélité**.

Trop souvent, les outils open-source génèrent des PDFs basiques ou des exports CSV illisibles pour un cabinet ministériel. Nous avons voulu créer un document qui ait la dignité et la solennité d'un document officiel de chancellerie.

Le document s'étend sur 7 pages au format A4 vectoriel. Sa charte graphique s'inspire directement des décrets officiels d'État : un fond ivoire noble, des bordures géométriques nettes et le sceau rouge de la République.

Mais au-delà de l'esthétique, ce document offre une garantie d'intégrité cryptographique absolue :
Chaque rapport généré reçoit un identifiant unique d'État (ex: \`#CS-AUDIT-2026-4821\`) et une empreinte numérique calculée via l'algorithme de hachage **SHA-256**. Un **QR Code infalsifiable** est apposé en première page. Si un administrateur tente de falsifier la note de son ministère sur le PDF, un simple scan du QR Code par un inspecteur de l'ANCS révélera immédiatement la note authentique stockée dans notre base de données. »

---

## Slide 19: Observatoire du Benchmark International MENA
[VISUEL : Comparatif sectoriel Tunisie vs MENA /benchmark (assets/benchmark.png)]
### مرصد المقارنة الدولية ومنهجية المعايرة الإقليمية

- **Positionnement Géostratégique Régional** :
  - Évaluation comparative de la Tunisie (Score 72/100, 7ème rang) face à 8 pays pairs de la région MENA (Émirats Arabes Unis, Arabie Saoudite, Maroc, Égypte, Algérie, etc.) et à la France.
- **Méthodologie Déontologique & Éthique de l'Audit** :
  - **Volet National Tunisien (100% Réel & Live)** : Télémétrie passive issue de nos audits en direct sur les 115 ministères et organismes `.gov.tn`.
  - **Volet International Étalonné** : Respect strict du droit international et de la souveraineté des nations tierces (zéro scan intrusif à l'étranger). Intégration des indices publics officiels de l'**ITU Global Cybersecurity Index (ONU)** et des rapports sectoriels de **SecurityScorecard**.
- **Diagnostic Décisionnel des Forces et Axes de Progrès** :
  - *Point Fort Tunisien* : Hygiène des cookies de session (Score de 80/100 vs 78 moyenne mondiale).
  - *Priorité Stratégique Nationale* : Généralisation des directives CSP et du chiffrement HSTS pour combler l'écart avec le Top 3 régional.

[VISUEL : Tableau comparatif des scores MENA et barres de progression par catégorie technique]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 19 (Durée : ~1 min 30 s) :
« Le module de Benchmark International (/benchmark) apporte une perspective géopolitique indispensable aux autorités de régulation.

Sur le plan déontologique, j'ai veillé à respecter scrupuleusement la légalité internationale : nous ne scannons pas sauvagement les serveurs d'États étrangers. Pour la Tunisie, les données proviennent de nos 115 audits réels en direct. Pour les pays tiers, nous étalonnons les métriques sur les rapports officiels de l'Union Internationale des Télécommunications (ITU - ONU) et de SecurityScorecard.

Le résultat montre que la Tunisie se classe 7ème avec 72 points, talonnant de près ses voisins immédiats. Ce comparateur permet à l'ANCS de cibler précisément les axes prioritaires d'investissement pour hisser notre pays dans le Top 3 régional. »

---

## Slide 20: Gamification Professionnelle & Sceau Public de Confiance
[VISUEL : Catalogue des 12 badges SOC et widget du sceau /badges (assets/badges.png)]
### منظومة الأوسمة التحفيزية وخاتم الثقة الرقمي السيادي

- **Système d'Expérience (XP) & 5 Niveaux SOC** :
  - Intégration d'un moteur de gamification professionnelle pour maintenir l'engagement continu des officiers RSSI.
  - Progression à travers 5 paliers : \`DÉBUTANT\` → \`INTERMÉDIAIRE\` → \`AVANCÉ\` → \`EXPERT\` → \`ÉLITE SOC\`.
  - Attribution dynamique de points d'expérience : +150 XP par scan complet, +300 XP pour une note $\ge 90$, +500 XP pour zéro faille critique, +200 XP pour remédiation validée par Amina.
- **Galerie des 12 Badges d'Excellence Déblocables** :
  - Trophées hiérarchisés par niveau de rareté (*Commun, Rare, Épique, Légendaire*).
  - Déblocage automatique en temps réel dès qu'un audit remplit les conditions d'excellence.
- **Sceau Numérique de Confiance Ministériel (Trust Seal Embed)** :
  - Widget vectoriel officiel affichant le label de conformité et le QR Code d'authenticité.
  - Code HTML et balise JavaScript prêts à copier/coller en 1 clic pour intégration sur les portails ministériels afin de rassurer les usagers du service public.

[VISUEL : Galerie des badges SOC et prévisualisation du widget Sceau de Confiance]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 20 (Durée : ~1 min 30 s) :
« La sécurité n'est pas un état figé, c'est un processus permanent. Pour motiver les équipes techniques des ministères à maintenir une vigilance de tous les instants, nous avons intégré un système de **gamification professionnelle** et de **Sceau Public de Confiance**.

Chaque action vertueuse — auditer régulièrement son portail, corriger une faille signalée, obtenir une note supérieure à 90 — rapporte des points d'XP et fait monter le niveau de l'officier dans la barre latérale.

Mais le point culminant pour une administration est le **Sceau de Confiance**. Un ministère méritant peut générer en un clic un badge officiel avec QR Code et l'intégrer en bas de son site web. Lorsqu'un citoyen visite le site des impôts ou de la douane et aperçoit ce sceau officiel vérifiable, sa confiance dans les téléservices de l'État s'en trouve décuplée. »

---

## Slide 21: Portail Souverain de Vérification Citoyenne & Hygiène Numérique
[VISUEL : Portail de vérification scannable par QR code /verify/sante.gov.tn (assets/verify_portal.png)]
### البوابة السيادية للتحقق العام ودليل اليقظة الرقمية التفاعلي للمواطنين (/verify/[domain])

- **Vérification Publique & Scannable par Smartphone** :
  - Route dynamique dédiée accessible via QR Code : `https://cyberscore.tn/[locale]/verify/[domaine]`.
  - Interface trilingue instantanée : **[ العربية (RTL) | FR (LTR) | EN (LTR) ]** avec inversion fluide du sens de lecture.
  - Certificat officiel ANCS : Affichage du Score Global (/100), du Grade attribué (A+ à F), des étoiles de confiance, de la référence d'audit et de l'empreinte de session SHA-256.
- **Double Cloisonnement TLP:AMBER+STRICT (Défense en Profondeur)** :
  - **Pour le Citoyen** : Consultation ouverte de l'attestation de conformité macroscopique sans détails offensifs.
  - **Pour les RSSI Accrédités** : Téléchargement du rapport technique détaillé de 7 pages (révélant CVE et failles exploitables) et déclenchement de re-scan immédiat strictement verrouillés derrière authentification.
- **Slider Interactif d'Hygiène Numérique Citoyenne** :
  - Hero Slider animé à rotation automatique (5.5s) avec pause au survol de la souris.
  - **4 Réflexes Vitaux** :
    1. 🔒 *Cadenas & Domaine Officiel .gov.tn* : Toujours vérifier l'URL exacte avant saisie de coordonnées bancaires.
    2. ⚠️ *Alerte Faux SMS & Phishing* : Aucune administration ne demande de mot de passe ou d'OTP par SMS/mail.
    3. 🔑 *Authentification Double Facteur (2FA)* : Bloque 99% des intrusions en cas de vol d'identifiants.
    4. 📞 *Signalement d'Urgence CERT-TN* : Alerte directe au `71 843 200` et `assistance@anci.tn`.

[VISUEL : Capture d'écran du Portail de Vérification Trilingue avec le Slider d'Hygiène Numérique et le Certificat Cryptographique]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 21 (Durée : ~1 min 30 s) :
« Mesdames et messieurs les membres du jury, la sécurité ne s'arrête pas aux serveurs techniques : elle concerne au premier chef le citoyen tunisien.

C'est pourquoi nous avons créé le **Portail Souverain de Vérification**, accessible instantanément en scannant le QR code avec n'importe quel smartphone. 

Cette page remplit une double mission stratégique :
D'abord, elle offre une **transparence contrôlée** selon la doctrine TLP. Le citoyen y vérifie en 1 seconde la légitimité de l'audit et son empreinte cryptographique SHA-256. En revanche, pour empêcher toute rétro-ingénierie malveillante, le rapport technique de 7 pages détaillant les vulnérabilités CVE est classé TLP:AMBER+STRICT et verrouillé derrière l'espace RSSI.

Ensuite, nous avons intégré un **Slider interactif d'hygiène numérique** disponible en Arabe, Français et Anglais. Ce carrousel dynamique éduque le citoyen en lui rappelant les 4 règles d'or contre le phishing et l'usurpation d'identité, avec un lien direct vers la cellule d'urgence de l'ANCS. C'est l'incarnation de la cyberdéfense citoyenne. »

---

## Slide 22: Modélisation des Menaces & Résilience du QR Code (Anti-Phishing)
### نمذجة التهديدات السيبرانية وإحباط سيناريو سرقة رمز الاستجابة السريعة (Threat Modeling)

- **La Question Piège Classique de Sécurité Offensive** :
  > *« Un cybercriminel peut-il faire une capture d'écran du QR Code d'un ministère et la coller sur son faux site de phishing pour tromper les citoyens ? »*
- **La Réponse d'Ingénierie : Le Piège se Referme sur l'Attaquant grâce au Domain Binding** :
  1. **Ligne 1 — Le Piège du Domain Mismatch** :
     - Le QR Code encode l'URL souveraine liée au domaine : `https://cyberscore.tn/fr/verify/sante.gov.tn`.
     - Lorsque la victime scanne le QR code volé sur `sante-fake-tunisie.com`, son téléphone ouvre le portail ANCS avec le bandeau officiel vert : *« Cette attestation appartient exclusivement au Ministère de la Santé (sante.gov.tn) »*.
     - L'usager constate immédiatement le décalage flagrant entre l'URL sur son ordinateur et le domaine certifié sur son mobile : l'usurpation est démasquée en 1 seconde ! La capture du QR code devient la preuve qui trahit l'escroc.
  2. **Ligne 2 — Ancrage Souverain de l'Extension .tn & Certificat TunTrust** :
     - Si le fraudeur crée un faux portail de vérification (`cyberscore-fake.com`), il ne peut pas obtenir d'extension étatique `.tn` (administrée sous tutelle de l'ATI et de l'ANCS) ni de certificat d'État TunTrust AS2609.
     - S'il tente de faire auditer son faux domaine sur CyberScore TN, les 6 moteurs passifs détectent l'hébergement pirate et lui assignent un **Grade F (0/100) — DOMAINE SUSPECT / NON RECONNU**.
  3. **Ligne 3 — Contrôle Dynamique d'Origine (HTTP Referer & Hostname Widget)** :
     - Le widget d'intégration JavaScript vérifie `document.location.hostname` et l'en-tête HTTP Referer. En cas d'appel illégitime hors du domaine homologué, le sceau vert est révoqué et remplacé par une alerte.

[DIAGRAMME : Schéma de flux montrant le smartphone scannant le QR code sur le faux site et dévoilant le Domain Mismatch]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 22 (Durée : ~2 min) :
« Cette question sur la capture d'écran du QR Code est un piège classique qu'on pose souvent aux ingénieurs en cybersécurité. Ma réponse est catégorique : **voler la capture d'écran du QR Code ne protège pas le pirate, cela le dénonce immédiatement à sa victime.**

Pourquoi ? Parce que nous appliquons le principe du **Domain Binding** : le QR Code est ancré de manière indélébile au domaine étatique officiel.

Si un escroc monte un faux site pour le Ministère de la Santé à l'adresse \`sante-fake.com\` et y colle la capture d'écran de notre QR code, qu'arrive-t-il lorsque la victime sort son téléphone ?
Le téléphone n'ouvre pas le site pirate, il ouvre les serveurs de l'ANCS qui affichent en grand : *« Attestation officielle certifiée pour sante.gov.tn »*. 
La victime regarde l'écran de son PC, voit \`sante-fake.com\`, et réalise en un instant l'escroquerie.

Et si le pirate tente de contourner cela en créant son propre faux CyberScore, il échoue doublement : impossible d'obtenir un nom de domaine en .tn réservé aux institutions, et impossible d'obtenir une signature de l'autorité TunTrust. 

Ce modèle de menace prouve que CyberScore TN a été pensé dès sa conception pour résister aux attaques du monde réel. »

---

## Slide 23: Gouvernance Centrale, Cloisonnement RBAC & Journal d'Audit Live
[VISUEL : Console d'administration RBAC, flux Journal d'Audit Live et passerelle SecOps /admin & /login (assets/admin.png & assets/login.png)]
### لوحة إدارة النظام والتحكم السيادي في الوصول وسجل العمليات الفوري (SYS.ADMIN)

- **Cloisonnement Strict à 3 Rôles Opérationnels** :
  1. **Administrateur ANCS (`admin`)** : Privilèges exclusifs totaux. **Édition directe en ligne du tableau des 24 ministères** (ajustement des niveaux de criticité de 1 à 5 barres, mise à jour des contacts CSIRT d'urgence, enrôlement immédiat d'organisations), validation des demandes d'habilitation, paramétrage des alertes et du Kill-Switch de maintenance.
  2. **Auditeur RSSI Ministériel (`auditor`)** : Scans autorisés sur son périmètre propre (ex: Finances), dialogue avec Amina débloqué, accès à la console d'administration et aux fonctions de modification d'organisations strictement interdit (verrou HTTP 403).
  3. **Observateur Public / Auditeur Junior (`viewer`)** : Consultation des scores nationaux en lecture seule, interdiction absolue de déclencher des scans actifs, de modifier des entités ou d'accéder aux paramètres.
- **Journal d'Audit en Direct 100% Fonctionnel (`● LIVE FEED`)** :
  - **Traçabilité des Administrateurs** : Enregistrement temps réel des modifications d'organisations (criticité, contact), désactivations/réactivations de comptes, suppressions d'officiers, modifications de politique d'alerte et bascule du Mode Maintenance.
  - **Traçabilité des Auditeurs** : Imputation nominative de chaque exécution d'audit (score, grade, domaine) et de chaque téléchargement de rapport officiel PDF certifié.
  - **Non-Répudiation & Horodatage à la seconde** : Conforme aux exigences du Décret-loi n° 2023-17 et de la norme ISO 27001 avec compteur d'événements dynamique et bouton de réinitialisation pour la démonstration.
- **Sécurité et Verrouillage Visibles dans l'Interface** :
  - **Écran d'Accès Refusé HTTP 403** sur `/admin` avec bouclier rouge d'interdiction pour tout compte non-administrateur.
  - **Contrôles Applicatifs Étanches** : Fonctions d'édition et d'ajout d'organisations protégées par double vérification de rôle (`loggedUser.role === "admin"`).
  - **Modale de Restriction sur `/scan`** bloquant les lancements de scan pour les comptes observateurs.
  - **Cartouche d'Identité Dynamique** affichant les initiales, le nom complet de l'officier, son rôle institutionnel et un bouton de déconnexion 1-clic.
- **Mode Maintenance d'Urgence (Kill-Switch)** :
  - Capacité pour l'ANCS de suspendre instantanément tous les scans publics sur le territoire en cas de cyberattaque massive coordonnée.

[VISUEL : Capture d'écran du panneau d'administration, flux Journal d'Audit Live et écran d'accès refusé HTTP 403]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 23 (Durée : ~2 min) :
« Une plateforme de cyber-surveillance nationale manipule des informations sensibles. Sa gouvernance interne doit être irréprochable.

Nous avons implémenté un modèle **RBAC (Role-Based Access Control)** étanche à trois niveaux :
L'**Admin ANCS** dispose des privilèges exclusifs pour administrer l'écosystème : il peut notamment **modifier en direct depuis le site le tableau officiel des 24 ministères** — ajuster leur niveau de criticité régalienne de 1 à 5 barres, mettre à jour le contact d'urgence CSIRT ou enrôler une nouvelle entité publique. Ces privilèges sont strictement interdits aux auditeurs et observateurs, protégés par des barrières applicatives et un écran d'interdiction **HTTP 403 Forbidden**.
L'**Auditeur ministériel**, comme celui du Ministère des Finances, ne peut agir que dans le périmètre de son département.
L'**Observateur** a un accès purement informatif en lecture seule.

La sécurité n'est pas seulement théorique, elle est concrètement appliquée à chaque recoin de l'interface :
Si un auditeur ou un observateur tente d'accéder à `/admin`, le routeur Next.js et la passerelle de sécurité le bloquent instantanément et affichent un **écran rouge d'accès interdit HTTP 403**. 
De même, si un compte Observateur tente de lancer un scan, une modale de blocage l'en empêche et lui propose de basculer sur un compte habilité.

**Le Journal d'Audit est 100% fonctionnel et réactif en direct** : chaque action d'administration (modification de criticité d'une organisation, désactivation d'un compte, bascule du Kill-Switch) ainsi que chaque opération d'auditeur (lancement de scan, téléchargement de rapport officiel PDF) génère instantanément un événement horodaté à la seconde près dans le flux **LIVE FEED**, garantissant une imputabilité et une non-répudiation absolues au sens du Décret-loi n° 2023-17.

Enfin, nous avons intégré un **Kill-Switch de maintenance** : en cas d'alerte nationale majeure, l'administrateur ANCS peut geler les audits en un clic pour préserver la bande passante des réseaux de l'État. »

---

## Slide 24: Démonstration en Direct — Le Scénario Opérationnel
### العرض المباشر — سيناريو محاكاة عملياتي متكامل

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             PARCOURS DE LA DÉMONSTRATION EN DIRECT                               │
│                                                                                                  │
│  [1] TEST RBAC 403          ➔  Connexion Observateur Santé ➔ Tentative /admin ➔ BLOCAGE 403      │
│  [2] TEST RESTRICTION SCAN  ➔  Tentative de scan ➔ MODALE DE RESTRICTION (Lecture seule)         │
│  [3] BASCULE AUDITEUR       ➔  Passage en Auditeur Finances ➔ Périmètre Débloqué                │
│  [4] NAVIGATION RAPIDE      ➔  Ouverture de la Command Palette (Ctrl+K) ➔ Recherche instantanée  │
│  [5] SCAN LIVE EN DIRECT    ➔  Audit de finances.gov.tn en mode Standard (~8 secondes)           │
│  [6] ANALYSE DES 16 PILIERS ➔  Exploration du score global, grade et détail des failles          │
│  [7] DIALOGUE IA AMINA      ➔  Génération streaming SSE d'un fichier de durcissement Nginx      │
│  [8] EXPORT LIVRABLE PDF    ➔  Génération et téléchargement du rapport officiel 7 pages SHA-256   │
│  [9] SUPERVISION ANCS       ➔  Connexion Admin ➔ Édition d'Organisation (Criticité) & Kill-Switch │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 24 (Durée : ~8 à 10 min) :
« Mesdames et messieurs les membres du jury, après cette présentation de l'architecture et des algorithmes, je vous propose de passer à la **démonstration opérationnelle en direct**. Cette démonstration s'exécute sur notre cluster Tri-VM en production sous VMware Workstation, accessible en direct dans mon navigateur à l'adresse de notre DMZ : `http://192.168.98.150`. 

Pour vous prouver l'étanchéité et la robustesse du système distribué, nous allons suivre un scénario professionnel complet en 9 étapes :

1. Je me connecte d'abord en tant qu'**Observateur du Ministère de la Santé**. Je tente d'accéder à la page secrète d'administration \`/admin\` : vous constatez immédiatement l'apparition de l'**écran de blocage rouge HTTP 403 Forbidden**. Le système refuse catégoriquement l'accès.
2. Je me rends sur la page de scan et j'essaie de lancer un audit : une **modale d'interdiction** m'informe que mon profil est restreint à la lecture seule.
3. Je clique sur le bouton de bascule vers le profil **Auditeur des Finances**. Vous constatez que la TopBar et la Sidebar mettent immédiatement à jour l'identité, les initiales (\`YH\`) et les permissions.
4. J'appuie sur le raccourci clavier **\`Ctrl + K\`** pour ouvrir notre Command Palette et je saute directement sur le module de scan.
5. Je lance un audit en direct sur le portail \`https://finances.gov.tn\` en mode Standard. Observez la jauge de progression : en **moins de 8 secondes**, les 10 scanners asynchrones ont inspecté le serveur et retournent la note globale avec le grade et les étoiles.
6. Nous explorons les résultats : nous constatons les faiblesses précises sur les en-têtes CSP et les cookies.
7. J'ouvre l'assistant IA **Amina 3D**. Je lui demande comment corriger l'absence de CSP. Observez le streaming mot par mot : notre modèle local **Qwen2.5-Coder** génère en direct le bloc de configuration Nginx complet sans aucun appel Internet externe.
8. Je clique sur **Exporter le Rapport PDF** : en moins de deux secondes, le document officiel de 7 pages au style Chancellerie est généré, avec son empreinte SHA-256 et son QR code vérifiable.
9. Enfin, je me connecte en tant qu'**Administrateur National ANCS** pour vous montrer la console centrale : j'effectue en direct l'édition d'une organisation (ajustement de criticité et contact CSIRT avec répercussion instantanée dans le Journal d'Audit) et la commande de bascule du Kill-Switch. »

---

## Slide 25: Résultats Métriques & Validation du Système
### النتائج الميدانية والتقييم الفني للمنظومة

- **Modélisation Exhaustive du Web Gouvernemental** :
  - **120 domaines étatiques** cartographiés et persistés dans PostgreSQL 16 à travers 19 tables relationnelles.
- **Benchmarks de Vitesse d'Audit Validés** :
  - **Quick Scan** (4 modules critiques) : **2.4 secondes** en moyenne.
  - **Standard Scan** (10 modules) : **7.8 secondes** en moyenne.
  - **Deep Scan** (16 modules complets avec cartographie réseau) : **28.5 secondes**.
- **Indépendance & Souveraineté Technologique Prouvée** :
  - 100% des inférences de remédiation IA exécutées en local sur le port 25000 sans aucune dépendance réseau externe.
  - Zéro fuite de données d'audit hors des frontières nationales.
- **Fiabilité Industrielle du Code Source** :
  - Application Next.js 16 compilée avec Turbopack sur **44 pages statiques et dynamiques avec 0 erreur TypeScript**.
  - Respect strict des critères d'accessibilité WCAG 2.1 et compatibilité mobile/desktop universelle.

[TABLEAU / GRAPHIQUE : Histogramme des temps de réponse et distribution des notes des 120 ministères scannés]

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 25 (Durée : ~1 min 30 s) :
« Les résultats métriques confirment la viabilité industrielle de notre plateforme :

Nous avons cartographié et modélisé l'ensemble des 120 sites du gouvernement tunisien. Grâce à notre moteur asynchrone, un scan complet Standard ne prend que 7,8 secondes en moyenne, ce qui est 20 fois plus rapide que les scanners traditionnels du marché.

L'intégrité de notre code source a été validée par la compilation stricte de nos 44 routes avec zéro erreur TypeScript. Mais la plus grande victoire technique de ce travail réside dans la souveraineté : nous avons prouvé qu'il est possible de fournir une assistance IA générative de très haut niveau dans un environnement régalien en exécutant un modèle de 7 milliards de paramètres 100% hors-ligne. »

---

### Difficultés Techniques Rencontrées & Solutions Adoptées
### الصعوبات الهندسية والحلول التقنية المبتكرة

| Défi Technique Majeur | Problématique Sous-Jacente | Solution d'Ingénierie Implémentée |
| :--- | :--- | :--- |
| **1. Bilinguisme Arabe RTL Parfait** | Inversion complexe des marges, bordures et directions de lecture cassant les grilles CSS traditionnelles. | Abandon des classes fixes gauche/droite au profit exclusif des **CSS Logical Properties** (\`margin-inline\`, \`padding-inline\`, \`inset-inline\`) combinées à la police Google Fonts **Noto Sans Arabic**. |
| **2. Persistance de Session Multi-Rôles** | Crashs possibles si un profil utilisateur stocké dans le navigateur contenait des champs nuls ou au format snake_case (\`full_name\`). | Mise en place d'une couche de **normalisation défensive et null-safe** à la lecture du \`localStorage\`, avec calcul tolérant aux pannes des initiales d'avatar. |
| **3. Latence & Fuite des Données de l'IA** | Les APIs LLM cloud externes sont lentes, payantes et violent le secret défense des configurations ministérielles. | Déploiement du modèle **Qwen2.5-Coder:7b** via **Ollama** sur port dédié local avec protocole de streaming SSE et fallback automatique sur base de règles en cas de coupure. |
| **4. Génération PDF A4 sans Déformation** | Les outils classiques de capture HTML vers PDF créent des coupures de page au milieu des tableaux et des textes flous. | Utilisation du moteur vectoriel natif **\`@react-pdf/renderer\`** avec définition d'une grille typographique stricte au millimètre et polices vectorielles PostScript intégrées. |
| **5. Exécution Parallèle d'Audits Réseau** | Les timeouts réseau sur des domaines lents bloquaient l'ensemble du serveur backend pendant plusieurs minutes. | Encapsulation de chaque module d'audit dans une coroutine Python avec **timeouts individuels stricts (5s)** orchestrés par \`asyncio.gather(..., return_exceptions=True)\`. |

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 25 (Difficultés Techniques — Durée : ~2 min) :
« Tout projet d'ingénierie d'envergure se heurte à des verrous techniques complexes. En voici les cinq plus marquants et la manière dont nous les avons résolus :

Le premier écueil était l'**intégration de la langue arabe en mode RTL**. Les frameworks modernes ont tendance à inverser brutalement l'affichage, ce qui déforme les graphiques. Nous avons résolu cela en adoptant les *CSS Logical Properties*, qui s'adaptent dynamiquement à la direction de lecture.

Le second écueil concernait les **performances réseau** : lorsqu'un site étatique mettait 30 secondes à répondre, tout le backend était paralysé. Nous avons conçu une architecture asynchrone où chaque sonde dispose de son propre timeout étanche : si un serveur DNS met plus de 4 secondes à répondre, la sonde passe le relais sans ralentir l'audit des certificats SSL ou des en-têtes HTTP.

Enfin, la **génération PDF** a nécessité l'abandon des bibliothèques de capture d'écran pour écrire directement en primitives vectorielles A4, garantissant une netteté d'impression parfaite digne du Journal Officiel de la République Tunisienne. »

---

### Perspectives d'Évolution & Rayonnement Futur
### الآفاق المستقبلية وتطوير المنظومة

1. **Homologation Officielle par l'ANCS & CERT-TN** :
   - Présenter formellement CyberScore TN auprès de la direction générale de l'ANCS pour l'adopter comme outil officiel d'audit continu et de télésurveillance du cyberespace national.
2. **Déploiement d'une Application Compagnon Mobile (React Native)** :
   - Notification Push et alertes SMS chiffrées envoyées instantanément aux ministres et directeurs de cabinet en cas de dégradation critique d'un portail étatique.
3. **Automatisation du Monitoring Périodique (Celery Beat)** :
   - Planification d'audits nocturnes quotidiens (02:00 UTC) avec détection automatique des régressions et alertes de déviation de score.
4. **Extension Régionale aux Pays Frères de la Zone MENA** :
   - Adapter la taxonomie de la plateforme pour couvrir les agences de cybersécurité des pays voisins (Algérie, Maroc, Mauritanie, Égypte) dans le cadre d'initiatives de cyberdéfense partagées.
5. **Intégration d'un Moteur d'Audit de Code Source Interne (SAST/DAST)** :
   - Élargir le périmètre externe passif pour permettre aux développeurs étatiques de téléverser leurs dépôts de code avant mise en production.

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 25 (Perspectives — Durée : ~1 min 30 s) :
« Le projet CyberScore TN ne s'arrête pas au cadre de ce PFA. Il a été conçu dès le premier jour comme une plateforme prête pour l'industrialisation.

Nos perspectives à court et moyen terme s'articulent autour de trois axes :
Le premier est l'**homologation institutionnelle** : nous souhaitons soumettre ce travail à la direction de l'ANCS pour qu'il devienne le baromètre officiel national utilisé par les équipes d'intervention d'urgence du CERT-TN.

Le deuxième est la **veille mobile** : doter les hauts fonctionnaires d'une application compagnon mobile leur permettant d'être alertés en temps réel si leur portail ministériel subit une attaque ou une défiguration.

Le troisième est le **rayonnement régional** : notre moteur trilingue et notre modèle d'IA souveraine peuvent être transposés en quelques semaines pour équiper d'autres agences nationales de cybersécurité du monde arabe et du continent africain. »

---

## Slide 26: Synthèse des Réalisations, Remerciements & Session Q/R
### الحصيلة العامة والتقييم الذاتي للمشروع

**Ce que CyberScore TN apporte à la Nation Tunisienne** :
- **Un Outil Souverain et Gratuit** permettant à l'État d'économiser des centaines de milliers de dinars en licences étrangères.
- **Une Mesure Objective et Continue** de l'hygiène cybernétique des 120 institutions de la République.
- **Une IA Générative On-Premise** qui démocratise la remédiation technique auprès de tous les ministères.
- **Des Livrables Infalsifiables** garantis par signature cryptographique SHA-256 et QR Code.

**Ce que ce Projet m'a Apporté en tant que Futur Ingénieur** :
- Maîtrise avancée des architectures microservices modernes (**Next.js 16**, **FastAPI**, **PostgreSQL 16**, **Docker**).
- Expertise approfondie des protocoles de sécurité réseau (TLS 1.3, DNSSEC, HSTS, CSP, DMARC, CVSS v3.1).
- Capacité à concevoir, conteneuriser et déployer un grand modèle de langage (**LLM 7B**) en production locale avec contrôle de flux en temps réel.
- Rigueur de gestion de projet d'envergure, depuis l'analyse des décrets de loi jusqu'à l'expérience utilisateur finale.

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 26 (Durée : ~1 min) :
« Pour conclure cette présentation, CyberScore TN dote l'ANCS et les départements ministériels d'une capacité d'audit autonome, rigoureuse et immédiatement déployable. 

Ce projet m'a permis d'intégrer le développement logiciel asynchrone, la conformité aux référentiels de cyberdéfense et le déploiement d'une IA locale souveraine. 

Les 120 institutions modélisées, les scans exécutés en moins de 8 secondes et les 44 pages compilées sans erreur démontrent la faisabilité technique et la valeur d'une solution 100% nationale. »

---

### Remerciements & Clôture de la Soutenance
### كلمة الشكر والإجابة على استفسارات اللجنة الموقرة

# CyberScore TN
### منصة تقييم ومراقبة الأمن السيبراني للمواقع الحكومية التونسية
### Plateforme Souveraine d'Évaluation de la Cybersécurité des Domaines Étatiques Tunisiens

- **Candidat** : Hamdouni Yosri
- **Filière** : Ingénierie des Systèmes Informatiques & Cybersécurité
- **Partenaire** : Agence Nationale de la Cybersécurité (ANCS) — 2026

---

### شكراً جزيلاً لحسن استماعكم واهتمامكم
### Merci infiniment de votre bienveillante attention

### أتشرف الآن بالإجابة على جميع أسئلتكم وملاحظاتكم القيمة
### Je me tiens à votre entière disposition pour répondre à vos questions et approfondir tout aspect technique de la plateforme.

---

### Guide Détaillé de l'Orateur (Speaker Notes) — Slide 26 (Clôture & Remerciements — Durée : ~30 secondes) :
« Je tiens à remercier très chaleureusement mon encadrant, les membres du jury pour leur temps et leur présence, ainsi que tous ceux qui ont contribué de près ou de loin à la réussite de ce projet.

Je suis désormais à votre entière disposition pour écouter vos observations et répondre à toutes vos questions. Je vous remercie. »


---
