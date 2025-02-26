from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_active_user
from app.db.session import get_session
from app.models.organization import (
    Organization,
    OrganizationCreate,
    OrganizationMember,
    OrganizationRead,
    OrganizationUpdate,
    Team,
    TeamCreate,
    TeamRead,
    TeamUpdate,
)
from app.models.user import User
from app.services.organization import OrganizationService

router = APIRouter()


@router.post("", response_model=OrganizationRead)
def create_organization(
    organization_in: OrganizationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Create a new organization.
    
    Args:
        organization_in: Organization creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created organization
    """
    organization = OrganizationService.create_organization(
        db, organization_in, current_user.id
    )
    return organization


@router.get("", response_model=List[OrganizationRead])
def get_organizations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get all organizations the current user is a member of.
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of organizations
    """
    organizations = OrganizationService.get_organizations_by_user(db, current_user.id)
    return organizations


@router.get("/{organization_id}", response_model=OrganizationRead)
def get_organization(
    organization_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get an organization by ID.
    
    Args:
        organization_id: Organization ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Organization
    """
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    return organization


@router.put("/{organization_id}", response_model=OrganizationRead)
def update_organization(
    organization_id: str,
    organization_in: OrganizationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Update an organization.
    
    Args:
        organization_id: Organization ID
        organization_in: Organization update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated organization
    """
    # TODO: Check if user has permission to update the organization
    
    organization = OrganizationService.update_organization(
        db, organization_id, organization_in
    )
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    return organization


@router.delete("/{organization_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    organization_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> None:
    """
    Delete an organization.
    
    Args:
        organization_id: Organization ID
        current_user: Current authenticated user
        db: Database session
    """
    # TODO: Check if user has permission to delete the organization
    
    result = OrganizationService.delete_organization(db, organization_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )


@router.post("/{organization_id}/teams", response_model=TeamRead)
def create_team(
    organization_id: str,
    team_in: TeamCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Create a new team in an organization.
    
    Args:
        organization_id: Organization ID
        team_in: Team creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created team
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # TODO: Check if user has permission to create teams in the organization
    
    # Ensure the team is created in the specified organization
    team_data = team_in.model_dump()
    team_data["organization_id"] = organization_id
    team = OrganizationService.create_team(db, TeamCreate(**team_data))
    return team


@router.get("/{organization_id}/teams", response_model=List[TeamRead])
def get_teams(
    organization_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get all teams in an organization.
    
    Args:
        organization_id: Organization ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of teams
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # TODO: Check if user has permission to view teams in the organization
    
    return organization.teams


@router.get("/{organization_id}/teams/{team_id}", response_model=TeamRead)
def get_team(
    organization_id: str,
    team_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get a team by ID.
    
    Args:
        organization_id: Organization ID
        team_id: Team ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Team
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Get team
    team = OrganizationService.get_team(db, team_id)
    if not team or team.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found in this organization",
        )
    
    # TODO: Check if user has permission to view the team
    
    return team


@router.put("/{organization_id}/teams/{team_id}", response_model=TeamRead)
def update_team(
    organization_id: str,
    team_id: str,
    team_in: TeamUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Update a team.
    
    Args:
        organization_id: Organization ID
        team_id: Team ID
        team_in: Team update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated team
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Get team
    team = OrganizationService.get_team(db, team_id)
    if not team or team.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found in this organization",
        )
    
    # TODO: Check if user has permission to update the team
    
    updated_team = OrganizationService.update_team(db, team_id, team_in)
    return updated_team


@router.delete("/{organization_id}/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(
    organization_id: str,
    team_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> None:
    """
    Delete a team.
    
    Args:
        organization_id: Organization ID
        team_id: Team ID
        current_user: Current authenticated user
        db: Database session
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # Get team
    team = OrganizationService.get_team(db, team_id)
    if not team or team.organization_id != organization_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found in this organization",
        )
    
    # TODO: Check if user has permission to delete the team
    
    result = OrganizationService.delete_team(db, team_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        ) 