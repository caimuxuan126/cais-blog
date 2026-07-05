from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Comment, Post, User
from schemas import CommentCreate, CommentOut
from auth import get_current_user

router = APIRouter(prefix="/api/posts/{post_id}/comments", tags=["comments"])


@router.get("", response_model=list[CommentOut])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()


@router.post("", response_model=CommentOut, status_code=201)
def create_comment(post_id: int, data: CommentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(Post).filter(Post.id == post_id).first():
        raise HTTPException(status_code=404, detail="文章不存在")
    comment = Comment(content=data.content, post_id=post_id, author_id=user.id)
    db.add(comment); db.commit(); db.refresh(comment)
    return comment


@router.delete("/{comment_id}")
def delete_comment(post_id: int, comment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id, Comment.post_id == post_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    if comment.author_id != user.id:
        raise HTTPException(status_code=403, detail="只能删除自己的评论")
    db.delete(comment); db.commit()
    return {"success": True}
