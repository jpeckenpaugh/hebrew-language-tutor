from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from .. import db
from ..models import ScoreCreate, ScoreOut

router = APIRouter(prefix="/api", tags=["scores"])


def _score_out(row):
    return ScoreOut(
        id=row["id"],
        lesson_id=row["lesson_id"],
        mode=row["mode"],
        correct=row["correct"],
        total=row["total"],
        score_pct=row["score_pct"],
        taken_at=row["taken_at"],
    ).model_dump()


@router.post("/scores", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_score(payload: ScoreCreate):
    conn = db.get_connection()
    try:
        lesson = conn.execute(
            "SELECT id FROM lessons WHERE id = ?", (payload.lesson_id,)
        ).fetchone()
        if lesson is None:
            raise HTTPException(status_code=422, detail="Lesson not found")
        if payload.correct > payload.total:
            raise HTTPException(status_code=422, detail="correct cannot exceed total")
        score_pct = round((payload.correct / payload.total) * 100.0, 2)
        taken_at = datetime.now(timezone.utc).isoformat()
        cur = conn.execute(
            "INSERT INTO scores (lesson_id, mode, correct, total, score_pct, taken_at) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (
                payload.lesson_id,
                payload.mode,
                payload.correct,
                payload.total,
                score_pct,
                taken_at,
            ),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM scores WHERE id = ?", (cur.lastrowid,)
        ).fetchone()
        return {"data": _score_out(row)}
    finally:
        conn.close()


@router.get("/scores", response_model=dict)
def list_scores():
    conn = db.get_connection()
    try:
        rows = conn.execute("SELECT * FROM scores ORDER BY taken_at DESC, id DESC").fetchall()
        return {"data": [_score_out(r) for r in rows]}
    finally:
        conn.close()