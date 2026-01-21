import os
import uuid
from sanic import Blueprint, json
from sanic.exceptions import InvalidUsage, Unauthorized, Forbidden

bp_upload = Blueprint("upload", url_prefix="/upload")

ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
MAX_BYTES = 5 * 1024 * 1024  # 5MB
ALLOWED_ROLES = {"journalist", "admin"}


@bp_upload.post("/")
async def upload_file(request):
    # ===== Auth required =====
    user = getattr(request.ctx, "user", None)
    if not user:
        raise Unauthorized("Missing or invalid token")

    role = (user.get("role") or "").lower()
    if role not in ALLOWED_ROLES:
        raise Forbidden("Only journalist/admin can upload files")

    # ===== Validate file =====
    if "file" not in request.files:
        raise InvalidUsage("No file field. Use form-data key: file")

    up = request.files.get("file")  # UploadedFile
    if not up or not getattr(up, "name", None):
        raise InvalidUsage("Invalid file")

    ext = os.path.splitext(up.name)[1].lower()
    if ext not in ALLOWED_EXT:
        return json(
            {"message": f"Invalid file type. Allowed: {sorted(ALLOWED_EXT)}"},
            status=400,
        )

    body = up.body or b""
    if not body:
        return json({"message": "Empty file"}, status=400)

    if len(body) > MAX_BYTES:
        return json({"message": "File too large (max 5MB)"}, status=400)

    # ===== Save =====
    upload_dir = request.app.config.get("UPLOAD_DIR")
    if not upload_dir:
        return json({"message": "UPLOAD_DIR is not configured on the server"}, status=500)

    os.makedirs(upload_dir, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(upload_dir, filename)

    with open(save_path, "wb") as f:
        f.write(body)

    url = f"/uploads/{filename}"
    return json({"url": url, "filename": filename}, status=201)
