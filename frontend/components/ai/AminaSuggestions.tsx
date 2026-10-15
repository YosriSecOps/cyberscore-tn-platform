"use client";

import React from "react";
import { ShieldQuestion, Wrench, ListChecks, FileBarChart, Sparkles } from "lucide-react";

interface AminaSuggestionsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
  target?: string;
}

export default function AminaSuggestions({ onSelect, disabled, target }: AminaSuggestionsProps) {
  const suggestions = [
    {
      icon: <ShieldQuestion size={14} />,
      label: target ? `Score de ${target} ?` : "Pourquoi ce score ?",
      prompt: target
        ? `Explique-moi en détail pourquoi le site ${target} a obtenu son score actuel et quels sont les facteurs pénalisants.`
        : "Explique-moi pourquoi le score est bas et quels sont les principaux facteurs.",
      color: "#0284c7", // Sky Blue
      border: "rgba(2, 132, 199, 0.35)",
      bg: "rgba(2, 132, 199, 0.08)",
      bgHover: "rgba(2, 132, 199, 0.18)",
    },
    {
      icon: <Wrench size={14} />,
      label: target ? `Corriger ${target}` : "Comment corriger ?",
      prompt: target
        ? `Donne-moi les commandes exactes (Nginx, Apache, Linux) pour corriger les vulnérabilités de ${target}.`
        : "Donne-moi les commandes exactes pour corriger les vulnérabilités critiques sur mon serveur Nginx.",
      color: "#6366f1", // Indigo
      border: "rgba(99, 102, 241, 0.35)",
      bg: "rgba(99, 102, 241, 0.08)",
      bgHover: "rgba(99, 102, 241, 0.18)",
    },
    {
      icon: <ListChecks size={14} />,
      label: target ? `Plan d'action (${target})` : "Plan d'action",
      prompt: target
        ? `Génère une roadmap de remédiation priorisée sur 30 jours pour porter ${target} au Grade A.`
        : "Génère un plan d'action priorisé sur 30 jours pour améliorer la sécurité de ce site.",
      color: "#059669", // Emerald Green
      border: "rgba(5, 150, 105, 0.35)",
      bg: "rgba(5, 150, 105, 0.08)",
      bgHover: "rgba(5, 150, 105, 0.18)",
    },
    {
      icon: <FileBarChart size={14} />,
      label: target ? `Synthèse (${target})` : "Résumé exécutif",
      prompt: target
        ? `Rédige un résumé exécutif de la posture de sécurité de ${target}, destiné au Ministre ou Directeur non-technique.`
        : "Rédige un résumé exécutif de l'état de sécurité de ce site, destiné à un directeur non-technique.",
      color: "#d97706", // Amber / Gold
      border: "rgba(217, 119, 6, 0.35)",
      bg: "rgba(217, 119, 6, 0.08)",
      bgHover: "rgba(217, 119, 6, 0.18)",
    },
    {
      icon: <Sparkles size={14} />,
      label: "Générer Rapport PDF",
      prompt: target
        ? `Je souhaite exporter le rapport d'audit officiel 7 pages pour ${target}.`
        : "Je veux télécharger le rapport PDF complet de ce scan.",
      color: "#9333ea", // Purple / Violet
      border: "rgba(147, 51, 234, 0.35)",
      bg: "rgba(147, 51, 234, 0.08)",
      bgHover: "rgba(147, 51, 234, 0.18)",
    }
  ];

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      justifyContent: "center",
    }}>
      {suggestions.map((s, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={() => onSelect(s.prompt)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 13px",
            borderRadius: "20px",
            border: `1px solid ${s.border}`,
            background: s.bg,
            color: s.color,
            fontSize: "12px",
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = s.color;
              e.currentTarget.style.background = s.bgHover;
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${s.border}`;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = s.border;
              e.currentTarget.style.background = s.bg;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          {s.icon}
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}
