import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Mic, MicOff, Send, Volume2, Brain, MessageSquare } from 'lucide-react';

const VoiceAssistant = () => {
  const { state, actions } = useTrading();
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    actions.setListening(!isListening);
    
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        const mockTranscript = "What's the current market sentiment for AAPL?";
        actions.setVoiceTranscript(mockTranscript);
        setInputText(mockTranscript);
      }, 2000);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Simulate AI response
    const mockResponse = "Based on current market data, AAPL shows bullish momentum with strong earnings and positive guidance. The stock is up 2.5% today with increased volume. I recommend monitoring the $150 resistance level.";
    actions.setVoiceResponse(mockResponse);
    setInputText('');
  };

  const voiceCommands = [
    "What's the current price of AAPL?",
    "Show me bullish signals",
    "What's the market sentiment?",
    "Analyze DE stock",
    "Show recent trading signals",
    "What's the volume for QQQ?"
  ];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Voice Assistant</h1>
          <p className="text-gray-400">
            Future AI-powered voice commands and analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-sm text-gray-400">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Coming Soon Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Input */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Voice Interface</h2>
          
          {/* Coming Soon Message */}
          <div className="text-center py-12">
            <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400 mb-4">
              Voice interface will be available once Whisper and TTS integration is implemented.
            </p>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-medium text-white mb-2">Planned Features:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• OpenAI Whisper for speech-to-text</li>
                <li>• gTTS/ElevenLabs for text-to-speech</li>
                <li>• Natural language commands</li>
                <li>• Voice-activated trading queries</li>
              </ul>
            </div>
          </div>

            {/* Voice Commands */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Commands</h3>
              <div className="grid grid-cols-1 gap-2">
                {voiceCommands.map((command, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(command)}
                    className="text-left text-sm text-gray-400 hover:text-white transition-colors p-2 rounded border border-gray-700 hover:border-green-500"
                  >
                    "{command}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Output */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">AI Response</h2>
          
          {state.voiceResponse ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-bullish mt-1" />
                <div className="flex-1">
                  <p className="text-white">{state.voiceResponse}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors">
                  <Volume2 className="w-4 h-4" />
                  <span>Play Audio</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No response yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Ask a question or use voice commands
              </p>
            </div>
          )}
        </div>
      

      {/* Chat History */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Conversation History</h2>
        
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {state.voiceTranscript && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-dashboard-border rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-white">{state.voiceTranscript}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
          
          {state.voiceResponse && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-bullish rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white">{state.voiceResponse}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
          
          {!state.voiceTranscript && !state.voiceResponse && (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">No conversation history</p>
            </div>
          )}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Voice Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Voice Language</label>
            <select className="w-full bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Voice Speed</label>
            <select className="w-full bg-dashboard-border border border-gray-700 rounded-lg px-3 py-2 text-white">
              <option>Normal</option>
              <option>Fast</option>
              <option>Slow</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant; 