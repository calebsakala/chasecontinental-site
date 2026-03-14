import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { signupId, day, email, name } = await req.json();

    // Placeholder: In production, integrate with an email service (e.g., Resend, SendGrid)
    // This function logs the email intent and could be extended to send real emails.

    const emailTemplates: Record<number, { subject: string; body: string }> = {
      0: {
        subject: "Welcome to the 5-Day Automation Pilot Challenge!",
        body: `Hi ${name},\n\nWelcome to the challenge! Here's what to expect:\n\n• Day 1: Pick the workflow\n• Day 2: Map the real steps\n• Day 3: Define exceptions + approvals\n• Day 4: Define success metrics\n• Day 5: Rollout plan + next steps\n\nTomorrow you'll get your Day 1 task. Reply with any questions!\n\n— Chase Continental`,
      },
      1: {
        subject: "Day 1: Pick Your Workflow",
        body: `Hi ${name},\n\nToday's task: Identify repetitive, high-volume, rule-based tasks in your organization.\n\nLook for:\n• Invoice processing\n• Data entry\n• Report generation\n• Any process with bottlenecks or manual errors\n\nReply with the workflow you picked!\n\n— Chase Continental`,
      },
      2: {
        subject: "Day 2: Map the Real Steps",
        body: `Hi ${name},\n\nToday's task: Document the current process step by step.\n\nUse flowcharts or simple lists. Involve team members for accuracy.\n\nReply with your map summary!\n\n— Chase Continental`,
      },
      3: {
        subject: "Day 3: Define Exceptions + Approvals",
        body: `Hi ${name},\n\nToday's task: Identify potential exceptions and define approval workflows.\n\nThink about:\n• Unusual cases\n• Error scenarios\n• Who needs to approve what\n\nReply with your examples!\n\n— Chase Continental`,
      },
      4: {
        subject: "Day 4: Define Success Metrics",
        body: `Hi ${name},\n\nToday's task: Set measurable KPIs.\n\n• Time saved (cycle time reduction)\n• Error reduction rate\n• Cost savings\n• Productivity increase\n\nReply with your KPIs!\n\n— Chase Continental`,
      },
      5: {
        subject: "Day 5: Rollout Plan + Next Steps",
        body: `Hi ${name},\n\nFinal day! Create your rollout plan:\n\n1. Start with a small group\n2. Gather feedback\n3. Scale up\n4. Include training\n\nReady for expert help? Reply to book a strategy call!\n\n— Chase Continental`,
      },
    };

    const template = emailTemplates[day] || emailTemplates[0];

    console.log(`[CHALLENGE EMAIL] To: ${email}, Day: ${day}, Subject: ${template.subject}`);
    console.log(`[CHALLENGE EMAIL] Body: ${template.body}`);

    // In production: send email via service here
    // await sendEmail({ to: email, subject: template.subject, body: template.body });

    return new Response(
      JSON.stringify({ success: true, day, email, subject: template.subject }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
