from fastapi import APIRouter

from .. import db
from ..models import UserOut

router = APIRouter(prefix="/api", tags=["users"])


@router.get("/users", response_model=dict)
def list_users():
    conn = db.get_connection()
    try:
        rows = conn.execute("SELECT id, username FROM users ORDER BY id").fetchall()
        return {"data": [UserOut(id=r["id"], username=r["username"]).model_dump() for r in rows]}
    finally:
        conn.close()