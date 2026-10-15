"""
Unit tests for CyberScore TN Autonomous Multi-Agent Probe (probe_agent).
Validates AuditState, PortFinding, and Agent 3 Zero False Positive filtering.
"""

import pytest
from probe_agent.models import AuditState, PortFinding, VulnerabilityFinding
from probe_agent.agents.poc_agent import PoCAgent


def test_audit_state_initialization():
    """Verify default initialization of shared AuditState."""
    state = AuditState(target_host="test.gov.tn")
    assert state.target_host == "test.gov.tn"
    assert state.status == "initialized"
    assert state.open_ports == []
    assert state.potential_vulnerabilities == []
    assert state.validated_vulnerabilities == []


def test_port_finding_model():
    """Verify PortFinding dataclass attributes."""
    pf = PortFinding(
        port=22,
        service="SSH",
        banner="OpenSSH_8.2p1",
        risk_level="low",
        is_critical=False,
    )
    assert pf.port == 22
    assert pf.service == "SSH"
    assert pf.risk_level == "low"
    assert not pf.is_critical


def test_poc_agent_zero_false_positive_rule():
    """
    Verify Agent 3 (PoCAgent) Zero False Positive Rule:
    - Speculative unproven AI vulnerabilities MUST be discarded.
    - Deterministic structural findings (PORT, HEADER, EOL) ARE preserved.
    """
    agent = PoCAgent()
    state = AuditState(target_host="test.gov.tn")

    # Add a deterministic structural finding (open port)
    factual_finding = VulnerabilityFinding(
        id="PORT-21-FTP-CLEAR",
        title="Port 21 FTP Non Chiffré Ouvert",
        severity="critical",
        owasp_category="A02",
        cvss_score=8.5,
        description="FTP actif",
        evidence="Port 21 accessible",
        remediation="Fermer le port 21",
    )

    # Add a speculative AI hypothesis with no active PoC proof
    speculative_ai_finding = VulnerabilityFinding(
        id="AI-SPECULATIVE-SQLI-001",
        title="Vulnérabilité Théorique SQL Injection Supposée",
        severity="critical",
        owasp_category="A03",
        cvss_score=9.8,
        description="Hypothèse de faille générée par le LLM sans preuve",
        evidence="Non vérifié expérimentalement",
        remediation="Vérifier le code",
    )

    state.potential_vulnerabilities = [factual_finding, speculative_ai_finding]

    # Run Agent 3
    updated_state = agent.run(state)

    # Verify that the factual structural finding was preserved
    assert any(v.id == "PORT-21-FTP-CLEAR" for v in updated_state.validated_vulnerabilities)

    # Verify that the unproven speculative AI hypothesis was DISCARDED
    assert not any(v.id == "AI-SPECULATIVE-SQLI-001" for v in updated_state.validated_vulnerabilities)
