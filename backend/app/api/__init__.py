from fastapi import APIRouter
from .endpoints import auth, networks, investigations, timeline, ai_tools, audit, analytics, entities

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(networks.router, prefix="/networks", tags=["networks"])
router.include_router(investigations.router, prefix="/investigations", tags=["investigations"])
router.include_router(timeline.router, prefix="/timeline", tags=["timeline"])
router.include_router(ai_tools.router, prefix="/ai", tags=["ai_tools"])
router.include_router(audit.router, prefix="/audit", tags=["audit"])
router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
router.include_router(entities.router, prefix="/entities", tags=["entities"])
