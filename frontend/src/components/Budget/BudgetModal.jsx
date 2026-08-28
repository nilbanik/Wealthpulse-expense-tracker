import React, { useState } from 'react';
import { ALL_CATEGORIES } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Target, Save, Gauge } from 'lucide-react';
import toast from 'react-hot-toast';

export const BudgetModal = ({ isOpen, onClose, onSaveBudget, selectedMonth }) => {
  const { currentCurrencyInfo } = useCurrency();
  if (!isOpen) return null;

  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [month, setMonth] = useState(selectedMonth || new Date().toISOString().slice(0, 7));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawVal = parseFloat(monthlyLimit);
    if (!monthlyLimit || rawVal <= 0) {
      toast.error('Please enter a valid budget allocation amount');
      return;
    }

    // Convert back to base INR before sending to backend database
    const baseInrAmount = rawVal / (currentCurrencyInfo.rateToInr || 1.0);

    setIsSubmitting(true);
    try {
      await onSaveBudget({
        category,
        monthly_limit: parseFloat(baseInrAmount.toFixed(2)),
        month,
      });
      toast.success(`Ceiling locked for ${category} (${month})`);
      onClose();
    } catch (err) {
      toast.error('Failed to update budget ceiling.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-[#273a52] shadow-2xl relative animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2d42]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">Set Monthly Risk Ceiling</h3>
              <p className="text-xs text-slate-400">Configure sector expenditure maximums ({currentCurrencyInfo.code})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-display">
              Sector / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-semibold cursor-pointer"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Limit */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-display">
              Expenditure Limit ({currentCurrencyInfo.code} {currentCurrencyInfo.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm font-mono-num">
                {currentCurrencyInfo.symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder={`e.g. ${currentCurrencyInfo.code === 'INR' ? '15000' : '200'}`}
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                required
                className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500 font-mono-num font-bold transition-all"
              />
            </div>
          </div>

          {/* Month Target */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-display">
              Fiscal Period
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono-num transition-all cursor-pointer"
            />
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-black text-xs font-bold shadow-lg shadow-yellow-950/40 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Securing...' : 'Lock Ceiling'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
