from app.scanners.base import BaseScanner, Finding, ScanCategoryResult

class _Dummy(BaseScanner):
    category = "ssl"
    async def scan(self, target, **kw):
        return self._create_result([], 0)

def _f(sev):
    return Finding(title="t", severity=sev, category="ssl")

def test_deduct_by_severity():
    assert _Dummy()._deduct(12, [_f("critical"), _f("high"), _f("low")]) == 12 - 3 - 2 - 0.5

def test_deduct_floors_at_zero():
    assert _Dummy()._deduct(2, [_f("critical")] * 3) == 0

def test_create_result_caps_at_max():
    r = _Dummy()._create_result([], 99)
    assert (r.score, r.max_score, r.weight) == (12, 12, 0.12)

def test_finding_counts():
    r = ScanCategoryResult(category="ssl", score=1, max_score=12, weight=0.12,
                           findings=[_f("high"), _f("high"), _f("info")])
    assert r.finding_counts["high"] == 2 and r.finding_counts["info"] == 1
