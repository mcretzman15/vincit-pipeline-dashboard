import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const STAGE_NAMES = {
  '1270511187': 'Qualified Lead',
  '1270511188': 'Discovery',
  '1270511189': 'Proposal',
  '1270511190': 'Negotiation',
  '1270511191': 'Closed Won',
  '1270511192': 'Closed Lost',
  '1276776727': 'Opportunity Identified',
  '1276776729': 'Engaged',
  '1276776730': 'Demo/Discovery',
  '1276776731': 'Proposal',
  '1276776732': 'Negotiation',
  '1276776733': 'Closed Won',
  '1276776734': 'Closed Lost',
  'appointmentscheduled': 'Appointment Scheduled',
  'qualifiedtobuy': 'Qualified to Buy',
  'presentationscheduled': 'Presentation Scheduled',
  'decisionmakerboughtin': 'Decision Maker Bought-In',
  'contractsent': 'Contract Sent',
  'closedwon': 'Closed Won',
  'closedlost': 'Closed Lost'
};

const PIPELINE_NAMES = {
  'default': 'Sales Pipeline',
  '852403303': 'Vincit Enterprise',
  '855678765': 'QSI BDM',
  '855656590': 'SAM Pipeline'
};

const OWNER_NAMES = {
  '87131928': 'Chad Lawrence',
  '87129317': 'Ben Hope',
  '87132088': 'Brian Hales',
  '87184916': 'Greg Atchley',
  '87184498': 'Eric Wilson',
  '87184702': 'Ryan McCormick',
  '87185119': 'Jeremy Bates',
  '87132142': 'Rikki Ford',
  '87238944': 'Shane Calhoun',
  '87420199': 'Matthew Husman',
  '86370196': 'Brady Field',
  '86346498': 'Brian Barker',
  '87468498': 'Phillip Shelton',
  '87131891': 'Tim Bryant',
  '87132015': 'Chris Beavers',
  '87131966': 'Tanner Berryhill',
  '87131930': 'April Englishbey',
  '87184637': 'Joe Reed',
  '85498043': 'Matt Cretzman'
};

// ===== FORM DATA =====
const PARENT_ACCOUNTS = [
  'AFG', 'Ajinomoto', 'Boars Head', 'Bobos', 'Bridgetown Natural Foods',
  'Cargill', 'Case Farms', 'Dole Fresh Vegetables', 'Essentia Protein Solutions',
  'F&G Foodgroup', 'Godshalls', 'Greater Omaha Packing', 'Hello Fresh',
  'Hertzog Beef', 'Intermountain Packing', 'IRCA Group', 'JBS',
  'John Soules Foods', 'Johnsonville', 'Kellys Foods', 'Mars',
  'Monogram', 'Peco Foods', 'Pepperidge Farms', 'Perdue',
  'Producer / Producer Owned Beef', 'Quaker Oats', 'Resers',
  'Simmons', 'Smithfield', 'Sustainable', 'The Deli Source',
  'Trinity Frozen Foods', 'Tyson', 'US Foods Stockyards',
  'Volpi Foods', 'Walmart / Walmart Manufacturing', 'Wayne-Sanderson Farms',
  'Wholestone Foods', 'Other'
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
  'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
  'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const VINCIT_MEMBERS = [
  'QSI-Beef', 'QSI-Pork', 'QSI-Case Ready', 'QSI-Poultry',
  'Zee-Nighttime Sanitation', 'Zee-Intervention', 'Zee-Water & Energy',
  'Zee-F&B Chemicals', 'Zee-GOP', 'TCS', 'ITG (Engineering)', 'Other'
];

const DEAL_OWNERS = [
  { id: '87131928', name: 'Chad Lawrence' },
  { id: '87129317', name: 'Ben Hope' },
  { id: '87132088', name: 'Brian Hales' },
  { id: '87184916', name: 'Greg Atchley' },
  { id: '87184498', name: 'Eric Wilson' },
  { id: '87184702', name: 'Ryan McCormick' },
  { id: '87185119', name: 'Jeremy Bates' },
  { id: '87132142', name: 'Rikki Ford' },
  { id: '87238944', name: 'Shane Calhoun' },
  { id: '87420199', name: 'Matthew Husman' },
  { id: '86370196', name: 'Brady Field' },
  { id: '86346498', name: 'Brian Barker' },
  { id: '87468498', name: 'Phillip Shelton' },
  { id: '87131891', name: 'Tim Bryant' },
  { id: '87132015', name: 'Chris Beavers' },
  { id: '87131966', name: 'Tanner Berryhill' },
  { id: '87131930', name: 'April Englishbey' },
  { id: '87184637', name: 'Joe Reed' },
  { id: '85498043', name: 'Matt Cretzman' }
].sort((a, b) => a.name.localeCompare(b.name));

const PIPELINE_OPTIONS = [
  { id: '852403303', name: 'Vincit Enterprise' },
  { id: '855678765', name: 'QSI BDM' },
  { id: '855656590', name: 'SAM Pipeline' },
  { id: 'default', name: 'Sales Pipeline' }
];

const DEAL_TYPES = ['New Business', 'Cross-Sell', 'Renewal'];

// ===== NEW DEAL FORM COMPONENT =====
function NewDealForm() {
  const [form, setForm] = useState({
    parentAccount: '', city: '', state: '', vincitMember: '',
    pipeline: '852403303', dealType: 'New Business', ownerId: '',
    amount: '', closeDate: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const generatedName = useMemo(() => {
    if (!form.parentAccount || !form.city || !form.state || !form.vincitMember) return '';
    return `${form.parentAccount} - ${form.city}, ${form.state} - ${form.vincitMember}`;
  }, [form.parentAccount, form.city, form.state, form.vincitMember]);

  const isValid = form.parentAccount && form.city && form.state && form.vincitMember && form.ownerId;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (result) setResult(null);
  };

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    setResult(null);

    const payload = {
      dealname: generatedName,
      amount: form.amount ? Number(form.amount) : undefined,
      closedate: form.closeDate || undefined,
      pipeline: form.pipeline,
      hubspot_owner_id: form.ownerId,
      deal_type: form.dealType,
      vincit_member_company: form.vincitMember,
      parent_account: form.parentAccount,
      city: form.city,
      state: form.state,
      notes: form.notes || undefined
    };

    try {
      const res = await fetch('/api/create-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setResult({ type: 'success', message: `Deal created: "${data.dealname}" (ID: ${data.dealId})` });
        setForm({ parentAccount: '', city: '', state: '', vincitMember: '', pipeline: '852403303', dealType: 'New Business', ownerId: '', amount: '', closeDate: '', notes: '' });
      } else {
        setResult({ type: 'error', message: data.error + (data.details ? ': ' + data.details : '') });
      }
    } catch (err) {
      setResult({ type: 'error', message: 'Network error: ' + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const selectClass = "w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const inputClass = "w-full bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Auto-generated deal name preview */}
      {generatedName && (
        <div className="bg-emerald-900/40 border-2 border-emerald-500 rounded-xl p-4 mb-6">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Auto-Generated Deal Name</div>
          <div className="text-lg font-bold text-emerald-300">{generatedName}</div>
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl p-4 mb-6 border-2 font-semibold text-sm ${
          result.type === 'success'
            ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300'
            : 'bg-red-900/40 border-red-500 text-red-300'
        }`}>
          {result.type === 'success' ? '✅ ' : '❌ '}{result.message}
        </div>
      )}

      {/* Section 1: Account & Location */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Parent Account <span className="text-red-400">*</span></label>
            <select value={form.parentAccount} onChange={e => handleChange('parentAccount', e.target.value)} className={selectClass}>
              <option value="">Select account...</option>
              {PARENT_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">City <span className="text-red-400">*</span></label>
            <input type="text" value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder="e.g. Amarillo" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">State <span className="text-red-400">*</span></label>
            <select value={form.state} onChange={e => handleChange('state', e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Vincit Member Company */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Vincit Member Company</h3>
        <label className="block text-sm font-medium text-gray-300 mb-2">Servicing Group <span className="text-red-400">*</span></label>
        <select value={form.vincitMember} onChange={e => handleChange('vincitMember', e.target.value)} className={selectClass}>
          <option value="">Select servicing group...</option>
          {VINCIT_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Section 3: Deal Details */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Deal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Pipeline</label>
            <select value={form.pipeline} onChange={e => handleChange('pipeline', e.target.value)} className={selectClass}>
              {PIPELINE_OPTIONS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deal Type</label>
            <select value={form.dealType} onChange={e => handleChange('dealType', e.target.value)} className={selectClass}>
              {DEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Deal Owner <span className="text-red-400">*</span></label>
            <select value={form.ownerId} onChange={e => handleChange('ownerId', e.target.value)} className={selectClass}>
              <option value="">Select owner...</option>
              {DEAL_OWNERS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deal Amount ($)</label>
            <input type="number" value={form.amount} onChange={e => handleChange('amount', e.target.value)} placeholder="e.g. 1500000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Expected Close Date</label>
            <input type="date" value={form.closeDate} onChange={e => handleChange('closeDate', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Section 4: Notes */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notes (Optional)</h3>
        <textarea value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={3}
          placeholder="Any context about this deal..." className={inputClass + " resize-y"} />
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={!isValid || submitting}
        className={`w-full py-4 text-base font-bold rounded-xl transition-all ${
          isValid && !submitting
            ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-500 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 cursor-pointer'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}>
        {submitting ? 'Creating Deal in HubSpot...' : 'Create Deal in HubSpot'}
      </button>

      {!isValid && (
        <p className="text-center text-xs text-gray-500 mt-2">
          Fill in all required fields (*) to enable submission
        </p>
      )}
    </div>
  );
}

// ===== MAIN DASHBOARD =====
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pipeline');
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

  const totalPipeline = filteredDeals.reduce((sum, d) => sum + (parseFloat(d.properties.amount) || 0), 0);
  const dealCount = filteredDeals.length;
  const avgDealSize = dealCount > 0 ? totalPipeline / dealCount : 0;

  const stageData = filteredDeals.reduce((acc, deal) => {
    const stage = deal.properties.dealstage;
    const stageName = STAGE_NAMES[stage] || stage;
    const amount = parseFloat(deal.properties.amount) || 0;
    const existing = acc.find(s => s.name === stageName);
    if (existing) { existing.value += amount; existing.count += 1; }
    else { acc.push({ name: stageName, value: amount, count: 1 }); }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const ownerData = filteredDeals.reduce((acc, deal) => {
    const ownerId = deal.properties.hubspot_owner_id;
    const ownerName = OWNER_NAMES[ownerId] || `Owner ${ownerId}`;
    const amount = parseFloat(deal.properties.amount) || 0;
    const existing = acc.find(o => o.name === ownerName);
    if (existing) { existing.value += amount; existing.count += 1; }
    else { acc.push({ name: ownerName, value: amount, count: 1 }); }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const pipelineData = deals.reduce((acc, deal) => {
    const pipeline = deal.properties.pipeline;
    const pipelineName = PIPELINE_NAMES[pipeline] || pipeline;
    const amount = parseFloat(deal.properties.amount) || 0;
    const existing = acc.find(p => p.name === pipelineName);
    if (existing) { existing.value += amount; existing.count += 1; }
    else { acc.push({ name: pipelineName, value: amount, count: 1, id: pipeline }); }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Vincit Group Executive Sales Pipeline</h1>
        <p className="text-gray-400">Real-time HubSpot data &bull; Last updated: {new Date().toLocaleString()}</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-800 rounded-xl p-1 border border-gray-700 max-w-md">
        {[
          { key: 'pipeline', label: '📊 Pipeline' },
          { key: 'newdeal', label: '➕ New Deal' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'newdeal' ? (
        <NewDealForm />
      ) : (
        <>
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

          {/* Pipeline Distribution + Top Deals */}
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
                    {topDeals.map((deal) => (
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
        </>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        Powered by HubSpot + Stormbreaker Digital
      </div>
    </div>
  );
}
