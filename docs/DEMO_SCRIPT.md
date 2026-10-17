# CyberScore TN — Protocole et Script de Démonstration Live (7 Minutes)

Ce document détaille la procédure opérationnelle de démonstration en direct (7 minutes allouées lors de la soutenance), la check-list pré-vol (pre-flight checklist), le déroulé étape par étape et le plan de contingence en cas d'aléa réseau.

---

## 1. Check-list Pré-vol (À valider 15 minutes avant l'entrée du jury)

### A. Connectivité et Services Rapprochés (Tri-VM)
1. **VM 1 — Frontend & Passerelle Nginx (`192.168.98.10`)** :
   ```bash
   curl -I http://192.168.98.10:3000
   # Attendu : HTTP/1.1 200 OK
   ```
2. **VM 2 — Backend FastAPI (`192.168.98.20`)** :
   ```bash
   curl -s http://192.168.98.20:8000/api/v1/health | jq .
   # Attendu : {"status": "healthy", "database": "connected", "cache": "connected"}
   ```
3. **VM 3 / Hôte — Serveur d'Inférence IA Ollama (`192.168.98.1:25000`)** :
   ```bash
   curl -s http://192.168.98.1:25000/api/tags | jq .
   # Attendu : Présence du modèle "qwen2.5-coder:7b" ou "qwen3:8b"
   ```

### B. Environnement Navigateur et Affichage
- [ ] Résolution d'écran verrouillée en 1920×1080 (format natif des diapositives).
- [ ] Navigateur en mode kiosque / plein écran (touche `F11` ou bouton `Plein Écran`).
- [ ] Zoom navigateur calé exactement à 100 % (`Ctrl + 0`).
- [ ] Deux onglets prêts :
  - **Onglet 1 :** Présentation officielle (`file:///.../docs/presentation.html` ou serveur local).
  - **Onglet 2 :** CyberScore TN Command Center (`http://192.168.98.10:3000` ou `DEMO_URL`).
- [ ] Vidéo de secours vérifiée et prête en lecture locale : `docs/demo/backup.mp4`.
- [ ] Cache du navigateur vidé (`Ctrl + Shift + R`) pour garantir des transitions fluides.

---

## 2. Chronogramme Détaillé de la Démonstration (7 min / 420 secondes)

### Minute 0:00 – 1:00 : Cadrage et Accès Restreint (RBAC & Gouvernance)
* **Action à l'écran :**
  - Ouvrir l'application sur la page de connexion (`/login`).
  - Tenter d'accéder directement à l'espace `/admin` sous un profil d'observateur public.
  - Constater l'interception immédiate et l'affichage de l'écran `403 Accès Interdit`.
  - Se connecter avec le compte d'officier de sécurité ANCS (`auditeur.rh / mandat ANCS-2026`).
* **Paroles de l'orateur (45-60 mots) :**
  > "Monsieur le Président, pour cette démonstration, nous débutons par la gouvernance des accès. En tant qu'observateur non accrédité, l'accès aux fonctions d'administration ou au lancement d'audits intrusifs est strictement verrouillé par un écran 403. Dès l'authentification avec un mandat ANCS officiel, les privilèges d'audit souverain sont débloqués."

### Minute 1:00 – 2:30 : Lancement d'un Audit Passif Multi-Piliers
* **Action à l'écran :**
  - Utiliser la Command Palette (`Ctrl + K`) pour taper `finances.gov.tn`.
  - Sélectionner le mode **Standard (10 scanners en 2 phases)**.
  - Lancer l'analyse. Observer les jauges de progression en temps réel (Phase 1 : SSL, Headers, Cookie, CSP ; Phase 2 : DNS, Email, Tech, Cert).
  - Pointer le résultat global affiché : Score, Grade, ventilation par catégorie.
* **Paroles de l'orateur (70-80 mots) :**
  > "Nous lançons un audit passif sur le domaine du Ministère des Finances. En régie, le scanneur exécute les modules par phases ordonnées. En Phase 1, les sondes web et SSL inspectent le certificat et les en-têtes HTTP de manière concurrente. En Phase 2, l'infrastructure DNS et la sécurité de messagerie SPF/DMARC sont vérifiées. Le score est calculé instantanément par pondération des modules actifs, sans impacter la disponibilité de la cible étatique."

### Minute 2:30 – 4:30 : Démonstration du Mode Autonome Multi-Agents & Règle Anti-Faux Positifs
* **Action à l'écran :**
  - Basculer vers l'interface de scan actif autonome.
  - Saisir la cible du laboratoire de test (`lab.cyberscore.tn` ou cible contrôlée).
  - Afficher la modale d'autorisation : saisir le mandat `ANCS-2026-001` et signer numériquement les Règles d'Engagement (RoE).
  - Lancer la sonde Python.
  - Mettre en évidence les logs d'exécution des 4 agents :
    1. Agent 1 (Reconnaissance) : Ports ouverts et bannières.
    2. Agent 2 (CVE Analysis) : Hypothèses formulées par le LLM local.
    3. Agent 3 (PoC Validation) : **Élimination de la fausse alerte spéculative** et validation de la faille réelle avec preuve tangible.
    4. Agent 4 : Calcul du score par déduction (−22/−12/−6/−2) et génération du scellement SHA-256.
* **Paroles de l'orateur (90-100 mots) :**
  > "Voici le cœur de notre contribution technique : l'audit autonome multi-agents. L'opération exige un mandat ANCS formel et des Règles d'Engagement signées. Les quatre agents interviennent à la chaîne. Observez l'Agent 3 : le LLM avait émis une hypothèse de vulnérabilité SQL théorique. N'ayant pu produire de preuve dynamique non destructrice, l'Agent 3 l'a rejetée. Seules les failles prouvées sont conservées. C'est l'application stricte de notre principe : 'Le LLM propose, la preuve dispose'."

### Minute 4:30 – 5:45 : Génération de l'Attestation Officielle PDF Scellée
* **Action à l'écran :**
  - Cliquer sur le bouton **"Générer le Rapport Officiel PDF"**.
  - Faire défiler le rapport vectoriel de 7 pages : Page de garde aux normes étatiques, Résumé exécutif, Matrice de vulnérabilités avec snippets de remédiation, Feuille de route technique, et l'attestation finale scellée par empreinte SHA-256.
* **Paroles de l'orateur (60-70 mots) :**
  > "L'audit aboutit à un livrable exploitable au plus haut niveau de l'État : un rapport vectoriel de 7 pages. Les équipes techniques y trouvent les commandes bash exactes pour remédier aux faiblesses, tandis que la direction générale dispose d'une synthèse claire. En dernière page figure l'empreinte cryptographique SHA-256 qui garantit la traçabilité intégrale de la session d'audit."

### Minute 5:45 – 7:00 : Portail Public de Vérification par QR Code & Clôture
* **Action à l'écran :**
  - Scanner le QR code à l'écran avec un smartphone ou cliquer sur le lien de vérification `/verify/[domain]`.
  - Montrer la page publique de certification : confirmation de l'autorité émettrice, validité de l'empreinte SHA-256, statut de souveraineté de l'hébergement (bloc ATI AS2609), et conseils de cyber-hygiène pour le citoyen.
* **Paroles de l'orateur (60-70 mots) :**
  > "Enfin, la confiance numérique se diffuse jusqu'au citoyen. En scannant le QR code officiel apposé sur un portail public ou un document administratif, tout citoyen accède à notre portail de vérification souverain. Il y constate la conformité de l'hébergement sur le sol national et l'intégrité de l'attestation. Je vous remercie et reste à votre entière disposition pour répondre à vos questions."

---

## 3. Plan de Contingence (Que faire en cas d'imprévu ?)

### Cas 1 : La cible externe (.gov.tn) ne répond pas ou subit un timeout réseau
* **Diagnostic :** Coupure d'accès Internet dans la salle ou blocage pare-feu sortant.
* **Conduite à tenir :**
  1. Ne pas paniquer.
  2. Dire au jury avec calme et clarté :
     > "Comme nous l'avons souligné dans l'état des lieux national, près de 45 % des portails publics tunisiens rencontrent des instabilités périodiques de connectivité. Notre moteur gère nativement cet état grâce à son mécanisme d'exclusion gracieuse sans blocage de l'interface. Je bascule immédiatement sur notre cible locale de réplication hébergée sur notre VM de test."
  3. Saisir l'adresse de réplication locale : `http://192.168.98.150` ou domaine de lab.

### Cas 2 : Le serveur Ollama ne répond pas (IA indisponible)
* **Diagnostic :** Service Ollama arrêté ou GPU saturé.
* **Conduite à tenir :**
  1. La sonde déclenche automatiquement son **moteur déterministe de secours (fallback)** : `remediation_source: "deterministic_engine"`.
  2. Mettre en valeur la résilience du système :
     > "Vous constatez ici la robustesse de notre architecture découplée : en l'absence de réponse de l'accélérateur IA, la sonde ne s'arrête pas. Elle commute instantanément sur son moteur de règles déterministe d'audit, garantissant une feuille de route de remédiation 100 % conforme aux exigences de l'ANCS."

### Cas 3 : Panne matérielle ou coupure générale de l'environnement virtuel
* **Action immédiate :**
  1. Ouvrir le dossier `docs/demo/` et lancer la vidéo de démonstration préenregistrée en 1080p : `backup.mp4`.
  2. Commenter la vidéo en direct avec exactement le même script.
