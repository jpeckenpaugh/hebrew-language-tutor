from fastapi import APIRouter, HTTPException

from .. import db
from ..models import LessonDetail, LessonOut, VocabOut

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/lessons", response_model=dict)
def list_lessons():
    conn = db.get_connection()
    try:
        rows = conn.execute("SELECT * FROM lessons ORDER BY id").fetchall()
        lessons = []
        for row in rows:
            count = conn.execute(
                "SELECT COUNT(*) AS n FROM vocab WHERE lesson_id = ?", (row["id"],)
            ).fetchone()["n"]
            lessons.append(
                LessonOut(id=row["id"], title=row["title"], vocab_count=count).model_dump()
            )
        return {"data": lessons}
    finally:
        conn.close()


@router.get("/lessons/{lesson_id}", response_model=dict)
def get_lesson(lesson_id: int):
    conn = db.get_connection()
    try:
        row = conn.execute("SELECT * FROM lessons WHERE id = ?", (lesson_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Lesson not found")
        vocab_rows = conn.execute(
            "SELECT * FROM vocab WHERE lesson_id = ? ORDER BY id", (lesson_id,)
        ).fetchall()
        vocab = [
            VocabOut(id=v["id"], english=v["english"], hebrew=v["hebrew"]).model_dump()
            for v in vocab_rows
        ]
        detail = LessonDetail(id=row["id"], title=row["title"], vocab=vocab)
        return {"data": detail.model_dump()}
    finally:
        conn.close()


@router.get("/lessons/{lesson_id}/vocab", response_model=dict)
def get_lesson_vocab(lesson_id: int):
    conn = db.get_connection()
    try:
        row = conn.execute("SELECT * FROM lessons WHERE id = ?", (lesson_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Lesson not found")
        vocab_rows = conn.execute(
            "SELECT * FROM vocab WHERE lesson_id = ? ORDER BY id", (lesson_id,)
        ).fetchall()
        vocab = [
            VocabOut(id=v["id"], english=v["english"], hebrew=v["hebrew"]).model_dump()
            for v in vocab_rows
        ]
        return {"data": vocab}
    finally:
        conn.close()