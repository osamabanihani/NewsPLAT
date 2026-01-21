from functools import wraps
from app.utils.responses import fail
from sanic.exceptions import Forbidden

def require_auth(handler):
    @wraps(handler)
    async def wrapper(request, *args, **kwargs):
        if not request.ctx.user:
            return fail("Unauthorized", 401)
        return await handler(request, *args, **kwargs)
    return wrapper

def require_role(*roles):
    def decorator(handler):
        @wraps(handler)  
        async def wrapped(request, *args, **kwargs):
            user = request.ctx.user
            if not user:
                raise Forbidden("Unauthorized")

            if user["role"] not in roles:
                raise Forbidden("Forbidden")

            return await handler(request, *args, **kwargs)
        return wrapped
    return decorator
