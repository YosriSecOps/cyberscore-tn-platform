"use client";

/**
 * AminaAvatar3D — Full Three.js 3D Avatar with Mixamo → MetaPerson Retargeting
 * 
 * Architecture:
 * 1. Load amina.glb (mesh + MetaPerson skeleton)
 * 2. Load idle.fbx, talking.fbx, thinking.fbx, wave.fbx (Mixamo animations)
 * 3. Retarget: strip "mixamorig:" prefix from animation tracks
 * 4. Apply retargeted clips to model's AnimationMixer
 * 5. Switch animations based on isTalking / mood props
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// ── Types ────────────────────────────────────────────────

interface AminaAvatarProps {
  isTalking: boolean;
  mood?: "idle" | "thinking" | "explaining" | "greeting";
}

// ── Retargeting Function ─────────────────────────────────

function retargetClip(clip: THREE.AnimationClip, label: string): THREE.AnimationClip {
  const retargeted = clip.clone();
  retargeted.name = label;

  retargeted.tracks.forEach((track) => {
    const originalName = track.name;
    // Strip "mixamorig:" prefix for MetaPerson compatibility
    track.name = track.name.replace(/mixamorig:/g, "");

    // Debug: log first few remappings
    if (originalName !== track.name) {
      // Only log unique bone names (first track per bone)
      if (track.name.endsWith(".quaternion") && !track.name.includes("Spine")) return;
    }
  });

  return retargeted;
}

// ── Animation Loader Hook ────────────────────────────────

function useRetargetedAnimations(modelScene: THREE.Group) {
  const [clips, setClips] = useState<Record<string, THREE.AnimationClip>>({});
  const [loaded, setLoaded] = useState(false);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    const animFiles: Record<string, string> = {
      idle: "/models/idle.fbx",
      talking: "/models/talking.fbx",
      thinking: "/models/thinking.fbx",
      wave: "/models/wave.fbx",
    };

    // ── Debug: Log model bone names ──
    console.group("🦴 [AminaAvatar3D] Model Skeleton Bones:");
    const bones: string[] = [];
    modelScene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        bones.push(child.name);
      }
    });
    console.log("MetaPerson bones:", bones.slice(0, 20), `... (${bones.length} total)`);
    console.groupEnd();

    // ── Load all FBX animations ──
    const loadedClips: Record<string, THREE.AnimationClip> = {};
    let loadCount = 0;
    const totalFiles = Object.keys(animFiles).length;

    Object.entries(animFiles).forEach(([name, path]) => {
      loader.load(
        path,
        (fbx) => {
          if (fbx.animations.length > 0) {
            const originalClip = fbx.animations[0];

            // ── Debug: Log original bone names from FBX ──
            console.group(`🎬 [AminaAvatar3D] Animation "${name}" loaded:`);
            const fbxTrackNames = originalClip.tracks
              .filter((t) => t.name.endsWith(".quaternion"))
              .map((t) => t.name.replace(".quaternion", ""))
              .slice(0, 10);
            console.log("Original FBX bones:", fbxTrackNames);

            // Retarget
            const retargeted = retargetClip(originalClip, name);

            const retargetedNames = retargeted.tracks
              .filter((t) => t.name.endsWith(".quaternion"))
              .map((t) => t.name.replace(".quaternion", ""))
              .slice(0, 10);
            console.log("After retargeting:", retargetedNames);
            console.groupEnd();

            loadedClips[name] = retargeted;
          } else {
            console.warn(`⚠️ [AminaAvatar3D] No animations found in ${path}`);
          }

          loadCount++;
          if (loadCount === totalFiles) {
            console.log(`✅ [AminaAvatar3D] All ${totalFiles} animations loaded:`, Object.keys(loadedClips));
            setClips(loadedClips);
            setLoaded(true);
          }
        },
        undefined,
        (err) => {
          console.error(`❌ [AminaAvatar3D] Failed to load ${path}:`, err);
          loadCount++;
          if (loadCount === totalFiles) {
            setClips(loadedClips);
            setLoaded(true);
          }
        }
      );
    });
  }, [modelScene]);

  return { clips, loaded, mixerRef };
}

// ── 3D Model Component ──────────────────────────────────

function AminaModel({ isTalking, mood = "idle" }: AminaAvatarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/amina.glb");

  // Apply shadows and disable frustum culling to original scene
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh || (child as THREE.SkinnedMesh).isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false; // Fix disappearing body parts during animation
      }
    });
  }, [scene]);

  const { clips, loaded, mixerRef } = useRetargetedAnimations(scene);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const currentActionRef = useRef<string>("idle");

  // Create mixer and actions once clips are loaded
  useEffect(() => {
    if (!loaded || !group.current) return;

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    // Create actions from retargeted clips
    const actions: Record<string, THREE.AnimationAction> = {};
    Object.entries(clips).forEach(([name, clip]) => {
      const action = mixer.clipAction(clip);
      actions[name] = action;
    });
    actionsRef.current = actions;

    // Start with idle or wave
    const startAnim = actions["wave"] || actions["idle"];
    if (startAnim) {
      startAnim.reset().fadeIn(0.5).play();
      currentActionRef.current = actions["wave"] ? "wave" : "idle";

      // After wave, transition to idle
      if (actions["wave"] && actions["idle"]) {
        setTimeout(() => {
          actions["wave"]?.fadeOut(0.5);
          actions["idle"]?.reset().fadeIn(0.5).play();
          currentActionRef.current = "idle";
        }, 3000);
      }
    }

    console.log("🎮 [AminaAvatar3D] Mixer created, available actions:", Object.keys(actions));

    return () => {
      mixer.stopAllAction();
    };
  }, [loaded, clips, scene, mixerRef]);

  // Switch animations based on props
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions || Object.keys(actions).length === 0) return;

    let targetAnim = "idle";
    if (isTalking) {
      targetAnim = "talking";
    } else if (mood === "thinking") {
      targetAnim = "thinking";
    } else if (mood === "greeting") {
      targetAnim = "wave";
    }

    // Don't switch if already playing
    if (targetAnim === currentActionRef.current) return;

    const currentAction = actions[currentActionRef.current];
    const nextAction = actions[targetAnim];

    if (nextAction) {
      currentAction?.fadeOut(0.4);
      nextAction.reset().fadeIn(0.4).play();
      currentActionRef.current = targetAnim;
      console.log(`🔄 [AminaAvatar3D] Animation: ${currentActionRef.current} → ${targetAnim}`);
    }
  }, [isTalking, mood]);

  // Find the head mesh that has morph targets (for lip sync)
  const headMeshRef = useRef<THREE.SkinnedMesh | null>(null);
  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.SkinnedMesh;
      if (mesh.isSkinnedMesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        // Pick the mesh with the most morph targets (usually the head/face)
        if (!headMeshRef.current || 
            Object.keys(mesh.morphTargetDictionary).length > 
            Object.keys(headMeshRef.current.morphTargetDictionary || {}).length) {
          headMeshRef.current = mesh;
        }
      }
    });

    if (headMeshRef.current) {
      console.log("🗣️ [AminaAvatar3D] Morph targets found:", 
        Object.keys(headMeshRef.current.morphTargetDictionary || {}));
    } else {
      console.warn("⚠️ [AminaAvatar3D] No morph targets found — lip sync disabled");
    }
  }, [scene]);

  // Lip sync: viseme indices for mouth movement
  const lipSyncPhase = useRef(0);

  // Update mixer every frame + lip sync
  useFrame((_, delta) => {
    mixerRef.current?.update(delta);

    // Subtle idle sway
    if (group.current) {
      group.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.03;
    }

    // Procedural lip sync when talking
    const mesh = headMeshRef.current;
    if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;

      // Common viseme/morph target names across avatar platforms
      const mouthKeys = [
        "mouthOpen", "jawOpen", "viseme_aa", "viseme_O", "viseme_E",
        "viseme_I", "viseme_U", "viseme_FF", "viseme_SS", "viseme_TH",
        "viseme_CH", "viseme_PP", "viseme_DD", "viseme_kk", "viseme_nn",
        "viseme_RR", "viseme_sil",
        // ARKit names
        "jawOpen", "mouthFunnel", "mouthPucker", "mouthLeft", "mouthRight",
        "mouthSmile_L", "mouthSmile_R", "mouthFrown_L", "mouthFrown_R",
        "mouthClose", "mouthShrugUpper", "mouthShrugLower",
        // MetaPerson names
        "Jaw_Open", "Mouth_Open", "A", "O", "E", "U",
      ];

      if (isTalking) {
        lipSyncPhase.current += delta * 12; // Speed of mouth movement

        // Find available mouth morph targets
        const available = mouthKeys.filter((k) => dict[k] !== undefined);

        if (available.length > 0) {
          // Cycle through available mouth shapes
          const mainKey = available[0]; // primary open mouth
          const mainIdx = dict[mainKey];

          // Sine wave for open/close, with randomness for natural feel
          const openAmount = Math.max(0, Math.sin(lipSyncPhase.current) * 0.6 + 
            Math.sin(lipSyncPhase.current * 2.3) * 0.2);
          influences[mainIdx] = openAmount;

          // If we have secondary mouth shapes, add subtle variation
          if (available.length > 1) {
            const secKey = available[1];
            const secIdx = dict[secKey];
            influences[secIdx] = Math.max(0, Math.sin(lipSyncPhase.current * 1.7) * 0.3);
          }
          if (available.length > 2) {
            const terKey = available[2];
            const terIdx = dict[terKey];
            influences[terIdx] = Math.max(0, Math.cos(lipSyncPhase.current * 0.9) * 0.25);
          }
        }
      } else {
        // Reset all mouth morph targets when not talking
        lipSyncPhase.current = 0;
        const available = mouthKeys.filter((k) => dict[k] !== undefined);
        available.forEach((key) => {
          const idx = dict[key];
          if (influences[idx] > 0) {
            influences[idx] = Math.max(0, influences[idx] - delta * 5); // Smooth close
          }
        });
      }
    }
  });

  return (
    <group ref={group} position={[0, -0.6, 0]} scale={1.3}>
      <primitive object={scene} />
    </group>
  );
}

// ── Loading Indicator ────────────────────────────────────

function LoadingIndicator() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#38bdf8" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

// ── Main 3D Canvas ──────────────────────────────────────

export default function AminaAvatar3D({ isTalking, mood }: AminaAvatarProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 1.4, 2.6], fov: 30 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        shadows
      >
        {/* Lighting — institutional, not dramatic */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Subtle blue rim light for SOC feel */}
        <directionalLight position={[-2, 3, -2]} intensity={0.3} color="#38bdf8" />
        <pointLight position={[0, 2, 3]} intensity={0.2} color="#ffffff" />

        {/* Environment */}
        <Environment preset="city" />

        {/* Model with Suspense fallback */}
        <React.Suspense fallback={<LoadingIndicator />}>
          <AminaModel isTalking={isTalking} mood={mood} />
        </React.Suspense>

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -0.6, 0]}
          opacity={0.35}
          scale={5}
          blur={2.5}
          far={4}
        />

        {/* Camera controls — very restricted for portrait framing */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, 1.2, 0]}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
        />
      </Canvas>

      {/* Name overlay — High contrast SOC Glassmorphism Badge */}
      <div style={{
        position: "absolute",
        bottom: "14px",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        background: "rgba(15, 23, 42, 0.82)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(56, 189, 248, 0.35)",
        borderRadius: "4px",
        padding: "6px 18px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.45)",
        minWidth: "160px",
        pointerEvents: "none",
      }}>
        <div className="soc-font-mono" style={{
          fontSize: "14px",
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
    </div>
  );
}

// Preload
useGLTF.preload("/models/amina.glb");
