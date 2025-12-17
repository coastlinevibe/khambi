import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsChartsProps {
  members: any[];
  events: any[];
  claims: any[];
  staff: any[];
}

export default function AnalyticsCharts({ members, events, claims, staff }: AnalyticsChartsProps) {
  const { isDark } = useTheme();

  // Process data for charts
  const policyDistribution = [
    { name: "Bronze", value: members.filter(m => m.policy_type === 'bronze').length, color: '#f97316' },
    { name: "Silver", value: members.filter(m => m.policy_type === 'silver').length, color: '#94a3b8' },
    { name: "Gold", value: members.filter(m => m.policy_type === 'gold').length, color: '#eab308' },
  ];

  const claimStatusData = [
    { name: "New", value: claims.filter(c => c.status === 'new').length, color: '#eab308' },
    { name: "Processing", value: claims.filter(c => c.status === 'processing').length, color: '#3b82f6' },
    { name: "Approved", value: claims.filter(c => c.status === 'approved').length, color: '#22c55e' },
    { name: "Rejected", value: claims.filter(c => c.status === 'rejected').length, color: '#ef4444' },
  ];

  const eventStatusData = [
    { name: "Scheduled", count: events.filter(e => e.status === 'scheduled').length },
    { name: "In Progress", count: events.filter(e => e.status === 'in_progress').length },
    { name: "Completed", count: events.filter(e => e.status === 'completed').length },
    { name: "Cancelled", count: events.filter(e => e.status === 'cancelled').length },
  ];

  const staffStatusData = [
    { name: "Available", count: staff.filter(s => s.status === 'available').length },
    { name: "On Assignment", count: staff.filter(s => s.status === 'on_assignment').length },
    { name: "Off Duty", count: staff.filter(s => s.status === 'off_duty').length },
  ];

  // Monthly trends (mock data - in production, calculate from actual dates)
  const monthlyTrends = [
    { month: "Jul", members: 420, events: 28, claims: 32 },
    { month: "Aug", members: 485, events: 31, claims: 38 },
    { month: "Sep", members: 532, events: 29, claims: 35 },
    { month: "Oct", members: 598, events: 34, claims: 41 },
    { month: "Nov", members: 645, events: 36, claims: 44 },
    { month: "Dec", members: members.length, events: events.length, claims: claims.length },
  ];

  // Revenue by policy type (mock calculation)
  const revenueData = [
    { policy: "Bronze", revenue: members.filter(m => m.policy_type === 'bronze').length * 15000 },
    { policy: "Silver", revenue: members.filter(m => m.policy_type === 'silver').length * 20000 },
    { policy: "Gold", revenue: members.filter(m => m.policy_type === 'gold').length * 25000 },
  ];

  const chartColors = {
    primary: '#C9A961',
    secondary: '#B8935E',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    info: '#3b82f6',
  };

  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <div className="space-y-6">
      {/* Row 1: Policy Distribution & Claim Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Distribution Pie Chart */}
        <div
          style={{ borderColor: '#B8935E', borderWidth: '1px' }}
          className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Policy Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={policyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {policyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: '1px solid #B8935E',
                  borderRadius: '8px',
                  color: textColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Claim Status Pie Chart */}
        <div
          style={{ borderColor: '#B8935E', borderWidth: '1px' }}
          className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Claims Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={claimStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {claimStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: '1px solid #B8935E',
                  borderRadius: '8px',
                  color: textColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Monthly Trends Line Chart */}
      <div
        style={{ borderColor: '#B8935E', borderWidth: '1px' }}
        className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      >
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Monthly Trends
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyTrends}>
            <defs>
              <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.info} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.info} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.success} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: '1px solid #B8935E',
                borderRadius: '8px',
                color: textColor,
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="members" stroke={chartColors.primary} fillOpacity={1} fill="url(#colorMembers)" />
            <Area type="monotone" dataKey="events" stroke={chartColors.info} fillOpacity={1} fill="url(#colorEvents)" />
            <Area type="monotone" dataKey="claims" stroke={chartColors.success} fillOpacity={1} fill="url(#colorClaims)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Event Status & Staff Status Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Status Bar Chart */}
        <div
          style={{ borderColor: '#B8935E', borderWidth: '1px' }}
          className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Event Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: '1px solid #B8935E',
                  borderRadius: '8px',
                  color: textColor,
                }}
              />
              <Bar dataKey="count" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Status Bar Chart */}
        <div
          style={{ borderColor: '#B8935E', borderWidth: '1px' }}
          className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Staff Availability
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staffStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: '1px solid #B8935E',
                  borderRadius: '8px',
                  color: textColor,
                }}
              />
              <Bar dataKey="count" fill={chartColors.info} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Revenue by Policy Type */}
      <div
        style={{ borderColor: '#B8935E', borderWidth: '1px' }}
        className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      >
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Revenue by Policy Type
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" stroke={textColor} />
            <YAxis dataKey="policy" type="category" stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: '1px solid #B8935E',
                borderRadius: '8px',
                color: textColor,
              }}
              formatter={(value) => `R${(value || 0).toLocaleString()}`}
            />
            <Bar dataKey="revenue" fill={chartColors.success} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
