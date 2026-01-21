from sanic import Blueprint
from app.utils.permissions import require_auth
from app.utils.responses import ok
from app.modules.favorites.service import list_favorites, add_favorite, remove_favorite

bp_favorites = Blueprint("favorites", url_prefix="")

@bp_favorites.get("/favorites")
@require_auth
async def favorites_list(request):
    items = await list_favorites(request.ctx.user["id"])
    return ok({"items": items})

@bp_favorites.post("/favorites/<news_id:int>")
@require_auth
async def favorites_add(request, news_id: int):
    await add_favorite(request.ctx.user["id"], news_id)
    return ok({"added": True})

@bp_favorites.delete("/favorites/<news_id:int>")
@require_auth
async def favorites_remove(request, news_id: int):
    await remove_favorite(request.ctx.user["id"], news_id)
    return ok({"removed": True})
