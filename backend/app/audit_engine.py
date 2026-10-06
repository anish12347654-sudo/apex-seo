"""
ApexSEO Audit Engine (Module 2)
Evaluates 22 weighted checks on parsed HTML/headers and generates 0-100 score + letter grade.
"""

import re
from bs4 import BeautifulSoup
from typing import Dict, Any, List

def calculate_grade(score: float) -> str:
    """Returns letter grade based on score."""
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B"
    elif score >= 55:
        return "C"
    else:
        return "D"

def parse_html_elements(html: str) -> dict:
    """Parses DOM using BeautifulSoup and extracts core SEO elements."""
    soup = BeautifulSoup(html, "html.parser")
    
    # Title
    title_tag = soup.find("title")
    title_text = title_tag.get_text().strip() if title_tag else ""
    
    # Meta description
    meta_desc = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    meta_desc_text = meta_desc.get("content", "").strip() if meta_desc else ""
    
    # Meta robots
    meta_robots = soup.find("meta", attrs={"name": re.compile(r"^robots$", re.I)})
    meta_robots_text = meta_robots.get("content", "").lower() if meta_robots else ""
    
    # Viewport
    meta_viewport = soup.find("meta", attrs={"name": re.compile(r"^viewport$", re.I)})
    viewport_content = meta_viewport.get("content", "").lower() if meta_viewport else ""
    
    # Canonical
    canonical_tag = soup.find("link", attrs={"rel": re.compile(r"^canonical$", re.I)})
    canonical_href = canonical_tag.get("href", "").strip() if canonical_tag else ""
    
    # Headings
    h1_tags = [h.get_text().strip() for h in soup.find_all("h1")]
    h2_tags = [h.get_text().strip() for h in soup.find_all("h2")]
    h3_tags = [h.get_text().strip() for h in soup.find_all("h3")]
    
    # Images
    imgs = soup.find_all("img")
    total_imgs = len(imgs)
    imgs_with_alt = sum(1 for img in imgs if img.get("alt") is not None and img.get("alt").strip() != "")
    
    # Open Graph
    og_title = soup.find("meta", attrs={"property": "og:title"})
    og_desc = soup.find("meta", attrs={"property": "og:description"})
    og_img = soup.find("meta", attrs={"property": "og:image"})
    has_og = bool(og_title or og_desc or og_img)
    
    # Schema.org / Structured data
    json_ld_tags = soup.find_all("script", attrs={"type": "application/ld+json"})
    has_schema = len(json_ld_tags) > 0 or bool(soup.find(attrs={"itemscope": True}))
    
    # Deprecated tags
    deprecated_tags_found = soup.find_all(["font", "center", "marquee", "blink", "strike", "frame", "frameset"])
    
    # Text to HTML ratio
    for s in soup(["script", "style", "noscript", "svg"]):
        s.extract()
    visible_text = soup.get_text(separator=" ", strip=True)
    text_length = len(visible_text)
    raw_length = max(len(html), 1)
    text_ratio = round((text_length / raw_length) * 100, 2)
    
    # Links
    links = soup.find_all("a", href=True)
    total_links = len(links)
    internal_links = sum(1 for a in links if not a["href"].startswith(("http://", "https://")) or a["href"].startswith("/"))
    external_links = total_links - internal_links

    return {
        "title": title_text,
        "meta_description": meta_desc_text,
        "meta_robots": meta_robots_text,
        "viewport": viewport_content,
        "canonical": canonical_href,
        "h1": h1_tags,
        "h2_count": len(h2_tags),
        "h3_count": len(h3_tags),
        "total_images": total_imgs,
        "images_with_alt": imgs_with_alt,
        "has_og": has_og,
        "og_title": og_title.get("content", "") if og_title else "",
        "og_image": og_img.get("content", "") if og_img else "",
        "has_schema": has_schema,
        "schema_count": len(json_ld_tags),
        "deprecated_tags_count": len(deprecated_tags_found),
        "text_ratio": text_ratio,
        "visible_text_sample": visible_text[:300],
        "total_links": total_links,
        "internal_links": internal_links,
        "external_links": external_links
    }

def run_22_audit_checks(crawl_data: dict, dom_data: dict, site_data: dict, speed_data: dict) -> dict:
    """
    Executes the 22 weighted SEO checks across Indexing, Content, Performance, and Security.
    """
    checks: List[Dict[str, Any]] = []

    # Category 1: Indexing & Crawlability (26%)
    # 1. HTTP Status 200 OK (Weight 6)
    sc = crawl_data.get("status_code", 0)
    passed_1 = (sc == 200)
    checks.append({
        "id": "status_code",
        "category": "Indexing & Crawlability",
        "title": "HTTP Status 200 OK",
        "weight": 6,
        "passed": passed_1,
        "score_contribution": 6 if passed_1 else 0,
        "severity": "CRITICAL" if not passed_1 else "INFO",
        "value": f"HTTP {sc}",
        "recommendation": "Ensure the server responds with a 200 OK status code without downtime or server errors."
    })

    # 2. Redirect Chain Depth (Weight 4)
    rc = crawl_data.get("redirect_count", 0)
    passed_2 = (rc <= 1)
    checks.append({
        "id": "redirect_chain",
        "category": "Indexing & Crawlability",
        "title": "Redirect Chain Depth",
        "weight": 4,
        "passed": passed_2,
        "score_contribution": 4 if passed_2 else (2 if rc == 2 else 0),
        "severity": "HIGH" if rc > 2 else ("MEDIUM" if rc == 2 else "INFO"),
        "value": f"{rc} redirect hops",
        "recommendation": "Avoid redirect chains longer than 1 hop to preserve crawl budget and page load speed."
    })

    # 3. Canonical Tag (Weight 5)
    canonical = dom_data.get("canonical", "")
    passed_3 = bool(canonical and len(canonical) > 8)
    checks.append({
        "id": "canonical_tag",
        "category": "Indexing & Crawlability",
        "title": "Canonical Tag Present",
        "weight": 5,
        "passed": passed_3,
        "score_contribution": 5 if passed_3 else 0,
        "severity": "HIGH" if not passed_3 else "INFO",
        "value": canonical if canonical else "Missing",
        "recommendation": "Add a self-referential <link rel='canonical' href='...' /> to prevent duplicate content issues."
    })

    # 4. Robots.txt Disallow (Weight 4)
    robots_disallowed = site_data.get("robots_disallowed", False)
    passed_4 = not robots_disallowed
    checks.append({
        "id": "robots_disallow",
        "category": "Indexing & Crawlability",
        "title": "Robots.txt Crawlability",
        "weight": 4,
        "passed": passed_4,
        "score_contribution": 4 if passed_4 else 0,
        "severity": "CRITICAL" if not passed_4 else "INFO",
        "value": "Blocked" if robots_disallowed else "Allowed / Clean",
        "recommendation": "Check robots.txt to ensure key search engines are not accidentally disallowed from crawling."
    })

    # 5. Meta Robots & X-Robots-Tag (Weight 4)
    meta_robots = dom_data.get("meta_robots", "")
    x_robots = crawl_data.get("headers", {}).get("x-robots-tag", "").lower()
    has_noindex = "noindex" in meta_robots or "noindex" in x_robots
    passed_5 = not has_noindex
    checks.append({
        "id": "meta_robots",
        "category": "Indexing & Crawlability",
        "title": "Meta Robots Indexing Directives",
        "weight": 4,
        "passed": passed_5,
        "score_contribution": 4 if passed_5 else 0,
        "severity": "CRITICAL" if has_noindex else "INFO",
        "value": "Contains 'noindex'" if has_noindex else ("'index, follow'" if meta_robots else "Default (Indexable)"),
        "recommendation": "Remove 'noindex' if this page is intended to be indexed on Google."
    })

    # 6. XML Sitemap Discovery (Weight 3)
    sitemap_found = site_data.get("sitemap_found", False)
    sitemap_url = site_data.get("sitemap_url", "")
    checks.append({
        "id": "xml_sitemap",
        "category": "Indexing & Crawlability",
        "title": "XML Sitemap Discovery",
        "weight": 3,
        "passed": sitemap_found,
        "score_contribution": 3 if sitemap_found else 0,
        "severity": "MEDIUM" if not sitemap_found else "INFO",
        "value": sitemap_url if sitemap_found else "No sitemap detected",
        "recommendation": "Declare your sitemap in robots.txt (e.g. Sitemap: https://example.com/sitemap.xml)."
    })

    # Category 2: Content & On-Page Meta (28%)
    # 7. Title Tag (Weight 6)
    title = dom_data.get("title", "")
    title_len = len(title)
    passed_7 = (30 <= title_len <= 65)
    checks.append({
        "id": "title_tag",
        "category": "Content & On-Page Meta",
        "title": "Title Tag Optimization",
        "weight": 6,
        "passed": passed_7,
        "score_contribution": 6 if passed_7 else (3 if title_len > 0 else 0),
        "severity": "HIGH" if title_len == 0 else ("MEDIUM" if not passed_7 else "INFO"),
        "value": f"{title} ({title_len} chars)" if title else "Missing",
        "recommendation": "Keep page title between 30 and 60 characters with primary keywords at the beginning."
    })

    # 8. Meta Description (Weight 5)
    meta_desc = dom_data.get("meta_description", "")
    desc_len = len(meta_desc)
    passed_8 = (70 <= desc_len <= 165)
    checks.append({
        "id": "meta_description",
        "category": "Content & On-Page Meta",
        "title": "Meta Description Length",
        "weight": 5,
        "passed": passed_8,
        "score_contribution": 5 if passed_8 else (2 if desc_len > 0 else 0),
        "severity": "HIGH" if desc_len == 0 else ("MEDIUM" if not passed_8 else "INFO"),
        "value": f"{meta_desc[:60]}... ({desc_len} chars)" if meta_desc else "Missing",
        "recommendation": "Craft a unique meta description between 70 and 160 characters that incites search clicks."
    })

    # 9. H1 Heading (Weight 5)
    h1s = dom_data.get("h1", [])
    passed_9 = (len(h1s) == 1 and len(h1s[0]) > 0)
    checks.append({
        "id": "h1_heading",
        "category": "Content & On-Page Meta",
        "title": "Single H1 Heading Tag",
        "weight": 5,
        "passed": passed_9,
        "score_contribution": 5 if passed_9 else (2 if len(h1s) > 1 else 0),
        "severity": "HIGH" if len(h1s) == 0 else ("MEDIUM" if len(h1s) > 1 else "INFO"),
        "value": f"{len(h1s)} H1 tag(s) found" + (f": '{h1s[0][:40]}...'" if h1s else ""),
        "recommendation": "Use exactly one <h1> heading tag per page representing the main topic."
    })

    # 10. Heading Hierarchy (Weight 3)
    h2_c = dom_data.get("h2_count", 0)
    passed_10 = (h2_c > 0)
    checks.append({
        "id": "heading_hierarchy",
        "category": "Content & On-Page Meta",
        "title": "Subheading Structure (H2/H3)",
        "weight": 3,
        "passed": passed_10,
        "score_contribution": 3 if passed_10 else 1,
        "severity": "LOW" if not passed_10 else "INFO",
        "value": f"{h2_c} H2s, {dom_data.get('h3_count', 0)} H3s",
        "recommendation": "Structure long-form content using descriptive <h2> and <h3> subheadings."
    })

    # 11. Image Alt Text (Weight 4)
    tot_imgs = dom_data.get("total_images", 0)
    alt_imgs = dom_data.get("images_with_alt", 0)
    alt_pct = round((alt_imgs / tot_imgs) * 100) if tot_imgs > 0 else 100
    passed_11 = (alt_pct >= 90)
    checks.append({
        "id": "image_alt",
        "category": "Content & On-Page Meta",
        "title": "Image Alt Text Coverage",
        "weight": 4,
        "passed": passed_11,
        "score_contribution": 4 if passed_11 else (2 if alt_pct >= 50 else 0),
        "severity": "MEDIUM" if not passed_11 else "INFO",
        "value": f"{alt_imgs}/{tot_imgs} images have alt tags ({alt_pct}%)",
        "recommendation": "Add descriptive 'alt' attributes to all informative images for accessibility and image search."
    })

    # 12. Text-to-HTML Ratio (Weight 3)
    text_ratio = dom_data.get("text_ratio", 0)
    passed_12 = (text_ratio >= 12.0)
    checks.append({
        "id": "text_ratio",
        "category": "Content & On-Page Meta",
        "title": "Text-to-HTML Content Ratio",
        "weight": 3,
        "passed": passed_12,
        "score_contribution": 3 if passed_12 else (1 if text_ratio >= 6.0 else 0),
        "severity": "LOW" if not passed_12 else "INFO",
        "value": f"{text_ratio}% readable text",
        "recommendation": "Increase meaningful on-page text and reduce unnecessary script and DOM bloat."
    })

    # 13. Open Graph Metadata (Weight 2)
    has_og = dom_data.get("has_og", False)
    checks.append({
        "id": "opengraph_tags",
        "category": "Content & On-Page Meta",
        "title": "Open Graph Social Protocol",
        "weight": 2,
        "passed": has_og,
        "score_contribution": 2 if has_og else 0,
        "severity": "LOW" if not has_og else "INFO",
        "value": "Present" if has_og else "Missing",
        "recommendation": "Implement og:title, og:description, and og:image for rich snippets when shared on social media."
    })

    # Category 3: Performance & Core Web Vitals (26%)
    # 14. TTFB (Weight 6)
    ttfb = crawl_data.get("ttfb_ms", 9999)
    passed_14 = (ttfb < 650)
    checks.append({
        "id": "ttfb_latency",
        "category": "Performance & Vitals",
        "title": "Time to First Byte (TTFB)",
        "weight": 6,
        "passed": passed_14,
        "score_contribution": 6 if ttfb < 650 else (3 if ttfb < 1200 else 0),
        "severity": "HIGH" if ttfb >= 1200 else ("MEDIUM" if not passed_14 else "INFO"),
        "value": f"{ttfb} ms",
        "recommendation": "Aim for TTFB under 600ms through edge caching, fast hosting, and CDN optimization."
    })

    # 15. HTML Document Payload (Weight 4)
    size_kb = crawl_data.get("page_size_kb", 0)
    passed_15 = (size_kb < 150)
    checks.append({
        "id": "html_doc_size",
        "category": "Performance & Vitals",
        "title": "HTML Document Size",
        "weight": 4,
        "passed": passed_15,
        "score_contribution": 4 if passed_15 else (2 if size_kb < 300 else 0),
        "severity": "MEDIUM" if not passed_15 else "INFO",
        "value": f"{size_kb} KB",
        "recommendation": "Keep the initial HTML response under 150KB to speed up DOM construction."
    })

    # 16. Mobile Viewport Meta (Weight 5)
    vp = dom_data.get("viewport", "")
    passed_16 = ("width=device-width" in vp)
    checks.append({
        "id": "mobile_viewport",
        "category": "Performance & Vitals",
        "title": "Mobile Viewport Meta Tag",
        "weight": 5,
        "passed": passed_16,
        "score_contribution": 5 if passed_16 else 0,
        "severity": "CRITICAL" if not passed_16 else "INFO",
        "value": vp if vp else "Missing",
        "recommendation": "Add <meta name='viewport' content='width=device-width, initial-scale=1' /> for responsive mobile rendering."
    })

    # 17. PageSpeed Performance Score (Weight 6)
    psi_score = speed_data.get("performance_score", 85)
    passed_17 = (psi_score >= 70)
    checks.append({
        "id": "pagespeed_score",
        "category": "Performance & Vitals",
        "title": "Lighthouse Performance Index",
        "weight": 6,
        "passed": passed_17,
        "score_contribution": round((psi_score / 100) * 6),
        "severity": "HIGH" if psi_score < 50 else ("MEDIUM" if not passed_17 else "INFO"),
        "value": f"{psi_score}/100",
        "recommendation": "Optimize render-blocking resources, defer unused JavaScript, and compress heavy assets."
    })

    # 18. Core Web Vitals (LCP / CLS) (Weight 5)
    lcp_val = speed_data.get("lcp_sec", 2.1)
    cls_val = speed_data.get("cls", 0.05)
    passed_18 = (lcp_val <= 2.5 and cls_val <= 0.1)
    checks.append({
        "id": "core_web_vitals",
        "category": "Performance & Vitals",
        "title": "Core Web Vitals (LCP & CLS)",
        "weight": 5,
        "passed": passed_18,
        "score_contribution": 5 if passed_18 else 2,
        "severity": "HIGH" if not passed_18 else "INFO",
        "value": f"LCP: {lcp_val}s, CLS: {cls_val}",
        "recommendation": "Ensure Largest Contentful Paint is under 2.5s and Cumulative Layout Shift is under 0.1."
    })

    # Category 4: Security & Modern Standards (20%)
    # 19. SSL / HTTPS Protocol (Weight 5)
    final_url = crawl_data.get("final_url", "")
    passed_19 = final_url.startswith("https://")
    checks.append({
        "id": "https_protocol",
        "category": "Security & Modern Standards",
        "title": "HTTPS / SSL Encryption",
        "weight": 5,
        "passed": passed_19,
        "score_contribution": 5 if passed_19 else 0,
        "severity": "CRITICAL" if not passed_19 else "INFO",
        "value": "HTTPS Active" if passed_19 else "Insecure HTTP",
        "recommendation": "Serve your website exclusively over HTTPS with an active SSL/TLS certificate."
    })

    # 20. HTTP to HTTPS Auto-Redirect (Weight 4)
    http_redirected = site_data.get("http_to_https_redirect", True)
    checks.append({
        "id": "http_redirect",
        "category": "Security & Modern Standards",
        "title": "HTTP to HTTPS Redirection",
        "weight": 4,
        "passed": http_redirected,
        "score_contribution": 4 if http_redirected else 0,
        "severity": "HIGH" if not http_redirected else "INFO",
        "value": "Permanent 301 Redirect" if http_redirected else "Not redirecting automatically",
        "recommendation": "Configure automatic 301 redirect from port 80 (HTTP) to port 443 (HTTPS)."
    })

    # 21. Structured Data / Schema.org (Weight 4)
    has_schema = dom_data.get("has_schema", False)
    checks.append({
        "id": "structured_data",
        "category": "Security & Modern Standards",
        "title": "Structured Data (Schema.org)",
        "weight": 4,
        "passed": has_schema,
        "score_contribution": 4 if has_schema else 0,
        "severity": "MEDIUM" if not has_schema else "INFO",
        "value": f"{dom_data.get('schema_count', 0)} Schema entity(s)" if has_schema else "None found",
        "recommendation": "Add Schema.org JSON-LD structured data (e.g. WebSite, Organization, Article) for rich search cards."
    })

    # 22. Modern HTML & Security Headers (Weight 3)
    dep_count = dom_data.get("deprecated_tags_count", 0)
    hsts = "strict-transport-security" in crawl_data.get("headers", {})
    passed_22 = (dep_count == 0 and hsts)
    checks.append({
        "id": "deprecated_html_security",
        "category": "Security & Modern Standards",
        "title": "Modern HTML & Security Headers",
        "weight": 3,
        "passed": passed_22,
        "score_contribution": 3 if passed_22 else (2 if dep_count == 0 else 0),
        "severity": "LOW" if not passed_22 else "INFO",
        "value": f"Deprecated: {dep_count}, HSTS: {'Yes' if hsts else 'No'}",
        "recommendation": "Enable HSTS header and replace legacy HTML elements (<center>, <font>) with CSS."
    })

    # Calculate overall weighted score
    total_weights = sum(c["weight"] for c in checks)
    earned_score = sum(c["score_contribution"] for c in checks)
    final_score = round((earned_score / total_weights) * 100, 1)
    grade = calculate_grade(final_score)

    # Calculate category scores
    categories = {}
    for c in checks:
        cat = c["category"]
        if cat not in categories:
            categories[cat] = {"weight": 0, "earned": 0, "passed_count": 0, "total_count": 0}
        categories[cat]["weight"] += c["weight"]
        categories[cat]["earned"] += c["score_contribution"]
        categories[cat]["total_count"] += 1
        if c["passed"]:
            categories[cat]["passed_count"] += 1

    category_breakdown = {}
    for cat, val in categories.items():
        score_pct = round((val["earned"] / val["weight"]) * 100, 1) if val["weight"] > 0 else 100
        category_breakdown[cat] = {
            "score": score_pct,
            "passed": val["passed_count"],
            "total": val["total_count"]
        }

    passed_total = sum(1 for c in checks if c["passed"])
    failed_total = len(checks) - passed_total

    return {
        "score": final_score,
        "grade": grade,
        "passed_checks": passed_total,
        "failed_checks": failed_total,
        "total_checks": len(checks),
        "category_breakdown": category_breakdown,
        "checks": checks
    }
