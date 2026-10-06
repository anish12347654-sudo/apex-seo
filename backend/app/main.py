"""
ApexSEO FastAPI Server (Main Entry Point)
Exposes REST and SSE endpoints for audits, keyword mining, SERP peeks, and history.
"""

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

from app.database import init_db, get_or_create_default_user, get_audit_by_id, get_domain_history, get_recent_audits
from app.pipeline import execute_audit_pipeline, stream_pipeline_progress
from app.keyword_engine import mine_alphabet_soup_keywords
from app.serp_engine import fetch_serp_results
from app.autopilot import simulate_autopilot_fix

# Initialize SQLite database schema
init_db()

app = FastAPI(
    title="ApexSEO Enterprise API",
    description="Zero-Cost Semrush Alternative for Technical SEO, Auditing, and Keyword Intelligence",
    version="2.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    url: str

class AutopilotRequest(BaseModel):
    audit_id: Optional[str] = None
    report_data: Optional[dict] = None

@app.get("/")
def root():
    return {
        "service": "ApexSEO Backend Engine",
        "status": "operational",
        "docs": "/docs",
        "version": "2.0.0"
    }

@app.get("/api/user")
def get_user_profile():
    return get_or_create_default_user()

@app.post("/api/audit/run")
def run_audit(req: AuditRequest):
    """Executes the full 10-step audit pipeline synchronously."""
    if not req.url:
        raise HTTPException(status_code=400, detail="Target URL is required")
    report = execute_audit_pipeline(req.url)
    return report

@app.get("/api/audit/stream")
def stream_audit(url: str = Query(..., description="Target URL to audit")):
    """Streams the 10-step audit pipeline in real-time via Server-Sent Events."""
    if not url:
        raise HTTPException(status_code=400, detail="URL parameter is required")
    
    return StreamingResponse(
        stream_pipeline_progress(url),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@app.get("/api/audit/{audit_id}")
def get_audit(audit_id: str):
    """Fetches a saved audit report by ID."""
    report = get_audit_by_id(audit_id)
    if not report:
        raise HTTPException(status_code=404, detail="Audit report not found")
    return report

@app.get("/api/reports/history")
def get_history(domain: str = Query(..., description="Target domain to query")):
    """Returns chronological audit score trends for domain."""
    history = get_domain_history(domain)
    return {"domain": domain, "history": history}

@app.get("/api/reports/recent")
def get_recent():
    """Returns list of recent audits."""
    return {"recent": get_recent_audits(10)}

@app.post("/api/keywords/mine")
def mine_keywords(seed: str = Query(..., description="Seed keyword or brand name")):
    """Mines alphabet-soup long-tail queries directly."""
    return mine_alphabet_soup_keywords(seed, max_keywords=50)

@app.get("/api/serp/peek")
def serp_peek(query: str = Query(..., description="Query to scrape SERP for")):
    """Fetches real-time SERP rankings and competitor snippets."""
    return fetch_serp_results(query, max_results=10)

@app.post("/api/autopilot/simulate")
def autopilot_simulation(req: AutopilotRequest):
    """Simulates Autopilot loop re-audit and computes projected score boost."""
    report = req.report_data
    if not report and req.audit_id:
        report = get_audit_by_id(req.audit_id)
    if not report:
        raise HTTPException(status_code=400, detail="Valid audit report or audit_id required")
    
    return simulate_autopilot_fix(report)
