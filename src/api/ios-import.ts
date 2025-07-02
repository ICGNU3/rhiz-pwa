import { supabase } from './client'
import type { Contact } from '../types'

export interface AppleContact {
  firstName?: string
  lastName?: string
  organization?: string
  jobTitle?: string
  phoneNumbers?: Array<{ label: string; value: string }>
  emailAddresses?: Array<{ label: string; value: string }>
  notes?: string
  birthday?: string
  urlAddresses?: Array<{ label: string; value: string }>
  addresses?: Array<{ label: string; value: string }>
}

export interface IOSImportRequest {
  contacts: AppleContact[]
  userId?: string
  source: 'ios-shortcuts'
}

export interface IOSImportResponse {
  success: boolean
  imported: number
  duplicates: number
  errors: string[]
  contactIds: string[]
  message: string
}

// Map Apple contact fields to Rhiz format
function mapAppleContactToRhiz(appleContact: AppleContact): Partial<Contact> {
  const name = [appleContact.firstName, appleContact.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()

  // Get primary phone (prefer mobile, then work, then first available)
  const phone = appleContact.phoneNumbers?.find(p => 
    p.label.toLowerCase().includes('mobile') || 
    p.label.toLowerCase().includes('iphone')
  )?.value || 
  appleContact.phoneNumbers?.find(p => 
    p.label.toLowerCase().includes('work')
  )?.value ||
  appleContact.phoneNumbers?.[0]?.value

  // Get primary email (prefer work, then first available)
  const email = appleContact.emailAddresses?.find(e => 
    e.label.toLowerCase().includes('work')
  )?.value ||
  appleContact.emailAddresses?.[0]?.value

  return {
    name,
    email,
    phone,
    company: appleContact.organization || '',
    title: appleContact.jobTitle || '',
    notes: appleContact.notes || '',
    tags: ['ios-import'],
    source: 'ios-shortcuts',
    healthScore: 75, // Default score for imported contacts
    relationship_strength: 'medium' as const,
    enriched: false
  }
}

// Validate Apple contact data
function validateAppleContact(contact: AppleContact): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!contact.firstName && !contact.lastName) {
    errors.push('Contact must have at least a first or last name')
  }
  
  if (!contact.phoneNumbers?.length && !contact.emailAddresses?.length) {
    errors.push('Contact must have at least a phone number or email')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Check for duplicate contacts
async function checkDuplicates(contacts: Partial<Contact>[], userId: string): Promise<{ duplicates: number; uniqueContacts: Partial<Contact>[] }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { duplicates: 0, uniqueContacts: contacts }
  }

  const uniqueContacts: Partial<Contact>[] = []
  let duplicates = 0

  for (const contact of contacts) {
    if (!contact.email && !contact.phone) {
      uniqueContacts.push(contact)
      continue
    }

    // Check for existing contacts with same email or phone
    let query = supabase
      .from('contacts')
      .select('id')
      .eq('user_id', userId)
    
    if (contact.email && contact.phone) {
      query = query.or(`email.eq.${contact.email},phone.eq.${contact.phone}`)
    } else if (contact.email) {
      query = query.eq('email', contact.email)
    } else if (contact.phone) {
      query = query.eq('phone', contact.phone)
    }
    
    const { data: existing } = await query.limit(1)

    if (existing && existing.length > 0) {
      duplicates++
    } else {
      uniqueContacts.push(contact)
    }
  }

  return { duplicates, uniqueContacts }
}

export const iosImportApi = {
  async importContacts(request: IOSImportRequest): Promise<IOSImportResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return {
          success: false,
          imported: 0,
          duplicates: 0,
          errors: ['Authentication required'],
          contactIds: [],
          message: 'Please log in to import contacts'
        }
      }

      const userId = session.user.id
      const errors: string[] = []
      const validContacts: Partial<Contact>[] = []

      // Validate and map all contacts
      for (let i = 0; i < request.contacts.length; i++) {
        const contact = request.contacts[i]
        const validation = validateAppleContact(contact)
        
        if (!validation.valid) {
          errors.push(`Contact ${i + 1}: ${validation.errors.join(', ')}`)
          continue
        }

        const mappedContact = mapAppleContactToRhiz(contact)
        if (mappedContact.name) {
          validContacts.push({
            ...mappedContact,
            user_id: userId
          })
        }
      }

      if (validContacts.length === 0) {
        return {
          success: false,
          imported: 0,
          duplicates: 0,
          errors: errors.length > 0 ? errors : ['No valid contacts found'],
          contactIds: [],
          message: 'No contacts could be imported'
        }
      }

      // Check for duplicates
      const { duplicates, uniqueContacts } = await checkDuplicates(validContacts, userId)

      if (uniqueContacts.length === 0) {
        return {
          success: true,
          imported: 0,
          duplicates,
          errors,
          contactIds: [],
          message: `All ${duplicates} contacts were duplicates`
        }
      }

      // Insert unique contacts
      const { data: insertedContacts, error: insertError } = await supabase
        .from('contacts')
        .insert(uniqueContacts)
        .select('id')

      if (insertError) {
        console.error('Error inserting contacts:', insertError)
        return {
          success: false,
          imported: 0,
          duplicates,
          errors: [...errors, 'Failed to save contacts to database'],
          contactIds: [],
          message: 'Import failed - please try again'
        }
      }

      const contactIds = insertedContacts?.map(c => c.id) || []

      return {
        success: true,
        imported: uniqueContacts.length,
        duplicates,
        errors,
        contactIds,
        message: `Successfully imported ${uniqueContacts.length} contacts${duplicates > 0 ? ` (${duplicates} duplicates skipped)` : ''}`
      }

    } catch (error) {
      console.error('iOS import error:', error)
      return {
        success: false,
        imported: 0,
        duplicates: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        contactIds: [],
        message: 'Import failed - please try again'
      }
    }
  },

  // Helper method to convert CSV data from shortcuts to Apple contact format
  parseShortcutsCSV(csvData: string): AppleContact[] {
    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const contacts: AppleContact[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const contact: AppleContact = {}

      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        switch (header.toLowerCase()) {
          case 'first name':
            contact.firstName = value
            break
          case 'last name':
            contact.lastName = value
            break
          case 'organization':
          case 'company':
            contact.organization = value
            break
          case 'job title':
          case 'title':
            contact.jobTitle = value
            break
          case 'phone':
          case 'mobile':
          case 'phone number':
            if (value) {
              contact.phoneNumbers = [{ label: 'mobile', value }]
            }
            break
          case 'email':
          case 'email address':
            if (value) {
              contact.emailAddresses = [{ label: 'work', value }]
            }
            break
          case 'notes':
            contact.notes = value
            break
        }
      })

      if (contact.firstName || contact.lastName) {
        contacts.push(contact)
      }
    }

    return contacts
  }
} 