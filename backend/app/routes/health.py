from sanic import Blueprint
from app.utils.responses import ok

bp_health = Blueprint("health", url_prefix="")

@bp_health.get("/health")
async def health(request):
    return ok({"ok": True})
