import type {
  Team,
  TeamMember,
  TeamInvitation,
  TeamActivity,
  TeamWorkspace,
  CreateTeamRequest,
  UpdateTeamRequest,
  InviteMemberRequest,
  UpdateMemberRoleRequest,
  ShareResourceRequest
} from '../types/team';

// Team Management
export const getTeams = async (): Promise<Team[]> => {
  // Return demo data for development
  return [
    {
      id: 'team-1',
      name: 'Sales Team',
      description: 'Our main sales team for enterprise clients',
      avatar: '/api/placeholder/64/64',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      ownerId: 'user-1',
      settings: {
        allowMemberInvites: true,
        requireApprovalForJoins: false,
        defaultPermissions: [
          { resource: 'contacts', actions: ['read', 'write'] },
          { resource: 'goals', actions: ['read', 'write'] }
        ],
        contactSharing: 'all',
        goalSharing: 'selected',
        networkSharing: 'selected',
        notifications: {
          memberJoined: true,
          contactAdded: true,
          goalUpdated: true,
          activitySummary: true
        }
      },
      stats: {
        memberCount: 8,
        contactCount: 156,
        goalCount: 24,
        activeGoals: 18,
        completedGoals: 6,
        lastActivity: new Date('2024-01-20T10:30:00Z')
      }
    },
    {
      id: 'team-2',
      name: 'Marketing Team',
      description: 'Digital marketing and brand management',
      avatar: '/api/placeholder/64/64',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-19'),
      ownerId: 'user-2',
      settings: {
        allowMemberInvites: true,
        requireApprovalForJoins: true,
        defaultPermissions: [
          { resource: 'contacts', actions: ['read'] },
          { resource: 'goals', actions: ['read', 'write'] }
        ],
        contactSharing: 'selected',
        goalSharing: 'all',
        networkSharing: 'none',
        notifications: {
          memberJoined: true,
          contactAdded: false,
          goalUpdated: true,
          activitySummary: false
        }
      },
      stats: {
        memberCount: 5,
        contactCount: 89,
        goalCount: 15,
        activeGoals: 12,
        completedGoals: 3,
        lastActivity: new Date('2024-01-19T14:15:00Z')
      }
    }
  ];
};

export const getTeam = async (teamId: string): Promise<Team> => {
  const teams = await getTeams();
  const team = teams.find(t => t.id === teamId);
  if (!team) {
    throw new Error('Team not found');
  }
  return team;
};

export const createTeam = async (data: CreateTeamRequest): Promise<Team> => {
  // Simulate API call
  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name: data.name,
    description: data.description,
    avatar: '/api/placeholder/64/64',
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: 'user-1',
    settings: {
      allowMemberInvites: true,
      requireApprovalForJoins: false,
      defaultPermissions: [
        { resource: 'contacts', actions: ['read', 'write'] },
        { resource: 'goals', actions: ['read', 'write'] }
      ],
      contactSharing: 'all',
      goalSharing: 'selected',
      networkSharing: 'selected',
      notifications: {
        memberJoined: true,
        contactAdded: true,
        goalUpdated: true,
        activitySummary: true
      }
    },
    stats: {
      memberCount: 1,
      contactCount: 0,
      goalCount: 0,
      activeGoals: 0,
      completedGoals: 0,
      lastActivity: new Date()
    }
  };
  return newTeam;
};

export const updateTeam = async (teamId: string, data: UpdateTeamRequest): Promise<Team> => {
  const team = await getTeam(teamId);
  return { 
    ...team, 
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.settings && { settings: { ...team.settings, ...data.settings } }),
    updatedAt: new Date() 
  };
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  // Simulate API call
  console.log('Deleting team:', teamId);
};

// Team Members
export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  // Return demo data for development
  return [
    {
      id: 'member-1',
      teamId,
      userId: 'user-1',
      role: 'owner',
      joinedAt: new Date('2024-01-15'),
      permissions: [
        { resource: 'contacts', actions: ['read', 'write', 'delete', 'share'] },
        { resource: 'goals', actions: ['read', 'write', 'delete', 'share'] },
        { resource: 'settings', actions: ['read', 'write'] }
      ],
      user: {
        id: 'user-1',
        email: 'sarah@company.com',
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32'
      }
    },
    {
      id: 'member-2',
      teamId,
      userId: 'user-2',
      role: 'admin',
      joinedAt: new Date('2024-01-16'),
      permissions: [
        { resource: 'contacts', actions: ['read', 'write', 'share'] },
        { resource: 'goals', actions: ['read', 'write', 'share'] }
      ],
      user: {
        id: 'user-2',
        email: 'mike@company.com',
        name: 'Mike Chen',
        avatar: '/api/placeholder/32/32'
      }
    },
    {
      id: 'member-3',
      teamId,
      userId: 'user-3',
      role: 'member',
      joinedAt: new Date('2024-01-17'),
      permissions: [
        { resource: 'contacts', actions: ['read', 'write'] },
        { resource: 'goals', actions: ['read', 'write'] }
      ],
      user: {
        id: 'user-3',
        email: 'emma@company.com',
        name: 'Emma Davis',
        avatar: '/api/placeholder/32/32'
      }
    }
  ];
};

export const inviteMember = async (teamId: string, data: InviteMemberRequest): Promise<TeamInvitation> => {
  // Simulate API call
  const invitation: TeamInvitation = {
    id: `invite-${Date.now()}`,
    teamId,
    email: data.email,
    role: data.role,
    invitedBy: 'user-1',
    invitedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    status: 'pending',
    token: `token-${Date.now()}`
  };
  return invitation;
};

export const updateMemberRole = async (teamId: string, data: UpdateMemberRoleRequest): Promise<void> => {
  // Simulate API call
  console.log('Updating member role:', data);
};

export const removeMember = async (teamId: string, memberId: string): Promise<void> => {
  // Simulate API call
  console.log('Removing member:', memberId);
};

export const leaveTeam = async (teamId: string): Promise<void> => {
  // Simulate API call
  console.log('Leaving team:', teamId);
};

// Team Invitations
export const getTeamInvitations = async (teamId: string): Promise<TeamInvitation[]> => {
  // Return demo data for development
  return [
    {
      id: 'invite-1',
      teamId,
      email: 'alex@company.com',
      role: 'member',
      invitedBy: 'user-1',
      invitedAt: new Date('2024-01-20T09:00:00Z'),
      expiresAt: new Date('2024-01-27T09:00:00Z'),
      status: 'pending',
      token: 'demo-token-1'
    }
  ];
};

export const acceptInvitation = async (token: string): Promise<void> => {
  // Simulate API call
  console.log('Accepting invitation:', token);
};

export const declineInvitation = async (token: string): Promise<void> => {
  // Simulate API call
  console.log('Declining invitation:', token);
};

// Team Activities
export const getTeamActivities = async (teamId: string, limit = 50): Promise<TeamActivity[]> => {
  // Return demo data for development
  return [
    {
      id: 'activity-1',
      teamId,
      userId: 'user-1',
      type: 'contact_added',
      resourceId: 'contact-1',
      resourceType: 'contact',
      description: 'Sarah Johnson added John Smith to contacts',
      metadata: { contactName: 'John Smith' },
      timestamp: new Date('2024-01-20T10:30:00Z')
    },
    {
      id: 'activity-2',
      teamId,
      userId: 'user-2',
      type: 'goal_completed',
      resourceId: 'goal-1',
      resourceType: 'goal',
      description: 'Mike Chen completed goal "Increase Q1 sales by 20%"',
      metadata: { goalName: 'Increase Q1 sales by 20%' },
      timestamp: new Date('2024-01-20T09:15:00Z')
    },
    {
      id: 'activity-3',
      teamId,
      userId: 'user-3',
      type: 'member_joined',
      resourceId: 'member-3',
      resourceType: 'member',
      description: 'Emma Davis joined the team',
      metadata: { memberName: 'Emma Davis' },
      timestamp: new Date('2024-01-19T14:00:00Z')
    }
  ];
};

// Team Workspaces
export const getTeamWorkspaces = async (teamId: string): Promise<TeamWorkspace[]> => {
  // Return demo data for development
  return [
    {
      id: 'workspace-1',
      teamId,
      name: 'Enterprise Sales',
      description: 'Workspace for enterprise sales team',
      type: 'project',
      members: ['user-1', 'user-2'],
      contacts: ['contact-1', 'contact-2', 'contact-3'],
      goals: ['goal-1', 'goal-2'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'workspace-2',
      teamId,
      name: 'SMB Outreach',
      description: 'Small and medium business outreach',
      type: 'project',
      members: ['user-1', 'user-3'],
      contacts: ['contact-4', 'contact-5'],
      goals: ['goal-3'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-19')
    }
  ];
};

export const createWorkspace = async (teamId: string, data: {
  name: string;
  description?: string;
  type: 'general' | 'project' | 'client' | 'department';
}): Promise<TeamWorkspace> => {
  // Simulate API call
  const workspace: TeamWorkspace = {
    id: `workspace-${Date.now()}`,
    teamId,
    name: data.name,
    description: data.description,
    type: data.type,
    members: ['user-1'],
    contacts: [],
    goals: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return workspace;
};

// Resource Sharing
export const shareResource = async (teamId: string, data: ShareResourceRequest): Promise<void> => {
  // Simulate API call
  console.log('Sharing resource:', data);
};

export const getSharedResources = async (teamId: string, resourceType?: 'contact' | 'goal'): Promise<any[]> => {
  // Return demo data for development
  return [];
};

// Team Analytics
export const getTeamAnalytics = async (teamId: string, period: 'week' | 'month' | 'quarter' = 'month'): Promise<any> => {
  // Return demo analytics data
  return {
    period,
    contacts: {
      total: 156,
      added: 12,
      updated: 8,
      shared: 5
    },
    goals: {
      total: 24,
      active: 18,
      completed: 6,
      progress: 75
    },
    activity: {
      totalActions: 89,
      memberActivity: [
        { userId: 'user-1', actions: 25 },
        { userId: 'user-2', actions: 18 },
        { userId: 'user-3', actions: 12 }
      ]
    },
    engagement: {
      activeMembers: 8,
      averageResponseTime: '2.5h',
      collaborationScore: 85
    }
  };
}; 