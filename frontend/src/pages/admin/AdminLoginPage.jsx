import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { SqizzyLogo } from '../../components/common/SqizzyLogo';
import { SEO } from '../../components/common/SEO';

export const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the admin password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#140803] text-[#FFFBEB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title="SQIZZY Admin Portal" description="Private administration portal." />

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center mb-4">
          <SqizzyLogo size="lg" isDark={true} />
        </div>
        <h2 className="text-xl font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
          Analytics & Insights Portal
        </h2>
        <p className="mt-1 text-xs text-[#A88B77]">
          Restricted administrative access. Authenticated sessions only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#1F0E06] py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-[#3D2517]">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A88B77] mb-2">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#785A48] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#140803] border border-[#3D2517] text-sm text-[#FFFBEB] placeholder-[#5B290B] focus:outline-none focus:ring-2 focus:ring-[#D97706] transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#29150B] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>ACCESS DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#2B140A] flex items-center justify-center gap-2 text-[11px] text-[#785A48]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Protected by HTTP-only cryptographic session tokens</span>
          </div>

        </div>
      </div>
    </div>
  );
};
