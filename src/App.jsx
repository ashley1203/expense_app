import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'
import Header from './components/Header'
import ExpenseForm from './components/ExpenseForm'
import CategoryChart from './components/CategoryChart'
import BudgetProgress from './components/BudgetProgress'
import TransactionList from './components/TransactionList'

// Document ID for shared data (you can change this to support multiple users later)
const DOC_ID = 'shared_expenses'

// Generate unique ID (fallback for browsers without crypto.randomUUID)
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback: generate a random ID
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)
}

// Category configuration with colors
export const CATEGORIES = {
  Food: { color: '#10b981', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  Transport: { color: '#3b82f6', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  Entertainment: { color: '#8b5cf6', bgColor: 'bg-violet-100', textColor: 'text-violet-700' },
  Shopping: { color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  Bills: { color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  Health: { color: '#ec4899', bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
  Other: { color: '#6b7280', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
}

function App() {
  const [transactions, setTransactions] = useState([])
  const [budget, setBudget] = useState(50000)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Month/Year navigation state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Reference to the Firestore document
  const docRef = doc(db, 'expenses', DOC_ID)

  // Load data and set up real-time listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          setTransactions(data.transactions || [])
          setBudget(data.budget || 50000)
        } else {
          // Initialize document if it doesn't exist
          setDoc(docRef, { transactions: [], budget: 50000 })
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError('Unable to connect to database. Check your Firebase config.')
        setLoading(false)
      }
    )

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [])

  // Save data to Firestore
  const saveToFirestore = async (newTransactions, newBudget) => {
    try {
      await setDoc(docRef, {
        transactions: newTransactions,
        budget: newBudget,
      })
    } catch (err) {
      console.error('Error saving to Firestore:', err)
      setError('Failed to save data')
    }
  }

  // Current month for comparison (to disable "next" when on current month)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear
  
  // Filter transactions for selected month
  const selectedMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
  })

  // Month navigation functions
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (isCurrentMonth) return // Can't go to future
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  // Calculate total spent for selected month
  const totalSpent = selectedMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
  const remaining = budget - totalSpent

  // Calculate expenses by category for selected month
  const expensesByCategory = selectedMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

  // Add transaction
  const addTransaction = (transaction) => {
    try {
      const newTransaction = {
        ...transaction,
        id: generateId(),
        date: new Date().toISOString(),
      }
      const newTransactions = [newTransaction, ...transactions]
      setTransactions(newTransactions)
      saveToFirestore(newTransactions, budget)
    } catch (err) {
      console.error('Error adding transaction:', err)
      alert('Failed to add expense. Please try again.')
    }
  }

  // Delete transaction
  const deleteTransaction = (id) => {
    const newTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(newTransactions)
    saveToFirestore(newTransactions, budget)
  }

  // Update budget
  const updateBudget = (newBudget) => {
    const budgetNum = Number(newBudget)
    setBudget(budgetNum)
    saveToFirestore(transactions, budgetNum)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your expenses...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Make sure you've added your Firebase config in <code className="bg-gray-100 px-2 py-1 rounded">src/firebase.js</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Header
          totalSpent={totalSpent}
          budget={budget}
          remaining={remaining}
          onUpdateBudget={updateBudget}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          isCurrentMonth={isCurrentMonth}
        />

        {/* Quick Entry Form */}
        <ExpenseForm onAddTransaction={addTransaction} />

        {/* Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Category Chart */}
          <CategoryChart expensesByCategory={expensesByCategory} />

          {/* Budget Progress */}
          <div className="space-y-6">
            <BudgetProgress totalSpent={totalSpent} budget={budget} />
            
            {/* Transaction List */}
            <TransactionList
              transactions={selectedMonthTransactions}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
