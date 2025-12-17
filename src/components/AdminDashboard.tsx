import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAuth } from "../contexts/AuthContext";
import { membersApi, claimsApi, eventsApi, staffApi } from "../lib/api";
import LoadingSkeleton from "./ui/loading-skeleton";
import MemberForm from "./MemberForm";
import ClaimForm from "./ClaimForm";
import EventForm from "./EventForm";
import StaffForm from "./StaffForm";
import StaffAssignmentModal from "./StaffAssignmentModal";
import ChecklistModal from "./ChecklistModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import AnalyticsCharts from "./AnalyticsCharts";
import AuditTrail from "./AuditTrail";
import FileUploadModal from "./FileUploadModal";
import EventCalendar from "./EventCalendar";
import { 
  Users, Calendar, TrendingUp, FileText, Database, Settings, ChevronRight, 
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, ClipboardList,
  UserCheck, Edit, Trash2, Plus, Search, X, UserPlus,
  Filter, Download, Eye, MessageSquare, Image, Globe, Package, LogOut, Menu, Shield, Paperclip
} from "lucide-react";

const sidebarItems = [
  { id: "overview", label: "Dashboard Overview", icon: TrendingUp },
  { id: "members", label: "Member Management", icon: Users },
  { id: "events", label: "Burial Events", icon: Calendar },
  { id: "calendar", label: "Event Calendar", icon: Calendar },
  { id: "staff", label: "Staff Management", icon: Users },
  { id: "claims", label: "Fast Claims", icon: FileText },
  { id: "contacts", label: "Contact Database", icon: Database },
  { id: "checklist", label: "Event Checklists", icon: CheckCircle2 },
  { id: "analytics", label: "Analytics & Reports", icon: TrendingUp },
  { id: "audit", label: "Audit Trail", icon: Shield },
  { id: "cms", label: "Website CMS", icon: Settings },
];

const statsData = {
  overview: [
    { label: "Total Members", value: "2,847", change: "+12.5%", trend: "up", subtitle: "Active policy holders", detail: "Across all plan tiers" },
    { label: "Scheduled Burial Events", value: "23", change: "+8", trend: "up", subtitle: "Next 30 days", detail: "Gauteng region" },
    { label: "Pending Fast Claims", value: "12", change: "-3", trend: "down", subtitle: "Awaiting processing", detail: "Avg 2-day turnaround" },
    { label: "Staff on Duty", value: "18", change: "+2", trend: "up", subtitle: "Currently assigned", detail: "Optimal coverage" },
  ],
  members: [
    { label: "Total Members", value: "2,847", change: "+15.3%", trend: "up", subtitle: "Registered policy holders", detail: "Monthly growth rate" },
    { label: "Bronze Plans", value: "1,234", change: "+5%", trend: "up", subtitle: "R15,000 cover", detail: "43% of total members" },
    { label: "Silver Plans", value: "987", change: "+8%", trend: "up", subtitle: "R20,000 cover", detail: "35% of total members" },
    { label: "Gold Plans", value: "626", change: "+12%", trend: "up", subtitle: "R25,000 cover", detail: "22% of total members" },
  ],
  events: [
    { label: "This Month", value: "34", change: "+6", trend: "up", subtitle: "Burial events scheduled", detail: "Gauteng region" },
    { label: "Completed Events", value: "287", change: "+18%", trend: "up", subtitle: "This year", detail: "98% satisfaction rate" },
    { label: "In Progress", value: "8", change: "+2", trend: "up", subtitle: "Active burial events", detail: "Staff assigned" },
    { label: "Avg Event Duration", value: "3.5hrs", change: "-0.3hrs", trend: "down", subtitle: "Event efficiency", detail: "Process improved" },
  ],
  staff: [
    { label: "Total Staff", value: "45", change: "+3", trend: "up", subtitle: "Active employees", detail: "Full and part-time" },
    { label: "On Assignment", value: "18", change: "+5", trend: "up", subtitle: "Currently assigned", detail: "To burial events" },
    { label: "Available Staff", value: "27", change: "-2", trend: "down", subtitle: "Ready for assignment", detail: "Next 7 days" },
    { label: "Task Completion", value: "96%", change: "+2%", trend: "up", subtitle: "Checklist completion rate", detail: "Above target" },
  ],
  claims: [
    { label: "New Fast Claims", value: "12", change: "+4", trend: "up", subtitle: "This week", detail: "Fast claim submissions" },
    { label: "Processing", value: "8", change: "-2", trend: "down", subtitle: "Under review", detail: "Avg 1.5 days" },
    { label: "Approved Claims", value: "156", change: "+23", trend: "up", subtitle: "This month", detail: "92% approval rate" },
    { label: "Processing Time", value: "1.8 days", change: "-0.4", trend: "down", subtitle: "Avg turnaround", detail: "Faster than target" },
  ],
  contacts: [
    { label: "Total Contacts", value: "4,523", change: "+234", trend: "up", subtitle: "In database", detail: "Members & families" },
    { label: "Attending Members", value: "287", change: "+45", trend: "up", subtitle: "Active contacts", detail: "Managing arrangements" },
    { label: "Staff Contacts", value: "45", change: "+3", trend: "up", subtitle: "Employee records", detail: "Complete profiles" },
    { label: "General Contacts", value: "4,191", change: "+186", trend: "up", subtitle: "Other contacts", detail: "Suppliers & partners" },
  ],
  cms: [
    { label: "Page Views", value: "12.4K", change: "+18%", trend: "up", subtitle: "This month", detail: "Website traffic" },
    { label: "Active Pages", value: "24", change: "+2", trend: "up", subtitle: "Published content", detail: "Public website" },
    { label: "Last Updated", value: "2 days", change: "0", trend: "up", subtitle: "Content freshness", detail: "Regular updates" },
    { label: "Website Inquiries", value: "87", change: "+12", trend: "up", subtitle: "This week", detail: "Via contact forms" },
  ],
  checklist: [
    { label: "Active Checklists", value: "23", change: "+5", trend: "up", subtitle: "Ongoing events", detail: "All phases tracked" },
    { label: "Completed Tasks", value: "1,247", change: "+89", trend: "up", subtitle: "This month", detail: "96% completion rate" },
    { label: "Overdue Items", value: "3", change: "-7", trend: "down", subtitle: "Needs attention", detail: "Down from last week" },
    { label: "Avg Completion", value: "94%", change: "+3%", trend: "up", subtitle: "Per event", detail: "Above target" },
  ],
  analytics: [
    { label: "Revenue This Month", value: "R487K", change: "+15%", trend: "up", subtitle: "Policy sales", detail: "All tiers combined" },
    { label: "Customer Satisfaction", value: "98%", change: "+2%", trend: "up", subtitle: "Post-event surveys", detail: "287 responses" },
    { label: "Avg Response Time", value: "2.3hrs", change: "-0.5hrs", trend: "down", subtitle: "To inquiries", detail: "Improved efficiency" },
    { label: "Referral Rate", value: "34%", change: "+8%", trend: "up", subtitle: "New members", detail: "Word of mouth" },
  ],
};

// Demo data for tables
const demoMembers = [
  { id: "M001", name: "Thabo Mokoena", plan: "Gold", cover: "R25,000", status: "Active", joined: "2024-01-15", contact: "082 345 6789" },
  { id: "M002", name: "Nomsa Dlamini", plan: "Silver", cover: "R20,000", status: "Active", joined: "2024-02-20", contact: "083 456 7890" },
  { id: "M003", name: "Sipho Ndlovu", plan: "Bronze", cover: "R15,000", status: "Active", joined: "2024-03-10", contact: "084 567 8901" },
  { id: "M004", name: "Lerato Khumalo", plan: "Gold", cover: "R25,000", status: "Active", joined: "2024-01-28", contact: "081 234 5678" },
  { id: "M005", name: "Mandla Zulu", plan: "Silver", cover: "R20,000", status: "Active", joined: "2024-04-05", contact: "082 987 6543" },
];

const demoEvents = [
  { id: "E001", deceased: "Gogo Mbatha", date: "2024-12-15", time: "10:00", location: "Pretoria", status: "Scheduled", manager: "John Sithole", progress: 75 },
  { id: "E002", deceased: "Mr. Nkosi", date: "2024-12-18", time: "09:00", location: "Johannesburg", status: "Scheduled", manager: "Sarah Mthembu", progress: 60 },
  { id: "E003", deceased: "Mrs. Radebe", date: "2024-12-20", time: "11:00", location: "Centurion", status: "Scheduled", manager: "David Mahlangu", progress: 45 },
  { id: "E004", deceased: "Ntate Molefe", date: "2024-12-12", time: "10:30", location: "Soweto", status: "In Progress", manager: "John Sithole", progress: 90 },
  { id: "E005", deceased: "Mme Tshabalala", date: "2024-12-08", time: "09:30", location: "Sandton", status: "Completed", manager: "Sarah Mthembu", progress: 100 },
];

const demoStaff = [
  { id: "S001", name: "John Sithole", role: "Event Manager", status: "On Assignment", events: 2, completion: "98%", contact: "082 111 2222" },
  { id: "S002", name: "Sarah Mthembu", role: "Event Manager", status: "On Assignment", events: 2, completion: "96%", contact: "083 222 3333" },
  { id: "S003", name: "David Mahlangu", role: "Event Coordinator", status: "On Assignment", events: 1, completion: "94%", contact: "084 333 4444" },
  { id: "S004", name: "Grace Nkosi", role: "Driver", status: "Available", events: 0, completion: "100%", contact: "081 444 5555" },
  { id: "S005", name: "Peter Dube", role: "Catering Manager", status: "Available", events: 0, completion: "97%", contact: "082 555 6666" },
];

const demoClaims = [
  { id: "C001", member: "Thabo Mokoena", deceased: "Gogo Mokoena", submitted: "2024-12-05", status: "Approved", amount: "R25,000", processor: "Admin 1" },
  { id: "C002", member: "Nomsa Dlamini", deceased: "Mr. Dlamini", submitted: "2024-12-06", status: "Processing", amount: "R20,000", processor: "Admin 2" },
  { id: "C003", member: "Sipho Ndlovu", deceased: "Mrs. Ndlovu", submitted: "2024-12-07", status: "Processing", amount: "R15,000", processor: "Admin 1" },
  { id: "C004", member: "Lerato Khumalo", deceased: "Ntate Khumalo", submitted: "2024-12-04", status: "Approved", amount: "R25,000", processor: "Admin 3" },
  { id: "C005", member: "Mandla Zulu", deceased: "Mme Zulu", submitted: "2024-12-08", status: "New", amount: "R20,000", processor: "-" },
];

const demoContacts = [
  { id: "CT001", name: "Thabo Mokoena", type: "Member", relationship: "Policy Holder", phone: "082 345 6789", email: "thabo@email.com", events: 1 },
  { id: "CT002", name: "Nomsa Dlamini", type: "Attending Member", relationship: "Family", phone: "083 456 7890", email: "nomsa@email.com", events: 1 },
  { id: "CT003", name: "Sipho Ndlovu", type: "Member", relationship: "Policy Holder", phone: "084 567 8901", email: "sipho@email.com", events: 0 },
  { id: "CT004", name: "John Sithole", type: "Staff", relationship: "Event Manager", phone: "082 111 2222", email: "john@khambi.com", events: 5 },
  { id: "CT005", name: "Grace Funeral Supplies", type: "Supplier", relationship: "Partner", phone: "011 234 5678", email: "info@grace.co.za", events: 12 },
];

const demoChecklists = [
  { event: "E001 - Gogo Mbatha", phase: "Pre-Event", total: 15, completed: 12, overdue: 0, progress: 80 },
  { event: "E002 - Mr. Nkosi", phase: "Pre-Event", total: 15, completed: 9, overdue: 0, progress: 60 },
  { event: "E003 - Mrs. Radebe", phase: "Pre-Event", total: 15, completed: 7, overdue: 1, progress: 47 },
  { event: "E004 - Ntate Molefe", phase: "During Event", total: 20, completed: 18, overdue: 0, progress: 90 },
  { event: "E005 - Mme Tshabalala", phase: "Post-Event", total: 10, completed: 10, overdue: 0, progress: 100 },
];

const demoCMSPages = [
  { page: "Home Page", status: "Published", lastUpdated: "2024-12-05", views: "3,245", editor: "Admin 1" },
  { page: "Plans & Pricing", status: "Published", lastUpdated: "2024-12-03", views: "2,876", editor: "Admin 2" },
  { page: "Coffins Catalogue", status: "Published", lastUpdated: "2024-12-01", views: "1,543", editor: "Admin 1" },
  { page: "Burial Extras", status: "Published", lastUpdated: "2024-11-28", views: "987", editor: "Admin 3" },
  { page: "Contact Us", status: "Published", lastUpdated: "2024-12-04", views: "654", editor: "Admin 2" },
];

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch real data from API
  const { loading, error, stats, members, events, staff, claims, contacts, checklists, refetch } = useDashboardData();
  
  // Member form states
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deletingMember, setDeletingMember] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Claim form states
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [editingClaim, setEditingClaim] = useState<any>(null);
  const [deletingClaim, setDeletingClaim] = useState<any>(null);

  // Event form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);

  // Staff form states
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [deletingStaff, setDeletingStaff] = useState<any>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For immediate input display
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [policyFilter, setPolicyFilter] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Claim approval states
  const [approvingClaim, setApprovingClaim] = useState<any>(null);
  const [rejectingClaim, setRejectingClaim] = useState<any>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);

  // Staff assignment state
  const [assigningStaffToEvent, setAssigningStaffToEvent] = useState<any>(null);

  // Checklist state
  const [viewingChecklist, setViewingChecklist] = useState<any>(null);

  // Bulk operations state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // File upload state
  const [uploadingFor, setUploadingFor] = useState<{ type: string; id: string; name: string } | null>(null);

  // Export functionality
  const exportToCSV = (data: any[], filename: string, headers: string[], fields: string[]) => {
    // Create CSV header
    const csvHeader = headers.join(',');
    
    // Create CSV rows
    const csvRows = data.map(item => {
      return fields.map(field => {
        // Handle nested fields (e.g., 'members.first_name')
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        // Escape commas and quotes in values
        const stringValue = String(value || '');
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    // Combine header and rows
    const csv = [csvHeader, ...csvRows].join('\n');
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case 'members':
        exportToCSV(
          filteredData,
          `khambi_members_${timestamp}`,
          ['Member ID', 'First Name', 'Last Name', 'Policy Type', 'Cover Amount', 'Status', 'Phone', 'Email', 'Joined Date'],
          ['member_number', 'first_name', 'last_name', 'policy_type', 'cover_amount', 'status', 'phone', 'email', 'created_at']
        );
        break;
      
      case 'claims':
        exportToCSV(
          filteredData,
          `khambi_claims_${timestamp}`,
          ['Claim ID', 'Member Name', 'Deceased Name', 'Amount', 'Status', 'Submitted Date', 'Processed Date'],
          ['claim_number', 'members.first_name', 'deceased_name', 'amount', 'status', 'submitted_date', 'processed_date']
        );
        break;
      
      case 'events':
        exportToCSV(
          filteredData,
          `khambi_events_${timestamp}`,
          ['Event ID', 'Deceased Name', 'Event Date', 'Event Time', 'Location', 'Status', 'Progress', 'Manager'],
          ['event_number', 'deceased_name', 'event_date', 'event_time', 'location', 'status', 'progress', 'staff.employee_number']
        );
        break;
      
      case 'staff':
        exportToCSV(
          filteredData,
          `khambi_staff_${timestamp}`,
          ['Employee ID', 'First Name', 'Last Name', 'Role', 'Status', 'Phone', 'Completion Rate'],
          ['employee_number', 'users.first_name', 'users.last_name', 'role', 'status', 'phone', 'completion_rate']
        );
        break;
      
      case 'contacts':
        exportToCSV(
          contacts || [],
          `khambi_contacts_${timestamp}`,
          ['Contact ID', 'Name', 'Type', 'Relationship', 'Phone', 'Email', 'Events Count'],
          ['id', 'name', 'type', 'relationship', 'phone', 'email', 'events_count']
        );
        break;
      
      default:
        alert('Export not available for this tab');
    }
  };

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, policyFilter, activeTab]);

  // Clear selections when tab changes
  useEffect(() => {
    setSelectedItems(new Set());
  }, [activeTab]);

  // Show loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-khambi-accent text-black font-bold rounded-lg hover:bg-khambi-gold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Build dynamic stats data from real API data
  const dynamicStatsData = {
    overview: [
      { label: "Total Members", value: stats?.members?.total?.toString() || "0", change: "+12.5%", trend: "up", subtitle: "Active policy holders", detail: "Across all plan tiers" },
      { label: "Scheduled Burial Events", value: stats?.events?.scheduled?.toString() || "0", change: "+8", trend: "up", subtitle: "Next 30 days", detail: "Gauteng region" },
      { label: "Pending Fast Claims", value: stats?.claims?.new?.toString() || "0", change: "-3", trend: "down", subtitle: "Awaiting processing", detail: "Avg 2-day turnaround" },
      { label: "Staff on Duty", value: stats?.staff?.onAssignment?.toString() || "0", change: "+2", trend: "up", subtitle: "Currently assigned", detail: "Optimal coverage" },
    ],
    members: [
      { label: "Total Members", value: stats?.members?.total?.toString() || "0", change: "+15.3%", trend: "up", subtitle: "Registered policy holders", detail: "Monthly growth rate" },
      { label: "Bronze Plans", value: stats?.members?.bronze?.toString() || "0", change: "+5%", trend: "up", subtitle: "R15,000 cover", detail: `${stats?.members?.bronze ? Math.round((stats.members.bronze / stats.members.total) * 100) : 0}% of total` },
      { label: "Silver Plans", value: stats?.members?.silver?.toString() || "0", change: "+8%", trend: "up", subtitle: "R20,000 cover", detail: `${stats?.members?.silver ? Math.round((stats.members.silver / stats.members.total) * 100) : 0}% of total` },
      { label: "Gold Plans", value: stats?.members?.gold?.toString() || "0", change: "+12%", trend: "up", subtitle: "R25,000 cover", detail: `${stats?.members?.gold ? Math.round((stats.members.gold / stats.members.total) * 100) : 0}% of total` },
    ],
    events: [
      { label: "This Month", value: stats?.events?.thisMonth?.toString() || "0", change: "+6", trend: "up", subtitle: "Burial events scheduled", detail: "Gauteng region" },
      { label: "Completed Events", value: stats?.events?.completed?.toString() || "0", change: "+18%", trend: "up", subtitle: "This year", detail: "98% satisfaction rate" },
      { label: "In Progress", value: stats?.events?.inProgress?.toString() || "0", change: "+2", trend: "up", subtitle: "Active burial events", detail: "Staff assigned" },
      { label: "Total Events", value: stats?.events?.total?.toString() || "0", change: "+0", trend: "up", subtitle: "All time", detail: "Complete history" },
    ],
    staff: [
      { label: "Total Staff", value: stats?.staff?.total?.toString() || "0", change: "+3", trend: "up", subtitle: "Active employees", detail: "Full and part-time" },
      { label: "On Assignment", value: stats?.staff?.onAssignment?.toString() || "0", change: "+5", trend: "up", subtitle: "Currently assigned", detail: "To burial events" },
      { label: "Available Staff", value: stats?.staff?.available?.toString() || "0", change: "-2", trend: "down", subtitle: "Ready for assignment", detail: "Next 7 days" },
      { label: "Avg Completion", value: `${stats?.staff?.avgCompletionRate || "0"}%`, change: "+2%", trend: "up", subtitle: "Task completion rate", detail: "Above target" },
    ],
    claims: [
      { label: "New Fast Claims", value: stats?.claims?.new?.toString() || "0", change: "+4", trend: "up", subtitle: "This week", detail: "Fast claim submissions" },
      { label: "Processing", value: stats?.claims?.processing?.toString() || "0", change: "-2", trend: "down", subtitle: "Under review", detail: "Avg 1.5 days" },
      { label: "Approved Claims", value: stats?.claims?.approved?.toString() || "0", change: "+23", trend: "up", subtitle: "Total approved", detail: "92% approval rate" },
      { label: "Processing Time", value: `${stats?.claims?.avgProcessingTime || "0"} days`, change: "-0.4", trend: "down", subtitle: "Avg turnaround", detail: "Faster than target" },
    ],
    contacts: [
      { label: "Total Contacts", value: stats?.contacts?.total?.toString() || "0", change: "+234", trend: "up", subtitle: "In database", detail: "Members & families" },
      { label: "Attending Members", value: stats?.contacts?.attendingMembers?.toString() || "0", change: "+45", trend: "up", subtitle: "Active contacts", detail: "Managing arrangements" },
      { label: "Staff Contacts", value: stats?.contacts?.staff?.toString() || "0", change: "+3", trend: "up", subtitle: "Employee records", detail: "Complete profiles" },
      { label: "Member Contacts", value: stats?.contacts?.members?.toString() || "0", change: "+186", trend: "up", subtitle: "Policy holders", detail: "Primary contacts" },
    ],
    cms: [
      { label: "Page Views", value: "12.4K", change: "+18%", trend: "up", subtitle: "This month", detail: "Website traffic" },
      { label: "Active Pages", value: "24", change: "+2", trend: "up", subtitle: "Published content", detail: "Public website" },
      { label: "Last Updated", value: "2 days", change: "0", trend: "up", subtitle: "Content freshness", detail: "Regular updates" },
      { label: "Website Inquiries", value: "87", change: "+12", trend: "up", subtitle: "This week", detail: "Via contact forms" },
    ],
    checklist: [
      { label: "Active Checklists", value: events?.filter((e: any) => e.status !== 'completed' && e.status !== 'cancelled').length.toString() || "0", change: "+5", trend: "up", subtitle: "Ongoing events", detail: "All phases tracked" },
      { label: "Completed Tasks", value: stats?.checklists?.completed?.toString() || "0", change: "+89", trend: "up", subtitle: "Total completed", detail: `${stats?.checklists?.completionRate || 0}% completion rate` },
      { label: "Overdue Items", value: stats?.checklists?.overdue?.toString() || "0", change: "-7", trend: "down", subtitle: "Needs attention", detail: "Down from last week" },
      { label: "Total Tasks", value: stats?.checklists?.total?.toString() || "0", change: "+3%", trend: "up", subtitle: "All tasks", detail: "Across all events" },
    ],
    analytics: [
      { label: "Revenue", value: `R${((stats?.financial?.revenue || 0) / 1000).toFixed(0)}K`, change: "+15%", trend: "up", subtitle: "From claims", detail: "All tiers combined" },
      { label: "Customer Satisfaction", value: "98%", change: "+2%", trend: "up", subtitle: "Post-event surveys", detail: "287 responses" },
      { label: "Avg Response Time", value: "2.3hrs", change: "-0.5hrs", trend: "down", subtitle: "To inquiries", detail: "Improved efficiency" },
      { label: "Referral Rate", value: "34%", change: "+8%", trend: "up", subtitle: "New members", detail: "Word of mouth" },
    ],
  };

  const currentStats = dynamicStatsData[activeTab as keyof typeof dynamicStatsData] || dynamicStatsData.overview;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Member CRUD handlers
  const handleAddMember = () => {
    setEditingMember(null);
    setShowMemberForm(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    
    setDeleteLoading(true);
    try {
      await membersApi.delete(deletingMember.id);
      await refetch();
      setDeletingMember(null);
    } catch (err) {
      console.error('Failed to delete member:', err);
      alert('Failed to delete member');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMemberFormSuccess = async () => {
    await refetch();
  };

  // Claim CRUD handlers
  const handleAddClaim = () => {
    setEditingClaim(null);
    setShowClaimForm(true);
  };

  const handleEditClaim = (claim: any) => {
    setEditingClaim(claim);
    setShowClaimForm(true);
  };

  const handleDeleteClaim = async () => {
    if (!deletingClaim) return;
    
    setDeleteLoading(true);
    try {
      await claimsApi.delete(deletingClaim.id);
      await refetch();
      setDeletingClaim(null);
    } catch (err) {
      console.error('Failed to delete claim:', err);
      alert('Failed to delete claim');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClaimFormSuccess = async () => {
    await refetch();
  };

  // Claim approval handlers
  const handleApproveClaim = async () => {
    if (!approvingClaim || !user) return;
    
    setApprovalLoading(true);
    try {
      await claimsApi.approve(approvingClaim.id, user.id);
      await refetch();
      setApprovingClaim(null);
    } catch (err) {
      console.error('Failed to approve claim:', err);
      alert('Failed to approve claim');
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleRejectClaim = async () => {
    if (!rejectingClaim || !user) return;
    
    setApprovalLoading(true);
    try {
      await claimsApi.reject(rejectingClaim.id, user.id, rejectionNotes);
      await refetch();
      setRejectingClaim(null);
      setRejectionNotes('');
    } catch (err) {
      console.error('Failed to reject claim:', err);
      alert('Failed to reject claim');
    } finally {
      setApprovalLoading(false);
    }
  };

  // Event CRUD handlers
  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;
    
    setDeleteLoading(true);
    try {
      await eventsApi.delete(deletingEvent.id);
      await refetch();
      setDeletingEvent(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Failed to delete event');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEventFormSuccess = async () => {
    await refetch();
  };

  // Staff CRUD handlers
  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowStaffForm(true);
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff(staffMember);
    setShowStaffForm(true);
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaff) return;
    
    setDeleteLoading(true);
    try {
      await staffApi.delete(deletingStaff.id);
      await refetch();
      setDeletingStaff(null);
    } catch (err) {
      console.error('Failed to delete staff:', err);
      alert('Failed to delete staff member');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStaffFormSuccess = async () => {
    await refetch();
  };

  // Bulk operations handlers
  const handleSelectAll = () => {
    const currentData = getFilteredData();
    if (selectedItems.size === currentData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(currentData.map((item: any) => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkAction = (action: string) => {
    if (selectedItems.size === 0) {
      alert('Please select items first');
      return;
    }
    setBulkAction(action);
    setShowBulkConfirm(true);
  };

  const executeBulkAction = async () => {
    setBulkLoading(true);
    try {
      const itemIds = Array.from(selectedItems);
      
      switch (bulkAction) {
        case 'delete':
          // Delete selected items
          for (const id of itemIds) {
            switch (activeTab) {
              case 'members':
                await membersApi.delete(id);
                break;
              case 'claims':
                await claimsApi.delete(id);
                break;
              case 'events':
                await eventsApi.delete(id);
                break;
              case 'staff':
                await staffApi.delete(id);
                break;
            }
          }
          break;
        
        case 'activate':
        case 'suspend':
        case 'cancel':
          // Update status for members
          if (activeTab === 'members') {
            for (const id of itemIds) {
              await membersApi.update(id, { status: bulkAction === 'activate' ? 'active' : bulkAction === 'suspend' ? 'suspended' : 'cancelled' });
            }
          }
          break;
        
        case 'approve':
        case 'reject':
          // Update status for claims
          if (activeTab === 'claims' && user) {
            for (const id of itemIds) {
              if (bulkAction === 'approve') {
                await claimsApi.approve(id, user.id);
              } else {
                await claimsApi.reject(id, user.id, 'Bulk rejection');
              }
            }
          }
          break;
        
        case 'complete':
        case 'cancel_event':
          // Update status for events
          if (activeTab === 'events') {
            for (const id of itemIds) {
              await eventsApi.update(id, { 
                status: bulkAction === 'complete' ? 'completed' : 'cancelled',
                progress: bulkAction === 'complete' ? 100 : undefined
              });
            }
          }
          break;
        
        case 'available':
        case 'on_assignment':
        case 'off_duty':
          // Update status for staff
          if (activeTab === 'staff') {
            for (const id of itemIds) {
              await staffApi.update(id, { status: bulkAction });
            }
          }
          break;
      }
      
      await refetch();
      setSelectedItems(new Set());
      setShowBulkConfirm(false);
      setBulkAction('');
    } catch (err) {
      console.error('Bulk action failed:', err);
      alert('Some operations failed. Please try again.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Filter and search functions
  const filterData = (data: any[], type: 'members' | 'claims' | 'events' | 'staff') => {
    if (!data) return [];
    
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        switch (type) {
          case 'members':
            return (
              item.first_name?.toLowerCase().includes(query) ||
              item.last_name?.toLowerCase().includes(query) ||
              item.member_number?.toLowerCase().includes(query) ||
              item.phone?.toLowerCase().includes(query) ||
              item.email?.toLowerCase().includes(query)
            );
          case 'claims':
            return (
              item.claim_number?.toLowerCase().includes(query) ||
              item.deceased_name?.toLowerCase().includes(query) ||
              item.members?.first_name?.toLowerCase().includes(query) ||
              item.members?.last_name?.toLowerCase().includes(query)
            );
          case 'events':
            return (
              item.event_number?.toLowerCase().includes(query) ||
              item.deceased_name?.toLowerCase().includes(query) ||
              item.location?.toLowerCase().includes(query)
            );
          case 'staff':
            return (
              item.employee_number?.toLowerCase().includes(query) ||
              item.users?.first_name?.toLowerCase().includes(query) ||
              item.users?.last_name?.toLowerCase().includes(query) ||
              item.role?.toLowerCase().includes(query) ||
              item.phone?.toLowerCase().includes(query)
            );
          default:
            return true;
        }
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply policy filter (members only)
    if (type === 'members' && policyFilter !== 'all') {
      filtered = filtered.filter(item => item.policy_type === policyFilter);
    }

    return filtered;
  };

  // Get filtered data for current tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'members':
        return filterData(members || [], 'members');
      case 'claims':
        return filterData(claims || [], 'claims');
      case 'events':
        return filterData(events || [], 'events');
      case 'staff':
        return filterData(staff || [], 'staff');
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  
  // Use filtered data for searchable tabs, original data for others
  const displayMembers = activeTab === 'members' ? filteredData : members;
  const displayClaims = activeTab === 'claims' ? filteredData : claims;
  const displayEvents = activeTab === 'events' ? filteredData : events;
  const displayStaff = activeTab === 'staff' ? filteredData : staff;

  // Pagination logic
  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: any[]) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Pagination component
  const renderPagination = (data: any[]) => {
    const totalPages = getTotalPages(data);
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Show
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg border ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            per page
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            } ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
          >
            First
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            } ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
          >
            Previous
          </button>

          {startPage > 1 && (
            <span className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
          )}

          {pages.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === page
                  ? 'bg-khambi-accent text-black border-khambi-accent font-semibold'
                  : isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <span className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            } ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
          >
            Next
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg border ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            } ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
          >
            Last
          </button>
        </div>

        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Page {currentPage} of {totalPages} ({data.length} total)
        </div>
      </div>
    );
  };

  const renderTableContent = () => {
    switch (activeTab) {
      case "members":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`py-3 px-4 w-12`}>
                    <input
                      type="checkbox"
                      checked={displayMembers && displayMembers.length > 0 && selectedItems.size === displayMembers.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Member ID</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Plan</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cover</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Contact</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayMembers && displayMembers.length > 0 ? getPaginatedData(displayMembers).map((member: any) => (
                  <tr key={member.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(member.id)}
                        onChange={() => handleSelectItem(member.id)}
                        className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{member.member_number}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.first_name} {member.last_name}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        member.policy_type === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        member.policy_type === 'silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>{member.policy_type.charAt(0).toUpperCase() + member.policy_type.slice(1)}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>R{member.cover_amount.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{member.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditMember(member)}
                          className="p-1 hover:bg-khambi-accent/20 rounded"
                          title="Edit member"
                        >
                          <Edit className="w-4 h-4 text-khambi-accent" />
                        </button>
                        <button 
                          onClick={() => setDeletingMember(member)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete member"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {displayMembers && displayMembers.length > 0 && renderPagination(displayMembers)}
          </div>
        );

      case "events":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`py-3 px-4 w-12`}>
                    <input
                      type="checkbox"
                      checked={displayEvents && displayEvents.length > 0 && selectedItems.size === displayEvents.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Event ID</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Deceased</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Date & Time</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Location</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Manager</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Progress</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayEvents && displayEvents.length > 0 ? getPaginatedData(displayEvents).map((event: any) => (
                  <tr key={event.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(event.id)}
                        onChange={() => handleSelectItem(event.id)}
                        className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{event.event_number}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.deceased_name}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{event.event_date} {event.event_time}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{event.location}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{event.staff?.employee_number || 'Unassigned'}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1).replace('_', ' ')}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-khambi-accent" style={{ width: `${event.progress}%` }}></div>
                        </div>
                        <span className="text-xs">{event.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setViewingChecklist(event)}
                          className="p-1 hover:bg-purple-100 rounded"
                          title="View/manage checklist"
                        >
                          <ClipboardList className="w-4 h-4 text-purple-600" />
                        </button>
                        <button 
                          onClick={() => setUploadingFor({ type: 'event', id: event.id, name: `Event ${event.event_number}` })}
                          className="p-1 hover:bg-purple-100 rounded"
                          title="Manage documents"
                        >
                          <Paperclip className="w-4 h-4 text-purple-600" />
                        </button>
                        <button 
                          onClick={() => setAssigningStaffToEvent(event)}
                          className="p-1 hover:bg-blue-100 rounded"
                          title="Manage staff assignments"
                        >
                          <UserPlus className="w-4 h-4 text-blue-600" />
                        </button>
                        <button 
                          onClick={() => handleEditEvent(event)}
                          className="p-1 hover:bg-khambi-accent/20 rounded"
                          title="Edit event"
                        >
                          <Edit className="w-4 h-4 text-khambi-accent" />
                        </button>
                        <button 
                          onClick={() => setDeletingEvent(event)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {displayEvents && displayEvents.length > 0 && renderPagination(displayEvents)}
          </div>
        );

      case "staff":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`py-3 px-4 w-12`}>
                    <input
                      type="checkbox"
                      checked={displayStaff && displayStaff.length > 0 && selectedItems.size === displayStaff.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Staff ID</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Active Events</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Completion</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Contact</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayStaff && displayStaff.length > 0 ? getPaginatedData(displayStaff).map((staffMember: any) => (
                  <tr key={staffMember.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(staffMember.id)}
                        onChange={() => handleSelectItem(staffMember.id)}
                        className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{staffMember.employee_number}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{staffMember.users?.first_name || 'N/A'} {staffMember.users?.last_name || ''}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{staffMember.role}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        staffMember.status === 'on_assignment' ? 'bg-blue-100 text-blue-800' :
                        staffMember.status === 'available' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{staffMember.status.charAt(0).toUpperCase() + staffMember.status.slice(1).replace('_', ' ')}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>-</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{staffMember.completion_rate}%</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{staffMember.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditStaff(staffMember)}
                          className="p-1 hover:bg-khambi-accent/20 rounded"
                          title="Edit staff"
                        >
                          <Edit className="w-4 h-4 text-khambi-accent" />
                        </button>
                        <button 
                          onClick={() => setDeletingStaff(staffMember)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete staff"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No staff found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {displayStaff && displayStaff.length > 0 && renderPagination(displayStaff)}
          </div>
        );

      case "claims":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`py-3 px-4 w-12`}>
                    <input
                      type="checkbox"
                      checked={displayClaims && displayClaims.length > 0 && selectedItems.size === displayClaims.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Claim ID</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Member</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Deceased</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Submitted</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Amount</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Processor</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayClaims && displayClaims.length > 0 ? getPaginatedData(displayClaims).map((claim: any) => (
                  <tr key={claim.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(claim.id)}
                        onChange={() => handleSelectItem(claim.id)}
                        className="w-4 h-4 text-khambi-accent focus:ring-khambi-accent border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{claim.claim_number}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{claim.members?.first_name || 'N/A'} {claim.members?.last_name || ''}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{claim.deceased_name}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{new Date(claim.submitted_date).toLocaleDateString()}</td>
                    <td className={`py-3 px-4 text-sm font-semibold ${isDark ? 'text-khambi-accent' : 'text-khambi-gold'}`}>R{claim.amount.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                        claim.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>{claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{claim.processor_id ? 'Assigned' : 'Unassigned'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {/* Show approve/reject buttons for new and processing claims */}
                        {(claim.status === 'new' || claim.status === 'processing') && (
                          <>
                            <button 
                              onClick={() => setApprovingClaim(claim)}
                              className="p-1 hover:bg-green-100 rounded"
                              title="Approve claim"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </button>
                            <button 
                              onClick={() => setRejectingClaim(claim)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Reject claim"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setUploadingFor({ type: 'claim', id: claim.id, name: `Claim ${claim.claim_number}` })}
                          className="p-1 hover:bg-purple-100 rounded"
                          title="Manage documents"
                        >
                          <Paperclip className="w-4 h-4 text-purple-600" />
                        </button>
                        <button 
                          onClick={() => handleEditClaim(claim)}
                          className="p-1 hover:bg-khambi-accent/20 rounded"
                          title="Edit claim"
                        >
                          <Edit className="w-4 h-4 text-khambi-accent" />
                        </button>
                        <button 
                          onClick={() => setDeletingClaim(claim)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete claim"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No claims found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {displayClaims && displayClaims.length > 0 && renderPagination(displayClaims)}
          </div>
        );

      case "contacts":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Contact ID</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Relationship</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Events</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts && contacts.length > 0 ? contacts.slice(0, 10).map((contact: any) => (
                  <tr key={contact.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{contact.id.substring(0, 8)}</td>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{contact.name}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        contact.type === 'member' ? 'bg-blue-100 text-blue-800' :
                        contact.type === 'staff' ? 'bg-purple-100 text-purple-800' :
                        contact.type === 'attending_member' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{contact.type.charAt(0).toUpperCase() + contact.type.slice(1).replace('_', ' ')}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{contact.relationship || 'N/A'}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{contact.phone || 'N/A'}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{contact.email || 'N/A'}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{contact.events_count}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-khambi-accent/20 rounded"><Eye className="w-4 h-4 text-khambi-accent" /></button>
                        <button className="p-1 hover:bg-khambi-accent/20 rounded"><MessageSquare className="w-4 h-4 text-khambi-accent" /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case "checklist":
        // Group checklists by event
        const eventChecklistSummary = events?.map((event: any) => {
          const eventChecklists = checklists?.filter((c: any) => c.event_id === event.id) || [];
          const total = eventChecklists.length;
          const completed = eventChecklists.filter((c: any) => c.completed).length;
          const now = new Date();
          const overdue = eventChecklists.filter((c: any) => 
            !c.completed && c.due_date && new Date(c.due_date) < now
          ).length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          // Determine current phase
          const phases = eventChecklists.map((c: any) => c.phase);
          const currentPhase = phases.includes('during_event') ? 'During Event' :
                              phases.includes('post_event') ? 'Post Event' : 'Pre-Event';
          
          return {
            event,
            total,
            completed,
            overdue,
            progress,
            currentPhase,
            hasChecklist: total > 0
          };
        }) || [];

        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Event</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phase</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Tasks</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Completed</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Overdue</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Progress</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventChecklistSummary.length > 0 ? eventChecklistSummary.map((summary: any) => (
                  <tr key={summary.event.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {summary.event.event_number} - {summary.event.deceased_name}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {summary.hasChecklist ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          summary.currentPhase === 'Pre-Event' ? 'bg-yellow-100 text-yellow-800' :
                          summary.currentPhase === 'During Event' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>{summary.currentPhase}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">No checklist</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {summary.hasChecklist ? summary.total : '-'}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {summary.hasChecklist ? summary.completed : '-'}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {summary.hasChecklist && summary.overdue > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">{summary.overdue}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {summary.hasChecklist ? (
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-khambi-accent" style={{ width: `${summary.progress}%` }}></div>
                          </div>
                          <span className="text-xs">{summary.progress}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setViewingChecklist(summary.event)}
                          className="p-1 hover:bg-purple-100 rounded"
                          title="View/manage checklist"
                        >
                          <ClipboardList className="w-4 h-4 text-purple-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No events with checklists found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case "cms":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Page</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Updated</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Page Views</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Editor</th>
                  <th className={`text-left py-3 px-4 font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demoCMSPages.map((page, idx) => (
                  <tr key={idx} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-khambi-accent/5`}>
                    <td className={`py-3 px-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{page.page}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">{page.status}</span>
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{page.lastUpdated}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{page.views}</td>
                    <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{page.editor}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-khambi-accent/20 rounded"><Eye className="w-4 h-4 text-khambi-accent" /></button>
                        <button className="p-1 hover:bg-khambi-accent/20 rounded"><Edit className="w-4 h-4 text-khambi-accent" /></button>
                        <button className="p-1 hover:bg-khambi-accent/20 rounded"><Globe className="w-4 h-4 text-khambi-accent" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "analytics":
        return <AnalyticsCharts members={members || []} events={events || []} claims={claims || []} staff={staff || []} />;

      case "audit":
        return <AuditTrail />;

      case "calendar":
        return (
          <EventCalendar
            events={events || []}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={(event) => setDeletingEvent(event)}
          />
        );

      default:
        return (
          <div className="space-y-3">
            {[
              { icon: Users, title: "New Member Registration", desc: "Thabo Mokoena joined Gold Plan", time: "2h ago" },
              { icon: Calendar, title: "Burial Event Scheduled", desc: "Gogo Mbatha - Dec 15, 2024", time: "3h ago" },
              { icon: FileText, title: "Fast Claim Approved", desc: "Claim C001 - R25,000 processed", time: "5h ago" },
              { icon: CheckCircle2, title: "Checklist Completed", desc: "E005 Post-Event tasks finished", time: "6h ago" },
              { icon: UserCheck, title: "Staff Assignment", desc: "John Sithole assigned to E001", time: "8h ago" },
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className={`flex items-center justify-between py-3 border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-khambi-accent/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-khambi-accent" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.desc}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen border-r flex flex-col transition-transform duration-300 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-6">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Khambi Admin
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Management Portal
            </p>
          </div>
          
          <nav className="px-3 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                    isActive
                      ? 'bg-khambi-accent text-black font-semibold'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t" style={{ borderColor: '#B8935E' }}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isDark
                  ? 'text-gray-400 hover:bg-red-900/20 hover:text-red-400'
                  : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto overflow-y-auto">
          {/* Mobile Header with Hamburger */}
          <div className={`lg:hidden sticky top-0 z-30 px-4 py-3 border-b ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Menu className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Khambi Admin
              </h1>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {sidebarItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Monitor and manage your funeral services operations
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => {
                  if (activeTab === 'members') handleAddMember();
                  else if (activeTab === 'claims') handleAddClaim();
                  else if (activeTab === 'events') handleAddEvent();
                  else if (activeTab === 'staff') handleAddStaff();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-khambi-accent text-black rounded-lg hover:bg-khambi-gold font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
              <button 
                onClick={handleExport}
                disabled={activeTab === 'overview' || activeTab === 'cms' || activeTab === 'analytics' || activeTab === 'checklist'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  activeTab === 'overview' || activeTab === 'cms' || activeTab === 'analytics' || activeTab === 'checklist'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } ${
                  isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title={activeTab === 'overview' || activeTab === 'cms' || activeTab === 'analytics' || activeTab === 'checklist' ? 'Export not available for this tab' : 'Export to CSV'}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {currentStats.map((stat, index) => (
              <div
                key={index}
                style={{ borderColor: '#B8935E', borderWidth: '1px' }}
                className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </p>
                    <h3 className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trend === 'up'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1`}>
                  {stat.subtitle}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Bulk Action Bar */}
          {selectedItems.size > 0 && (activeTab === 'members' || activeTab === 'claims' || activeTab === 'events' || activeTab === 'staff') && (
            <div className="mb-4 p-3 sm:p-4 bg-khambi-accent/10 border border-khambi-accent rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-khambi-gold text-sm sm:text-base">
                    {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setSelectedItems(new Set())}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                {activeTab === 'members' && (
                  <>
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="px-2 sm:px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkAction('suspend')}
                      className="px-2 sm:px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Suspend
                    </button>
                  </>
                )}
                {activeTab === 'claims' && (
                  <>
                    <button
                      onClick={() => handleBulkAction('approve')}
                      className="px-2 sm:px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Approve All
                    </button>
                    <button
                      onClick={() => handleBulkAction('reject')}
                      className="px-2 sm:px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Reject All
                    </button>
                  </>
                )}
                {activeTab === 'events' && (
                  <>
                    <button
                      onClick={() => handleBulkAction('complete')}
                      className="px-2 sm:px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleBulkAction('cancel_event')}
                      className="px-2 sm:px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {activeTab === 'staff' && (
                  <>
                    <button
                      onClick={() => handleBulkAction('available')}
                      className="px-2 sm:px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleBulkAction('off_duty')}
                      className="px-2 sm:px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Off Duty
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-2 sm:px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm whitespace-nowrap"
                >
                  Delete
                </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div
            style={{ borderColor: '#B8935E', borderWidth: '1px' }}
            className={`rounded-xl p-3 sm:p-4 lg:p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-6`}
          >
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activeTab === 'overview' ? 'Recent Activity' :
                   activeTab === 'members' ? 'Member Records' :
                   activeTab === 'events' ? 'Burial Events' :
                   activeTab === 'staff' ? 'Staff Directory' :
                   activeTab === 'claims' ? 'Fast Claims' :
                   activeTab === 'contacts' ? 'Contact Database' :
                   activeTab === 'checklist' ? 'Event Checklists' :
                   activeTab === 'cms' ? 'Website Pages' :
                   'Analytics Data'}
                </h3>
                {(activeTab === 'members' || activeTab === 'claims' || activeTab === 'events' || activeTab === 'staff') && (
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredData.length} of {
                      activeTab === 'members' ? members?.length || 0 :
                      activeTab === 'claims' ? claims?.length || 0 :
                      activeTab === 'events' ? events?.length || 0 :
                      activeTab === 'staff' ? staff?.length || 0 : 0
                    } records
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search Input */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className={`w-full sm:w-auto pl-10 pr-4 py-2 rounded-lg border text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                  />
                </div>

                {/* Status Filter */}
                {(activeTab === 'members' || activeTab === 'claims' || activeTab === 'events' || activeTab === 'staff') && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg border text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                  >
                    <option value="all">All Status</option>
                    {activeTab === 'members' && (
                      <>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
                    {activeTab === 'claims' && (
                      <>
                        <option value="new">New</option>
                        <option value="processing">Processing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </>
                    )}
                    {activeTab === 'events' && (
                      <>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
                    {activeTab === 'staff' && (
                      <>
                        <option value="available">Available</option>
                        <option value="on_assignment">On Assignment</option>
                        <option value="off_duty">Off Duty</option>
                      </>
                    )}
                  </select>
                )}

                {/* Policy Filter (Members only) */}
                {activeTab === 'members' && (
                  <select
                    value={policyFilter}
                    onChange={(e) => setPolicyFilter(e.target.value)}
                    className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg border text-sm ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-khambi-accent`}
                  >
                    <option value="all">All Plans</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                  </select>
                )}

                {/* Clear Filters Button */}
                {(searchQuery || statusFilter !== 'all' || policyFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchInput('');
                      setStatusFilter('all');
                      setPolicyFilter('all');
                    }}
                    className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg border text-sm ${
                      isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
              {renderTableContent()}
            </div>
          </div>

          {/* Feature Capabilities Grid */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Users, title: "Member Management", desc: "Add, edit, remove members. Manage policies and family contacts.", color: "blue" },
                { icon: Calendar, title: "Burial Event Management", desc: "Create, schedule, and manage burial events with full timeline tracking.", color: "purple" },
                { icon: Users, title: "Staff Management", desc: "Manage staff roles, permissions, and assignments to burial events.", color: "green" },
                { icon: CheckCircle2, title: "Event Checklists", desc: "Pre-event, during, and post-event checklists with task tracking.", color: "yellow" },
                { icon: FileText, title: "Fast Claims Processing", desc: "Quick attending member registration and claim processing.", color: "red" },
                { icon: Database, title: "Contact Database", desc: "Unified database for members, attendees, staff, and suppliers.", color: "indigo" },
                { icon: Clock, title: "Scheduling & Reminders", desc: "Task scheduling with SMS/Email/WhatsApp reminders.", color: "pink" },
                { icon: TrendingUp, title: "Analytics & Reports", desc: "Performance metrics, revenue tracking, and operational insights.", color: "orange" },
                { icon: Settings, title: "Website CMS", desc: "Manage website content, policies, caskets, extras, and images.", color: "teal" },
                { icon: Package, title: "Casket & Extras Manager", desc: "Manage coffin catalogue and burial extras inventory.", color: "cyan" },
                { icon: Image, title: "AI Document Scanner", desc: "Smart ID and death certificate scanning with validation.", color: "violet" },
                { icon: MessageSquare, title: "Khambi Ai Assistant", desc: "AI-powered chatbot for customer inquiries and support.", color: "rose" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{ borderColor: '#B8935E', borderWidth: '1px' }}
                  className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-all`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Member Form Modal */}
      {showMemberForm && (
        <MemberForm
          member={editingMember}
          onClose={() => {
            setShowMemberForm(false);
            setEditingMember(null);
          }}
          onSuccess={handleMemberFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingMember && (
        <DeleteConfirmDialog
          title="Delete Member"
          message={`Are you sure you want to delete ${deletingMember.first_name} ${deletingMember.last_name}? This action cannot be undone.`}
          onConfirm={handleDeleteMember}
          onCancel={() => setDeletingMember(null)}
          loading={deleteLoading}
        />
      )}

      {/* Claim Form Modal */}
      {showClaimForm && (
        <ClaimForm
          claim={editingClaim}
          onClose={() => {
            setShowClaimForm(false);
            setEditingClaim(null);
          }}
          onSuccess={handleClaimFormSuccess}
        />
      )}

      {/* Delete Claim Confirmation Modal */}
      {deletingClaim && (
        <DeleteConfirmDialog
          title="Delete Claim"
          message={`Are you sure you want to delete claim ${deletingClaim.claim_number} for ${deletingClaim.deceased_name}? This action cannot be undone.`}
          onConfirm={handleDeleteClaim}
          onCancel={() => setDeletingClaim(null)}
          loading={deleteLoading}
        />
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          onSuccess={handleEventFormSuccess}
        />
      )}

      {/* Delete Event Confirmation Modal */}
      {deletingEvent && (
        <DeleteConfirmDialog
          title="Delete Burial Event"
          message={`Are you sure you want to delete event ${deletingEvent.event_number} for ${deletingEvent.deceased_name}? This action cannot be undone.`}
          onConfirm={handleDeleteEvent}
          onCancel={() => setDeletingEvent(null)}
          loading={deleteLoading}
        />
      )}

      {/* Staff Form Modal */}
      {showStaffForm && (
        <StaffForm
          staff={editingStaff}
          onClose={() => {
            setShowStaffForm(false);
            setEditingStaff(null);
          }}
          onSuccess={handleStaffFormSuccess}
        />
      )}

      {/* Delete Staff Confirmation Modal */}
      {deletingStaff && (
        <DeleteConfirmDialog
          title="Delete Staff Member"
          message={`Are you sure you want to delete ${deletingStaff.employee_number}? This action cannot be undone.`}
          onConfirm={handleDeleteStaff}
          onCancel={() => setDeletingStaff(null)}
          loading={deleteLoading}
        />
      )}

      {/* Approve Claim Confirmation Modal */}
      {approvingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Claim</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve claim <strong>{approvingClaim.claim_number}</strong> for <strong>{approvingClaim.deceased_name}</strong>?
              <br /><br />
              Amount: <strong className="text-green-600">R{approvingClaim.amount.toLocaleString()}</strong>
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setApprovingClaim(null)}
                disabled={approvalLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveClaim}
                disabled={approvalLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {approvalLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Assignment Modal */}
      {assigningStaffToEvent && (
        <StaffAssignmentModal
          event={assigningStaffToEvent}
          onClose={() => setAssigningStaffToEvent(null)}
          onSuccess={refetch}
        />
      )}

      {/* Checklist Modal */}
      {viewingChecklist && (
        <ChecklistModal
          event={viewingChecklist}
          onClose={() => setViewingChecklist(null)}
          onSuccess={refetch}
        />
      )}

      {/* Reject Claim Modal */}
      {rejectingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Claim</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to reject claim <strong>{rejectingClaim.claim_number}</strong> for <strong>{rejectingClaim.deceased_name}</strong>?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setRejectingClaim(null);
                  setRejectionNotes('');
                }}
                disabled={approvalLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectClaim}
                disabled={approvalLoading || !rejectionNotes.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {approvalLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Bulk Action</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to <strong>{bulkAction.replace('_', ' ')}</strong> {selectedItems.size} selected item{selectedItems.size > 1 ? 's' : ''}?
              {bulkAction === 'delete' && (
                <span className="block mt-2 text-red-600 font-semibold">
                  This action cannot be undone.
                </span>
              )}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowBulkConfirm(false);
                  setBulkAction('');
                }}
                disabled={bulkLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkAction}
                disabled={bulkLoading}
                className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                  bulkAction === 'delete' || bulkAction === 'reject' || bulkAction === 'cancel_event'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-khambi-accent hover:bg-khambi-gold text-black'
                }`}
              >
                {bulkLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {uploadingFor && (
        <FileUploadModal
          entityType={uploadingFor.type}
          entityId={uploadingFor.id}
          entityName={uploadingFor.name}
          onClose={() => setUploadingFor(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
