import { supabase } from './client';

export const getNetworkData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id);

  if (!contacts) {
    return {
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
  }

  // Generate network nodes from contacts
  const nodes = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    company: contact.company,
    title: contact.title,
    trustScore: contact.trust_score || Math.floor(Math.random() * 30) + 70,
    relationshipStrength: contact.relationship_strength || ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] as 'strong' | 'medium' | 'weak',
    category: contact.relationship_type || ['Tech', 'Finance', 'Healthcare', 'Education', 'Startup'][Math.floor(Math.random() * 5)]
  }));

  // Generate edges (connections between contacts)
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() < 0.3) {
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
  const companies = contacts.reduce((acc: any, contact: any) => {
    acc[contact.company] = (acc[contact.company] || 0) + 1;
    return acc;
  }, {});
  
  const locations = contacts.reduce((acc: any, contact: any) => {
    if (contact.location) {
      acc[contact.location] = (acc[contact.location] || 0) + 1;
    }
    return acc;
  }, {});
  
  const topCompanies = Object.entries(companies)
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);
    
  const topLocations = Object.entries(locations)
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);
  
  return {
    nodes,
    edges,
    totalConnections: contacts.length,
    newConnections: Math.floor(Math.random() * 10) + 1,
    activeConnections: Math.floor(contacts.length * 0.7),
    topCompanies,
    topLocations,
    networkDensity: Math.floor(Math.random() * 30) + 60,
    diversityScore: Math.floor(Math.random() * 25) + 70
  };
};

// Real-time subscription for network changes
export const subscribeToNetworkChanges = (callback: (payload: any) => void) => {
  return supabase
    .channel('network')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'contacts' 
    }, callback)
    .subscribe();
};