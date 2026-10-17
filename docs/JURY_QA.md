# CyberScore TN — Recueil des Questions & Réponses de Soutenance (JURY_QA.md)

Ce document rassemble **32 questions stratégiques et techniques** susceptibles d'être posées par le jury d'ingénieur (enseignants universitaires de TEK-UP et représentants officiels de l'ANCS). Chaque réponse est formulée avec rigueur, honnêteté intellectuelle et adéquation stricte avec le code source implémenté.

---

### Q1. Votre scan est-il réellement passif et inoffensif pour les cibles étatiques ?
**Réponse type (85 mots) :**
Oui pour les modes Quick et Standard. Ces modes n'effectuent que des requêtes DNS standard et des handshakes HTTPS publics identiques à ceux d'un navigateur web ordinaire, sans aucune injection ni énumération agressive. En revanche, le mode Deep mobilise des connecteurs vers des outils plus intrusifs comme ZAP ou Nmap. Enfin, le mode d'audit autonome multi-agents constitue un test d'intrusion actif simulé, qui requiert impérativement un mandat ANCS vérifié et l'acceptation expresse de Règles d'Engagement (RoE) avant tout lancement.

---

### Q2. Pourquoi existe-t-il trois moteurs d'évaluation différents dans votre plateforme ?
**Réponse type (90 mots) :**
Cette dualité répond à des contraintes opérationnelles distinctes. Le moteur principal Python à 16 facteurs évalue la posture globale passive en production avec une granularité fine. Le moteur TypeScript Next.js à 6 piliers sert de solution de secours (fallback) native haute disponibilité lorsque le backend Python est inaccessible. Enfin, la sonde autonome multi-agents utilise son propre barème par déductions directes (−22/−12/−6/−2) car elle ne note pas une surface théorique mais sanctionne exclusivement des vulnérabilités exploitables dynamiquement confirmées par preuve (PoC).

---

### Q3. L'empreinte SHA-256 apposée sur vos rapports constitue-t-elle une véritable signature électronique ?
**Réponse type (82 mots) :**
Non, et il convient d'être très rigoureux sur ce terme. Le scellement SHA-256 implémenté est un hachage cryptographique déterministe (un *digest*) qui garantit l'intégrité stricte des données d'audit contre toute altération post-génération. Cependant, il ne s'agit pas d'une signature numérique asymétrique au sens légal, car il ne repose pas sur une bi-clé privée/publique (comme RSA ou Ed25519) certifiée par l'ANCE/TunTrust. L'intégration d'un HSM ou d'une signature Ed25519 constitue précisément l'une de nos perspectives majeures d'industrialisation.

---

### Q4. Le modèle de langage (LLM local Ollama) a-t-il le pouvoir de modifier la note finale d'un site ?
**Réponse type (78 mots) :**
Absolument pas. Le score est calculé de manière 100 % déterministe et mathématique par le moteur de scoring ou par l'Agent 4, en appliquant des règles arithmétiques strictes aux constatations validées. Le rôle de l'IA souveraine se cantonne exclusivement à l'interprétation contextuelle des bannières techniques et à la rédaction de snippets de remédiation adaptés en français. En aucun cas le LLM ne peut ajuster un coefficient, déduire des points arbitrairement ou altérer la note attribuée.

---

### Q5. Comment pouvez-vous prétendre à une règle "Zéro Faux Positif" dans l'analyse de vulnérabilités ?
**Réponse type (95 mots) :**
Il s'agit d'une règle de conception architecturale appliquée par l'Agent 3 : toute hypothèse spéculative émise par le modèle d'IA qui ne peut être corroborée soit par une mesure réseau factuelle (port ouvert, absence d'en-tête, EOL), soit par un test dynamique non destructif (injection de test, réflexion XSS) est immédiatement rejetée. Toutefois, cette approche comporte une limite honnête : le test d'exposition de fichiers sensibles valide actuellement tout retour HTTP 200 de plus de 10 octets, ce qui peut admettre un faux positif en présence de pages d'erreur personnalisées dites "soft-404".

---

### Q6. La vérification du mandat ANCS dans l'API est-elle réellement opérationnelle ?
**Réponse type (85 mots) :**
Elle était initialement prototypée par un simple contrôle de préfixe textuel (`ANCS-`). Nous l'avons durcie pour la soutenance : la route `/api/scan` valide désormais formellement le code d'autorisation contre une liste blanche de mandats configurée en variables d'environnement (`ANCS_MANDATES`), en vérifiant que le domaine ciblé fait partie intégrante du périmètre d'habilitation attribué. Si le mandat est invalide ou ne couvre pas le domaine, la requête est rejetée avec un code HTTP 403 Forbidden.

---

### Q7. Un utilisateur malveillant peut-il utiliser votre scanneur pour attaquer le réseau interne de l'administration ?
**Réponse type (90 mots) :**
Cette vulnérabilité de type SSRF (Server-Side Request Forgery) a été spécifiquement neutralisée. Avant toute émission de flux d'audit, la passerelle effectue une double résolution DNS de la cible et applique une validation stricte : toute adresse IP résolue appartenant aux plages privées RFC 1918 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), de bouclage (127.0.0.1) ou de lien local (169.254.0.0/16) est immédiatement bloquée avec une erreur 403. Le scanneur ne peut donc en aucun cas être détourné pour sonder la DMZ ou le réseau interne.

---

### Q8. Quel est l'impact des 45 % de sites étatiques injoignables sur la moyenne nationale calculée ?
**Réponse type (92 mots) :**
Sur nos 121 domaines audités, 55 se sont révélés hors ligne lors de la campagne. Dans le modèle actuel, un site injoignable n'est pas exclu mais reçoit une note plancher d'environ 42 à 49/100, ce qui tire mécaniquement la moyenne nationale globale vers le bas, à 57,6/100. En revanche, si l'on restreint l'analyse aux seuls 66 sites publics effectivement en ligne et fonctionnels, le score moyen national s'établit à 65,0/100. Cette distinction capitale doit toujours être présentée de manière transparente aux décideurs ministériels.

---

### Q9. Pourquoi ne pas avoir utilisé l'outil open-source sslyze pour tous vos contrôles SSL/TLS ?
**Réponse type (82 mots) :**
`sslyze` est un excellent outil spécialisé, mais il introduit des dépendances C lourdes, un temps d'exécution sensiblement plus long et des risques de blocage sur des environnements restreints. Pour notre orchestrateur principal, nous avons privilégié une inspection native via le module standard `ssl` de Python, optimisée en latence et sans dépendance externe. L'intégration de `sslyze` ou d'un wrapper OpenSSL complet reste toutefois prévue en mode Deep pour inspecter des éléments très pointus comme la révocation OCSP Stapling.

---

### Q10. Quelle est la vérité terrain (ground truth) permettant de calibrer la justesse de vos scores ?
**Réponse type (88 mots) :**
À ce stade du projet, la vérité terrain repose sur notre fichier de validation interne (`validation_results.json`) testé sur 3 sites de référence, complété par la conformité aux référentiels normatifs ANCS, ISO 27002 et OWASP. Nous reconnaissons qu'une corrélation statistique formelle à grande échelle avec des services tiers comme Mozilla HTTP Observatory ou SSL Labs constitue un travail futur indispensable pour étalonner mathématiquement nos pondérations et démontrer scientifiquement la validité prédictive du score sur un millier de domaines.

---

### Q11. Comment détectez-vous qu'un site est hébergé en Tunisie : préfixe IP ou routage BGP ASN ?
**Réponse type (86 mots) :**
Dans le code actuel, la vérification de l'hébergement souverain repose sur un filtrage rapide par préfixes d'adresses IP correspondant aux blocs historiquement attribués à l'Agence Tunisienne d'Internet (ATI AS2609), notamment les réseaux 193.95.0.0/18, 41.224.0.0/13 et 197.10.0.0/16. Bien qu'efficace pour un prototype, ce mécanisme n'interroge pas en temps réel les tables de routage BGP. L'interrogation dynamique d'une base Whois/BGP ASN via le serveur Whois d'AFRINIC fait partie de nos perspectives d'amélioration.

---

### Q12. Pourquoi votre modèle prédictif est-il qualifié d'heuristique et non de Deep Learning ?
**Réponse type (88 mots) :**
Parce qu'il convient de ne pas survendre l'intelligence artificielle là où réside une logique statistique déterministe. Notre moteur prédictif actuel calcule une projection à +30 jours à partir de la pente d'évolution des scores passés, de la cadence de correction des vulnérabilités et de coefficients sectoriels. Un réseau de neurones récurrents de type LSTM nécessiterait des séries temporelles d'audit s'étalant sur plusieurs années, données qui n'existent pas encore pour la Tunisie. Nous avons donc choisi l'efficacité et l'explicabilité d'un modèle heuristique.

---

### Q13. Pourquoi le journal d'audit est-il stocké côté client et non dans une base immuable serveur ?
**Réponse type (82 mots) :**
Dans la version actuelle du démonstrateur, le journal d'activité de l'auditeur est consigné localement dans le `localStorage` du navigateur via `auditLogger.ts` pour des raisons de fluidité de l'interface et de prototypage rapide. Nous avons pleinement conscience que cette conception ne garantit pas la non-répudiation face à un auditeur malveillant. En perspective d'industrialisation pour l'ANCS, ce journal doit être déporté vers un système de logs centralisé en écriture seule (WORM), sécurisé par chaîne de blocs ou HMAC serveur.

---

### Q14. Quelle est la base légale autorisant l'audit passif de sites gouvernementaux .gov.tn ?
**Réponse type (85 mots) :**
Le cadre d'action du projet s'inspire du Décret n° 2023-17 et des prérogatives légales de l'ANCS en matière de veille et de contrôle de la sécurité des systèmes d'information publics. Les scans passifs se limitent à l'analyse de signaux réseau librement émis sur Internet sans intrusion. Néanmoins, s'agissant d'un travail académique de fin d'études, tout déploiement institutionnel en production nécessitera une convention formelle avec l'ANCS pour définir précisément les conditions juridiques d'habilitation des opérateurs et de diffusion des données d'audit.

---

### Q15. Comment la plateforme passera-t-elle à l'échelle pour auditer plusieurs milliers de domaines ?
**Réponse type (89 mots) :**
L'architecture a été conçue dès l'origine pour le passage à l'échelle grâce au découpage micro-services. Les tâches d'audit sont asynchrones et peuvent être déléguées à une file de messages Celery adossée à Redis ou Valkey, permettant de distribuer les scans sur un parc de nœuds ouvriers (workers) conteneurisés. En calibrant la concurrence à 10 requêtes simultanées par domaine pour ne saturer aucun équipement réseau étatique, une grappe de 5 machines virtuelles pourrait aisément auditer l'intégralité du parc tunisien en moins de deux heures.

---

### Q16. Pourquoi votre scanner SSL ne vérifie-t-il pas la révocation OCSP ou CRL ?
**Réponse type (80 mots) :**
La vérification de révocation en temps réel via OCSP ou listes CRL engendre des délais de latence importants et des risques de blocage lorsque les serveurs des autorités de certification sont lents ou inaccessibles. Dans le cadre d'un scan rapide de 30 secondes, nous avons privilégié la vérification cryptographique des algorithmes, de la chaîne de confiance et de la date d'expiration. L'interrogation OCSP Stapling est réservée au mode Deep qui dispose d'une enveloppe temporelle de 10 minutes.

---

### Q17. Comment séparez-vous les rôles administratifs (RBAC) au niveau de l'API FastAPI ?
**Réponse type (85 mots) :**
Dans le code actuel, la séparation des rôles (Observateur, Auditeur Ministériel, Super-Admin ANCS) est principalement orchestrée côté client Next.js avec affichage d'un écran 403 en cas d'accès non autorisé. Au niveau du backend FastAPI, des décorateurs de dépendance (`Depends(get_current_user)`) valident le jeton JWT. Toutefois, l'application stricte des autorisations par domaine au niveau de chaque route de scan constitue un point de durcissement que nous avons documenté en perspective immédiate pour la mise en production.

---

### Q18. Pourquoi avoir retenu le modèle Qwen2.5-Coder plutôt qu'un modèle comme Llama 3 ou Mistral ?
**Réponse type (90 mots) :**
Qwen2.5-Coder dans sa déclinaison 7 milliards de paramètres offre un compromis exceptionnel pour notre cas d'usage. Il a été spécialement affiné sur la génération de code, la compréhension des syntaxes de configuration (Nginx, Apache, PHP) et le respect rigoureux des contraintes de sortie JSON. De plus, son empreinte mémoire de moins de 5 Go permet une inférence ultra-rapide sur un serveur standard sans nécessiter de coûteux clusters de GPU d'entreprise, garantissant une autonomie et une souveraineté technologique totale sur le sol tunisien.

---

### Q19. Quelles sont les limites de votre reconnaissance d'OS et de technologies web ?
**Réponse type (84 mots) :**
Notre système d'empreinte logicielle s'appuie sur l'analyse non intrusive des en-têtes HTTP (`Server`, `X-Powered-By`), des cookies caractéristiques et de la valeur TTL des paquets IP retournés. Sa limite majeure réside dans l'obfuscation : un administrateur averti qui supprime la bannière de son serveur Nginx ou modifie la valeur du TTL échappera à la détection passive. C'est pourquoi seule une corrélation multi-critères permet d'établir un indice de confiance sur la technologie détectée.

---

### Q20. Comment évitez-vous qu'un scan passif ne sature la bande passante d'un petit site communal ?
**Réponse type (82 mots) :**
La sonde applique un principe strict de modération du trafic réseau (rate limiting). Pour les modes Quick et Standard, le nombre total de requêtes HTTP émises vers une même cible ne dépasse jamais 15 à 20 requêtes, réparties sur un intervalle de plusieurs secondes avec des timeouts courts (10 à 20 secondes max). Cette charge est indiscernable de la visite normale d'un citoyen et ne peut en aucun cas provoquer d'effet de déni de service.

---

### Q21. Quelle est la différence entre une faille A01 et une faille A05 selon le référentiel OWASP 2021 ?
**Réponse type (80 mots) :**
A01 (Broken Access Control) concerne les défaillances de contrôle d'accès permettant à un utilisateur d'accéder à des ressources ou fonctionnalités non autorisées (ex: répertoire `.git` public ou URL d'administration sans session). A05 (Security Misconfiguration) désigne les mauvaises configurations de sécurité système ou logicielle, telles que l'absence d'en-têtes de protection HTTP, des messages d'erreur de base de données verbeux renvoyés au client, ou l'utilisation de comptes et mots de passe par défaut.

---

### Q22. Pourquoi les déductions par sévérité sont-elles de −3, −2, −1 et −0.5 points dans le moteur principal ?
**Réponse type (85 mots) :**
Ces déductions ont été calibrées mathématiquement pour refléter la criticité réelle sans provoquer l'effondrement disproportionné de la note sur une seule défaillance mineure. Avec un maximum de 10 à 15 points par catégorie, une anomalie critique (−3.0) ampute le score du pilier de 20 à 30 %, tandis qu'un défaut mineur (−0.5) applique une pénalité mesurée. Le score d'une catégorie est toujours borné à 0 via `max(0, max_score - deduction)`, évitant tout score négatif aberrant.

---

### Q23. Pourquoi avoir choisi Next.js 15 pour une application de cybersécurité ?
**Réponse type (85 mots) :**
Next.js 15 avec l'App Router permet une séparation nette entre le rendu côté serveur (Server Components) pour la sécurité des clés d'API et le rendu côté client pour la réactivité des tableaux de bord SOC. Il offre un support natif du routage trilingue (notamment l'inversion directionnelle RTL pour la langue arabe), une excellente performance de chargement sans latence d'affichage, et permet de générer des attestations de sécurité vectorielles côté serveur via React-PDF de manière totalement intégrée.

---

### Q24. En quoi votre architecture Tri-VM répond-elle aux exigences de sécurité d'un SOC étatique ?
**Réponse type (88 mots) :**
La topologie Tri-VM isole strictement les niveaux de confiance. La VM1 exposée en DMZ gère le frontend et Nginx sans accès direct aux bases de données. La VM2 héberge l'API FastAPI et la base de données PostgreSQL dans un réseau privé interne inaccessible depuis Internet. Enfin, la VM3 isole les processus d'inférence IA et les sondes d'audit actives. Ainsi, même en cas de compromission totale du frontal web, l'attaquant reste confiné en DMZ sans pouvoir altérer les rapports ou corrompre les modèles d'analyse.

---

### Q25. Quels sont les risques juridiques si votre sonde teste par erreur un domaine hors mandat ?
**Réponse type (84 mots) :**
Tout test d'intrusion non autorisé est susceptible de tomber sous le coup des dispositions du Code Pénal tunisien relatives à l'atteinte aux systèmes de traitement automatisé de données. C'est précisément pour cette raison que notre code source impose désormais la validation stricte du mandat ANCS et des Règles d'Engagement avant tout envoi de paquets actifs. Sans mandat valide couvrant explicitement le domaine ciblé, la sonde refuse catégoriquement d'initialiser ses modules d'attaque, protégeant l'auditeur et l'institution.

---

### Q26. Pourquoi la vérification DNSSEC est-elle essentielle pour les portails publics tunisiens ?
**Réponse type (85 mots) :**
DNSSEC assure l'authenticité et l'intégrité des réponses DNS grâce à des signatures cryptographiques, protégeant les usagers contre les attaques par empoisonnement de cache (DNS Cache Poisoning) et le détournement de trafic (Man-in-the-Middle). Pour un portail gouvernemental comme celui des impôts ou de la santé, l'absence de DNSSEC permet à un cybercriminel de rediriger les citoyens vers un faux site clone pour dérober leurs identifiants sans qu'aucune alerte de certificat ne s'affiche si l'attaquant maîtrise le résolveur.

---

### Q27. Comment gérez-vous le stockage des secrets et clés d'API dans la plateforme ?
**Réponse type (78 mots) :**
Aucun secret n'est écrit en dur dans le code source. Toutes les données sensibles (clé JWT, mots de passe PostgreSQL, clés API de Threat Intelligence) sont externalisées dans des fichiers d'environnement `.env` non versionnés sur Git et injectées sous forme de variables d'environnement au démarrage des conteneurs Docker. En environnement de production étatique, ces secrets ont vocation à être gérés par un coffre-fort d'entreprise de type HashiCorp Vault ou via les secrets Docker Swarm/Kubernetes.

---

### Q28. Quelle est la différence entre les formats de dates UTC et locaux dans vos rapports d'audit ?
**Réponse type (80 mots) :**
Pour des raisons de non-répudiation et de comparabilité internationale, tous les événements d'audit, démarrages de scan et générations d'empreintes SHA-256 sont horodatés en temps universel coordonné (UTC) au format ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`). Lors de la restitution sur le portail de vérification ou dans le rapport PDF, cet horodatage est converti dans le fuseau horaire officiel de la République Tunisienne (UTC+1, heure de Tunis) pour faciliter la lecture administrative.

---

### Q29. Pourquoi le Content Security Policy (CSP) est-il si mal noté sur la majorité des sites audités ?
**Réponse type (85 mots) :**
Nos scans révèlent que plus de 80 % des portails publics tunisiens n'implémentent aucun en-tête `Content-Security-Policy`. La mise en place d'un CSP strict exige un travail de refactorisation important pour éliminer les scripts en ligne (`inline scripts`) et inventorier tous les domaines de ressources autorisés. Faute de temps ou d'expertise dédiée lors du déploiement initial de leurs CMS (souvent WordPress ou Drupal), les administrateurs omettent cet en-tête capital, laissant leurs usagers exposés aux attaques XSS.

---

### Q30. Quelles garanties offrez-vous quant à la confidentialité des vulnérabilités découvertes ?
**Réponse type (88 mots) :**
Les résultats d'audit d'infrastructures étatiques constituent des informations sensibles relevant de la classification TLP:AMBER+STRICT. Dans notre plateforme, les données brutes sont conservées dans la base de données interne inaccessible depuis l'extérieur. Les rapports PDF générés ne sont délivrés qu'aux officiers de sécurité authentifiés disposant des droits sur le périmètre ministériel concerné. En outre, le traitement local par un LLM souverain garantit qu'aucune information de vulnérabilité ne transite par des serveurs cloud tiers étrangers (OpenAI, Microsoft ou Google).

---

### Q31. Comment assurez-vous l'accessibilité de la plateforme pour les utilisateurs non-techniciens ?
**Réponse type (82 mots) :**
CyberScore TN traduit la complexité technique en indicateurs visuels immédiatement intelligibles : un score global sur 100, une note sous forme de grade alphabétique (A+ à F) et un système d'étoiles de confiance inspiré des standards hôteliers. Pour la direction générale, un résumé exécutif synthétise les enjeux financiers et organisationnels. Pour les administrateurs système, une feuille de route technique fournit directement les commandes bash et les snippets de configuration à copier-coller pour corriger chaque défaillance.

---

### Q32. Quelles sont les trois priorités absolues pour l'avenir de CyberScore TN après votre PFA ?
**Réponse type (88 mots) :**
La première priorité est la signature cryptographique asymétrique des attestations via une clé privée ANCS et la vérification ASN temps réel. La deuxième est l'industrialisation de la file de distribution asynchrone Celery/Redis pour porter le périmètre national à plus de 2 000 domaines publics et OIV (Opérateurs d'Importance Vitale). La troisième est l'intégration d'un journal d'audit serveur append-only infalsifiable couplé à une authentification forte par carte d'identité électronique ou certificat professionnel TunTrust pour tous les officiers d'audit.

---

### Q33. Comment est orchestrée la progression visuelle des audits (passifs et actifs) sans tromper l'utilisateur ?
**Réponse type (95 mots) :**
Afin d'éviter l'écueil des barres de progression artificielles qui stagnent arbitrairement à 98 %, CyberScore TN adapte dynamiquement son pipeline d'affichage au profil d'audit sélectionné. Pour les scans passifs, un stepper multi-étapes dédié reflète la profondeur réelle : 2 phases pour le mode Quick (4 scanners), 3 phases pour le mode Standard (10 scanners) et 4 phases pour le mode Deep (16 scanners avec DAST et Nmap). Pour le scan actif autonome, le graphe séquentiel visualise en temps réel l'avancement des 4 agents IA (Recon, CVE, PoC et Remédiation). Chaque palier est assorti d'une sous-tâche validée, garantissant une télémétrie transparente et fidèle.

