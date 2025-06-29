import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Check, X, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getTrustMetrics } from '../api/trust';

const Trust: React.FC = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const { data: trustData, isLoading } = useQuery({
    queryKey: ['trust-metrics'],
    queryFn: getTrustMetrics,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const trustScore = trustData?.overallScore || 85;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const securityChecks = [
    { 
      label: 'Two-Factor Authentication', 
      status: trustData?.twoFactorEnabled || false,
      description: 'Additional security layer for your account'
    },
    { 
      label: 'Data Encryption', 
      status: true,
      description: 'All data encrypted in transit and at rest'
    },
    { 
      label: 'Regular Backups', 
      status: trustData?.backupsEnabled || true,
      description: 'Automated daily backups of your data'
    },
    { 
      label: 'Privacy Controls', 
      status: trustData?.privacyControlsEnabled || true,
      description: 'Granular control over data sharing'
    },
    { 
      label: 'Audit Logging', 
      status: trustData?.auditLoggingEnabled || true,
      description: 'Complete log of data access and changes'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trust & Privacy</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your data privacy, security settings, and trust relationships.
        </p>
      </div>

      {/* Trust Score Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Trust Score
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your overall data security and privacy rating
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(trustScore)}`}>
              {trustScore}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              out of 100
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 max-w-md mx-auto">
              <div 
                className={`h-2 rounded-full ${trustScore >= 80 ? 'bg-green-600' : trustScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                style={{ width: `${trustScore}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {trustData?.securityFeatures || 5}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Security Features Active
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {trustData?.privacyControls || 8}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Privacy Controls Enabled
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {trustData?.auditEvents || 127}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Security Events Logged
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Checklist */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security Checklist
          </h3>
          <div className="space-y-4">
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`p-1 rounded-full ${check.status ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  {check.status ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {check.label}
                    </h4>
                    <span className={`text-sm font-medium ${check.status ? 'text-green-600' : 'text-red-600'}`}>
                      {check.status ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {check.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Privacy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Visibility
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Contact Information
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Who can see your contact details
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                >
                  {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Network Connections
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visibility of your professional network
                  </p>
                </div>
                <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                  <option>Private</option>
                  <option>Connections Only</option>
                  <option>Public</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Activity Status
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Show when you're active on the platform
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data Management
            </h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Request Data Deletion
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Security Issue
              </Button>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Data Retention
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your data is retained according to our privacy policy. 
                  Inactive accounts are automatically cleaned up after 2 years.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Information */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compliance & Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white">GDPR</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Compliant</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white">SOC 2</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Type II</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white">ISO 27001</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Certified</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white">CCPA</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Compliant</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Trust;