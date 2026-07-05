from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Like, Favorite, Post, User
from schemas import PostOut
from auth import get_current_user

router = APIRouter(prefix="/api", tags=["interactions"])


# ---- Like ----
@router.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(Post).filter(Post.id == post_id).first():
        raise HTTPException(status_code=404, detail="文章不存在")
    existing = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user.id).first()
    if existing:
        db.delete(existing); db.commit()
        return {"liked": False}
    db.add(Like(user_id=user.id, post_id=post_id))
    db.commit()
    return {"liked": True}


# ---- Favorite ----
@router.post("/posts/{post_id}/favorite")
def favorite_post(post_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.query(Post).filter(Post.id == post_id).first():
        raise HTTPException(status_code=404, detail="文章不存在")
    existing = db.query(Favorite).filter(Favorite.post_id == post_id, Favorite.user_id == user.id).first()
    if existing:
        db.delete(existing); db.commit()
        return {"favorited": False}
    db.add(Favorite(user_id=user.id, post_id=post_id))
    db.commit()
    return {"favorited": True}


@router.get("/favorites", response_model=list[PostOut])
def my_favorites(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    favs = db.query(Favorite).filter(Favorite.user_id == user.id).order_by(Favorite.created_at.desc()).all()
    posts = [db.query(Post).filter(Post.id == f.post_id).first() for f in favs]
    for p in posts:
        if p:
            p.like_count = db.query(Like).filter(Like.post_id == p.id).count()
            p.comment_count = 0
            p.is_liked = db.query(Like).filter(Like.post_id == p.id, Like.user_id == user.id).first() is not None
            p.is_favorited = True
    return [p for p in posts if p]
