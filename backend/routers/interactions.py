from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Like, Favorite, Follow, Notification, Post, User
from schemas import PostOut, FollowOut
from auth import get_current_user, get_optional_user

router = APIRouter(prefix="/api", tags=["interactions"])


# ---- Like ----
@router.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    existing = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user.id).first()
    if existing:
        db.delete(existing); db.commit()
        return {"liked": False}
    db.add(Like(user_id=user.id, post_id=post_id))

    # Notification: someone liked the post (not self)
    if post.author_id != user.id:
        db.add(Notification(
            user_id=post.author_id, actor_id=user.id, type="like",
            post_id=post.id, message=f"{user.username} 赞了你的文章《{post.title}》"
        ))

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


# ---- Follow ----
def _is_mutual(db, a, b):
    return (
        db.query(Follow).filter(Follow.follower_id == a, Follow.followed_id == b).first() is not None
        and db.query(Follow).filter(Follow.follower_id == b, Follow.followed_id == a).first() is not None
    )


@router.post("/users/{target_id}/follow")
def follow_user(target_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if target_id == user.id:
        raise HTTPException(status_code=400, detail="不能关注自己")
    target = db.query(User).filter(User.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")

    existing = db.query(Follow).filter(
        Follow.follower_id == user.id, Follow.followed_id == target_id
    ).first()
    if existing:
        db.delete(existing); db.commit()
        return {"following": False, "mutual": False}

    db.add(Follow(follower_id=user.id, followed_id=target_id))

    # Notification: follow
    db.add(Notification(
        user_id=target_id, actor_id=user.id, type="follow",
        message=f"{user.username} 关注了你"
    ))

    # Check mutual
    mutual = _is_mutual(db, user.id, target_id)
    if mutual:
        db.add(Notification(
            user_id=target_id, actor_id=user.id, type="mutual",
            message=f"你和 {user.username} 成为互关好友，可以开始聊天了！"
        ))
        db.add(Notification(
            user_id=user.id, actor_id=target_id, type="mutual",
            message=f"你和 {target.username} 成为互关好友，可以开始聊天了！"
        ))

    db.commit()
    return {"following": True, "mutual": mutual}


@router.get("/users/{target_id}/follow-status")
def follow_status(target_id: int, db: Session = Depends(get_db), user: User = Depends(get_optional_user)):
    if not user:
        return {"following": False, "mutual": False}
    following = db.query(Follow).filter(
        Follow.follower_id == user.id, Follow.followed_id == target_id
    ).first() is not None
    mutual = _is_mutual(db, user.id, target_id)
    return {"following": following, "mutual": mutual}


@router.get("/users/{target_id}/followers", response_model=list[FollowOut])
def get_followers(target_id: int, db: Session = Depends(get_db)):
    return db.query(Follow).filter(Follow.followed_id == target_id).order_by(Follow.created_at.desc()).all()


@router.get("/users/{target_id}/following", response_model=list[FollowOut])
def get_following(target_id: int, db: Session = Depends(get_db)):
    return db.query(Follow).filter(Follow.follower_id == target_id).order_by(Follow.created_at.desc()).all()
