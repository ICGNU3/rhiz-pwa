export const getNetworkData = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const contacts = JSON.parse(localStorage.getItem('rhiz-contacts') || '[]');
  
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
    totalConnections: contacts.length,
    newConnections: Math.floor(Math.random() * 10) + 1,
    activeConnections: Math.floor(contacts.length * 0.7),
    topCompanies,
    topLocations,
    networkDensity: Math.floor(Math.random() * 30) + 60, // 60-90%
    diversityScore: Math.floor(Math.random() * 25) + 70  // 70-95%
  };
};