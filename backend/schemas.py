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


# ---- Follow ----
class FollowOut(BaseModel):
    id: int
    follower_id: int
    followed_id: int
    created_at: Optional[datetime] = None
    follower: Optional[UserOut] = None
    followed: Optional[UserOut] = None

    model_config = {"from_attributes": True}


# ---- Notification ----
class NotificationOut(BaseModel):
    id: int
    user_id: int
    actor_id: int
    type: str
    post_id: Optional[int] = None
    message: str = ""
    is_read: int = 0
    created_at: Optional[datetime] = None
    actor: Optional[UserOut] = None

    model_config = {"from_attributes": True}


# ---- Message ----
class MessageCreate(BaseModel):
    content: str


class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: int = 0
    created_at: Optional[datetime] = None
    sender: Optional[UserOut] = None

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    peer_id: int
    peer_name: str
    last_message: Optional[str] = None
    last_time: Optional[datetime] = None
    unread_count: int = 0
