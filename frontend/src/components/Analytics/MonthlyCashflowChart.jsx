import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { Activity, BarChart2, TrendingUp } from 'lucide-react';

export const MonthlyCashflowChart = ({ trendData = [] }) => {
  const { formatAmount, currentCurrencyInfo } = useCurrency();
  const [chartView, setChartView] = useState('area');

  const rate = currentCurrencyInfo.rateToInr || 1.0;

  const formattedData = trendData.map((item) => ({
    ...item,
    incomeNum: parseFloat(item.income || 0) * rate,
    expenseNum: parseFloat(item.expense || 0) * rate,
    rawIncome: parseFloat(item.income || 0),
    rawExpense: parseFloat(item.expense || 0),
    savingsNum: parseFloat(item.net_savings || 0) * rate,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3.5 rounded-xl border border-[#273a52] shadow-2xl text-xs space-y-1.5 min-w-[180px]">
          <p className="font-bold text-slate-100 border-b border-[#1e2d42] pb-1 font-display">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3 font-mono-num">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {formatAmount(entry.dataKey === 'incomeNum' ? entry.payload.rawIncome : entry.payload.rawExpense)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full border border-[#1e2d42]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">Macro Cash Flow & Velocity</h3>
            <p className="text-[11px] text-slate-400">Capital intake versus monthly outflow trajectory</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#070b10] p-1 rounded-xl border border-[#1e2d42] text-xs">
          <button
            onClick={() => setChartView('area')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              chartView === 'area'
                ? 'bg-emerald-600 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Flow Wave</span>
          </button>
          <button
            onClick={() => setChartView('bar')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              chartView === 'bar'
                ? 'bg-emerald-600 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bars</span>
          </button>
        </div>
      </div>

      {formattedData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-500">
          <Activity className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
          <p className="text-xs font-medium">No liquidity timeline records available</p>
        </div>
      ) : (
        <div className="h-64 sm:h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'bar' ? (
              <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#172334" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${currentCurrencyInfo.symbol}${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'Manrope' }}
                  iconType="circle"
                />
                <Bar dataKey="incomeNum" name="Capital Inflow" fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={26} />
                <Bar dataKey="expenseNum" name="Capital Outflow" fill="#F43F5E" radius={[3, 3, 0, 0]} maxBarSize={26} />
              </BarChart>
            ) : (
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#172334" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${currentCurrencyInfo.symbol}${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'Manrope' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="incomeNum"
                  name="Capital Inflow"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenseNum"
                  name="Capital Outflow"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
