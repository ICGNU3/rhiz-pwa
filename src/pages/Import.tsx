// Enhanced auto-mapping function for your Import.tsx
// Replace the existing auto-mapping logic in handleFileUpload

const createAutoMapping = (headers: string[]): ColumnMapping => {
  const autoMapping: ColumnMapping = {};
  
  // Comprehensive field patterns for maximum CSV compatibility
  const fieldPatterns = {
    name: [
      'name', 'full_name', 'fullname', 'full name', 'contact_name', 'contact name',
      'first_name', 'firstname', 'first name', 'given_name', 'given name',
      'person', 'individual', 'display_name', 'display name', 'title_name'
    ],
    
    email: [
      'email', 'e_mail', 'e-mail', 'e mail', 'email_address', 'email address',
      'mail', 'primary_email', 'primary email', 'work_email', 'work email',
      'business_email', 'business email', 'contact_email', 'contact email'
    ],
    
    phone: [
      'phone', 'phone_number', 'phone number', 'mobile', 'mobile_number', 'mobile number',
      'cell', 'cellphone', 'cell_phone', 'cell phone', 'telephone', 'tel',
      'work_phone', 'work phone', 'business_phone', 'business phone',
      'primary_phone', 'primary phone', 'contact_number', 'contact number'
    ],
    
    company: [
      'company', 'organization', 'org', 'employer', 'workplace', 'business',
      'company_name', 'company name', 'organization_name', 'organization name',
      'corp', 'corporation', 'firm', 'agency', 'institution', 'enterprise',
      'work', 'current_company', 'current company', 'employer_name'
    ],
    
    title: [
      'title', 'job_title', 'job title', 'position', 'role', 'job_role', 'job role',
      'designation', 'job_position', 'job position', 'work_title', 'work title',
      'professional_title', 'professional title', 'current_title', 'current title',
      'job', 'occupation', 'function', 'responsibility', 'department_title'
    ],
    
    location: [
      'location', 'address', 'city', 'region', 'country', 'state', 'province',
      'geographic_location', 'geographic location', 'place', 'area', 'locale',
      'current_location', 'current location', 'work_location', 'work location',
      'home_address', 'home address', 'business_address', 'business address',
      'mailing_address', 'mailing address', 'street_address', 'zip', 'postal'
    ],
    
    tags: [
      'tags', 'tag', 'categories', 'category', 'skills', 'skill', 'keywords', 'keyword',
      'interests', 'interest', 'specialties', 'specialty', 'expertise', 'labels', 'label',
      'groups', 'group', 'segments', 'segment', 'types', 'type', 'classifications'
    ],
    
    notes: [
      'notes', 'note', 'comments', 'comment', 'description', 'details', 'remarks',
      'observations', 'memo', 'summary', 'about', 'bio', 'biography', 'profile',
      'additional_info', 'additional info', 'extra_info', 'extra info', 'misc',
      'miscellaneous', 'other', 'background', 'context', 'relationship_notes'
    ]
  };

  // Score-based matching for best field assignment
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    let bestMatch = '';
    let bestScore = 0;

    // Check each field type
    Object.entries(fieldPatterns).forEach(([fieldType, patterns]) => {
      patterns.forEach(pattern => {
        const normalizedPattern = pattern.toLowerCase();
        
        let score = 0;
        
        // Exact match gets highest score
        if (normalizedHeader === normalizedPattern) {
          score = 1000;
        }
        // Contains the full pattern
        else if (normalizedHeader.includes(normalizedPattern)) {
          score = 500 + normalizedPattern.length; // Longer patterns score higher
        }
        // Pattern contains the header (for abbreviations)
        else if (normalizedPattern.includes(normalizedHeader) && normalizedHeader.length >= 3) {
          score = 300 + normalizedHeader.length;
        }
        // Starts with pattern
        else if (normalizedHeader.startsWith(normalizedPattern)) {
          score = 400;
        }
        // Ends with pattern
        else if (normalizedHeader.endsWith(normalizedPattern)) {
          score = 350;
        }
        
        // Bonus for common prefixes/suffixes
        if (normalizedHeader.includes('work_') || normalizedHeader.includes('business_')) {
          score += 50;
        }
        if (normalizedHeader.includes('_primary') || normalizedHeader.includes('main_')) {
          score += 30;
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = fieldType;
        }
      });
    });

    // Only assign if we have a confident match
    if (bestScore > 100) {
      autoMapping[header] = bestMatch;
    }
  });

  // Handle common edge cases and combinations
  headers.forEach(header => {
    const lower = header.toLowerCase();
    
    // Combined name fields
    if ((lower.includes('first') && lower.includes('last')) || 
        (lower.includes('given') && lower.includes('family'))) {
      autoMapping[header] = 'name';
    }
    
    // LinkedIn specific fields
    if (lower.includes('linkedin')) {
      if (lower.includes('url') || lower.includes('profile')) {
        // Could add linkedin field in the future
      }
    }
    
    // Social media handles
    if (lower.includes('twitter') || lower.includes('instagram') || lower.includes('facebook')) {
      autoMapping[header] = 'tags'; // Store social handles as tags for now
    }
    
    // Date fields (might be useful for relationship tracking)
    if (lower.includes('date') || lower.includes('time') || lower.includes('created') || lower.includes('updated')) {
      // Skip date fields for now, but could be used for relationship history
    }
  });

  return autoMapping;
};

// Also add this helper function to detect and suggest missing required fields
const detectMissingFields = (mapping: ColumnMapping, headers: string[]): string[] => {
  const requiredFields = ['name', 'email'];
  const mappedFields = Object.values(mapping);
  const missing = requiredFields.filter(field => !mappedFields.includes(field));
  
  const suggestions: string[] = [];
  
  if (missing.includes('name') && !mappedFields.includes('name')) {
    const nameish = headers.find(h => 
      h.toLowerCase().includes('contact') || 
      h.toLowerCase().includes('person') ||
      h.toLowerCase().includes('individual')
    );
    if (nameish) {
      suggestions.push(`Consider mapping "${nameish}" to Name field`);
    }
  }
  
  if (missing.includes('email') && !mappedFields.includes('email')) {
    const emailish = headers.find(h => 
      h.toLowerCase().includes('@') || 
      h.toLowerCase().includes('contact') ||
      h.toLowerCase().includes('primary')
    );
    if (emailish) {
      suggestions.push(`Consider mapping "${emailish}" to Email field`);
    }
  }
  
  return suggestions;
};

// Enhanced validation function
const validateCsvData = (data: ParsedContact[], mapping: ColumnMapping): { errors: string[], warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const nameColumn = Object.keys(mapping).find(key => mapping[key] === 'name');
  const emailColumn = Object.keys(mapping).find(key => mapping[key] === 'email');
  
  data.forEach((row, index) => {
    const rowNum = index + 1;
    
    // Required field validation
    if (!nameColumn || !row[nameColumn]?.trim()) {
      errors.push(`Row ${rowNum}: Missing required name field`);
    }
    
    if (!emailColumn || !row[emailColumn]?.trim()) {
      errors.push(`Row ${rowNum}: Missing required email field`);
    } else {
      // Email format validation
      const email = row[emailColumn].trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push(`Row ${rowNum}: Invalid email format: ${email}`);
      }
    }
    
    // Warnings for potentially incomplete data
    const companyColumn = Object.keys(mapping).find(key => mapping[key] === 'company');
    if (!companyColumn || !row[companyColumn]?.trim()) {
      warnings.push(`Row ${rowNum}: Missing company information`);
    }
    
    const titleColumn = Object.keys(mapping).find(key => mapping[key] === 'title');
    if (!titleColumn || !row[titleColumn]?.trim()) {
      warnings.push(`Row ${rowNum}: Missing job title`);
    }
  });
  
  return { errors: errors.slice(0, 10), warnings: warnings.slice(0, 5) }; // Limit to prevent UI overflow
};