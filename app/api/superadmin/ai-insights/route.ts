import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Admin from '@/app/lib/models/Admin';
import LeadSubmission from '@/app/lib/models/LeadSubmission';
import Partner from '@/app/lib/models/Partner';
import Company from '@/app/lib/models/Company';
import { verifyAuth } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request);
  if (!auth || auth.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Gather real platform data
    const [
      totalAdmins,
      totalLeads,
      leadsThisMonth,
      leadsLastMonth,
      totalPartners,
      totalCompanies,
    ] = await Promise.all([
      Admin.countDocuments({ role: { $ne: 'superadmin' } }),
      LeadSubmission.countDocuments({}),
      LeadSubmission.countDocuments({ submittedAt: { $gte: startOfMonth } }),
      LeadSubmission.countDocuments({ submittedAt: { $gte: lastMonth, $lte: endOfLastMonth } }),
      Partner.countDocuments({}),
      Company.countDocuments({}),
    ]);

    // Top 5 tenants
    const topTenants = await LeadSubmission.aggregate([
      { $group: { _id: '$adminId', leadCount: { $sum: 1 } } },
      { $sort: { leadCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'admins',
          localField: '_id',
          foreignField: '_id',
          as: 'admin',
        },
      },
      { $unwind: '$admin' },
      { $project: { name: '$admin.name', email: '$admin.email', leadCount: 1 } },
    ]);

    const growthRate = leadsLastMonth > 0
      ? (((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100).toFixed(1)
      : leadsThisMonth > 0 ? '+100' : '0';

    const topTenantsStr = topTenants.length > 0
      ? topTenants.map((t: { name: string; leadCount: number }, i: number) => `${i + 1}. ${t.name} (${t.leadCount} leads)`).join('\n')
      : 'No tenant data yet.';

    // Build Gemini prompt
    const prompt = `You are a SaaS platform analytics expert for "ZeeOffer", a lead generation and partner management platform.

Here is the current LIVE platform data:

📊 Platform Metrics:
- Total Registered Admins (Tenants): ${totalAdmins}
- Total Leads Captured (All-Time): ${totalLeads}
- Leads This Month: ${leadsThisMonth}
- Leads Last Month: ${leadsLastMonth}
- Month-over-Month Growth: ${growthRate}%
- Total Partners: ${totalPartners}
- Total Companies: ${totalCompanies}

🏆 Top Tenants by Lead Volume:
${topTenantsStr}

Based on this data, provide a comprehensive intelligence report in the following JSON format:
{
  "platformSummary": "A 2-3 sentence overview of the platform's current health and trajectory.",
  "growthOpportunities": [
    { "title": "...", "description": "...", "priority": "high|medium|low" }
  ],
  "anomalyAlerts": [
    { "title": "...", "description": "...", "severity": "critical|warning|info" }
  ],
  "actionableDecisions": [
    { "decision": "...", "reasoning": "...", "impact": "high|medium|low" }
  ],
  "tenantInsights": "A paragraph analyzing tenant behavior patterns and recommendations."
}

Be specific, actionable, and data-driven. If data is zero or minimal, focus on onboarding and growth strategies. Return ONLY valid JSON, no markdown.`;

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
            response_mime_type: "application/json",
          },
        }),
      }
    );

    const geminiData = await geminiRes.json();

    if (geminiData.error) {
      console.error('Gemini API Error:', geminiData.error);
      return NextResponse.json({ error: `AI Error: ${geminiData.error.message}` }, { status: 500 });
    }

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('Gemini No Candidates Error. Response:', JSON.stringify(geminiData));
      return NextResponse.json({ error: 'AI returned no results' }, { status: 500 });
    }

    let reportText = geminiData.candidates[0].content.parts[0].text || '';
    
    let report;
    try {
      // Remove any potential non-JSON prefix/suffix
      const jsonStart = reportText.indexOf('{');
      const jsonEnd = reportText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        reportText = reportText.substring(jsonStart, jsonEnd + 1);
      }
      report = JSON.parse(reportText);
    } catch {
      console.error('Gemini Parse Error. Raw Text:', reportText);
      report = {
        platformSummary: "Failed to generate structured report. Analyzing raw insight: " + (reportText.substring(0, 500) || "Empty response"),
        growthOpportunities: [],
        anomalyAlerts: [],
        actionableDecisions: [],
        tenantInsights: '',
      };
    }

    return NextResponse.json({
      report,
      dataSnapshot: {
        totalAdmins,
        totalLeads,
        leadsThisMonth,
        leadsLastMonth,
        growthRate,
        totalPartners,
        totalCompanies,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Insights error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
