from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_active_user
from app.db.session import get_session
from app.models.task import (
    Task,
    TaskCreate,
    TaskList,
    TaskListCreate,
    TaskListRead,
    TaskListUpdate,
    TaskRead,
    TaskUpdate,
)
from app.models.user import User
from app.services.organization import OrganizationService
from app.services.task import TaskService

router = APIRouter()


@router.post("/lists", response_model=TaskListRead)
def create_task_list(
    task_list_in: TaskListCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Create a new task list.
    
    Args:
        task_list_in: Task list creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created task list
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, task_list_in.organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # TODO: Check if user has permission to create task lists in the organization
    
    task_list = TaskService.create_task_list(db, task_list_in)
    return task_list


@router.get("/lists/{task_list_id}", response_model=TaskListRead)
def get_task_list(
    task_list_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get a task list by ID.
    
    Args:
        task_list_id: Task list ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Task list
    """
    task_list = TaskService.get_task_list(db, task_list_id)
    if not task_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task list not found",
        )
    
    # TODO: Check if user has permission to view the task list
    
    return task_list


@router.get("/lists", response_model=List[TaskListRead])
def get_task_lists(
    organization_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get all task lists in an organization.
    
    Args:
        organization_id: Organization ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of task lists
    """
    # Check if organization exists
    organization = OrganizationService.get_organization(db, organization_id)
    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )
    
    # TODO: Check if user has permission to view task lists in the organization
    
    task_lists = TaskService.get_task_lists_by_organization(db, organization_id)
    return task_lists


@router.put("/lists/{task_list_id}", response_model=TaskListRead)
def update_task_list(
    task_list_id: str,
    task_list_in: TaskListUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Update a task list.
    
    Args:
        task_list_id: Task list ID
        task_list_in: Task list update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated task list
    """
    task_list = TaskService.get_task_list(db, task_list_id)
    if not task_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task list not found",
        )
    
    # TODO: Check if user has permission to update the task list
    
    updated_task_list = TaskService.update_task_list(db, task_list_id, task_list_in)
    return updated_task_list


@router.delete("/lists/{task_list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_list(
    task_list_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> None:
    """
    Delete a task list.
    
    Args:
        task_list_id: Task list ID
        current_user: Current authenticated user
        db: Database session
    """
    task_list = TaskService.get_task_list(db, task_list_id)
    if not task_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task list not found",
        )
    
    # TODO: Check if user has permission to delete the task list
    
    result = TaskService.delete_task_list(db, task_list_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task list not found",
        )


@router.post("", response_model=TaskRead)
def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Create a new task.
    
    Args:
        task_in: Task creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Created task
    """
    # Check if task list exists
    task_list = TaskService.get_task_list(db, task_in.list_id)
    if not task_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task list not found",
        )
    
    # TODO: Check if user has permission to create tasks in the task list
    
    # Set creator ID to current user if not provided
    if not task_in.creator_id:
        task_data = task_in.model_dump()
        task_data["creator_id"] = current_user.id
        task_in = TaskCreate(**task_data)
    
    task = TaskService.create_task(db, task_in)
    return task


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get a task by ID.
    
    Args:
        task_id: Task ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Task
    """
    task = TaskService.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # TODO: Check if user has permission to view the task
    
    return task


@router.get("", response_model=List[TaskRead])
def get_tasks(
    list_id: str = None,
    assignee_id: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get tasks by list ID or assignee ID.
    
    Args:
        list_id: Task list ID (optional)
        assignee_id: Assignee user ID (optional)
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of tasks
    """
    if list_id:
        # Check if task list exists
        task_list = TaskService.get_task_list(db, list_id)
        if not task_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task list not found",
            )
        
        # TODO: Check if user has permission to view tasks in the task list
        
        tasks = TaskService.get_tasks_by_list(db, list_id)
    elif assignee_id:
        # If assignee_id is "me", use current user ID
        if assignee_id == "me":
            assignee_id = current_user.id
        
        tasks = TaskService.get_tasks_by_assignee(db, assignee_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either list_id or assignee_id must be provided",
        )
    
    return tasks


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: str,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Update a task.
    
    Args:
        task_id: Task ID
        task_in: Task update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated task
    """
    task = TaskService.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # TODO: Check if user has permission to update the task
    
    updated_task = TaskService.update_task(db, task_id, task_in)
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> None:
    """
    Delete a task.
    
    Args:
        task_id: Task ID
        current_user: Current authenticated user
        db: Database session
    """
    task = TaskService.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # TODO: Check if user has permission to delete the task
    
    result = TaskService.delete_task(db, task_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        ) 