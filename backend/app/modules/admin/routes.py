from sanic import Blueprint
from app.utils.responses import ok, fail
from app.utils.permissions import require_role
from app.constants import ROLE_ADMIN

from app.modules.admin.service import (
    admin_list_pending_news,
    admin_approve_news,
    admin_reject_news,
    admin_delete_news,
    admin_list_users,
    admin_update_user_role,
    admin_delete_user,
)

bp_admin = Blueprint("admin", url_prefix="/admin")

# ===== News moderation =====
@bp_admin.get("/news/pending")
@require_role(ROLE_ADMIN)
async def list_pending(request):
    items = await admin_list_pending_news()
    return ok({"items": items})

@bp_admin.post("/news/<news_id:int>/approve")
@require_role(ROLE_ADMIN)
async def approve(request, news_id: int):
    admin_id = request.ctx.user["id"]
    item = await admin_approve_news(news_id, reviewer_id =admin_id)
    if not item:
        return fail("Not found", 404)
    return ok({"item": item})

@bp_admin.post("/news/<news_id:int>/reject")
@require_role(ROLE_ADMIN)
async def reject(request, news_id: int):
    data = request.json or {}
    review_note = (data.get("review_note") or "").strip()
    if not review_note:
        return fail("review_note is required", 400)

    admin_id = request.ctx.user["id"]
    item = await admin_reject_news(news_id, reviewer_id=admin_id, review_note=review_note)
    if not item:
        return fail("Not found", 404)
    return ok({"item": item})

@bp_admin.delete("/news/<news_id:int>")
@require_role(ROLE_ADMIN)
async def delete_news(request, news_id: int):
    done = await admin_delete_news(news_id)
    if not done:
        return fail("Not found", 404)
    return ok({"deleted": True})

# ===== Users management =====
@bp_admin.get("/users")
@require_role(ROLE_ADMIN)
async def list_users(request):
    items = await admin_list_users()
    return ok({"items": items})

@bp_admin.put("/users/<user_id:int>/role")
@require_role(ROLE_ADMIN)
async def update_role(request, user_id: int):
    data = request.json or {}
    role = data.get("role")
    user, err = await admin_update_user_role(user_id, role)
    if err == "Not found":
        return fail("Not found", 404)
    if err:
        return fail(err, 400)
    return ok({"item": user})

@bp_admin.delete("/users/<user_id:int>")
@require_role(ROLE_ADMIN)
async def delete_user(request, user_id: int):
    done = await admin_delete_user(user_id)
    if not done:
        return fail("Not found", 404)
    return ok({"deleted": True})
