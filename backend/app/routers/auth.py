from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..database.models import User
from ..schemas.schemas import LoginRequest, LoginResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or user.password_hash != payload.password:
        # Check default demo accounts as fallback
        if payload.username == "admin" and payload.password == "admin123":
            return LoginResponse(
                success=True,
                token="demo-token-admin-manager",
                user=UserResponse(id=1, username="admin", role="Logistics Manager", full_name="Sarah Jenkins (Logistics Chief)"),
                message="Welcome back, Logistics Manager."
            )
        elif payload.username == "authority" and payload.password == "authority123":
            return LoginResponse(
                success=True,
                token="demo-token-authority",
                user=UserResponse(id=2, username="authority", role="Disaster Management Authority", full_name="Cmdr. David Vance (NDMA)"),
                message="Welcome back, Disaster Management Authority."
            )
        elif payload.username == "driver" and payload.password == "driver123":
            return LoginResponse(
                success=True,
                token="demo-token-driver",
                user=UserResponse(id=3, username="driver", role="Driver", full_name="Marcus Reed (Lead Operator)"),
                message="Welcome back, Transport Operator."
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Use admin/admin123, authority/authority123, or driver/driver123."
        )

    return LoginResponse(
        success=True,
        token=f"demo-token-{user.username}",
        user=UserResponse(id=user.id, username=user.username, role=user.role, full_name=user.full_name),
        message=f"Logged in as {user.role}"
    )
