# API Service Layer - Quick Reference

## Usage Examples

### Members API

```typescript
import { membersApi } from '@/lib/api';

// Get all members
const members = await membersApi.getAll();

// Filter by policy type
const goldMembers = await membersApi.getAll({ policy_type: 'gold' });

// Search members
const results = await membersApi.getAll({ search: 'Thabo' });

// Get single member
const member = await membersApi.getById('uuid-here');

// Get by member number
const member = await membersApi.getByMemberNumber('KFS-2024-001');

// Create member
const newMember = await membersApi.create({
  member_number: 'KFS-2024-006',
  first_name: 'John',
  last_name: 'Doe',
  policy_type: 'silver',
  cover_amount: 20000,
  status: 'active',
  joined_date: '2024-12-12',
  phone: '082 123 4567',
  email: 'john@example.com'
});

// Update member
const updated = await membersApi.update('uuid-here', {
  phone: '082 999 8888'
});

// Delete member
await membersApi.delete('uuid-here');

// Get statistics
const stats = await membersApi.getStats();
// Returns: { total, active, bronze, silver, gold }
```

### Claims API

```typescript
import { claimsApi } from '@/lib/api';

// Get all claims
const claims = await claimsApi.getAll();

// Filter by status
const newClaims = await claimsApi.getAll({ status: 'new' });

// Get single claim
const claim = await claimsApi.getById('uuid-here');

// Create claim
const newClaim = await claimsApi.create({
  member_id: 'member-uuid',
  attending_member_id: 'attending-uuid',
  deceased_name: 'John Doe',
  amount: 25000,
  status: 'new',
  notes: 'All documents submitted'
});

// Update claim
const updated = await claimsApi.update('uuid-here', {
  status: 'processing'
});

// Approve claim
const approved = await claimsApi.approve('uuid-here', 'processor-uuid');

// Reject claim
const rejected = await claimsApi.reject('uuid-here', 'processor-uuid', 'Missing documents');

// Get statistics
const stats = await claimsApi.getStats();
// Returns: { total, new, processing, approved, avgProcessingTime }
```

### Events API

```typescript
import { eventsApi } from '@/lib/api';

// Get all events
const events = await eventsApi.getAll();

// Filter by status
const scheduled = await eventsApi.getAll({ status: 'scheduled' });

// Filter by date range
const upcoming = await eventsApi.getAll({
  date_from: '2024-12-01',
  date_to: '2024-12-31'
});

// Get single event
const event = await eventsApi.getById('uuid-here');

// Create event
const newEvent = await eventsApi.create({
  member_id: 'member-uuid',
  deceased_name: 'John Doe',
  event_date: '2024-12-25',
  event_time: '10:00:00',
  location: 'Pretoria West Cemetery',
  status: 'scheduled',
  manager_id: 'staff-uuid',
  progress: 0
});

// Update event
const updated = await eventsApi.update('uuid-here', {
  progress: 50,
  status: 'in_progress'
});

// Cancel event
const cancelled = await eventsApi.cancel('uuid-here');

// Assign staff to event
await eventsApi.assignStaff('event-uuid', 'staff-uuid');

// Get assigned staff
const staff = await eventsApi.getAssignedStaff('event-uuid');

// Get statistics
const stats = await eventsApi.getStats();
// Returns: { total, scheduled, inProgress, completed, thisMonth }
```

## React Component Examples

### Using in a Component with State

```typescript
import { useState, useEffect } from 'react';
import { membersApi } from '@/lib/api';

function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await membersApi.getAll();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {members.map(member => (
        <div key={member.id}>{member.first_name} {member.last_name}</div>
      ))}
    </div>
  );
}
```

### Using with Search

```typescript
function MembersSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (query.length > 2) {
      const data = await membersApi.getAll({ search: query });
      setResults(data);
    }
  };

  return (
    <div>
      <input 
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search members..."
      />
      {results.map(member => (
        <div key={member.id}>{member.first_name} {member.last_name}</div>
      ))}
    </div>
  );
}
```

## Error Handling

All API functions throw errors that should be caught:

```typescript
try {
  const member = await membersApi.getById('invalid-id');
} catch (error) {
  console.error('Failed to fetch member:', error);
  // Show error to user
}
```

## TypeScript Types

All types are exported from `src/lib/supabase.ts`:

```typescript
import type { Database } from '@/lib/supabase';

type Member = Database['public']['Tables']['members']['Row'];
type MemberInsert = Database['public']['Tables']['members']['Insert'];
type MemberUpdate = Database['public']['Tables']['members']['Update'];
```

## Direct Supabase Access

For advanced queries, use the Supabase client directly:

```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('members')
  .select('*, burial_events(*)')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(10);
```
