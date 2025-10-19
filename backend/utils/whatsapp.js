const axios = require('axios');
const LIVE = process.env.LIVE_NOTIFICATIONS === 'true' || process.env.LIVE_NOTIFICATIONS === '1';

async function sendWhatsApp(phone, text, apikey) {
  if (!phone || !apikey) {
    console.log('[WhatsApp] missing phone or apikey, skipping:', phone);
    return;
  }
  const url = `https://api.callmebot.com/whatsapp.php`;
  const params = { phone, text, apikey };
  const qs = Object.keys(params).map(k=>`${k}=${encodeURIComponent(params[k])}`).join('&');
  const full = url + '?' + qs;
  if (!LIVE) {
    console.log('[MockWhatsApp] ', full);
    return;
  }
  try {
    await axios.get(full, { timeout: 10000, validateStatus: ()=>true });
    console.log('[WhatsApp] sent to', phone);
  } catch (err) {
    console.error('[WhatsApp] error', err.message);
  }
}

module.exports = { sendWhatsApp };
