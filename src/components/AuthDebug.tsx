import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const { user, session, loading, isAdmin, isManager, isStaff } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Info</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Loading State</h2>
          <p>{loading ? 'Loading...' : 'Loaded'}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">User</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Session</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Role Checks</h2>
          <p>isAdmin: {isAdmin ? 'YES' : 'NO'}</p>
          <p>isManager: {isManager ? 'YES' : 'NO'}</p>
          <p>isStaff: {isStaff ? 'YES' : 'NO'}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">User Metadata</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(user?.user_metadata, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
