import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// ============================================================================
// SECTOR CONFIGURATIONS (must match frontend)
// ============================================================================
const SECTOR_NAMES: Record<string, string> = {
  healthcare: 'Healthcare & Life Sciences',
  financial_services: 'Financial Services & Banking',
  manufacturing: 'Manufacturing & Industrial',
  retail: 'Retail & E-commerce',
  logistics: 'Logistics & Supply Chain',
  technology: 'Technology & SaaS',
  bpo: 'BPO & Shared Services',
  legal: 'Legal & Professional Services',
  insurance: 'Insurance',
  energy: 'Energy & Utilities',
  construction: 'Construction & Real Estate',
  cpg: 'CPG & Distribution',
};

const REVENUE_LABELS: Record<string, string> = {
  startup: '$1M - $10M',
  small: '$10M - $50M',
  medium: '$50M - $250M',
  large: '$250M - $1B',
  enterprise: '$1B - $10B',
  mega: '$10B+',
};

const HEADCOUNT_LABELS: Record<string, string> = {
  micro: '10 - 50',
  small: '50 - 200',
  medium: '200 - 1,000',
  large: '1,000 - 5,000',
  enterprise: '5,000 - 25,000',
  mega: '25,000+',
};

// ============================================================================
// McKinsey-style Report Generation
// ============================================================================
function generateExecutiveSummaryHTML(runData: any, leadData: any): string {
  const inputs = runData.inputs || {};
  const outputs = runData.outputs || {};
  const sectorName = SECTOR_NAMES[inputs.sector] || inputs.sector || 'Unknown';
  const revLabel = REVENUE_LABELS[inputs.revenueId] || inputs.revenueId || 'N/A';
  const hcLabel = HEADCOUNT_LABELS[inputs.headcountId] || inputs.headcountId || 'N/A';
  const companyName = leadData?.company || 'Your Organization';
  const contactName = leadData?.name || 'Executive';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const fmtCurrency = (v: number) => {
    if (!v || isNaN(v)) return '$0';
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
    return `$${v.toLocaleString()}`;
  };

  const fmtNumber = (v: number) => {
    if (!v || isNaN(v)) return '0';
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v.toLocaleString();
  };

  // Determine recommendation tier
  const roi = outputs.roiPercentage || 0;
  let tier = 'Exploratory';
  let tierColor = '#6B7280';
  let tierDescription = 'Early-stage exploration recommended with targeted pilots.';
  if (roi > 500) {
    tier = 'Transformational';
    tierColor = '#059669';
    tierDescription = 'Exceptional ROI indicates transformational potential. Recommend enterprise-wide deployment with phased rollout.';
  } else if (roi > 300) {
    tier = 'High Impact';
    tierColor = '#2563EB';
    tierDescription = 'Strong ROI supports broad automation investment. Recommend department-level deployment with rapid scaling plan.';
  } else if (roi > 150) {
    tier = 'Strategic';
    tierColor = '#7C3AED';
    tierDescription = 'Solid ROI justifies strategic investment. Recommend targeted process automation with clear success metrics.';
  } else if (roi > 50) {
    tier = 'Moderate';
    tierColor = '#D97706';
    tierDescription = 'Positive ROI warrants focused pilots. Recommend starting with highest-impact processes.';
  }

  // Generate implementation recommendations based on sector + size
  const recommendations = getRecommendations(inputs.sector, inputs.revenueId, outputs);
  const risks = getRisks(inputs.sector, inputs.headcountId);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; line-height: 1.6; }
  
  /* PAGE 1: COVER */
  .cover {
    width: 100%; height: 100vh; min-height: 1123px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center; color: white; position: relative; overflow: hidden;
    page-break-after: always;
  }
  .cover::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  }
  .cover-content { position: relative; z-index: 1; max-width: 600px; padding: 40px; }
  .cover-badge {
    display: inline-block; padding: 8px 20px; border-radius: 24px;
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;
  }
  .cover h1 { font-size: 42px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px; }
  .cover h1 span { color: #818cf8; }
  .cover-sub { font-size: 18px; color: #94a3b8; margin-bottom: 48px; }
  .cover-meta { font-size: 13px; color: #64748b; }
  .cover-meta strong { color: #94a3b8; }
  .cover-divider { width: 60px; height: 2px; background: #818cf8; margin: 24px auto; }
  .cover-logo { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; color: #475569; margin-top: 40px; }

  /* PAGE 2+: CONTENT */
  .page {
    width: 100%; min-height: 1123px; padding: 60px;
    page-break-after: always; position: relative;
  }
  .page-header {
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 40px;
  }
  .page-header-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #64748b; }
  .page-header-logo { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; }
  
  h2 { font-size: 28px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
  h2 span { color: #6366f1; }
  h3 { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #1e293b; }
  .section-sub { font-size: 14px; color: #64748b; margin-bottom: 32px; }
  
  .metrics-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px;
  }
  .metric-card {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 24px; text-align: center;
  }
  .metric-value { font-size: 36px; font-weight: 700; color: #0f172a; }
  .metric-value.primary { color: #6366f1; }
  .metric-value.green { color: #059669; }
  .metric-value.amber { color: #d97706; }
  .metric-label { font-size: 13px; color: #64748b; margin-top: 4px; }

  .tier-badge {
    display: inline-block; padding: 6px 16px; border-radius: 8px;
    font-size: 14px; font-weight: 600; color: white; margin-bottom: 12px;
  }
  
  .breakdown-table {
    width: 100%; border-collapse: collapse; margin-bottom: 32px;
  }
  .breakdown-table th {
    text-align: left; padding: 12px 16px; background: #f1f5f9;
    font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;
    border-bottom: 2px solid #e2e8f0;
  }
  .breakdown-table td {
    padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px;
  }
  .breakdown-table tr:last-child td { border-bottom: 2px solid #e2e8f0; font-weight: 600; }

  .recommendation-card {
    background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0;
    padding: 20px; margin-bottom: 16px;
  }
  .recommendation-card h4 { font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #1e293b; }
  .recommendation-card p { font-size: 13px; color: #475569; }

  .risk-item {
    display: flex; gap: 12px; margin-bottom: 12px; padding: 12px;
    background: #fffbeb; border-radius: 8px;
  }
  .risk-icon { color: #d97706; font-size: 16px; flex-shrink: 0; }
  .risk-text { font-size: 13px; color: #78350f; }

  .footer-cta {
    background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px;
    padding: 32px; text-align: center; color: white; margin-top: 40px;
  }
  .footer-cta h3 { color: white; font-size: 20px; margin-bottom: 8px; }
  .footer-cta p { color: rgba(255,255,255,0.8); font-size: 14px; }

  .disclaimer { font-size: 11px; color: #94a3b8; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="cover">
  <div class="cover-content">
    <div class="cover-badge">Confidential — Executive Summary</div>
    <h1>AI Automation <span>ROI Analysis</span></h1>
    <p class="cover-sub">
      Personalized assessment for ${companyName}<br/>
      ${sectorName} Sector
    </p>
    <div class="cover-divider"></div>
    <div class="cover-meta">
      <p>Prepared for: <strong>${contactName}</strong></p>
      <p>Revenue: <strong>${revLabel}</strong> | Headcount: <strong>${hcLabel} employees</strong></p>
      <p>Date: <strong>${today}</strong></p>
    </div>
    <div class="cover-logo">Chase Continental</div>
  </div>
</div>

<!-- PAGE 2: THE WHAT — Key Findings -->
<div class="page">
  <div class="page-header">
    <div class="page-header-title">Section 1 — The What: Key Findings</div>
    <div class="page-header-logo">Chase Continental</div>
  </div>
  
  <h2>Executive <span>Overview</span></h2>
  <p class="section-sub">
    Based on ${sectorName.toLowerCase()} benchmarks, your organization is positioned for significant 
    returns on AI automation investment.
  </p>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-value green">${fmtCurrency(outputs.annualSavings || 0)}</div>
      <div class="metric-label">Projected Annual Savings</div>
    </div>
    <div class="metric-card">
      <div class="metric-value primary">${outputs.roiPercentage || 0}%</div>
      <div class="metric-label">Return on Investment</div>
    </div>
    <div class="metric-card">
      <div class="metric-value amber">${outputs.paybackMonths || 0} months</div>
      <div class="metric-label">Estimated Payback Period</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${fmtCurrency(outputs.threeYearValue || 0)}</div>
      <div class="metric-label">3-Year Net Value</div>
    </div>
  </div>

  <div style="margin-bottom: 32px;">
    <span class="tier-badge" style="background: ${tierColor};">${tier} Opportunity</span>
    <p style="font-size: 14px; color: #475569; margin-top: 8px;">${tierDescription}</p>
  </div>

  <h3>Savings Composition</h3>
  <table class="breakdown-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Annual Value</th>
        <th>Share</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Time & Labor Savings</td>
        <td>${fmtCurrency(outputs.timeSavings || 0)}</td>
        <td>${outputs.annualSavings ? Math.round((outputs.timeSavings / outputs.annualSavings) * 100) : 0}%</td>
      </tr>
      <tr>
        <td>Error Reduction</td>
        <td>${fmtCurrency(outputs.errorSavings || 0)}</td>
        <td>${outputs.annualSavings ? Math.round((outputs.errorSavings / outputs.annualSavings) * 100) : 0}%</td>
      </tr>
      <tr>
        <td>Productivity Gains</td>
        <td>${fmtCurrency(outputs.productivityGain || 0)}</td>
        <td>${outputs.annualSavings ? Math.round((outputs.productivityGain / outputs.annualSavings) * 100) : 0}%</td>
      </tr>
      <tr>
        <td><strong>Total Annual Savings</strong></td>
        <td><strong>${fmtCurrency(outputs.annualSavings || 0)}</strong></td>
        <td><strong>100%</strong></td>
      </tr>
    </tbody>
  </table>

  <h3>Industry Benchmark</h3>
  <div class="recommendation-card">
    <h4>${outputs.keyMetric || 'Key Metric'}</h4>
    <p>${outputs.sectorInsight || 'Sector-specific insight'} — Source: ${outputs.source || 'Industry Research'}</p>
  </div>

  <div class="disclaimer">
    Projections based on 2025-2026 industry benchmarks from McKinsey, Deloitte, PwC, and Gartner. 
    Actual results may vary based on implementation quality, organizational readiness, and market conditions.
    This analysis is for informational purposes only and should not be considered financial advice.
  </div>
</div>

<!-- PAGE 3: THE WHY & THE HOW -->
<div class="page">
  <div class="page-header">
    <div class="page-header-title">Section 2 — The Why & The How</div>
    <div class="page-header-logo">Chase Continental</div>
  </div>

  <h2>Strategic <span>Rationale</span></h2>
  <p class="section-sub">
    Why AI automation is critical for ${sectorName.toLowerCase()} organizations 
    at the ${revLabel} revenue scale.
  </p>

  <h3>The Why: Market Imperative</h3>
  <div style="margin-bottom: 32px;">
    <div class="recommendation-card">
      <h4>Competitive Advantage</h4>
      <p>88% of enterprises are actively deploying AI automation (McKinsey 2025). 
         Organizations that delay risk falling behind competitors who achieve 
         ${fmtCurrency(outputs.annualSavings || 0)} in annual operational savings.</p>
    </div>
    <div class="recommendation-card">
      <h4>Workforce Optimization</h4>
      <p>With ${fmtNumber(outputs.hoursSavedPerYear || 0)} hours saved annually, your team 
         can redirect capacity toward strategic initiatives, innovation, and customer experience — 
         areas that drive top-line growth.</p>
    </div>
    <div class="recommendation-card">
      <h4>Error Prevention</h4>
      <p>Preventing ${fmtNumber(outputs.errorsPreventedPerYear || 0)} errors per year 
         doesn't just save ${fmtCurrency(outputs.errorSavings || 0)} — it protects brand reputation, 
         reduces compliance risk, and improves customer satisfaction.</p>
    </div>
  </div>

  <h3>The How: Implementation Roadmap</h3>
  ${recommendations.map((rec: any, i: number) => `
    <div class="recommendation-card">
      <h4>Phase ${i + 1}: ${rec.title}</h4>
      <p>${rec.description}</p>
    </div>
  `).join('')}

  <h3 style="margin-top: 32px;">Key Risks & Mitigations</h3>
  ${risks.map((risk: any) => `
    <div class="risk-item">
      <div class="risk-icon">⚠</div>
      <div class="risk-text"><strong>${risk.title}:</strong> ${risk.mitigation}</div>
    </div>
  `).join('')}

  <div class="footer-cta">
    <h3>Ready to Move Forward?</h3>
    <p>Schedule a complimentary strategy session with our AI automation experts.<br/>
    Visit chasecontinental.com or email hello@chasecontinental.com</p>
  </div>

  <div class="disclaimer">
    © ${new Date().getFullYear()} Chase Continental. All rights reserved. This report contains proprietary analysis 
    and is intended solely for the named recipient. Benchmarks from McKinsey, Deloitte, PwC, Gartner, Stanford HAI.
  </div>
</div>

</body>
</html>`;
}

function getRecommendations(sector: string, revenueId: string, outputs: any) {
  const isSmall = ['startup', 'small'].includes(revenueId);
  const isLarge = ['enterprise', 'mega'].includes(revenueId);

  const base = [
    {
      title: 'Process Discovery & Prioritization (Weeks 1-4)',
      description: `Map current workflows and identify the highest-impact automation candidates. Focus on processes contributing to your projected ${outputs.annualSavings ? '$' + Math.round(outputs.annualSavings * 0.3).toLocaleString() : ''} in quick-win savings.`
    },
    {
      title: 'Pilot Deployment (Weeks 5-12)',
      description: `Deploy AI automation on 2-3 priority processes. Target the estimated ${outputs.paybackMonths || 'N/A'}-month payback period by selecting processes with the highest error rates and manual effort.`
    },
    {
      title: 'Scale & Optimize (Months 4-12)',
      description: `Expand automation across departments based on pilot learnings. Aim to capture the full ${outputs.annualSavings ? '$' + Math.round(outputs.annualSavings).toLocaleString() : ''} annual savings by end of Year 1.`
    }
  ];

  if (isLarge) {
    base.push({
      title: 'Enterprise Center of Excellence (Year 2+)',
      description: 'Establish a dedicated AI CoE to standardize automation practices, manage vendor relationships, and drive continuous improvement across the organization.'
    });
  }

  if (isSmall) {
    base[0].description = 'Start with a focused assessment of your top 5 most time-consuming processes. Small teams benefit most from targeting repetitive, rule-based tasks first.';
  }

  return base;
}

function getRisks(sector: string, headcountId: string) {
  const risks = [
    {
      title: 'Change Management',
      mitigation: 'Invest in employee training and communication. Frame AI as augmentation, not replacement. Start with processes where staff already feel pain.'
    },
    {
      title: 'Data Quality',
      mitigation: 'Audit data inputs before automation. Poor data quality is the #1 cause of AI project failure. Budget 15-20% of implementation time for data preparation.'
    },
    {
      title: 'Integration Complexity',
      mitigation: 'Choose automation platforms with pre-built connectors for your existing tech stack. Avoid custom integrations where possible in Phase 1.'
    }
  ];

  if (['healthcare', 'financial_services', 'insurance', 'legal'].includes(sector)) {
    risks.push({
      title: 'Regulatory Compliance',
      mitigation: 'Ensure AI systems meet industry-specific compliance requirements. Implement audit trails and human-in-the-loop safeguards for regulated processes.'
    });
  }

  return risks;
}

// ============================================================================
// EDGE FUNCTION
// ============================================================================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { run_id, lead_id } = await req.json()

    if (!run_id) {
      throw new Error('run_id is required')
    }

    // Fetch run data
    const { data: runData, error: runError } = await supabaseClient
      .from('lm02_calculator_runs')
      .select('*')
      .eq('id', run_id)
      .single()

    if (runError || !runData) {
      throw new Error('Failed to fetch run data')
    }

    // Fetch lead data if available
    let leadData = null;
    if (lead_id) {
      const { data, error } = await supabaseClient
        .from('leads')
        .select('*')
        .eq('id', lead_id)
        .single()
      if (!error) leadData = data;
    }

    // Generate the HTML report
    const htmlReport = generateExecutiveSummaryHTML(runData, leadData);

    // Store the report HTML in the bucket for later PDF conversion / direct download
    const fileName = `roi-report-${run_id}.html`;
    const { error: uploadError } = await supabaseClient.storage
      .from('lm02-roi-calculator')
      .upload(fileName, new Blob([htmlReport], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('lm02-roi-calculator')
      .getPublicUrl(fileName);

    // Track event
    await supabaseClient.from('events').insert({
      event_name: 'pdf_generated',
      lead_id: lead_id,
      event_payload: { 
        run_id, 
        report_url: urlData?.publicUrl,
        sector: runData.sector
      }
    })

    return new Response(
      JSON.stringify({ 
        message: 'Executive summary generated',
        report_url: urlData?.publicUrl,
        insights: {
          headline: "Your AI Automation ROI Executive Summary",
          data: runData.outputs
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
