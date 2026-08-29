from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from .. import db
from ..models import ReviewItem, ReviewOut, ScoreCreate, ScoreOut
from .auth import _require_user

router = APIRouter(prefix="/api", tags=["scores"])


def _score_out(row):
    return ScoreOut(
        id=row["id"],
        lesson_id=row["lesson_id"],
        user_id=row["user_id"],
        mode=row["mode"],
        correct=row["correct"],
        total=row["total"],
        score_pct=row["score_pct"],
        taken_at=row["taken_at"],
    ).model_dump()


@router.post("/scores", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_score(payload: ScoreCreate, user_id: int = Depends(_require_user)):
    conn = db.get_connection()
    try:
        lesson = conn.execute(
            "SELECT id FROM lessons WHERE id = ?", (payload.lesson_id,)
        ).fetchone()
        if lesson is None:
            raise HTTPException(status_code=422, detail="Lesson not found")
        if payload.correct > payload.total:
            raise HTTPException(status_code=422, detail="correct cannot exceed total")
        if not payload.answers:
            raise HTTPException(status_code=422, detail="answers cannot be empty")

        vocab_ids = [a.vocab_id for a in payload.answers]
        placeholders = ",".join("?" for _ in vocab_ids)
        existing = {
            r["id"]
            for r in conn.execute(
                f"SELECT id FROM vocab WHERE id IN ({placeholders})", vocab_ids
            ).fetchall()
        }
        if any(v not in existing for v in vocab_ids):
            raise HTTPException(status_code=422, detail="Invalid vocab_id in answers")

        score_pct = round((payload.correct / payload.total) * 100.0, 2)
        taken_at = datetime.now(timezone.utc).isoformat()
        cur = conn.execute(
            "INSERT INTO scores (lesson_id, user_id, mode, correct, total, score_pct, taken_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                payload.lesson_id,
                user_id,
                payload.mode,
                payload.correct,
                payload.total,
                score_pct,
                taken_at,
            ),
        )
        score_id = cur.lastrowid

        for a in payload.answers:
            conn.execute(
                "INSERT INTO attempt_items (score_id, vocab_id, correct) VALUES (?, ?, ?)",
                (score_id, a.vocab_id, 1 if a.correct else 0),
            )
            if payload.mode == "exam" and a.correct:
                conn.execute(
                    "INSERT INTO known_words (user_id, vocab_id, known_at) VALUES (?, ?, ?) "
                    "ON CONFLICT(user_id, vocab_id) DO NOTHING",
                    (user_id, a.vocab_id, taken_at),
                )

        conn.commit()
        row = conn.execute(
            "SELECT * FROM scores WHERE id = ?", (score_id,)
        ).fetchone()
        return {"data": _score_out(row)}
    finally:
        conn.close()


@router.get("/scores", response_model=dict)
def list_scores(user_id: int = Depends(_require_user)):
    conn = db.get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM scores WHERE user_id = ? ORDER BY taken_at DESC, id DESC",
            (user_id,),
        ).fetchall()
        return {"data": [_score_out(r) for r in rows]}
    finally:
        conn.close()


@router.get("/scores/{score_id}/review", response_model=dict)
def review_score(score_id: int, user_id: int = Depends(_require_user)):
    conn = db.get_connection()
    try:
        score = conn.execute(
            "SELECT * FROM scores WHERE id = ? AND user_id = ?", (score_id, user_id)
        ).fetchone()
        if score is None:
            raise HTTPException(status_code=404, detail="Attempt not found")
        wrong_rows = conn.execute(
            """
            SELECT ai.vocab_id, v.english, v.hebrew, v.transliteration
            FROM attempt_items ai
            JOIN vocab v ON v.id = ai.vocab_id
            WHERE ai.score_id = ? AND ai.correct = 0
            ORDER BY ai.id
            """,
            (score_id,),
        ).fetchall()
        wrong = [
            ReviewItem(
                vocab_id=r["vocab_id"],
                english=r["english"],
                hebrew=r["hebrew"],
                transliteration=r["transliteration"],
            ).model_dump()
            for r in wrong_rows
        ]
        review = ReviewOut(
            id=score["id"],
            lesson_id=score["lesson_id"],
            mode=score["mode"],
            wrong=wrong,
        )
        return {"data": review.model_dump()}
    finally:
        conn.close()