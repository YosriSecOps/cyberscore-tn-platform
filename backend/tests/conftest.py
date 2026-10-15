"""
Pytest configuration and fixtures for CyberScore TN backend tests.
"""

import sys
from pathlib import Path
import pytest

# Ensure backend directory is in python path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(BACKEND_DIR.parent))
