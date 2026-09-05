import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# Primary DB is PostgreSQL per SENTINEL architecture.
DEFAULT_DB_URL = "postgresql://orion:orion_password@localhost:5432/orion_db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(DATABASE_URL)
        # Test connection
        with engine.connect() as conn:
            pass
except Exception as e:
    logger.warning(f"Failed to connect to primary database ({DATABASE_URL}): {e}")
    logger.warning("Falling back to SQLite for local development.")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'sentinel.db')}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
