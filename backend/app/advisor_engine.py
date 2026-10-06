"""
ApexSEO Advisor Engine (Module 6)
Rule-based expert system that sorts failed checks by severity and synthesizes actionable code fixes.
"""

from typing import Dict, Any, List

def build_remediation_artifacts(url: str, domain: str, dom_data: dict) -> dict:
    """
    Synthesizes concrete code artifacts (meta tags, robots.txt, schema JSON-LD, etc.).
    """
    clean_title = dom_data.get("title") or f"{domain.capitalize()} - High Performance Platform"
    if len(clean_title) < 30:
        clean_title = f"{clean_title} | Cloud Solutions & API Infrastructure"

    clean_desc = dom_data.get("meta_description") or (
        f"Experience modern enterprise solutions with {domain}. Fast, reliable, and scalable "
        f"infrastructure designed for world-class development teams."
    )
    if len(clean_desc) < 70:
        clean_desc = f"{clean_desc} Explore features, real-time analytics, and developer documentation today."

    canonical_url = dom_data.get("canonical") or (f"https://{domain}/" if not url.endswith("/") else url)

    # 1. HTML Head snippet
    head_code = (
        f"<!-- ApexSEO Optimized Head Meta Tags -->\n"
        f"<title>{clean_title}</title>\n"
        f'<meta name="description" content="{clean_desc}">\n'
        f'<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<link rel="canonical" href="{canonical_url}">\n\n'
        f"<!-- Open Graph Social Protocol -->\n"
        f'<meta property="og:type" content="website">\n'
        f'<meta property="og:title" content="{clean_title}">\n'
        f'<meta property="og:description" content="{clean_desc}">\n'
        f'<meta property="og:url" content="{canonical_url}">\n'
        f'<meta property="og:image" content="https://{domain}/og-image.png">\n'
        f'<meta name="twitter:card" content="summary_large_image">'
    )

    # 2. Next.js 14+ App Router metadata object
    nextjs_code = (
        f"// app/layout.tsx or app/page.tsx (Next.js 14+ Metadata)\n"
        f"import type {{ Metadata }} from 'next';\n\n"
        f"export const metadata: Metadata = {{\n"
        f"  title: '{clean_title}',\n"
        f"  description: '{clean_desc}',\n"
        f"  alternates: {{\n"
        f"    canonical: '{canonical_url}',\n"
        f"  }},\n"
        f"  openGraph: {{\n"
        f"    title: '{clean_title}',\n"
        f"    description: '{clean_desc}',\n"
        f"    url: '{canonical_url}',\n"
        f"    siteName: '{domain.capitalize()}',\n"
        f"    images: [\n"
        f"      {{\n"
        f"        url: 'https://{domain}/og-image.png',\n"
        f"        width: 1200,\n"
        f"        height: 630,\n"
        f"      }},\n"
        f"    ],\n"
        f"    type: 'website',\n"
        f"  }},\n"
        f"}};"
    )

    # 3. Production robots.txt template
    robots_code = (
        f"# ApexSEO Production robots.txt for {domain}\n"
        f"User-agent: *\n"
        f"Allow: /\n"
        f"Disallow: /api/\n"
        f"Disallow: /admin/\n"
        f"Disallow: /private/\n\n"
        f"Sitemap: https://{domain}/sitemap.xml"
    )

    # 4. JSON-LD Schema.org markup
    schema_code = (
        f'<script type="application/ld+json">\n'
        f"{{\n"
        f'  "@context": "https://schema.org",\n'
        f'  "@type": "WebSite",\n'
        f'  "name": "{domain.capitalize()}",\n'
        f'  "url": "https://{domain}/",\n'
        f'  "potentialAction": {{\n'
        f'    "@type": "SearchAction",\n'
        f'    "target": "https://{domain}/search?q={{search_term_string}}",\n'
        f'    "query-input": "required name=search_term_string"\n'
        f"  }}\n"
        f"}}\n"
        f"</script>"
    )

    # 5. Nginx redirect configuration
    nginx_code = (
        f"# Nginx HTTP to HTTPS + Canonical Domain Enforcement\n"
        f"server {{\n"
        f"    listen 80;\n"
        f"    server_name {domain} www.{domain};\n"
        f"    return 301 https://{domain}$request_uri;\n"
        f"}}\n\n"
        f"server {{\n"
        f"    listen 443 ssl http2;\n"
        f"    server_name www.{domain};\n"
        f"    return 301 https://{domain}$request_uri;\n"
        f"}}"
    )

    return {
        "recommended_title": clean_title,
        "recommended_description": clean_desc,
        "recommended_canonical": canonical_url,
        "html_head_snippet": head_code,
        "nextjs_metadata_snippet": nextjs_code,
        "robots_txt_snippet": robots_code,
        "schema_json_ld": schema_code,
        "nginx_snippet": nginx_code
    }

def generate_advisor_plan(audit_results: dict, url: str, domain: str, dom_data: dict) -> dict:
    """
    Evaluates failed and warned checks and builds a prioritized Linear-style remediation backlog.
    """
    checks = audit_results.get("checks", [])
    failed_checks = [c for c in checks if not c["passed"]]

    # Severity ordering matrix
    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}
    failed_checks.sort(key=lambda x: severity_order.get(x.get("severity", "LOW"), 99))

    tickets: List[Dict[str, Any]] = []
    projected_points_gain = 0

    for idx, c in enumerate(failed_checks):
        sev = c.get("severity", "MEDIUM")
        weight = c.get("weight", 3)
        current_val = c.get("value", "")
        rec = c.get("recommendation", "")
        
        # Estimate gain if resolved
        possible_gain = weight - c.get("score_contribution", 0)
        projected_points_gain += possible_gain

        # Action tag
        if sev == "CRITICAL":
            tag = "Index-Blocker"
            effort = "15 mins"
        elif sev == "HIGH":
            tag = "Core Ranking Factor"
            effort = "30 mins"
        elif sev == "MEDIUM":
            tag = "CTR & Speed Loss"
            effort = "20 mins"
        else:
            tag = "Code Hygiene"
            effort = "10 mins"

        tickets.append({
            "id": f"ISSUE-{idx+1:03d}",
            "check_id": c["id"],
            "title": c["title"],
            "severity": sev,
            "category": c["category"],
            "current_status": current_val,
            "action_tag": tag,
            "effort": effort,
            "potential_gain": f"+{possible_gain} pts",
            "instruction": rec
        })

    artifacts = build_remediation_artifacts(url, domain, dom_data)
    current_score = audit_results.get("score", 70)
    simulated_future_score = min(99.0, round(current_score + projected_points_gain, 1))

    return {
        "critical_count": sum(1 for t in tickets if t["severity"] == "CRITICAL"),
        "high_count": sum(1 for t in tickets if t["severity"] == "HIGH"),
        "medium_count": sum(1 for t in tickets if t["severity"] == "MEDIUM"),
        "low_count": sum(1 for t in tickets if t["severity"] == "LOW"),
        "total_issues": len(tickets),
        "projected_points_gain": projected_points_gain,
        "current_score": current_score,
        "simulated_future_score": simulated_future_score,
        "tickets": tickets,
        "artifacts": artifacts
    }
