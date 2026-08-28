import React from 'react';
import { formatDate, CATEGORY_CONFIG, ALL_CATEGORIES, PAYMENT_METHODS } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

export const TransactionTable = ({
  transactions = [],
  totalCount = 0,
  page = 1,
  limit = 20,
  totalPages = 1,
  filters,
  setFilters,
  onPageChange,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  onExportCsv,
  isExporting
}) => {
  const { formatAmount } = useCurrency();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      type: 'all',
      payment_method: 'all',
      start_date: '',
      end_date: '',
      page: 1,
      limit: 20
    });
  };

  const hasActiveFilters =
    filters.search ||
    (filters.category && filters.category !== 'all') ||
    (filters.type && filters.type !== 'all') ||
    (filters.payment_method && filters.payment_method !== 'all') ||
    filters.start_date ||
    filters.end_date;

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#1e2d42]">
      {/* Header & Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1e2d42]">
        <div>
          <h3 className="text-base font-bold text-slate-100 font-display flex items-center space-x-2.5">
            <span>Treasury Transaction Ledger</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0a0f16] text-emerald-400 font-bold border border-emerald-500/30 font-mono-num">
              {totalCount} Entries Audited
            </span>
          </h3>
          <p className="text-xs text-slate-400">Institutional records, payment channels, and metadata audit trail</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onExportCsv}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0a0f16] hover:bg-[#121b27] border border-[#273a52] text-xs font-bold text-slate-200 transition-colors shadow-sm hover:border-emerald-500/40 cursor-pointer"
            title="Download CSV of current filtered ledger view"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV Ledger'}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 my-4">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memo, notes, entity..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="all">All Cashflow Types</option>
            <option value="EXPENSE">Capital Outflow Only</option>
            <option value="INCOME">Capital Inflow Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="all">All Sectors</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <select
            value={filters.payment_method || 'all'}
            onChange={(e) => handleFilterChange('payment_method', e.target.value)}
            className="w-full bg-[#05080c] border border-[#1e2d42] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="all">All Payment Channels</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>{pm}</option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters ? (
          <button
            onClick={handleResetFilters}
            className="w-full py-2 px-3 rounded-xl bg-[#0a0f16] hover:bg-[#141e2b] text-slate-300 border border-[#273a52] text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        ) : (
          <div className="hidden lg:block text-right pr-2 self-center">
            <span className="text-[10px] text-slate-500 font-mono-num uppercase tracking-wider">Indexed Search</span>
          </div>
        )}
      </div>

      {/* Transactions Data Table */}
      <div className="overflow-x-auto rounded-xl border border-[#172334] bg-[#05080c]/60">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0a0f16] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-[#1e2d42] font-display">
            <tr>
              <th className="py-3 px-4">Value Date</th>
              <th className="py-3 px-4">Description / Memo</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4 text-right">Settled Amount</th>
              <th className="py-3 px-4 text-center">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#131c2a]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-600" />
                  <p className="font-bold text-slate-400 font-display">No ledger records match the applied criteria</p>
                  <p className="text-[11px] mt-0.5">Reset filter queries or add a new transaction.</p>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isIncome = tx.type === 'INCOME';
                const catConf = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG.Other;

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#0a1017] transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono-num font-medium">
                      {formatDate(tx.date)}
                    </td>

                    {/* Title & Note */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {tx.title}
                      </div>
                      {tx.note && (
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{tx.note}</div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${catConf.bg}`}>
                        {tx.category}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-[#070b10] border border-[#1e2d42] text-[10px] font-mono-num font-semibold text-slate-300">
                        {tx.payment_method || 'UPI'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className={`py-3 px-4 whitespace-nowrap text-right font-bold text-sm font-mono-num ${
                      isIncome ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isIncome ? '+' : '-'}{formatAmount(tx.amount)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-[#121b27] transition-colors cursor-pointer"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#121b27] transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 mt-2">
        <div className="text-xs text-slate-400 font-mono-num">
          Page <strong className="text-slate-100">{page}</strong> of <strong className="text-slate-100">{totalPages}</strong> &bull; Total {totalCount}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-xl border border-[#1e2d42] bg-[#0a0f16] text-slate-300 hover:bg-[#121b27] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-xl border border-[#1e2d42] bg-[#0a0f16] text-slate-300 hover:bg-[#121b27] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
