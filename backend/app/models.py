from typing import List, Optional

from pydantic import BaseModel, Field


class VocabOut(BaseModel):
    id: int
    english: str
    hebrew: str
    transliteration: str


class LessonOut(BaseModel):
    id: int
    title: str
    vocab_count: int


class LessonDetail(BaseModel):
    id: int
    title: str
    vocab: List[VocabOut]


class AnswerItem(BaseModel):
    vocab_id: int
    correct: bool


class ScoreCreate(BaseModel):
    lesson_id: int
    mode: str = Field(..., pattern="^(quiz|exam)$")
    correct: int = Field(..., ge=0)
    total: int = Field(..., gt=0)
    answers: List[AnswerItem]


class ScoreOut(BaseModel):
    id: int
    lesson_id: int
    user_id: int
    mode: str
    correct: int
    total: int
    score_pct: float
    taken_at: str


class ReviewItem(BaseModel):
    vocab_id: int
    english: str
    hebrew: str
    transliteration: str


class ReviewOut(BaseModel):
    id: int
    lesson_id: int
    mode: str
    wrong: List[ReviewItem]


class ProgressOut(BaseModel):
    lesson_id: int
    total: int
    known: int
    known_vocab_ids: List[int]


class UserOut(BaseModel):
    id: int
    username: str


class AuthOut(BaseModel):
    user: UserOut
    token: str


class UsernameRequest(BaseModel):
    username: str = Field(..., min_length=1)


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
    transliteration: str


class VocabUpdate(BaseModel):
    english: Optional[str] = None
    hebrew: Optional[str] = None
    transliteration: Optional[str] = None