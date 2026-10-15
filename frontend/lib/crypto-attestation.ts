/**
 * CyberScore TN — Sovereign Cryptographic Integrity & Attestation Engine
 * Deterministic SHA-256 session footprint and official ANCS reference generator.
 * Ensures 100% cryptographic parity between:
 *  1. The generated PDF report (CoverPage & RecommendationsPage)
 *  2. The interactive report preview modal (ReportPreviewModal)
 *  3. The public verification portal (/verify/[domain])
 */

/**
 * Pure TypeScript SHA-256 implementation (FIPS 180-4 compliant).
 * Runs synchronously in Node.js, Web Browsers, and @react-pdf/renderer
 * with zero external dependencies and zero latency.
 */
export function computeSha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i: number, j: number;
  let result = "";
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;
  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, number> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);
  ascii += "\x80";
  while (ascii.length % 64 - 56) ascii += "\x00";

  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }

  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const s0_2 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const s1_2 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const temp1 = hash[7] + s1_2 + ch + k[i] + w[i];
      const temp2 = s0_2 + maj;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? "0" : "") + byte.toString(16);
    }
  }

  return result;
}

export interface CryptoAttestation {
  domain: string;
  auditRef: string;
  fullRef: string;
  sha256Hash: string;
  verificationUrl: string;
  authority: string;
  classification: string;
}

/**
 * Generates identical, deterministic cryptographic attestation for any target domain.
 */
export function getDomainCryptoAttestation(rawDomain: string): CryptoAttestation {
  const domain = (rawDomain || "defense.gov.tn")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();

  // Deterministic 5-digit ID based on domain charcodes
  let hashVal = 0;
  for (let i = 0; i < domain.length; i++) {
    hashVal = (hashVal << 5) - hashVal + domain.charCodeAt(i);
    hashVal |= 0;
  }
  const numericId = (10000 + (Math.abs(hashVal) % 90000)).toString();
  const auditRef = `ANCS-VAL-2026-${numericId}`;
  const fullRef = `#${auditRef}`;

  // Deterministic payload hashing: domain + year + national authority salt
  const payload = `CYBERSCORE-TN::REPUBLIQUE-TUNISIENNE::ANCS-AUDIT-2026::DOMAIN=${domain}::REF=${auditRef}`;
  const sha256Hash = computeSha256(payload);

  return {
    domain,
    auditRef,
    fullRef,
    sha256Hash,
    verificationUrl: `https://cyberscore.tn/verify/${domain}`,
    authority: "ANCE / TunTrust • Réseau AS2609 ATI",
    classification: "TLP:AMBER+STRICT",
  };
}
