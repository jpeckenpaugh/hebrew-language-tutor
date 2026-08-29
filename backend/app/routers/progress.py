from fastapi import APIRouter, Depends, HTTPException

from .. import db
from ..models import ProgressOut
from .auth import _require_user

router = APIRouter(prefix="/api", tags=["progress"])


@router.get("/lessons/{lesson_id}/progress", response_model=dict)
def lesson_progress(lesson_id: int, user_id: int = Depends(_require_user)):
    conn = db.get_connection()
    try:
        lesson = conn.execute(
            "SELECT id FROM lessons WHERE id = ?", (lesson_id,)
        ).fetchone()
        if lesson is None:
            raise HTTPException(status_code=404, detail="Lesson not found")
        total = conn.execute(
            "SELECT COUNT(*) AS n FROM vocab WHERE lesson_id = ?", (lesson_id,)
        ).fetchone()["n"]
        known_rows = conn.execute(
            """
            SELECT v.id
            FROM vocab v
            JOIN known_words kw ON kw.vocab_id = v.id
            WHERE v.lesson_id = ? AND kw.user_id = ?
            ORDER BY v.id
            """,
            (lesson_id, user_id),
        ).fetchall()
        known_ids = [r["id"] for r in known_rows]
        progress = ProgressOut(
            lesson_id=lesson_id,
            total=total,
            known=len(known_ids),
            known_vocab_ids=known_ids,
        )
        return {"data": progress.model_dump()}
    finally:
        conn.close()