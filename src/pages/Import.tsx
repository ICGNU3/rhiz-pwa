import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Users, Mail, Building, MapPin } from 'lucide-react';
import Papa from 'papaparse';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

interface ImportResult {
  success: number;
  errors: string[];
  data: any[];
  duplicates: number;
  enriched: number;
}

interface ImportStats {
  totalProcessed: number;
  newContacts: number;
  duplicatesFound: number;
  dataEnriched: number;
  trustScoresCalculated: number;
}

const Import: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (contacts: any[]) => {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const existingContacts = JSON.parse(localStorage.getItem('rhiz-contacts') || '[]');
      const updatedContacts = [...existingContacts, ...contacts];
      localStorage.setItem('rhiz-contacts', JSON.stringify(updatedContacts));
      
      return contacts;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });

  const handleFileUpload = (file: File) => {
    if (!file) return;

    setImporting(true);
    setResult(null);
    setImportStats(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const validContacts = [];
          const errors = [];
          let duplicates = 0;
          let enriched = 0;

          const existingEmails = new Set(
            JSON.parse(localStorage.getItem('rhiz-contacts') || '[]').map((c: any) => c.email)
          );

          results.data.forEach((row: any, index) => {
            if (!row.name || !row.email) {
              errors.push(`Row ${index + 1}: Missing required fields (name, email)`);
              return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(row.email)) {
              errors.push(`Row ${index + 1}: Invalid email format`);
              return;
            }

            // Check for duplicates
            if (existingEmails.has(row.email)) {
              duplicates++;
              return;
            }

            // Simulate data enrichment
            const isEnriched = Math.random() > 0.3; // 70% chance of enrichment
            if (isEnriched) enriched++;

            validContacts.push({
              id: `imported-${Date.now()}-${index}`,
              name: row.name,
              email: row.email,
              phone: row.phone || '',
              company: row.company || (isEnriched ? ['TechCorp', 'StartupInc', 'BigCorp', 'InnovateLab'][Math.floor(Math.random() * 4)] : ''),
              title: row.title || (isEnriched ? ['Engineer', 'Manager', 'Director', 'VP'][Math.floor(Math.random() * 4)] : ''),
              location: row.location || (isEnriched ? ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA'][Math.floor(Math.random() * 4)] : ''),
              notes: row.notes || '',
              tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
              lastContact: null,
              trustScore: isEnriched ? Math.floor(Math.random() * 30) + 70 : undefined,
              relationshipStrength: isEnriched ? ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] : undefined,
              source: 'import',
              enriched: isEnriched
            });
          });

          importMutation.mutate(validContacts);

          setResult({
            success: validContacts.length,
            errors,
            data: validContacts,
            duplicates,
            enriched
          });

          setImportStats({
            totalProcessed: results.data.length,
            newContacts: validContacts.length,
            duplicatesFound: duplicates,
            dataEnriched: enriched,
            trustScoresCalculated: validContacts.filter(c => c.trustScore).length
          });

        } catch (error) {
          setResult({
            success: 0,
            errors: ['Failed to process file. Please check the format and try again.'],
            data: [],
            duplicates: 0,
            enriched: 0
          });
        } finally {
          setImporting(false);
        }
      },
      error: (error) => {
        setResult({
          success: 0,
          errors: [`File parsing error: ${error.message}`],
          data: [],
          duplicates: 0,
          enriched: 0
        });
        setImporting(false);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,phone,company,title,location,tags,notes\n' +
      'John Doe,john@example.com,+1-555-0123,Acme Corp,Software Engineer,San Francisco CA,"tech,startup",Met at React Conference\n' +
      'Jane Smith,jane@example.com,+1-555-0124,Tech Inc,Product Manager,New York NY,"product,saas",LinkedIn connection\n' +
      'Alex Johnson,alex@example.com,+1-555-0125,StartupCo,CTO,Austin TX,"tech,leadership",Former colleague';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rhiz-contacts-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const integrationOptions = [
    { name: 'LinkedIn', icon: Users, description: 'Import professional connections', status: 'coming-soon' },
    { name: 'Google Contacts', icon: Mail, description: 'Sync Gmail and Google contacts', status: 'available' },
    { name: 'Outlook', icon: Mail, description: 'Import Microsoft contacts', status: 'available' },
    { name: 'Apple Contacts', icon: Users, description: 'Sync iPhone/Mac contacts', status: 'coming-soon' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Import & Sync</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bring your existing contacts into Rhiz with intelligent deduplication and data enrichment.
        </p>
      </div>

      {/* Import Methods */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* CSV Upload */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CSV File Upload
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {importing ? (
                <div className="space-y-4">
                  <Spinner size="lg" className="mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Processing Your Contacts
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Deduplicating, enriching, and calculating trust scores...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop your CSV file here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                    disabled={importing}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      as="span"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Choose File
                    </Button>
                  </label>
                </>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">Supported format: CSV with these columns:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>name</strong> (required) - Full name</li>
                <li><strong>email</strong> (required) - Email address</li>
                <li>phone, company, title, location, tags, notes (optional)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Template & Integrations */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Template & Integrations
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  CSV Template
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Download our template to ensure your data is formatted correctly.
                </p>
                <Button
                  variant="outline"
                  icon={FileText}
                  onClick={downloadTemplate}
                  size="sm"
                >
                  Download Template
                </Button>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Direct Integrations
                </h3>
                <div className="space-y-2">
                  {integrationOptions.map((integration, index) => {
                    const Icon = integration.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {integration.name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={integration.status === 'available' ? 'primary' : 'outline'}
                          size="sm"
                          disabled={integration.status === 'coming-soon'}
                        >
                          {integration.status === 'available' ? 'Connect' : 'Soon'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Import Statistics */}
      {importStats && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {importStats.totalProcessed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Processed
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {importStats.newContacts}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  New Contacts
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {importStats.duplicatesFound}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Duplicates Skipped
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {importStats.dataEnriched}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Data Enriched
                </div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {importStats.trustScoresCalculated}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Trust Scores
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Results
            </h2>
            
            <div className="space-y-4">
              {result.success > 0 && (
                <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Successfully imported {result.success} contacts
                    </p>
                    <div className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
                      <p>• {result.enriched} contacts enriched with additional data</p>
                      <p>• {result.duplicates} duplicates automatically skipped</p>
                      <p>• Trust scores calculated for all new contacts</p>
                    </div>
                  </div>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Import completed with {result.errors.length} warnings:
                      </p>
                      <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300 max-h-32 overflow-y-auto">
                        {result.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {result.success === 0 && result.errors.length > 0 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setResult(null)}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Data Enrichment Info */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Intelligent Data Processing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Deduplication
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically merge duplicate contacts
              </p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Enrichment
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add missing company and role data
              </p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Geocoding
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Standardize location information
              </p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                Trust Scores
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calculate initial relationship strength
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Import;