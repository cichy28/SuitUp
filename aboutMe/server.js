const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const port = 3000;

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_6f1duY9j_F3pMrjFAHsM37koCCMxB4nGM';
const CONTACT_TO = 'j.i.cichosz@gmail.com';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: CONTACT_TO,
      reply_to: email,
      subject: `Zapytanie JCIT – ${name}`,
      html: `
        <h2 style="font-family:sans-serif;color:#111">Nowe zapytanie z jsit.pl</h2>
        <table style="font-family:sans-serif;font-size:15px;color:#333;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#888">Nadawca</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <hr style="border:1px solid #eee;margin:16px 0">
        <p style="font-family:sans-serif;font-size:15px;color:#333;white-space:pre-wrap">${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ ok: false, error: 'send_failed' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

app.listen(port, () => {
  console.log(`aboutMe server listening on port ${port}`);
});
