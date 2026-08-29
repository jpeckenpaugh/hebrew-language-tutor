import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .. import db
from ..models import (
    LessonCreate,
    LessonUpdate,
    LoginRequest,
    VocabCreate,
    VocabOut,
    VocabUpdate,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])
bearer = HTTPBearer(auto_error=False)

_active_tokens = set()


def _require_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
):
    if credentials is None or credentials.credentials not in _active_tokens:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return credentials.credentials


@router.post("/login", response_model=dict)
def login(payload: LoginRequest):
    if not payload.username or not payload.password:
        raise HTTPException(status_code=400, detail="Credentials required")
    token = secrets.token_hex(32)
    _active_tokens.add(token)
    return {"data": {"token": token, "admin": True}}


@router.post("/logout", response_model=dict)
def logout(token: str = Depends(_require_token)):
    _active_tokens.discard(token)
    return {"data": {"logged_out": True}}


@router.post("/lessons", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_lesson(payload: LessonCreate, token: str = Depends(_require_token)):
    conn = db.get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO lessons (title, created_at) VALUES (?, ?)",
            (payload.title, _now_iso()),
        )
        conn.commit()
        return {"data": {"id": cur.lastrowid, "title": payload.title, "vocab": []}}
    finally:
        conn.close()


@router.put("/lessons/{lesson_id}", response_model=dict)
def update_lesson(lesson_id: int, payload: LessonUpdate, token: str = Depends(_require_token)):
    conn = db.get_connection()
    try:
        row = conn.execute("SELECT * FROM lessons WHERE id = ?", (lesson_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Lesson not found")
        conn.execute(
            "UPDATE lessons SET title = ? WHERE id = ?", (payload.title, lesson_id)
        )
        conn.commit()
        return {"data": {"id": lesson_id, "title": payload.title}}
    finally:
        conn.close()


@router.post(
    "/lessons/{lesson_id}/vocab",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
def create_vocab(lesson_id: int, payload: VocabCreate, token: str = Depends(_require_token)):
    conn = db.get_connection()
    try:
        lesson = conn.execute("SELECT id FROM lessons WHERE id = ?", (lesson_id,)).fetchone()
        if lesson is None:
            raise HTTPException(status_code=404, detail="Lesson not found")
        cur = conn.execute(
            "INSERT INTO vocab (lesson_id, english, hebrew) VALUES (?, ?, ?)",
            (lesson_id, payload.english, payload.hebrew),
        )
        conn.commit()
        return {
            "data": {
                "id": cur.lastrowid,
                "lesson_id": lesson_id,
                "english": payload.english,
                "hebrew": payload.hebrew,
            }
        }
    finally:
        conn.close()


@router.put("/vocab/{vocab_id}", response_model=dict)
def update_vocab(vocab_id: int, payload: VocabUpdate, token: str = Depends(_require_token)):
    if payload.english is None and payload.hebrew is None:
        raise HTTPException(status_code=422, detail="At least one field required")
    conn = db.get_connection()
    try:
        row = conn.execute("SELECT * FROM vocab WHERE id = ?", (vocab_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Vocab not found")
        english = payload.english if payload.english is not None else row["english"]
        hebrew = payload.hebrew if payload.hebrew is not None else row["hebrew"]
        conn.execute(
            "UPDATE vocab SET english = ?, hebrew = ? WHERE id = ?",
            (english, hebrew, vocab_id),
        )
        conn.commit()
        return {
            "data": VocabOut(
                id=vocab_id, english=english, hebrew=hebrew
            ).model_dump()
            | {"lesson_id": row["lesson_id"]}
        }
    finally:
        conn.close()


def _now_iso():
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).isoformat()