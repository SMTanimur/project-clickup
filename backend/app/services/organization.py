from typing import List, Optional
from uuid import uuid4

from sqlmodel import Session, select

from app.models.organization import (
    Organization,
    OrganizationCreate,
    OrganizationMember,
    OrganizationUpdate,
    Team,
    TeamCreate,
    TeamMember,
    TeamUpdate,
)


class OrganizationService:
    """Service for organization-related operations."""
    
    @staticmethod
    def create_organization(
        db: Session, organization_in: OrganizationCreate, user_id: str
    ) -> Organization:
        """
        Create a new organization.
        
        Args:
            db: Database session
            organization_in: Organization creation data
            user_id: ID of the user creating the organization
            
        Returns:
            Created organization
        """
        # Create organization
        db_organization = Organization(
            id=str(uuid4()),
            name=organization_in.name,
            domain=organization_in.domain,
            logo=organization_in.logo,
            settings=organization_in.settings,
        )
        db.add(db_organization)
        db.flush()  # Flush to get the organization ID
        
        # Create organization membership for the creator as OWNER
        db_membership = OrganizationMember(
            id=str(uuid4()),
            role="OWNER",
            organization_id=db_organization.id,
            user_id=user_id,
        )
        db.add(db_membership)
        
        db.commit()
        db.refresh(db_organization)
        return db_organization
    
    @staticmethod
    def get_organization(db: Session, organization_id: str) -> Optional[Organization]:
        """
        Get an organization by ID.
        
        Args:
            db: Database session
            organization_id: Organization ID
            
        Returns:
            Organization if found, None otherwise
        """
        return db.get(Organization, organization_id)
    
    @staticmethod
    def get_organizations_by_user(db: Session, user_id: str) -> List[Organization]:
        """
        Get all organizations a user is a member of.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            List of organizations
        """
        statement = (
            select(Organization)
            .join(OrganizationMember)
            .where(OrganizationMember.user_id == user_id)
        )
        return db.exec(statement).all()
    
    @staticmethod
    def update_organization(
        db: Session, organization_id: str, organization_in: OrganizationUpdate
    ) -> Optional[Organization]:
        """
        Update an organization.
        
        Args:
            db: Database session
            organization_id: Organization ID
            organization_in: Organization update data
            
        Returns:
            Updated organization if found, None otherwise
        """
        db_organization = OrganizationService.get_organization(db, organization_id)
        if not db_organization:
            return None
        
        organization_data = organization_in.model_dump(exclude_unset=True)
        
        for key, value in organization_data.items():
            setattr(db_organization, key, value)
        
        db_organization.updated_at = db.update_now()
        db.add(db_organization)
        db.commit()
        db.refresh(db_organization)
        return db_organization
    
    @staticmethod
    def delete_organization(db: Session, organization_id: str) -> bool:
        """
        Delete an organization.
        
        Args:
            db: Database session
            organization_id: Organization ID
            
        Returns:
            True if deleted, False if not found
        """
        db_organization = OrganizationService.get_organization(db, organization_id)
        if not db_organization:
            return False
        
        db.delete(db_organization)
        db.commit()
        return True
    
    @staticmethod
    def add_member(
        db: Session, organization_id: str, user_id: str, role: str = "MEMBER"
    ) -> Optional[OrganizationMember]:
        """
        Add a member to an organization.
        
        Args:
            db: Database session
            organization_id: Organization ID
            user_id: User ID
            role: Member role (default: MEMBER)
            
        Returns:
            Created organization membership if successful, None otherwise
        """
        # Check if organization exists
        db_organization = OrganizationService.get_organization(db, organization_id)
        if not db_organization:
            return None
        
        # Check if user is already a member
        statement = select(OrganizationMember).where(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.user_id == user_id,
        )
        existing_membership = db.exec(statement).first()
        if existing_membership:
            return existing_membership
        
        # Create new membership
        db_membership = OrganizationMember(
            id=str(uuid4()),
            role=role,
            organization_id=organization_id,
            user_id=user_id,
        )
        db.add(db_membership)
        db.commit()
        db.refresh(db_membership)
        return db_membership
    
    @staticmethod
    def remove_member(db: Session, organization_id: str, user_id: str) -> bool:
        """
        Remove a member from an organization.
        
        Args:
            db: Database session
            organization_id: Organization ID
            user_id: User ID
            
        Returns:
            True if removed, False if not found
        """
        statement = select(OrganizationMember).where(
            OrganizationMember.organization_id == organization_id,
            OrganizationMember.user_id == user_id,
        )
        db_membership = db.exec(statement).first()
        if not db_membership:
            return False
        
        db.delete(db_membership)
        db.commit()
        return True
    
    @staticmethod
    def create_team(db: Session, team_in: TeamCreate) -> Team:
        """
        Create a new team.
        
        Args:
            db: Database session
            team_in: Team creation data
            
        Returns:
            Created team
        """
        db_team = Team(
            id=str(uuid4()),
            name=team_in.name,
            description=team_in.description,
            organization_id=team_in.organization_id,
        )
        db.add(db_team)
        db.commit()
        db.refresh(db_team)
        return db_team
    
    @staticmethod
    def get_team(db: Session, team_id: str) -> Optional[Team]:
        """
        Get a team by ID.
        
        Args:
            db: Database session
            team_id: Team ID
            
        Returns:
            Team if found, None otherwise
        """
        return db.get(Team, team_id)
    
    @staticmethod
    def update_team(
        db: Session, team_id: str, team_in: TeamUpdate
    ) -> Optional[Team]:
        """
        Update a team.
        
        Args:
            db: Database session
            team_id: Team ID
            team_in: Team update data
            
        Returns:
            Updated team if found, None otherwise
        """
        db_team = OrganizationService.get_team(db, team_id)
        if not db_team:
            return None
        
        team_data = team_in.model_dump(exclude_unset=True)
        
        for key, value in team_data.items():
            setattr(db_team, key, value)
        
        db_team.updated_at = db.update_now()
        db.add(db_team)
        db.commit()
        db.refresh(db_team)
        return db_team
    
    @staticmethod
    def delete_team(db: Session, team_id: str) -> bool:
        """
        Delete a team.
        
        Args:
            db: Database session
            team_id: Team ID
            
        Returns:
            True if deleted, False if not found
        """
        db_team = OrganizationService.get_team(db, team_id)
        if not db_team:
            return False
        
        db.delete(db_team)
        db.commit()
        return True
    
    @staticmethod
    def add_team_member(
        db: Session, team_id: str, org_member_id: str, role: str = "MEMBER"
    ) -> Optional[TeamMember]:
        """
        Add a member to a team.
        
        Args:
            db: Database session
            team_id: Team ID
            org_member_id: Organization member ID
            role: Member role (default: MEMBER)
            
        Returns:
            Created team membership if successful, None otherwise
        """
        # Check if team exists
        db_team = OrganizationService.get_team(db, team_id)
        if not db_team:
            return None
        
        # Check if user is already a team member
        statement = select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.org_member_id == org_member_id,
        )
        existing_membership = db.exec(statement).first()
        if existing_membership:
            return existing_membership
        
        # Create new team membership
        db_team_member = TeamMember(
            id=str(uuid4()),
            role=role,
            team_id=team_id,
            org_member_id=org_member_id,
        )
        db.add(db_team_member)
        db.commit()
        db.refresh(db_team_member)
        return db_team_member
    
    @staticmethod
    def remove_team_member(db: Session, team_id: str, org_member_id: str) -> bool:
        """
        Remove a member from a team.
        
        Args:
            db: Database session
            team_id: Team ID
            org_member_id: Organization member ID
            
        Returns:
            True if removed, False if not found
        """
        statement = select(TeamMember).where(
            TeamMember.team_id == team_id,
            TeamMember.org_member_id == org_member_id,
        )
        db_team_member = db.exec(statement).first()
        if not db_team_member:
            return False
        
        db.delete(db_team_member)
        db.commit()
        return True 