/**
 * CyberScore TN — Synthetic Data Sanitizer for Public Deployment
 * 
 * Replaces real scanned domains with synthetic documentation domains (ministere-01.gov.tn, etc.)
 * and real IP addresses with the RFC 5737 TEST-NET-3 documentation block (203.0.113.0/24).
 * 
 * Usage: node scripts/generate_synthetic_scans.js
 */

const fs = require('fs');
const path = require('path');

const realScansPath = path.join(__dirname, '..', 'lib', 'real-scans.json');
const syntheticScansPath = path.join(__dirname, '..', 'lib', 'synthetic-scans.json');

if (!fs.existsSync(realScansPath)) {
  console.error("real-scans.json not found at:", realScansPath);
  process.exit(1);
}

const rawData = fs.readFileSync(realScansPath, 'utf8');
const scans = JSON.parse(rawData);

const domainMap = new Map();
let domainCounter = 1;

const sanitized = scans.map((item, idx) => {
  let syntheticDomain = domainMap.get(item.domain);
  if (!syntheticDomain) {
    const numStr = String(domainCounter).padStart(2, '0');
    syntheticDomain = `ministere-${numStr}.gov.tn`;
    domainMap.set(item.domain, syntheticDomain);
    domainCounter++;
  }

  // RFC 5737 TEST-NET-3: 203.0.113.0/24
  const syntheticIp = `203.0.113.${(idx % 250) + 1}`;

  return {
    ...item,
    domain: syntheticDomain,
    ip: syntheticIp,
    resolved_ip: syntheticIp,
  };
});

fs.writeFileSync(syntheticScansPath, JSON.stringify(sanitized, null, 2), 'utf8');
console.log(`✅ Successfully generated synthetic dataset with ${sanitized.length} sanitized records at:`);
console.log(`   ${syntheticScansPath}`);
console.log(`   Domains: ministere-01.gov.tn to ministere-${String(domainCounter - 1).padStart(2, '0')}.gov.tn`);
console.log(`   IPs: 203.0.113.1 - 203.0.113.250 (RFC 5737 Documentation Network)`);
