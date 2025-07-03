import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type AppleContact = {
  firstName?: string;
  lastName?: string;
  phoneNumbers?: PhoneNumber[];
  emailAddresses?: EmailAddress[];
  organization?: string;
  jobTitle?: string;
  notes?: string;
};

type PhoneNumber = {
  label: string;
  value: string;
};

type EmailAddress = {
  label: string;
  value: string;
};

type RhizContact = {
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  company: string;
  title: string;
  notes: string;
  tags: string[];
  source: string;
  healthScore: number;
  relationship_strength: string;
  enriched: boolean;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contacts } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get user session
    const { data: { session } } = await supabaseClient.auth.getSession()
    if (!session) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authentication required',
          imported: 0,
          duplicates: 0,
          errors: ['Please log in to import contacts']
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userId = session.user.id
    const errors: string[] = []
    const validContacts: RhizContact[] = []

    // Process and validate contacts
    for (let i = 0; i < contacts.length; i++) {
      const contact: AppleContact = contacts[i]
      
      // Basic validation
      if (!contact.firstName && !contact.lastName) {
        errors.push(`Contact ${i + 1}: Must have at least a first or last name`)
        continue
      }

      if (!contact.phoneNumbers?.length && !contact.emailAddresses?.length) {
        errors.push(`Contact ${i + 1}: Must have at least a phone number or email`)
        continue
      }

      // Map Apple contact to Rhiz format
      const name = [contact.firstName, contact.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()

      const phone = contact.phoneNumbers?.find((p: PhoneNumber) => 
        p.label.toLowerCase().includes('mobile') || 
        p.label.toLowerCase().includes('iphone')
      )?.value || 
      contact.phoneNumbers?.find((p: PhoneNumber) => 
        p.label.toLowerCase().includes('work')
      )?.value ||
      contact.phoneNumbers?.[0]?.value

      const email = contact.emailAddresses?.find((e: EmailAddress) => 
        e.label.toLowerCase().includes('work')
      )?.value ||
      contact.emailAddresses?.[0]?.value

      const mappedContact: RhizContact = {
        user_id: userId,
        name,
        email,
        phone,
        company: contact.organization || '',
        title: contact.jobTitle || '',
        notes: contact.notes || '',
        tags: ['ios-import'],
        source: 'ios-shortcuts',
        healthScore: 75,
        relationship_strength: 'medium',
        enriched: false
      }

      validContacts.push(mappedContact)
    }

    if (validContacts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No valid contacts found',
          imported: 0,
          duplicates: 0,
          errors: errors.length > 0 ? errors : ['No contacts could be imported']
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check for duplicates and insert unique contacts
    let duplicates = 0
    const uniqueContacts: RhizContact[] = []

    for (const contact of validContacts) {
      // Check for existing contacts with same email or phone
      let query = supabaseClient
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

    if (uniqueContacts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `All ${duplicates} contacts were duplicates`,
          imported: 0,
          duplicates,
          errors,
          contactIds: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert unique contacts
    const { data: insertedContacts, error: insertError } = await supabaseClient
      .from('contacts')
      .insert(uniqueContacts)
      .select('id')

    if (insertError) {
      console.error('Error inserting contacts:', insertError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to save contacts to database',
          imported: 0,
          duplicates,
          errors: [...errors, 'Database error occurred'],
          contactIds: []
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const contactIds = insertedContacts?.map((c: { id: string }) => c.id) || []

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${uniqueContacts.length} contacts${duplicates > 0 ? ` (${duplicates} duplicates skipped)` : ''}`,
        imported: uniqueContacts.length,
        duplicates,
        errors,
        contactIds
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('iOS import error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Import failed - please try again',
        imported: 0,
        duplicates: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        contactIds: []
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 