"""
CyberScore TN — Score Engine
Calculates the weighted total score, grade (A-F), and star rating (★★★).
"""

from app.scanners.base import ScanCategoryResult, CATEGORY_WEIGHTS


# Grade thresholds (inspired by SecurityScorecard)
GRADE_THRESHOLDS = [
    (95, "A+", 3, "ممتاز"),
    (90, "A",  3, "قوي"),
    (80, "B",  2, "جيد"),
    (70, "C",  2, "مقبول"),
    (60, "D",  1, "ضعيف"),
    (0,  "F",  1, "حرج"),
]


def calculate_total_score(category_results: list[ScanCategoryResult]) -> dict:
    """
    Calculate the final weighted score from all category results.
    
    Returns: {
        "total_score": float (0-100),
        "grade": str (A+ to F),
        "star_rating": int (1-3),
        "grade_label_ar": str,
        "category_breakdown": list[dict],
    }
    """
    total_weighted = 0.0
    total_weight = 0.0
    category_breakdown = []

    for result in category_results:
        if result.max_score > 0:
            # Normalize category score to 0-100 scale
            normalized = (result.score / result.max_score) * 100
            weighted = normalized * result.weight
            total_weighted += weighted
            total_weight += result.weight

            category_breakdown.append({
                "category": result.category,
                "score": round(result.score, 2),
                "max_score": result.max_score,
                "weight": result.weight,
                "normalized_score": round(normalized, 2),
                "weighted_contribution": round(weighted, 2),
                "findings_count": len(result.findings),
                **result.finding_counts,
                "label_ar": CATEGORY_WEIGHTS.get(result.category, {}).get("label_ar", result.category),
                "label_fr": CATEGORY_WEIGHTS.get(result.category, {}).get("label_fr", result.category),
                "label_en": CATEGORY_WEIGHTS.get(result.category, {}).get("label_en", result.category),
            })

    # Final score (0-100)
    total_score = round(total_weighted / total_weight, 2) if total_weight > 0 else 0.0
    
    # Determine grade and stars
    grade = "F"
    stars = 1
    label_ar = "حرج"
    for threshold, g, s, label in GRADE_THRESHOLDS:
        if total_score >= threshold:
            grade = g
            stars = s
            label_ar = label
            break

    return {
        "total_score": total_score,
        "grade": grade,
        "star_rating": stars,
        "grade_label_ar": label_ar,
        "category_breakdown": sorted(category_breakdown, key=lambda x: x["weight"], reverse=True),
        "total_findings": sum(len(r.findings) for r in category_results),
        "critical_count": sum(r.finding_counts.get("critical", 0) for r in category_results),
        "high_count": sum(r.finding_counts.get("high", 0) for r in category_results),
        "medium_count": sum(r.finding_counts.get("medium", 0) for r in category_results),
        "low_count": sum(r.finding_counts.get("low", 0) for r in category_results),
    }
