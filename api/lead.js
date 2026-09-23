/**
 * Vercel Serverless Function — /api/lead
 * Receives the contact form submission. Serverless functions have no
 * persistent disk, so this forwards each lead to a webhook you control
 * (Zapier, Make, a Google Sheet via Apps Script, your CRM, etc).
 *
 * Set LEADS_WEBHOOK_URL in Vercel → Project → Settings → Environment
 * Variables. Without it, leads are only visible in Vercel's function logs.
 */

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const lead = req.body || {};
  const payload = { ...lead, receivedAt: new Date().toISOString() };

  if (process.env.LEADS_WEBHOOK_URL) {
    try {
      await fetch(process.env.LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Lead webhook error:", err);
    }
  } else {
    console.log("New lead (set LEADS_WEBHOOK_URL to forward these somewhere useful):", payload);
  }

  res.status(200).json({ ok: true });
};
