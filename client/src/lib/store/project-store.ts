import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { User } from './user-store';

export type Priority = 'urgent' | 'high' | 'normal' | 'low' | 'medium';
export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'blocked';
export type ViewType = 'list' | 'board' | 'calendar' | 'gantt' | 'timeline';
export type SpaceColor =
  | 'purple'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red'
  | 'pink';

export interface Comment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  content: string;
  isCompleted: boolean;
  assignedTo?: string;
  dueDate?: Date;
}

export interface CustomField {
  id: string;
  name: string;
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'select'
    | 'user'
    | 'theme'
    | 'viewMode'
    | 'notifications';
  value:
    | string
    | number
    | Date
    | { id: string; label: string }
    | string[]
    | { primary: string; background: string; accent: string }
    | 'compact'
    | 'comfortable'
    | { email: boolean; desktop: boolean; inApp: boolean };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignees: string[];
  tags: string[];
  startDate?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  subtasks: Task[];
  checklists: Checklist[];
  comments: Comment[];
  customFields: CustomField[];
  timeEstimate?: number; // in minutes
  timeSpent?: number; // in minutes
  dependencies: string[]; // task IDs that this task depends on
  attachments: string[]; // URLs to attached files
  settings: ProjectSettings;
}

export interface List {
  id: string;
  name: string;
  tasks: Task[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Space {
  id: string;
  name: string;
  color: SpaceColor;
  lists: List[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  members: Member[];
  spaces: Space[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectTemplate = 'agile' | 'waterfall' | 'custom';

export interface ProjectTheme {
  primary: string;
  background: string;
  accent: string;
}

export interface ProjectSettings {
  theme: ProjectTheme;
  viewMode: 'compact' | 'comfortable';
  notifications: {
    email: boolean;
    desktop: boolean;
    inApp: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  template: ProjectTemplate;
  createdAt: Date;
  updatedAt: Date;
  teamMembers: string[]; // User IDs
  status: 'active' | 'completed' | 'archived';
  settings: ProjectSettings;
  customFields: CustomField[];
}

interface AppState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentSpace?: Space;
  currentList?: List;
  currentTask?: Task;
  currentView: ViewType;

  // Workspace actions
  createWorkspace: (
    workspace: {
      name: string;
      description: string;
    },
    user: User
  ) => Workspace;
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  setCurrentWorkspace: (id: string) => void;

  // Space actions
  addSpace: (
    space: Pick<Space, 'name' | 'color' | 'lists'> & { id: string }
  ) => void;
  updateSpace: (
    workspaceId: string,
    spaceId: string,
    space: Partial<Space>
  ) => void;
  deleteSpace: (workspaceId: string, spaceId: string) => void;
  setCurrentSpace: (spaceId: string) => void;

  // List actions
  addList: (
    spaceId: string,
    list: Omit<List, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateList: (spaceId: string, listId: string, list: Partial<List>) => void;
  deleteList: (spaceId: string, listId: string) => void;
  setCurrentList: (listId: string) => void;

  // Task actions
  addTask: (
    listId: string,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateTask: (listId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (listId: string, taskId: string) => void;
  setCurrentTask: (taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceListId: string,
    targetListId: string
  ) => void;

  // View actions
  setCurrentView: (view: ViewType) => void;

  // Task specific actions
  addComment: (
    taskId: string,
    comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  addChecklist: (taskId: string, checklist: Omit<Checklist, 'id'>) => void;
  updateChecklistItem: (
    taskId: string,
    checklistId: string,
    itemId: string,
    isCompleted: boolean
  ) => void;
  addCustomField: (taskId: string, field: Omit<CustomField, 'id'>) => void;
  updateTimeTracking: (taskId: string, timeSpent: number) => void;
  addDependency: (taskId: string, dependencyId: string) => void;
  addAttachment: (taskId: string, attachmentUrl: string) => void;

  // Theme actions
  updateProjectTheme: (projectId: string, theme: ProjectTheme) => void;

  // View mode actions
  toggleViewMode: (projectId: string) => void;

  // Notification settings
  updateNotificationSettings: (
    projectId: string,
    settings: Partial<ProjectSettings['notifications']>
  ) => void;
}

export const useProjectStore = create<AppState>()(
  persist(
    (set): AppState => ({
      workspaces: [],
      currentWorkspace: null,
      currentView: 'list',
      currentSpace: undefined,
      currentList: undefined,
      currentTask: undefined,

      // Workspace actions
      createWorkspace: (workspace, user) => {
        const newWorkspace = {
          id: nanoid(),
          ...workspace,
          spaces: [],
          members: [
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: 'admin' as const,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(state => ({
          workspaces: [...state.workspaces, newWorkspace],
          currentWorkspace: newWorkspace,
        }));

        return newWorkspace;
      },
      updateWorkspace: (id, workspace) =>
        set(state => ({
          workspaces: state.workspaces.map(w =>
            w.id === id ? { ...w, ...workspace, updatedAt: new Date() } : w
          ),
          currentWorkspace:
            state.currentWorkspace?.id === id
              ? {
                  ...state.currentWorkspace,
                  ...workspace,
                  updatedAt: new Date(),
                }
              : state.currentWorkspace,
        })),

      deleteWorkspace: id =>
        set(state => ({
          workspaces: state.workspaces.filter(w => w.id !== id),
          currentWorkspace:
            state.currentWorkspace?.id === id ? null : state.currentWorkspace,
        })),

      setCurrentWorkspace: id =>
        set(state => ({
          currentWorkspace:
            state.workspaces.find(w => w.id === id) || state.currentWorkspace,
        })),

      // Space actions
      addSpace: space =>
        set(state => {
          if (!state.currentWorkspace) return state;

          return {
            workspaces: state.workspaces.map(w =>
              w.id === state.currentWorkspace?.id
                ? {
                    ...w,
                    spaces: [
                      ...w.spaces,
                      {
                        ...space,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ],
                  }
                : w
            ),
          };
        }),

      updateSpace: (workspaceId, spaceId, space) =>
        set(state => ({
          workspaces: state.workspaces.map(w =>
            w.id === workspaceId
              ? {
                  ...w,
                  spaces: w.spaces.map(s =>
                    s.id === spaceId
                      ? { ...s, ...space, updatedAt: new Date() }
                      : s
                  ),
                }
              : w
          ),
        })),

      deleteSpace: (workspaceId, spaceId) =>
        set(state => ({
          workspaces: state.workspaces.map(w =>
            w.id === workspaceId
              ? { ...w, spaces: w.spaces.filter(s => s.id !== spaceId) }
              : w
          ),
          currentSpace:
            state.currentSpace?.id === spaceId ? undefined : state.currentSpace,
        })),

      setCurrentSpace: spaceId =>
        set(state => ({
          currentSpace: state.currentWorkspace?.spaces.find(
            s => s.id === spaceId
          ),
        })),

      // List actions
      addList: (spaceId, list) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s =>
              s.id === spaceId
                ? {
                    ...s,
                    lists: [
                      ...s.lists,
                      {
                        ...list,
                        id: crypto.randomUUID(),
                        tasks: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ],
                  }
                : s
            ),
          })),
        })),

      updateList: (spaceId, listId, list) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s =>
              s.id === spaceId
                ? {
                    ...s,
                    lists: s.lists.map(l =>
                      l.id === listId
                        ? { ...l, ...list, updatedAt: new Date() }
                        : l
                    ),
                  }
                : s
            ),
          })),
        })),

      deleteList: (spaceId, listId) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s =>
              s.id === spaceId
                ? { ...s, lists: s.lists.filter(l => l.id !== listId) }
                : s
            ),
          })),
          currentList:
            state.currentList?.id === listId ? undefined : state.currentList,
        })),

      setCurrentList: listId =>
        set(state => ({
          currentList: state.currentSpace?.lists.find(l => l.id === listId),
        })),

      // Task actions
      addTask: (listId, task) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l =>
                l.id === listId
                  ? {
                      ...l,
                      tasks: [
                        ...l.tasks,
                        {
                          ...task,
                          id: crypto.randomUUID(),
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          settings: {
                            theme: {
                              primary: '#000000',
                              background: '#ffffff',
                              accent: '#f3f4f6',
                            },
                            viewMode: 'comfortable',
                            notifications: {
                              email: true,
                              desktop: true,
                              inApp: true,
                            },
                          },
                        },
                      ],
                    }
                  : l
              ),
            })),
          })),
        })),

      updateTask: (listId, taskId, task) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l =>
                l.id === listId
                  ? {
                      ...l,
                      tasks: l.tasks.map(t =>
                        t.id === taskId
                          ? { ...t, ...task, updatedAt: new Date() }
                          : t
                      ),
                    }
                  : l
              ),
            })),
          })),
        })),

      deleteTask: (listId, taskId) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l =>
                l.id === listId
                  ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) }
                  : l
              ),
            })),
          })),
          currentTask:
            state.currentTask?.id === taskId ? undefined : state.currentTask,
        })),

      setCurrentTask: taskId =>
        set(state => ({
          currentTask: state.currentList?.tasks.find(t => t.id === taskId),
        })),

      moveTask: (taskId, sourceListId, targetListId) =>
        set(state => {
          let taskToMove: Task | undefined;
          const newWorkspaces = state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => {
                if (l.id === sourceListId) {
                  const task = l.tasks.find(t => t.id === taskId);
                  if (task) taskToMove = task;
                  return { ...l, tasks: l.tasks.filter(t => t.id !== taskId) };
                }
                if (l.id === targetListId && taskToMove) {
                  return {
                    ...l,
                    tasks: [
                      ...l.tasks,
                      { ...taskToMove, updatedAt: new Date() },
                    ],
                  };
                }
                return l;
              }),
            })),
          }));
          return { workspaces: newWorkspaces };
        }),

      // View actions
      setCurrentView: view => set({ currentView: view }),

      // Task specific actions
      addComment: (taskId, comment) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        comments: [
                          ...(t.comments || []),
                          {
                            ...comment,
                            id: crypto.randomUUID(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          },
                        ],
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      addChecklist: (taskId, checklist) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        checklists: [
                          ...(t.checklists || []),
                          { ...checklist, id: crypto.randomUUID() },
                        ],
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      updateChecklistItem: (taskId, checklistId, itemId, isCompleted) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        checklists: t.checklists.map(c =>
                          c.id === checklistId
                            ? {
                                ...c,
                                items: c.items.map(i =>
                                  i.id === itemId ? { ...i, isCompleted } : i
                                ),
                              }
                            : c
                        ),
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      addCustomField: (taskId, field) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        customFields: [
                          ...(t.customFields || []),
                          { ...field, id: crypto.randomUUID() },
                        ],
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      updateTimeTracking: (taskId, timeSpent) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId ? { ...t, timeSpent } : t
                ),
              })),
            })),
          })),
        })),

      addDependency: (taskId, dependencyId) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        dependencies: [...(t.dependencies || []), dependencyId],
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      addAttachment: (taskId, attachmentUrl) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === taskId
                    ? {
                        ...t,
                        attachments: [...(t.attachments || []), attachmentUrl],
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      // Theme actions
      updateProjectTheme: (projectId, theme) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === projectId
                    ? {
                        ...t,
                        settings: {
                          ...t.settings,
                          theme,
                        },
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      // View mode actions
      toggleViewMode: projectId =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === projectId
                    ? {
                        ...t,
                        settings: {
                          ...t.settings,
                          viewMode:
                            t.settings.viewMode === 'compact'
                              ? 'comfortable'
                              : 'compact',
                        },
                      }
                    : t
                ),
              })),
            })),
          })),
        })),

      // Notification settings
      updateNotificationSettings: (projectId, settings) =>
        set(state => ({
          workspaces: state.workspaces.map(w => ({
            ...w,
            spaces: w.spaces.map(s => ({
              ...s,
              lists: s.lists.map(l => ({
                ...l,
                tasks: l.tasks.map(t =>
                  t.id === projectId
                    ? {
                        ...t,
                        settings: {
                          ...t.settings,
                          notifications: {
                            ...t.settings.notifications,
                            ...settings,
                          },
                        },
                      }
                    : t
                ),
              })),
            })),
          })),
        })),
    }),
    {
      name: 'project-storage',
    }
  )
);
