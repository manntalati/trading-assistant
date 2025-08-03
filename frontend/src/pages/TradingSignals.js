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
            AI-generated trading insights and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-bullish" />
          <span className="text-sm text-bullish">Live Signals</span>
        </div>
      </div>

      {/* Signal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-bullish" />
            <div>
              <p className="text-sm text-gray-400">Bullish Signals</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <TrendingDown className="w-8 h-8 text-bearish" />
            <div>
              <p className="text-sm text-gray-400">Bearish Signals</p>
              <p className="text-2xl font-bold text-white">5</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-bullish" />
            <div>
              <p className="text-sm text-gray-400">AI Insights</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-bullish" />
            <div>
              <p className="text-sm text-gray-400">Active Signals</p>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Signals */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Active Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.signals.filter(s => s.status === 'active').map((signal, index) => (
            <SignalCard key={index} signal={signal} />
          ))}
          {state.signals.filter(s => s.status === 'active').length === 0 && (
            <div className="col-span-full text-center py-8">
              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No active signals</p>
            </div>
          )}
        </div>
      </div>

      {/* All Signals */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">All Signals</h2>
        <div className="space-y-4">
          {state.signals.map((signal, index) => (
            <SignalCard key={index} signal={signal} />
          ))}
          {state.signals.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No signals available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingSignals; 