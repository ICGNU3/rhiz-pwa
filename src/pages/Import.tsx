import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Users, Mail, Building, MapPin, ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import Papa from 'papaparse';
import Card from '../components/Card';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ContactForm from '../components/contacts/ContactForm';
import ContactSearch from '../components/contacts/ContactSearch';
import { createContact } from '../api/contacts';

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

interface ParsedContact {
  [key: string]: string;
}

interface ColumnMapping {
  [csvColumn: string]: string;
}

const Import: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedContact[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [importProgress, setImportProgress] = useState(0);
  const [previewContacts, setPreviewContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [file, setFile] = useState<File | null>(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const importMutation = useMutation({
    mutationFn: async (contacts: any[]) => {
      setImporting(true);
      setImportProgress(0);
      
      const results = [];
      const errors = [];
      let duplicates = 0;
      let enriched = 0;

      // Process contacts one by one with progress updates
      for (let i = 0; i < contacts.length; i++) {
        try {
          const contact = contacts[i];
          
          // Simulate AI enrichment
          const isEnriched = Math.random() > 0.3;
          if (isEnriched) enriched++;

          const enhancedContact = {
            ...contact,
            trust_score: isEnriched ? Math.floor(Math.random() * 30) + 70 : undefined,
            engagement_trend: isEnriched ? ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] : undefined,
            relationship_strength: isEnriched ? ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)] : undefined,
            mutual_connections: isEnriched ? Math.floor(Math.random() * 15) + 1 : 0,
            relationship_type: contact.relationship_type || ['colleague', 'friend', 'client', 'partner'][Math.floor(Math.random() * 4)],
            source: 'import',
            enriched: isEnriched
          };

          await createContact(enhancedContact);
          results.push(enhancedContact);
          
          // Update progress
          setImportProgress(Math.round(((i + 1) / contacts.length) * 100));
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Error importing contact:', error);
          errors.push(`Failed to import ${contacts[i].name}: ${error}`);
        }
      }
      
      return { results, errors, duplicates, enriched };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['network-data'] });
      setImporting(false);
      
      setResult({
        success: data.results.length,
        errors: data.errors,
        data: data.results,
        duplicates: data.duplicates,
        enriched: data.enriched
      });

      setImportStats({
        totalProcessed: parsedData.length,
        newContacts: data.results.length,
        duplicatesFound: data.duplicates,
        dataEnriched: data.enriched,
        trustScoresCalculated: data.results.filter(c => c.trust_score).length
      });

      setCurrentStep(4);
    },
    onError: (error) => {
      console.error('Import failed:', error);
      setImporting(false);
    }
  });

  const requiredFields = ['name', 'email', 'company', 'title'];
  const optionalFields = ['phone', 'location', 'tags', 'notes'];
  const allFields = [...requiredFields, ...optionalFields];

  const handleFileUpload = (uploadedFile: File) => {
    if (!uploadedFile) return;

    setFile(uploadedFile);
    
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const headers = Object.keys(results.data[0] || {});
          setCsvHeaders(headers);
          setParsedData(results.data as ParsedContact[]);
          
          // Auto-map columns based on common names
          const autoMapping: ColumnMapping = {};
          headers.forEach(header => {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes('name') || lowerHeader.includes('full')) autoMapping[header] = 'name';
            else if (lowerHeader.includes('email') || lowerHeader.includes('mail')) autoMapping[header] = 'email';
            else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile') || lowerHeader.includes('tel')) autoMapping[header] = 'phone';
            else if (lowerHeader.includes('company') || lowerHeader.includes('organization') || lowerHeader.includes('org')) autoMapping[header] = 'company';
            else if (lowerHeader.includes('title') || lowerHeader.includes('position') || lowerHeader.includes('job') || lowerHeader.includes('role')) autoMapping[header] = 'title';
            else if (lowerHeader.includes('location') || lowerHeader.includes('city') || lowerHeader.includes('address')) autoMapping[header] = 'location';
            else if (lowerHeader.includes('tag') || lowerHeader.includes('category') || lowerHeader.includes('skill')) autoMapping[header] = 'tags';
            else if (lowerHeader.includes('note') || lowerHeader.includes('comment') || lowerHeader.includes('description')) autoMapping[header] = 'notes';
          });
          
          setColumnMapping(autoMapping);
          setCurrentStep(2);
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
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

  const generatePreview = () => {
    const mappedContacts = parsedData.slice(0, 5).map((row, index) => {
      const contact: any = {
        id: `preview-${index}`,
        name: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'name') || ''] || 'Unknown',
        email: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'email') || ''] || '',
        phone: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'phone') || ''] || '',
        company: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'company') || ''] || '',
        title: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'title') || ''] || '',
        location: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'location') || ''] || '',
        notes: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'notes') || ''] || '',
        tags: (row[Object.keys(columnMapping).find(key => columnMapping[key] === 'tags') || ''] || '').split(',').map(tag => tag.trim()).filter(Boolean),
        trust_score: Math.floor(Math.random() * 30) + 70,
        relationship_strength: ['strong', 'medium', 'weak'][Math.floor(Math.random() * 3)],
        mutual_connections: Math.floor(Math.random() * 10) + 1,
        relationship_type: ['colleague', 'friend', 'client'][Math.floor(Math.random() * 3)]
      };
      return contact;
    });
    
    setPreviewContacts(mappedContacts);
    setCurrentStep(3);
  };

  const processImport = () => {
    const validContacts = [];
    const errors = [];

    parsedData.forEach((row, index) => {
      const mappedContact: any = {};
      
      // Map columns to contact fields
      Object.keys(columnMapping).forEach(csvColumn => {
        const fieldName = columnMapping[csvColumn];
        if (fieldName && row[csvColumn]) {
          if (fieldName === 'tags') {
            mappedContact[fieldName] = row[csvColumn].split(',').map(tag => tag.trim()).filter(Boolean);
          } else {
            mappedContact[fieldName] = row[csvColumn];
          }
        }
      });

      // Validation
      if (!mappedContact.name || !mappedContact.email) {
        errors.push(`Row ${index + 1}: Missing required fields (name, email)`);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mappedContact.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
        return;
      }

      validContacts.push(mappedContact);
    });

    if (errors.length > 0) {
      setResult({
        success: 0,
        errors,
        data: [],
        duplicates: 0,
        enriched: 0
      });
      setCurrentStep(4);
      return;
    }

    importMutation.mutate(validContacts);
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

  const resetImport = () => {
    setCurrentStep(1);
    setFile(null);
    setParsedData([]);
    setCsvHeaders([]);
    setColumnMapping({});
    setPreviewContacts([]);
    setResult(null);
    setImportStats(null);
    setImportProgress(0);
  };

  const integrationOptions = [
    { name: 'LinkedIn', icon: Users, description: 'Import professional connections', status: 'coming-soon' },
    { name: 'Google Contacts', icon: Mail, description: 'Sync Gmail and Google contacts', status: 'available' },
    { name: 'Outlook', icon: Mail, description: 'Import Microsoft contacts', status: 'available' },
    { name: 'Apple Contacts', icon: Users, description: 'Sync iPhone/Mac contacts', status: 'coming-soon' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Import & Sync Intelligence
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Intelligent contact import with deduplication, enrichment, and trust scoring
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              icon={FileText}
              onClick={downloadTemplate}
              className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-indigo-50"
            >
              Download Template
            </Button>
            {currentStep > 1 && (
              <Button 
                variant="outline"
                onClick={resetImport}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            {[
              { step: 1, title: 'Upload File', icon: Upload },
              { step: 2, title: 'Map Columns', icon: Building },
              { step: 3, title: 'Preview Data', icon: Users },
              { step: 4, title: 'Import Complete', icon: CheckCircle }
            ].map(({ step, title, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    Step {step}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                  }`}>
                    {title}
                  </p>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Upload CSV File
              </h2>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  Drop your CSV file here
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    as="span"
                    className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Choose File
                  </Button>
                </label>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Supported CSV Format
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-1">Required:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• name</li>
                      <li>• email</li>
                      <li>• company</li>
                      <li>• title</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600 mb-1">Optional:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• phone</li>
                      <li>• location</li>
                      <li>• tags</li>
                      <li>• notes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Integrations
              </h2>
              
              <div className="space-y-4">
                {integrationOptions.map((integration, index) => {
                  const Icon = integration.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {integration.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
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
            </Card>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {currentStep === 2 && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Map CSV Columns to Contact Fields
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {parsedData.length} rows detected
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Column Mapping
                </h3>
                <div className="space-y-4">
                  {csvHeaders.map((header, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {header}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sample: {parsedData[0]?.[header] || 'No data'}
                        </p>
                      </div>
                      <div className="w-40">
                        <select
                          value={columnMapping[header] || ''}
                          onChange={(e) => setColumnMapping(prev => ({
                            ...prev,
                            [header]: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="">Skip Column</option>
                          {allFields.map(field => (
                            <option key={field} value={field}>
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                              {requiredFields.includes(field) && ' *'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Preview Sample Data
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        {csvHeaders.slice(0, 4).map(header => (
                          <th key={header} className="text-left py-2 px-2 font-medium text-gray-900 dark:text-white">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                          {csvHeaders.slice(0, 4).map(header => (
                            <td key={header} className="py-2 px-2 text-gray-600 dark:text-gray-400">
                              {row[header] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => setCurrentStep(1)}
              >
                Back to Upload
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Required fields mapped: {requiredFields.filter(field => 
                    Object.values(columnMapping).includes(field)
                  ).length}/{requiredFields.length}
                </div>
                <Button
                  icon={ArrowRight}
                  onClick={generatePreview}
                  disabled={!requiredFields.every(field => 
                    Object.values(columnMapping).includes(field)
                  )}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Generate Preview
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Preview Data */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Preview Import Data
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing 5 of {parsedData.length} contacts
                </div>
              </div>

              <ContactSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                relationshipFilter={relationshipFilter}
                setRelationshipFilter={setRelationshipFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </Card>

            <div className="grid grid-cols-1 gap-4">
              {previewContacts.map((contact, index) => (
                <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.title} at {contact.company}
                        </p>
                        <p className="text-xs text-gray-500">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.trust_score}
                        </div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.relationship_strength === 'strong' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : contact.relationship_strength === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {contact.relationship_strength}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Import Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {parsedData.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Contacts
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(parsedData.length * 0.7)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Will be Enriched
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {parsedData.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Trust Scores
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    0
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Duplicates
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => setCurrentStep(2)}
              >
                Back to Mapping
              </Button>
              <Button
                icon={Upload}
                onClick={processImport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Import {parsedData.length} Contacts
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Import Progress & Results */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {importing && (
              <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Spinner size="lg" className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Processing Your Contacts
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Deduplicating, enriching, and calculating trust scores...
                </p>
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{importProgress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {result && importStats && (
              <div className="space-y-6">
                <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Import Completed Successfully!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your contacts have been imported and enriched with AI intelligence
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {importStats.newContacts}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        New Contacts
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {importStats.dataEnriched}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Data Enriched
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {importStats.trustScoresCalculated}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Trust Scores
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {importStats.duplicatesFound}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Duplicates Skipped
                      </div>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        {importStats.totalProcessed}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Processed
                      </div>
                    </div>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            Import completed with {result.errors.length} warnings:
                          </p>
                          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300 max-h-32 overflow-y-auto">
                            {result.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {result.errors.length > 5 && (
                              <li>• ... and {result.errors.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={resetImport}
                    >
                      Import More Contacts
                    </Button>
                    <Button
                      icon={Users}
                      onClick={() => navigate('/app/contacts')}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      View All Contacts
                    </Button>
                  </div>
                </Card>

                <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    🎉 Redirecting to your contacts in a few seconds...
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Your new contacts are now part of your intelligent relationship graph
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Import;