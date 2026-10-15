"""
CyberScore TN — Database Seed Script
Seeds initial data: sectors, organizations, websites, frameworks, badges.
Run: python -m app.seed
"""

import asyncio
import json
from pathlib import Path

from sqlalchemy import select

from app.database import AsyncSessionLocal, init_db
from app.models.sector import Sector
from app.models.organization import Organization
from app.models.website import Website
from app.models.framework import OWASPTop10
from app.models.badge import BadgeDefinition


DATA_DIR = Path(__file__).parent / "data"


async def seed_sectors(session):
    """Seed the 4 Tunisian administration sectors."""
    existing = await session.execute(select(Sector))
    if existing.scalars().first():
        print("  ⏭️  Sectors already seeded")
        return

    with open(DATA_DIR / "tunisia_sectors.json", "r", encoding="utf-8") as f:
        sectors = json.load(f)

    for s in sectors:
        session.add(Sector(**s))
    await session.flush()
    print(f"  ✅ Seeded {len(sectors)} sectors")


async def seed_organizations_and_websites(session):
    """Seed Tunisian organizations and their websites."""
    existing = await session.execute(select(Organization))
    if existing.scalars().first():
        print("  ⏭️  Organizations already seeded")
        return

    with open(DATA_DIR / "tunisia_organizations.json", "r", encoding="utf-8") as f:
        orgs = json.load(f)

    for org_data in orgs:
        websites = org_data.pop("websites", [])
        org = Organization(
            name_ar=org_data["name_ar"],
            name_fr=org_data["name_fr"],
            name_en=org_data.get("name_en"),
            sector_id=org_data["sector_id"],
            criticality_level=org_data.get("criticality_level", 3),
        )
        session.add(org)
        await session.flush()

        for url in websites:
            session.add(Website(url=url, organization_id=org.id, is_primary=True))

    await session.flush()
    print(f"  ✅ Seeded {len(orgs)} organizations with websites")


async def seed_owasp(session):
    """Seed OWASP Top 10 (2021) reference data."""
    existing = await session.execute(select(OWASPTop10))
    if existing.scalars().first():
        print("  ⏭️  OWASP data already seeded")
        return

    with open(DATA_DIR / "owasp_top10_2021.json", "r", encoding="utf-8") as f:
        items = json.load(f)

    for item in items:
        session.add(OWASPTop10(**item))
    await session.flush()
    print(f"  ✅ Seeded {len(items)} OWASP Top 10 categories")


async def seed_badges(session):
    """Seed gamification badge definitions."""
    existing = await session.execute(select(BadgeDefinition))
    if existing.scalars().first():
        print("  ⏭️  Badges already seeded")
        return

    with open(DATA_DIR / "badge_definitions.json", "r", encoding="utf-8") as f:
        badges = json.load(f)

    for badge in badges:
        session.add(BadgeDefinition(**badge))
    await session.flush()
    print(f"  ✅ Seeded {len(badges)} badge definitions")


async def seed_users(session):
    """Seed initial admin and auditor demo accounts."""
    from app.models.user import User
    from app.routes.auth_routes import get_password_hash

    existing = await session.execute(select(User))
    if existing.scalars().first():
        print("  ⏭️  Users already seeded")
        return

    admin = User(
        email="admin@cyberscore.tn",
        password_hash=get_password_hash("Admin@2026"),
        full_name="Administrateur National ANCS",
        role="admin",
        organization_name="Agence Nationale de la Cybersécurité (ANCS)",
        position="Chef de Centre SOC",
        status="approved",
        is_active=True,
        preferred_language="fr"
    )
    auditor = User(
        email="yosri.hamdouni@finances.gov.tn",
        password_hash=get_password_hash("Auditor@Sec2026!"),
        full_name="Yosri Hamdouni",
        role="auditor",
        organization_name="Ministère des Finances",
        position="RSSI Ministère des Finances",
        status="approved",
        is_active=True,
        preferred_language="fr"
    )
    session.add(admin)
    session.add(auditor)
    await session.flush()
    print("  ✅ Seeded initial Admin & Auditor accounts")


async def main():
    """Run all seeders."""
    print("🇹🇳 CyberScore TN — Seeding Database...")
    print("=" * 50)

    await init_db()

    async with AsyncSessionLocal() as session:
        await seed_users(session)
        await seed_sectors(session)
        await seed_organizations_and_websites(session)
        await seed_owasp(session)
        await seed_badges(session)
        await session.commit()

    print("=" * 50)
    print("✅ Seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())
