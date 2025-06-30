import { supabase } from './client';

export interface Application {
  id: string;
  name: string;
  email: string;
  organization: string;
  vertical: string;
  reason: string;
  referral: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Submit a new application
export const submitApplication = async (applicationData: Omit<Application, 'id' | 'status' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('membership_applications')
    .insert([
      {
        ...applicationData,
        status: 'pending'
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit application: ${error.message}`);
  }

  return data;
};

// Get applications (admin only)
export const getApplications = async (status?: 'pending' | 'approved' | 'rejected') => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // Check if user is admin
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();
    
  if (userError || !userData?.is_admin) {
    throw new Error('Not authorized');
  }
  
  // Fetch applications with filter
  let query = supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }
  
  return data as Application[];
};

// Update application status (admin only)
export const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // Check if user is admin
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();
    
  if (userError || !userData?.is_admin) {
    throw new Error('Not authorized');
  }
  
  // Update application status
  const { error } = await supabase
    .from('membership_applications')
    .update({ status })
    .eq('id', applicationId);
    
  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }
  
  // If approved, update user's alpha status
  if (status === 'approved') {
    // Get application data to find user email
    const { data: application, error: fetchError } = await supabase
      .from('membership_applications')
      .select('email')
      .eq('id', applicationId)
      .single();
      
    if (fetchError) {
      throw new Error(`Failed to fetch application: ${fetchError.message}`);
    }
    
    // Update user's alpha status
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ is_alpha: true })
      .eq('email', application.email);
      
    if (userUpdateError) {
      throw new Error(`Failed to update user: ${userUpdateError.message}`);
    }
    
    // Send invitation email (would be implemented with Supabase Edge Function or Resend)
    // await sendApprovalEmail(application.email);
  }
  
  return { success: true };
};

// Check if user has a pending application
export const checkPendingApplication = async (email: string) => {
  const { data, error } = await supabase
    .from('membership_applications')
    .select('status')
    .eq('email', email)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Failed to check application status: ${error.message}`);
  }
  
  return data ? data.status : null;
};