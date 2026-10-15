"use client";

/**
 * AminaAvatar — 3D Avatar Display for CyberScore TN
 * 
 * Strategy:
 * - If a .glb model exists at /models/amina.glb → renders full 3D avatar with Three.js
 * - Otherwise → renders the beautiful 2D character illustration with ambient animations
 * 
 * The 3D path uses @react-three/fiber + drei for:
 * - Loading the GLB model with useGLTF
 * - Playing animations (idle, talking) with useAnimations
 * - Syncing the "talking" state with chat streaming
 */

import React, { useState, useEffect, useRef, Suspense } from "react";

// ── Types ────────────────────────────────────────────────

interface AminaAvatarProps {
  isTalking: boolean;
  mood?: "idle" | "thinking" | "explaining" | "greeting";
}

// ── 2D Animated Avatar (Default / Fallback) ─────────────

function Avatar2D({ isTalking, mood = "idle" }: AminaAvatarProps) {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Subtle breathing animation
  const breathScale = 1 + Math.sin(pulsePhase * 0.02) * 0.008;
  // Glow intensity based on state
  const glowIntensity = isTalking ? 0.6 + Math.sin(pulsePhase * 0.1) * 0.3 : 0.2;

  const statusText = isTalking ? "Amina parle..." : mood === "thinking" ? "Réflexion..." : "En ligne";
  const statusColor = isTalking ? "#38bdf8" : "#10b981";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(56, 189, 248, ${glowIntensity * 0.15}) 0%, transparent 70%)`,
        filter: "blur(40px)",
        transition: "all 0.3s",
      }} />

      {/* Hexagonal tech frame */}
      <div style={{
        position: "relative",
        width: "220px",
        height: "220px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Rotating ring */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            animation: "spin 20s linear infinite",
          }}
        >
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={glowIntensity} />
              <stop offset="50%" stopColor="#1d4ed8" stopOpacity={glowIntensity * 0.5} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={glowIntensity} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke="url(#ring-gradient)" strokeWidth="1" strokeDasharray="8 12" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="0.5" />
        </svg>

        {/* Avatar image */}
        <div style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid rgba(56, 189, 248, ${glowIntensity})`,
          boxShadow: `0 0 ${isTalking ? 30 : 15}px rgba(56, 189, 248, ${glowIntensity * 0.4})`,
          transform: `scale(${breathScale})`,
          transition: "box-shadow 0.3s, border-color 0.3s",
        }}>
          <img
            src="/Avatar_Amina.png"
            alt="Amina — AI Assistant"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 8%",
            }}
          />
        </div>
      </div>

      {/* Name & Status — High contrast SOC Badge */}
      <div style={{
        marginTop: "16px",
        textAlign: "center",
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(56, 189, 248, 0.3)",
        borderRadius: "4px",
        padding: "6px 18px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      }}>
        <div className="soc-font-mono" style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "3px",
          textShadow: "0 0 10px rgba(56, 189, 248, 0.7)",
        }}>
          AMINA
        </div>
        <div className="soc-font-mono" style={{
          fontSize: "9px",
          color: "#38bdf8",
          letterSpacing: "1.5px",
          fontWeight: 600,
          marginTop: "2px",
        }}>
          AI SECURITY ANALYST
        </div>
      </div>

      {/* Status indicator */}
      <div style={{
        marginTop: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 16px",
        borderRadius: "2px",
        border: `1px solid ${statusColor}33`,
        background: `${statusColor}0D`,
      }}>
        <div style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: statusColor,
          boxShadow: `0 0 8px ${statusColor}`,
          animation: isTalking ? "blink 1s ease-in-out infinite" : "none",
        }} />
        <span className="soc-font-mono" style={{
          fontSize: "10px",
          color: statusColor,
          letterSpacing: "1px",
        }}>
          {statusText.toUpperCase()}
        </span>
      </div>

      {/* Audio wave visualizer when talking */}
      {isTalking && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "3px",
          marginTop: "12px",
          height: "24px",
        }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                borderRadius: "1px",
                backgroundColor: "#38bdf8",
                animation: `audioBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}

      {/* Inject keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes audioBar {
          0% { height: 4px; }
          100% { height: 20px; }
        }
      `}</style>
    </div>
  );
}

// ── 3D Avatar (When .glb model is available) ────────────

let ThreeAvatar: React.ComponentType<AminaAvatarProps> | null = null;

// We lazy-load the 3D component only if Three.js is available
// This prevents SSR issues and bundle bloat when 3D isn't used
function Avatar3DWrapper(props: AminaAvatarProps) {
  const [has3D, setHas3D] = useState(false);
  const [Model, setModel] = useState<React.ComponentType<AminaAvatarProps> | null>(null);

  useEffect(() => {
    // Check if the GLB model file exists
    fetch("/models/amina.glb", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          // Dynamically import the 3D component
          import("./AminaAvatar3D").then((mod) => {
            setModel(() => mod.default);
            setHas3D(true);
          }).catch(() => setHas3D(false));
        }
      })
      .catch(() => setHas3D(false));
  }, []);

  if (has3D && Model) {
    return (
      <Suspense fallback={<Avatar2D {...props} />}>
        <Model {...props} />
      </Suspense>
    );
  }

  return <Avatar2D {...props} />;
}

// ── Export ───────────────────────────────────────────────

export default function AminaAvatar(props: AminaAvatarProps) {
  return <Avatar3DWrapper {...props} />;
}
