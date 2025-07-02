import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Mail, User, Building, Calendar, Filter, Search, RefreshCw } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/Spinner';
import ErrorBorder from '../../components/ErrorBorder';
import { supabase } from '../../api/client';

interface Application {
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

const AdminApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch applications
  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['applications', statusFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Check if user is admin
      const { data: userData, error: userError } = await supabase
        .from('profiles')
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
        
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw new Error(`Failed to fetch applications: ${fetchError.message}`);
      }
      
      return data as Application[];
    },
  });

  // Send email notification
  const sendEmailNotification = async (application: Application, type: 'approval' | 'rejection') => {
    try {
      await supabase.functions.invoke('send-application-email', {
        body: { 
          name: application.name, 
          email: application.email, 
          type: type 
        }
      });
    } catch (error) {
      console.error(`Failed to send ${type} email:`, error);
    }
  };

  // Approve application mutation
  const approveMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      // 1. Get application data
      const { data: application, error: fetchError } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // 2. Update application status
      const { error: updateError } = await supabase
        .from('membership_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
        
      if (updateError) throw updateError;
      
      // 3. Set is_alpha flag for user with this email
      const { error: userUpdateError } = await supabase
        .from('profiles')
        .update({ is_alpha: true })
        .eq('email', application.email);
        
      if (userUpdateError) throw userUpdateError;
      
      // 4. Send approval email
      await sendEmailNotification(application, 'approval');
      
      return applicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  // Reject application mutation
  const rejectMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      // 1. Get application data
      const { data: application, error: fetchError } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // 2. Update application status
      const { error } = await supabase
        .from('membership_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // 3. Send rejection email
      await sendEmailNotification(application, 'rejection');
      
      return applicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  // Filter applications by search term
  const filteredApplications = applications?.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.vertical.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alpha Applications</h1>
        </div>
        <ErrorBorder 
          message={`${(error as Error).message || 'Failed to load applications'}`}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Alpha Applications
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Review and manage applications for Rhiz alpha access
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={RefreshCw}
              onClick={() => refetch()}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Status:</span>
              </div>
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Org/Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vertical
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredApplications && filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {application.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <div className="text-sm text-gray-900 dark:text-white">
                            {application.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-500 mr-2" />
                          <div className="text-sm text-gray-900 dark:text-white">
                            {application.organization}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300">
                          {application.vertical}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(application.created_at)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'approved' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                            : application.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {application.status === 'pending' && (
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={CheckCircle}
                              onClick={() => approveMutation.mutate(application.id)}
                              loading={approveMutation.isPending && approveMutation.variables === application.id}
                              className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={XCircle}
                              onClick={() => rejectMutation.mutate(application.id)}
                              loading={rejectMutation.isPending && rejectMutation.variables === application.id}
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {application.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Mail}
                            onClick={() => sendEmailNotification(application, 'approval')}
                            className="text-indigo-600"
                          >
                            Resend Invite
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm 
                          ? 'No applications match your search criteria' 
                          : `No ${statusFilter !== 'all' ? statusFilter : ''} applications found`}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Application Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <Filter className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications?.filter(a => a.status === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications?.filter(a => a.status === 'approved').length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications?.filter(a => a.status === 'rejected').length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;