import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FinancialKPICards } from './components/FinancialKPICards';
import { CategoryDonutChart } from './components/Analytics/CategoryDonutChart';
import { MonthlyCashflowChart } from './components/Analytics/MonthlyCashflowChart';
import { BudgetTracker } from './components/Budget/BudgetTracker';
import { BudgetModal } from './components/Budget/BudgetModal';
import { TransactionTable } from './components/Transactions/TransactionTable';
import { AddTransactionModal } from './components/Transactions/AddTransactionModal';
import { EditTransactionModal } from './components/Transactions/EditTransactionModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthPage } from './components/Auth/AuthPage';
import { InteractiveCursorGlow } from './components/InteractiveCursorGlow';
import {
  transactionService,
  budgetService,
  analyticsService
} from './services/api';
import toast, { Toaster } from 'react-hot-toast';

export function DashboardContent() {
  const { user, logout } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [categoryType, setCategoryType] = useState('EXPENSE');

  // Data States
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  
  // Transaction Table States
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    payment_method: 'all',
    start_date: '',
    end_date: '',
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Dashboard Analytics
  const loadDashboardMetrics = useCallback(async () => {
    try {
      const [sumRes, catRes, trendRes, budRes] = await Promise.all([
        analyticsService.getSummary(selectedMonth),
        analyticsService.getCategories({ month: selectedMonth, type: categoryType }),
        analyticsService.getMonthlyTrend(6),
        budgetService.getAll(selectedMonth),
      ]);

      setSummary(sumRes.data);
      setCategoryData(catRes.data);
      setTrendData(trendRes.data);
      setBudgetList(budRes.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  }, [selectedMonth, categoryType]);

  // Fetch Transactions List
  const loadTransactions = useCallback(async () => {
    try {
      const res = await transactionService.getAll({
        ...filters,
        page,
        limit,
      });
      setTransactions(res.data.items || []);
      setTotalTransactions(res.data.total || 0);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  }, [filters, page, limit]);

  // Initial and reactive data fetching
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([loadDashboardMetrics(), loadTransactions()]);
      setIsLoading(false);
    };
    fetchAll();
  }, [loadDashboardMetrics, loadTransactions]);

  // Add Transaction Handler
  const handleAddTransaction = async (data) => {
    await transactionService.create(data);
    await Promise.all([loadDashboardMetrics(), loadTransactions()]);
  };

  // Edit Transaction Handler
  const handleUpdateTransaction = async (id, data) => {
    await transactionService.update(id, data);
    await Promise.all([loadDashboardMetrics(), loadTransactions()]);
  };

  // Delete Transaction Handler
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Confirm ledger purge for this transaction record?')) {
      try {
        await transactionService.delete(id);
        toast.success('Record purged from ledger');
        await Promise.all([loadDashboardMetrics(), loadTransactions()]);
      } catch (err) {
        toast.error('Purge action failed');
      }
    }
  };

  // Save Budget Limit
  const handleSaveBudget = async (budgetData) => {
    await budgetService.setBudget(budgetData);
    await loadDashboardMetrics();
  };

  // Delete Budget Limit
  const handleDeleteBudget = async (id) => {
    if (window.confirm('Disengage this budget ceiling?')) {
      try {
        await budgetService.delete(id);
        toast.success('Budget ceiling disengaged');
        await loadDashboardMetrics();
      } catch (err) {
        toast.error('Action failed');
      }
    }
  };

  // Seed Demo Data
  const handleSeedData = async () => {
    try {
      const res = await analyticsService.seedDemoData();
      toast.success(res.data.message || 'Sample transactions and budgets generated!');
      await Promise.all([loadDashboardMetrics(), loadTransactions()]);
    } catch (err) {
      toast.error('Failed to generate sample data');
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await transactionService.downloadCsv(filters);
      toast.success('CSV ledger file downloaded');
    } catch (err) {
      toast.error('Failed to export CSV file');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05080c] text-[#e2e8f0] flex flex-col relative overflow-x-hidden">
      {/* Interactive Cursor Luminous Backlight (Behind main divs) */}
      <InteractiveCursorGlow />

      {/* Top Navbar */}
      <Navbar
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onSeedData={handleSeedData}
        activeAlertsCount={summary?.active_alerts_count || 0}
        budgetList={budgetList}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        
        {/* KPI Financial Overview Cards */}
        <FinancialKPICards
          summary={summary}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Budget Alert Tracker */}
        <BudgetTracker
          budgetList={budgetList}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onDeleteBudget={handleDeleteBudget}
        />

        {/* Interactive Charts Suite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Cashflow Trajectory (7 cols) */}
          <div className="lg:col-span-7">
            <MonthlyCashflowChart trendData={trendData} />
          </div>

          {/* Category Spending Breakdown Donut (5 cols) */}
          <div className="lg:col-span-5">
            <CategoryDonutChart
              categoryData={categoryData}
              type={categoryType}
              setType={setCategoryType}
            />
          </div>
        </div>

        {/* Detailed Transactions Data Ledger */}
        <TransactionTable
          transactions={transactions}
          totalCount={totalTransactions}
          page={page}
          limit={limit}
          totalPages={totalPages}
          filters={filters}
          setFilters={setFilters}
          onPageChange={setPage}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onEditTransaction={(tx) => setEditingTransaction(tx)}
          onDeleteTransaction={handleDeleteTransaction}
          onExportCsv={handleExportCsv}
          isExporting={isExporting}
        />

      </main>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onUpdateTransaction={handleUpdateTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSaveBudget={handleSaveBudget}
        selectedMonth={selectedMonth}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Modern Institutional Footer */}
      <footer className="border-t border-[#141f2e] bg-[#05080c]/95 backdrop-blur-xl py-6 relative z-20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand Identity & Status */}
          <div className="flex items-center space-x-3 text-left">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs text-slate-200 font-display tracking-tight">WEALTHPULSE</span>
                <span className="text-[10px] text-emerald-400 font-mono-num font-semibold">● 256-bit Encrypted</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Institutional Private Wealth & Liquidity Terminal</p>
            </div>
          </div>

          {/* Center: System Architecture Specs */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono-num">
            <span>FastAPI Core</span>
            <span className="text-slate-600">&bull;</span>
            <span>PostgreSQL Engine</span>
            <span className="text-slate-600">&bull;</span>
            <span>React 19 Vite</span>
          </div>

          {/* Right: Copyright */}
          <div className="text-right text-[10px] text-slate-500 font-mono-num">
            <p>&copy; {new Date().getFullYear()} WealthPulse Terminal. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080c] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400 font-display">Initializing WealthPulse Terminal...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0f16',
            color: '#f8fafc',
            border: '1px solid #22344a',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: 'Manrope, sans-serif'
          },
        }}
      />
      {isAuthenticated ? <DashboardContent /> : <AuthPage />}
    </>
  );
}
