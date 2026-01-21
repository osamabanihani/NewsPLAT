from sanic import Request
from app.utils.jwt import decode_token

async def auth_middleware(request: Request):
    request.ctx.user = None

    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return

    token = auth.replace("Bearer ", "").strip()
    if not token:
        return

    try:
        payload = decode_token(token, request.app.ctx.config.JWT_SECRET)
        request.ctx.user = {
            "id": payload.get("sub"),
            "role": payload.get("role"),
            "email": payload.get("email"),
            "name": payload.get("name"),
        }
    except Exception:
        request.ctx.user = None
    