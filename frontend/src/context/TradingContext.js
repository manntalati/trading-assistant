import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const TradingContext = createContext();

const initialState = {
  // Market data - matches actual backend watchlist
  watchlist: ['DE', 'APPL', 'AMD', 'DELL', 'FIG', 'UBER', 'MRVL', 'CSCO', 'VICI', 'PUBM', 'AVD', 'PDSB', 'QQQ', 'VOO'],
  marketData: {},
  latestPrices: {},
  stockDetails: {},
  selectedStock: null,
  chartData: {},
  chartPeriod: '1m',
  
  // Task status - reflects actual backend capabilities
  taskStatus: {
    dailyDataIngestion: 'idle',
    lastExecution: null,
    nextScheduled: null
  },
  
  // System status - accurate to current backend
  systemStatus: {
    dataIngestion: 'idle',
    emailNotifications: 'idle',
    lastUpdate: null
  },
  
  // User preferences
  preferences: {
    autoRefresh: true,
    notifications: true,
    theme: 'dark'
  },
  
  // Voice assistant - placeholder for future implementation
  voiceTranscript: '',
  voiceResponse: '',
  isListening: false
};

function tradingReducer(state, action) {
  switch (action.type) {
    case 'SET_MARKET_DATA':
      return {
        ...state,
        marketData: { ...state.marketData, ...action.payload }
      };
      
    case 'SET_LATEST_PRICES':
      return {
        ...state,
        latestPrices: { ...state.latestPrices, ...action.payload }
      };
      
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        taskStatus: { ...state.taskStatus, ...action.payload }
      };
      
    case 'SET_SELECTED_STOCK':
      return {
        ...state,
        selectedStock: action.payload
      };
      
    case 'SET_CHART_DATA':
      return {
        ...state,
        chartData: { ...state.chartData, ...action.payload }
      };
      
    case 'SET_CHART_PERIOD':
      return {
        ...state,
        chartPeriod: action.payload
      };
      
    case 'SET_STOCK_DETAILS':
      return {
        ...state,
        stockDetails: { ...state.stockDetails, ...action.payload }
      };
      
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: {
          ...state.systemStatus,
          ...action.payload,
          lastUpdate: new Date().toISOString()
        }
      };
      
    case 'SET_VOICE_TRANSCRIPT':
      return {
        ...state,
        voiceTranscript: action.payload
      };
      
    case 'SET_VOICE_RESPONSE':
      return {
        ...state,
        voiceResponse: action.payload
      };
      
    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.payload
      };
      
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
      
    default:
      return state;
  }
}

export function TradingProvider({ children }) {
  const [state, dispatch] = useReducer(tradingReducer, initialState);

  // Fetch market data periodically
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/watchlist');
        const stocks = response.data.stocks;
        
        const marketData = {};
        const latestPrices = {};
        
        stocks.forEach(stock => {
          marketData[stock.ticker] = {
            price: stock.close,
            change: stock.change,
            changePercent: stock.change_percent,
            open: stock.open,
            high: stock.high,
            low: stock.low,
            volume: stock.volume,
            date: stock.date
          };
          latestPrices[stock.ticker] = stock.close;
        });
        
        dispatch({ type: 'SET_MARKET_DATA', payload: marketData });
        dispatch({ type: 'SET_LATEST_PRICES', payload: latestPrices });
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up interval for auto-refresh
    if (state.preferences.autoRefresh) {
      const interval = setInterval(fetchMarketData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.preferences.autoRefresh]);

  // Fetch system status
  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get('/api/system-status');
        dispatch({ type: 'UPDATE_SYSTEM_STATUS', payload: response.data });
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch stock details and chart data
  const fetchStockDetails = async (ticker) => {
    try {
      const [detailsResponse, chartResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/stock/${ticker}`),
        axios.get(`http://localhost:8000/api/stock/${ticker}/chart?period=${state.chartPeriod}`)
      ]);
      
      dispatch({ 
        type: 'SET_STOCK_DETAILS', 
        payload: { [ticker]: detailsResponse.data } 
      });
      
      dispatch({ 
        type: 'SET_CHART_DATA', 
        payload: { [ticker]: chartResponse.data } 
      });
    } catch (error) {
      console.error('Failed to fetch stock details:', error);
    }
  };

  const value = {
    state,
    dispatch,
    actions: {
      setMarketData: (data) => dispatch({ type: 'SET_MARKET_DATA', payload: data }),
      setLatestPrices: (prices) => dispatch({ type: 'SET_LATEST_PRICES', payload: prices }),
      setSelectedStock: (stock) => dispatch({ type: 'SET_SELECTED_STOCK', payload: stock }),
      setChartPeriod: (period) => dispatch({ type: 'SET_CHART_PERIOD', payload: period }),
      fetchStockDetails: fetchStockDetails,
      setVoiceTranscript: (transcript) => dispatch({ type: 'SET_VOICE_TRANSCRIPT', payload: transcript }),
      setVoiceResponse: (response) => dispatch({ type: 'SET_VOICE_RESPONSE', payload: response }),
      setListening: (isListening) => dispatch({ type: 'SET_LISTENING', payload: isListening }),
      updatePreferences: (preferences) => dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
    }
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
} 