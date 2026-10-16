import pytest
from probe_agent.models import AuditState, PortFinding, VulnerabilityFinding
from probe_agent.agents.poc_agent import PoCAgent
from probe_agent.tools.poc_verifier import PoCVerifier


@pytest.fixture(autouse=True)
def no_network(monkeypatch):
    """Stub network calls in PoCVerifier to guarantee unit test isolation."""
    for m in ("verify_xss_reflection", "verify_sql_error_disclosure", "verify_exposed_endpoint"):
        monkeypatch.setattr(PoCVerifier, m, lambda *a, **k: (False, ""))


def test_audit_state_initialization():
    """Verify default initialization of shared AuditState."""
    state = AuditState(scan_id="scan-001", target="https://test.gov.tn", target_host="test.gov.tn")
    assert state.target_host == "test.gov.tn"
    assert state.status == "initialized"
    assert state.open_ports == []
    assert state.potential_vulnerabilities == []
    assert state.validated_vulnerabilities == []


def test_port_finding_model():
    """Verify PortFinding dataclass attributes match real implementation."""
    pf = PortFinding(
        port=22,
        service="SSH",
        state="open",
        banner="OpenSSH_8.2p1",
        is_risky=False,
        severity="low",
    )
    assert pf.port == 22
    assert pf.service == "SSH"
    assert pf.state == "open"
    assert pf.banner == "OpenSSH_8.2p1"
    assert not pf.is_risky
    assert pf.severity == "low"


def test_poc_agent_zero_false_positive_rule():
    """
    Verify Agent 3 (PoCAgent) Zero False Positive Rule:
    - Speculative unproven AI vulnerabilities MUST be discarded.
    - Deterministic structural findings (PORT, HEADER, OBSOLETE, EOL) ARE preserved.
    """
    agent = PoCAgent()
    state = AuditState(scan_id="scan-002", target="https://test.gov.tn", target_host="test.gov.tn")

    factual_finding = VulnerabilityFinding(
        id="PORT-21-EXPOSED",
        title="Port 21 FTP Non Chiffré Ouvert",
        severity="critical",
        owasp_category="A02",
        cvss_score=8.5,
        description="FTP actif",
        evidence="Port 21 accessible",
        remediation="Fermer le port 21",
    )

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

    agent.run(state)

    validated_ids = [v.id for v in state.validated_vulnerabilities]
    assert "PORT-21-EXPOSED" in validated_ids
    assert "AI-SPECULATIVE-SQLI-001" not in validated_ids


def test_sha256_determinism_and_sensitivity():
    """
    Verify that compute_sha256() is deterministic and changes when the score changes.
    """
    state1 = AuditState(scan_id="scan-003", target="https://test.gov.tn", target_host="test.gov.tn")
    state1.score = 85
    state1.grade = "B"
    hash1_a = state1.compute_sha256()
    hash1_b = state1.compute_sha256()
    assert hash1_a == hash1_b
    assert len(hash1_a) == 64

    # Change score -> hash must change
    state2 = AuditState(scan_id="scan-003", target="https://test.gov.tn", target_host="test.gov.tn")
    state2.score = 70
    state2.grade = "C"
    hash2 = state2.compute_sha256()
    assert hash1_a != hash2
