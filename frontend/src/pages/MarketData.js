import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { TrendingUp, TrendingDown, Minus, RefreshCw, BarChart3, X } from 'lucide-react';
import MarketOverview from '../components/MarketOverview';
import StockChart from '../components/StockChart';

const MarketData = () => {
  const { state } = useTrading();
  const [selectedStock, setSelectedStock] = useState(null);

  const handleStockClick = (ticker) => {
    setSelectedStock(ticker);
  };

  const closeChart = () => {
    setSelectedStock(null);
  };

  const getPriceChangeIcon = (changePercent) => {
    const change = parseFloat(changePercent);
    if (change > 0) return <TrendingUp className="w-4 h-4 text-bullish" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-bearish" />;
    return <Minus className="w-4 h-4 text-neutral" />;
  };

  const getPriceChangeColor = (changePercent) => {
    const change = parseFloat(changePercent);
    if (change > 0) return 'text-bullish';
    if (change < 0) return 'text-bearish';
    return 'text-neutral';
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Market Data</h1>
          <p className="text-gray-400">
            Real-time market prices and analysis
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-bullish">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Auto-refresh</span>
          </div>
          <span className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Market Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Advancing</span>
              <span className="text-bullish font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Declining</span>
              <span className="text-bearish font-medium">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unchanged</span>
              <span className="text-neutral font-medium">2</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Gainers</h3>
          <div className="space-y-2">
            {state.watchlist.slice(0, 3).map((ticker, index) => {
              const priceData = state.latestPrices[ticker];
              if (!priceData || parseFloat(priceData.changePercent) <= 0) return null;
              
              return (
                <div key={ticker} className="flex justify-between items-center">
                  <span className="font-mono text-white">{ticker}</span>
                  <span className="text-bullish font-medium">
                    +{priceData.changePercent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Losers</h3>
          <div className="space-y-2">
            {state.watchlist.slice(0, 3).map((ticker, index) => {
              const priceData = state.latestPrices[ticker];
              if (!priceData || parseFloat(priceData.changePercent) >= 0) return null;
              
              return (
                <div key={ticker} className="flex justify-between items-center">
                  <span className="font-mono text-white">{ticker}</span>
                  <span className="text-bearish font-medium">
                    {priceData.changePercent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stock Chart Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg w-11/12 h-5/6 overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Stock Chart</h2>
              <button
                onClick={closeChart}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <StockChart ticker={selectedStock} />
            </div>
          </div>
        </div>
      )}

      {/* Detailed Market Data */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Detailed Market Data</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">14 symbols</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <MarketOverview onStockClick={handleStockClick} />
      </div>

      {/* Market Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Volume Leaders</h3>
          <div className="space-y-3">
            {state.watchlist.slice(0, 5).map((ticker) => {
              const priceData = state.latestPrices[ticker];
              if (!priceData) return null;
              
              return (
                <div key={ticker} className="flex items-center justify-between">
                  <span className="font-mono text-white">{ticker}</span>
                  <span className="text-gray-400">
                    {priceData.volume.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Price Changes</h3>
          <div className="space-y-3">
            {state.watchlist.slice(0, 5).map((ticker) => {
              const priceData = state.latestPrices[ticker];
              if (!priceData) return null;
              
              return (
                <div key={ticker} className="flex items-center justify-between">
                  <span className="font-mono text-white">{ticker}</span>
                  <div className="flex items-center space-x-2">
                    {getPriceChangeIcon(priceData.changePercent)}
                    <span className={`font-mono ${getPriceChangeColor(priceData.changePercent)}`}>
                      {parseFloat(priceData.changePercent) > 0 ? '+' : ''}{priceData.changePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketData; 