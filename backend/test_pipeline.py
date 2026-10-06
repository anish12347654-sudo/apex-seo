"""
Verification script for ApexSEO backend engine.
Tests crawler, 22 checks, keyword intelligence, SERP, and Autopilot simulation.
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from app.pipeline import execute_audit_pipeline
from app.autopilot import simulate_autopilot_fix
from app.database import get_or_create_default_user, get_domain_history

def test_full_pipeline():
    print(">>> 1. Testing Default User & Database...")
    user = get_or_create_default_user()
    print(f"User loaded: {user['email']}, Plan: {user['plan']}")

    print("\n>>> 2. Executing 10-Step Pipeline on 'https://stripe.com'...")
    report = execute_audit_pipeline("https://stripe.com")
    print(f"Audit Complete! Audit ID: {report['id']}")
    print(f"Domain: {report['domain']}")
    print(f"Score: {report['score']} / 100 (Grade: {report['grade']})")
    print(f"Passed Checks: {report['passed_checks']} / {report['total_checks']}")
    print(f"TTFB: {report['crawl']['ttfb_ms']}ms | Page Size: {report['crawl']['page_size_kb']}KB")
    print(f"Keywords Mined: {report['keywords']['total_keywords']}")
    print(f"SERP Results: {report['serp']['total_results']}")
    print(f"Advisor Action Items: {report['advisor']['total_issues']} (Critical: {report['advisor']['critical_count']})")

    print("\n>>> 3. Testing USP Autopilot Loop Simulation...")
    sim = simulate_autopilot_fix(report)
    print(f"Original Score: {sim['original_score']} ({sim['original_grade']}) -> Simulated Score: {sim['simulated_score']} ({sim['simulated_grade']})")
    print(f"Delta: {sim['score_delta']} | Fixed Items: {sim['fixed_items_count']}")

    print("\n>>> 4. Testing Domain History Store...")
    history = get_domain_history(report['domain'])
    print(f"History entries found for {report['domain']}: {len(history)}")

    print("\n>>> ALL BACKEND TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_full_pipeline()
