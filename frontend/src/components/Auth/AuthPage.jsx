import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Vault,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Coins,
  PieChart,
  Gauge,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveCursorGlow } from '../InteractiveCursorGlow';
import toast from 'react-hot-toast';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('wealthpulse_saved_email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [seedDemoData, setSeedDemoData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  // Pure portfolio currencies for clean grammatical continuity
  const words = [
    'every rupee.',
    'every dollar.',
    'every euro.',
    'every pound.',
    'every yen.',
    'every dinar.',
    'every dirham.'
  ];
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(105);

  useEffect(() => {
    const handleTyping = () => {
      const fullWord = words[currentWordIndex];
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(85);

        if (currentText === fullWord) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(40);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(220);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    if (score === 4) return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 4, label: 'Institutional Grade', color: 'bg-yellow-400' };
  };

  const pwdStrength = calculatePasswordStrength(password);
  const passwordsMatch = !isLogin && password && confirmPassword && password === confirmPassword;
  const passwordsMismatch = !isLogin && confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password, rememberMe);
      } else {
        await register(name, email, password, seedDemoData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      const demoEmail = 'alex.morgan@wealthpulse.institutional';
      const demoPass = 'Capital2026!';
      const res = await login(demoEmail, demoPass);
      if (!res.success) {
        await register('Alex Morgan', demoEmail, demoPass, true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05080c] text-slate-100 relative flex flex-col justify-start items-center py-6 sm:py-12 px-4 pb-20 overflow-x-hidden">
      <InteractiveCursorGlow />
      
      {/* Institutional Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-yellow-600/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-900/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 my-auto">
        
        {/* Left Side: Institutional Value Proposition & Multi-Currency Typewriter */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-display shadow-sm shadow-emerald-950/40"
          >
            <Vault className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private Wealth & Financial Terminal</span>
          </motion.div>

          <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Precision mastery over{' '}
              <span className="inline-block relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-yellow-200 to-amber-400">
                  {currentText}
                </span>
                <span className="inline-block w-[3px] h-[36px] sm:h-[46px] bg-emerald-400 ml-1.5 align-middle rounded-full animate-pulse"></span>
              </span>
            </h1>
          </div>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            Audit capital flows, monitor sector disbursements with precision analytics, enforce treasury budget ceilings, and export auditable CSV records in real-time.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="glass-card p-3.5 rounded-xl border border-[#1e2d42] flex items-center space-x-3 text-left">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 font-display">Sector Dispersion</div>
                <div className="text-[10px] text-slate-500 font-mono-num">Real-time Recharts Engine</div>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-xl border border-[#1e2d42] flex items-center space-x-3 text-left">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 font-display">Ceiling Telemetry</div>
                <div className="text-[10px] text-slate-500 font-mono-num">80% & 100% Risk Alerts</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#273a52] shadow-2xl relative">
            
            {/* Form Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#05080c] rounded-2xl border border-[#1e2d42] mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`py-2 text-xs font-bold rounded-xl transition-all font-display cursor-pointer ${
                  isLogin
                    ? 'bg-emerald-600 text-black shadow-md shadow-emerald-950/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Access Terminal
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`py-2 text-xs font-bold rounded-xl transition-all font-display cursor-pointer ${
                  !isLogin
                    ? 'bg-emerald-600 text-black shadow-md shadow-emerald-950/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Open Portfolio
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name for Sign Up */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                      Principal Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                  Entity Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="entity@wealthpulse.institutional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-mono-num"
                  />
                </div>
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">
                    {isLogin ? 'Access Key / Password' : 'Create Password'}
                  </label>
                  {!isLogin && password && (
                    <span className="text-[10px] font-bold font-mono-num text-slate-400">
                      Strength: <strong className="text-emerald-400">{pwdStrength.label}</strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-mono-num"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator Bar for Sign Up */}
                {!isLogin && password && (
                  <div className="mt-2 space-y-1">
                    <div className="grid grid-cols-4 gap-1.5 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full rounded-full transition-all duration-300 ${
                            step <= pwdStrength.score ? pwdStrength.color : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password for Sign Up */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                        minLength={6}
                        className={`w-full bg-[#05080c] border rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all font-mono-num ${
                          passwordsMatch
                            ? 'border-emerald-500'
                            : passwordsMismatch
                            ? 'border-rose-500'
                            : 'border-[#1e2d42] focus:border-emerald-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordsMatch && (
                      <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Passwords match</span>
                      </p>
                    )}
                    {passwordsMismatch && (
                      <p className="text-[10px] text-rose-400 font-semibold mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Passwords do not match</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Checkbox Options */}
              {isLogin ? (
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="flex items-center space-x-2.5 group cursor-pointer select-none text-left"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-200 ${
                        rememberMe
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : 'bg-[#05080c] border-[#1e2d42] group-hover:border-slate-500'
                      }`}
                    >
                      {rememberMe && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <Check className="w-3 h-3 stroke-[3.5]" />
                        </motion.div>
                      )}
                    </div>
                    <span className="font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                      Remember terminal
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toast('Please contact compliance/admin or use 1-Click Demo Login to reset credentials.', { icon: 'ℹ️' })}
                    className="text-slate-400 hover:text-emerald-400 transition-colors font-medium cursor-pointer"
                  >
                    Forgot access key?
                  </button>
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setSeedDemoData(!seedDemoData)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl border transition-all text-left cursor-pointer group ${
                      seedDemoData
                        ? 'bg-[#08101a] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-[#05080c] border-[#1e2d42] hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        seedDemoData
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          : 'bg-[#05080c] border-[#1e2d42] group-hover:border-slate-500'
                      }`}
                    >
                      {seedDemoData && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <Check className="w-3 h-3 stroke-[3.5]" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                        Initialize with 4-Month Sample Ledger
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Populate realistic transactions & budgets for instant preview
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-display cursor-pointer"
              >
                <span>{isSubmitting ? 'Authenticating...' : isLogin ? 'Authenticate Terminal' : 'Create Portfolio Ledger'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1e2d42]"></div>
              </div>
              <div className="relative flex justify-center text-xs font-display">
                <span className="px-2 bg-[#0a0f16] text-slate-500 uppercase tracking-widest text-[10px] font-bold">Instant Evaluation</span>
              </div>
            </div>

            {/* 1-Click Demo Button */}
            <button
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              type="button"
              className="w-full py-2.5 rounded-xl bg-[#05080c] hover:bg-[#0f1722] border border-yellow-500/30 text-xs font-bold text-yellow-300 hover:text-yellow-200 flex items-center justify-center space-x-2 transition-all hover:border-yellow-500/60 shadow-sm cursor-pointer"
            >
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>Explore Demo Account (1-Click Login)</span>
            </button>

            <div className="mt-4 flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 font-mono-num">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>End-to-end encrypted with JWT & bcrypt ciphering</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
