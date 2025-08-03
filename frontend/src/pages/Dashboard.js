import React from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain
} from 'lucide-react';
import PriceChart from '../components/PriceChart';
import SignalCard from '../components/SignalCard';
import MarketOverview from '../components/MarketOverview';

const Dashboard = () => {
  const { state } = useTrading();

  // Calculate summary stats
  const totalTickers = state.watchlist.length;
  const activeSignals = state.signals.filter(s => s.status === 'active').length;
  const bullishSignals = state.signals.filter(s => s.sentiment === 'bullish').length;
  const bearishSignals = state.signals.filter(s => s.sentiment === 'bearish').length;

  const summaryCards = [
    {
      title: 'Watchlist',
      value: totalTickers,
      change: '+2',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-bullish'
    },
    {
      title: 'Active Signals',
      value: activeSignals,
      change: '+3',
      changeType: 'positive',
      icon: Activity,
      color: 'text-bullish'
    },
    {
      title: 'Bullish Signals',
      value: bullishSignals,
      change: '+5',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-bullish'
    },
    {
      title: 'Bearish Signals',
      value: bearishSignals,
      change: '-2',
      changeType: 'negative',
      icon: TrendingDown,
      color: 'text-bearish'
    }
  ];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Real-time trading insights and market overview
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-bullish">
            <div className="w-2 h-2 bg-bullish rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
          <span className="text-sm text-gray-400">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`text-sm ${card.changeType === 'positive' ? 'text-bullish' : 'text-bearish'}`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-400">from yesterday</span>
                </div>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Market Overview</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Auto-refresh</span>
                <div className="w-2 h-2 bg-bullish rounded-full animate-pulse"></div>
              </div>
            </div>
            <MarketOverview />
          </div>
        </div>

        {/* Recent Signals */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Signals</h2>
            <div className="space-y-3">
              {state.signals.slice(0, 5).map((signal, index) => (
                <SignalCard key={index} signal={signal} />
              ))}
              {state.signals.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">No signals yet</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Data Ingestion</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">AI Agent</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Voice Service</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">Ready</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Last Update</span>
                <span className="text-sm text-gray-400">
                  {state.systemStatus.lastUpdate ? 
                    new Date(state.systemStatus.lastUpdate).toLocaleTimeString() : 
                    'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.aiInsights.slice(0, 6).map((insight, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-bullish mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{insight.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {insight.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.sentiment === 'bullish' ? 'bg-bullish/20 text-bullish' :
                      insight.sentiment === 'bearish' ? 'bg-bearish/20 text-bearish' :
                      'bg-neutral/20 text-neutral'
                    }`}>
                      {insight.sentiment}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {state.aiInsights.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No AI insights yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 