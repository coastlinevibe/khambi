import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt:', { email, password: '***' });

    try {
      const { error } = await signIn(email, password);
      console.log('Login response:', { error });
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        setLoading(false);
      } else {
        console.log('Login successful, navigating to dashboard');
        // Don't set loading to false - let the navigation happen
        // The auth state will update and trigger navigation
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/l1.jpg"
            alt="Khambi Funeral Services"
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-400">
            Sign in to access the management dashboard
          </p>
        </div>

        {/* Login Form */}
        <div
          className="bg-white rounded-xl p-8"
          style={{ borderColor: '#B8935E', borderWidth: '2px' }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
                placeholder="admin@khambifunerals.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-khambi-accent focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-khambi-accent text-black font-bold py-3 rounded-lg hover:bg-khambi-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-khambi-accent transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4 text-sm">
          <p className="text-gray-400 mb-2">Demo Credentials:</p>
          <p className="text-white font-mono">
            Email: grace.admin@khambifunerals.com
          </p>
          <p className="text-white font-mono">Password: (set in Supabase)</p>
        </div>
      </div>
    </div>
  );
}
