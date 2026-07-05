import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Post, User, Like, Favorite, Comment
from schemas import PostCreate, PostUpdate, PostOut
from auth import get_current_user, get_optional_user

router = APIRouter(prefix="/api/posts", tags=["posts"])


def enrich_post(post, db: Session, user: User | None):
    """附加 like_count, comment_count, is_liked, is_favorited"""
    post.like_count = db.query(Like).filter(Like.post_id == post.id).count()
    post.comment_count = db.query(Comment).filter(Comment.post_id == post.id).count()
    post.is_liked = db.query(Like).filter(Like.post_id == post.id, Like.user_id == user.id).first() is not None if user else False
    post.is_favorited = db.query(Favorite).filter(Favorite.post_id == post.id, Favorite.user_id == user.id).first() is not None if user else False
    return post


@router.get("", response_model=list[PostOut])
def list_posts(
    keyword: str = Query(default=""),
    category: str = Query(default=""),
    tag: str = Query(default=""),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    q = db.query(Post).order_by(Post.created_at.desc())
    if keyword:
        q = q.filter(Post.title.contains(keyword) | Post.content.contains(keyword))
    if category:
        q = q.filter(Post.category == category)
    posts = q.all()
    if tag:
        posts = [p for p in posts if tag in json.loads(p.tags or "[]")]
    return [enrich_post(p, db, user) for p in posts]


@router.get("/hot", response_model=list[PostOut])
def hot_posts(db: Session = Depends(get_db), user: User | None = Depends(get_optional_user)):
    posts = db.query(Post).all()
    scored = []
    for p in posts:
        likes = db.query(Like).filter(Like.post_id == p.id).count()
        comments = db.query(Comment).filter(Comment.post_id == p.id).count()
        scored.append((p, p.view_count + likes * 3 + comments * 2))
    scored.sort(key=lambda x: x[1], reverse=True)
    return [enrich_post(p, db, user) for p, _ in scored[:5]]


@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    return {
        "article_count": db.query(Post).count(),
        "comment_count": db.query(Comment).count(),
        "like_count": db.query(Like).count(),
        "total_views": db.query(Post).with_entities(db.func.sum(Post.view_count)).scalar() or 0,
    }


@router.get("/{post_id}", response_model=PostOut)
def get_post(post_id: int, db: Session = Depends(get_db), user: User | None = Depends(get_optional_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    post.view_count += 1
    db.commit()
    return enrich_post(post, db, user)


@router.post("", response_model=PostOut, status_code=201)
def create_post(data: PostCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    post = Post(
        title=data.title, content=data.content, category=data.category,
        tags=json.dumps(data.tags, ensure_ascii=False), author_id=user.id
    )
    db.add(post); db.commit(); db.refresh(post)
    return enrich_post(post, db, user)


@router.put("/{post_id}", response_model=PostOut)
def update_post(post_id: int, data: PostUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    if post.author_id != user.id:
        raise HTTPException(status_code=403, detail="只能编辑自己的文章")
    if data.title is not None: post.title = data.title
    if data.content is not None: post.content = data.content
    if data.category is not None: post.category = data.category
    if data.tags is not None: post.tags = json.dumps(data.tags, ensure_ascii=False)
    db.commit(); db.refresh(post)
    return enrich_post(post, db, user)


@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    if post.author_id != user.id:
        raise HTTPException(status_code=403, detail="只能删除自己的文章")
    db.delete(post); db.commit()
    return {"success": True}
