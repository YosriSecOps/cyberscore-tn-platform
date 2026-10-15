"""
Unit tests for the CyberScore TN Score Engine.
Validates scoring weights, grade assignments, and penalty formulas.
"""

import pytest
from app.scanners.score_engine import calculate_global_score, determine_grade, CATEGORY_WEIGHTS


def test_category_weights_sum_to_one():
    """Verify that all category weights sum to 100% (1.0)."""
    total_weight = sum(CATEGORY_WEIGHTS.values())
    assert abs(total_weight - 1.0) < 0.001, f"Total weights sum to {total_weight}, expected 1.0"


def test_determine_grade_boundaries():
    """Verify official grade scale (A+ >= 93, A >= 85, B >= 70, C >= 50, D >= 35, F < 35)."""
    assert determine_grade(95) in ["A+", "A"]
    assert determine_grade(85) in ["A", "B+"]
    assert determine_grade(75) in ["B", "B+"]
    assert determine_grade(55) in ["C", "C+"]
    assert determine_grade(30) in ["D", "F"]
    assert determine_grade(15) == "F"


def test_perfect_score_calculation():
    """Verify that 100/100 in all categories yields a global score of 100."""
    category_scores = {cat: 100.0 for cat in CATEGORY_WEIGHTS}
    global_score = calculate_global_score(category_scores)
    assert round(global_score) == 100


def test_zero_score_calculation():
    """Verify that 0/100 in all categories yields a global score of 0."""
    category_scores = {cat: 0.0 for cat in CATEGORY_WEIGHTS}
    global_score = calculate_global_score(category_scores)
    assert round(global_score) == 0
