from app.db.session import fetchall, fetchone, execute, now_iso
from app.constants import NEWS_PUBLISHED, NEWS_PENDING, ALL_STATUSES

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

async def list_public_news(status="published"):
    rows = await fetchall("""
        SELECT n.*, u.name as author_name
        FROM news n
        JOIN users u ON u.id = n.author_id
        WHERE n.status = ?
        ORDER BY COALESCE(n.published_at, n.created_at) DESC
    """, (NEWS_PUBLISHED,))
    return [_map_news_row(r) for r in rows]

async def get_news_by_id(news_id: int):
    row = await fetchone("""
        SELECT n.*, u.name as author_name
        FROM news n
        JOIN users u ON u.id = n.author_id
        WHERE n.id = ?
    """, (news_id,))
    return _map_news_row(row)

async def list_my_news(author_id: int):
    rows = await fetchall("""
        SELECT n.*, u.name as author_name
        FROM news n
        JOIN users u ON u.id = n.author_id
        WHERE n.author_id = ?
        ORDER BY n.created_at DESC
    """, (author_id,))
    return [_map_news_row(r) for r in rows]

async def create_news(author_id: int, title: str, content: str, status: str, image_url=None):
    if status not in ALL_STATUSES:
        status = NEWS_PENDING

    published_at = now_iso() if status == NEWS_PUBLISHED else None

    news_id = await execute("""
        INSERT INTO news(title, content, author_id, status, created_at, published_at, image_url)
        VALUES(?,?,?,?,?,?,?)
    """, (title, content, author_id, status, now_iso(), published_at, image_url))

    return await get_news_by_id(news_id)

async def update_news(news_id: int, author_id: int, title: str, content: str, status: str, image_url=None):
    existing = await fetchone("SELECT id, author_id FROM news WHERE id = ?", (news_id,))
    if not existing:
        return None
    if existing["author_id"] != author_id:
        raise Exception("Forbidden")

    if status not in ALL_STATUSES:
        status = NEWS_PENDING

    published_at = now_iso() if status == NEWS_PUBLISHED else None

    await execute("""
        UPDATE news
        SET title=?, content=?, status=?, published_at=?, image_url=?
        WHERE id=?
    """, (title, content, status, published_at, image_url, news_id))

    return await get_news_by_id(news_id)

async def delete_news(news_id: int, author_id: int):
    existing = await fetchone("SELECT id, author_id FROM news WHERE id = ?", (news_id,))
    if not existing:
        return False
    if existing["author_id"] != author_id:
        raise Exception("Forbidden")

    await execute("DELETE FROM news WHERE id = ?", (news_id,))
    return True
