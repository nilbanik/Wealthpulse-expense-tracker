import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_CONFIG } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import { PieChart as PieIcon, Layers, CircleDollarSign } from 'lucide-react';

export const CategoryDonutChart = ({ categoryData = [], type = 'EXPENSE', setType }) => {
  const { formatAmount } = useCurrency();
  const [activeIndex, setActiveIndex] = useState(null);

  const totalAmount = categoryData.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);

  const chartData = categoryData.map((item) => ({
    name: item.category,
    value: parseFloat(item.total_amount),
    percentage: item.percentage,
    count: item.transaction_count,
    color: CATEGORY_CONFIG[item.category]?.color || '#94A3B8'
  }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl border border-[#273a52] shadow-2xl text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-slate-100 text-sm font-display">{data.name}</span>
          </div>
          <div className="text-white font-bold font-mono-num text-sm">{formatAmount(data.value)}</div>
          <div className="text-slate-400 text-[11px] font-mono-num">{data.percentage}% share &bull; {data.count} entries</div>
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
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">Capital Allocation by Sector</h3>
            <p className="text-[11px] text-slate-400">Granular spending & revenue dispersion</p>
          </div>
        </div>

        {/* Type Toggle */}
        {setType && (
          <div className="flex items-center bg-[#070b10] p-1 rounded-xl border border-[#1e2d42] text-xs">
            <button
              onClick={() => setType('EXPENSE')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                type === 'EXPENSE'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setType('INCOME')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-600 text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-500">
          <Layers className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
          <p className="text-xs font-medium">No {type.toLowerCase()} transactions logged this cycle</p>
          <p className="text-[11px] text-slate-600">Post transactions to generate sector distribution</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          {/* Donut Canvas */}
          <div className="relative h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={700}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#05080c"
                      strokeWidth={3}
                      className="transition-all duration-300 cursor-pointer outline-none hover:opacity-85"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                {activeIndex !== null ? chartData[activeIndex]?.name : 'Allocated'}
              </span>
              <span className="text-base font-extrabold text-white font-mono-num">
                {activeIndex !== null
                  ? formatAmount(chartData[activeIndex]?.value)
                  : formatAmount(totalAmount)}
              </span>
            </div>
          </div>

          {/* Sector Legend Chips */}
          <div className="mt-3 grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {chartData.map((item, idx) => (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeIndex === idx
                    ? 'bg-[#141f2d] border-emerald-500/40 shadow-md'
                    : 'bg-[#0a0f16]/60 border-[#1a2636] hover:bg-[#101824]'
                }`}
              >
                <div className="flex items-center space-x-2 truncate mr-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-semibold truncate">{item.name}</span>
                </div>
                <span className="text-slate-400 font-bold font-mono-num shrink-0">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
