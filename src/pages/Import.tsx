import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import Papa from 'papaparse';
import Card from '../components/Card';
import Button from '../components/Button';

interface ImportResult {
  success: number;
  errors: string[];
  data: any[];
}

const Import: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          // Validate and process the CSV data
          const validContacts = [];
          const errors = [];

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

            validContacts.push({
              id: `imported-${Date.now()}-${index}`,
              name: row.name,
              email: row.email,
              phone: row.phone || '',
              company: row.company || '',
              title: row.title || '',
              location: row.location || '',
              notes: row.notes || '',
              tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
              lastContact: null,
            });
          });

          // Store in localStorage (simulating API call)
          const existingContacts = JSON.parse(localStorage.getItem('rhiz-contacts') || '[]');
          const updatedContacts = [...existingContacts, ...validContacts];
          localStorage.setItem('rhiz-contacts', JSON.stringify(updatedContacts));

          setResult({
            success: validContacts.length,
            errors,
            data: validContacts,
          });
        } catch (error) {
          setResult({
            success: 0,
            errors: ['Failed to process file. Please check the format and try again.'],
            data: [],
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
        });
        setImporting(false);
      }
    });
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,phone,company,title,location,tags,notes\n' +
      'John Doe,john@example.com,+1-555-0123,Acme Corp,Software Engineer,San Francisco CA,"tech,startup",Met at conference\n' +
      'Jane Smith,jane@example.com,+1-555-0124,Tech Inc,Product Manager,New York NY,"product,saas",LinkedIn connection';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Import Contacts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Upload a CSV file to bulk import your contacts into Rhiz.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload CSV File
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
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
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={importing}
              />
              <label htmlFor="file-upload">
                <Button
                  as="span"
                  variant="outline"
                  loading={importing}
                  className="cursor-pointer"
                >
                  {importing ? 'Processing...' : 'Choose File'}
                </Button>
              </label>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Supported format: CSV file with the following columns:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>name</strong> (required)</li>
                <li><strong>email</strong> (required)</li>
                <li>phone, company, title, location, tags, notes (optional)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Template Section */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CSV Template
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Download our CSV template to ensure your data is formatted correctly.
              </p>
              
              <Button
                variant="outline"
                icon={FileText}
                onClick={downloadTemplate}
                className="w-full"
              >
                Download Template
              </Button>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Template Preview:
                </h4>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400 overflow-x-auto">
                  <div>name,email,phone,company,title...</div>
                  <div>John Doe,john@example.com,+1-555-0123...</div>
                  <div>Jane Smith,jane@example.com,+1-555-0124...</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results Section */}
      {result && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Import Results
            </h2>
            
            <div className="space-y-4">
              {result.success > 0 && (
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Successfully imported {result.success} contacts
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your contacts have been added to your network.
                    </p>
                  </div>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Import completed with {result.errors.length} warnings:
                      </p>
                      <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
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
    </div>
  );
};

export default Import;