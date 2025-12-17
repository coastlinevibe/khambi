import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { auditApi, AuditLog } from "../lib/api/audit";
import { Search, Filter, Download, Eye, User, Calendar, Activity } from "lucide-react";

export default function AuditTrail() {
  const { isDark } = useTheme();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [viewingDetails, setViewingDetails] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await auditApi.getRecentActivity();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchQuery ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.users?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.users?.last_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "approve":
        return "bg-green-100 text-green-800";
      case "reject":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "+";
      case "update":
        return "✎";
      case "delete":
        return "×";
      case "approve":
        return "✓";
      case "reject":
        return "✗";
      default:
        return "•";
    }
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Entity Type", "Entity ID"].join(","),
      ...filteredLogs.map((log) =>
        [
          new Date(log.created_at).toLocaleString(),
          `${log.users?.first_name || ""} ${log.users?.last_name || ""}`,
          log.action,
          log.entity_type,
          log.entity_id,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_trail_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khambi-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
              isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
        >
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
        </select>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
        >
          <option value="all">All Entities</option>
          <option value="member">Members</option>
          <option value="claim">Claims</option>
          <option value="event">Events</option>
          <option value="staff">Staff</option>
        </select>

        <button
          onClick={exportLogs}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-khambi-accent text-black rounded-lg hover:bg-khambi-gold font-semibold text-sm whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div style={{ borderColor: "#B8935E", borderWidth: "1px" }} className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-khambi-accent" />
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{logs.length}</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total Actions</p>
            </div>
          </div>
        </div>

        <div style={{ borderColor: "#B8935E", borderWidth: "1px" }} className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-blue-500" />
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {new Set(logs.map((l) => l.user_id)).size}
              </p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Active Users</p>
            </div>
          </div>
        </div>

        <div style={{ borderColor: "#B8935E", borderWidth: "1px" }} className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-500" />
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {logs.filter((l) => new Date(l.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Last 24 Hours</p>
            </div>
          </div>
        </div>

        <div style={{ borderColor: "#B8935E", borderWidth: "1px" }} className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center gap-3">
            <Filter className="w-8 h-8 text-purple-500" />
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{filteredLogs.length}</p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Filtered Results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div style={{ borderColor: "#B8935E", borderWidth: "1px" }} className={`rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Timestamp</th>
                <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>User</th>
                <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Action</th>
                <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Entity</th>
                <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Details</th>
                <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.slice(0, 50).map((log) => (
                  <tr key={log.id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"} hover:bg-khambi-accent/5`}>
                    <td className={`py-3 px-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {log.users?.first_name} {log.users?.last_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                        <span>{getActionIcon(log.action)}</span>
                        {log.action}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="capitalize">{log.entity_type}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      ID: {log.entity_id.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setViewingDetails(log)}
                        className="p-1 hover:bg-khambi-accent/20 rounded"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-khambi-accent" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Audit Log Details</h3>

            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Timestamp</label>
                <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{new Date(viewingDetails.created_at).toLocaleString()}</p>
              </div>

              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>User</label>
                <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                  {viewingDetails.users?.first_name} {viewingDetails.users?.last_name} ({viewingDetails.users?.email})
                </p>
              </div>

              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Action</label>
                <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{viewingDetails.action}</p>
              </div>

              <div>
                <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Entity</label>
                <p className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                  {viewingDetails.entity_type} (ID: {viewingDetails.entity_id})
                </p>
              </div>

              {viewingDetails.old_values && (
                <div>
                  <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>Old Values</label>
                  <pre className={`text-xs p-3 rounded-lg mt-1 overflow-x-auto ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-900"}`}>
                    {JSON.stringify(viewingDetails.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {viewingDetails.new_values && (
                <div>
                  <label className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>New Values</label>
                  <pre className={`text-xs p-3 rounded-lg mt-1 overflow-x-auto ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-900"}`}>
                    {JSON.stringify(viewingDetails.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingDetails(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
