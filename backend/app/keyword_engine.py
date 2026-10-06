"""
ApexSEO Keyword Intelligence Engine (Module 3)
Mines long-tail queries using keyless Google Autocomplete Alphabet-Soup algorithm.
Classifies search intent (Informational, Commercial, Transactional, Navigational).
"""

import json
import requests
from typing import List, Dict, Any

GOOGLE_SUGGEST_URL = "https://suggestqueries.google.com/complete/search"

def classify_intent(keyword: str) -> str:
    """Classifies search query intent using keyword heuristics."""
    kw_lower = keyword.lower()
    
    # Transactional intent
    if any(w in kw_lower for w in ["buy", "price", "pricing", "cost", "cheap", "discount", "deal", "order", "purchase", "hire", "service"]):
        return "Transactional"
    
    # Commercial investigation
    if any(w in kw_lower for w in ["best", "top", "review", "vs", "versus", "comparison", "compare", "alternative", "features"]):
        return "Commercial"
        
    # Navigational intent
    if any(w in kw_lower for w in ["login", "sign in", "signin", "portal", "dashboard", "app", "download", "careers", "official"]):
        return "Navigational"
        
    # Informational intent (default)
    return "Informational"

def calculate_difficulty(keyword: str) -> int:
    """Computes a synthetic search difficulty score (0-100) based on token length & intent."""
    words = keyword.split()
    word_count = len(words)
    # Long-tail keywords (4+ words) are typically lower difficulty
    if word_count >= 5:
        base = 28
    elif word_count == 4:
        base = 42
    elif word_count == 3:
        base = 58
    else:
        base = 78
        
    # Adjust for commercial/transactional competition
    intent = classify_intent(keyword)
    if intent in ["Transactional", "Commercial"]:
        base = min(98, base + 12)
    elif intent == "Informational":
        base = max(18, base - 8)
        
    return base

def fetch_suggestions_for_query(query: str, session: requests.Session) -> List[str]:
    """Fetches keyless autocomplete suggestions from Google."""
    try:
        params = {
            "client": "chrome",
            "q": query,
            "hl": "en"
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0"
        }
        res = session.get(GOOGLE_SUGGEST_URL, params=params, headers=headers, timeout=4)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list) and len(data) > 1:
                return data[1] # list of suggestion strings
    except Exception:
        pass
    return []

def mine_alphabet_soup_keywords(seed_word: str, max_keywords: int = 50) -> Dict[str, Any]:
    """
    Executes alphabet soup mining across letters, question prefixes, and modifier keywords.
    """
    clean_seed = seed_word.strip().lower()
    if not clean_seed or len(clean_seed) < 2:
        clean_seed = "seo"

    session = requests.Session()
    discovered_set = set()
    raw_results = []

    # 1. Base suggestions
    base_suggestions = fetch_suggestions_for_query(clean_seed, session)
    for s in base_suggestions:
        if s.lower() not in discovered_set:
            discovered_set.add(s.lower())
            raw_results.append(s)

    # 2. Key alphabet letters (a, b, c, d, e, f, i, m, p, s, t, v, w) for fast responsive mining
    letters = ["a", "b", "c", "f", "p", "s", "t", "v"]
    for char in letters:
        if len(raw_results) >= max_keywords:
            break
        q = f"{clean_seed} {char}"
        for s in fetch_suggestions_for_query(q, session):
            if s.lower() not in discovered_set:
                discovered_set.add(s.lower())
                raw_results.append(s)

    # 3. High-intent modifiers
    modifiers = ["best", "vs", "how to", "pricing", "alternatives"]
    for mod in modifiers:
        if len(raw_results) >= max_keywords:
            break
        q = f"{mod} {clean_seed}"
        for s in fetch_suggestions_for_query(q, session):
            if s.lower() not in discovered_set:
                discovered_set.add(s.lower())
                raw_results.append(s)

    # Fallback if network blocked or zero returned
    if not raw_results:
        raw_results = [
            f"{clean_seed} features",
            f"{clean_seed} pricing",
            f"best {clean_seed} alternatives",
            f"how to use {clean_seed}",
            f"{clean_seed} vs competitors",
            f"{clean_seed} api documentation",
            f"{clean_seed} reviews 2026",
            f"{clean_seed} login portal",
            f"{clean_seed} architecture guide"
        ]

    # Structure keyword list with analytics
    keywords_list = []
    intent_counts = {"Informational": 0, "Commercial": 0, "Transactional": 0, "Navigational": 0}

    for idx, kw in enumerate(raw_results[:max_keywords]):
        intent = classify_intent(kw)
        intent_counts[intent] = intent_counts.get(intent, 0) + 1
        diff = calculate_difficulty(kw)
        
        # Synthetic estimated monthly volume heuristic
        words_c = len(kw.split())
        est_vol = max(140, int(18500 / (words_c * (idx + 1) ** 0.55)))

        keywords_list.append({
            "id": f"kw_{idx+1}",
            "keyword": kw,
            "intent": intent,
            "difficulty": diff,
            "est_volume": est_vol,
            "cpc_estimate": f"${round(0.75 + (diff / 30), 2)}"
        })

    return {
        "seed": clean_seed,
        "total_keywords": len(keywords_list),
        "intent_breakdown": intent_counts,
        "keywords": keywords_list
    }
