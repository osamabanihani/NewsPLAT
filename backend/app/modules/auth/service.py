from app.db.session import fetchone, execute, now_iso
from app.utils.security import hash_password, verify_password
from app.constants import ROLE_USER

async def create_user(name: str, email: str, password: str, role: str = ROLE_USER):
    existing = await fetchone("SELECT id FROM users WHERE email = ?", (email.lower(),))
    if existing:
        raise Exception("Email already exists")

    password_hash = hash_password(password)
    user_id = await execute(
        "INSERT INTO users(name, email, password_hash, role, created_at) VALUES(?,?,?,?,?)",
        (name, email.lower(), password_hash, role, now_iso()),
    )
    return await get_user_by_id(user_id)

async def get_user_by_email(email: str):
    return await fetchone("SELECT * FROM users WHERE email = ?", (email.lower(),))

async def get_user_by_id(user_id: int):
    return await fetchone("SELECT id, name, email, role, created_at FROM users WHERE id = ?", (user_id,))

async def authenticate(email: str, password: str):
    user_full = await get_user_by_email(email)
    if not user_full:
        return None
    if not verify_password(password, user_full["password_hash"]):
        return None
    return {
        "id": user_full["id"],
        "name": user_full["name"],
        "email": user_full["email"],
        "role": user_full["role"],
    }
