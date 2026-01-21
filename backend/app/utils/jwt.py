import jwt
from datetime import datetime, timedelta, timezone

def create_token(user: dict, secret: str, expire_minutes: int):
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=expire_minutes)

    payload = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    return jwt.encode(payload, secret, algorithm="HS256")

def decode_token(token: str, secret: str):
    return jwt.decode(token, secret, algorithms=["HS256"])
