import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { User } from './user-store';
import {
  Organization,
  Team,
  Chat,
  Message,
  Document,
  Task,
  Event,
  Meeting,
  Approval,
  ChatType,
  DocType,
  ApprovalType,
  ViewType,
} from '@/types';

interface AppState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  currentTeam?: Team;
  currentChat?: Chat;
  currentDocument?: Document;
  currentTask?: Task;
  currentView: ViewType;

  // Organization actions
  createOrganization: (
    organization: {
      name: string;
      description?: string;
      domain?: string;
    },
    user: User
  ) => Organization;
  updateOrganization: (id: string, organization: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  setCurrentOrganization: (id: string) => void;

  // Team actions
  createTeam: (
    organizationId: string,
    team: {
      name: string;
      description?: string;
    }
  ) => void;
  updateTeam: (teamId: string, team: Partial<Team>) => void;
  deleteTeam: (teamId: string) => void;
  setCurrentTeam: (teamId: string) => void;

  // Chat actions
  createChat: (
    organizationId: string,
    chat: {
      type: ChatType;
      name?: string;
      members: string[];
    }
  ) => void;
  updateChat: (chatId: string, chat: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string) => void;
  sendMessage: (chatId: string, message: Partial<Message>) => void;

  // Document actions
  createDocument: (
    organizationId: string,
    document: {
      title: string;
      content: string;
      type: DocType;
      parentId?: string;
    }
  ) => void;
  updateDocument: (documentId: string, document: Partial<Document>) => void;
  deleteDocument: (documentId: string) => void;
  setCurrentDocument: (documentId: string) => void;

  // Task actions
  createTask: (task: Partial<Task>) => void;
  updateTask: (taskId: string, task: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setCurrentTask: (taskId: string) => void;

  // Event actions
  createEvent: (
    organizationId: string,
    event: {
      title: string;
      description?: string;
      startTime: Date;
      endTime: Date;
      attendees?: string[];
    }
  ) => void;
  updateEvent: (eventId: string, event: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;

  // Meeting actions
  createMeeting: (meeting: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    attendees?: string[];
  }) => void;
  updateMeeting: (meetingId: string, meeting: Partial<Meeting>) => void;
  deleteMeeting: (meetingId: string) => void;

  // Approval actions
  createApproval: (
    organizationId: string,
    approval: {
      title: string;
      description?: string;
      type: ApprovalType;
      steps: {
        approverId: string;
        order: number;
      }[];
    }
  ) => void;
  updateApproval: (approvalId: string, approval: Partial<Approval>) => void;
  deleteApproval: (approvalId: string) => void;

  // View actions
  setCurrentView: (view: ViewType) => void;
}

export const useProjectStore = create<AppState>()(
  persist(
    (set): AppState => ({
      organizations: [],
      currentOrganization: null,
      currentView: 'list',
      currentTeam: undefined,
      currentChat: undefined,
      currentDocument: undefined,
      currentTask: undefined,

      // Organization actions
      createOrganization: (organization, user) => {
        const newOrganization: Organization = {
          id: nanoid(),
          ...organization,
          members: [
            {
              id: nanoid(),
              role: 'OWNER',
              joinedAt: new Date(),
              organizationId: nanoid(),
              userId: user.id,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: [],
          meetings: [],
        };

        set(state => ({
          organizations: [...state.organizations, newOrganization],
          currentOrganization: newOrganization,
        }));

        return newOrganization;
      },

      updateOrganization: (id, organization) =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === id ? { ...o, ...organization, updatedAt: new Date() } : o
          ),
          currentOrganization:
            state.currentOrganization?.id === id
              ? {
                  ...state.currentOrganization,
                  ...organization,
                  updatedAt: new Date(),
                }
              : state.currentOrganization,
        })),

      deleteOrganization: id =>
        set(state => ({
          organizations: state.organizations.filter(o => o.id !== id),
          currentOrganization:
            state.currentOrganization?.id === id
              ? null
              : state.currentOrganization,
        })),

      setCurrentOrganization: id =>
        set(state => ({
          currentOrganization:
            state.organizations.find(o => o.id === id) ||
            state.currentOrganization,
        })),

      // Team actions
      createTeam: (organizationId, team) =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === organizationId
              ? {
                  ...o,
                  teams: [
                    ...(o.teams || []),
                    {
                      ...team,
                      id: nanoid(),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      organizationId,
                      members: [],
                    } as Team,
                  ],
                }
              : o
          ),
        })),

      updateTeam: (teamId, team) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            teams: o.teams?.map(t =>
              t.id === teamId ? { ...t, ...team, updatedAt: new Date() } : t
            ),
          })),
          currentTeam:
            state.currentTeam?.id === teamId
              ? { ...state.currentTeam, ...team, updatedAt: new Date() }
              : state.currentTeam,
        })),

      deleteTeam: teamId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            teams: o.teams?.filter(t => t.id !== teamId),
          })),
          currentTeam:
            state.currentTeam?.id === teamId ? undefined : state.currentTeam,
        })),

      setCurrentTeam: teamId =>
        set(state => ({
          currentTeam:
            state.organizations
              .flatMap(o => o.teams || [])
              .find(t => t.id === teamId) || state.currentTeam,
        })),

      // Chat actions
      createChat: (organizationId, chat) =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === organizationId
              ? {
                  ...o,
                  chats: [
                    ...(o.chats || []),
                    {
                      id: nanoid(),
                      type: chat.type,
                      name: chat.name,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      organizationId,
                      members: chat.members.map(userId => ({
                        id: nanoid(),
                        role: 'MEMBER',
                        joinedAt: new Date(),
                        lastRead: new Date(),
                        chatId: nanoid(),
                        userId,
                      })),
                      messages: [],
                    } as Chat,
                  ],
                }
              : o
          ),
        })),

      updateChat: (chatId, chat) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            chats: o.chats?.map(c =>
              c.id === chatId ? { ...c, ...chat, updatedAt: new Date() } : c
            ),
          })),
          currentChat:
            state.currentChat?.id === chatId
              ? { ...state.currentChat, ...chat, updatedAt: new Date() }
              : state.currentChat,
        })),

      deleteChat: chatId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            chats: o.chats?.filter(c => c.id !== chatId),
          })),
          currentChat:
            state.currentChat?.id === chatId ? undefined : state.currentChat,
        })),

      setCurrentChat: chatId =>
        set(state => ({
          currentChat:
            state.organizations
              .flatMap(o => o.chats || [])
              .find(c => c.id === chatId) || state.currentChat,
        })),

      sendMessage: (chatId, message) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            chats: o.chats?.map(c =>
              c.id === chatId
                ? {
                    ...c,
                    messages: [
                      ...(c.messages || []),
                      {
                        ...message,
                        id: nanoid(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        chatId,
                      } as Message,
                    ],
                  }
                : c
            ),
          })),
        })),

      // Document actions
      createDocument: (organizationId, document) =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === organizationId
              ? {
                  ...o,
                  documents: [
                    ...(o.documents || []),
                    {
                      ...document,
                      id: nanoid(),
                      isTemplate: false,
                      permissions: {
                        public: false,
                        roles: [],
                        users: [],
                      },
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      organizationId,
                      creatorId: o.id,
                    } as Document,
                  ],
                }
              : o
          ),
        })),

      updateDocument: (documentId, document) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            documents: o.documents?.map(d =>
              d.id === documentId
                ? { ...d, ...document, updatedAt: new Date() }
                : d
            ),
          })),
          currentDocument:
            state.currentDocument?.id === documentId
              ? { ...state.currentDocument, ...document, updatedAt: new Date() }
              : state.currentDocument,
        })),

      deleteDocument: documentId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            documents: o.documents?.filter(d => d.id !== documentId),
          })),
          currentDocument:
            state.currentDocument?.id === documentId
              ? undefined
              : state.currentDocument,
        })),

      setCurrentDocument: documentId =>
        set(state => ({
          currentDocument:
            state.organizations
              .flatMap(o => o.documents || [])
              .find(d => d.id === documentId) || state.currentDocument,
        })),

      // Task actions
      createTask: task =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === state.currentOrganization?.id
              ? {
                  ...o,
                  tasks: [
                    ...(o.tasks || []),
                    {
                      ...task,
                      id: nanoid(),
                      status: task.status || 'TODO',
                      priority: task.priority || 'NORMAL',
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    } as Task,
                  ],
                }
              : o
          ),
        })),

      updateTask: (taskId, task) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            tasks: o.tasks?.map(t =>
              t.id === taskId ? { ...t, ...task, updatedAt: new Date() } : t
            ),
          })),
          currentTask:
            state.currentTask?.id === taskId
              ? { ...state.currentTask, ...task, updatedAt: new Date() }
              : state.currentTask,
        })),

      deleteTask: taskId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            tasks: o.tasks?.filter(t => t.id !== taskId),
          })),
          currentTask:
            state.currentTask?.id === taskId ? undefined : state.currentTask,
        })),

      setCurrentTask: taskId =>
        set(state => ({
          currentTask:
            state.organizations
              .flatMap(o => o.tasks || [])
              .find(t => t.id === taskId) || state.currentTask,
        })),

      // Event actions
      createEvent: (organizationId, event) =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === organizationId
              ? {
                  ...o,
                  events: [
                    ...(o.events || []),
                    {
                      ...event,
                      id: nanoid(),
                      isAllDay: false,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      organizationId,
                    } as Event,
                  ],
                }
              : o
          ),
        })),

      updateEvent: (eventId, event) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            events: o.events?.map(e =>
              e.id === eventId ? { ...e, ...event, updatedAt: new Date() } : e
            ),
          })),
        })),

      deleteEvent: eventId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            events: o.events?.filter(e => e.id !== eventId),
          })),
        })),

      // Meeting actions
      createMeeting: meeting =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === state.currentOrganization?.id
              ? {
                  ...o,
                  meetings: [
                    ...(o.meetings || []),
                    {
                      ...meeting,
                      id: nanoid(),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      organizerId: state.currentOrganization.id,
                    } as Meeting,
                  ],
                }
              : o
          ),
        })),

      updateMeeting: (meetingId, meeting) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            meetings: o.meetings?.map(m =>
              m.id === meetingId
                ? { ...m, ...meeting, updatedAt: new Date() }
                : m
            ),
          })),
        })),

      deleteMeeting: meetingId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            meetings: o.meetings?.filter(m => m.id !== meetingId),
          })),
        })),

      // Approval actions
      createApproval: (organizationId, approval) =>
        set(state => ({
          organizations: state.organizations.map(o =>
            o.id === organizationId
              ? {
                  ...o,
                  approvals: [
                    ...(o.approvals || []),
                    {
                      ...approval,
                      id: nanoid(),
                      status: 'PENDING',
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      organizationId,
                    } as Approval,
                  ],
                }
              : o
          ),
        })),

      updateApproval: (approvalId, approval) =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            approvals: o.approvals?.map(a =>
              a.id === approvalId
                ? { ...a, ...approval, updatedAt: new Date() }
                : a
            ),
          })),
        })),

      deleteApproval: approvalId =>
        set(state => ({
          organizations: state.organizations.map(o => ({
            ...o,
            approvals: o.approvals?.filter(a => a.id !== approvalId),
          })),
        })),

      // View actions
      setCurrentView: view => set({ currentView: view }),
    }),
    {
      name: 'project-store',
    }
  )
);
