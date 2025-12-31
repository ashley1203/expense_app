import { useState } from 'react'
import { Plus, IndianRupee, Tag, FileText } from 'lucide-react'
import { CATEGORIES } from '../App'

function ExpenseForm({ onAddTransaction }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const parsedAmount = parseFloat(amount)
    if (!description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      return
    }

    onAddTransaction({
      description: description.trim(),
      amount: parsedAmount,
      category,
    })

    // Reset form
    setDescription('')
    setAmount('')
    setCategory('Food')
  }

  const isValid = description.trim() && amount && parseFloat(amount) > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          {/* Description Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FileText className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
            />
          </div>

          {/* Amount and Category Row */}
          <div className="flex gap-3">
            {/* Amount Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <IndianRupee className="w-5 h-5" />
              </div>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-base"
              />
            </div>

            {/* Category Select */}
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Tag className="w-5 h-5" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer text-base"
              >
                {Object.keys(CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button - Full width, always visible */}
          <button
            type="submit"
            disabled={!isValid}
            onClick={handleSubmit}
            className="w-full px-6 py-4 rounded-xl bg-emerald-500 text-white font-semibold text-base active:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 touch-manipulation"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm

