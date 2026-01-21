from app.db.session import fetchall, fetchone, execute, now_iso
from app.constants import NEWS_PENDING, NEWS_PUBLISHED
from app.constants import ROLE_ADMIN, ROLE_JOURNALIST, ROLE_USER

NEWS_REJECTED = "rejected"  

def _map_news_row(row: dict):
    if not row:
        return None
    return {
        "id": row["id"],
        "title": row["title"],
        "content": row["content"],
        "status": row["status"],
        "created_at": row["created_at"],
        "published_at": row.get("published_at"),
        "author_id": row["author_id"],
        "author_name": row.get("author_name"),
        "image_url": row.get("image_url"),
        "review_note": row.get("review_note"),
        "reviewed_at": row.get("reviewed_at"),
        "reviewed_by": row.get("reviewed_by"),
    }

async def admin_list_pending_news():
    rows = await fetchall("""
        SELECT n.*, u.name AS author_name
        FROM news n
        JOIN users u ON u.id = n.author_id
        WHERE n.status = ?
        ORDER BY n.created_at DESC
    """, (NEWS_PENDING,))
    return [_map_news_row(r) for r in rows]

async def admin_approve_news(news_id: int, reviewer_id: int):
    existing = await fetchone("SELECT id FROM news WHERE id = ?", (news_id,))
    if not existing:
        return None

    now = now_iso()
    await execute("""
        UPDATE news
        SET status = ?,
            published_at = ?,
            review_note = NULL,
            reviewed_at = ?,
            reviewed_by = ?
        WHERE id = ?
    """, (NEWS_PUBLISHED, now, now, reviewer_id, news_id))

    row = await fetchone("""
        SELECT n.*, u.name AS author_name
        FROM news n JOIN users u ON u.id = n.author_id
        WHERE n.id = ?
    """, (news_id,))
    return _map_news_row(row)

async def admin_reject_news(news_id: int, reviewer_id: int, review_note: str):
    existing = await fetchone("SELECT id FROM news WHERE id = ?", (news_id,))
    if not existing:
        return None

    now = now_iso()
    await execute("""
        UPDATE news
        SET status = ?,
            published_at = NULL,
            review_note = ?,
            reviewed_at = ?,
            reviewed_by = ?
        WHERE id = ?
    """, (NEWS_REJECTED, review_note, now, reviewer_id, news_id))

    row = await fetchone("""
        SELECT n.*, u.name AS author_name
        FROM news n JOIN users u ON u.id = n.author_id
        WHERE n.id = ?
    """, (news_id,))
    return _map_news_row(row)

async def admin_delete_news(news_id: int):
    existing = await fetchone("SELECT id FROM news WHERE id = ?", (news_id,))
    if not existing:
        return False
    await execute("DELETE FROM news WHERE id = ?", (news_id,))
    return True

ALLOWED_ROLES = {ROLE_ADMIN, ROLE_JOURNALIST, ROLE_USER}

def _map_user_row(row: dict):
    if not row:
        return None
    return {
        "id": row["id"],
        "name": row.get("name"),
        "email": row.get("email"),
        "role": row.get("role"),
        "created_at": row.get("created_at"),
    }

async def admin_list_users():
    rows = await fetchall("""
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY created_at DESC
    """)
    return [_map_user_row(r) for r in rows]

async def admin_update_user_role(user_id: int, role: str):
    role = (role or "").strip()
    if role not in ALLOWED_ROLES:
        return None, "Invalid role"

    existing = await fetchone("SELECT id FROM users WHERE id = ?", (user_id,))
    if not existing:
        return None, "Not found"

    await execute("UPDATE users SET role = ? WHERE id = ?", (role, user_id))

    row = await fetchone("""
        SELECT id, name, email, role, created_at
        FROM users WHERE id = ?
    """, (user_id,))
    return _map_user_row(row), None

async def admin_delete_user(user_id: int):
    existing = await fetchone("SELECT id FROM users WHERE id = ?", (user_id,))
    if not existing:
        return False
    await execute("DELETE FROM users WHERE id = ?", (user_id,))
    return True
