import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { ids, mergedFields } = await req.json();
    if (!Array.isArray(ids) || ids.length < 2) {
      return new Response(JSON.stringify({ error: 'At least two contact IDs required' }), { status: 400 });
    }
    if (!mergedFields || typeof mergedFields !== 'object') {
      return new Response(JSON.stringify({ error: 'Missing mergedFields' }), { status: 400 });
    }

    // Get env vars
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const [survivorId, ...duplicateIds] = ids;

    // 1. Update the surviving contact
    const { error: updateError } = await supabase
      .from('contacts')
      .update(mergedFields)
      .eq('id', survivorId);
    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update surviving contact', details: updateError.message }), { status: 500 });
    }

    // 2. Update references in related tables (example: user_activities, goals, messages)
    // Add more tables as needed
    const relatedTables = [
      { table: 'user_activities', field: 'contact_id' },
      { table: 'goals', field: 'contact_id' },
      // Add more as needed
    ];
    for (const { table, field } of relatedTables) {
      const { error: refError } = await supabase
        .from(table)
        .update({ [field]: survivorId })
        .in(field, duplicateIds);
      if (refError) {
        return new Response(JSON.stringify({ error: `Failed to update references in ${table}`, details: refError.message }), { status: 500 });
      }
    }

    // 3. Delete the duplicate contacts
    const { error: deleteError } = await supabase
      .from('contacts')
      .delete()
      .in('id', duplicateIds);
    if (deleteError) {
      return new Response(JSON.stringify({ error: 'Failed to delete duplicate contacts', details: deleteError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: `Merged contacts: ${ids.join(', ')}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500 });
  }
}); 