from app.db.session import fetchall, execute, now_iso

async def list_favorites(user_id: int):
    rows = await fetchall("""
        SELECT n.id, n.title, n.content, n.status, n.created_at, n.published_at,
               n.author_id, u.name as author_name
        FROM favorites f
        JOIN news n ON n.id = f.news_id
        JOIN users u ON u.id = n.author_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
    """, (user_id,))
    return rows

async def add_favorite(user_id: int, news_id: int):
    await execute("""
        INSERT OR IGNORE INTO favorites(user_id, news_id, created_at)
        VALUES(?,?,?)
    """, (user_id, news_id, now_iso()))
    return True

async def remove_favorite(user_id: int, news_id: int):
    await execute("DELETE FROM favorites WHERE user_id=? AND news_id=?", (user_id, news_id))
    return True
