import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');

async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

serve(async (req) => {
  if (req.method === 'POST') {
    const update = await req.json();
    const message = update.message;
    if (message && message.text && message.text.startsWith('/start')) {
      const telegramUserId = message.from.id;
      const telegramUsername = message.from.username;
      const chatId = message.chat.id;
      const parts = message.text.split(' ');
      const code = parts.length > 1 ? parts[1] : null;
      if (!code) {
        await sendTelegramMessage(chatId, 'Please use the code provided in your Rhiz account to link your Telegram.');
        return new Response('ok', { status: 200 });
      }
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );
      // Look up the code
      const { data: linkCode, error } = await supabaseClient
        .from('telegram_link_codes')
        .select('*')
        .eq('code', code)
        .single();
      if (error || !linkCode) {
        await sendTelegramMessage(chatId, 'Invalid or expired code. Please try again from your Rhiz account.');
        return new Response('ok', { status: 200 });
      }
      if (linkCode.used || new Date(linkCode.expires_at) < new Date()) {
        await sendTelegramMessage(chatId, 'This code has already been used or expired. Please generate a new one from your Rhiz account.');
        return new Response('ok', { status: 200 });
      }
      // Link Telegram user to Rhiz user
      await supabaseClient
        .from('user_integrations')
        .upsert({
          user_id: linkCode.user_id,
          provider: 'telegram',
          access_token: telegramUserId.toString(),
          user_info: { username: telegramUsername },
        });
      // Mark code as used
      await supabaseClient
        .from('telegram_link_codes')
        .update({
          used: true,
          telegram_user_id: telegramUserId.toString(),
          telegram_username: telegramUsername,
          used_at: new Date().toISOString()
        })
        .eq('id', linkCode.id);
      // Confirmation
      await sendTelegramMessage(chatId, '✅ Your Telegram is now linked to your Rhiz account! You can now receive relationship insights and sync your network.');
    }
    return new Response('ok', { status: 200 });
  }

  return new Response('Not found', { status: 404 });
}); 