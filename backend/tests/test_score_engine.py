import pytest
from app.scanners.base import ScanCategoryResult, CATEGORY_WEIGHTS
from app.scanners.score_engine import calculate_total_score

def _result(cat, pct):
    cfg = CATEGORY_WEIGHTS[cat]
    return ScanCategoryResult(category=cat, score=cfg["max_score"] * pct / 100,
                              max_score=cfg["max_score"], weight=cfg["weight"])

def test_weights_sum_to_one():
    assert abs(sum(c["weight"] for c in CATEGORY_WEIGHTS.values()) - 1.0) < 1e-9

def test_perfect_and_zero():
    p = calculate_total_score([_result(c, 100) for c in CATEGORY_WEIGHTS])
    assert p["total_score"] == 100 and p["grade"] == "A+" and p["star_rating"] == 3
    z = calculate_total_score([_result(c, 0) for c in CATEGORY_WEIGHTS])
    assert z["total_score"] == 0 and z["grade"] == "F" and z["star_rating"] == 1

@pytest.mark.parametrize("pct,grade,stars",
    [(95, "A+", 3), (90, "A", 3), (80, "B", 2), (70, "C", 2), (60, "D", 1), (59, "F", 1)])
def test_grade_boundaries(pct, grade, stars):
    r = calculate_total_score([_result("ssl", pct)])
    assert r["grade"] == grade and r["star_rating"] == stars

def test_failed_scanner_is_excluded_not_penalised():
    failed = ScanCategoryResult(category="dns", score=0, max_score=0, weight=0, error="timeout")
    assert calculate_total_score([_result("ssl", 100), failed])["total_score"] == 100
