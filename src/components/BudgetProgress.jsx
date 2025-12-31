import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

function BudgetProgress({ totalSpent, budget }) {
  const percentage = Math.min((totalSpent / budget) * 100, 150)
  const displayPercentage = (totalSpent / budget) * 100
  
  const isOverBudget = totalSpent > budget
  const isWarning = displayPercentage >= 75 && displayPercentage < 100
  const isGood = displayPercentage < 75

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500'
    if (isWarning) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStatusIcon = () => {
    if (isOverBudget) return <AlertTriangle className="w-5 h-5 text-red-500" />
    if (isWarning) return <TrendingUp className="w-5 h-5 text-amber-500" />
    return <CheckCircle className="w-5 h-5 text-emerald-500" />
  }

  const getStatusText = () => {
    if (isOverBudget) {
      const overAmount = totalSpent - budget
      return `Over budget by ₹${overAmount.toFixed(2)}`
    }
    if (isWarning) return 'Approaching budget limit'
    return 'On track'
  }

  const getStatusBgColor = () => {
    if (isOverBudget) return 'bg-red-50 border-red-100'
    if (isWarning) return 'bg-amber-50 border-amber-100'
    return 'bg-emerald-50 border-emerald-100'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Budget Usage
        </h3>
        <span className={`text-lg font-semibold ${isOverBudget ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
          {displayPercentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Over budget indicator */}
      {isOverBudget && (
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-300 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min((displayPercentage - 100) / 50 * 100, 100)}%` }}
          />
        </div>
      )}

      {/* Status Message */}
      <div className={`mt-4 p-3 rounded-xl border ${getStatusBgColor()} flex items-center gap-3`}>
        {getStatusIcon()}
        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-emerald-700'}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  )
}

export default BudgetProgress

