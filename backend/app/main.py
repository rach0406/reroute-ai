import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
root_dir = os.path.abspath(os.path.join(backend_dir, ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import init_db, SessionLocal
from app.database.models import User
from app.routers import (
    auth, dashboard, roads, vehicles, shipments,
    disruptions, predict, routes, risk_zones,
    bottlenecks, recommendations, analytics
)

app = FastAPI(
    title="ReRoute AI Backend API",
    description="Smart Transportation and Logistics Recovery System for Post-Crisis Supply Chains",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    print("Initializing Database...")
    init_db()
    
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            print("Database empty. Auto-seeding initial post-crisis scenario data...")
            from database.seed import seed_database
            seed_database()
    except Exception as e:
        print(f"Startup Seed Notice: {e}")
    finally:
        db.close()
        
    print("ReRoute AI Backend Ready!")

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "ReRoute AI Recovery Platform",
        "version": "1.0.0"
    }

# Register Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(roads.router)
app.include_router(vehicles.router)
app.include_router(shipments.router)
app.include_router(disruptions.router)
app.include_router(predict.router)
app.include_router(routes.router)
app.include_router(risk_zones.router)
app.include_router(bottlenecks.router)
app.include_router(recommendations.router)
app.include_router(analytics.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
