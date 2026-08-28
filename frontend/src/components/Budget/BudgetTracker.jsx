import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, Plus, Trash2, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

export const BudgetTracker = ({ budgetList = [], onOpenBudgetModal, onDeleteBudget }) => {
  const { formatAmount } = useCurrency();

  return (
    <div className="glass-card rounded-2xl p-5 mb-6 border border-[#1e2d42]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">Treasury Budget Ceilings & Risk Guard</h3>
            <p className="text-[11px] text-slate-400">
              Automated threshold telemetry: Advisory warning at 80%, Critical alert at 100%
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0e1622] hover:bg-[#152030] text-yellow-300 border border-yellow-500/30 text-xs font-bold transition-all self-start sm:self-auto shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-yellow-400 stroke-[2.5]" />
          <span>Configure Ceilings</span>
        </button>
      </div>

      {budgetList.length === 0 ? (
        <div className="py-8 text-center bg-[#070b10] rounded-xl border border-[#1a2636]">
          <Gauge className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-300">No category risk ceilings set for this period</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Click "Configure Ceilings" or "Seed Sample Data" to activate real-time threshold guard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {budgetList.map((item, idx) => {
            const isExceeded = item.status === 'EXCEEDED';
            const isWarning = item.status === 'WARNING';

            return (
              <motion.div
                key={item.category || idx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                className={`p-3.5 rounded-xl border relative transition-all duration-300 ${
                  isExceeded
                    ? 'bg-rose-950/25 border-rose-500/50 shadow-lg shadow-rose-950/30'
                    : isWarning
                    ? 'bg-amber-950/25 border-amber-500/50 shadow-lg shadow-amber-950/30'
                    : 'bg-[#0a0f16]/70 border-[#1a2636] hover:border-emerald-500/30'
                }`}
              >
                {/* Top status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-100 font-display flex items-center space-x-1.5">
                    <span>{item.category}</span>
                  </span>
                  
                  <div className="flex items-center space-x-1.5">
                    {isExceeded ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1 font-mono-num animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        <span>OVER CEILING</span>
                      </span>
                    ) : isWarning ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1 font-mono-num">
                        <AlertTriangle className="w-3 h-3" />
                        <span>&ge;80% LIMIT</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center space-x-1 font-mono-num">
                        <CheckCircle className="w-3 h-3" />
                        <span>HEALTHY</span>
                      </span>
                    )}

                    {onDeleteBudget && item.id && (
                      <button
                        onClick={() => onDeleteBudget(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete Budget Target"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#05080c] rounded-full h-2 overflow-hidden my-2 border border-[#172334]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isExceeded
                        ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-500'
                        : isWarning
                        ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(3, item.percentage_used))}%` }}
                  />
                </div>

                {/* Values */}
                <div className="flex items-center justify-between text-[11px] pt-1 font-mono-num">
                  <span className="text-slate-400">
                    Spent: <strong className="text-slate-200">{formatAmount(item.spent_amount)}</strong>
                  </span>
                  <span className="text-slate-400">
                    Ceiling: <strong className="text-slate-200">{formatAmount(item.monthly_limit)}</strong>
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono-num">
                  <span>{item.percentage_used}% allocated</span>
                  <span>
                    {isExceeded
                      ? `Exceeded by ${formatAmount(item.spent_amount - item.monthly_limit)}`
                      : `${formatAmount(item.remaining_amount)} available`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
