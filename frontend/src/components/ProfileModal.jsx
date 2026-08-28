import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Mail,
  Shield,
  KeyRound,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, changePassword } = useAuth();
  if (!isOpen || !user) return null;

  const [tab, setTab] = useState('profile'); // 'profile' | 'security'
  
  // Profile tab state
  const [name, setName] = useState(user.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Principal name cannot be empty');
      return;
    }
    setIsUpdatingProfile(true);
    try {
      await updateProfile(name.trim());
      onClose();
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const formattedJoinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Active Cycle';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-[#273a52] shadow-2xl relative animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2d42]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">Account & Security</h3>
              <p className="text-xs text-slate-400">Manage credentials & identity parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#05080c] rounded-xl border border-[#1e2d42] mt-4 mb-5">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all font-display cursor-pointer ${
              tab === 'profile'
                ? 'bg-emerald-600 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Principal Profile
          </button>
          <button
            type="button"
            onClick={() => setTab('security')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all font-display cursor-pointer ${
              tab === 'security'
                ? 'bg-emerald-600 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Cipher
          </button>
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                Principal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                Verified Entity Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-[#070b10] border border-[#172334] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-400 font-mono-num cursor-not-allowed opacity-80"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono-num">
                Email address is locked to immutable cryptographic account ID #{user.id}.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#05080c] border border-[#1a2636] flex items-center space-x-3 text-xs text-slate-400">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-300 font-semibold">Ledger Established: </span>
                <span className="font-mono-num">{formattedJoinDate}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                Current Access Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono-num transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                New Access Key
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono-num transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                Confirm New Access Key
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono-num transition-all"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black text-xs font-bold shadow-lg shadow-yellow-950/40 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
