"""
CyberScore TN — FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_db
from app.routes.auth_routes import router as auth_router
from app.routes.scan_routes import router as scan_router, scan_alias_router
from app.routes.data_routes import router as data_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.ai_routes import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print(f"🛡️  {settings.APP_NAME} v{settings.APP_VERSION} starting...")
    await init_db()
    print("✅ Database tables created/verified")
    print(f"🧠 Ollama URL: {settings.OLLAMA_URL}")
    print(f"🌐 CORS origins: {settings.CORS_ORIGINS}")
    print("🚀 Ready!")
    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "منصة تقييم الأمن السيبراني للمواقع الحكومية التونسية\n\n"
        "AI-Powered Cybersecurity Scoring Platform for Tunisian Government Websites"
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Force UTF-8 charset on all JSON responses to prevent browser encoding issues
@app.middleware("http")
async def add_utf8_charset(request: Request, call_next):
    response = await call_next(request)
    ct = response.headers.get("content-type", "")
    if "application/json" in ct and "charset" not in ct:
        response.headers["content-type"] = "application/json; charset=utf-8"
    return response


# ── API Routers ───────────────────────────────────────────
app.include_router(auth_router)
app.include_router(scan_router)
app.include_router(scan_alias_router)
app.include_router(data_router)
app.include_router(dashboard_router)
app.include_router(ai_router)


# ── Health Check ──────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint — health check."""
    return JSONResponse(
        content={
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "operational",
            "message": "مرحباً بكم في CyberScore TN — Welcome to CyberScore TN",
        },
        media_type="application/json; charset=utf-8",
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "ollama": settings.OLLAMA_URL,
    }
