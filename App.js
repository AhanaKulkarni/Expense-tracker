const { useState, useEffect } = React;

function App() {
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState(['Food', 'Utilities', 'Transport', 'Entertainment']);
  const [filter, setFilter] = useState('All');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('entries');
    if (storedEntries) setEntries(JSON.parse(storedEntries));

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    
    setTimeout(() => setIsLoading(false), 800); // Simulate loading
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [entries, categories]);

  const addEntry = (newEntry) => {
    const entry = {
      ...newEntry,
      amount: parseFloat(newEntry.amount),
      id: Date.now(),
      date: newEntry.date || new Date().toISOString().split('T')[0]
    };
    setEntries([entry, ...entries]);
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const filteredEntries = filter === 'All' 
    ? entries 
    : entries.filter(entry => entry.category === filter);

  const totalIncome = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpense = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const balance = totalIncome - totalExpense;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-sky-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-sky-100 rounded"></div>
        </div>
      </div>
    );
  }

  // Minimalist color scheme
  const colors = {
    primary: 'bg-white',
    income: 'bg-blue-50/80 border border-blue-100',
    expense: 'bg-rose-50/80 border border-rose-100', 
    card: 'bg-white/90 border border-gray-100 shadow-sm',
    button: 'bg-blue-500/90 hover:bg-blue-600 text-white'
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <header className={`${colors.card} rounded-xl p-6 mb-8 shadow-md animate-fadeIn`}>
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
            <span className="text-blue-600">Expense</span> <span className="text-rose-600">Tracker</span>
          </h1>
          <p className="text-center text-gray-500">Track your finances with ease</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${colors.card} p-5 rounded-xl shadow-sm transition-all hover:scale-[1.02]`}>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
            <div className={`${colors.income} p-5 rounded-xl shadow-sm`}>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">+${totalIncome.toFixed(2)}</p>
            </div>
            <div className={`${colors.expense} p-5 rounded-xl shadow-sm`}>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">-${totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </header>

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-10 animate-bounce hover:animate-none hover:scale-110 transition-transform">
          <i className="fas fa-plus"></i>
        </button>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <section className="lg:col-span-1 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className={`${colors.card} rounded-2xl shadow-xl p-6 sticky top-6 backdrop-blur-sm`}>
              <h2 className="text-2xl font-bold text-white mb-4">Add Transaction</h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                addEntry({
                  amount: form.amount.value,
                  type: form.type.value,
                  category: form.category.value,
                  date: form.date.value,
                  description: form.description.value || ''
                });
                form.reset();
              }} className="space-y-4">
                {/* Form fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-sky-50 transition has-[:checked]:bg-sky-100 has-[:checked]:border-sky-300">
                      <input
                        type="radio"
                        name="type"
                        value="income"
                        defaultChecked
                        className="hidden"
                      />
                      <span className="flex items-center">
                        <i className="fas fa-arrow-down text-sky-500 mr-2"></i>
                        Income
                      </span>
                    </label>
                    <label className="flex items-center justify-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition has-[:checked]:bg-pink-100 has-[:checked]:border-pink-300">
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        className="hidden"
                      />
                      <span className="flex items-center">
                        <i className="fas fa-arrow-up text-pink-500 mr-2"></i>
                        Expense
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="flex">
                    <select
                      name="category"
                      required
                      className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      onClick={() => setShowAddCategory(true)}
                      className="bg-gray-100 text-gray-700 px-3 rounded-r-lg hover:bg-gray-200 transition"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                {showAddCategory && (
                  <div className="flex items-center animate-fadeIn">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-sky-300 transition"
                    />
                    <button 
                      type="button"
                      onClick={addNewCategory}
                      className="bg-sky-500 text-white px-4 py-3 rounded-r-lg hover:bg-sky-600 transition"
                    >
                      Add
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    name="description"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-500 text-white py-3 px-4 rounded-lg hover:bg-sky-600 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                >
                  Add Transaction
                </button>
              </form>
            </div>
          </section>

          {/* Transactions Section */}
          <section className="lg:col-span-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-sky-700">Transactions</h2>
                <div className="flex items-center space-x-2">
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-100 text-gray-700 p-2 rounded-lg border-none focus:ring-2 focus:ring-sky-300"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-wallet text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500">No transactions found</p>
                  <p className="text-gray-400 text-sm mt-1">Add your first transaction using the form</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEntries.map((entry, index) => (
                    <div 
                      key={entry.id}
                      className={`p-4 rounded-lg shadow-xs bg-white border-l-4 ${
                        entry.type === 'income' ? 'border-sky-400' : 'border-pink-400'
                      } transition-all hover:shadow-md hover:translate-x-1`}
                      style={{
                        animationDelay: `${0.3 + (index * 0.05)}s`,
                        opacity: 0,
                        animation: 'fadeIn 0.3s ease-out forwards'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              entry.type === 'income' ? 'bg-sky-400' : 'bg-pink-400'
                            }`}></span>
                            <p className="font-medium text-gray-800">{entry.category}</p>
                          </div>
                          {entry.description && (
                            <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            entry.type === 'income' ? 'text-sky-600' : 'text-pink-600'
                          }`}>
                            {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                          </p>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="text-gray-400 hover:text-gray-600 text-sm mt-2 transition"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const { createRoot } = ReactDOM;
const root = createRoot(document.getElementById('root'));
root.render(<App />);