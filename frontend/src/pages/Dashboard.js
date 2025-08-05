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
  Database,
  Mail
} from 'lucide-react';
import PriceChart from '../components/PriceChart';
import SignalCard from '../components/SignalCard';
import MarketOverview from '../components/MarketOverview';

const Dashboard = () => {
  const { state } = useTrading();

  // Calculate summary stats based on actual backend capabilities
  const totalTickers = state.watchlist.length;
  const dataIngestionStatus = state.taskStatus.dailyDataIngestion;
  const lastExecution = state.taskStatus.lastExecution ? new Date(state.taskStatus.lastExecution).toLocaleDateString() : 'Never';
  const nextScheduled = state.taskStatus.nextScheduled ? new Date(state.taskStatus.nextScheduled).toLocaleDateString() : 'Not Set';

  const summaryCards = [
    {
      title: 'Watchlist',
      value: totalTickers,
      change: 'Fixed',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'text-bullish',
      description: 'Polygon.io tickers'
    },
    {
      title: 'Data Ingestion',
      value: dataIngestionStatus,
      change: 'Weekdays 6PM',
      changeType: 'positive',
      icon: Activity,
      color: 'text-blue-500',
      description: 'Daily OHLCV data'
    },
    {
      title: 'Last Execution',
      value: lastExecution,
      change: 'Email notifications',
      changeType: 'positive',
      icon: Clock,
      color: 'text-green-500',
      description: 'Task completion'
    },
    {
      title: 'Next Scheduled',
      value: nextScheduled,
      change: '7PM Summary',
      changeType: 'neutral',
      icon: TrendingDown,
      color: 'text-gray-400',
      description: 'Daily summary email'
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <MarketOverview />
          </div>
        </div>

        {/* Task Status */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Task Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Daily Data Ingestion</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">{state.taskStatus.dailyDataIngestion}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Email Notifications</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Schedule</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">Weekdays 6PM</span>
                </div>
              </div>
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
                  <span className="text-sm text-bullish">{state.systemStatus.dataIngestion}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Email Notifications</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-bullish" />
                  <span className="text-sm text-bullish">{state.systemStatus.emailNotifications}</span>
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

      {/* Data Overview */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Data Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Polygon.io Integration</p>
                <p className="text-xs text-gray-400 mt-1">
                  Daily OHLCV data ingestion for 14 tickers
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">
                    REST API
                  </span>
                  <span className="text-xs text-gray-400">
                    Weekdays 6PM EST
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-green-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Email Notifications</p>
                <p className="text-xs text-gray-400 mt-1">
                  Task lifecycle and daily summary emails
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
                    Active
                  </span>
                  <span className="text-xs text-gray-400">
                    7PM Summary
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Scheduled Tasks</p>
                <p className="text-xs text-gray-400 mt-1">
                  Celery-based automation with Redis
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-gray-500/20 text-gray-400">
                    Automated
                  </span>
                  <span className="text-xs text-gray-400">
                    Market hours only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 