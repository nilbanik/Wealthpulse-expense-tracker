import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import {
  Vault,
  TrendingUp,
  TrendingDown,
  Percent,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FinancialKPICards = ({ summary, onOpenBudgetModal }) => {
  const { formatAmount } = useCurrency();

  if (!summary) return null;

  const {
    total_balance = 0,
    total_income = 0,
    total_expenses = 0,
    savings_rate = 0,
    monthly_budget = 0,
    monthly_spent = 0,
    active_alerts_count = 0
  } = summary;

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" }
    })
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Net Balance / Portfolio Liquidity */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-[#1e2d42]"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
            Net Portfolio Liquidity
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
            <Vault className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono-num">
          {formatAmount(total_balance)}
        </div>
        <div className="mt-3 flex items-center text-xs text-emerald-400/90 space-x-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audited lifetime ledger balance</span>
        </div>
      </motion.div>

      {/* 2. Monthly Capital Inflow */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-[#1e2d42]"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-600/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
            Monthly Capital Inflow
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-mono-num">
          +{formatAmount(total_income)}
        </div>
        <div className="mt-3 flex items-center text-xs text-emerald-300/80 space-x-1 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Yield, Salary & Inflows</span>
        </div>
      </motion.div>

      {/* 3. Monthly Capital Outflow */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-[#1e2d42]"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
            Monthly Outflow
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-inner">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight font-mono-num">
          -{formatAmount(total_expenses)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-mono-num">
          <span className="text-slate-400">Ceiling: {formatAmount(monthly_budget)}</span>
          {active_alerts_count > 0 ? (
            <span className="text-amber-400 font-bold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{active_alerts_count} alert{active_alerts_count === 1 ? '' : 's'}</span>
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold">Under Budget</span>
          )}
        </div>
      </motion.div>

      {/* 4. Capital Retention / Savings Rate */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-[#1e2d42]"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
            Capital Retention Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-400 shadow-inner">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono-num ${
            savings_rate >= 35 ? 'text-yellow-300' : 'text-slate-100'
          }`}>
            {savings_rate}%
          </span>
          <span className="text-xs text-slate-400 font-medium">net retained</span>
        </div>
        
        {/* Retention meter */}
        <div className="mt-3 w-full bg-[#070b10] rounded-full h-1.5 overflow-hidden border border-[#1a2636]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              savings_rate >= 40
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-yellow-400'
                : savings_rate >= 20
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, savings_rate))}%` }}
          ></div>
        </div>
      </motion.div>

    </div>
  );
};
