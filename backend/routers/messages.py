from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Message, Follow, User, Notification
from schemas import MessageCreate, MessageOut, ConversationOut
from auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["messages"])


def _is_mutual(db, a, b):
    f1 = db.query(Follow).filter(Follow.follower_id == a, Follow.followed_id == b).first()
    f2 = db.query(Follow).filter(Follow.follower_id == b, Follow.followed_id == a).first()
    return f1 is not None and f2 is not None


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Find all mutual follows
    following = (
        db.query(Follow).filter(Follow.follower_id == user.id).all()
    )
    mutual_peers = []
    for f in following:
        if _is_mutual(db, user.id, f.followed_id):
            mutual_peers.append(f.followed_id)

    result = []
    for peer_id in mutual_peers:
        peer = db.query(User).filter(User.id == peer_id).first()
        if not peer:
            continue
        last_msg = (
            db.query(Message)
            .filter(
                ((Message.sender_id == user.id) & (Message.receiver_id == peer_id))
                | ((Message.sender_id == peer_id) & (Message.receiver_id == user.id))
            )
            .order_by(Message.created_at.desc())
            .first()
        )
        unread = (
            db.query(Message)
            .filter(Message.sender_id == peer_id, Message.receiver_id == user.id, Message.is_read == 0)
            .count()
        )
        result.append(ConversationOut(
            peer_id=peer_id,
            peer_name=peer.username,
            last_message=last_msg.content if last_msg else None,
            last_time=last_msg.created_at if last_msg else None,
            unread_count=unread
        ))
    # Sort: most recent first
    result.sort(key=lambda c: c.last_time or "", reverse=True)
    return result


@router.get("/{peer_id}", response_model=list[MessageOut])
def get_messages(peer_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    msgs = (
        db.query(Message)
        .filter(
            ((Message.sender_id == user.id) & (Message.receiver_id == peer_id))
            | ((Message.sender_id == peer_id) & (Message.receiver_id == user.id))
        )
        .order_by(Message.created_at.asc())
        .all()
    )
    # Mark messages from peer as read
    for m in msgs:
        if m.receiver_id == user.id and m.is_read == 0:
            m.is_read = 1
    db.commit()
    return msgs


@router.post("/{peer_id}", response_model=MessageOut, status_code=201)
def send_message(
    peer_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not _is_mutual(db, user.id, peer_id):
        raise HTTPException(status_code=403, detail="仅互关好友可以发送私信")

    if not data.content or not data.content.strip():
        raise HTTPException(status_code=400, detail="消息不能为空")

    msg = Message(
        sender_id=user.id,
        receiver_id=peer_id,
        content=data.content.strip()
    )
    db.add(msg)

    # Create notification for receiver
    sender_name = user.username
    preview = data.content.strip()[:30] + ("..." if len(data.content.strip()) > 30 else "")
    notif = Notification(
        user_id=peer_id,
        actor_id=user.id,
        type="message",
        message=f"{sender_name}：{preview}"
    )
    db.add(notif)
    db.commit()
    db.refresh(msg)
    return msg
