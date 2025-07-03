// Team collaboration types for Rhiz PWA

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  settings: TeamSettings;
  stats: TeamStats;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: Date;
  permissions: Permission[];
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Permission {
  resource: 'contacts' | 'goals' | 'network' | 'intelligence' | 'settings';
  actions: ('read' | 'write' | 'delete' | 'share')[];
}

export interface TeamSettings {
  allowMemberInvites: boolean;
  requireApprovalForJoins: boolean;
  defaultPermissions: Permission[];
  contactSharing: 'all' | 'selected' | 'none';
  goalSharing: 'all' | 'selected' | 'none';
  networkSharing: 'all' | 'selected' | 'none';
  notifications: {
    memberJoined: boolean;
    contactAdded: boolean;
    goalUpdated: boolean;
    activitySummary: boolean;
  };
}

export interface TeamStats {
  memberCount: number;
  contactCount: number;
  goalCount: number;
  activeGoals: number;
  completedGoals: number;
  lastActivity: Date;
}

export interface SharedContact {
  id: string;
  contactId: string;
  teamId: string;
  sharedBy: string;
  sharedAt: Date;
  permissions: Permission[];
  notes?: string;
}

export interface SharedGoal {
  id: string;
  goalId: string;
  teamId: string;
  sharedBy: string;
  sharedAt: Date;
  permissions: Permission[];
  assignedTo?: string[];
  notes?: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
}

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  type: 'contact_added' | 'contact_updated' | 'goal_created' | 'goal_completed' | 'member_joined' | 'member_left';
  resourceId?: string;
  resourceType?: 'contact' | 'goal' | 'member';
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface TeamWorkspace {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  type: 'general' | 'project' | 'client' | 'department';
  members: string[];
  contacts: string[];
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface CreateTeamRequest {
  name: string;
  description?: string;
  settings?: Partial<TeamSettings>;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  settings?: Partial<TeamSettings>;
}

export interface InviteMemberRequest {
  email: string;
  role: TeamRole;
  message?: string;
}

export interface UpdateMemberRoleRequest {
  memberId: string;
  role: TeamRole;
}

export interface ShareResourceRequest {
  resourceType: 'contact' | 'goal';
  resourceId: string;
  permissions: Permission[];
  notes?: string;
}

// Team collaboration hooks types
export interface UseTeamReturn {
  team: Team | null;
  members: TeamMember[];
  activities: TeamActivity[];
  invitations: TeamInvitation[];
  workspaces: TeamWorkspace[];
  isLoading: boolean;
  error: string | null;
  createTeam: (data: CreateTeamRequest) => Promise<Team>;
  updateTeam: (data: UpdateTeamRequest) => Promise<Team>;
  inviteMember: (data: InviteMemberRequest) => Promise<TeamInvitation>;
  updateMemberRole: (data: UpdateMemberRoleRequest) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  shareResource: (data: ShareResourceRequest) => Promise<void>;
  leaveTeam: () => Promise<void>;
  deleteTeam: () => Promise<void>;
}

export interface UseTeamMemberReturn {
  isMember: boolean;
  role: TeamRole | null;
  permissions: Permission[];
  canRead: (resource: string) => boolean;
  canWrite: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canShare: (resource: string) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
} 