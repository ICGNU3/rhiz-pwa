import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { name, email, company } = await req.json();
    if (!name && !email && !company) {
      return new Response(JSON.stringify({ error: 'Missing contact info' }), { status: 400 });
    }

    // Placeholder: In production, call a real web search API (e.g., Bing, SerpAPI, etc.)
    // For now, return a mock enriched profile
    const enriched = {
      linkedin: name ? `https://linkedin.com/in/${name.toLowerCase().replace(/ /g, '-')}` : null,
      company_website: company ? `https://www.${company.toLowerCase().replace(/ /g, '')}.com` : null,
      recent_news: [
        {
          title: `Latest news about ${name || company}`,
          url: 'https://news.example.com/article1',
          summary: `This is a mock news summary for ${name || company}.`
        }
      ],
      public_bio: name ? `Public bio for ${name}.` : null
    };

    return new Response(JSON.stringify({ enriched }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: string }).message === 'string') {
      message = (error as { message: string }).message;
    }
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}); 