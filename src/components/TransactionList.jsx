import { Trash2, Receipt, Utensils, Car, Film, ShoppingBag, FileText, Heart, MoreHorizontal } from 'lucide-react'
import { CATEGORIES } from '../App'

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Car,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Bills: FileText,
  Health: Heart,
  Other: MoreHorizontal,
}

function TransactionList({ transactions, onDeleteTransaction }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          Recent Transactions
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Receipt className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs text-gray-300 mt-1">Your expenses will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <Receipt className="w-4 h-4" />
        Recent Transactions
      </h3>
      
      <div className="max-h-80 overflow-y-auto custom-scrollbar -mx-2 px-2">
        <div className="space-y-2">
          {transactions.map((transaction) => {
            const IconComponent = CATEGORY_ICONS[transaction.category] || MoreHorizontal
            const categoryConfig = CATEGORIES[transaction.category] || CATEGORIES.Other
            
            return (
              <div
                key={transaction.id}
                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {/* Category Icon */}
                <div className={`p-2.5 rounded-xl ${categoryConfig.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${categoryConfig.textColor}`} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    -{formatCurrency(transaction.amount)}
                  </span>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TransactionList

