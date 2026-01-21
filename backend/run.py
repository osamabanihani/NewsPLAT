import os
import sys
from dotenv import load_dotenv

# ✅ ADD THIS (VERY IMPORTANT)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app.main import create_app

load_dotenv()

app = create_app()

if __name__ == "__main__":
    host = os.getenv("APP_HOST", "127.0.0.1")
    port = int(os.getenv("APP_PORT", "8000"))
    app.run(host=host, port=port, dev=True, auto_reload=True)
