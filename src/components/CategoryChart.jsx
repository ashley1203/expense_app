import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { CATEGORIES } from '../App'

function CategoryChart({ expensesByCategory }) {
  const data = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORIES[name]?.color || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-500">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <PieChartIcon className="w-4 h-4" />
          Spending by Category
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <PieChartIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-sm">No expenses yet</p>
          <p className="text-xs text-gray-300 mt-1">Add your first expense to see the breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <PieChartIcon className="w-4 h-4" />
        Spending by Category
      </h3>
      
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginTop: '-20px' }}>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(total)}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>
    </div>
  )
}

export default CategoryChart

