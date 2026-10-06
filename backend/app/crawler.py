"""
ApexSEO Crawler Module (Module 1)
Fetches target URL, measures TTFB, records redirect chains, and returns DOM content.
"""

import time
import requests
from urllib.parse import urlparse
import urllib3

# Suppress insecure SSL warnings when verifying fallback
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 ApexSEO/2.0"
)

def normalize_url(raw_url: str) -> str:
    """Ensures URL starts with a valid scheme."""
    raw_url = raw_url.strip()
    if not raw_url.startswith(("http://", "https://")):
        return f"https://{raw_url}"
    return raw_url

def extract_domain(url: str) -> str:
    """Extracts base domain (hostname) from a URL."""
    parsed = urlparse(url)
    return parsed.hostname or url

def crawl_url(target_url: str, timeout: int = 15) -> dict:
    """
    Crawls the specified URL and captures latency, headers, redirects, and HTML.
    """
    normalized = normalize_url(target_url)
    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    })

    redirect_chain = []
    start_time = time.perf_counter()
    ttfb_ms = 0
    total_time_ms = 0

    try:
        # Measure TTFB via stream=True
        resp_stream = session.get(normalized, timeout=timeout, allow_redirects=True, stream=True, verify=False)
        ttfb_ms = round((time.perf_counter() - start_time) * 1000, 2)
        
        # Read the rest of the body
        content = resp_stream.content
        total_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
        
        # Build redirect history
        for r in resp_stream.history:
            redirect_chain.append({
                "status_code": r.status_code,
                "url": r.url,
                "headers": dict(r.headers)
            })

        final_url = resp_stream.url
        status_code = resp_stream.status_code
        headers = dict(resp_stream.headers)
        encoding = resp_stream.encoding or "utf-8"

        try:
            html = content.decode(encoding, errors="replace")
        except Exception:
            html = content.decode("utf-8", errors="replace")

        page_size_bytes = len(content)
        page_size_kb = round(page_size_bytes / 1024, 2)

        return {
            "success": True,
            "input_url": target_url,
            "final_url": final_url,
            "domain": extract_domain(final_url),
            "status_code": status_code,
            "ttfb_ms": ttfb_ms,
            "total_time_ms": total_time_ms,
            "page_size_kb": page_size_kb,
            "redirect_count": len(redirect_chain),
            "redirect_chain": redirect_chain,
            "headers": headers,
            "html": html,
            "error": None
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "input_url": target_url,
            "final_url": normalized,
            "domain": extract_domain(normalized),
            "status_code": 0,
            "ttfb_ms": 0,
            "total_time_ms": round((time.perf_counter() - start_time) * 1000, 2),
            "page_size_kb": 0,
            "redirect_count": 0,
            "redirect_chain": [],
            "headers": {},
            "html": "",
            "error": f"Connection timed out after {timeout} seconds."
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "input_url": target_url,
            "final_url": normalized,
            "domain": extract_domain(normalized),
            "status_code": 0,
            "ttfb_ms": 0,
            "total_time_ms": round((time.perf_counter() - start_time) * 1000, 2),
            "page_size_kb": 0,
            "redirect_count": 0,
            "redirect_chain": [],
            "headers": {},
            "html": "",
            "error": f"Crawl failed: {str(e)}"
        }
