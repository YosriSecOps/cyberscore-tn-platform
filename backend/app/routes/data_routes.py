"""
CyberScore TN — Sector & Organization API Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud import get_sectors, get_organizations, get_organization_by_id

router = APIRouter(prefix="/api", tags=["Data"])


@router.get("/sectors")
async def list_sectors(db: AsyncSession = Depends(get_db)):
    """📊 Get all government sectors with org counts."""
    sectors = await get_sectors(db)
    return {"sectors": sectors, "total": len(sectors)}


@router.get("/organizations")
async def list_organizations(
    sector_id: int = None,
    db: AsyncSession = Depends(get_db),
):
    """🏛️ List organizations, optionally filtered by sector."""
    orgs = await get_organizations(db, sector_id=sector_id)
    return {
        "organizations": [
            {
                "id": o.id,
                "name_ar": o.name_ar,
                "name_fr": o.name_fr,
                "sector_id": o.sector_id,
            }
            for o in orgs
        ],
        "total": len(orgs),
    }


@router.get("/organizations/{org_id}")
async def get_organization(org_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific organization by ID."""
    org = await get_organization_by_id(db, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {
        "id": org.id,
        "name_ar": org.name_ar,
        "name_fr": org.name_fr,
        "sector_id": org.sector_id,
    }
