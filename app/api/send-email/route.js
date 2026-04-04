import { Resend } from 'resend';

export async function POST(req) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { to, subject, html } = await req.json();

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}