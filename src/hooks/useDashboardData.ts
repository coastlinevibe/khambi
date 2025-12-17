import { useState, useEffect } from 'react';
import {
  analyticsApi,
  membersApi,
  eventsApi,
  staffApi,
  claimsApi,
  contactsApi,
  checklistsApi,
} from '@/lib/api';

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          dashboardStats,
          membersData,
          eventsData,
          staffData,
          claimsData,
          contactsData,
          checklistsData,
        ] = await Promise.all([
          analyticsApi.getDashboardStats(),
          membersApi.getAll(),
          eventsApi.getAll(),
          staffApi.getAll(),
          claimsApi.getAll(),
          contactsApi.getAll(),
          checklistsApi.getAll(),
        ]);

        setStats(dashboardStats);
        setMembers(membersData || []);
        setEvents(eventsData || []);
        setStaff(staffData || []);
        setClaims(claimsData || []);
        setContacts(contactsData || []);
        setChecklists(checklistsData || []);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const dashboardStats = await analyticsApi.getDashboardStats();
      setStats(dashboardStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    stats,
    members,
    events,
    staff,
    claims,
    contacts,
    checklists,
    refetch,
  };
}
