// Vercel Serverless Function - Create HubSpot Deal
// Uses HUBSPOT_ACCESS_TOKEN env var already configured in Vercel

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'HubSpot token not configured' });
  }

  try {
    const {
      dealname,
      amount,
      closedate,
      pipeline,
      dealstage,
      hubspot_owner_id,
      deal_type,
      vincit_member_company,
      parent_account,
      city,
      state,
      notes
    } = req.body;

    if (!dealname) {
      return res.status(400).json({ error: 'Deal name is required' });
    }

    // Build properties object
    const properties = {
      dealname,
      pipeline: pipeline || 'default',
      dealstage: dealstage || 'appointmentscheduled'
    };

    if (amount) properties.amount = String(amount);
    if (closedate) properties.closedate = closedate;
    if (hubspot_owner_id) properties.hubspot_owner_id = hubspot_owner_id;
    if (deal_type) properties.dealtype = deal_type;
    if (notes) properties.description = notes;

    // Create deal in HubSpot
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('HubSpot error:', data);
      return res.status(response.status).json({
        error: 'HubSpot API error',
        details: data.message || JSON.stringify(data)
      });
    }

    return res.status(200).json({
      success: true,
      dealId: data.id,
      dealname: data.properties.dealname,
      message: `Deal "${data.properties.dealname}" created successfully`
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
