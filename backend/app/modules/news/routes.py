from __future__ import annotations

from sanic import Blueprint
from app.utils.responses import ok, fail
from app.utils.permissions import require_role
from app.constants import ROLE_JOURNALIST, ROLE_ADMIN, NEWS_PUBLISHED, NEWS_PENDING

from app.modules.news.service import (
    list_public_news,
    get_news_by_id,
    list_my_news,
    create_news,
    update_news,
    delete_news,
)

bp_news = Blueprint("news", url_prefix="")

def _clean_image_url(value: str | None):
    if not value:
        return None
    value = str(value).strip()
    if value == "":
        return None
    if not value.startswith("/uploads/"):
        return None
    return value

# ===== Public =====
@bp_news.get("/news")
async def public_news(request):
    items = await list_public_news()
    return ok({"items": items})

@bp_news.get("/news/<news_id:int>")
async def news_details(request, news_id: int):
    item = await get_news_by_id(news_id)
    if not item:
        return fail("Not found", 404)

    # If not published: allow only admin or author
    if item["status"] != NEWS_PUBLISHED:
        user = request.ctx.user
        if not user:
            return fail("Not found", 404)
        if user["role"] != ROLE_ADMIN and user["id"] != item["author_id"]:
            return fail("Not found", 404)

    return ok({"item": item})

# ===== Journalist ONLY =====
@bp_news.get("/journalist/news")
@require_role(ROLE_JOURNALIST)
async def journalist_list(request):
    items = await list_my_news(request.ctx.user["id"])
    return ok({"items": items})

@bp_news.post("/journalist/news")
@require_role(ROLE_JOURNALIST)
async def journalist_create(request):
    data = request.json or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()
    status = (data.get("status") or NEWS_PENDING).strip()

    # 🚫 journalist can't publish
    if status == NEWS_PUBLISHED:
        status = NEWS_PENDING

    image_url = _clean_image_url(data.get("image_url"))

    if not title or not content:
        return fail("title and content are required", 400)

    item = await create_news(
        request.ctx.user["id"],
        title,
        content,
        status,
        image_url=image_url,
    )
    return ok({"item": item}, 201)

@bp_news.put("/journalist/news/<news_id:int>")
@require_role(ROLE_JOURNALIST)
async def journalist_update(request, news_id: int):
    data = request.json or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()
    status = (data.get("status") or NEWS_PENDING).strip()

    # 🚫 journalist can't publish
    if status == NEWS_PUBLISHED:
        status = NEWS_PENDING

    image_url = _clean_image_url(data.get("image_url"))

    if not title or not content:
        return fail("title and content are required", 400)

    try:
        item = await update_news(
            news_id,
            request.ctx.user["id"],
            title,
            content,
            status,
            image_url=image_url,
        )
    except Exception:
        return fail("Forbidden", 403)

    if not item:
        return fail("Not found", 404)

    return ok({"item": item})

@bp_news.delete("/journalist/news/<news_id:int>")
@require_role(ROLE_JOURNALIST)
async def journalist_delete(request, news_id: int):
    try:
        ok_del = await delete_news(news_id, request.ctx.user["id"])
    except Exception:
        return fail("Forbidden", 403)

    if not ok_del:
        return fail("Not found", 404)

    return ok({"deleted": True})
