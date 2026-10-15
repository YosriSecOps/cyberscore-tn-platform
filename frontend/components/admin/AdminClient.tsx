"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Sliders,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Activity,
  X,
  Save,
  Check,
  RefreshCw,
  ShieldAlert,
  Globe,
  ExternalLink,
  Eye,
} from "lucide-react";
import { dispatchCyberNotification } from "@/utils/notifications";
import {
  AuditItem,
  getAuditLogs,
  recordAuditLog,
  resetAuditLogs,
} from "@/utils/auditLogger";

interface UserItem {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "auditor" | "viewer";
  organization: { ar: string; fr: string; en: string };
  isActive: boolean;
  lastLogin: string;
  status?: string;
}

interface OrgItem {
  id: number;
  name: { ar: string; fr: string; en: string };
  sector: { ar: string; fr: string; en: string };
  criticality: number; // 1-5
  siteCount: number;
  contactEmail: string;
  websites: string[];
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 1,
    fullName: "Yosri Hamdouni",
    email: "yosri.hamdouni@ancs.tn",
    role: "admin",
    organization: {
      ar: "الوكالة الوطنية للسلامة السيبرانية (ANCS)",
      fr: "Agence Nationale CyberSécurité (ANCS)",
      en: "National Cyber Security Agency (ANCS)",
    },
    isActive: true,
    lastLogin: "2026-08-31 11:45",
    status: "approved",
  },
  {
    id: 2,
    fullName: "Yosri Hamdouni",
    email: "yosri.hamdouni@finances.gov.tn",
    role: "auditor",
    organization: {
      ar: "وزارة المالية",
      fr: "Ministère des Finances",
      en: "Ministry of Finance",
    },
    isActive: true,
    lastLogin: "2026-08-31 09:30",
    status: "approved",
  },
  {
    id: 3,
    fullName: "Karim Mansour",
    email: "k.mansour@sante.gov.tn",
    role: "viewer",
    organization: {
      ar: "وزارة الصحة",
      fr: "Ministère de la Santé",
      en: "Ministry of Health",
    },
    isActive: true,
    lastLogin: "2026-08-30 17:12",
    status: "approved",
  },
  {
    id: 4,
    fullName: "Sarra Ben Amor",
    email: "sarra.ba@justice.gov.tn",
    role: "auditor",
    organization: {
      ar: "وزارة العدل",
      fr: "Ministère de la Justice",
      en: "Ministry of Justice",
    },
    isActive: false,
    lastLogin: "2026-08-25 14:02",
    status: "pending",
  },
  {
    id: 5,
    fullName: "Mohamed Trabelsi",
    email: "m.trabelsi@defense.tn",
    role: "admin",
    organization: {
      ar: "وزارة الدفاع الوطني",
      fr: "Ministère de la Défense",
      en: "Ministry of Defense",
    },
    isActive: true,
    lastLogin: "2026-08-31 08:15",
    status: "approved",
  },
];

const INITIAL_ORGS: OrgItem[] = [
  // ── 1. MINISTÈRES & GOUVERNEMENT CENTRAL (24 Départements) ────────────────
  {
    id: 1,
    name: { ar: "رئاسة الجمهورية", fr: "Présidence de la République", en: "Presidency of the Republic" },
    sector: { ar: "رئاسة الجمهورية", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 2,
    contactEmail: "secops@carthage.tn",
    websites: ["https://carthage.tn", "https://presidence.gov.tn"],
  },
  {
    id: 2,
    name: { ar: "رئاسة الحكومة", fr: "Présidence du Gouvernement", en: "Presidency of Government" },
    sector: { ar: "رئاسة الحكومة", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "cert@pm.gov.tn",
    websites: ["https://www.pm.gov.tn", "https://www.tunisie.gov.tn", "https://www.tuneps.tn"],
  },
  {
    id: 3,
    name: { ar: "وزارة الداخلية", fr: "Ministère de l'Intérieur", en: "Ministry of Interior" },
    sector: { ar: "الداخلية والأمن", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "dsi@interieur.gov.tn",
    websites: ["https://www.interieur.gov.tn", "https://gardessante.interieur.gov.tn", "https://www.onpc.nat.tn"],
  },
  {
    id: 4,
    name: { ar: "وزارة الدفاع الوطني", fr: "Ministère de la Défense Nationale", en: "Ministry of National Defense" },
    sector: { ar: "الدفاع الوطني", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 1,
    contactEmail: "cert@defense.tn",
    websites: ["https://www.defense.tn"],
  },
  {
    id: 5,
    name: { ar: "وزارة العدل", fr: "Ministère de la Justice", en: "Ministry of Justice" },
    sector: { ar: "العدل والقضاء", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 2,
    contactEmail: "dsi@justice.gov.tn",
    websites: ["https://www.justice.gov.tn", "https://www.tribunal-administratif.tn"],
  },
  {
    id: 6,
    name: { ar: "وزارة الشؤون الخارجية", fr: "Ministère des Affaires Étrangères", en: "Ministry of Foreign Affairs" },
    sector: { ar: "الشؤون الخارجية", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 1,
    contactEmail: "secops@diplomatie.gov.tn",
    websites: ["https://www.diplomatie.gov.tn"],
  },
  {
    id: 7,
    name: { ar: "وزارة المالية", fr: "Ministère des Finances", en: "Ministry of Finance" },
    sector: { ar: "المالية", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "secops@finances.gov.tn",
    websites: ["https://www.finances.gov.tn", "https://www.douane.gov.tn", "https://www.impots.finances.gov.tn"],
  },
  {
    id: 8,
    name: { ar: "وزارة الصحة", fr: "Ministère de la Santé", en: "Ministry of Health" },
    sector: { ar: "الصحة العامة", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 2,
    contactEmail: "dosi@sante.gov.tn",
    websites: ["https://www.sante.gov.tn", "https://www.rns.tn"],
  },
  {
    id: 9,
    name: { ar: "وزارة تكنولوجيات الاتصال", fr: "Ministère des Technologies de la Communication", en: "Ministry of Communication Technologies" },
    sector: { ar: "تكنولوجيا المعلومات", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 5,
    siteCount: 2,
    contactEmail: "admin@mtc.gov.tn",
    websites: ["https://www.mtc.gov.tn", "https://www.cert.tn"],
  },
  {
    id: 10,
    name: { ar: "وزارة التربية والتعليم", fr: "Ministère de l'Éducation", en: "Ministry of Education" },
    sector: { ar: "التربية والتعليم", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 3,
    contactEmail: "dsi@education.gov.tn",
    websites: ["https://www.education.gov.tn", "https://www.edunet.tn", "https://www.orientation.tn"],
  },
  {
    id: 11,
    name: { ar: "وزارة التعليم العالي والبحث العلمي", fr: "Ministère de l'Enseignement Supérieur", en: "Ministry of Higher Education" },
    sector: { ar: "التعليم العالي", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 2,
    contactEmail: "dsi@mes.tn",
    websites: ["https://www.mes.tn", "https://www.ins.tn"],
  },
  {
    id: 12,
    name: { ar: "وزارة النقل", fr: "Ministère du Transport", en: "Ministry of Transport" },
    sector: { ar: "النقل واللوجستيك", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 1,
    contactEmail: "support@transport.gov.tn",
    websites: ["https://www.transport.gov.tn"],
  },
  {
    id: 13,
    name: { ar: "وزارة التجهيز والإسكان", fr: "Ministère de l'Équipement et de l'Habitat", en: "Ministry of Equipment and Housing" },
    sector: { ar: "التجهيز والإسكان", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 1,
    contactEmail: "dsi@equipement.gov.tn",
    websites: ["https://www.equipement.gov.tn"],
  },
  {
    id: 14,
    name: { ar: "وزارة الصناعة والمناجم والطاقة", fr: "Ministère de l'Industrie et des Mines", en: "Ministry of Industry and Mines" },
    sector: { ar: "الصناعة والطاقة", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 2,
    contactEmail: "dsi@tunisieindustrie.gov.tn",
    websites: ["https://www.tunisieindustrie.gov.tn", "https://www.tunisieindustrie.nat.tn"],
  },
  {
    id: 15,
    name: { ar: "وزارة التجارة وتنمية الصادرات", fr: "Ministère du Commerce", en: "Ministry of Commerce" },
    sector: { ar: "التجارة والتصدير", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 3,
    contactEmail: "dsi@commerce.gov.tn",
    websites: ["https://www.commerce.gov.tn", "https://www.oct.gov.tn", "https://www.cepex.nat.tn"],
  },
  {
    id: 16,
    name: { ar: "وزارة الاقتصاد والتخطيط", fr: "Ministère de l'Économie et de la Planification", en: "Ministry of Economy and Planning" },
    sector: { ar: "الاقتصاد والتخطيط", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 1,
    contactEmail: "dsi@mdici.gov.tn",
    websites: ["https://www.mdici.gov.tn"],
  },
  {
    id: 17,
    name: { ar: "وزارة الفلاحة والموارد المائية والصيد البحري", fr: "Ministère de l'Agriculture", en: "Ministry of Agriculture" },
    sector: { ar: "الفلاحة والمياه", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 2,
    contactEmail: "dsi@agriculture.gov.tn",
    websites: ["https://www.agriculture.gov.tn", "https://www.apia.com.tn"],
  },
  {
    id: 18,
    name: { ar: "وزارة الشؤون الاجتماعية", fr: "Ministère des Affaires Sociales", en: "Ministry of Social Affairs" },
    sector: { ar: "الشؤون الاجتماعية", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 1,
    contactEmail: "dsi@social.gov.tn",
    websites: ["https://www.social.gov.tn"],
  },
  {
    id: 19,
    name: { ar: "وزارة التشغيل والتكوين المهني", fr: "Ministère de l'Emploi et de la Formation", en: "Ministry of Employment" },
    sector: { ar: "التشغيل والتكوين", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 3,
    siteCount: 1,
    contactEmail: "dsi@emploi.gov.tn",
    websites: ["https://www.emploi.gov.tn"],
  },
  {
    id: 20,
    name: { ar: "وزارة الأسرة والمرأة والطفولة", fr: "Ministère de la Femme et de la Famille", en: "Ministry of Women & Family" },
    sector: { ar: "المرأة والأسرة", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 3,
    siteCount: 1,
    contactEmail: "dsi@femme.gov.tn",
    websites: ["https://www.femme.gov.tn"],
  },
  {
    id: 21,
    name: { ar: "وزارة الشباب والرياضة", fr: "Ministère de la Jeunesse et des Sports", en: "Ministry of Youth & Sports" },
    sector: { ar: "الشباب والرياضة", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 3,
    siteCount: 1,
    contactEmail: "dsi@mjs.gov.tn",
    websites: ["https://www.mjs.gov.tn"],
  },
  {
    id: 22,
    name: { ar: "وزارة الشؤون الثقافية", fr: "Ministère des Affaires Culturelles", en: "Ministry of Cultural Affairs" },
    sector: { ar: "الشؤون الثقافية", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 3,
    siteCount: 1,
    contactEmail: "dsi@culture.gov.tn",
    websites: ["https://www.culture.gov.tn"],
  },
  {
    id: 23,
    name: { ar: "وزارة السياحة والصناعات التقليدية", fr: "Ministère du Tourisme et de l'Artisanat", en: "Ministry of Tourism" },
    sector: { ar: "السياحة والصناعات التقليدية", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 3,
    siteCount: 2,
    contactEmail: "dsi@tourisme.gov.tn",
    websites: ["https://www.tourisme.gov.tn", "https://www.discovertunisia.com"],
  },
  {
    id: 24,
    name: { ar: "وزارة أملاك الدولة والشؤون العقارية والبيئة", fr: "Ministère des Domaines de l'État & Environnement", en: "State Property & Environment" },
    sector: { ar: "أملاك الدولة والبيئة", fr: "Ministères & Présidence", en: "Ministries & Presidency" },
    criticality: 4,
    siteCount: 4,
    contactEmail: "dsi@domainetat.gov.tn",
    websites: [
      "https://www.domainetat.gov.tn",
      "https://www.fonction-publique.gov.tn",
      "https://www.environnement.gov.tn",
      "https://www.affaires-religieuses.gov.tn",
    ],
  },

  // ── 2. INSTITUTIONS PUBLIQUES & RÉGULATEURS (6 Pôles) ──────────────────────
  {
    id: 25,
    name: { ar: "الوكالة الوطنية للأمن السيبراني (ANCS)", fr: "Agence Nationale de la Cybersécurité (ANCS)", en: "National Cybersecurity Agency (ANCS)" },
    sector: { ar: "الأمن السيبراني والثقة الرقمية", fr: "Institutions Publiques", en: "Public Institutions" },
    criticality: 5,
    siteCount: 2,
    contactEmail: "soc@ancs.tn",
    websites: ["https://www.ancs.tn", "https://www.tuntrust.tn"],
  },
  {
    id: 26,
    name: { ar: "البنك المركزي التونسي (BCT)", fr: "Banque Centrale de Tunisie (BCT)", en: "Central Bank of Tunisia" },
    sector: { ar: "القطاع المالي والمصرفي", fr: "Institutions Publiques", en: "Public Institutions" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "cert@bct.gov.tn",
    websites: ["https://www.bct.gov.tn", "https://www.cmf.tn", "https://www.bvmt.com.tn"],
  },
  {
    id: 27,
    name: { ar: "المركز الوطني للإعلامية (CNI) ووكالة الإنترنت", fr: "Centre National de l'Informatique (CNI & ATI)", en: "National IT & Internet Center" },
    sector: { ar: "البنية التحتية الرقمية", fr: "Institutions Publiques", en: "Public Institutions" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "soc@cni.tn",
    websites: ["https://www.cni.tn", "https://www.ati.tn", "https://www.rne.tn"],
  },
  {
    id: 28,
    name: { ar: "الهيئات الدستورية والتعديلية (ISIE, INT, INPDP)", fr: "Instances Indépendantes & Régulateurs", en: "Independent Constitutional Bodies" },
    sector: { ar: "الهيئات التعديلية", fr: "Institutions Publiques", en: "Public Institutions" },
    criticality: 5,
    siteCount: 4,
    contactEmail: "security@intt.tn",
    websites: ["https://www.isie.tn", "https://www.intt.tn", "https://www.inpdp.nat.tn", "https://www.inlucc.tn"],
  },
  {
    id: 29,
    name: { ar: "محكمة المحاسبات والقضاء الإداري", fr: "Cour des Comptes & Juridictions Suprêmes", en: "Court of Auditors & Judiciary" },
    sector: { ar: "الرقابة المالية والقضائية", fr: "Institutions Publiques", en: "Public Institutions" },
    criticality: 4,
    siteCount: 3,
    contactEmail: "dsi@courdescomptes.nat.tn",
    websites: ["https://www.courdescomptes.nat.tn", "https://www.csm.nat.tn", "https://www.innorpi.tn"],
  },
  {
    id: 30,
    name: { ar: "وكالات البيئة والتحكم في الطاقة (ANGed & ANME)", fr: "Agences Environnement & Énergie", en: "Environment & Energy Agencies" },
    sector: { ar: "البيئة والطاقة", fr: "Institutions Publiques", en: "Public Institutions" },
    criticality: 3,
    siteCount: 2,
    contactEmail: "dsi@anme.nat.tn",
    websites: ["https://www.anged.nat.tn", "https://www.anme.nat.tn"],
  },

  // ── 3. COLLECTIVITÉS LOCALES & GOUVERNORATS (4 Pôles Régionaux) ───────────
  {
    id: 31,
    name: { ar: "إقليم تونس الكبرى (ولايات وبلديات تونس، أريانة، بن عروس، منوبة)", fr: "Collectivités du Grand Tunis", en: "Greater Tunis Local Authorities" },
    sector: { ar: "الجماعات المحلية والجهوية", fr: "Collectivités Locales", en: "Local Authorities" },
    criticality: 4,
    siteCount: 8,
    contactEmail: "it@commune-tunis.gov.tn",
    websites: [
      "https://www.gouvernorat-tunis.gov.tn",
      "https://www.gouvernorat-ariana.gov.tn",
      "https://www.gouvernorat-benarous.gov.tn",
      "https://www.gouvernorat-manouba.gov.tn",
      "https://www.commune-tunis.gov.tn",
      "https://www.commune-ariana.gov.tn",
      "https://www.commune-lamarsa.gov.tn",
      "https://www.commune-carthage.gov.tn",
    ],
  },
  {
    id: 32,
    name: { ar: "إقليم الشمال والشمال الغربي (بنزرت، باجة، جندوبة، الكاف، سليانة، نابل، زغوان)", fr: "Collectivités du Nord & Nord-Ouest", en: "North & North-West Authorities" },
    sector: { ar: "الجماعات المحلية والجهوية", fr: "Collectivités Locales", en: "Local Authorities" },
    criticality: 3,
    siteCount: 11,
    contactEmail: "dsi@gouvernorat-bizerte.gov.tn",
    websites: [
      "https://www.gouvernorat-bizerte.gov.tn",
      "https://www.gouvernorat-beja.gov.tn",
      "https://www.gouvernorat-jendouba.gov.tn",
      "https://www.gouvernorat-kef.gov.tn",
      "https://www.gouvernorat-siliana.gov.tn",
      "https://www.gouvernorat-nabeul.gov.tn",
      "https://www.gouvernorat-zaghouan.gov.tn",
      "https://www.commune-bizerte.gov.tn",
      "https://www.commune-siliana.gov.tn",
      "https://www.commune-zaghouan.gov.tn",
      "https://www.commune-nabeul.gov.tn",
    ],
  },
  {
    id: 33,
    name: { ar: "إقليم الساحل والوسط (سوسة، المنستير، المهدية، القيروان، القصرين، سيدي بوزيد)", fr: "Collectivités du Sahel & Centre", en: "Sahel & Center Local Authorities" },
    sector: { ar: "الجماعات المحلية والجهوية", fr: "Collectivités Locales", en: "Local Authorities" },
    criticality: 4,
    siteCount: 9,
    contactEmail: "support@commune-sousse.gov.tn",
    websites: [
      "https://www.gouvernorat-sousse.gov.tn",
      "https://www.gouvernorat-monastir.gov.tn",
      "https://www.gouvernorat-mahdia.gov.tn",
      "https://www.gouvernorat-kairouan.gov.tn",
      "https://www.gouvernorat-kasserine.gov.tn",
      "https://www.gouvernorat-sidibouzid.gov.tn",
      "https://www.commune-sousse.gov.tn",
      "https://www.commune-monastir.gov.tn",
      "https://www.commune-kairouan.gov.tn",
    ],
  },
  {
    id: 34,
    name: { ar: "إقليم الجنوب وصفاقس (صفاقس، قابس، مدنين، تطاوين، قفصة، توزر، قبلي)", fr: "Collectivités du Sud & Sfax", en: "South & Sfax Local Authorities" },
    sector: { ar: "الجماعات المحلية والجهوية", fr: "Collectivités Locales", en: "Local Authorities" },
    criticality: 4,
    siteCount: 14,
    contactEmail: "dsi@commune-sfax.gov.tn",
    websites: [
      "https://www.gouvernorat-sfax.gov.tn",
      "https://www.gouvernorat-gabes.gov.tn",
      "https://www.gouvernorat-medenine.gov.tn",
      "https://www.gouvernorat-tataouine.gov.tn",
      "https://www.gouvernorat-gafsa.gov.tn",
      "https://www.gouvernorat-tozeur.gov.tn",
      "https://www.gouvernorat-kebili.gov.tn",
      "https://www.commune-sfax.gov.tn",
      "https://www.commune-gabes.gov.tn",
      "https://www.commune-medenine.gov.tn",
      "https://www.commune-tataouine.gov.tn",
      "https://www.commune-tozeur.gov.tn",
      "https://www.commune-houmtsouk.gov.tn",
      "https://www.fnct.org.tn",
    ],
  },

  // ── 4. ENTREPRISES & ÉTABLISSEMENTS PUBLICS STRATÉGIQUES (8 OIV) ─────────
  {
    id: 35,
    name: { ar: "الشركة التونسية للكهرباء والغاز (STEG)", fr: "Société Tunisienne de l'Électricité et du Gaz (STEG)", en: "STEG (Electricity & Gas)" },
    sector: { ar: "الطاقة والكهرباء", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 1,
    contactEmail: "dsi@steg.com.tn",
    websites: ["https://www.steg.com.tn"],
  },
  {
    id: 36,
    name: { ar: "الشركة الوطنية لاستغلال وتوزيع المياه (SONEDE)", fr: "Société Nationale de Distribution des Eaux (SONEDE)", en: "SONEDE (Water Distribution)" },
    sector: { ar: "المياه والتوزيع", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 1,
    contactEmail: "dsi@sonede.com.tn",
    websites: ["https://www.sonede.com.tn"],
  },
  {
    id: 37,
    name: { ar: "الديوان الوطني للبريد (البريد التونسي)", fr: "La Poste Tunisienne", en: "Tunisian Post" },
    sector: { ar: "الخدمات المالية والبريدية", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 4,
    siteCount: 1,
    contactEmail: "dsi@poste.tn",
    websites: ["https://www.poste.tn"],
  },
  {
    id: 38,
    name: { ar: "اتصالات تونس (Tunisie Telecom)", fr: "Tunisie Telecom", en: "Tunisie Telecom" },
    sector: { ar: "الاتصالات الوطنية", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 1,
    contactEmail: "security@tunisietelecom.tn",
    websites: ["https://www.tunisietelecom.tn"],
  },
  {
    id: 39,
    name: { ar: "صناديق الضمان والتغطية الاجتماعية (CNSS, CNAM, CNRPS)", fr: "Caisses de Sécurité Sociale (CNSS, CNAM, CNRPS)", en: "Social Security Funds" },
    sector: { ar: "الضمان الاجتماعي", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "securite@cnss.tn",
    websites: ["https://www.cnss.tn", "https://www.cnam.nat.tn", "https://www.cnrps.nat.tn"],
  },
  {
    id: 40,
    name: { ar: "الشركات الوطنية للنقل (الخطوط التونسية، السكك الحديدية، الملاحة، نقل تونس)", fr: "Compagnies Nationales de Transport (Tunisair, SNCFT, CTN)", en: "National Transport Companies" },
    sector: { ar: "النقل الوطني", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 5,
    contactEmail: "dsi@tunisair.com.tn",
    websites: [
      "https://www.tunisair.com.tn",
      "https://www.sncft.com.tn",
      "https://www.ctn.com.tn",
      "https://www.transtu.tn",
      "https://www.sntri.com.tn",
    ],
  },
  {
    id: 41,
    name: { ar: "دواوين الطيران المدني والموانئ التجارية (OACA & OMMP)", fr: "Offices des Ports & Aéroports (OACA & OMMP)", en: "Civil Aviation & Ports Authorities" },
    sector: { ar: "الموانئ والمطارات", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 2,
    contactEmail: "cert@oaca.nat.tn",
    websites: ["https://www.oaca.nat.tn", "https://www.ommp.nat.tn"],
  },
  {
    id: 42,
    name: { ar: "قطاع الطاقة والمناجم والفسفاط (ETAP, CPG, STIR)", fr: "Secteur Énergie, Phosphates & Pétrole (ETAP, CPG)", en: "Energy, Phosphates & Oil Sector" },
    sector: { ar: "المناجم والطاقة الإستراتيجية", fr: "Entreprises Publiques", en: "Public Enterprises" },
    criticality: 5,
    siteCount: 3,
    contactEmail: "dsi@etap.com.tn",
    websites: ["https://www.cpg.com.tn", "https://www.etap.com.tn", "https://www.stir.com.tn"],
  },
];

export default function AdminClient({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  const [activeTab, setActiveTab] = useState<"users" | "orgs" | "settings" | "audit">("users");
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [orgs, setOrgs] = useState<OrgItem[]>(INITIAL_ORGS);
  const [audits, setAudits] = useState<AuditItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Authenticated User State for RBAC Gate
  const [loggedUser, setLoggedUser] = useState<{
    id: number;
    email: string;
    fullName: string;
    role: "admin" | "auditor" | "viewer";
    organization: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cyberscore_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          const safeName = parsed.fullName || parsed.full_name || parsed.name || (parsed.email ? parsed.email.split("@")[0] : "Admin ANCS");
          const safeOrg = typeof parsed.organization === "string" ? parsed.organization : parsed.organization_name || "Agence Nationale CyberSécurité (ANCS)";
          const safeRole = parsed.role === "admin" || parsed.role === "auditor" || parsed.role === "viewer" ? parsed.role : "admin";
          setLoggedUser({
            id: parsed.id || 1,
            email: parsed.email || "admin@cyberscore.tn",
            fullName: safeName,
            role: safeRole,
            organization: safeOrg,
          });
        }
      } else {
        setLoggedUser({
          id: 1,
          email: "admin@cyberscore.tn",
          fullName: "Admin ANCS",
          role: "admin",
          organization: "Agence Nationale CyberSécurité (ANCS)",
        });
      }
    } catch {}
  }, []);

  // ── Live Audit Trail Subscription ──────────────────────────
  useEffect(() => {
    setAudits(getAuditLogs());
    const handleAuditUpdate = () => {
      setAudits(getAuditLogs());
    };
    window.addEventListener("cyberscore_new_audit", handleAuditUpdate);
    return () => window.removeEventListener("cyberscore_new_audit", handleAuditUpdate);
  }, []);

  // ── localStorage persistence helpers ──────────────────────
  const STORAGE_KEY = "cyberscore_admin_users";

  const saveUsersToStorage = (data: UserItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  const loadUsersFromStorage = (): UserItem[] | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return null;
  };

  // ── Organizations persistence helpers ───────────────────────
  const ORGS_STORAGE_KEY = "cyberscore_admin_orgs";

  const saveOrgsToStorage = (data: OrgItem[]) => {
    try {
      localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  const loadOrgsFromStorage = (): OrgItem[] | null => {
    try {
      const raw = localStorage.getItem(ORGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((org: any) => ({
            ...org,
            websites: Array.isArray(org.websites) ? org.websites : [],
            siteCount: Array.isArray(org.websites) && org.websites.length > 0 ? org.websites.length : (org.siteCount || 1),
          }));
        }
      }
    } catch {}
    return null;
  };

  // Org Editing & Creation Modal State
  const [editingOrg, setEditingOrg] = useState<OrgItem | null>(null);
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [newOrg, setNewOrg] = useState({
    nameFr: "",
    nameAr: "",
    sectorFr: "Finance",
    sectorAr: "المالية",
    criticality: 5,
    siteCount: 1,
    contactEmail: "",
    websites: [] as string[],
  });
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [editNewWebsiteUrl, setEditNewWebsiteUrl] = useState("");

  const [orgSearchQuery, setOrgSearchQuery] = useState("");
  const [orgSectorFilter, setOrgSectorFilter] = useState("all");

  useEffect(() => {
    const cachedOrgs = loadOrgsFromStorage();
    if (cachedOrgs && cachedOrgs.length >= INITIAL_ORGS.length) {
      setOrgs(cachedOrgs);
    } else {
      setOrgs(INITIAL_ORGS);
      saveOrgsToStorage(INITIAL_ORGS);
    }
  }, []);

  useEffect(() => {
    const totalSites = orgs.reduce((acc, o) => acc + (o.websites?.length || o.siteCount || 0), 0);
    setSystemStats((prev) => ({
      ...prev,
      totalOrgs: orgs.length,
      totalSites: totalSites,
    }));
  }, [orgs]);

  // System Stats
  const [systemStats, setSystemStats] = useState({
    activeUsers: 4,
    totalUsers: 5,
    totalOrgs: INITIAL_ORGS.length,
    totalSites: INITIAL_ORGS.reduce((acc, o) => acc + (o.websites?.length || o.siteCount || 0), 0),
    dbConnected: true,
  });

  // Settings states & persistence
  const SETTINGS_KEY = "cyberscore_admin_settings";
  const [scanFrequency, setScanFrequency] = useState("daily");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState("70");
  const [savedSettings, setSavedSettings] = useState(false);

  const saveSettingsToStorage = (freq: string, maint: boolean, thresh: string) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ scanFrequency: freq, maintenanceMode: maint, alertThreshold: thresh }));
    } catch {}
  };

  const loadSettingsFromStorage = () => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.scanFrequency) setScanFrequency(parsed.scanFrequency);
        if (typeof parsed.maintenanceMode === "boolean") setMaintenanceMode(parsed.maintenanceMode);
        if (parsed.alertThreshold) setAlertThreshold(parsed.alertThreshold);
      }
    } catch {}
  };

  // New user form state
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "auditor" as "admin" | "auditor" | "viewer",
    organization: "Ministère des Finances",
    password: "",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // 1. Fetch live users from PostgreSQL (with localStorage fallback)
  const fetchLiveUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/users`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
          saveUsersToStorage(data.users);
          setBackendOnline(true);
          const active = data.users.filter((u: any) => u.isActive).length;
          setSystemStats((prev) => ({
            ...prev,
            totalUsers: data.users.length,
            activeUsers: active,
          }));
          return;
        }
      }
    } catch {
      setBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
    // Fallback: load from localStorage if API unavailable
    const cached = loadUsersFromStorage();
    if (cached) {
      setUsers(cached);
      const active = cached.filter((u) => u.isActive).length;
      setSystemStats((prev) => ({
        ...prev,
        totalUsers: cached.length,
        activeUsers: active,
      }));
    }
  };

  // 2. Fetch live organizations from PostgreSQL
  const fetchLiveOrganizations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/organizations`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.organizations) && data.organizations.length > 0) {
          const mapped: OrgItem[] = data.organizations.map((o: any) => ({
            id: o.id,
            name: { ar: o.name_ar, fr: o.name_fr, en: o.name_fr },
            sector: { ar: "هيكل حكومي", fr: "Secteur Public", en: "Public Sector" },
            criticality: o.id <= 5 ? 5 : o.id <= 12 ? 4 : 3,
            siteCount: o.id === 1 ? 14 : o.id === 2 ? 22 : 8,
            contactEmail: `secops@org${o.id}.gov.tn`,
          }));
          setOrgs(mapped);
          setSystemStats((prev) => ({ ...prev, totalOrgs: mapped.length }));
        }
      }
    } catch {}
  };

  // 3. Fetch real Admin Stats
  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin-stats`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setSystemStats({
            activeUsers: data.users?.active || 4,
            totalUsers: data.users?.total || 5,
            totalOrgs: data.organizations || 24,
            totalSites: data.websites || 120,
            dbConnected: true,
          });
        }
      }
    } catch {}
  };

  useEffect(() => {
    // Load from localStorage immediately for instant display
    const cached = loadUsersFromStorage();
    if (cached) {
      setUsers(cached);
      const active = cached.filter((u) => u.isActive).length;
      setSystemStats((prev) => ({ ...prev, totalUsers: cached.length, activeUsers: active }));
    }
    loadSettingsFromStorage();
    // Then try to upgrade to live PostgreSQL data
    fetchLiveUsers();
    fetchLiveOrganizations();
    fetchAdminStats();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredOrgs = orgs.filter((org) => {
    const q = orgSearchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      org.name.fr.toLowerCase().includes(q) ||
      org.name.ar.toLowerCase().includes(q) ||
      org.name.en.toLowerCase().includes(q) ||
      org.sector.fr.toLowerCase().includes(q) ||
      org.sector.ar.toLowerCase().includes(q) ||
      org.contactEmail.toLowerCase().includes(q) ||
      (org.websites && org.websites.some((w) => w.toLowerCase().includes(q)));

    if (!matchSearch) return false;

    if (orgSectorFilter === "all") return true;
    if (orgSectorFilter === "ministries") {
      return (
        org.sector.fr.toLowerCase().includes("ministère") ||
        org.sector.fr.toLowerCase().includes("présidence") ||
        org.sector.fr.toLowerCase().includes("gouvernement")
      );
    }
    if (orgSectorFilter === "institutions") {
      return org.sector.fr.toLowerCase().includes("institution");
    }
    if (orgSectorFilter === "local") {
      return org.sector.fr.toLowerCase().includes("collectivité");
    }
    if (orgSectorFilter === "enterprises") {
      return org.sector.fr.toLowerCase().includes("entreprise");
    }
    return true;
  });

  // Toggle user active status (Live PostgreSQL Update + localStorage persistence)
  const toggleUserStatus = async (id: number) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const newActive = !target.isActive;

    // Optimistic UI update + persist to localStorage
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, isActive: newActive } : u));
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    // Update KPI stats immediately
    const active = updatedUsers.filter((u) => u.isActive).length;
    setSystemStats((prev) => ({ ...prev, activeUsers: active }));

    // Record Sovereign Audit Trail in real-time
    const currentActor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: currentActor,
      action: {
        fr: `${newActive ? "Réactivation" : "Désactivation"} du compte utilisateur`,
        ar: `${newActive ? "إعادة تفعيل" : "تعطيل"} حساب المستخدم`,
        en: `${newActive ? "Reactivated" : "Deactivated"} user account`,
      },
      target: target.email,
      severity: newActive ? "info" : "critical",
    });

    try {
      const res = await fetch(`${API_BASE}/api/auth/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newActive }),
      });
      if (res.ok) {
        setActionMessage(
          isAr
            ? `تم تحديث حالة المستخدم بنجاح في قاعدة البيانات`
            : `Statut de ${target.email} mis à jour avec succès (PostgreSQL + localStorage).`
        );
      } else {
        setActionMessage(
          isAr
            ? `تم حفظ التغيير محليًا (الخادم غير متصل)`
            : `Changement sauvegardé localement (Backend hors ligne).`
        );
      }
    } catch {
      setActionMessage(
        isAr
          ? `تم حفظ التغيير محليًا (الخادم غير متصل)`
          : `Changement sauvegardé en localStorage (Backend hors ligne).`
      );
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Delete user (Live PostgreSQL Update + localStorage persistence)
  const handleDeleteUser = async (id: number, email: string) => {
    if (email === "admin@cyberscore.tn") {
      alert("Impossible de supprimer le compte Super-Admin racine.");
      return;
    }

    if (!confirm(isAr ? `هل أنت متأكد من حذف الحساب؟` : `Supprimer définitivement l'utilisateur ${email} ?`)) {
      return;
    }

    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    const active = updatedUsers.filter((u) => u.isActive).length;
    setSystemStats((prev) => ({ ...prev, totalUsers: updatedUsers.length, activeUsers: active }));

    // Record Sovereign Audit Trail in real-time
    const currentActor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: currentActor,
      action: {
        fr: "Suppression définitive du compte utilisateur",
        ar: "حذف نهائي لحساب المستخدم",
        en: "Permanently deleted user account",
      },
      target: email,
      severity: "critical",
    });

    try {
      const res = await fetch(`${API_BASE}/api/auth/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionMessage(
          isAr
            ? `تم حذف المستخدم من قاعدة البيانات`
            : `Utilisateur ${email} supprimé définitivement de la base de données.`
        );
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {}
  };

  // Add new user (Live PostgreSQL Creation + localStorage persistence)
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email) return;

    const createLocalUser = (): UserItem => ({
      id: Date.now(),
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      organization: { ar: newUser.organization, fr: newUser.organization, en: newUser.organization },
      isActive: true,
      lastLogin: isAr ? "الآن" : isFr ? "À l'instant" : "Just now",
      status: "approved",
    });

    // Record Sovereign Audit Trail in real-time
    const currentActor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: currentActor,
      action: {
        fr: `Création du compte officier (${newUser.role.toUpperCase()})`,
        ar: `إنشاء حساب ضابط جديد (${newUser.role.toUpperCase()})`,
        en: `Enrolled new officer account (${newUser.role.toUpperCase()})`,
      },
      target: newUser.email,
      severity: "info",
    });

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password || "Ancs@2026",
          full_name: newUser.fullName,
          organization_name: newUser.organization,
          role: newUser.role,
          position: "Officier RSSI",
          preferred_language: locale,
        }),
      });

      if (res.ok) {
        setActionMessage(
          isAr
            ? `تم تسجيل المستخدم في قاعدة البيانات بنجاح`
            : `Utilisateur ${newUser.email} créé dans PostgreSQL avec succès.`
        );
        await fetchLiveUsers();
      } else {
        const created = createLocalUser();
        const updatedUsers = [created, ...users];
        setUsers(updatedUsers);
        saveUsersToStorage(updatedUsers);
        setActionMessage(isAr ? `تم إضافة المستخدم محليًا` : `Utilisateur ajouté localement (Backend hors ligne).`);
      }
    } catch {
      const created = createLocalUser();
      const updatedUsers = [created, ...users];
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      setActionMessage(isAr ? `تم إضافة المستخدم محليًا` : `Utilisateur ajouté en localStorage (Backend hors ligne).`);
      dispatchCyberNotification({
        type: "warning",
        title: {
          ar: `تسجيل مستخدم جديد: ${newUser.fullName}`,
          fr: `Nouvel officier enrôlé : ${newUser.fullName}`,
          en: `New user enrolled: ${newUser.fullName}`,
        },
        desc: {
          ar: `الدور: ${newUser.role.toUpperCase()} — المؤسسة: ${newUser.organization}`,
          fr: `Rôle : ${newUser.role.toUpperCase()} — ${newUser.organization}`,
          en: `Role: ${newUser.role.toUpperCase()} — ${newUser.organization}`,
        },
        href: "/admin",
      });
    }
    setTimeout(() => setActionMessage(null), 4000);

    setNewUser({ fullName: "", email: "", role: "auditor", organization: "Ministère des Finances", password: "" });
    setShowAddModal(false);
  };

  // ── Organization Management Handlers (Strict Admin Only) ──
  const handleSaveEditedOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;

    // Strict Admin Privileges Check
    if (!loggedUser || loggedUser.role !== "admin") {
      alert("Action non-autorisée : Réservée exclusivement aux Administrateurs Centraux ANCS.");
      return;
    }

    // Auto-sync siteCount from actual websites array
    const finalOrg = { ...editingOrg, siteCount: editingOrg.websites.length };

    const updated = orgs.map((o) => (o.id === finalOrg.id ? finalOrg : o));
    setOrgs(updated);
    saveOrgsToStorage(updated);
    // Update total sites count in stats
    const totalSites = updated.reduce((acc, o) => acc + o.websites.length, 0);
    setSystemStats((prev) => ({ ...prev, totalSites, totalOrgs: updated.length }));

    const actor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: actor,
      action: {
        fr: `Mise à jour organisation ${finalOrg.name.fr} (Criticité ${finalOrg.criticality}/5, ${finalOrg.websites.length} sites)`,
        ar: `تعديل بيانات المؤسسة ${finalOrg.name.ar} (درجة الخطورة ${finalOrg.criticality}/5, ${finalOrg.websites.length} موقع)`,
        en: `Updated organization ${finalOrg.name.en} (Criticality ${finalOrg.criticality}/5, ${finalOrg.websites.length} sites)`,
      },
      target: finalOrg.contactEmail || finalOrg.name.fr,
      severity: "warning",
    });

    setActionMessage(
      isAr
        ? `تم تحديث بيانات المؤسسة بنجاح (${finalOrg.websites.length} موقع مسجل)`
        : `Organisation ${finalOrg.name.fr} mise à jour — ${finalOrg.websites.length} domaine(s) enregistré(s).`
    );
    setTimeout(() => setActionMessage(null), 3000);
    setShowEditOrgModal(false);
    setEditingOrg(null);
    setEditNewWebsiteUrl("");
  };

  const handleAddOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.nameFr || !newOrg.contactEmail) return;

    // Strict Admin Privileges Check
    if (!loggedUser || loggedUser.role !== "admin") {
      alert("Action non-autorisée : Réservée exclusivement aux Administrateurs Centraux ANCS.");
      return;
    }

    const created: OrgItem = {
      id: Date.now(),
      name: { ar: newOrg.nameAr || newOrg.nameFr, fr: newOrg.nameFr, en: newOrg.nameFr },
      sector: { ar: newOrg.sectorAr || newOrg.sectorFr, fr: newOrg.sectorFr, en: newOrg.sectorFr },
      criticality: Number(newOrg.criticality) || 4,
      siteCount: newOrg.websites.length || 1,
      contactEmail: newOrg.contactEmail,
      websites: newOrg.websites.length > 0 ? [...newOrg.websites] : [],
    };

    const updated = [...orgs, created];
    setOrgs(updated);
    saveOrgsToStorage(updated);
    const totalSites = updated.reduce((acc, o) => acc + o.websites.length, 0);
    setSystemStats((prev) => ({ ...prev, totalOrgs: updated.length, totalSites }));

    const actor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: actor,
      action: {
        fr: `Enrôlement nouvelle organisation (${newOrg.nameFr} — Criticité ${newOrg.criticality}/5, ${created.websites.length} site(s))`,
        ar: `تسجيل مؤسسة جديدة (${newOrg.nameFr} — درجة الخطورة ${newOrg.criticality}/5, ${created.websites.length} موقع)`,
        en: `Enrolled new organization (${newOrg.nameFr} — Criticality ${newOrg.criticality}/5, ${created.websites.length} site(s))`,
      },
      target: newOrg.contactEmail,
      severity: "info",
    });

    setActionMessage(
      isAr
        ? `تم تسجيل المؤسسة بنجاح`
        : `Nouvelle organisation ${newOrg.nameFr} enregistrée avec succès.`
    );
    setTimeout(() => setActionMessage(null), 3000);
    setShowAddOrgModal(false);
    setNewOrg({ nameFr: "", nameAr: "", sectorFr: "Finance", sectorAr: "المالية", criticality: 5, siteCount: 1, contactEmail: "", websites: [] });
    setNewWebsiteUrl("");
  };

  const handleSaveSettings = () => {
    saveSettingsToStorage(scanFrequency, maintenanceMode, alertThreshold);
    setSavedSettings(true);

    // Record Sovereign Audit Trail in real-time
    const currentActor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: currentActor,
      action: {
        fr: `Mise à jour politique d'alerte (${alertThreshold} pts, ${scanFrequency})`,
        ar: `تعديل سياسة التنبيه (${alertThreshold} نقطة، ${scanFrequency})`,
        en: `Updated alert policy threshold (${alertThreshold} pts, ${scanFrequency})`,
      },
      target: "GLOBAL_CONFIG",
      severity: "warning",
    });

    setActionMessage(
      isAr
        ? `تم حفظ إعدادات النظام وتحديث سياسة الفحص بنجاح`
        : `Paramètres globaux et politique de scan enregistrés avec succès.`
    );
    setTimeout(() => {
      setSavedSettings(false);
      setActionMessage(null);
    }, 3000);
  };

  const toggleMaintenance = () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    saveSettingsToStorage(scanFrequency, nextVal, alertThreshold);

    // Record Sovereign Audit Trail in real-time
    const currentActor = loggedUser?.email ? loggedUser.email.split("@")[0] : "yosri.hamdouni";
    recordAuditLog({
      user: currentActor,
      action: {
        fr: nextVal ? "Activation du Mode Maintenance (Kill-Switch)" : "Désactivation du Mode Maintenance",
        ar: nextVal ? "تفعيل وضع الصيانة (تعليق الفحوصات)" : "إلغاء وضع الصيانة (استئناف nominal)",
        en: nextVal ? "Activated Maintenance Mode (Kill-Switch)" : "Deactivated Maintenance Mode",
      },
      target: "SCAN_ENGINE",
      severity: nextVal ? "critical" : "info",
    });

    dispatchCyberNotification({
      type: nextVal ? "critical" : "success",
      title: {
        ar: nextVal ? "تنبيه: تفعيل وضع الصيانة" : "تم إلغاء وضع الصيانة",
        fr: nextVal ? "Mode Maintenance ACTIVÉ" : "Mode Maintenance DÉSACTIVÉ",
        en: nextVal ? "Maintenance Mode ACTIVATED" : "Maintenance Mode DEACTIVATED",
      },
      desc: {
        ar: nextVal ? "تم تعليق الفحوصات العامة والمسح التلقائي مؤقتًا." : "استئناف عمليات المسح والمراقبة بشكل طبيعي.",
        fr: nextVal ? "Les audits publics et scans automatisés sont suspendus." : "Plateforme et moteurs d'audit en service nominal.",
        en: nextVal ? "Public and automated scans are suspended." : "All scanning services operating nominally.",
      },
      href: "/admin",
    });

    setActionMessage(
      nextVal
        ? isAr
          ? `تم تفعيل وضع الصيانة: تم تعليق الفحوصات العامة`
          : `Mode Maintenance ACTIVÉ : Les scans publics sont suspendus.`
        : isAr
        ? `تم إلغاء وضع الصيانة: المنصة في الخدمة الكاملة`
        : `Mode Maintenance DÉSACTIVÉ : Plateforme en service nominal.`
    );
    setTimeout(() => setActionMessage(null), 3000);
  };

  const labels = {
    title: isAr ? "مركز إدارة النظام" : isFr ? "Panneau d'Administration" : "System Administration",
    subTitle: isAr
      ? "إدارة المستخدمين، المؤسسات، وضبط سياسات المراقبة السيبرانية الوطنية"
      : isFr
      ? "Gestion des accès RBAC, des ministères et configuration du moteur de surveillance"
      : "RBAC user access control, ministry management, and scan engine configuration",
    kpiUsers: isAr ? "المستخدمون النشطون" : isFr ? "Utilisateurs Actifs" : "Active Users",
    kpiOrgs: isAr ? "المؤسسات المسجلة" : isFr ? "Organisations" : "Organizations",
    kpiSites: isAr ? "المواقع المراقبة" : isFr ? "Sites Supervisés" : "Monitored Domains",
    kpiHealth: isAr ? "حالة النظام" : isFr ? "Santé Système" : "System Health",
    tabUsers: isAr ? "المستخدمون والوصول" : isFr ? "Utilisateurs & Accès" : "Users & Access",
    tabOrgs: isAr ? "المؤسسات والوزارات" : isFr ? "Organisations" : "Organizations",
    tabSettings: isAr ? "إعدادات المنصة" : isFr ? "Paramètres Globaux" : "System Settings",
    tabAudit: isAr ? "سجل العمليات (Audit)" : isFr ? "Journal d'Audit" : "Audit Trail",
    addUser: isAr ? "إضافة مستخدم" : isFr ? "Nouvel Utilisateur" : "Add User",
    searchPlaceholder: isAr ? "بحث بالاسم أو البريد..." : isFr ? "Rechercher un utilisateur..." : "Search users...",
  };

  // RBAC Access Control Gate: Non-admin users are blocked from /admin
  if (loggedUser && loggedUser.role !== "admin") {
    return (
      <div style={{ padding: "60px 24px", maxWidth: "860px", margin: "0 auto" }}>
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid #ef4444",
            padding: "48px 36px",
            textAlign: "center",
            boxShadow: "0 0 35px rgba(239, 68, 68, 0.18)",
            position: "relative",
          }}
        >
          {/* Top colored stripe */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444)",
            }}
          />

          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              color: "#ef4444",
            }}
          >
            <ShieldAlert size={36} />
          </div>

          <div
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              color: "#ef4444",
              fontWeight: 800,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            HTTP 403 // FORBIDDEN ACCESS (RBAC GATEWAY)
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
            {isAr
              ? "غير مصرح لك بالنفاذ إلى مركز إدارة النظام"
              : isFr
              ? "Accès Restreint : Réservé aux Administrateurs Centraux ANCS"
              : "Restricted Access: ANCS Administrators Only"}
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              maxWidth: "640px",
              margin: "0 auto 24px auto",
              lineHeight: "1.6",
            }}
          >
            {isAr
              ? "هذه الوحدة مخصصة حصرياً للمدير العام للوكالة الوطنية للسلامة السيبرانية (ANCS) لإدارة المستخدمين، وضبط معايير الفحص الشامل، وتفعيل وضع الصيانة."
              : isFr
              ? "Ce module est réservé exclusivement au Super-Administrateur de l'Agence Nationale de la Cybersécurité pour la gestion des habilitations d'État, la configuration des politiques de scan et le mode maintenance souverain."
              : "This module is strictly reserved for the central ANCS Super-Administrator to manage state accreditations, configure system policies, and activate maintenance mode."}
          </p>

          {/* Current profile info box */}
          <div
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-primary)",
              padding: "16px 20px",
              maxWidth: "520px",
              margin: "0 auto 28px auto",
              textAlign: isAr ? "right" : "left",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "6px" }}>
              {isAr ? "بيانات الحساب الحالي :" : isFr ? "Votre session active :" : "Active Session Details :"}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{loggedUser.fullName}</span>
              <span
                style={{
                  fontSize: "9px",
                  fontFamily: "monospace",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: loggedUser.role === "auditor" ? "#0284c7" : "#64748b",
                  background: loggedUser.role === "auditor" ? "rgba(2,132,199,0.1)" : "rgba(100,116,139,0.1)",
                  border: `1px solid ${loggedUser.role === "auditor" ? "#0284c7" : "#64748b"}`,
                  padding: "1px 6px",
                  borderRadius: "2px",
                }}
              >
                {loggedUser.role}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "monospace" }}>{loggedUser.email}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>{loggedUser.organization}</div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={`/${isAr ? "ar" : isFr ? "fr" : "en"}`}
              style={{
                padding: "10px 20px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isAr ? "العودة لمركز القيادة" : isFr ? "Retour au Command Center" : "Back to Command Center"}
            </a>
            <button
              onClick={() => {
                const adminSession = {
                  id: 1,
                  email: "admin@cyberscore.tn",
                  fullName: "Admin ANCS",
                  role: "admin" as const,
                  organization: "Agence Nationale CyberSécurité (ANCS)",
                  isActive: true,
                };
                localStorage.setItem("cyberscore_user", JSON.stringify(adminSession));
                setLoggedUser(adminSession);
              }}
              style={{
                padding: "10px 20px",
                background: "var(--color-accent)",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isAr ? "التبديل إلى حساب Admin ANCS" : isFr ? "Basculer sur le compte Admin ANCS" : "Switch to Admin ANCS"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      {/* Action toast */}
      {actionMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#10b981",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "12px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Check size={16} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Maintenance Notice Banner */}
      {maintenanceMode && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            borderBottom: "1px solid #ef4444",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#ef4444",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          <ShieldAlert size={16} />
          <span>
            {isAr
              ? "تنبيه: وضع الصيانة مفعّل حاليًا — تم تعليق الفحوصات الخارجية والمسح الدوري"
              : isFr
              ? "ATTENTION : Mode Maintenance ACTIF — Les scans publics et automatisés sont temporairement suspendus."
              : "WARNING: Maintenance Mode is ACTIVE — Public and automated scans are suspended."}
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          padding: "24px",
          background: "var(--bg-secondary)",
          borderBottom: "0.5px solid var(--border-primary)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                fontFamily: "monospace",
                marginBottom: "4px",
              }}
            >
              SYS.ADMIN // CONTROL PANEL
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {labels.title}
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: "4px 0 0 0",
              }}
            >
              {labels.subTitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                fetchLiveUsers();
                fetchAdminStats();
              }}
              title="Rafraîchir depuis la base PostgreSQL"
              style={{
                padding: "8px 12px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-secondary)",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: "8px 16px",
                background: "var(--color-accent)",
                color: "#ffffff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "opacity 0.2s ease",
              }}
            >
              <Plus size={14} />
              {labels.addUser}
            </button>
          </div>
        </div>

        {/* ── 4 KPI Cards ────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {/* Active Users */}
          <div
            style={{
              padding: "16px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
              {labels.kpiUsers}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
              <span className="soc-font-mono" style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-accent)" }}>
                {systemStats.activeUsers}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                / {systemStats.totalUsers}
              </span>
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-tertiary)", marginTop: "4px" }}>
              PostgreSQL Users
            </div>
          </div>

          {/* Organizations */}
          <div
            style={{
              padding: "16px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
              {labels.kpiOrgs}
            </div>
            <div className="soc-font-mono" style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
              {systemStats.totalOrgs}
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-tertiary)", marginTop: "4px" }}>
              100% Ministères & Agences
            </div>
          </div>

          {/* Supervised Sites */}
          <div
            style={{
              padding: "16px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
              {labels.kpiSites}
            </div>
            <div className="soc-font-mono" style={{ fontSize: "24px", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>
              {systemStats.totalSites}
            </div>
            <div style={{ fontSize: "10.5px", color: "var(--text-tertiary)", marginTop: "4px" }}>
              Domaines .gov.tn actifs
            </div>
          </div>

          {/* System Health */}
          <div
            style={{
              padding: "16px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
              {labels.kpiHealth}
            </div>
            <div className="soc-font-mono" style={{ fontSize: "24px", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>
              99.98%
            </div>
            <div style={{ fontSize: "10.5px", color: "#10b981", marginTop: "4px", fontWeight: 600 }}>
              FastAPI & PostgreSQL en ligne
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ───────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-primary)",
          background: "var(--bg-secondary)",
          padding: "0 24px",
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {[
          { key: "users" as const, label: labels.tabUsers, icon: Users },
          { key: "orgs" as const, label: labels.tabOrgs, icon: Building2 },
          { key: "settings" as const, label: labels.tabSettings, icon: Sliders },
          { key: "audit" as const, label: labels.tabAudit, icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 18px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--color-accent)" : "2px solid transparent",
                color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                fontFamily: "monospace",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────────────────────────── */}
      <div style={{ padding: "24px" }}>
        {/* TAB 1: USERS */}
        {activeTab === "users" && (
          <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-primary)" }}>
            {/* Search and Filters Bar */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid var(--border-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  padding: "6px 12px",
                  width: "280px",
                }}
              >
                <Search size={14} color="var(--text-secondary)" />
                <input
                  type="text"
                  placeholder={labels.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "11px",
                    color: "var(--text-primary)",
                    width: "100%",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "10px", color: "var(--text-secondary)", fontFamily: "monospace", textTransform: "uppercase" }}>
                  {isAr ? "تصفية حسب الدور:" : isFr ? "Filtrer rôle:" : "Filter role:"}
                </span>
                {["all", "admin", "auditor", "viewer"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      background: roleFilter === role ? "var(--color-accent)" : "var(--bg-tertiary)",
                      color: roleFilter === role ? "#ffffff" : "var(--text-secondary)",
                      border: "0.5px solid var(--border-primary)",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-tertiary)" }}>
                    {[
                      isAr ? "المستخدم" : isFr ? "Utilisateur" : "User",
                      isAr ? "الدور (RBAC)" : isFr ? "Rôle" : "Role",
                      isAr ? "المؤسسة" : isFr ? "Organisation" : "Organization",
                      isAr ? "الحالة" : isFr ? "Statut" : "Status",
                      isAr ? "آخر تسجيل دخول" : isFr ? "Dernière Connexion" : "Last Login",
                      isAr ? "إجراءات" : isFr ? "Actions" : "Actions",
                    ].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "10px 16px",
                          textAlign: isAr ? "right" : "left",
                          fontSize: "9px",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border-primary)",
                          fontFamily: "monospace",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const roleColor =
                      user.role === "admin" ? "#ef4444" : user.role === "auditor" ? "#0284c7" : "#64748b";
                    const loc = (locale as "ar" | "fr" | "en") || "fr";
                    return (
                      <tr key={user.id} style={{ borderBottom: "0.5px solid var(--border-primary)" }}>
                        {/* Name & Email */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{user.fullName}</div>
                          <div style={{ fontSize: "10.5px", color: "var(--text-secondary)", fontFamily: "monospace" }}>{user.email}</div>
                        </td>

                        {/* Role Badge */}
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              fontSize: "9.5px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              fontFamily: "monospace",
                              color: roleColor,
                              border: `1px solid ${roleColor}`,
                              background: `${roleColor}10`,
                              borderRadius: "2px",
                            }}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Organization */}
                        <td style={{ padding: "12px 16px", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                          {user.organization[loc] || user.organization.fr}
                        </td>

                        {/* Status Toggle */}
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "10.5px",
                              fontWeight: 700,
                              fontFamily: "monospace",
                              color: user.isActive ? "#10b981" : "#ef4444",
                            }}
                          >
                            {user.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {user.isActive ? (isAr ? "نشط" : isFr ? "Actif" : "Active") : (isAr ? "معطل" : isFr ? "Inactif" : "Inactive")}
                          </button>
                        </td>

                        {/* Last Login */}
                        <td style={{ padding: "12px 16px", fontSize: "10.5px", color: "var(--text-tertiary)", fontFamily: "monospace" }}>
                          {user.lastLogin}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              title={isAr ? "حذف الحساب" : isFr ? "Supprimer de la base de données" : "Delete from database"}
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              style={{
                                background: "var(--bg-tertiary)",
                                border: "0.5px solid var(--border-primary)",
                                padding: "5px 9px",
                                cursor: "pointer",
                                color: "#ef4444",
                                borderRadius: "2px",
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZATIONS */}
        {activeTab === "orgs" && (
          <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-primary)" }}>
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid var(--border-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    fontFamily: "monospace",
                  }}
                >
                  {isAr
                    ? `قائمة الهيئات الحكومية المعتمدة (${filteredOrgs.length}/${orgs.length})`
                    : isFr
                    ? `Ministères et Organismes Gouvernementaux Enrôlés (${filteredOrgs.length}/${orgs.length})`
                    : `Enrolled Ministries & State Agencies (${filteredOrgs.length}/${orgs.length})`}
                </span>
                <span
                  className="soc-font-mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--color-accent)",
                    background: "rgba(0, 229, 255, 0.1)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 229, 255, 0.3)",
                  }}
                >
                  POSTGRESQL SYNC ACTIVE
                </span>
                <span
                  className="soc-font-mono"
                  style={{
                    fontSize: "10px",
                    color: "#10b981",
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    fontWeight: 700,
                  }}
                >
                  {orgs.reduce((acc, o) => acc + (o.websites?.length || o.siteCount || 0), 0)} {isAr ? "موقع تحت المراقبة" : isFr ? "SITES SUPERVISÉS" : "MONITORED SITES"}
                </span>
              </div>

              <button
                onClick={() => setShowAddOrgModal(true)}
                style={{
                  padding: "6px 14px",
                  background: "var(--color-accent)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "opacity 0.2s ease",
                }}
              >
                <Plus size={13} />
                <span>{isAr ? "إضافة مؤسسة" : isFr ? "Nouvelle Organisation" : "Add Organization"}</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div
              style={{
                padding: "12px 20px",
                background: "var(--bg-tertiary)",
                borderBottom: "1px solid var(--border-primary)",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Search Bar */}
              <div style={{ position: "relative", flex: 1, minWidth: "260px", maxWidth: "420px" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: isAr ? undefined : "10px",
                    right: isAr ? "10px" : undefined,
                    color: "var(--text-tertiary)",
                  }}
                />
                <input
                  type="text"
                  placeholder={
                    isAr
                      ? "بحث عن وزارة، مؤسسة، نطاق (مثال: sante.gov.tn)..."
                      : isFr
                      ? "Rechercher par organisme, domaine (ex: sante.gov.tn)..."
                      : "Search by organization, domain (e.g. sante.gov.tn)..."
                  }
                  value={orgSearchQuery}
                  onChange={(e) => setOrgSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 12px",
                    paddingLeft: isAr ? "12px" : "32px",
                    paddingRight: isAr ? "32px" : "12px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
              </div>

              {/* Sector Filter Pills */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { key: "all", label: isAr ? `الكل (${orgs.length})` : `Tous (${orgs.length})` },
                  {
                    key: "ministries",
                    label: isAr
                      ? `الوزارات (${orgs.filter((o) => o.sector.fr.includes("Ministère") || o.sector.fr.includes("Présidence")).length})`
                      : `Ministères (${orgs.filter((o) => o.sector.fr.includes("Ministère") || o.sector.fr.includes("Présidence")).length})`,
                  },
                  {
                    key: "institutions",
                    label: isAr
                      ? `الهيئات (${orgs.filter((o) => o.sector.fr.includes("Institution")).length})`
                      : `Institutions (${orgs.filter((o) => o.sector.fr.includes("Institution")).length})`,
                  },
                  {
                    key: "local",
                    label: isAr
                      ? `الجماعات المحلية (${orgs.filter((o) => o.sector.fr.includes("Collectivité")).length})`
                      : `Collectivités (${orgs.filter((o) => o.sector.fr.includes("Collectivité")).length})`,
                  },
                  {
                    key: "enterprises",
                    label: isAr
                      ? `المنشآت العمومية (${orgs.filter((o) => o.sector.fr.includes("Entreprise")).length})`
                      : `Entreprises Publiques (${orgs.filter((o) => o.sector.fr.includes("Entreprise")).length})`,
                  },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => setOrgSectorFilter(pill.key)}
                    style={{
                      padding: "5px 10px",
                      background: orgSectorFilter === pill.key ? "var(--color-accent)" : "var(--bg-secondary)",
                      color: orgSectorFilter === pill.key ? "#ffffff" : "var(--text-secondary)",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "10.5px",
                      fontFamily: "monospace",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-tertiary)" }}>
                    {[
                      isAr ? "المؤسسة" : isFr ? "Organisation" : "Organization",
                      isAr ? "القطاع" : isFr ? "Secteur" : "Sector",
                      isAr ? "مستوى الأهمية (Criticality)" : isFr ? "Niveau de Criticité" : "Criticality Level",
                      isAr ? "عدد المواقع" : isFr ? "Sites Supervisés" : "Monitored Sites",
                      isAr ? "مسؤول الاتصال" : isFr ? "Contact Sécurité" : "Security Contact",
                      isAr ? "الإجراءات" : "Actions",
                    ].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "10px 16px",
                          textAlign: i === 5 ? (isAr ? "left" : "right") : (isAr ? "right" : "left"),
                          fontSize: "9px",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border-primary)",
                          fontFamily: "monospace",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.length > 0 ? (
                    filteredOrgs.map((org) => {
                    const loc = (locale as "ar" | "fr" | "en") || "fr";
                    return (
                      <tr key={org.id} style={{ borderBottom: "0.5px solid var(--border-primary)" }}>
                        <td style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {org.name[loc] || org.name.fr}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "11px", color: "var(--color-accent)", fontFamily: "monospace" }}>
                          {org.sector[loc] || org.sector.fr}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: "3px" }}>
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                style={{
                                  width: "12px",
                                  height: "5px",
                                  borderRadius: "1px",
                                  background: level <= org.criticality ? "#ef4444" : "var(--border-primary)",
                                }}
                              />
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: org.websites && org.websites.length > 0 ? "6px" : "0" }}>
                            <Globe size={13} color="var(--color-accent)" />
                            <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "monospace", color: "var(--text-primary)" }}>
                              {org.websites ? org.websites.length : org.siteCount}
                            </span>
                            <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                              {isAr ? "نطاق" : isFr ? "domaine(s)" : "domain(s)"}
                            </span>
                          </div>
                          {org.websites && org.websites.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {org.websites.map((url, idx) => {
                                const domain = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
                                const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
                                return (
                                  <a
                                    key={idx}
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      fontSize: "10.5px",
                                      fontFamily: "monospace",
                                      color: "var(--color-accent)",
                                      textDecoration: "none",
                                      transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      (e.currentTarget as HTMLElement).style.textDecoration = "underline";
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.currentTarget as HTMLElement).style.textDecoration = "none";
                                    }}
                                    title={isAr ? `زيارة الموقع: ${fullUrl}` : `Visiter: ${fullUrl}`}
                                  >
                                    <ExternalLink size={9} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                                      {domain}
                                    </span>
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "11px", color: "var(--text-secondary)", fontFamily: "monospace" }}>
                          {org.contactEmail}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: isAr ? "left" : "right" }}>
                          <button
                            onClick={() => {
                              setEditingOrg({
                                ...org,
                                websites: Array.isArray(org.websites) ? [...org.websites] : [],
                              });
                              setEditNewWebsiteUrl("");
                              setShowEditOrgModal(true);
                            }}
                            style={{
                              background: "var(--bg-tertiary)",
                              border: "1px solid var(--border-primary)",
                              color: "var(--color-accent)",
                              padding: "4px 10px",
                              fontSize: "11px",
                              fontFamily: "monospace",
                              fontWeight: 600,
                              cursor: "pointer",
                              borderRadius: "var(--radius-sm)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            title={isAr ? "تعديل بيانات المؤسسة" : "Modifier l'organisation"}
                          >
                            <Edit2 size={12} />
                            <span>{isAr ? "تعديل" : isFr ? "Modifier" : "Edit"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "36px 20px",
                        textAlign: "center",
                        color: "var(--text-tertiary)",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    >
                      {isAr
                        ? "لم يتم العثور على أي مؤسسة أو نطاق يطابق معايير البحث."
                        : isFr
                        ? "Aucun organisme ou domaine ne correspond à vos critères de recherche."
                        : "No organization or domain matches your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {/* Scan Policy Card */}
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-primary)", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
                {isAr ? "سياسة الفحص الآلي" : isFr ? "Politique de Scan Global" : "Global Scan Policy"}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr ? "تكرار الفحص الشامل:" : isFr ? "Fréquence des Scans Automatisés :" : "Automated Scan Frequency:"}
                </label>
                <select
                  value={scanFrequency}
                  onChange={(e) => setScanFrequency(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                >
                  <option value="daily">{isAr ? "يوميًا (الساعة 02:00 صباحًا)" : isFr ? "Quotidien (02:00 UTC)" : "Daily (02:00 UTC)"}</option>
                  <option value="weekly">{isAr ? "أسبوعيًا (كل أحد)" : isFr ? "Hebdomadaire (Dimanche)" : "Weekly (Sunday)"}</option>
                  <option value="monthly">{isAr ? "شهريًا" : isFr ? "Mensuel" : "Monthly"}</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr ? "عتبة التنبيه عند انخفاض النتيجة:" : isFr ? "Seuil d'alerte baisse de score (pts) :" : "Alert Threshold on Score Drop (pts):"}
                </label>
                <input
                  type="number"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
              </div>

              <button
                onClick={handleSaveSettings}
                style={{
                  padding: "8px 16px",
                  background: savedSettings ? "#10b981" : "var(--color-accent)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "monospace",
                  transition: "background 0.2s ease",
                }}
              >
                {savedSettings ? <Check size={14} /> : <Save size={14} />}
                {savedSettings ? (isAr ? "تم الحفظ !" : isFr ? "Enregistré !" : "Saved!") : (isAr ? "حفظ التغييرات" : isFr ? "Enregistrer" : "Save Changes")}
              </button>
            </div>

            {/* Maintenance Mode & API Status */}
            <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-primary)", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "monospace" }}>
                {isAr ? "حالة الأمان والصيانة" : isFr ? "Maintenance & Sécurité" : "Security & Maintenance"}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid var(--border-primary)" }}>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {isAr ? "وضع الصيانة (Maintenance Mode)" : isFr ? "Mode Maintenance" : "Maintenance Mode"}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>
                    {isAr ? "إيقاف الفحوصات الخارجية مؤقتًا" : isFr ? "Désactiver les scans publics" : "Suspend public scan engine"}
                  </div>
                </div>
                <button
                  onClick={toggleMaintenance}
                  style={{
                    padding: "4px 12px",
                    background: maintenanceMode ? "#ef4444" : "var(--bg-tertiary)",
                    color: maintenanceMode ? "#ffffff" : "var(--text-secondary)",
                    border: "0.5px solid var(--border-primary)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    cursor: "pointer",
                  }}
                >
                  {maintenanceMode ? "ACTIVE" : "OFF"}
                </button>
              </div>

              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", fontFamily: "monospace" }}>
                  SERVICES CONNECTIVITY:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10.5px", fontFamily: "monospace" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981" }}>
                    <span>● FastAPI Backend</span>
                    <span>ONLINE (PORT 8000)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981" }}>
                    <span>● PostgreSQL 16 DB</span>
                    <span>CONNECTED (PORT 5432)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-accent)" }}>
                    <span>● Amina AI LLM</span>
                    <span>READY (PORT 11434)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border-primary)" }}>
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "0.5px solid var(--border-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    fontFamily: "monospace",
                  }}
                >
                  {isAr
                    ? "سجل النشاطات والأحداث الأمنية"
                    : isFr
                    ? "Journal des Événements et Actions Administrateur"
                    : "Administrator Audit & Security Event Stream"}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                      display: "inline-block",
                    }}
                  />
                  LIVE FEED ({audits.length})
                </span>
              </div>

              <button
                onClick={() => {
                  if (
                    confirm(
                      isAr
                        ? "هل تريد إعادة ضبط سجل العمليات إلى الإعدادات الأولية؟"
                        : "Réinitialiser le journal d'audit aux entrées initiales de référence ?"
                    )
                  ) {
                    const fresh = resetAuditLogs();
                    setAudits(fresh);
                  }
                }}
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-secondary)",
                  padding: "4px 10px",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "color 0.2s ease",
                }}
                title={isAr ? "إعادة ضبط السجل" : "Réinitialiser le journal"}
              >
                <RefreshCw size={11} />
                <span>{isAr ? "إعادة ضبط" : isFr ? "Réinitialiser" : "Reset"}</span>
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-tertiary)" }}>
                    {[
                      isAr ? "الوقت" : isFr ? "Horodatage" : "Timestamp",
                      isAr ? "المستخدم" : isFr ? "Utilisateur" : "Actor",
                      isAr ? "الإجراء" : isFr ? "Action Réalisée" : "Action Performed",
                      isAr ? "الهدف" : isFr ? "Cible" : "Target",
                    ].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "10px 16px",
                          textAlign: isAr ? "right" : "left",
                          fontSize: "9px",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border-primary)",
                          fontFamily: "monospace",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {audits.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: "32px 16px",
                          textAlign: "center",
                          color: "var(--text-tertiary)",
                          fontFamily: "monospace",
                          fontSize: "11px",
                        }}
                      >
                        {isAr ? "لا توجد سجلات حالية" : "Aucun événement consigné pour l'instant"}
                      </td>
                    </tr>
                  ) : (
                    audits.map((item) => {
                      const loc = (locale as "ar" | "fr" | "en") || "fr";
                      const badgeColor =
                        item.severity === "critical"
                          ? "#ef4444"
                          : item.severity === "warning"
                          ? "#f97316"
                          : "#0284c7";
                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: "0.5px solid var(--border-primary)",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 16px",
                              fontSize: "10.5px",
                              color: "var(--text-tertiary)",
                              fontFamily: "monospace",
                            }}
                          >
                            {item.timestamp}
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              fontFamily: "monospace",
                            }}
                          >
                            {item.user}
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: "11.5px", color: "var(--text-secondary)" }}>
                            <span
                              style={{
                                display: "inline-block",
                                width: "6px",
                                height: "6px",
                                borderRadius: "3px",
                                background: badgeColor,
                                marginRight: "8px",
                              }}
                            />
                            {item.action[loc] || item.action.fr}
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              fontSize: "10.5px",
                              color: "var(--color-accent)",
                              fontFamily: "monospace",
                            }}
                          >
                            {item.target}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Add User Modal ────────────────────────────────────────── */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg-tertiary)",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "monospace" }}>
                {isAr ? "إضافة مستخدم جديد في PostgreSQL" : isFr ? "Créer un Nouvel Utilisateur (PostgreSQL)" : "Create New User (PostgreSQL)"}
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddUser} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "الاسم الكامل" : isFr ? "Nom Complet :" : "Full Name:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Ben Salem"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "البريد الإلكتروني المهني" : isFr ? "Email Professionnel :" : "Official Email:"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. a.bensalem@gov.tn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "كلمة المرور المؤقتة" : isFr ? "Mot de Passe Initial (Défaut : Ancs@2026) :" : "Initial Password:"}
                </label>
                <input
                  type="password"
                  placeholder="Ancs@2026"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {isAr ? "الدور" : isFr ? "Rôle (RBAC) :" : "Role:"}
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "auditor" | "viewer" })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                  >
                    <option value="viewer">Viewer (Observateur)</option>
                    <option value="auditor">Auditor (Auditeur)</option>
                    <option value="admin">Admin (Administrateur)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {isAr ? "المؤسسة" : isFr ? "Organisation :" : "Organization:"}
                  </label>
                  <select
                    value={newUser.organization}
                    onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "11px",
                    }}
                  >
                    <option value="Agence Nationale CyberSécurité (ANCS)">ANCS</option>
                    <option value="Ministère des Finances">Min. Finances</option>
                    <option value="Ministère de la Santé">Min. Santé</option>
                    <option value="Ministère de l'Éducation">Min. Éducation</option>
                    <option value="Ministère de la Défense">Min. Défense</option>
                    <option value="Ministère de la Justice">Min. Justice</option>
                    <option value="Ministère du Transport">Min. Transport</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-secondary)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  {isAr ? "إلغاء" : isFr ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "var(--color-accent)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  {isAr ? "تأكيد الإضافة في قاعدة البيانات" : isFr ? "Enregistrer dans PostgreSQL" : "Save in PostgreSQL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Edit Organization Modal ───────────────────────────────── */}
      {showEditOrgModal && editingOrg && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg-tertiary)",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "monospace" }}>
                {isAr ? "تعديل بيانات المؤسسة والحساسية" : isFr ? "Modifier l'Organisation & la Criticité" : "Edit Organization & Criticality"}
              </span>
              <button
                onClick={() => {
                  setShowEditOrgModal(false);
                  setEditingOrg(null);
                }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditedOrg} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "اسم المؤسسة (FR) :" : isFr ? "Nom de l'Organisation :" : "Organization Name:"}
                </label>
                <input
                  type="text"
                  required
                  value={editingOrg.name.fr}
                  onChange={(e) =>
                    setEditingOrg({
                      ...editingOrg,
                      name: { ...editingOrg.name, fr: e.target.value },
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {isAr ? "القطاع :" : isFr ? "Secteur :" : "Sector:"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOrg.sector.fr}
                    onChange={(e) =>
                      setEditingOrg({
                        ...editingOrg,
                        sector: { ...editingOrg.sector, fr: e.target.value },
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "12px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {isAr ? "عدد المواقع المراقبة :" : isFr ? "Sites Supervisés :" : "Monitored Sites:"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    required
                    value={editingOrg.siteCount}
                    onChange={(e) =>
                      setEditingOrg({
                        ...editingOrg,
                        siteCount: Number(e.target.value) || 1,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
              </div>

              {/* Criticality Selector 1-5 */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr
                    ? "درجة الأهمية والحساسية الوطنية (1 إلى 5) :"
                    : isFr
                    ? "Niveau de Criticité Nationale (1 à 5 barres) :"
                    : "National Criticality Level (1 to 5):"}
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setEditingOrg({ ...editingOrg, criticality: lvl })}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        background: editingOrg.criticality === lvl ? "#ef4444" : "var(--bg-tertiary)",
                        color: editingOrg.criticality === lvl ? "#ffffff" : "var(--text-secondary)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {lvl}/5
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Websites Management Section ───────────────────── */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Globe size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                  {isAr ? "النطاقات المراقبة (URLs) :" : isFr ? "Domaines Supervisés (URLs) :" : "Monitored Domains (URLs):"}
                </label>

                {/* Existing websites list */}
                <div style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "var(--radius-sm)",
                  maxHeight: "170px",
                  overflowY: "auto",
                  marginBottom: "8px",
                }}>
                  {editingOrg.websites && editingOrg.websites.length > 0 ? (
                    editingOrg.websites.map((url, idx) => {
                      const domain = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
                      const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "7px 12px",
                            borderBottom: idx < editingOrg.websites.length - 1 ? "0.5px solid var(--border-primary)" : "none",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              flex: 1,
                              minWidth: 0,
                              textDecoration: "none",
                              color: "inherit",
                            }}
                            title={isAr ? `زيارة الموقع: ${fullUrl}` : `Visiter le site: ${fullUrl}`}
                          >
                            <ExternalLink size={11} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                            <span style={{
                              fontSize: "11px",
                              fontFamily: "monospace",
                              color: "var(--color-accent)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}>
                              {domain}
                            </span>
                            <span style={{ fontSize: "9px", color: "var(--text-tertiary)", fontFamily: "monospace", flexShrink: 0 }}>
                              {url.startsWith("https") ? "🔒" : "⚠️"}
                            </span>
                          </a>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-primary)",
                                borderRadius: "var(--radius-sm)",
                                padding: "3px 7px",
                                fontSize: "10px",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                              title={isAr ? "معاينة الرابط في تبويب جديد" : "Ouvrir le lien dans un nouvel onglet"}
                            >
                              <Eye size={10} />
                              <span>{isAr ? "معاينة" : isFr ? "Voir" : "View"}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingOrg.websites || []).filter((_, i) => i !== idx);
                                setEditingOrg({ ...editingOrg, websites: updated, siteCount: updated.length });
                              }}
                              title={isAr ? "حذف هذا النطاق" : isFr ? "Retirer ce domaine" : "Remove this domain"}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                padding: "2px 4px",
                                display: "flex",
                                alignItems: "center",
                                opacity: 0.7,
                                transition: "opacity 0.15s ease",
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: "16px 12px", textAlign: "center", fontSize: "11px", color: "var(--text-tertiary)", fontStyle: "italic" }}>
                      {isAr ? "لم يتم تسجيل أي نطاق بعد" : isFr ? "Aucun domaine enregistré" : "No domains registered yet"}
                    </div>
                  )}
                </div>

                {/* Add new website input */}
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    placeholder="e.g. https://www.defense.tn"
                    value={editNewWebsiteUrl}
                    onChange={(e) => setEditNewWebsiteUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        let trimmed = editNewWebsiteUrl.trim();
                        if (trimmed) {
                          if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                            trimmed = `https://${trimmed}`;
                          }
                          const cur = Array.isArray(editingOrg.websites) ? editingOrg.websites : [];
                          if (!cur.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
                            const updated = [...cur, trimmed];
                            setEditingOrg({ ...editingOrg, websites: updated, siteCount: updated.length });
                            setEditNewWebsiteUrl("");
                          }
                        }
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "7px 10px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      let trimmed = editNewWebsiteUrl.trim();
                      if (trimmed) {
                        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                          trimmed = `https://${trimmed}`;
                        }
                        const cur = Array.isArray(editingOrg.websites) ? editingOrg.websites : [];
                        if (!cur.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
                          const updated = [...cur, trimmed];
                          setEditingOrg({ ...editingOrg, websites: updated, siteCount: updated.length });
                          setEditNewWebsiteUrl("");
                        }
                      }
                    }}
                    style={{
                      padding: "7px 12px",
                      background: "var(--color-accent)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "monospace",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Plus size={12} />
                    {isAr ? "إضافة" : isFr ? "Ajouter" : "Add"}
                  </button>
                </div>

                {/* Website count summary */}
                <div style={{ marginTop: "6px", fontSize: "10px", color: "var(--text-tertiary)", fontFamily: "monospace" }}>
                  {isAr
                    ? `${editingOrg.websites?.length || 0} نطاق مسجل — يتم تحديث العدد تلقائيًا عند الحفظ`
                    : isFr
                    ? `${editingOrg.websites?.length || 0} domaine(s) enregistré(s) — le compteur est synchronisé automatiquement`
                    : `${editingOrg.websites?.length || 0} domain(s) registered — count auto-synced on save`}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "البريد الإلكتروني للاتصال الأمني (SOC) :" : isFr ? "Contact Sécurité / CSIRT :" : "Security / SOC Contact Email:"}
                </label>
                <input
                  type="email"
                  required
                  value={editingOrg.contactEmail}
                  onChange={(e) =>
                    setEditingOrg({
                      ...editingOrg,
                      contactEmail: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditOrgModal(false);
                    setEditingOrg(null);
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-secondary)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  {isAr ? "إلغاء" : isFr ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "var(--color-accent)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Save size={13} />
                  <span>{isAr ? "حفظ التغييرات" : isFr ? "Enregistrer" : "Save"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Organization Modal ──────────────────────────────────── */}
      {showAddOrgModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.65)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg-tertiary)",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "monospace" }}>
                {isAr ? "تسجيل وزارة أو مؤسسة جديدة" : isFr ? "Enrôler une Nouvelle Organisation" : "Enroll New Organization"}
              </span>
              <button
                onClick={() => setShowAddOrgModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddOrg} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "اسم المؤسسة (بالفرنسية) :" : isFr ? "Nom de l'Organisation (Français) :" : "Organization Name (FR):"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ministère de l'Intérieur"
                  value={newOrg.nameFr}
                  onChange={(e) => setNewOrg({ ...newOrg, nameFr: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "اسم المؤسسة (بالعربية) :" : isFr ? "Nom de l'Organisation (Arabe) :" : "Organization Name (AR):"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. وزارة الداخلية"
                  value={newOrg.nameAr}
                  onChange={(e) => setNewOrg({ ...newOrg, nameAr: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {isAr ? "القطاع :" : isFr ? "Secteur :" : "Sector:"}
                  </label>
                  <select
                    value={newOrg.sectorFr}
                    onChange={(e) => setNewOrg({ ...newOrg, sectorFr: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "11px",
                    }}
                  >
                    <option value="Finance">Finance</option>
                    <option value="Santé">Santé</option>
                    <option value="Technologies">Technologies</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Transport">Transport</option>
                    <option value="Défense & Sécurité">Défense & Sécurité</option>
                    <option value="Justice">Justice</option>
                    <option value="Intérieur">Intérieur</option>
                    <option value="Énergie">Énergie</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {isAr ? "عدد المواقع :" : isFr ? "Sites Supervisés :" : "Monitored Sites:"}
                  </label>
                  <div style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--color-accent)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    textAlign: "center",
                  }}>
                    {newOrg.websites.length}
                  </div>
                </div>
              </div>

              {/* ── Websites for New Org ───────────────────── */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Globe size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                  {isAr ? "النطاقات المراقبة :" : isFr ? "Domaines à Superviser :" : "Domains to Monitor:"}
                </label>

                {/* Current websites list */}
                {newOrg.websites.length > 0 && (
                  <div style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-sm)",
                    maxHeight: "120px",
                    overflowY: "auto",
                    marginBottom: "8px",
                  }}>
                    {newOrg.websites.map((url, idx) => {
                      const domain = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
                      const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 10px",
                            borderBottom: idx < newOrg.websites.length - 1 ? "0.5px solid var(--border-primary)" : "none",
                          }}
                        >
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              textDecoration: "none",
                              color: "inherit",
                              flex: 1,
                              minWidth: 0,
                            }}
                            title={isAr ? `زيارة الموقع: ${fullUrl}` : `Visiter le site: ${fullUrl}`}
                          >
                            <ExternalLink size={10} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: "10.5px", fontFamily: "monospace", color: "var(--color-accent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {domain}
                            </span>
                            <span style={{ fontSize: "9px", color: "var(--text-tertiary)", fontFamily: "monospace", flexShrink: 0 }}>
                              {url.startsWith("https") ? "🔒" : "⚠️"}
                            </span>
                          </a>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-primary)",
                                borderRadius: "var(--radius-sm)",
                                padding: "2px 5px",
                                fontSize: "9.5px",
                                color: "var(--text-secondary)",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "2px",
                              }}
                              title={isAr ? "معاينة" : "Voir"}
                            >
                              <Eye size={9} />
                              <span>{isAr ? "معاينة" : isFr ? "Voir" : "View"}</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = newOrg.websites.filter((_, i) => i !== idx);
                                setNewOrg({ ...newOrg, websites: updated, siteCount: updated.length || 1 });
                              }}
                              style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add URL input */}
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    placeholder="e.g. https://www.example.gov.tn"
                    value={newWebsiteUrl}
                    onChange={(e) => setNewWebsiteUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        let trimmed = newWebsiteUrl.trim();
                        if (trimmed) {
                          if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                            trimmed = `https://${trimmed}`;
                          }
                          const cur = Array.isArray(newOrg.websites) ? newOrg.websites : [];
                          if (!cur.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
                            setNewOrg({ ...newOrg, websites: [...cur, trimmed], siteCount: cur.length + 1 });
                            setNewWebsiteUrl("");
                          }
                        }
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "7px 10px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-primary)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                      fontSize: "11px",
                      fontFamily: "monospace",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      let trimmed = newWebsiteUrl.trim();
                      if (trimmed) {
                        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
                          trimmed = `https://${trimmed}`;
                        }
                        const cur = Array.isArray(newOrg.websites) ? newOrg.websites : [];
                        if (!cur.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
                          setNewOrg({ ...newOrg, websites: [...cur, trimmed], siteCount: cur.length + 1 });
                          setNewWebsiteUrl("");
                        }
                      }
                    }}
                    style={{
                      padding: "7px 12px",
                      background: "var(--color-accent)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "monospace",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Plus size={12} />
                    {isAr ? "إضافة" : isFr ? "Ajouter" : "Add"}
                  </button>
                </div>
              </div>

              {/* Criticality Selector 1-5 */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {isAr
                    ? "درجة الأهمية والحساسية (1 إلى 5) :"
                    : isFr
                    ? "Niveau de Criticité Nationale (1 à 5) :"
                    : "National Criticality (1 to 5):"}
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setNewOrg({ ...newOrg, criticality: lvl })}
                      style={{
                        flex: 1,
                        padding: "8px 0",
                        background: newOrg.criticality === lvl ? "#ef4444" : "var(--bg-tertiary)",
                        color: newOrg.criticality === lvl ? "#ffffff" : "var(--text-secondary)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      {lvl}/5
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {isAr ? "البريد الإلكتروني للاتصال الأمني :" : isFr ? "Email Contact Sécurité / CSIRT :" : "Security Contact Email:"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="secops@ministere.gov.tn"
                  value={newOrg.contactEmail}
                  onChange={(e) => setNewOrg({ ...newOrg, contactEmail: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddOrgModal(false)}
                  style={{
                    padding: "8px 16px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-secondary)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "monospace",
                  }}
                >
                  {isAr ? "إلغاء" : isFr ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    background: "var(--color-accent)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "monospace",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Plus size={13} />
                  <span>{isAr ? "تأكيد الإضافة" : isFr ? "Enregistrer" : "Enroll"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
