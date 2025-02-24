// User related types
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  password: string;
  avatar?: string;
  phoneNumber?: string;
  status: UserStatus;
  timezone: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

// Organization related types
export type OrgRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

// Organization settings type
export interface OrganizationSettings {
  allowPublicProjects?: boolean;
  defaultTimeZone?: string;
  defaultLanguage?: string;
  securitySettings?: {
    mfaRequired?: boolean;
    passwordPolicy?: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
    };
  };
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  settings?: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
  members?: OrganizationMember[];
  teams?: Team[];
  chats?: Chat[];
  documents?: Document[];
  events?: Event[];
  approvals?: Approval[];
  tasks?: Task[];
  meetings?: Meeting[];
}

export interface OrganizationMember {
  id: string;
  role: OrgRole;
  department?: string;
  title?: string;
  joinedAt: Date;
  organizationId: string;
  userId: string;
  teams?: TeamMember[];
}

// Team related types
export type TeamRole = 'LEADER' | 'MEMBER';

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  role: TeamRole;
  joinedAt: Date;
  teamId: string;
  orgMemberId: string;
}

// Chat related types
export type ChatType = 'DIRECT' | 'GROUP' | 'CHANNEL';
export type ChatRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type MessageType =
  | 'TEXT'
  | 'IMAGE'
  | 'FILE'
  | 'AUDIO'
  | 'VIDEO'
  | 'SYSTEM';

// Message metadata types
export interface MessageMetadata {
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number; // For audio/video
  dimensions?: {
    width: number;
    height: number;
  };
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

export interface Chat {
  id: string;
  type: ChatType;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  members?: ChatMember[];
  messages?: Message[];
}

export interface ChatMember {
  id: string;
  role: ChatRole;
  joinedAt: Date;
  lastRead: Date;
  chatId: string;
  userId: string;
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  metadata?: MessageMetadata;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  chatId: string;
  senderId: string;
  replyToId?: string;
  replies?: Message[];
}

// Document related types
export type DocType = 'DOC' | 'SHEET' | 'SLIDE' | 'WIKI' | 'FORM';

// Document permissions type
export interface DocumentPermissions {
  public: boolean;
  roles: {
    role: OrgRole;
    permissions: {
      read: boolean;
      write: boolean;
      share: boolean;
      delete: boolean;
    };
  }[];
  users: {
    userId: string;
    permissions: {
      read: boolean;
      write: boolean;
      share: boolean;
      delete: boolean;
    };
  }[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocType;
  isTemplate: boolean;
  permissions: DocumentPermissions;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  creatorId: string;
  parentId?: string;
  children?: Document[];
  edits?: DocumentEdit[];
}

// Document edit changes type
export interface DocumentEditChanges {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
  metadata?: {
    format?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      color?: string;
    };
  };
}

export interface DocumentEdit {
  id: string;
  changes: DocumentEditChanges[];
  createdAt: Date;
  documentId: string;
  editorId: string;
}

// Task related types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
  order: number;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  assigneeId?: string;
  listId: string;
}

// Event related types
export type AttendeeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';

// Event recurrence type
export interface EventRecurrence {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  endDate?: Date;
  endCount?: number;
  daysOfWeek?: number[];
  monthDay?: number;
  weekNumber?: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  recurrence?: EventRecurrence;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  creatorId: string;
  attendees?: EventAttendee[];
}

export interface EventAttendee {
  id: string;
  status: AttendeeStatus;
  createdAt: Date;
  updatedAt: Date;
  eventId: string;
  userId: string;
}

// Meeting related types
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  meetingUrl?: string;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  organizerId: string;
  attendees?: MeetingAttendee[];
}

export interface MeetingAttendee {
  id: string;
  status: AttendeeStatus;
  joinedAt?: Date;
  leftAt?: Date;
  meetingId: string;
  userId: string;
}

// Approval related types
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type ApprovalType = 'LEAVE' | 'EXPENSE' | 'PURCHASE' | 'CUSTOM';

// Approval metadata types
export interface ApprovalMetadata {
  leave?: {
    startDate: Date;
    endDate: Date;
    type: 'VACATION' | 'SICK' | 'PERSONAL' | 'OTHER';
    reason?: string;
  };
  expense?: {
    amount: number;
    currency: string;
    category: string;
    receipts: string[];
    notes?: string;
  };
  purchase?: {
    items: {
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    vendor?: string;
    deliveryDate?: Date;
  };
  custom?: Record<string, unknown>;
}

export interface Approval {
  id: string;
  title: string;
  description?: string;
  status: ApprovalStatus;
  type: ApprovalType;
  metadata?: ApprovalMetadata;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  creatorId: string;
  steps?: ApprovalStep[];
}

export interface ApprovalStep {
  id: string;
  order: number;
  status: ApprovalStatus;
  comment?: string;
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  approvalId: string;
  approverId: string;
}

// View related types
export type ViewType = 'list' | 'board' | 'calendar' | 'gantt' | 'timeline';

// Project and Workspace types
export interface Project {
  id: string;
  name: string;
  description?: string;
  template: 'agile' | 'waterfall' | 'custom';
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  creatorId: string;
  lists: TaskList[];
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
  projects: Project[];
}
