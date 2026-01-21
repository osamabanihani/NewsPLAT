from sanic import Blueprint
from app.utils.responses import ok, fail
from app.utils.jwt import create_token
from app.utils.permissions import require_auth

from app.modules.auth.service import create_user, authenticate, get_user_by_id

bp_auth = Blueprint("auth", url_prefix="")

@bp_auth.post("/auth/register")
async def register(request):
    data = request.json or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "")

    if not name or not email or not password:
        return fail("name, email, password are required", 400)

    if len(password.encode("utf-8")) > 72:
        return fail("Password must be at most 72 bytes", 400)

    if len(password) < 8:
        return fail("Password must be at least 8 characters", 400)

    user = await create_user(name=name, email=email, password=password)
    return ok({"user": user}, 201)

@bp_auth.post("/auth/login")
async def login(request):
    data = request.json or {}
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return fail("email and password are required", 400)

    user = await authenticate(email, password)
    if not user:
        return fail("Invalid credentials", 401)

    token = create_token(
        user,
        request.app.ctx.config.JWT_SECRET,
        request.app.ctx.config.JWT_EXPIRE_MINUTES
    )
    return ok({"token": token, "user": user})

@bp_auth.get("/me")
@require_auth
async def me(request):
    user_id = request.ctx.user["id"]
    user = await get_user_by_id(user_id)
    return ok({"user": user})
