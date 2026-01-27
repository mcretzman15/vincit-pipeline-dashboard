import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const STAGE_NAMES = {
  // Pipeline 852403303 (New Business)
  '1270511187': 'Qualified Lead',
  '1270511188': 'Discovery',
  '1270511189': 'Proposal',
  '1270511190': 'Negotiation',
  '1270511191': 'Closed Won',
  '1270511192': 'Closed Lost',
  // Pipeline 855678765 (Cross-Sell)
  '1276776727': 'Opportunity Identified',
  '1276776729': 'Engaged',
  '1276776730': 'Demo/Discovery',
  '1276776731': 'Proposal',
  '1276776732': 'Negotiation',
  '1276776733': 'Closed Won',
  '1276776734': 'Closed Lost',
  // Default pipeline
  'appointmentscheduled': 'Appointment Scheduled',
  'qualifiedtobuy': 'Qualified to Buy',
  'presentationscheduled': 'Presentation Scheduled',
  'decisionmakerboughtin': 'Decision Maker Bought-In',
  'contractsent': 'Contract Sent',
  'closedwon': 'Closed Won',
  'closedlost': 'Closed Lost'
};

const PIPELINE_NAMES = {
  'default': 'Default Pipeline',
  '852403303': 'New Business Pipeline',
  '855678765': 'Cross-Sell Pipeline'
};

const OWNER_NAMES = {
  '86370196': 'Travis Starks',
  '87131928': 'Brian Barker',
  '87129317': 'Mike Thompson',
  '87132088': 'Sarah Johnson',
  '87184916': 'Chris Wilson',
  '86370312': 'Matt Cretzman'
};

export default function Dashboard() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState('all');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/hubspot');
      if (!res.ok) throw new Error('Failed to fetch deals');
      const data = await res.json();
      setDeals(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredDeals = selectedPipeline === 'all' 
    ? deals 
    : deals.filter(d => d.properties.pipeline === selectedPipeline);

  // Calculate metrics
  const totalPipeline = filteredDeals.reduce((sum, d) => sum + (parseFloat(d.properties.amount) || 0), 0);
  const dealCount = filteredDeals.length;
  const avgDealSize = dealCount > 0 ? totalPipeline / dealCount : 0;

  // Stage breakdown
  const stageData = filteredDeals.reduce((acc, deal) => {
    const stage = deal.properties.dealstage;
    const stageName = STAGE_NAMES[stage] || stage;
    const amount = parseFloat(deal.properties.amount) || 0;
    
    const existing = acc.find(s => s.name === stageName);
    if (existing) {
      existing.value += amount;
      existing.count += 1;
    } else {
      acc.push({ name: stageName, value: amount, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Owner breakdown
  const ownerData = filteredDeals.reduce((acc, deal) => {
    const ownerId = deal.properties.hubspot_owner_id;
    const ownerName = OWNER_NAMES[ownerId] || `Owner ${ownerId}`;
    const amount = parseFloat(deal.properties.amount) || 0;
    
    const existing = acc.find(o => o.name === ownerName);
    if (existing) {
      existing.value += amount;
      existing.count += 1;
    } else {
      acc.push({ name: ownerName, value: amount, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Pipeline breakdown
  const pipelineData = deals.reduce((acc, deal) => {
    const pipeline = deal.properties.pipeline;
    const pipelineName = PIPELINE_NAMES[pipeline] || pipeline;
    const amount = parseFloat(deal.properties.amount) || 0;
    
    const existing = acc.find(p => p.name === pipelineName);
    if (existing) {
      existing.value += amount;
      existing.count += 1;
    } else {
      acc.push({ name: pipelineName, value: amount, count: 1, id: pipeline });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Top deals
  const topDeals = [...filteredDeals]
    .sort((a, b) => (parseFloat(b.properties.amount) || 0) - (parseFloat(a.properties.amount) || 0))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading pipeline data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vincit Group Executive Sales Pipeline</h1>
        <p className="text-gray-400">Real-time HubSpot data • Last updated: {new Date().toLocaleString()}</p>
      </div>

      {/* Pipeline Filter */}
      <div className="mb-6">
        <select 
          value={selectedPipeline}
          onChange={(e) => setSelectedPipeline(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
        >
          <option value="all">All Pipelines</option>
          {pipelineData.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Pipeline Value</p>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(totalPipeline)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Active Deals</p>
          <p className="text-3xl font-bold text-blue-400">{dealCount}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Average Deal Size</p>
          <p className="text-3xl font-bold text-purple-400">{formatCurrency(avgDealSize)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pipelines</p>
          <p className="text-3xl font-bold text-yellow-400">{pipelineData.length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline by Stage */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Pipeline by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageData} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="name" width={120} stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline by Owner */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Pipeline by Rep</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ownerData} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} stroke="#9CA3AF" />
              <YAxis type="category" dataKey="name" width={120} stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Pipeline Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Deals Table */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Top 10 Deals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3">Deal Name</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3">Owner</th>
                </tr>
              </thead>
              <tbody>
                {topDeals.map((deal, index) => (
                  <tr key={deal.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 pr-4">
                      <span className="text-white font-medium">{deal.properties.dealname}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(deal.properties.amount)}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                        {STAGE_NAMES[deal.properties.dealstage] || deal.properties.dealstage}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-gray-300">
                        {OWNER_NAMES[deal.properties.hubspot_owner_id] || 'Unassigned'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        Powered by HubSpot + Stormbreaker Digital
      </div>
    </div>
  );
}
