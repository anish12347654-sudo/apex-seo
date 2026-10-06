"""
ApexSEO Database & Accounts Module (Module 7 & 8)
Manages SQLite storage for users, plans, rate limits, audits, and historical trend tracking.
"""

import os
import json
import sqlite3
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "apex_seo.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables for accounts, billing, audits, and trend tracking."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # 1. Users & Subscription Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                full_name TEXT,
                plan TEXT DEFAULT 'PRO',
                api_key TEXT UNIQUE,
                audits_count INTEGER DEFAULT 0,
                audits_limit INTEGER DEFAULT 500,
                created_at TEXT
            )
        """)

        # 2. Audits Store Table (Full JSON Blob + Indexed Columns)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audits (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                url TEXT,
                domain TEXT,
                score REAL,
                grade TEXT,
                ttfb_ms REAL,
                page_size_kb REAL,
                status TEXT DEFAULT 'COMPLETED',
                checks_summary TEXT,
                full_report TEXT,
                created_at TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        # Create indexes for fast domain trend queries
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_audits_domain ON audits (domain)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_audits_created ON audits (created_at)")

        # Create default demo Pro user if not exists
        cursor.execute("SELECT id FROM users WHERE id = 'usr_demo_pro'")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO users (id, email, full_name, plan, api_key, audits_count, audits_limit, created_at)
                VALUES ('usr_demo_pro', 'alex@apexseo.dev', 'Alex Mercer (Founding Engineer)', 'PRO', 'apex_live_sec_892fbc9', 14, 500, ?)
            """, (datetime.utcnow().isoformat(),))

        conn.commit()

def get_or_create_default_user() -> dict:
    """Returns the active user account context."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = 'usr_demo_pro'")
        row = cursor.fetchone()
        if row:
            return dict(row)
        return {
            "id": "usr_demo_pro",
            "email": "alex@apexseo.dev",
            "plan": "PRO",
            "audits_count": 0,
            "audits_limit": 500
        }

def save_audit_report(user_id: str, report: dict) -> str:
    """Persists an audit report JSON blob to SQLite."""
    audit_id = report.get("id") or f"aud_{uuid.uuid4().hex[:10]}"
    url = report.get("url", "")
    domain = report.get("domain", "")
    score = report.get("score", 0.0)
    grade = report.get("grade", "C")
    ttfb = report.get("crawl", {}).get("ttfb_ms", 0.0)
    size_kb = report.get("crawl", {}).get("page_size_kb", 0.0)
    created_at = report.get("created_at") or datetime.utcnow().isoformat()

    summary = {
        "score": score,
        "grade": grade,
        "passed": report.get("passed_checks", 0),
        "failed": report.get("failed_checks", 0),
        "total": report.get("total_checks", 22)
    }

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO audits 
            (id, user_id, url, domain, score, grade, ttfb_ms, page_size_kb, status, checks_summary, full_report, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, ?, ?)
        """, (
            audit_id,
            user_id,
            url,
            domain,
            score,
            grade,
            ttfb,
            size_kb,
            json.dumps(summary),
            json.dumps(report),
            created_at
        ))

        # Increment user audits count
        cursor.execute("UPDATE users SET audits_count = audits_count + 1 WHERE id = ?", (user_id,))
        conn.commit()

    return audit_id

def get_audit_by_id(audit_id: str) -> Optional[dict]:
    """Retrieves full audit report JSON by ID."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT full_report FROM audits WHERE id = ?", (audit_id,))
        row = cursor.fetchone()
        if row and row["full_report"]:
            return json.loads(row["full_report"])
    return None

def get_domain_history(domain: str, limit: int = 15) -> List[dict]:
    """Retrieves chronological score history for trend tracking."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, url, domain, score, grade, ttfb_ms, page_size_kb, checks_summary, created_at
            FROM audits
            WHERE domain = ?
            ORDER BY created_at ASC
            LIMIT ?
        """, (domain, limit))
        rows = cursor.fetchall()
        
        history = []
        for r in rows:
            history.append({
                "id": r["id"],
                "url": r["url"],
                "domain": r["domain"],
                "score": r["score"],
                "grade": r["grade"],
                "ttfb_ms": r["ttfb_ms"],
                "page_size_kb": r["page_size_kb"],
                "summary": json.loads(r["checks_summary"]) if r["checks_summary"] else {},
                "created_at": r["created_at"]
            })
        return history

def get_recent_audits(limit: int = 10) -> List[dict]:
    """Retrieves recent audits for global dashboard view."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, url, domain, score, grade, ttfb_ms, created_at
            FROM audits
            ORDER BY created_at DESC
            LIMIT ?
        """, (limit,))
        return [dict(r) for r in cursor.fetchall()]

# Ensure tables are initialized on import
init_db()
