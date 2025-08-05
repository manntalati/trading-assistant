import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const StockChart = ({ ticker }) => {
  const { state, actions } = useTrading();
  const [period, setPeriod] = useState('1m');
  
  const periods = [
    { value: '5d', label: '5D' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' }
  ];

  useEffect(() => {
    if (ticker) {
      actions.fetchStockDetails(ticker);
    }
  }, [ticker, period]);

  const chartData = state.chartData[ticker]?.data || [];
  const stockDetails = state.stockDetails[ticker];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-green-500">
            Close: {formatPrice(data.close)}
          </p>
          <p className="text-gray-400">
            Open: {formatPrice(data.open)}
          </p>
          <p className="text-gray-400">
            High: {formatPrice(data.high)}
          </p>
          <p className="text-gray-400">
            Low: {formatPrice(data.low)}
          </p>
          <p className="text-gray-400">
            Volume: {formatVolume(data.volume)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">{ticker}</h2>
          {stockDetails && (
            <p className="text-gray-400">{stockDetails.name}</p>
          )}
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-green-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Info */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Current</p>
            <p className="text-white font-semibold">
              {formatPrice(chartData[chartData.length - 1].close)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Open</p>
            <p className="text-white font-semibold">
              {formatPrice(chartData[chartData.length - 1].open)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-sm">High</p>
            <p className="text-green-500 font-semibold">
              {formatPrice(chartData[chartData.length - 1].high)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Low</p>
            <p className="text-red-500 font-semibold">
              {formatPrice(chartData[chartData.length - 1].low)}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => formatPrice(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Volume</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart3 data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={10}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={10}
                tickFormatter={(value) => formatVolume(value)}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-lg">
                        <p className="text-white text-sm">{label}</p>
                        <p className="text-gray-400 text-sm">
                          Volume: {formatVolume(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#6B7280"
                fill="#6B7280"
                fillOpacity={0.3}
              />
            </BarChart3>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StockChart; 