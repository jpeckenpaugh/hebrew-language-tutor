from typing import List, Optional

from pydantic import BaseModel, Field


class VocabOut(BaseModel):
    id: int
    english: str
    hebrew: str


class LessonOut(BaseModel):
    id: int
    title: str
    vocab_count: int


class LessonDetail(BaseModel):
    id: int
    title: str
    vocab: List[VocabOut]


class ScoreCreate(BaseModel):
    lesson_id: int
    mode: str = Field(..., pattern="^(quiz|exam)$")
    correct: int = Field(..., ge=0)
    total: int = Field(..., gt=0)


class ScoreOut(BaseModel):
    id: int
    lesson_id: int
    mode: str
    correct: int
    total: int
    score_pct: float
    taken_at: str


class LoginRequest(BaseModel):
    username: str
    password: str


class LessonCreate(BaseModel):
    title: str


class LessonUpdate(BaseModel):
    title: str


class VocabCreate(BaseModel):
    english: str
    hebrew: str


class VocabUpdate(BaseModel):
    english: Optional[str] = None
    hebrew: Optional[str] = None