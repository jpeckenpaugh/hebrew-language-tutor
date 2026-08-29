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
                hebrew TEXT NOT NULL,
                transliteration TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lesson_id INTEGER NOT NULL REFERENCES lessons(id),
                user_id INTEGER NOT NULL REFERENCES users(id),
                mode TEXT NOT NULL,
                correct INTEGER NOT NULL,
                total INTEGER NOT NULL,
                score_pct REAL NOT NULL,
                taken_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS attempt_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                score_id INTEGER NOT NULL REFERENCES scores(id),
                vocab_id INTEGER NOT NULL REFERENCES vocab(id),
                correct INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS known_words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id),
                vocab_id INTEGER NOT NULL REFERENCES vocab(id),
                known_at TEXT NOT NULL,
                UNIQUE (user_id, vocab_id)
            );
            """
        )
        _migrate(conn)
        seed_if_empty(conn)
        conn.commit()
    finally:
        conn.close()


def _migrate(conn):
    _add_vocab_transliteration(conn)
    _add_scores_user_id(conn)


def _add_vocab_transliteration(conn):
    cols = [r["name"] for r in conn.execute("PRAGMA table_info(vocab)")]
    if "transliteration" in cols:
        return
    conn.execute("ALTER TABLE vocab ADD COLUMN transliteration TEXT NOT NULL DEFAULT ''")
    lookup = {
        (english, hebrew): translit
        for lesson in seed.LESSONS
        for english, hebrew, translit in lesson["vocab"]
    }
    for row in conn.execute("SELECT id, english, hebrew FROM vocab").fetchall():
        translit = lookup.get((row["english"], row["hebrew"]), "")
        conn.execute(
            "UPDATE vocab SET transliteration = ? WHERE id = ?", (translit, row["id"])
        )


def _add_scores_user_id(conn):
    cols = [r["name"] for r in conn.execute("PRAGMA table_info(scores)")]
    if "user_id" in cols:
        return
    # The v0.1 `scores` table has no user identity. Scores are now per-user
    # (NOT NULL user_id). Pre-enhancement rows carry no user and cannot be
    # attributed to a real account (feature 03 requires every saved attempt to
    # belong to a signed-in user), so the table is recreated without them. This
    # is a deliberate schema-migration decision documented in the Stage 6
    # summary; no in-scope user data is lost.
    conn.execute("DROP TABLE scores")
    conn.execute(
        """
        CREATE TABLE scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id INTEGER NOT NULL REFERENCES lessons(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            mode TEXT NOT NULL,
            correct INTEGER NOT NULL,
            total INTEGER NOT NULL,
            score_pct REAL NOT NULL,
            taken_at TEXT NOT NULL
        )
        """
    )


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
        for english, hebrew, translit in lesson["vocab"]:
            conn.execute(
                "INSERT INTO vocab (lesson_id, english, hebrew, transliteration) VALUES (?, ?, ?, ?)",
                (lesson_id, english, hebrew, translit),
            )