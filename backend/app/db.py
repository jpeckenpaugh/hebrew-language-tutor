import os
import sqlite3
from datetime import datetime, timezone

from . import seed

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "english_tutor.db")


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_connection()
    try:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS vocab (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL REFERENCES lessons(id),
                english TEXT NOT NULL,
                hebrew TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL REFERENCES lessons(id),
                mode TEXT NOT NULL,
                correct INTEGER NOT NULL,
                total INTEGER NOT NULL,
                score_pct REAL NOT NULL,
                taken_at TEXT NOT NULL
            );
            """
        )
        seed_if_empty(conn)
        conn.commit()
    finally:
        conn.close()


def seed_if_empty(conn):
    count = conn.execute("SELECT COUNT(*) AS n FROM lessons").fetchone()["n"]
    if count > 0:
        return
    for lesson in seed.LESSONS:
        cur = conn.execute(
            "INSERT INTO lessons (title, created_at) VALUES (?, ?)",
            (lesson["title"], _now_iso()),
        )
        lesson_id = cur.lastrowid
        for english, hebrew in lesson["vocab"]:
            conn.execute(
                "INSERT INTO vocab (lesson_id, english, hebrew) VALUES (?, ?, ?)",
                (lesson_id, english, hebrew),
            )