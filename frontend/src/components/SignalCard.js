import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const SignalCard = ({ signal }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-bullish" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-bearish" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-neutral" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-bullish';
      case 'bearish':
        return 'text-bearish';
      default:
        return 'text-neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-bullish" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-neutral" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-bullish';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-neutral';
    }
  };

  // Mock signal data if none provided
  const mockSignal = {
    id: '1',
    ticker: 'AAPL',
    sentiment: 'bullish',
    status: 'active',
    confidence: 85,
    price: 150.25,
    target: 165.00,
    stopLoss: 140.00,
    reasoning: 'Strong earnings beat and positive guidance',
    timestamp: new Date().toISOString(),
    ...signal
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {getSentimentIcon(mockSignal.sentiment)}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-medium text-white">{mockSignal.ticker}</span>
              <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(mockSignal.sentiment)} bg-opacity-20`}>
                {mockSignal.sentiment}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {mockSignal.reasoning}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {getStatusIcon(mockSignal.status)}
            <span className={`text-xs ${getStatusColor(mockSignal.status)}`}>
              {mockSignal.status}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(mockSignal.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-gray-400">Price:</span>
          <div className="font-mono text-white">${mockSignal.price}</div>
        </div>
        <div>
          <span className="text-gray-400">Target:</span>
          <div className="font-mono text-bullish">${mockSignal.target}</div>
        </div>
        <div>
          <span className="text-gray-400">Stop Loss:</span>
          <div className="font-mono text-bearish">${mockSignal.stopLoss}</div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Confidence</span>
          <span className="text-white">{mockSignal.confidence}%</span>
        </div>
        <div className="w-full bg-dashboard-border rounded-full h-1 mt-1">
          <div 
            className={`h-1 rounded-full ${
              mockSignal.sentiment === 'bullish' ? 'bg-bullish' : 'bg-bearish'
            }`}
            style={{ width: `${mockSignal.confidence}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SignalCard; 