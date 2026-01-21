from __future__ import annotations

import os
import sqlite3
from pathlib import Path
from datetime import datetime

_DB_PATH: str | None = None


def init_db(db_path: str):
    """Set DB path once on startup (absolute or relative)."""
    global _DB_PATH
    p = Path(db_path)
    # لو المسار نسبي، نخليه نسبةً لمجلد backend (ثابت)
    if not p.is_absolute():
        backend_dir = Path(__file__).resolve().parents[2]  # .../backend
        p = (backend_dir / p).resolve()
    _DB_PATH = str(p)


def now_iso():
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _default_db_path() -> str:
    """
    Default DB location: backend/app.db
    session.py path: backend/app/db/session.py
    parents[2] = backend/
    """
    backend_dir = Path(__file__).resolve().parents[2]  # .../backend
    return str((backend_dir / "app.db").resolve())


def _resolve_db_path() -> str:
    """
    Priority:
    1) init_db()
    2) env DB_PATH
    3) default backend/app.db
    """
    if _DB_PATH:
        return _DB_PATH

    env_path = os.getenv("DB_PATH")
    if env_path:
        p = Path(env_path)
        if not p.is_absolute():
            backend_dir = Path(__file__).resolve().parents[2]
            p = (backend_dir / p).resolve()
        return str(p)

    return _default_db_path()


def _connect():
    db_path = _resolve_db_path()

    con = sqlite3.connect(db_path, timeout=30, check_same_thread=False)
    con.row_factory = sqlite3.Row

    # PRAGMAs
    con.execute("PRAGMA journal_mode=WAL;")
    con.execute("PRAGMA busy_timeout=5000;")
    con.execute("PRAGMA foreign_keys=ON;")

    return con


async def fetchall(query: str, params=()):
    con = _connect()
    try:
        cur = con.execute(query, params)
        rows = cur.fetchall()
        return [dict(r) for r in rows]
    finally:
        con.close()


async def fetchone(query: str, params=()):
    con = _connect()
    try:
        cur = con.execute(query, params)
        row = cur.fetchone()
        return dict(row) if row else None
    finally:
        con.close()


async def execute(query: str, params=()):
    con = _connect()
    try:
        cur = con.execute(query, params)
        con.commit()
        return cur.lastrowid
    finally:
        con.close()
