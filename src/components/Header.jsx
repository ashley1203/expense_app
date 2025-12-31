import { useState } from 'react'
import { Calendar, Wallet, Pencil, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'

function Header({ 
  totalSpent, 
  budget, 
  remaining, 
  onUpdateBudget,
  selectedMonth,
  selectedYear,
  onPreviousMonth,
  onNextMonth,
  isCurrentMonth
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(budget)

  // Create date from selected month/year for display
  const selectedDate = new Date(selectedYear, selectedMonth, 1)
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const isOverBudget = remaining < 0
  const isWarning = remaining >= 0 && remaining < budget * 0.25

  const handleSave = () => {
    const newBudget = parseFloat(editValue)
    if (!isNaN(newBudget) && newBudget > 0) {
      onUpdateBudget(newBudget)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(budget)
    setIsEditing(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors touch-manipulation"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <span className="text-base font-semibold">{monthName}</span>
          </div>
          
          <button
            onClick={onNextMonth}
            disabled={isCurrentMonth}
            className={`p-2 rounded-full transition-colors touch-manipulation ${
              isCurrentMonth 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {!isCurrentMonth && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            Viewing past month
          </span>
        )}
      </div>

      {/* Budget Overview */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        {/* Total Spent */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1 flex items-center justify-end gap-1">
              <Wallet className="w-4 h-4" />
              Monthly Budget
            </p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-medium text-gray-400">₹</span>
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-28 text-2xl font-medium text-gray-900 border-b-2 border-emerald-500 focus:outline-none bg-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                />
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-medium text-gray-900">{formatCurrency(budget)}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remaining Balance */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Remaining</span>
          <span
            className={`text-lg font-semibold ${
              isOverBudget
                ? 'text-red-500'
                : isWarning
                ? 'text-amber-500'
                : 'text-emerald-500'
            }`}
          >
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Header

