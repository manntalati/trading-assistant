import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Bell, 
  Mic, 
  Settings, 
  Activity,
  Zap,
  Brain
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      path: '/',
      icon: BarChart3,
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      path: '/market-data',
      icon: TrendingUp,
      label: 'Market Data',
      description: 'Real-time Prices'
    },
    {
      path: '/signals',
      icon: Bell,
      label: 'Trading Signals',
      description: 'AI Insights'
    },
    {
      path: '/voice',
      icon: Mic,
      label: 'Voice Assistant',
      description: 'Voice Commands'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'Configuration'
    }
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Trading Assistant</h1>
            <p className="text-xs text-gray-400">AI-Powered</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <div className="flex-1">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-gray-700">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">System Status</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-bullish rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-bullish rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-bullish rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-bullish" />
              <span className="text-xs text-gray-400">Data Ingestion</span>
              <span className="text-xs text-bullish">● Active</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-bullish" />
              <span className="text-xs text-gray-400">AI Agent</span>
              <span className="text-xs text-bullish">● Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 