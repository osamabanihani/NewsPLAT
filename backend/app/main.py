import os
from sanic import Sanic
from sanic.response import text

from app.config import Config
from app.middleware.errors import register_error_handlers
from app.middleware.auth import auth_middleware

from app.routes.health import bp_health
from app.routes.favicon import bp_favicon
from app.routes.upload import bp_upload

from app.modules.auth.routes import bp_auth
from app.modules.news.routes import bp_news
from app.modules.favorites.routes import bp_favorites
from app.modules.admin.routes import bp_admin

from app.db.session import init_db


def setup_cors(app: Sanic):
    # ✅ خليها origins واضحة (مش *)
    ALLOWED_ORIGINS = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    }

    @app.middleware("response")
    async def add_cors_headers(request, response):
        origin = request.headers.get("origin")
        if origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Vary"] = "Origin"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        return response

    # ✅ مهم جداً للـ preflight
    @app.options("/<path:path>")
    async def options_handler(request, path):
        return text("", status=204)


def create_app() -> Sanic:
    app = Sanic("NewsPlatform")

    # ===== Config =====
    app.ctx.config = Config

    # ===== CORS (manual) =====
    setup_cors(app)

    # ===== Uploads (static serve) =====
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # -> backend
    upload_dir = os.path.join(base_dir, "app", "uploads")  # -> backend/app/uploads
    os.makedirs(upload_dir, exist_ok=True)

    app.config.UPLOAD_DIR = upload_dir
    app.static("/uploads", upload_dir)

    # ===== Middleware =====
    register_error_handlers(app)
    app.register_middleware(auth_middleware, "request")

    # ===== Blueprints =====
    app.blueprint(bp_favicon)
    app.blueprint(bp_health)
    app.blueprint(bp_auth)
    app.blueprint(bp_news)
    app.blueprint(bp_favorites)
    app.blueprint(bp_admin)
    app.blueprint(bp_upload)

    # ===== Database =====
    @app.listener("before_server_start")
    async def setup_db(app_, loop):
        print("USING DB:", app_.ctx.config.DB_PATH)
        init_db(app_.ctx.config.DB_PATH)

    return app
