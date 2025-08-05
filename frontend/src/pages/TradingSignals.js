import React from 'react';
import { useTrading } from '../context/TradingContext';
import SignalCard from '../components/SignalCard';
import { Bell, TrendingUp, TrendingDown, Brain } from 'lucide-react';

const TradingSignals = () => {
  const { state } = useTrading();

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trading Signals</h1>
          <p className="text-gray-400">
            Future AI-generated trading insights and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Coming Soon</span>
        </div>
      </div>

      {/* Signal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Bullish Signals</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingDown className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Bearish Signals</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">AI Insights</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Active Signals</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Trading Signals</h2>
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-gray-400 mb-4">
            AI-powered trading signals and insights will be available once the LLM integration is implemented.
          </p>
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="text-sm font-medium text-white mb-2">Planned Features:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• LangChain-powered signal generation</li>
              <li>• Real-time market analysis</li>
              <li>• Risk assessment and recommendations</li>
              <li>• Historical signal performance tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSignals; 