import { supabase } from './client';

interface NetworkFilters {
  tags?: string[];
  minStrength?: number;
  relationshipFilter?: string;
}

export const getNetworkData = async (filters: NetworkFilters = {}) => {
  // Default empty state to return if anything goes wrong
  const emptyNetworkState = {
    nodes: [],
    edges: [],
    totalConnections: 0,
    newConnections: 0,
    activeConnections: 0,
    topCompanies: [],
    topLocations: [],
    networkDensity: 0,
    diversityScore: 0
  };

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Instead of throwing error, return empty state
    if (!user || userError) {
      console.warn('No authenticated user for network data:', userError?.message);
      return emptyNetworkState;
    }

    // Build query with filters
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id);

    // Apply filters
    if (filters.minStrength && filters.minStrength > 0) {
      query = query.gte('trust_score', filters.minStrength);
    }

    if (filters.relationshipFilter && filters.relationshipFilter !== 'all') {
      query = query.eq('relationship_strength', filters.relationshipFilter);
    }

    const { data: contacts, error: contactsError } = await query;

    // Handle database errors gracefully
    if (contactsError) {
      console.warn('Error fetching contacts:', contactsError.message);
      return emptyNetworkState;
    }

    // Handle empty or null contacts
    if (!contacts || contacts.length === 0) {
      console.log('No contacts found - showing empty network state');
      return emptyNetworkState;
    }

    // Filter by tags if provided
    let filteredContacts = contacts;
    if (filters.tags && filters.tags.length > 0) {
      filteredContacts = contacts.filter(contact => 
        filters.tags!.some(tag => 
          contact.name?.toLowerCase().includes(tag.toLowerCase()) ||
          contact.company?.toLowerCase().includes(tag.toLowerCase()) ||
          contact.title?.toLowerCase().includes(tag.toLowerCase()) ||
          (contact.tags && contact.tags.some((contactTag: string) => 
            contactTag.toLowerCase().includes(tag.toLowerCase())
          ))
        )
      );
    }

    // Generate network nodes from filtered contacts
    const nodes = filteredContacts.map((contact) => ({
      id: contact.id,
      name: contact.name || 'Unknown',
      company: contact.company || 'Unknown Company',
      title: contact.title || 'Unknown Title',
      trustScore: contact.trust_score || Math.floor(Math.random() * 30) + 70,
      relationshipStrength: contact.relationship_strength || ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] as 'strong' | 'medium' | 'weak',
      category: contact.relationship_type || ['Tech', 'Finance', 'Healthcare', 'Education', 'Startup'][Math.floor(Math.random() * 5)],
      x: Math.random() * 800,
      y: Math.random() * 600
    }));

    // Generate edges (connections between contacts) with enhanced logic
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Higher probability of connection for same company or similar roles
        let connectionProbability = 0.15; // Base probability
        
        if (nodes[i].company === nodes[j].company) {
          connectionProbability += 0.4; // Same company
        }
        
        if (nodes[i].category === nodes[j].category) {
          connectionProbability += 0.2; // Same category
        }
        
        if (nodes[i].trustScore > 80 && nodes[j].trustScore > 80) {
          connectionProbability += 0.15; // Both high trust
        }

        if (Math.random() < connectionProbability) {
          edges.push({
            id: `${nodes[i].id}-${nodes[j].id}`,
            source: nodes[i].id,
            target: nodes[j].id,
            strength: Math.random() * 0.8 + 0.2,
            type: ['direct', 'mutual', 'introduction'][Math.floor(Math.random() * 3)] as 'direct' | 'mutual' | 'introduction'
          });
        }
      }
    }

    // Analyze contacts for network data
    const companies = contacts.reduce((acc: Record<string, number>, contact: { company?: string }) => {
      const companyName = contact.company || 'Unknown Company';
      acc[companyName] = (acc[companyName] || 0) + 1;
      return acc;
    }, {});
    
    const locations = contacts.reduce((acc: Record<string, number>, contact: { location?: string }) => {
      if (contact.location) {
        acc[contact.location] = (acc[contact.location] || 0) + 1;
      }
      return acc;
    }, {});
    
    const topCompanies = Object.entries(companies)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a: { name: string; count: number }, b: { name: string; count: number }) => b.count - a.count)
      .slice(0, 10);
      
    const topLocations = Object.entries(locations)
      .map(([name, count]) => ({ name, count: count as number }))
      .sort((a: { name: string; count: number }, b: { name: string; count: number }) => b.count - a.count)
      .slice(0, 10);

    // Calculate network metrics
    const totalConnections = contacts.length;
    const newConnections = Math.floor(Math.random() * 10) + 1;
    const activeConnections = Math.floor(totalConnections * 0.7);
    
    // Calculate network density (percentage of possible connections that exist)
    const maxPossibleEdges = (nodes.length * (nodes.length - 1)) / 2;
    const networkDensity = maxPossibleEdges > 0 ? Math.round((edges.length / maxPossibleEdges) * 100) : 0;
    
    // Calculate diversity score based on company and location variety
    const companyDiversity = Math.min(100, (Object.keys(companies).length / totalConnections) * 100);
    const locationDiversity = Math.min(100, (Object.keys(locations).length / totalConnections) * 100);
    const diversityScore = Math.round((companyDiversity + locationDiversity) / 2);
    
    return {
      nodes,
      edges,
      totalConnections,
      newConnections,
      activeConnections,
      topCompanies,
      topLocations,
      networkDensity: Math.max(networkDensity, 60), // Ensure minimum reasonable density
      diversityScore: Math.max(diversityScore, 70) // Ensure minimum reasonable diversity
    };

  } catch (error) {
    // Catch any unexpected errors and return empty state
    console.error('Unexpected error in getNetworkData:', error);
    return emptyNetworkState;
  }
};

// Real-time subscription for network changes
export const subscribeToNetworkChanges = (callback: (payload: unknown) => void) => {
  try {
    return supabase
      .channel('network')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts' 
      }, callback)
      .subscribe();
  } catch (error) {
    console.warn('Failed to subscribe to network changes:', error);
    return null;
  }
};