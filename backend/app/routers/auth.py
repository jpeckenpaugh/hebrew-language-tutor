import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .. import db
from ..models import AuthOut, UsernameRequest, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])
bearer = HTTPBearer(auto_error=False)

# Lightweight, opaque, in-memory user session tokens (token -> user_id).
# Identity is a non-empty username only; there is no password or credential
# verification (constraint k). Separate namespace from the admin token store.
_user_tokens = {}


def _require_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
) -> int:
    if credentials is None or credentials.credentials not in _user_tokens:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return _user_tokens[credentials.credentials]


def _issue_token(user_id: int) -> str:
    token = secrets.token_hex(32)
    _user_tokens[token] = user_id
    return token


def _username(payload: UsernameRequest) -> str:
    username = payload.username.strip()
    if not username:
        raise HTTPException(status_code=422, detail="Username cannot be empty")
    return username


def _user_out(row) -> dict:
    return UserOut(id=row["id"], username=row["username"]).model_dump()


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
def signup(payload: UsernameRequest):
    username = _username(payload)
    conn = db.get_connection()
    try:
        existing = conn.execute(
            "SELECT id FROM users WHERE username = ?", (username,)
        ).fetchone()
        if existing is not None:
            raise HTTPException(status_code=409, detail="Username already exists")
        cur = conn.execute(
            "INSERT INTO users (username, created_at) VALUES (?, ?)",
            (username, db._now_iso()),
        )
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (cur.lastrowid,)).fetchone()
        return {"data": AuthOut(user=_user_out(user), token=_issue_token(user["id"])).model_dump()}
    finally:
        conn.close()


@router.post("/login", response_model=dict)
def login(payload: UsernameRequest):
    username = _username(payload)
    conn = db.get_connection()
    try:
        user = conn.execute(
            "SELECT * FROM users WHERE username = ?", (username,)
        ).fetchone()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return {"data": AuthOut(user=_user_out(user), token=_issue_token(user["id"])).model_dump()}
    finally:
        conn.close()


@router.post("/logout", response_model=dict)
def logout(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    if credentials is None or credentials.credentials not in _user_tokens:
        raise HTTPException(status_code=401, detail="Not authenticated")
    _user_tokens.pop(credentials.credentials, None)
    return {"data": {"logged_out": True}}


@router.get("/me", response_model=dict)
def me(user_id: int = Depends(_require_user)):
    conn = db.get_connection()
    try:
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if user is None:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return {"data": _user_out(user)}
    finally:
        conn.close()