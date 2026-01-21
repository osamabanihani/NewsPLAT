from sanic import json

def register_error_handlers(app):
    @app.exception(Exception)
    async def handle_all(request, exc):
        # keep it simple
        return json({"message": str(exc)}, status=500)
    # You can add more specific error handlers here
    # e.g., for 404, 401, etc.