import React, { useState, useEffect } from 'react';
import { ALL_CATEGORIES, PAYMENT_METHODS } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Save, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditTransactionModal = ({ isOpen, onClose, transaction, onUpdateTransaction }) => {
  const { currentCurrencyInfo } = useCurrency();
  if (!isOpen || !transaction) return null;

  const rate = currentCurrencyInfo.rateToInr || 1.0;

  const [type, setType] = useState(transaction.type || 'EXPENSE');
  const [title, setTitle] = useState(transaction.title || '');
  const [amount, setAmount] = useState(
    transaction.amount ? (parseFloat(transaction.amount) * rate).toFixed(currentCurrencyInfo.fractionDigits || 2) : ''
  );
  const [category, setCategory] = useState(transaction.category || 'Food');
  const [paymentMethod, setPaymentMethod] = useState(transaction.payment_method || 'UPI');
  const [date, setDate] = useState(transaction.date || new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(transaction.note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setTitle(transaction.title);
      setAmount((parseFloat(transaction.amount) * rate).toFixed(currentCurrencyInfo.fractionDigits || 2));
      setCategory(transaction.category);
      setPaymentMethod(transaction.payment_method || 'UPI');
      setDate(transaction.date);
      setNote(transaction.note || '');
    }
  }, [transaction, rate, currentCurrencyInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawAmount = parseFloat(amount);
    if (isNaN(rawAmount) || rawAmount <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    // Convert back to base INR before sending to backend database
    const baseInrAmount = rawAmount / rate;

    setIsSubmitting(true);
    try {
      await onUpdateTransaction(transaction.id, {
        title: title.trim(),
        amount: parseFloat(baseInrAmount.toFixed(2)),
        type,
        category,
        payment_method: paymentMethod,
        date,
        note: note.trim() || null,
      });
      toast.success('Ledger record updated successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to update ledger entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-[#273a52] shadow-2xl relative animate-slide-up max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2d42]">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl border ${type === 'INCOME' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
              {type === 'INCOME' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display">Edit Ledger Entry</h3>
              <p className="text-xs text-slate-400">Modify settled cashflow metadata ({currentCurrencyInfo.code})</p>
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
          
          {/* Type Toggle Switch */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#05080c] rounded-xl border border-[#1e2d42]">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                type === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Outflow</span>
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                type === 'INCOME'
                  ? 'bg-emerald-600 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Inflow</span>
            </button>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                Settled Amount ({currentCurrencyInfo.code} {currentCurrencyInfo.symbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm font-mono-num">
                  {currentCurrencyInfo.symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono-num font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
                Value Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono-num cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
              Transaction Memo *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-display">
              Sector Category *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-emerald-600 text-black border-emerald-400 shadow-sm'
                      : 'bg-[#05080c] text-slate-400 border-[#1e2d42] hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
              Payment Channel
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 font-display">
              Audit Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none font-medium"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#1e2d42]">
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
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Updating...' : 'Commit Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
