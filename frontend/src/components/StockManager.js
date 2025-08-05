import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Plus, X, Search, AlertCircle } from 'lucide-react';
import axios from 'axios';

const StockManager = () => {
  const { state } = useTrading();
  const [newTicker, setNewTicker] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddStock = async () => {
    if (!newTicker.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`http://localhost:8000/api/watchlist/add`, {
        ticker: newTicker.toUpperCase()
      });
      
      setSuccess(`Added ${newTicker.toUpperCase()} to watchlist`);
      setNewTicker('');
      
      // Refresh market data
      // This would typically trigger a context update
      
    } catch (error) {
      setError('Failed to add stock. Please check the ticker symbol.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStock = async (ticker) => {
    try {
      await axios.delete(`http://localhost:8000/api/watchlist/${ticker}`);
      setSuccess(`Removed ${ticker} from watchlist`);
      
      // Refresh market data
      // This would typically trigger a context update
      
    } catch (error) {
      setError('Failed to remove stock.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddStock();
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Watchlist Management</h2>
      
      {/* Add Stock */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter ticker symbol (e.g., AAPL)"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>
          <button
            onClick={handleAddStock}
            disabled={isLoading || !newTicker.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 mt-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center space-x-2 mt-2 text-green-400">
            <span className="text-sm">{success}</span>
          </div>
        )}
      </div>

      {/* Current Watchlist */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Current Watchlist</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.watchlist.map((ticker) => (
            <div
              key={ticker}
              className="bg-gray-800 border border-gray-600 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="font-mono text-white">{ticker}</span>
              <button
                onClick={() => handleRemoveStock(ticker)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Remove from watchlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {state.watchlist.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">No stocks in watchlist</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">About Watchlist Management</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Stocks are automatically updated with daily data from Polygon.io</li>
          <li>• Data is refreshed weekdays at 6 PM EST</li>
          <li>• Click on any stock in the market overview to view detailed charts</li>
          <li>• Technical analysis features coming soon</li>
        </ul>
      </div>
    </div>
  );
};

export default StockManager; 