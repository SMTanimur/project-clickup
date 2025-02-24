'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task, Team } from '@/types';

interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
  order: number;
  color?: string;
}

interface TeamBoardViewProps {
  team: Team;
  lists: TaskList[];
  onAddList?: () => void;
  onAddTask?: (listId: string) => void;
  onTaskClick?: (task: Task) => void;
  onDragEnd?: (result: {
    taskId: string;
    sourceListId: string;
    destinationListId: string;
    newIndex: number;
  }) => void;
}

export function TeamBoardView({
  lists,
  onAddList,
  onAddTask,
  onTaskClick,
}: TeamBoardViewProps) {
  return (
    <div className='flex gap-4 overflow-x-auto pb-4'>
      {lists.map(list => (
        <div key={list.id} className='w-80 flex-shrink-0'>
          <Card>
            <CardHeader className='p-3'>
              <CardTitle className='text-sm font-medium flex items-center justify-between'>
                {list.name}
                <span className='text-xs text-muted-foreground'>
                  {list.tasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 space-y-2'>
              {list.tasks.map(task => (
                <Card
                  key={task.id}
                  className='p-3 cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => onTaskClick?.(task)}
                >
                  <h3 className='font-medium'>{task.title}</h3>
                  {task.description && (
                    <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                      {task.description}
                    </p>
                  )}
                  <div className='flex items-center gap-2 mt-2'>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        task.status === 'TODO'
                          ? 'bg-yellow-100 text-yellow-800'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : task.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className='text-xs text-muted-foreground'>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
              <Button
                variant='ghost'
                className='w-full justify-start'
                onClick={() => onAddTask?.(list.id)}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Task
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
      <div className='w-80 flex-shrink-0'>
        <Button variant='outline' className='w-full' onClick={onAddList}>
          <Plus className='h-4 w-4 mr-2' />
          Add List
        </Button>
      </div>
    </div>
  );
}
