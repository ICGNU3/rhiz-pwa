import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailPayload {
  email: string;
  name: string;
  type: 'confirmation' | 'approval' | 'rejection';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if user is admin for approval/rejection emails
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { email, name, type }: EmailPayload = await req.json();

    if (!email || !name || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if user is admin for approval/rejection emails
    if (type !== 'confirmation') {
      const { data: userData, error: userDataError } = await supabaseClient
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (userDataError || !userData?.is_admin) {
        return new Response(
          JSON.stringify({ error: 'Not authorized to send this type of email' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // In a real implementation, you would use a service like Resend or SendGrid
    // For now, we'll just simulate sending an email
    console.log(`Sending ${type} email to ${email}`);

    // Simulate email templates
    let emailSubject = '';
    let emailBody = '';

    switch (type) {
      case 'confirmation':
        emailSubject = 'Your Rhiz Alpha Application Has Been Received';
        emailBody = `
          <p>Hi ${name},</p>
          <p>Thank you for applying to join the Rhiz alpha program. We've received your application and it is now under review.</p>
          <p>Only 100 Root Members will shape Rhiz's future, and we're carefully reviewing each application to ensure a diverse and engaged community.</p>
          <p>We'll notify you as soon as a decision has been made.</p>
          <p>Best regards,<br>The Rhiz Team</p>
        `;
        break;
      case 'approval':
        emailSubject = 'Welcome to the Rhiz Alpha!';
        emailBody = `
          <p>Hi ${name},</p>
          <p>We're excited to let you know that your application to join the Rhiz alpha program has been approved!</p>
          <p>You're now part of an exclusive group of Root Members who will shape the future of Rhiz.</p>
          <p>You can now sign in to your account at <a href="https://rhiz.app/login">https://rhiz.app/login</a> using this email address.</p>
          <p>We can't wait to see how you'll use Rhiz to strengthen your meaningful connections and grow your circle of trust.</p>
          <p>Best regards,<br>The Rhiz Team</p>
        `;
        break;
      case 'rejection':
        emailSubject = 'Update on Your Rhiz Alpha Application';
        emailBody = `
          <p>Hi ${name},</p>
          <p>Thank you for your interest in joining the Rhiz alpha program.</p>
          <p>After careful consideration, we regret to inform you that we're unable to include you in our alpha at this time. We received an overwhelming number of applications and had to make some difficult decisions.</p>
          <p>We'll keep your application on file for future opportunities, and we encourage you to stay connected with us for updates on our public launch.</p>
          <p>Best regards,<br>The Rhiz Team</p>
        `;
        break;
    }

    // In a real implementation, you would send the email here
    // For now, we'll just return success
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `${type} email would be sent to ${email}`,
        subject: emailSubject,
        body: emailBody
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-application-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});