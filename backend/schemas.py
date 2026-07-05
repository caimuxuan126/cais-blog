from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ---- User ----
class UserCreate(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---- Post ----
class PostCreate(BaseModel):
    title: str
    content: str = ""
    category: str = "随笔思考"
    tags: List[str] = []


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None


class PostOut(BaseModel):
    id: int
    title: str
    content: str
    category: str
    tags: str = "[]"
    author_id: int
    view_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    author: Optional[UserOut] = None
    like_count: int = 0
    comment_count: int = 0
    is_liked: bool = False
    is_favorited: bool = False

    model_config = {"from_attributes": True}


# ---- Comment ----
class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    content: str
    post_id: int
    author_id: int
    created_at: Optional[datetime] = None
    author: Optional[UserOut] = None

    model_config = {"from_attributes": True}
