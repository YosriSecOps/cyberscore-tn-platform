# CyberScore TN — Script Complet de l'Orateur (PRESENTATION.md)

> **Présentation de Soutenance de Projet de Fin d'Études d'Ingénieur**  
> **Candidat :** Hamdouni Yosri — TEK-UP / ANCS (2026)  
> **Format :** 46 diapositives (38 diapositives principales + 8 diapositives de réserve)  
> **Durée :** 35 à 45 minutes (Budget de base : 40 minutes)  
> **Langue :** Français uniquement  

---

## Diapositive 01 / 46 : CYBERSCORE TN : Évaluation & Notation Souveraine de la Posture Cyber Nationale
- **Section :** Cadrage Stratégique
- **Kicker :** Projet de Fin d'Études · Soutenance d'Ingénieur
- **Timing :** `[Timing: 00:00 | Durée: 1 min]`
- **Volume :** 108 mots

### Paroles de l'Orateur :
> "Monsieur le Président du jury, Madame, Monsieur les membres du jury, chers encadrants académiques et professionnels, j'ai l'honneur de vous présenter aujourd'hui mon projet de fin d'études d'ingénieur en sécurité informatique, réalisé au sein de TEK-UP en collaboration étroite avec l'Agence Nationale de la Cybersécurité (ANCS). Face à la prolifération des menaces ciblant les infrastructures critiques de l'État tunisien, CyberScore TN répond à un impératif d'indépendance technologique : concevoir et déployer une plateforme nationale souveraine capable d'auditer en continu, de scorer mathématiquement et d'assister la remédiation technique de l'ensemble des portails publics et souverains de la République Tunisienne, sans dépendre d'acteurs ou de services tiers hébergés à l'étranger."

---

## Diapositive 02 / 46 : Parcours & Chronogramme de la Soutenance
- **Section :** Cadrage Stratégique
- **Kicker :** Structure de l'Exposé · 35 à 45 Minutes
- **Timing :** `[Timing: 01:00 | Durée: 1 min]`
- **Volume :** 105 mots

### Paroles de l'Orateur :
> "Pour structurer nos échanges, j'ai organisé cette présentation en sept étapes logiques, respectant un budget temps global de 40 minutes. Nous commencerons par le cadrage stratégique et l'analyse de l'existant en 4 minutes, avant d'aborder l'architecture globale Tri-VM en 4 minutes. Le cœur de notre exposé sera consacré pendant 14 minutes aux deux moteurs d'analyse : l'orchestrateur passif à 16 facteurs et la sonde autonome multi-agents. Nous détaillerons ensuite les fonctionnalités produit en 6 minutes, puis les résultats empiriques et la validation logicielle en 3 minutes. Une démonstration opérationnelle de 7 minutes précédera la conclusion et l'ouverture de la session de questions-réponses avec le jury."

---

## Diapositive 03 / 46 : État des Lieux Réel de la Surface Publique Tunisienne
- **Section :** Cadrage Stratégique
- **Kicker :** Campagne Réelle · Source real-scans.json
- **Timing :** `[Timing: 02:00 | Durée: 1 min]`
- **Volume :** 123 mots

### Paroles de l'Orateur :
> "Pour fonder notre travail sur des données empiriques irréfutables et non sur des conjectures théoriques, nous avons mené un audit d'envergure portant sur 121 domaines publics tunisiens, consolidé dans le fichier real-scans.json. Les résultats dressent un constat lucide : la moyenne nationale globale s'établit à 57,6 sur 100, traduisant une posture générale classée en Grade D. Il est fondamental d'observer la dichotomie opérationnelle : 66 sites sont effectivement joignables et atteignent une moyenne de 65,0 sur 100. À l'inverse, 55 portails, soit plus de 45 % du périmètre, se sont révélés hors ligne lors de la campagne. Dans notre modèle, ces sites ne sont pas exclus mais pénalisés par une note plancher d'environ 48,8, ce qui tire mathématiquement l'indice étatique vers le bas."

---

## Diapositive 04 / 46 : La Problématique : Asymétrie & Limites des Audits Ponctuels
- **Section :** Cadrage Stratégique
- **Kicker :** Défis & Vulnérabilités Systémiques
- **Timing :** `[Timing: 03:00 | Durée: 1 min]`
- **Volume :** 115 mots

### Paroles de l'Orateur :
> "Cette cartographie met en lumière une asymétrie de sécurité critique. D'un côté, les attaquants scrutent les infrastructures 24 heures sur 24 à l'aide d'outils automatisés, exploitant la moindre vulnérabilité dès sa publication. De l'autre, les institutions publiques s'appuient historiquement sur des audits d'homologation périodiques, menés tous les un à trois ans par des auditeurs externes. Ces audits manuels sont coûteux, lents et fournissent une photographie figée dans le temps, obsolète dès le déploiement de la mise à jour logicielle suivante. Il manquait à l'État un instrument souverain de télémétrie continue capable d'alerter instantanément sur les régressions de sécurité, de vérifier les preuves de concept sans risque d'indisponibilité, et de piloter la remédiation à l'échelle nationale."

---

## Diapositive 05 / 46 : Analyse Comparative : Solutions Commerciales vs CyberScore TN
- **Section :** Cadrage Stratégique
- **Kicker :** Benchmarking & Souveraineté Technologique
- **Timing :** `[Timing: 04:00 | Durée: 1 min]`
- **Volume :** 102 mots

### Paroles de l'Orateur :
> "Face à cette problématique, on pourrait s'interroger sur l'opportunité de recourir à des solutions internationales réputées telles que SecurityScorecard ou BitSight. L'analyse comparative met en évidence des verrous stratégiques majeurs. Premièrement, la souveraineté : ces plateformes SaaS imposent de transmettre les inventaires réseau et la cartographie des vulnérabilités nationales vers des datacenters étrangers. Deuxièmement, le modèle économique : ces services requièrent des souscriptions annuelles très onéreuses en devises fortes. Troisièmement, l'adéquation réglementaire : leurs algorithmes ignorent les spécificités de la réglementation tunisienne, notamment le Décret 2023-17 et le bloc d'adressage ATI AS2609. CyberScore TN apporte une réponse sur-mesure, souveraine et hébergée localement."

---

## Diapositive 06 / 46 : Architecture Logique en Quatre Tiers
- **Section :** Architecture Système
- **Kicker :** Découpage Fonctionnel & Séparation des Responsabilités
- **Timing :** `[Timing: 04:00 | Durée: 1 min]`
- **Volume :** 138 mots

### Paroles de l'Orateur :
> "L'architecture de CyberScore TN a été pensée selon un modèle à quatre tiers strictement cloisonnés, garantissant la modularité et la sécurité des traitements. Au sommet, le Tier Présentation repose sur Next.js 15, délivrant un tableau de bord SOC trilingue, interactif et réactif. Le Tier Métier & Orchestration s'appuie sur FastAPI en Python 3.12, assurant la coordination asynchrone des analyses et le calcul mathématique du score. Le Tier Raisonnement IA héberge notre accélérateur local Ollama exécutant le modèle Qwen2.5-Coder:7b, sollicité pour l'analyse sémantique des bannières et la rédaction de feuilles de route, avec repli automatique sur un moteur déterministe en cas d'indisponibilité. Enfin, le Tier Collecte & Moteur Réseau regroupe les 15 scanners passifs et la sonde d'audit active. Soulignons ici une rigueur d'ingénierie : aucun magasin vectoriel ni RAG n'est utilisé, l'IA opérant par injection structurée JSON directe."

---

## Diapositive 07 / 46 : Topologie Infrastructurelle Tri-VM
- **Section :** Architecture Système
- **Kicker :** Sécurité des Périmètres · Isolation des Zones
- **Timing :** `[Timing: 05:00 | Durée: 1 min]`
- **Volume :** 120 mots

### Paroles de l'Orateur :
> "Pour respecter les standards d'homologation des réseaux de l'État, le déploiement opérationnel segmente l'infrastructure en trois machines virtuelles distinctes. La VM 1, positionnée en zone démilitarisée (DMZ), expose le frontal Next.js derrière un reverse proxy Nginx avec durcissement SSL strict. La VM 2, confinée dans le réseau interne d'administration, héberge l'API FastAPI et la base de données PostgreSQL 16. Elle est totalement inaccessible depuis Internet. La VM 3 héberge le service d'inférence Ollama et le runner de la sonde autonome multi-agents, bénéficiant d'un accès contrôlé sortant sous proxy pour exécuter les audits actifs. Cette séparation garantit qu'une éventuelle compromission du frontal web en DMZ ne permet en aucun cas d'accéder aux données d'audit ministérielles ou de corrompre les modèles d'analyse."

---

## Diapositive 08 / 46 : Flux Réseau, Nginx & Gestion des Sessions
- **Section :** Architecture Système
- **Kicker :** Routage, Cloisonnement & Protection des Flux
- **Timing :** `[Timing: 06:00 | Durée: 1 min]`
- **Volume :** 123 mots

### Paroles de l'Orateur :
> "Cette diapositive détaille la circulation des requêtes et le durcissement du proxy inverse Nginx. L'ensemble du trafic HTTPS converge vers le point d'entrée unique. Nginx applique les en-têtes de sécurité recommandés par l'ANCS (HSTS à 31536000 secondes, X-Frame-Options DENY, X-Content-Type-Options nosniff) et achemine le trafic : les pages web vers le serveur Next.js en local sur le port 3000, et les appels `/api/v1/` vers l'API FastAPI sur le port 8000. Sur le plan de l'authentification, les sessions utilisent des jetons Bearer JWT à durée de vie maîtrisée (24 heures). Dans une optique de transparence totale avec le jury, soulignons que la transition vers des cookies de session `HttpOnly; SameSite=Strict; Secure` générés côté serveur est identifiée comme un axe de renforcement prioritaire pour l'industrialisation."

---

## Diapositive 09 / 46 : La Stack Technologique & Justifications Techniques
- **Section :** Architecture Système
- **Kicker :** Technologies, Rationale & Arbitrages
- **Timing :** `[Timing: 07:00 | Durée: 1 min]`
- **Volume :** 126 mots

### Paroles de l'Orateur :
> "Chaque composant de notre pile technologique a été sélectionné sur la base d'arbitrages d'ingénierie rigoureux. Pour le backend, Python 3.12 et FastAPI s'imposent par leur gestion native de la programmation asynchrone via `asyncio`, permettant de déclencher des dizaines de sondes réseau concurrentes avec une consommation mémoire minime. Pour la persistance, PostgreSQL 16 structure 18 modèles de données intégrant les référentiels nationaux et l'historique des scores. La couche de cache associe Redis en développement conteneurisé à Valkey 7 lors des déploiements sur machine virtuelle Debian, garantissant l'indépendance de licence. Côté interface, Next.js 15 avec Tailwind CSS v4 concilie performance brute, accessibilité multilingue arabe-français et ergonomie SOC de classe opérationnelle. Enfin, Ollama assure l'hébergement de Qwen2.5-Coder sur le sol national, éliminant tout appel à des API propriétaires étrangères."

---

## Diapositive 10 / 46 : Les Trois Chemins d'Exécution de la Plateforme
- **Section :** Moteurs d'Évaluation
- **Kicker :** Orchestration & Résilience des Flux
- **Timing :** `[Timing: 08:00 | Durée: 1 min]`
- **Volume :** 123 mots

### Paroles de l'Orateur :
> "CyberScore TN ne repose pas sur un algorithme monolithique mais orchestre trois chemins d'exécution distincts, chacun calibré pour un niveau de criticité opérationnelle spécifique. Le Chemin A est l'orchestrateur Python principal : il évalue 16 facteurs de risque via des modules asynchrones et calcule le score officiel de production. Le Chemin B est une implémentation alternative native en TypeScript intégrée dans Next.js : elle analyse 6 piliers fondamentaux et sert de solution de secours haute disponibilité si le backend Python est inaccessible lors d'une consultation publique. Le Chemin C est la sonde autonome multi-agents : exécutée sous mandat strict, elle engage des investigations dynamiques pour valider l'exploitabilité réelle des vulnérabilités. Cette tripartition garantit à la fois exhaustivité, résilience et séparation stricte des privilèges."

---

## Diapositive 11 / 46 : Orchestrateur : Phases, Concurrence & Tolérance aux Pannes
- **Section :** Moteurs d'Évaluation
- **Kicker :** Orchestrateur Asynchrone · backend/app/scanners/orchestrator.py
- **Timing :** `[Timing: 09:00 | Durée: 1 min]`
- **Volume :** 131 mots

### Paroles de l'Orateur :
> "Examinons en détail le fonctionnement interne de l'orchestrateur Python. Contrairement à une affirmation simpliste selon laquelle seize modules s'exécuteraient en vrac simultanément, le code organise l'audit en phases ordonnées. Cette séparation est fondamentale pour éviter d'inonder la cible : la Phase 1 inspecte les en-têtes et le certificat TLS ; puis la Phase 2 analyse l'infrastructure de noms DNS, la messagerie et les technologies ; enfin la Phase 3 engage les contrôles applicatifs et de réseau étendu. Au sein de chaque phase, les scanners sont lancés en parallèle via `asyncio.gather`. Chaque scanner est encapsulé dans un `asyncio.wait_for` avec un timeout individuel strict. Si un scanner échoue ou subit un timeout réseau, il renvoie un résultat nul : notre moteur l'exclut gracieusement du dénominateur sans lui infliger une note de zéro injustifiée."

---

## Diapositive 12 / 46 : Les Trois Profondeurs d'Audit : Quick, Standard & Deep
- **Section :** Moteurs d'Évaluation
- **Kicker :** Profondeurs de Scan · SCAN_PHASES
- **Timing :** `[Timing: 10:00 | Durée: 1 min]`
- **Volume :** 132 mots

### Paroles de l'Orateur :
> "Pour adapter la charge d'évaluation aux besoins opérationnels, CyberScore TN implémente trois profondeurs d'audit prédéfinies. Le mode Quick exécute la seule Phase 1 : 4 scanners focalisés sur la surface web immédiate (SSL, Headers, Cookie, CSP) en environ 30 secondes. Le mode Standard, recommandé pour le monitoring national régulier, enchaîne la Phase 1 et la Phase 2 : 10 scanners totalisant la vérification DNS, la sécurité de messagerie SPF/DMARC, l'exposition d'informations sensibles, la détection technologique et les certificats en environ 2 minutes. Le mode Deep combine les trois phases : 15 scanners exécutés jusqu'aux tests OWASP, cartographie réseau et réputation d'adresses IP en environ 10 minutes. Soulignons que sur les 16 catégories du référentiel, 15 scanners sont pleinement implémentés, la seizième catégorie relative au patching CVE étant réservée pour une intégration locale."

---

## Diapositive 13 / 46 : Anatomie d'un Module Scanner & Barème de Déduction
- **Section :** Moteurs d'Évaluation
- **Kicker :** Structure des Constatations · backend/app/scanners/base.py
- **Timing :** `[Timing: 11:00 | Durée: 1 min]`
- **Volume :** 125 mots

### Paroles de l'Orateur :
> "La rigueur de notre architecture repose sur une modélisation standardisée des constatations de sécurité. Chaque module hérite de la classe abstraite `BaseScanner` et instancie des objets `Finding` strictement typés. Comme l'illustre cette diapositive, un `Finding` intègre son titre, sa sévérité normalisée, sa description, la recommandation de remédiation, le score CVSS estimé et le triple alignement normatif : OWASP 2021, NIST CSF et ISO 27002. Le calcul du score de chaque catégorie obéit à la méthode `_deduct` : le score démarre au maximum possible du facteur, puis déduit des points selon la sévérité des anomalies constatées : 3 points pour une faille critique, 2 points pour une faille haute, 1 point pour une moyenne et un demi-point pour une faible, avec un plancher strict à zéro."

---

## Diapositive 14 / 46 : Matrice des 16 Facteurs de Risque & Poids Réels
- **Section :** Moteurs d'Évaluation
- **Kicker :** Pondérations Officielles · CATEGORY_WEIGHTS
- **Timing :** `[Timing: 12:00 | Durée: 1 min]`
- **Volume :** 123 mots

### Paroles de l'Orateur :
> "Voici la matrice complète et authentique des 16 facteurs de risque configurés dans CATEGORY_WEIGHTS. La somme arithmétique de ces coefficients est rigoureusement égale à 1,000, soit 100 %, ce qui est validé par notre suite de tests unitaires. Les trois piliers prépondérants reflètent les vecteurs d'attaque majeurs constatés sur les portails publics : les vulnérabilités applicatives OWASP représentent 15 % du score, la sécurité du chiffrement SSL/TLS compte pour 12 %, et les en-têtes HTTP de protection pèsent pour 10 %. Suivent la sécurité réseau et le patching logiciel à hauteur de 8 % chacun. L'ensemble des autres contrôles (DNS, CSP, fuite d'information, sous-domaines, cyber-renseignement, fraîcheur technologique, cookies, e-mail et certificats) totalisent les 47 % restants, garantissant un équilibre parfait sans angle mort."

---

## Diapositive 15 / 46 : Formule de Notation, Grades & Étoiles ANCS
- **Section :** Moteurs d'Évaluation
- **Kicker :** Algorithme de Score · backend/app/scanners/score_engine.py
- **Timing :** `[Timing: 13:00 | Durée: 1 min]`
- **Volume :** 141 mots

### Paroles de l'Orateur :
> "Cette diapositive formalise l'algorithme mathématique de calcul du score final. Chaque catégorie produit un score brut rapporté à son maximum pour donner une note normalisée sur 100. La note globale est ensuite obtenue par la moyenne pondérée de ces notes normalisées, divisée par la somme des poids des catégories ayant abouti. Cette formulation protège le site contre les défaillances de sondes extérieures : un module qui expire ne compte pas comme un zéro, mais est neutralisé. Le score obtenu sur 100 est ensuite transcrit selon une double grille : un grade alphabétique de A+ à F inspiré des standards internationaux, et une distinction souveraine sous forme d'étoiles ANCS : 3 étoiles pour un score supérieur ou égal à 90, 2 étoiles entre 70 et 89, et 1 étoile en deçà de 70, traduisant une posture nécessitant un plan de remédiation d'urgence."

---

## Diapositive 16 / 46 : Alignement Référentiels : OWASP, NIST CSF & ISO 27002
- **Section :** Moteurs d'Évaluation
- **Kicker :** Traçabilité Normative Internationale
- **Timing :** `[Timing: 14:00 | Durée: 1 min]`
- **Volume :** 116 mots

### Paroles de l'Orateur :
> "Pour qu'un score de cybersécurité soit opposable aux auditeurs d'État et aux décideurs ministériels, chaque vulnérabilité détectée par notre système fait l'objet d'une triple corrélation normative avec les standards mondiaux de sécurité. Prenons un exemple récurrent sur nos sites étatiques : l'absence de l'en-tête HTTP Strict-Transport-Security (HSTS). CyberScore TN ne se contente pas de signaler une ligne manquante : notre moteur le rattache immédiatement à la catégorie OWASP Top 10 A05:2021 (Security Misconfiguration), au contrôle NIST CSF PR.DS-2 (Protection des données en transit), et à la mesure ISO/IEC 27002:2022 contrôle A.8.24 (Utilisation de la cryptographie). Cette taxonomie rigoureuse permet de convertir automatiquement un constat technique en rapport d'audit de conformité réglementaire exploitable par les auditeurs ANCS."

---

## Diapositive 17 / 46 : Audit Actif : Mandat ANCS & Règles d'Engagement (RoE)
- **Section :** Audit Actif Autonome
- **Kicker :** Gouvernance & Habilitation · Chemin C
- **Timing :** `[Timing: 15:00 | Durée: 1 min]`
- **Volume :** 126 mots

### Paroles de l'Orateur :
> "Nous abordons maintenant le volet le plus novateur et exigeant du projet : l'audit autonome actif par sonde multi-agents. S'agissant d'investigations actives sur des machines réelles, la gouvernance de sécurité doit être irréprochable. Aucun test actif ne peut être amorcé sans respecter une triple barrière d'autorisation. Premièrement, l'auditeur doit saisir un code de mandat officiel émis par l'ANCS (par exemple ANCS-2026-001). Ce code est vérifié par notre routeur d'API contre une liste d'autorisation stricte qui contrôle la correspondance exacte avec le domaine cible. Deuxièmement, l'officier doit signer numériquement les Règles d'Engagement (RoE) formalisant le créneau horaire, les adresses IP d'origine et l'engagement formel de non-altération des bases de données. Troisièmement, un contrôle anti-SSRF bloque automatiquement toute tentative de cibler une adresse IP privée du réseau d'administration."

---

## Diapositive 18 / 46 : Architecture de la Sonde Autonome Multi-Agents
- **Section :** Audit Actif Autonome
- **Kicker :** Orchestration Multi-Agents · probe_architecture.png
- **Timing :** `[Timing: 16:00 | Durée: 1 min]`
- **Volume :** 124 mots

### Paroles de l'Orateur :
> "Cette diapositive présente l'architecture globale de notre sonde autonome, documentée dans le schéma probe_architecture.png. La sonde fonctionne comme un sous-processus Python isolé recevant la cible validée. Elle instancie quatre agents spécialisés exécutés de manière séquentielle, chacun recevant et enrichissant un objet partagé unique appelé AuditState. L'Agent 1 effectue la reconnaissance active de surface : détection de ports, bannières et signatures d'obsolescence. L'Agent 2 prend le relais pour corréler ces découvertes avec des hypothèses de vulnérabilités, en sollicitant l'accélérateur local Ollama. L'Agent 3 intervient alors pour filtrer ces hypothèses par des tests de preuve dynamiques non destructifs, éliminant impitoyablement tout faux positif. Enfin, l'Agent 4 calcule la note finale par déductions, génère le plan de remédiation technique et scelle le rapport par une empreinte SHA-256."

---

## Diapositive 19 / 46 : Pipeline Multi-Agents & Objet Pivot AuditState
- **Section :** Audit Actif Autonome
- **Kicker :** État Partagé & Modèle de Données · probe_agent/models.py
- **Timing :** `[Timing: 17:00 | Durée: 1 min]`
- **Volume :** 118 mots

### Paroles de l'Orateur :
> "Pour garantir la cohérence des échanges entre agents sans dépendre de structures de données volatiles, notre architecture repose sur un objet pivot unique et fortement typé : la dataclass AuditState définie dans models.py. Composé de 27 champs structurés, AuditState encapsule l'intégralité du cycle de vie de l'audit. Il contient l'identifiant unique de scan, la cible, les horodatages UTC, l'adresse IP résolue, la liste des objets PortFinding retournés par l'Agent 1, les hypothèses de l'Agent 2 dans potential_vulnerabilities, les failles confirmées par l'Agent 3 dans validated_vulnerabilities, et enfin la note finale, les étapes de remédiation et l'empreinte SHA-256 générées par l'Agent 4. Cette conception assure une traçabilité totale et permet de sérialiser l'audit sous forme de rapport JSON exhaustif."

---

## Diapositive 20 / 46 : Outils de Reconnaissance : Connect Scan, Bannières & EOL
- **Section :** Audit Actif Autonome
- **Kicker :** Agent 1 · Reconnaissance Active Réseau
- **Timing :** `[Timing: 18:00 | Durée: 1 min]`
- **Volume :** 124 mots

### Paroles de l'Orateur :
> "L'Agent 1 pose les fondations de l'audit actif en établissant la cartographie factuelle de la cible. Il mobilise trois outils spécialisés développés en interne. Premièrement, le scanneur de ports (`port_scanner.py`) réalise un TCP connect scan multi-threadé. Pour éviter tout déni de service et préserver la bande passante des liaisons étatiques, le parallélisme est plafonné à 40 threads ouvriers. Il interroge une table de 33 services connus (SSH, HTTP, bases de données, services d'administration distante). Deuxièmement, il analyse les en-têtes et le TTL pour déduire la famille du système d'exploitation sous-jacent. Troisièmement, le module d'obsolescence (`obsolescence_checker.py`) confronte les versions logicielles extraites à une base de 8 motifs d'obsolescence, identifiant immédiatement les versions en fin de vie (EOL) telles que PHP 7.x ou Apache 2.4 vulnérable."

---

## Diapositive 21 / 46 : La Règle Zéro Faux Positif & Vérification de Preuve
- **Section :** Audit Actif Autonome
- **Kicker :** Agent 3 · poc_verifier.py & Élimination des Hallucinations
- **Timing :** `[Timing: 19:00 | Durée: 1 min]`
- **Volume :** 159 mots

### Paroles de l'Orateur :
> "La prolifération des faux positifs est le fléau des outils d'audit automatisés : submergés de fausses alertes, les analystes de sécurité finissent par ignorer les vrais dangers. Pour résoudre ce défi, l'Agent 3 applique notre règle de conception 'Zéro Faux Positif'. Il sépare rigoureusement les faits des hypothèses : les constatations factuelles de l'Agent 1 (ports ouverts, absence d'en-tête, versions obsolètes) sont admises car mesurées. En revanche, les hypothèses spéculatives de failles web émises par l'IA de l'Agent 2 sont soumises à un banc de test dynamique non destructif. Le vérificateur `PoCVerifier` envoie une sonde d'injection bénigne : si aucune erreur SQL n'est divulguée et si aucun paramètre XSS n'est reflété sans échappement, l'hypothèse est purement et simplement jetée à la corbeille. Mentionnons avec transparence la limite de cette approche : le test de fichiers sensibles accepte tout code HTTP 200 supérieur à 10 octets, ce qui peut admettre un faux positif en présence de pages d'erreur personnalisées soft-404."

---

## Diapositive 22 / 46 : Remédiation, Score Déductif & Scellement SHA-256
- **Section :** Audit Actif Autonome
- **Kicker :** Agent 4 · remediation_agent.py & models.py
- **Timing :** `[Timing: 20:00 | Durée: 1 min]`
- **Volume :** 127 mots

### Paroles de l'Orateur :
> "L'Agent 4 clôture le pipeline d'audit actif en assurant la synthèse opérationnelle et l'intégrité du rapport. Il applique un système de notation par déduction directe à partir d'un capital initial de 100 points, borné entre 10 et 100 : chaque vulnérabilité critique validée par preuve retranche 22 points, une faille haute 12 points, une moyenne 6 points et une faible 2 points. Le grade officiel en découle : A dès 85, B dès 70, C dès 55, D dès 40 et F en deçà. Parallèlement, l'Agent 4 génère la feuille de route technique détaillant les commandes bash exactes à exécuter. Enfin, la méthode compute_sha256() calcule l'empreinte cryptographique des résultats validés. Précisons formellement qu'il s'agit d'un condensat (digest) garantissant l'intégrité des données, et non d'une signature numérique asymétrique."

---

## Diapositive 23 / 46 : IA Souveraine Découplée : « Le LLM propose, la preuve dispose »
- **Section :** Audit Actif Autonome
- **Kicker :** Intelligence Artificielle Souveraine · probe_agent/ai_client.py
- **Timing :** `[Timing: 21:00 | Durée: 1 min]`
- **Volume :** 133 mots

### Paroles de l'Orateur :
> "Pour clore l'étude de nos moteurs, abordons la doctrine d'intégration de l'intelligence artificielle dans CyberScore TN. Nous résumons notre philosophie par une maxime stricte : 'Le LLM propose, la preuve dispose'. L'IA n'est jamais laissée en roue libre sur des infrastructures étatiques : le modèle Qwen2.5-Coder:7b s'exécute localement sous Ollama, avec une température verrouillée à 0.1 pour éliminer toute créativité indésirable, un format de sortie contraint en JSON strict, et une taille de contexte bornée à 2048 tokens. Plus fondamental encore : le LLM ne décide jamais du score et ne peut valider lui-même une faille. Il formule des hypothèses d'investigation et propose des scripts de correction. Et en cas d'indisponibilité du serveur Ollama, la plateforme commute instantanément sur un moteur de règles déterministe d'audit, garantissant la continuité de service en toute circonstance."

---

## Diapositive 24 / 46 : Command Center & Vue d'Ensemble SOC
- **Section :** Plateforme SOC
- **Kicker :** Interface Opérationnelle · Command Center
- **Timing :** `[Timing: 22:00 | Durée: 1 min]`
- **Volume :** 111 mots

### Paroles de l'Orateur :
> "Nous entrons dans la présentation du produit CyberScore TN avec le Command Center du SOC. Conçue pour des analystes de cyberdéfense et des officiers de sécurité ministériels, l'interface adopte une ergonomie sombre haute densité permettant de visualiser instantanément l'état de santé du cyberespace gouvernemental. L'écran synthétise l'indice cyber national global (57,6/100), la répartition des 121 entités auditées, le flux des alertes récentes et la distribution par niveau de criticité. Pour accélérer les investigations opérationnelles en conditions de crise, le système intègre une Command Palette accessible par le raccourci Clavier Ctrl+K, permettant une recherche instantanée par nom d'organisme, adresse IP ou nom de domaine, et un saut direct vers le scanner d'audit."

---

## Diapositive 25 / 46 : Cartographie des 121 Entités Publiques par Secteur
- **Section :** Plateforme SOC
- **Kicker :** Cartographie Sectorielle · Source real-scans.json + tunisia_organizations.json
- **Timing :** `[Timing: 23:00 | Durée: 1 min]`
- **Volume :** 110 mots

### Paroles de l'Orateur :
> "L'analyse globale prend tout son sens lorsqu'elle est ventilée par secteur institutionnel. En croisant nos 121 scans réels avec la nomenclature administrative officielle, nous obtenons une distribution sectorielle exhaustive. Le secteur des Ministères regroupe 45 entités avec un score moyen de 59,3 sur 100. Les Collectivités Locales, qui rassemblent 42 municipalités et gouvernorats, affichent le score moyen le plus faible à 51,9 sur 100, reflétant une pénurie critique de compétences et de ressources dédiées à la cyber-hygiène de base. Les Institutions Publiques et les Entreprises Publiques stratégiques (comme la STEG ou la SONEDE) comptent chacune 17 entités et atteignent les moyennes les plus honorables, respectivement 62,8 et 62,1 sur 100."

---

## Diapositive 26 / 46 : Surveillance des Menaces & Flux d'Attaque
- **Section :** Plateforme SOC
- **Kicker :** Visualisation de Surface · threats.png
- **Timing :** `[Timing: 24:00 | Durée: 1 min]`
- **Volume :** 109 mots

### Paroles de l'Orateur :
> "L'écran de cyber-surveillance fournit une vue dynamique des vecteurs de menace pesant sur le territoire numérique tunisien. Il modélise les attaques par déni de service, le scan agressif de vulnérabilités et les tentatives de force brute sur les services exposés. Dans notre démarche de rigueur scientifique avec le jury, nous précisons explicitement que les flux géographiques visualisés constituent une animation illustrative de simulation ergonomique, calibrée sur les tendances réelles de cyber-menaces recensées par l'ANCS. Cette vue permet aux opérateurs de SOC de matérialiser la provenance des sondages malveillants et d'identifier en un coup d'œil les blocs d'adresses IP réputés hostiles nécessitant un blocage sur les pare-feux frontaliers de l'ATI."

---

## Diapositive 27 / 46 : Moteur Prédictif à +30 Jours : Heuristique d'Évolution
- **Section :** Plateforme SOC
- **Kicker :** Moteur Prédictif · predictions.png
- **Timing :** `[Timing: 25:00 | Durée: 1 min]`
- **Volume :** 107 mots

### Paroles de l'Orateur :
> "CyberScore TN ne se contente pas de constater les failles actuelles : il anticipe leur évolution grâce à son module prédictif. Comme exposé précédemment, nous qualifions honnêtement ce modèle de 'modèle heuristique à +30 jours'. Il analyse l'historique des scans passés, la vélocité observée de déploiement des correctifs dans l'organisation et l'apparition de nouvelles CVE ciblant les technologies identifiées. Sur cette base, l'algorithme extrapole une trajectoire de score prévisionnelle à 30 jours avec un intervalle de confiance. Cette projection permet au RSSI d'anticiper les dégradations de note avant qu'elles ne surviennent et de justifier auprès de sa hiérarchie l'urgence d'allouer les ressources d'ingénierie nécessaires à la remédiation."

---

## Diapositive 28 / 46 : Livrable d'État : Rapport Officiel Vectoriel PDF 7 Pages
- **Section :** Plateforme SOC
- **Kicker :** Livrable Réglementaire · frontend/components/report/
- **Timing :** `[Timing: 26:00 | Durée: 1 min]`
- **Volume :** 134 mots

### Paroles de l'Orateur :
> "L'aboutissement opérationnel d'un audit de cybersécurité réside dans la clarté et l'exploitabilité de son livrable. CyberScore TN intègre un générateur de rapports vectoriels haute définition de 7 pages, développé en TypeScript avec React-PDF. Sa structure obéit scrupuleusement aux standards des chancelleries et des corps de contrôle de l'État : la Page 1 est la couverture officielle aux armoiries républicaines ; la Page 2 fournit le résumé exécutif pour le ministre ; la Page 3 détaille l'analyse des 16 piliers ; la Page 4 dresse la matrice exhaustive des vulnérabilités classées par sévérité ; la Page 5 contient la feuille de route de remédiation prête à l'emploi avec commandes bash ; la Page 6 positionne l'entité par rapport au benchmark sectoriel national ; et la Page 7 délivre l'attestation finale scellée par l'empreinte cryptographique SHA-256."

---

## Diapositive 29 / 46 : Portail Public de Vérification par QR Code
- **Section :** Plateforme SOC
- **Kicker :** Transparence Publique · /verify/[domain]
- **Timing :** `[Timing: 27:00 | Durée: 1 min]`
- **Volume :** 109 mots

### Paroles de l'Orateur :
> "La confiance numérique ne doit pas rester confinée aux salles de serveurs : elle doit être vérifiable par chaque citoyen. Chaque attestation générée par CyberScore TN comporte un QR code sécurisé renvoyant vers le portail public de vérification `/verify/[domain]`. En scannant ce code avec un simple smartphone, l'usager accède à une page officielle attestant de l'authenticité de l'audit. Le portail affiche le score certifié, le grade attribué par l'ANCS, la validité de l'empreinte SHA-256 et la confirmation d'hébergement souverain. De plus, le portail intègre un volet pédagogique interactif dispensant des conseils de cyber-hygiène pour sensibiliser les citoyens contre le phishing et l'usurpation d'identité sur les services publics en ligne."

---

## Diapositive 30 / 46 : Modèle de Menace du QR Code & Contrôle Souverain
- **Section :** Plateforme SOC
- **Kicker :** Sécurité du Vecteur QR · Modèle de Menace
- **Timing :** `[Timing: 28:00 | Durée: 1 min]`
- **Volume :** 138 mots

### Paroles de l'Orateur :
> "L'usage d'un QR code pour certifier la sécurité d'un site soulève une question légitime du jury : qu'est-ce qui empêche un attaquant de coller un faux QR code menant vers un faux portail de vérification ? Cette diapositive détaille notre modèle de menace. Sur le plan juridique, seul le sous-domaine `.gov.tn` est strictement réservé aux institutions de la République par décret. Techniquement, le portail effectue un contrôle d'autorité : l'adresse de vérification doit obligatoirement résider sous le domaine officiel de l'ANCS. Concernant l'hébergement, notre code source implémente un test de préfixe IP vérifiant l'appartenance aux blocs souverains de l'ATI. Si un site public est hébergé à l'étranger, le système ne disqualifie pas arbitrairement le site à zéro mais applique une déduction de 12 points sur le pilier réseau, matérialisant le risque de souveraineté tout en restant scientifiquement juste."

---

## Diapositive 31 / 46 : Badges de Confiance & Gouvernance RBAC
- **Section :** Plateforme SOC
- **Kicker :** Badges Web & Contrôle d'Accès · admin.png & badges.png
- **Timing :** `[Timing: 29:00 | Durée: 1 min]`
- **Volume :** 134 mots

### Paroles de l'Orateur :
> "Pour clore le volet produit, nous abordons la valorisation publique par les badges de confiance et la gouvernance interne. CyberScore TN met à disposition des ministères des badges SVG dynamiques intégrables en pied de page de leurs portails officiels. Ces badges reflètent en temps réel le grade attribué (A+, A ou B) et s'actualisent automatiquement à chaque cycle d'audit, incitant les équipes techniques à maintenir un niveau de cyber-hygiène exemplaire. Côté administration, la console RBAC sépare rigoureusement les profils : l'observateur public consulte les scores en lecture seule ; l'auditeur ministériel pilote le périmètre de son ministère ; et le super-administrateur ANCS supervise la politique nationale, édite le niveau de criticité des entités de 1 à 5 et dispose d'un kill-switch permettant de suspendre immédiatement un audit en cas d'incident opérationnel sur une cible."

---

## Diapositive 32 / 46 : Résultats Globaux de la Campagne Nationale d'Audit
- **Section :** Validation & Résultats
- **Kicker :** Campagne Expérimentale · 121 Domaines Publics
- **Timing :** `[Timing: 30:00 | Durée: 1 min]`
- **Volume :** 133 mots

### Paroles de l'Orateur :
> "Cette diapositive consolide le bilan chiffré de notre campagne d'audit national sur les 121 domaines publics tunisiens. La distribution des grades met en lumière l'ampleur du chantier de cyber-sécurisation : seuls deux sites sur 121 atteignent le Grade A (plus de 90 points), tandis que 7 sites se situent en catégorie B. À l'autre extrémité du spectre, 54 sites (près de 45 % du parc) sont relégués en Grade D et 26 sites en Grade F critique. Parmi les défaillances récurrentes les plus alarmantes, citons l'absence quasi-généralisée de politique de sécurité de contenu (CSP) sur plus de 80 % des portails, l'omission fréquente de l'en-tête HSTS, et l'exposition directe de sous-domaines de test non sécurisés. Ce diagnostic objectif fournit à l'ANCS la première base factuelle quantifiée pour prioriser ses actions de remédiation ministérielle."

---

## Diapositive 33 / 46 : Banc d'Essai & Validation des Tests Unitaires
- **Section :** Validation & Résultats
- **Kicker :** Rigueur Logicielle · Commande pytest --cov
- **Timing :** `[Timing: 31:00 | Durée: 1 min]`
- **Volume :** 133 mots

### Paroles de l'Orateur :
> "Pour garantir la fiabilité de nos algorithmes, nous avons soumis notre socle à une campagne de tests unitaires rigoureuse avec pytest. Comme l'exige la Règle Zéro, nous présentons ici les résultats authentiques mesurés lors de l'exécution en direct, en rompant avec toute affirmation non vérifiée. Les 17 tests unitaires de notre suite s'exécutent avec un taux de succès de 100 % en 0,10 seconde. L'analyse de couverture par `pytest-cov` confirme une couverture exemplaire de 100 % sur le moteur de score (`score_engine.py`), de 98 % sur les abstractions de scanners (`base.py`), de 99 % sur les modèles de sonde et de 82 % sur la logique de validation PoC. À l'échelle des 3 205 lignes de l'ensemble de l'application, la couverture globale s'établit à 6 %, ciblant délibérément le cœur de calcul algorithmique."

---

## Diapositive 34 / 46 : Tests de Résilience & Limites Techniques Identifiées
- **Section :** Validation & Résultats
- **Kicker :** Transparence Académique · Résilience & Limites
- **Timing :** `[Timing: 32:00 | Durée: 1 min]`
- **Volume :** 141 mots

### Paroles de l'Orateur :
> "Une démarche d'ingénieur digne de ce nom doit exposer avec la même rigueur les réussites et les limites de son travail. Nos tests de résilience ont éprouvé la robustesse du système face à des pannes réelles. Le découplage par timeout protège l'orchestrateur contre les serveurs cibles bloqués ou excessivement lents. En cas de panne du service d'IA local Ollama, le basculement automatique sur le moteur déterministe garantit que l'audit produit toujours un rapport conforme. En toute transparence avec le jury, nous soulignons trois limites actuelles : la sensibilité du vérificateur de fichiers exposés aux erreurs personnalisées soft-404 ; le fait que le contrôle de l'hébergement souverain repose sur un test de préfixe IP et non un lookup BGP ASN en direct ; et l'absence d'authentification par session sur l'endpoint /api/scan, que nous avons documentée comme une limitation de prototype de recherche."

---

## Diapositive 35 / 46 : Démonstration Opérationnelle de la Plateforme en Direct
- **Section :** Démonstration Live
- **Kicker :** Mise en Situation Réelle · 7 Minutes Allouées
- **Timing :** `[Timing: 33:00 | Durée: 7 min]`
- **Volume :** 139 mots

### Paroles de l'Orateur :
> "Monsieur le Président, mesdames et messieurs les membres du jury, nous passons maintenant à la phase la plus concrète de cette soutenance : la démonstration opérationnelle en direct de CyberScore TN. Pendant sept minutes, nous allons dérouler un scénario de bout en bout en conditions réelles d'exploitation. Nous commencerons par démontrer le cloisonnement de la gouvernance : tentative d'accès non autorisé et déclenchement de l'écran 403. Nous nous connecterons ensuite avec les privilèges d'officier de sécurité ANCS pour lancer un audit passif en mode Standard sur le portail d'un ministère. Puis, nous engagerons la sonde autonome multi-agents sous mandat officiel sur notre cible de laboratoire, pour observer en temps réel la neutralisation d'une fausse alerte par l'Agent 3 et le scellement SHA-256 par l'Agent 4. Enfin, nous téléchargerons l'attestation PDF vectorielle et la vérifierons publiquement via le portail citoyen."

---

## Diapositive 36 / 46 : Bilan des Réalisations : Une Solution Souveraine Éprouvée
- **Section :** Conclusion & Bilan
- **Kicker :** Bilan de Fin d'Études · Synthèse Opérationnelle
- **Timing :** `[Timing: 40:00 | Durée: 1 min]`
- **Volume :** 113 mots

### Paroles de l'Orateur :
> "Au terme de ce projet de fin d'études, nous avons mené à bien l'ensemble des objectifs fixés en partenariat avec l'ANCS. CyberScore TN n'est plus un concept de laboratoire mais une plateforme opérationnelle complète, capable d'auditer de manière autonome la surface d'attaque externe de la République Tunisienne. Nous avons conçu et validé un orchestrateur passif à 16 facteurs, une sonde active multi-agents dotée d'une règle stricte anti-faux positifs, et une architecture souveraine découplée associant inférence locale d'IA et scellement d'intégrité par empreinte SHA-256. La campagne menée sur 121 sites gouvernementaux fournit le premier baromètre étatique quantifié de la posture cyber nationale, démontrant la faisabilité d'une alternative 100 % souveraine aux solutions propriétaires étrangères."

---

## Diapositive 37 / 46 : Limites Identifiées & Perspectives d'Évolution
- **Section :** Conclusion & Bilan
- **Kicker :** Feuille de Route Post-Soutenance · Horizons R&D
- **Timing :** `[Timing: 41:00 | Durée: 1 min]`
- **Volume :** 128 mots

### Paroles de l'Orateur :
> "Pour guider l'industrialisation future de la plateforme au sein du SOC de l'ANCS, nous avons identifié quatre axes de perfectionnement majeurs. Le premier axe concerne la cryptographie : faire évoluer le scellement SHA-256 actuel vers une véritable signature numérique asymétrique Ed25519 adossée à un module de sécurité matériel (HSM) ou à un certificat délivré par l'autorité racine TunTrust. Le deuxième axe vise l'infrastructure réseau : remplacer le filtrage par préfixe IP par une interrogation dynamique des tables BGP ASN auprès d'AFRINIC. Le troisième axe concerne la gouvernance : implémenter un journal d'audit serveur infalsifiable en écriture seule (WORM) et des sessions par cookies HttpOnly durcis. Enfin, le quatrième axe permettra le passage à l'échelle via Celery et Redis pour auditer l'ensemble des 2 000 opérateurs d'importance vitale tunisiens."

---

## Diapositive 38 / 46 : Remerciements & Ouverture de la Session de Questions
- **Section :** Conclusion & Bilan
- **Kicker :** Clôture de la Soutenance · Échanges avec le Jury
- **Timing :** `[Timing: 42:00 | Durée: 1 min]`
- **Volume :** 105 mots

### Paroles de l'Orateur :
> "Monsieur le Président, mesdames et messieurs les membres du jury, chers enseignants, je tiens à vous exprimer ma plus sincère gratitude pour votre attention bienveillante tout au long de cet exposé. Mes remerciements les plus chaleureux s'adressent à mon encadrant académique à TEK-UP pour son suivi méthodologique constant, ainsi qu'à mon tuteur à l'ANCS pour ses précieux éclairages opérationnels sur les impératifs de sécurité des infrastructures de notre pays. Ce projet a été pour moi une aventure d'ingénierie passionnante, associant rigueur cryptographique, génie logiciel et conscience des enjeux de souveraineté nationale. Je me tiens désormais à votre entière disposition pour répondre à toutes vos questions."

---

## Diapositive 39 / 46 : Annexe : Table Complète des 16 Poids & Règles
- **Section :** Annexe Technique
- **Kicker :** Backup 01 · Spécification Algorithmique
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 100 mots

### Paroles de l'Orateur :
> "Cette diapositive de réserve fournit la table exhaustive des 16 catégories d'évaluation configurées dans le fichier base.py. Chaque catégorie est associée à son poids relatif, son score maximum attribué, son identifiant système et son intitule officiel. Le jury peut constater la rigueur arithmétique de la normalisation : les catégories critiques comme OWASP (15 points), SSL (12 points) et Headers (10 points) constituent le socle de sécurité fondamental. Les déductions sont calculées par sévérité de constatation (−3, −2, −1, −0.5) sans jamais descendre sous zéro. La somme exacte de l'ensemble des poids est garantie égale à 1,000 par test unitaire automatique."

---

## Diapositive 40 / 46 : Annexe : Structure JSON du Finding & Schéma
- **Section :** Annexe Technique
- **Kicker :** Backup 02 · Sérialisation & Interopérabilité
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 96 mots

### Paroles de l'Orateur :
> "Cette diapositive présente la sérialisation standardisée d'une vulnérabilité sous forme d'objet JSON. Chaque anomalie constatée produit un enregistrement structuré respectant ce schéma rigoureux. L'analyste du SOC ou le système SIEM y retrouve le titre trilingue, le niveau de criticité normalisé, le score CVSS v3.1 quantifié, la preuve brute capturée lors de la mesure réseau, la commande de remédiation technique, et les trois identifiants de référence aux normes mondiales : OWASP, NIST CSF et ISO/IEC 27002. Cette interopérabilité native permet d'exporter directement les alertes vers des plateformes de gestion d'incidents (SOAR/SIEM) telles que Wazuh, TheHive ou Elasticsearch."

---

## Diapositive 41 / 46 : Annexe : Catalogue des Endpoints API REST (FastAPI)
- **Section :** Annexe Technique
- **Kicker :** Backup 03 · Interface de Programmation
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 100 mots

### Paroles de l'Orateur :
> "L'architecture de CyberScore TN expose une API REST complète développée avec FastAPI en Python 3.12. Cette diapositive recense les principaux points d'accès disponibles pour les clients web et les sondes automatisées. Le groupe d'authentification gère l'inscription, la connexion JWT et la restitution du profil utilisateur. Le groupe de scan permet d'initier des audits passifs synchrones ou asynchrones et d'interroger la progression par tâche Celery. Le groupe des organisations fournit les données sectorielles des 121 entités publiques et permet aux administrateurs de moduler les niveaux de criticité. Enfin, le groupe IA encapsule les requêtes sécurisées vers le modèle souverain local Qwen2.5-Coder."

---

## Diapositive 42 / 46 : Annexe : Modèles Relationnels PostgreSQL (18 Tables)
- **Section :** Annexe Technique
- **Kicker :** Backup 04 · Persistance & Modélisation
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 104 mots

### Paroles de l'Orateur :
> "Pour répondre précisément aux questions sur la persistance, le schéma de données PostgreSQL 16 est articulé autour de 18 modèles SQLAlchemy distincts, situés dans backend/app/models/. La table `organizations` structure les ministères, collectivités et agences avec leur secteur d'appartenance et leur criticité. La table `scans` consigne chaque session d'audit, reliée à `scan_results` pour le détail des catégories et `findings` pour les vulnérabilités individuelles. Les tables `scores` et `predictions` gèrent les séries temporelles et les extrapolations à 30 jours. Les modèles `badges`, `threat_intel`, `supply_chain` et `subdomains` stockent les informations de surface d'attaque étendue. Enfin, `users` et `ai_chat_history` assurent la traçabilité des accès et des interactions d'assistance."

---

## Diapositive 43 / 46 : Annexe : Critères d'Attribution des Badges de Sécurité
- **Section :** Annexe Technique
- **Kicker :** Backup 05 · Confiance Numérique & Badges
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 116 mots

### Paroles de l'Orateur :
> "Cette diapositive détaille les règles algorithmiques régissant l'attribution des badges de confiance CyberScore TN. Le badge de confiance n'est pas une simple image statique mais un composant SVG interactif signé. Pour obtenir le Badge Or d'Excellence Républicaine (Grade A+), un portail doit cumuler un score supérieur ou égal à 95/100, une conformité stricte sur le chiffrement TLS et le DNSSEC, et zéro vulnérabilité de criticité critique ou haute. Le Badge Argent (Grade A) exige au moins 90/100 et l'absence de faille critique. Le Badge Bronze (Grade B) requiert un score minimal de 80/100. En deçà de 80 points (Grades C, D et F), aucun badge de confiance ne peut être délivré, stimulant l'émulation technique des équipes."

---

## Diapositive 44 / 46 : Annexe : Méthodologie du Benchmark International
- **Section :** Annexe Technique
- **Kicker :** Backup 06 · Étalonnage Comparatif
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 114 mots

### Paroles de l'Orateur :
> "Cette diapositive précise la méthodologie adoptée pour le benchmark international présenté sur la plateforme. Il est fondamental d'éviter toute ambiguïté devant le jury : CyberScore TN n'a pas procédé à l'audit réseau direct de serveurs étrangers, ce qui constituerait une action hors juridiction et contraire au mandat étatique. Les scores attribués aux pays de référence (France, Estonie, Maroc, Allemagne...) constituent une baseline illustrative calibrée sur des indices publics reconnus, principalement l'ITU Global Cybersecurity Index (GCI) publié par l'Union Internationale des Télécommunications, croisé avec les rapports du National Cyber Security Index (NCSI) de l'Académie de Gouvernance Numérique d'Estonie. Cette baseline sert d'étalon contextuel pour apprécier la marge de progression de la Tunisie à l'échelle régionale."

---

## Diapositive 45 / 46 : Annexe : Matrice Détaillée des 4 Secteurs Publics
- **Section :** Annexe Technique
- **Kicker :** Backup 07 · Ventilation Détaillée
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 111 mots

### Paroles de l'Orateur :
> "Cette diapositive de réserve présente la matrice détaillée des 4 secteurs d'État issus de tunisia_sectors.json, croisée avec les résultats de notre campagne sur 121 sites. Elle détaille le nombre d'organismes répertoriés, les exemples emblématiques et le niveau de criticité moyen. Le secteur 1 regroupe les ministères régaliens avec un niveau de criticité moyen de 4.1 sur 5. Le secteur 2 comprend les agences souveraines et régulateurs indépendants (criticité 4.4). Le secteur 3 couvre les collectivités locales et gouvernorats régionaux (criticité 3.5). Le secteur 4 concerne les entreprises publiques et opérateurs d'infrastructures d'énergie et d'eau (criticité 4.8). Cette segmentation permet à l'ANCS de ventiler ses alertes selon la valeur stratégique des cibles."

---

## Diapositive 46 / 46 : Annexe : Glossaire & Référentiels Normatifs
- **Section :** Annexe Technique
- **Kicker :** Backup 08 · Taxonomie & Référentiels
- **Timing :** `[Timing: Annexe | À la demande du jury]`
- **Volume :** 91 mots

### Paroles de l'Orateur :
> "Pour clore nos annexes de soutenance, cette diapositive récapitule les principaux sigles, notions cryptographiques et cadres réglementaires mobilisés tout au long de ce projet de fin d'études. Elle explicite les missions de l'Agence Nationale de la Cybersécurité (ANCS), les exigences de la norme internationale ISO/IEC 27002:2022, les fonctions du NIST Cybersecurity Framework 2.0, les catégories de vulnérabilités applicatives OWASP Top 10:2021, et les concepts de digest cryptographique SHA-256, d'Autonomous Penetration Testing et de règles d'engagement (RoE). Ce glossaire témoigne de la cohérence terminologique appliquée de bout en bout dans nos livrables."

---
