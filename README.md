# Vincit Group Executive Sales Pipeline Dashboard

Real-time sales pipeline dashboard powered by HubSpot data.

## Features

- **Total Pipeline Value** - See your entire pipeline at a glance
- **Pipeline by Stage** - Visualize deal distribution across stages
- **Pipeline by Rep** - Track individual rep performance
- **Top Deals** - View your biggest opportunities
- **Pipeline Filtering** - Filter by New Business or Cross-Sell pipelines

## Setup

### Environment Variables

To connect to live HubSpot data, add your HubSpot access token to Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `HUBSPOT_ACCESS_TOKEN` = your HubSpot private app token

### Getting a HubSpot Access Token

1. Go to HubSpot Settings > Integrations > Private Apps
2. Create a new private app
3. Add scopes: `crm.objects.deals.read`
4. Copy the access token

## Tech Stack

- Next.js 14
- Tailwind CSS
- Recharts
- HubSpot API

## Development

```bash
npm install
npm run dev
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mcretzman15/vincit-pipeline-dashboard)

---

Built by [Stormbreaker Digital](https://stormbreakerdigital.com) for Vincit Group
