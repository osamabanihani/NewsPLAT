from sanic import Blueprint
from sanic.response import text

bp_favicon = Blueprint("favicon", url_prefix="")

@bp_favicon.get("/favicon.ico")
async def favicon(request):
    return text("", status=204)
