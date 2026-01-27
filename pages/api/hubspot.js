export default async function handler(req, res) {
  const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!HUBSPOT_ACCESS_TOKEN) {
    // Return demo data if no token configured
    return res.status(200).json({
      results: [
        {
          id: '1',
          properties: {
            dealname: 'Hello Fresh / Aurora IL / QSI',
            amount: '13780000',
            dealstage: '1276776727',
            pipeline: '855678765',
            hubspot_owner_id: '87184916',
            closedate: '2026-04-01'
          }
        },
        {
          id: '2',
          properties: {
            dealname: 'Tyson / Goodlettesville TN / QSI',
            amount: '5557760',
            dealstage: '1270511189',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: '2026-03-31'
          }
        },
        {
          id: '3',
          properties: {
            dealname: 'John Soules Foods / Tyler TX / QSI',
            amount: '5126160',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87184916',
            closedate: '2026-04-01'
          }
        },
        {
          id: '4',
          properties: {
            dealname: 'Dole Fresh Vegetables / Springfield OH / QSI',
            amount: '3150160',
            dealstage: '1270511188',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: '2026-03-31'
          }
        },
        {
          id: '5',
          properties: {
            dealname: 'AFG / Green Bay WI Harvest / QSI',
            amount: '3093740',
            dealstage: '1270511189',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: null
          }
        },
        {
          id: '6',
          properties: {
            dealname: 'Wayne-Sanderson Farms / Bryan Tx / Intervention',
            amount: '2500000',
            dealstage: '1270511187',
            pipeline: '852403303',
            hubspot_owner_id: '87132088',
            closedate: '2026-03-31'
          }
        },
        {
          id: '7',
          properties: {
            dealname: 'Godshalls / Lebonan PA / QSI',
            amount: '2000000',
            dealstage: '1276776731',
            pipeline: '855678765',
            hubspot_owner_id: '87129317',
            closedate: '2026-03-31'
          }
        },
        {
          id: '8',
          properties: {
            dealname: 'Intermountain Packing / Idaho Falls ID / QSI',
            amount: '2000000',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87129317',
            closedate: '2026-03-31'
          }
        },
        {
          id: '9',
          properties: {
            dealname: 'Cargill / Spruce Grove AL Canada / QSI',
            amount: '1326000',
            dealstage: '1270511187',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: null
          }
        },
        {
          id: '10',
          properties: {
            dealname: 'Volpi Foods / St Louis MO / QSI',
            amount: '1179360',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87184916',
            closedate: '2026-04-01'
          }
        },
        {
          id: '11',
          properties: {
            dealname: 'Volpi Foods / Union MO / QSI',
            amount: '1038960',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87184916',
            closedate: '2026-04-01'
          }
        },
        {
          id: '12',
          properties: {
            dealname: 'Cargill - Chicago - Hand soap',
            amount: '1000000',
            dealstage: '1270511187',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: '2026-01-31'
          }
        },
        {
          id: '13',
          properties: {
            dealname: 'Simmons Corporate Account',
            amount: '986960',
            dealstage: '1276776729',
            pipeline: '855678765',
            hubspot_owner_id: '87129317',
            closedate: '2026-03-31'
          }
        },
        {
          id: '14',
          properties: {
            dealname: 'The Deli Source / Kenosha WI / QSI',
            amount: '586560',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87129317',
            closedate: '2026-03-31'
          }
        },
        {
          id: '15',
          properties: {
            dealname: 'The Deli Source / Warren WI / QSI',
            amount: '570960',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87129317',
            closedate: '2026-01-31'
          }
        },
        {
          id: '16',
          properties: {
            dealname: 'Cargill Test Deal',
            amount: '500000',
            dealstage: '1270511190',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: '2026-02-27'
          }
        },
        {
          id: '17',
          properties: {
            dealname: 'Cargill Test',
            amount: '500000',
            dealstage: '1270511189',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: '2026-02-27'
          }
        },
        {
          id: '18',
          properties: {
            dealname: 'The Deli Source / Waterloo WI / QSI',
            amount: '388000',
            dealstage: '1276776730',
            pipeline: '855678765',
            hubspot_owner_id: '87129317',
            closedate: '2026-03-31'
          }
        },
        {
          id: '19',
          properties: {
            dealname: 'Johnsonville / Sheboygan Falls WI / ZEE F&B',
            amount: '30000',
            dealstage: '1270511189',
            pipeline: '852403303',
            hubspot_owner_id: '87131928',
            closedate: null
          }
        }
      ]
    });
  }

  try {
    const response = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,dealstage,amount,pipeline,closedate,hubspot_owner_id',
      {
        headers: {
          'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('HubSpot API error:', error);
    res.status(500).json({ error: error.message });
  }
}
