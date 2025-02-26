import uuid
from typing import Optional


def generate_uuid() -> str:
    """
    Generate a UUID string.
    
    Returns:
        UUID string
    """
    return str(uuid.uuid4())


def generate_short_id(prefix: Optional[str] = None) -> str:
    """
    Generate a short ID with an optional prefix.
    
    Args:
        prefix: Optional prefix for the ID
        
    Returns:
        Short ID string
    """
    short_uuid = uuid.uuid4().hex[:8]
    if prefix:
        return f"{prefix}_{short_uuid}"
    return short_uuid 