import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Vault,
  Calendar,
  Bell,
  Sparkles,
  Plus,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Coins,
  ShieldAlert,
  ChevronDown,
  Check,
  Menu,
  X,
  Settings,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Navbar = ({
  selectedMonth,
  setSelectedMonth,
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenProfile,
  onSeedData,
  activeAlertsCount = 0,
  budgetList = []
}) => {
  const { user, logout } = useAuth();
  const { currency, setCurrency, currencies, currentCurrencyInfo, formatAmount } = useCurrency();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const monthDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile/tablet menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      options.push({ val, label });
    }
    return options;
  };

  const monthOptions = generateMonthOptions();
  const currentMonthLabel = monthOptions.find((m) => m.val === selectedMonth)?.label || selectedMonth;

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await onSeedData();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#10B981', '#EAB308', '#34D399', '#FBBF24']
      });
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    } finally {
      setIsSeeding(false);
    }
  };

  const alertBudgets = budgetList.filter(b => b.status === 'WARNING' || b.status === 'EXCEEDED');

  return (
    <header className="sticky top-0 z-40 border-b border-[#172334] bg-[#05080c]/95 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-yellow-600/80 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/30 shrink-0">
              <Vault className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-yellow-200 to-amber-400">
                  WEALTHPULSE
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  Multi-Currency
                </span>
              </div>
              <p className="hidden 2xl:block text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-mono-num">
                Private Finance & Liquidity Terminal
              </p>
            </div>
          </div>

          {/* 2. PC / Desktop Controls (Visible ONLY on PC screens >= 1024px) */}
          <div className="hidden lg:flex items-center space-x-2.5 xl:space-x-3 shrink-0">
            
            {/* Desktop Month Dropdown */}
            <div className="relative" ref={monthDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowCurrencyDropdown(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 shadow-inner text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  showMonthDropdown
                    ? 'bg-[#101824] border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-[#0a0f16]/90 hover:bg-[#101824] border-[#1e2d42] text-slate-200 hover:border-slate-600'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-display tracking-tight text-xs">{currentMonthLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {showMonthDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 mt-2 w-48 rounded-2xl bg-[#080d14]/95 backdrop-blur-2xl border border-[#22344a] shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1.5 font-mono-num border-b border-[#141f2e] mb-1">
                      Fiscal Month
                    </div>
                    {monthOptions.map((opt) => {
                      const isSelected = opt.val === selectedMonth;
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => {
                            setSelectedMonth(opt.val);
                            setShowMonthDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                              : 'text-slate-300 hover:bg-[#121c2a] hover:text-white'
                          }`}
                        >
                          <span className="font-display">{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Currency Badge Dropdown */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                  setShowMonthDropdown(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 shadow-inner text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  showCurrencyDropdown
                    ? 'bg-[#101824] border-yellow-500/60 text-yellow-300 ring-1 ring-yellow-500/30'
                    : 'bg-[#0a0f16]/90 hover:bg-[#101824] border-[#1e2d42] text-slate-200 hover:border-slate-600'
                }`}
              >
                <span className="w-5 h-5 rounded bg-yellow-500/15 text-yellow-400 font-mono-num font-extrabold text-[11px] border border-yellow-500/25 flex items-center justify-center">
                  {currentCurrencyInfo.symbol}
                </span>
                <span className="font-display font-bold text-xs text-slate-200 tracking-tight">
                  {currentCurrencyInfo.code}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {showCurrencyDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#080d14]/95 backdrop-blur-2xl border border-[#22344a] shadow-2xl p-1.5 z-50 max-h-80 overflow-y-auto"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1.5 font-mono-num border-b border-[#141f2e] mb-1">
                      Select Currency
                    </div>
                    {Object.values(currencies).map((curr) => {
                      const isSelected = curr.code === currency;
                      return (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => {
                            setCurrency(curr.code);
                            setShowCurrencyDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 font-bold'
                              : 'text-slate-300 hover:bg-[#121c2a] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="w-6 h-6 rounded-lg bg-[#05080c] border border-yellow-500/25 text-yellow-400 font-mono-num font-extrabold text-xs flex items-center justify-center shrink-0">
                              {curr.symbol}
                            </span>
                            <div className="text-left flex items-baseline space-x-1.5">
                              <span className="font-display font-bold text-white text-xs">{curr.code}</span>
                              <span className="text-[11px] text-slate-400 font-medium font-display">({curr.country})</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-yellow-400 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Seed Demo Button */}
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0a0f16] hover:bg-[#121b27] border border-yellow-500/30 text-xs font-semibold text-yellow-400 transition-all hover:border-yellow-500/60 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <Coins className={`w-3.5 h-3.5 text-yellow-400 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>
          </div>

          {/* 3. Right Action Items - Uniformly Sized & Aligned */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            
            {/* Quick Add Entry Button - Exact square matching Bell & Hamburger on mobile/tablet, expands on PC */}
            <button
              onClick={onOpenAddModal}
              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-auto lg:px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0 flex items-center justify-center space-x-2"
              title="Record New Transaction Entry"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="hidden lg:inline">Record Entry</span>
            </button>

            {/* Notification Bell - Uniform w-9 h-9 on mobile, w-10 h-10 on desktop */}
            <div className="relative shrink-0" ref={notifDropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0a0f16] hover:bg-[#121b27] border border-[#1e2d42] text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                title="Budget Alert Center"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {activeAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center font-mono-num">
                      {activeAlertsCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl glass-panel p-4 z-50 border border-[#22344a] shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#1e2d42]">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-yellow-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
                          Budget Health & Safeguards
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono-num font-semibold">
                        {alertBudgets.length} triggered
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {alertBudgets.length === 0 ? (
                        <div className="py-6 text-center text-slate-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                          <p className="text-xs font-semibold text-slate-200">Capital allocations are fully optimal!</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">No category has exceeded 80% of its budget ceiling.</p>
                        </div>
                      ) : (
                        alertBudgets.map((b) => (
                          <div
                            key={b.category}
                            className={`p-3 rounded-xl border text-xs ${
                              b.status === 'EXCEEDED'
                                ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span className="flex items-center space-x-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span className="font-bold">{b.category}</span>
                              </span>
                              <span className="font-mono-num font-bold">{b.percentage_used}%</span>
                            </div>
                            <p className="mt-1 text-[11px] opacity-90 font-medium font-mono-num">
                              {b.status === 'EXCEEDED'
                                ? `Overspent budget limit by ${formatAmount(b.spent_amount - b.monthly_limit)}!`
                                : `Nearing threshold limit (${b.percentage_used}% of ${formatAmount(b.monthly_limit)} utilized).`}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onOpenBudgetModal();
                      }}
                      className="w-full mt-3 py-2 text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors cursor-pointer"
                    >
                      Adjust Budget Ceilings
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PC User Avatar & Logout (Visible on PC >= 1024px) */}
            <div className="hidden lg:flex items-center pl-2 border-l border-[#1e2d42] space-x-2">
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
                title="Manage Account Settings"
              >
                <div className="hidden xl:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{user?.name || 'Account'}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[100px] font-mono-num">{user?.email}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs font-display shadow-inner">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
              </button>
              <button
                onClick={logout}
                className="w-10 h-10 rounded-xl bg-[#0a0f16] hover:bg-rose-500/20 hover:text-rose-400 border border-[#1e2d42] text-slate-400 transition-colors cursor-pointer flex items-center justify-center"
                title="Disconnect Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* 🍔 Hamburger Menu Button - Uniform w-9 h-9 on mobile, w-10 h-10 on tablet */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0a0f16] hover:bg-[#121b27] border border-[#1e2d42] text-slate-200 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* 📱 Slide-Down Glass Drawer Menu (Mobile & iPad Viewports < 1024px) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-[#172334] bg-[#080d14]/98 backdrop-blur-3xl px-4 sm:px-6 py-5 space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* User Profile Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0d1420] border border-[#22344a] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-sm font-display">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{user?.name || 'Account'}</div>
                  <div className="text-xs text-slate-400 font-mono-num truncate max-w-[200px] sm:max-w-xs">{user?.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>

            {/* Fiscal Period Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-display">
                Select Fiscal Period
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {monthOptions.slice(0, 8).map((opt) => {
                  const isSelected = opt.val === selectedMonth;
                  return (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setSelectedMonth(opt.val);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-[#0a0f16] text-slate-300 border-[#1a2636] hover:bg-[#121c2a]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currency Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-display">
                Active Portfolio Currency
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {Object.values(currencies).map((curr) => {
                  const isSelected = curr.code === currency;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 font-bold shadow-sm'
                          : 'bg-[#0a0f16] text-slate-300 border-[#1a2636] hover:bg-[#121c2a]'
                      }`}
                    >
                      <span className="text-yellow-400 font-mono-num font-bold text-sm">{curr.symbol}</span>
                      <span className="text-[10px] mt-0.5">{curr.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Logout */}
            <div className="pt-2 border-t border-[#1a2636] flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="flex-1 py-2.5 rounded-xl bg-[#0a0f16] hover:bg-[#121b27] border border-yellow-500/30 text-xs font-bold text-yellow-300 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Coins className={`w-3.5 h-3.5 text-yellow-400 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Seeding 4 Months...' : 'Seed 4-Month Sample Ledger'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Disconnect Session</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
