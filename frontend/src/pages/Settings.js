import React from 'react';
import { useTrading } from '../context/TradingContext';
import { Settings, Bell, RefreshCw, Database, Brain, Mic, Shield } from 'lucide-react';

const Settings = () => {
  const { state, actions } = useTrading();

  const handlePreferenceChange = (key, value) => {
    actions.updatePreferences({ [key]: value });
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">
            Configure your trading assistant preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-bullish" />
          <span className="text-sm text-bullish">Configuration</span>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Auto-refresh</p>
                <p className="text-sm text-gray-400">Automatically refresh market data</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.preferences.autoRefresh}
                onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dashboard-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bullish"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-sm text-gray-400">Receive email notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.preferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dashboard-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bullish"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Data Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Refresh Interval</label>
            <select className="w-full mt-2 bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>30 seconds</option>
              <option>1 minute</option>
              <option>5 minutes</option>
              <option>15 minutes</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Data Source</label>
            <select className="w-full mt-2 bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>Polygon.io</option>
              <option>Alpha Vantage</option>
              <option>Yahoo Finance</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Historical Data</p>
                <p className="text-sm text-gray-400">Store historical data locally</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dashboard-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bullish"></div>
            </label>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">AI Model</label>
            <select className="w-full mt-2 bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>GPT-4</option>
              <option>GPT-3.5</option>
              <option>Claude</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Confidence Threshold</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Auto Analysis</p>
                <p className="text-sm text-gray-400">Automatically analyze market data</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dashboard-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bullish"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Voice Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Voice Language</label>
            <select className="w-full mt-2 bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Voice Speed</label>
            <select className="w-full mt-2 bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>Normal</option>
              <option>Fast</option>
              <option>Slow</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Voice Commands</p>
                <p className="text-sm text-gray-400">Enable voice input</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-dashboard-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bullish"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Enhanced security</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-dashboard-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bullish"></div>
            </label>
          </div>

          <button className="w-full bg-bearish hover:bg-bearish/80 text-white py-2 px-4 rounded-lg transition-colors">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 