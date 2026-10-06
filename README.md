# 🚀 ApexSEO — Zero-Cost Semrush Architecture & B2B SaaS Engine

> A high-performance, keyless B2B SaaS platform engineered for Technical SEO Auditing, Google Autocomplete Alphabet-Soup Mining, SERP Intelligence, and Automated Code Remediation (**Autopilot Mode**).

---

## 🏗️ 8 Core Modules Architecture

1. **Crawler Engine (`crawler.py`)**:
   - `requests` + `BeautifulSoup`
   - High-precision TTFB (Time to First Byte in ms) capture
   - Full redirect chain traversal (301/302 hops detection)
   - HTTP response headers extraction (`Content-Type`, `Cache-Control`, `X-Robots-Tag`, `HSTS`)

2. **22-Check Weighted Audit Engine (`audit_engine.py`)**:
   - Computes 0–100 health score and assigns letter grades ($A+, A, B, C, D$).
   - 4 Pillars:
     - **Indexing & Crawlability (26%)**: HTTP 200 OK, Redirects $\le 1$ hop, Canonical tag, Robots.txt disallow, Meta robots, XML Sitemap discovery.
     - **Content & On-Page Meta (28%)**: Title tag (30-60 chars), Meta description (70-160 chars), Single H1, Subheading hierarchy (H2/H3), Image alt coverage $\ge 90\%$, Text-to-HTML ratio $\ge 12\%$, OpenGraph tags.
     - **Performance & Vitals (26%)**: TTFB $< 600\text{ms}$, HTML payload $< 150\text{KB}$, Mobile viewport meta, PageSpeed Performance index, Core Web Vitals (LCP $< 2.5\text{s}$, CLS $< 0.1$).
     - **Security & Modern Standards (20%)**: SSL HTTPS enforcement, HTTP $\to$ HTTPS 301 redirect, Schema.org JSON-LD structured data, Modern HTML & HSTS security headers.

3. **Keyword Intelligence Engine (`keyword_engine.py`)**:
   - Keyless Google Autocomplete Alphabet-Soup Mining (`{seed} [a-z]`, `{seed} [0-9]`, modifiers).
   - Automated Search Intent classification: **Informational**, **Commercial**, **Transactional**, **Navigational**.
   - Estimated search volume, keyword difficulty index, and CPC heuristic.
   - 1-Click CSV export.

4. **SERP Competitor Peek (`serp_engine.py`)**:
   - Live organic search results scraping.
   - Top 10 ranking positions, title tags, snippet bodies, and competitor domain breakdown.
   - Average competitor title and snippet length comparison metrics.

5. **Speed Engine (`speed_engine.py`)**:
   - Google PageSpeed Insights v5 REST API integration (keyless mode).
   - Core Web Vitals metrics: LCP, FCP, CLS, TBT, Speed Index.
   - Graceful degradation: Automatically falls back to high-fidelity synthetic lab benchmarks if rate-limited.

6. **Advisor & AI Expert System (`advisor_engine.py`)**:
   - Linear-style issue backlog categorized by Severity: **Critical**, **High**, **Medium**, **Low**.
   - Action tags: "Index-Blocker", "Core Ranking Factor", "CTR Loss", "Code Hygiene".
   - Generates actionable code remediation artifacts.

7. **Accounts, Billing & Rate Limiter (`database.py`)**:
   - Zero-setup local SQLite database (`apex_seo.db`).
   - Plan quotas (Free: 10/day, Pro: 500/day, Enterprise: Unlimited).
   - Automatic user account initialization.

8. **Report Store & Trend History (`report_store.py`)**:
   - Full JSON snapshot persistence for every audit run.
   - Chronological score trajectory tracking for domains.

---

## ⚡ The USP: Autopilot Mode (Loop Engineering)

- **Simulated Re-Audit Loop**: The advisor evaluates all fixable technical factors, simulates applying generated patches, and re-computes the score in real time (e.g. $71/B \to 84/A$, $+13\text{ pts}$).
- **1-Click Remediation Hub**:
  - Next.js 14+ `metadata` export snippet.
  - HTML5 `<head>` code block.
  - Downloadable production `robots.txt` with XML sitemap directive.
  - Schema.org JSON-LD structured data.
  - Nginx 301 HTTPS & canonical domain redirects.

---

## 🎨 UI/UX & Design Philosophy

- **Inspiration**: Linear (issue triage board, keyboard-friendly feel), Vercel (1px border lines, slate grid background), Stripe (metric density and typography hierarchy).
- **Color Theme**: Precision Electric Blue (`#0062FF`), Deep Cobalt Navy (`#0A2540`), Slate-50 background, Emerald green accents.
- **Animations & Micro-Interactions**:
  - Live 10-step Server-Sent Events (SSE) modal with animated status indicators, millisecond timer, and streaming terminal logs.
  - Radial SVG score dial with color threshold transitions.
  - Filterable 22-check table with instant search.

---

## 🚦 How to Run

### 1. Start the Backend API (FastAPI)
```bash
python run_backend.py
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### 2. Start the Frontend (Vite + React)
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`
