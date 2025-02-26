from typing import List, Optional
from uuid import uuid4

from sqlmodel import Session, select

from app.models.task import (
    Task,
    TaskCreate,
    TaskList,
    TaskListCreate,
    TaskListUpdate,
    TaskUpdate,
)


class TaskService:
    """Service for task-related operations."""
    
    @staticmethod
    def create_task_list(db: Session, task_list_in: TaskListCreate) -> TaskList:
        """
        Create a new task list.
        
        Args:
            db: Database session
            task_list_in: Task list creation data
            
        Returns:
            Created task list
        """
        db_task_list = TaskList(
            id=str(uuid4()),
            name=task_list_in.name,
            order=task_list_in.order,
            color=task_list_in.color,
            organization_id=task_list_in.organization_id,
        )
        db.add(db_task_list)
        db.commit()
        db.refresh(db_task_list)
        return db_task_list
    
    @staticmethod
    def get_task_list(db: Session, task_list_id: str) -> Optional[TaskList]:
        """
        Get a task list by ID.
        
        Args:
            db: Database session
            task_list_id: Task list ID
            
        Returns:
            Task list if found, None otherwise
        """
        return db.get(TaskList, task_list_id)
    
    @staticmethod
    def get_task_lists_by_organization(
        db: Session, organization_id: str
    ) -> List[TaskList]:
        """
        Get all task lists in an organization.
        
        Args:
            db: Database session
            organization_id: Organization ID
            
        Returns:
            List of task lists
        """
        statement = select(TaskList).where(TaskList.organization_id == organization_id)
        return db.exec(statement).all()
    
    @staticmethod
    def update_task_list(
        db: Session, task_list_id: str, task_list_in: TaskListUpdate
    ) -> Optional[TaskList]:
        """
        Update a task list.
        
        Args:
            db: Database session
            task_list_id: Task list ID
            task_list_in: Task list update data
            
        Returns:
            Updated task list if found, None otherwise
        """
        db_task_list = TaskService.get_task_list(db, task_list_id)
        if not db_task_list:
            return None
        
        task_list_data = task_list_in.model_dump(exclude_unset=True)
        
        for key, value in task_list_data.items():
            setattr(db_task_list, key, value)
        
        db_task_list.updated_at = db.update_now()
        db.add(db_task_list)
        db.commit()
        db.refresh(db_task_list)
        return db_task_list
    
    @staticmethod
    def delete_task_list(db: Session, task_list_id: str) -> bool:
        """
        Delete a task list.
        
        Args:
            db: Database session
            task_list_id: Task list ID
            
        Returns:
            True if deleted, False if not found
        """
        db_task_list = TaskService.get_task_list(db, task_list_id)
        if not db_task_list:
            return False
        
        db.delete(db_task_list)
        db.commit()
        return True
    
    @staticmethod
    def create_task(db: Session, task_in: TaskCreate) -> Task:
        """
        Create a new task.
        
        Args:
            db: Database session
            task_in: Task creation data
            
        Returns:
            Created task
        """
        db_task = Task(
            id=str(uuid4()),
            title=task_in.title,
            description=task_in.description,
            status=task_in.status,
            priority=task_in.priority,
            due_date=task_in.due_date,
            completed_at=task_in.completed_at,
            list_id=task_in.list_id,
            creator_id=task_in.creator_id,
            assignee_id=task_in.assignee_id,
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def get_task(db: Session, task_id: str) -> Optional[Task]:
        """
        Get a task by ID.
        
        Args:
            db: Database session
            task_id: Task ID
            
        Returns:
            Task if found, None otherwise
        """
        return db.get(Task, task_id)
    
    @staticmethod
    def get_tasks_by_list(db: Session, list_id: str) -> List[Task]:
        """
        Get all tasks in a list.
        
        Args:
            db: Database session
            list_id: Task list ID
            
        Returns:
            List of tasks
        """
        statement = select(Task).where(Task.list_id == list_id)
        return db.exec(statement).all()
    
    @staticmethod
    def get_tasks_by_assignee(db: Session, assignee_id: str) -> List[Task]:
        """
        Get all tasks assigned to a user.
        
        Args:
            db: Database session
            assignee_id: Assignee user ID
            
        Returns:
            List of tasks
        """
        statement = select(Task).where(Task.assignee_id == assignee_id)
        return db.exec(statement).all()
    
    @staticmethod
    def update_task(
        db: Session, task_id: str, task_in: TaskUpdate
    ) -> Optional[Task]:
        """
        Update a task.
        
        Args:
            db: Database session
            task_id: Task ID
            task_in: Task update data
            
        Returns:
            Updated task if found, None otherwise
        """
        db_task = TaskService.get_task(db, task_id)
        if not db_task:
            return None
        
        task_data = task_in.model_dump(exclude_unset=True)
        
        # If status is changed to COMPLETED and completed_at is not set, set it to now
        if (
            "status" in task_data
            and task_data["status"] == "COMPLETED"
            and not db_task.completed_at
            and not task_data.get("completed_at")
        ):
            from datetime import datetime
            task_data["completed_at"] = datetime.utcnow()
        
        for key, value in task_data.items():
            setattr(db_task, key, value)
        
        db_task.updated_at = db.update_now()
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def delete_task(db: Session, task_id: str) -> bool:
        """
        Delete a task.
        
        Args:
            db: Database session
            task_id: Task ID
            
        Returns:
            True if deleted, False if not found
        """
        db_task = TaskService.get_task(db, task_id)
        if not db_task:
            return False
        
        db.delete(db_task)
        db.commit()
        return True 