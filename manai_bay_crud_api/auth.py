
# Authentication and security utilities for FastAPI app
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from schemas import UserCreate
from database import get_cassandra_session
from uuid import uuid4



# === CONFIGURATION ===

# Secret key for JWT token encoding (should be set via environment variable in production)
SECRET_KEY = "your-secret-key"  # Change this in production
# JWT algorithm
ALGORITHM = "HS256"
# Token expiration time in minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# === SECURITY UTILS ===

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# OAuth2 scheme for FastAPI security dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_password_hash(password: str) -> str:
    """
    Hash a plain password for storage.
    Args:
        password (str): Plain password.
    Returns:
        str: Hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash.
    Args:
        plain_password (str): Plain password.
        hashed_password (str): Hashed password.
    Returns:
        bool: True if password matches, else False.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token, including user role.
    Args:
        data (dict): Data to encode in token.
        expires_delta (timedelta, optional): Expiration time.
    Returns:
        str: Encoded JWT token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# === USER DATABASE ACCESS ===
    """
    Fetch a user from the database by email.
    Args:
        email (str): User's email address.
        session: Cassandra session (must be provided).
    Returns:
        dict or None: User data if found, else None.
    """
    raise NotImplementedError("Use get_user_by_email_with_session(email, session) instead.")

# === AUTHENTICATION LOGIC ===
def authenticate_user(email: str, password: str, session) -> dict | None:
    """
    Authenticate user by email and password.
    Args:
        email (str): User's email address.
        password (str): User's password.
        session: Cassandra session (required).
    Returns:
        dict or None: User data if authenticated, else None.
    """
    user = get_user_by_email_with_session(email, session)
    if not user or not verify_password(password, user["hashed_password"]):
        return None
    return user

def get_user_by_email_with_session(email: str, session) -> dict | None:
    """
    Fetch a user from the database by email using a provided session.
    Args:
        email (str): User's email address.
        session: Cassandra session.
    Returns:
        dict or None: User data if found, else None.
    """
    result = session.execute(
        "SELECT * FROM users WHERE email=%s ALLOW FILTERING", (email,)
    ).one()
    return result._asdict() if result else None

# === FASTAPI DEPENDENCY ===
def get_current_user(token: str = Depends(oauth2_scheme), session=Depends(get_cassandra_session)) -> dict:
    """
    FastAPI dependency to get the current authenticated user from JWT token, including role.
    Args:
        token (str): JWT token from request.
        session: Cassandra session (should be injected by FastAPI).
    Returns:
        dict: Authenticated user data.
    Raises:
        HTTPException: If credentials are invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email_with_session(email, session)
    if user is None:
        raise credentials_exception
    # Return user info including role
    user["role"] = user.get("role", role)
    return user
# === ADMIN DEPENDENCY ===

def admin_required(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
