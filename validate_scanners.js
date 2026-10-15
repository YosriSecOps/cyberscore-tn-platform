/**
 * CyberScore TN — Scanner Engine Validation
 * ===========================================
 * Tests the scan logic against real websites using Node.js.
 * No backend/Docker needed — directly validates SSL, Headers, DNS, Email.
 *
 * Usage: node validate_scanners.js
 */

const tls = require('tls');
const https = require('https');
const http = require('http');
const dns = require('dns').promises;
const { URL } = require('url');

// ── Colors ──────────────────────────────────────────────
const C = {
  RED: '\x1b[91m', GREEN: '\x1b[92m', YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m', MAGENTA: '\x1b[95m', CYAN: '\x1b[96m',
  WHITE: '\x1b[97m', BOLD: '\x1b[1m', DIM: '\x1b[2m',
  RESET: '\x1b[0m',
};

// ── Category weights (matching backend/app/scanners/base.py) ──
const CATEGORY_WEIGHTS = {
  ssl:          { weight: 0.12, max_score: 12, label: 'SSL/TLS Security' },
  headers:      { weight: 0.10, max_score: 10, label: 'Security Headers' },
  cookie:       { weight: 0.04, max_score: 4,  label: 'Cookie Security' },
  csp:          { weight: 0.05, max_score: 5,  label: 'Content Security Policy' },
  dns:          { weight: 0.05, max_score: 5,  label: 'DNS Health' },
  email:        { weight: 0.04, max_score: 4,  label: 'Email Security' },
};

// ── Grade thresholds (matching score_engine.py) ──
const GRADE_THRESHOLDS = [
  [95, 'A+', 3], [90, 'A', 3], [80, 'B', 2],
  [70, 'C', 2], [60, 'D', 1], [0, 'F', 1],
];

function getGrade(score) {
  for (const [threshold, grade, stars] of GRADE_THRESHOLDS) {
    if (score >= threshold) return { grade, stars };
  }
  return { grade: 'F', stars: 1 };
}

// ── Test Targets ────────────────────────────────────────
const TARGETS = [
  {
    url: 'https://www.google.com',
    label: 'Google (référence mondiale — attendu: A/A+)',
    expectMin: 80,
  },
  {
    url: 'https://www.finances.gov.tn',
    label: 'Ministère des Finances TN (site .gov.tn)',
    expectMin: 0,
  },
  {
    url: 'https://www.education.gov.tn',
    label: 'Ministère de l\'Éducation TN (site .gov.tn)',
    expectMin: 0,
  },
];


// ══════════════════════════════════════════════════════════
//  SCANNER 1: SSL/TLS (Weight: 12%, Max: 12)
// ══════════════════════════════════════════════════════════

function scanSSL(hostname) {
  return new Promise((resolve) => {
    const findings = [];
    let score = 12;
    const start = Date.now();

    const socket = tls.connect(443, hostname, {
      servername: hostname,
      rejectUnauthorized: false, // We want to inspect even bad certs
      timeout: 15000,
    }, () => {
      const cert = socket.getPeerCertificate(true);
      const protocol = socket.getProtocol();
      const cipher = socket.getCipher();
      const authorized = socket.authorized;

      // 1. Certificate validity
      if (!authorized) {
        findings.push({ severity: 'critical', title: 'SSL Certificate Not Trusted', desc: `Authorization failed: ${socket.authorizationError}` });
        score -= 4;
      }

      // 2. Certificate expiry
      if (cert.valid_to) {
        const expiry = new Date(cert.valid_to);
        const now = new Date();
        const daysLeft = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) {
          findings.push({ severity: 'critical', title: 'SSL Certificate Expired', desc: `Expired ${Math.abs(daysLeft)} days ago` });
          score -= 4;
        } else if (daysLeft <= 30) {
          findings.push({ severity: 'high', title: 'SSL Certificate Expiring Soon', desc: `Expires in ${daysLeft} days` });
          score -= 2;
        } else if (daysLeft <= 90) {
          findings.push({ severity: 'medium', title: 'SSL Certificate Expires Within 90 Days', desc: `Expires in ${daysLeft} days` });
          score -= 1;
        } else {
          findings.push({ severity: 'info', title: '✓ Certificate Valid', desc: `Expires in ${daysLeft} days (${cert.valid_to})` });
        }
      }

      // 3. Protocol version
      if (protocol) {
        if (protocol === 'TLSv1' || protocol === 'TLSv1.0') {
          findings.push({ severity: 'high', title: 'Deprecated TLS 1.0 Detected', desc: `Protocol: ${protocol}` });
          score -= 3;
        } else if (protocol === 'TLSv1.1') {
          findings.push({ severity: 'medium', title: 'Deprecated TLS 1.1 Detected', desc: `Protocol: ${protocol}` });
          score -= 2;
        } else if (protocol === 'TLSv1.3') {
          findings.push({ severity: 'info', title: '✓ TLS 1.3 Supported', desc: `Protocol: ${protocol}` });
        } else {
          findings.push({ severity: 'info', title: `TLS Protocol: ${protocol}`, desc: `Cipher: ${cipher?.name || '?'}` });
        }
      }

      // 4. Self-signed check
      if (cert.issuer && cert.subject) {
        const issuerCN = cert.issuer.CN || '';
        const subjectCN = cert.subject.CN || '';
        if (issuerCN === subjectCN && issuerCN) {
          findings.push({ severity: 'high', title: 'Self-Signed Certificate', desc: `Issuer CN = Subject CN = ${issuerCN}` });
          score -= 3;
        }
      }

      // 5. Cipher strength
      if (cipher) {
        const weakCiphers = ['RC4', 'DES', 'MD5', '3DES', 'NULL', 'EXPORT'];
        const isWeak = weakCiphers.some(w => (cipher.name || '').toUpperCase().includes(w));
        if (isWeak) {
          findings.push({ severity: 'high', title: 'Weak Cipher Suite', desc: `Cipher: ${cipher.name}` });
          score -= 2;
        } else {
          findings.push({ severity: 'info', title: `✓ Cipher: ${cipher.name}`, desc: `Bits: ${cipher.bits || '?'}` });
        }
      }

      socket.end();
      resolve({
        category: 'ssl',
        score: Math.max(0, score),
        max_score: 12,
        weight: 0.12,
        findings,
        duration_ms: Date.now() - start,
        raw: {
          protocol,
          cipher: cipher?.name,
          authorized,
          issuer: cert.issuer?.CN || cert.issuer?.O || '?',
          subject: cert.subject?.CN || '?',
          valid_to: cert.valid_to,
          daysLeft: cert.valid_to ? Math.floor((new Date(cert.valid_to) - new Date()) / 86400000) : null,
        },
      });
    });

    socket.on('error', (err) => {
      findings.push({ severity: 'critical', title: 'No SSL/TLS Connection', desc: err.message.slice(0, 200) });
      resolve({
        category: 'ssl', score: 0, max_score: 12, weight: 0.12,
        findings, duration_ms: Date.now() - start, raw: { error: err.message },
      });
    });

    socket.setTimeout(15000, () => {
      findings.push({ severity: 'critical', title: 'SSL Connection Timeout', desc: 'Connection timed out after 15s' });
      socket.destroy();
      resolve({
        category: 'ssl', score: 0, max_score: 12, weight: 0.12,
        findings, duration_ms: Date.now() - start, raw: { error: 'timeout' },
      });
    });
  });
}


// ══════════════════════════════════════════════════════════
//  SCANNER 2: HTTP Headers (Weight: 10%, Max: 10)
// ══════════════════════════════════════════════════════════

function scanHeaders(url) {
  return new Promise((resolve) => {
    const findings = [];
    let score = 10;
    const start = Date.now();

    const doRequest = (targetUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        resolve({ category: 'headers', score: 0, max_score: 10, weight: 0.10, findings: [{ severity: 'high', title: 'Too many redirects', desc: '' }], duration_ms: Date.now() - start, raw: {} });
        return;
      }

      const parsedUrl = new URL(targetUrl);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const req = client.request(targetUrl, {
        method: 'HEAD',
        timeout: 15000,
        rejectUnauthorized: false,
        headers: { 'User-Agent': 'CyberScore-TN-Validator/1.0' },
      }, (res) => {
        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
          doRequest(redirectUrl, redirectCount + 1);
          return;
        }

        const headers = res.headers;
        const rawHeaders = {};

        // Check each security header
        const CHECKS = [
          {
            key: 'strict-transport-security', name: 'HSTS',
            severity: 'high', deduction: 2.0,
          },
          {
            key: 'x-frame-options', name: 'X-Frame-Options',
            severity: 'medium', deduction: 1.0,
          },
          {
            key: 'x-content-type-options', name: 'X-Content-Type-Options',
            severity: 'medium', deduction: 1.0,
          },
          {
            key: 'referrer-policy', name: 'Referrer-Policy',
            severity: 'low', deduction: 0.5,
          },
          {
            key: 'permissions-policy', name: 'Permissions-Policy',
            severity: 'low', deduction: 0.5,
          },
          {
            key: 'x-xss-protection', name: 'X-XSS-Protection',
            severity: 'low', deduction: 0.5,
          },
        ];

        for (const check of CHECKS) {
          const value = headers[check.key];
          rawHeaders[check.key] = value || null;

          if (!value) {
            findings.push({
              severity: check.severity,
              title: `${check.name} Header Missing`,
              desc: `The ${check.name} security header is not set`,
            });
            score -= check.deduction;
          } else {
            findings.push({
              severity: 'info',
              title: `✓ ${check.name}`,
              desc: `Value: ${String(value).slice(0, 100)}`,
            });
          }
        }

        // Check Server header info disclosure
        if (headers['server']) {
          const serverVal = headers['server'];
          if (/apache|nginx|iis|litespeed/i.test(serverVal) && /\d+\.\d+/.test(serverVal)) {
            findings.push({
              severity: 'low',
              title: 'Server Version Disclosed',
              desc: `Server: ${serverVal}`,
            });
            score -= 0.5;
          }
          rawHeaders['server'] = serverVal;
        }

        resolve({
          category: 'headers',
          score: Math.max(0, score),
          max_score: 10,
          weight: 0.10,
          findings,
          duration_ms: Date.now() - start,
          raw: rawHeaders,
        });
      });

      req.on('error', (err) => {
        findings.push({ severity: 'critical', title: 'HTTP Connection Failed', desc: err.message.slice(0, 200) });
        resolve({ category: 'headers', score: 0, max_score: 10, weight: 0.10, findings, duration_ms: Date.now() - start, raw: { error: err.message } });
      });

      req.on('timeout', () => {
        req.destroy();
        findings.push({ severity: 'high', title: 'HTTP Connection Timeout', desc: 'Request timed out after 15s' });
        resolve({ category: 'headers', score: 0, max_score: 10, weight: 0.10, findings, duration_ms: Date.now() - start, raw: { error: 'timeout' } });
      });

      req.end();
    };

    doRequest(url);
  });
}


// ══════════════════════════════════════════════════════════
//  SCANNER 3: DNS Health (Weight: 5%, Max: 5)
// ══════════════════════════════════════════════════════════

async function scanDNS(hostname) {
  const findings = [];
  let score = 5;
  const start = Date.now();
  const raw = {};

  // Clean hostname (remove www. for some checks)
  const baseDomain = hostname.replace(/^www\./, '');

  try {
    // 1. A records
    try {
      const aRecords = await dns.resolve4(hostname);
      raw.a_records = aRecords;
      findings.push({ severity: 'info', title: `✓ A Records (${aRecords.length})`, desc: aRecords.join(', ') });
    } catch {
      findings.push({ severity: 'high', title: 'No A Records', desc: `No A records for ${hostname}` });
      score -= 2;
    }

    // 2. AAAA (IPv6)
    try {
      const aaaaRecords = await dns.resolve6(hostname);
      raw.aaaa_records = aaaaRecords;
      findings.push({ severity: 'info', title: `✓ IPv6 Support (${aaaaRecords.length} AAAA)`, desc: aaaaRecords.join(', ') });
    } catch {
      findings.push({ severity: 'low', title: 'No IPv6 (AAAA) Records', desc: 'IPv6 not configured' });
      score -= 0.5;
    }

    // 3. MX records
    try {
      const mxRecords = await dns.resolveMx(baseDomain);
      raw.mx_records = mxRecords.map(r => `${r.priority} ${r.exchange}`);
      findings.push({ severity: 'info', title: `✓ MX Records (${mxRecords.length})`, desc: mxRecords.map(r => r.exchange).join(', ') });
    } catch {
      findings.push({ severity: 'medium', title: 'No MX Records', desc: 'No mail exchange records' });
      score -= 1;
    }

    // 4. NS records
    try {
      const nsRecords = await dns.resolveNs(baseDomain);
      raw.ns_records = nsRecords;
      if (nsRecords.length < 2) {
        findings.push({ severity: 'medium', title: 'Single NS Record', desc: 'Only 1 nameserver — no redundancy' });
        score -= 1;
      } else {
        findings.push({ severity: 'info', title: `✓ NS Records (${nsRecords.length})`, desc: nsRecords.join(', ') });
      }
    } catch {
      findings.push({ severity: 'medium', title: 'No NS Records', desc: 'Could not resolve nameservers' });
      score -= 1;
    }

    // 5. TXT records (check for SPF)
    try {
      const txtRecords = await dns.resolveTxt(baseDomain);
      const flatTxt = txtRecords.map(r => r.join(''));
      raw.txt_records = flatTxt;

      const spfRecord = flatTxt.find(t => t.startsWith('v=spf1'));
      if (spfRecord) {
        findings.push({ severity: 'info', title: '✓ SPF Record Found', desc: spfRecord.slice(0, 120) });
      } else {
        findings.push({ severity: 'medium', title: 'No SPF Record', desc: 'Missing v=spf1 TXT record' });
        score -= 1;
      }
    } catch {
      findings.push({ severity: 'medium', title: 'No TXT Records', desc: 'Could not resolve TXT records' });
      score -= 1;
    }

  } catch (err) {
    findings.push({ severity: 'critical', title: 'DNS Resolution Failed', desc: err.message.slice(0, 200) });
    score = 0;
  }

  return {
    category: 'dns', score: Math.max(0, score), max_score: 5, weight: 0.05,
    findings, duration_ms: Date.now() - start, raw,
  };
}


// ══════════════════════════════════════════════════════════
//  SCANNER 4: Email Security (Weight: 4%, Max: 4)
// ══════════════════════════════════════════════════════════

async function scanEmail(hostname) {
  const findings = [];
  let score = 4;
  const start = Date.now();
  const raw = {};
  const baseDomain = hostname.replace(/^www\./, '');

  try {
    // 1. SPF
    try {
      const txtRecords = await dns.resolveTxt(baseDomain);
      const flat = txtRecords.map(r => r.join(''));
      const spf = flat.find(t => t.startsWith('v=spf1'));
      if (spf) {
        raw.spf = spf;
        findings.push({ severity: 'info', title: '✓ SPF Configured', desc: spf.slice(0, 120) });

        // Check for permissive SPF
        if (spf.includes('+all')) {
          findings.push({ severity: 'high', title: 'SPF Too Permissive (+all)', desc: 'Allows any server to send emails' });
          score -= 2;
        } else if (spf.includes('~all')) {
          findings.push({ severity: 'low', title: 'SPF SoftFail (~all)', desc: 'Consider using -all for stricter policy' });
          score -= 0.5;
        }
      } else {
        findings.push({ severity: 'high', title: 'No SPF Record', desc: 'Missing SPF — email spoofing risk' });
        score -= 2;
      }
    } catch {
      findings.push({ severity: 'high', title: 'Cannot Check SPF', desc: 'TXT record lookup failed' });
      score -= 2;
    }

    // 2. DMARC
    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${baseDomain}`);
      const flat = dmarcRecords.map(r => r.join(''));
      const dmarc = flat.find(t => t.startsWith('v=DMARC1'));
      if (dmarc) {
        raw.dmarc = dmarc;
        findings.push({ severity: 'info', title: '✓ DMARC Configured', desc: dmarc.slice(0, 120) });

        if (dmarc.includes('p=none')) {
          findings.push({ severity: 'low', title: 'DMARC Policy: none', desc: 'Consider p=quarantine or p=reject' });
          score -= 0.5;
        }
      } else {
        findings.push({ severity: 'high', title: 'No DMARC Record', desc: 'Missing DMARC — email spoofing risk' });
        score -= 1.5;
      }
    } catch {
      findings.push({ severity: 'high', title: 'No DMARC Record', desc: `No _dmarc.${baseDomain} TXT record` });
      score -= 1.5;
    }

  } catch (err) {
    findings.push({ severity: 'critical', title: 'Email Security Check Failed', desc: err.message.slice(0, 200) });
    score = 0;
  }

  return {
    category: 'email', score: Math.max(0, score), max_score: 4, weight: 0.04,
    findings, duration_ms: Date.now() - start, raw,
  };
}


// ══════════════════════════════════════════════════════════
//  SCORE ENGINE (mirrors score_engine.py exactly)
// ══════════════════════════════════════════════════════════

function calculateTotalScore(results) {
  let totalWeighted = 0;
  let totalWeight = 0;
  const breakdown = [];

  for (const r of results) {
    if (r.max_score > 0) {
      const normalized = (r.score / r.max_score) * 100;
      const weighted = normalized * r.weight;
      totalWeighted += weighted;
      totalWeight += r.weight;
      breakdown.push({
        category: r.category,
        score: r.score,
        max_score: r.max_score,
        weight: r.weight,
        normalized,
        weighted,
        findings_count: r.findings.length,
      });
    }
  }

  const totalScore = totalWeight > 0 ? totalWeighted / totalWeight : 0;
  const { grade, stars } = getGrade(totalScore);

  const criticalCount = results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'critical').length, 0);
  const highCount = results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'high').length, 0);
  const mediumCount = results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'medium').length, 0);
  const lowCount = results.reduce((sum, r) => sum + r.findings.filter(f => f.severity === 'low').length, 0);

  return {
    total_score: Math.round(totalScore * 100) / 100,
    grade, stars, breakdown,
    critical: criticalCount, high: highCount,
    medium: mediumCount, low: lowCount,
    total_findings: criticalCount + highCount + mediumCount + lowCount,
  };
}


// ══════════════════════════════════════════════════════════
//  MAIN VALIDATION
// ══════════════════════════════════════════════════════════

async function validateTarget(target) {
  const url = target.url;
  const hostname = new URL(url).hostname;

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`${C.BOLD}${C.CYAN}🔍 TARGET: ${url}${C.RESET}`);
  console.log(`   ${target.label}`);
  console.log(`${'═'.repeat(70)}`);

  // Run all scanners
  console.log(`\n  ${C.BOLD}📋 Running Scanners...${C.RESET}`);

  const sslResult = await scanSSL(hostname);
  const headersResult = await scanHeaders(url);
  const dnsResult = await scanDNS(hostname);
  const emailResult = await scanEmail(hostname);

  const allResults = [sslResult, headersResult, dnsResult, emailResult];

  // Print each scanner result
  for (const r of allResults) {
    const pct = r.max_score > 0 ? (r.score / r.max_score) * 100 : 0;
    const color = pct >= 80 ? C.GREEN : pct >= 50 ? C.YELLOW : C.RED;
    const label = CATEGORY_WEIGHTS[r.category]?.label || r.category;
    console.log(`    ${color}${r.score >= r.max_score * 0.8 ? '✅' : r.score >= r.max_score * 0.5 ? '⚠️' : '❌'} ${label}: ${r.score.toFixed(1)}/${r.max_score} (${pct.toFixed(0)}%) — ${r.duration_ms}ms${C.RESET}`);
  }

  // Calculate composite score
  const scoreResult = calculateTotalScore(allResults);

  const gradeColor = scoreResult.total_score >= 80 ? C.GREEN : scoreResult.total_score >= 60 ? C.YELLOW : C.RED;

  console.log(`\n  ${'─'.repeat(55)}`);
  console.log(`  ${C.BOLD}SCORE: ${gradeColor}${scoreResult.total_score.toFixed(1)}/100${C.RESET} | Grade: ${gradeColor}${scoreResult.grade}${C.RESET} | ${'★'.repeat(scoreResult.stars)}${'☆'.repeat(3 - scoreResult.stars)}`);
  console.log(`  ${'─'.repeat(55)}`);

  // Breakdown
  console.log(`\n  ${C.BOLD}Category Breakdown:${C.RESET}`);
  for (const cat of scoreResult.breakdown.sort((a, b) => b.weight - a.weight)) {
    const barLen = 20;
    const filled = Math.round(cat.normalized / 5);
    const bar = '█'.repeat(Math.min(filled, barLen)) + '░'.repeat(Math.max(0, barLen - filled));
    const color = cat.normalized >= 80 ? C.GREEN : cat.normalized >= 50 ? C.YELLOW : C.RED;
    const label = CATEGORY_WEIGHTS[cat.category]?.label || cat.category;
    console.log(`    ${label.padEnd(25)} ${color}${bar} ${cat.normalized.toFixed(1).padStart(5)}%${C.RESET} (${cat.score.toFixed(1)}/${cat.max_score}) ×${cat.weight.toFixed(2)}`);
  }

  // Findings detail
  console.log(`\n  ${C.BOLD}Findings Summary:${C.RESET}`);
  console.log(`    🔴 Critical: ${scoreResult.critical} | 🟠 High: ${scoreResult.high} | 🟡 Medium: ${scoreResult.medium} | 🔵 Low: ${scoreResult.low}`);

  const sevColor = { critical: C.RED, high: C.MAGENTA, medium: C.YELLOW, low: C.CYAN, info: C.DIM };
  const allFindings = allResults.flatMap(r => r.findings.map(f => ({ ...f, cat: r.category })));
  const nonInfo = allFindings.filter(f => f.severity !== 'info');
  const infos = allFindings.filter(f => f.severity === 'info');

  if (nonInfo.length > 0) {
    console.log(`\n  ${C.BOLD}Security Issues:${C.RESET}`);
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    nonInfo.sort((a, b) => (sevOrder[a.severity] || 4) - (sevOrder[b.severity] || 4));
    for (const f of nonInfo) {
      const col = sevColor[f.severity] || C.WHITE;
      console.log(`    ${col}[${f.severity.toUpperCase().padEnd(8)}]${C.RESET} [${f.cat}] ${f.title}`);
      if (f.desc) console.log(`               └─ ${f.desc.slice(0, 100)}`);
    }
  }

  if (infos.length > 0) {
    console.log(`\n  ${C.BOLD}✓ Passed Checks:${C.RESET}`);
    for (const f of infos) {
      console.log(`    ${C.GREEN}[INFO    ]${C.RESET} [${f.cat}] ${f.title}`);
    }
  }

  // Raw data for cross-verification
  console.log(`\n  ${C.BOLD}📋 Raw Data (for manual cross-check):${C.RESET}`);
  console.log(`    SSL: Protocol=${sslResult.raw?.protocol || '?'} | Issuer=${sslResult.raw?.issuer || '?'} | DaysLeft=${sslResult.raw?.daysLeft ?? '?'} | Authorized=${sslResult.raw?.authorized ?? '?'}`);
  console.log(`    Headers present: ${Object.entries(headersResult.raw || {}).filter(([k, v]) => v && k !== 'error' && k !== 'server').map(([k]) => k).join(', ') || 'none'}`);
  console.log(`    Headers missing: ${Object.entries(headersResult.raw || {}).filter(([k, v]) => !v && k !== 'error' && k !== 'server').map(([k]) => k).join(', ') || 'none'}`);
  console.log(`    DNS A records: ${dnsResult.raw?.a_records?.join(', ') || '?'}`);
  console.log(`    SPF: ${emailResult.raw?.spf?.slice(0, 80) || 'not found'}`);
  console.log(`    DMARC: ${emailResult.raw?.dmarc?.slice(0, 80) || 'not found'}`);

  // Score formula verification
  console.log(`\n  ${C.BOLD}🧮 Score Formula Verification:${C.RESET}`);
  let manualWeighted = 0, manualWeight = 0;
  for (const cat of scoreResult.breakdown) {
    const contribution = cat.normalized * cat.weight;
    manualWeighted += contribution;
    manualWeight += cat.weight;
    console.log(`    ${(CATEGORY_WEIGHTS[cat.category]?.label || cat.category).padEnd(25)} ${cat.normalized.toFixed(2)} × ${cat.weight.toFixed(2)} = ${contribution.toFixed(2)}`);
  }
  const manualTotal = manualWeight > 0 ? manualWeighted / manualWeight : 0;
  const match = Math.abs(manualTotal - scoreResult.total_score) < 0.1;
  console.log(`    ${'─'.repeat(50)}`);
  console.log(`    Manual: ${manualTotal.toFixed(2)} | Engine: ${scoreResult.total_score.toFixed(2)} → ${match ? `${C.GREEN}✅ MATCH` : `${C.RED}❌ MISMATCH`}${C.RESET}`);

  return {
    url,
    total_score: scoreResult.total_score,
    grade: scoreResult.grade,
    stars: scoreResult.stars,
    ...scoreResult,
    ssl_raw: sslResult.raw,
    headers_raw: headersResult.raw,
  };
}


async function main() {
  console.log(`
${C.BOLD}${C.CYAN}
╔══════════════════════════════════════════════════════════════════╗
║          CyberScore TN — Validation du Moteur de Scan          ║
║            منصة CyberScore TN — التحقق من محرك المسح           ║
╚══════════════════════════════════════════════════════════════════╝
${C.RESET}`);

  console.log(`  📅 Date: ${new Date().toISOString()}`);
  console.log(`  🔧 Scanners: SSL/TLS, Headers, DNS, Email`);
  console.log(`  🎯 Targets: ${TARGETS.length}`);
  console.log(`  📊 Weights:`);
  for (const [cat, info] of Object.entries(CATEGORY_WEIGHTS)) {
    console.log(`     ${info.label.padEnd(30)} ${(info.weight * 100).toFixed(0)}% (max: ${info.max_score})`);
  }

  const results = [];
  for (const target of TARGETS) {
    try {
      const result = await validateTarget(target);
      results.push(result);
    } catch (err) {
      console.log(`\n  ❌ FATAL ERROR for ${target.url}: ${err.message}`);
      console.error(err);
      results.push({ url: target.url, error: err.message });
    }
  }

  // Final summary table
  console.log(`\n\n${'═'.repeat(70)}`);
  console.log(`${C.BOLD}${C.CYAN}📊 RÉSUMÉ FINAL${C.RESET}`);
  console.log(`${'═'.repeat(70)}`);

  console.log(`\n${'Site'.padEnd(40)} ${'Score'.padStart(6)} ${'Grade'.padStart(6)} ${'Stars'.padStart(6)} ${'Issues'.padStart(7)} ${'Crit'.padStart(5)}`);
  console.log(`${'─'.repeat(40)} ${'─'.repeat(6)} ${'─'.repeat(6)} ${'─'.repeat(6)} ${'─'.repeat(7)} ${'─'.repeat(5)}`);

  for (const r of results) {
    if (r.error) {
      console.log(`${r.url.replace('https://', '').slice(0, 38).padEnd(40)} ${C.RED}ERROR${C.RESET}`);
      continue;
    }
    const urlShort = r.url.replace('https://', '').replace('http://', '').slice(0, 38);
    const color = r.total_score >= 80 ? C.GREEN : r.total_score >= 60 ? C.YELLOW : C.RED;
    const stars = '★'.repeat(r.stars) + '☆'.repeat(3 - r.stars);
    console.log(`${urlShort.padEnd(40)} ${color}${String(r.total_score.toFixed(0)).padStart(6)}${C.RESET} ${color}${r.grade.padStart(6)}${C.RESET} ${stars.padStart(6)} ${String(r.total_findings).padStart(7)} ${String(r.critical).padStart(5)}`);
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`${C.BOLD}${C.GREEN}✅ Validation terminée !${C.RESET}`);
  console.log(`${'═'.repeat(70)}\n`);

  // Save results to JSON
  const fs = require('fs');
  const outputPath = require('path').join(__dirname, 'backend', 'validation_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`  📁 Résultats sauvegardés: ${outputPath}\n`);
}

main().catch(console.error);
