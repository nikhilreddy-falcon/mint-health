import React, { useState, useRef, useEffect } from 'react';
import '../styles/FalconBot.css';

function FalconBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m FalconBot, your AI assistant for Mint Health analytics. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botMessage = {
        role: 'assistant',
        content: 'I\'m currently in development mode. Soon I\'ll be able to help you with:\n\n• Analyzing sales trends and forecasts\n• Inventory management insights\n• Supply chain optimization\n• Customer behavior analysis\n• Financial reporting and analytics\n• Real-time data queries\n\nStay tuned for these exciting features!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedPrompts = [
    'Show me today\'s sales performance',
    'What are the top selling products?',
    'Analyze inventory levels',
    'Customer satisfaction trends'
  ];

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="falconbot-container">
      {/* Header */}
      <div className="falconbot-header">
        <div className="falconbot-header-content">
          <div className="falconbot-avatar">
            <img src="/bot.png" alt="FalconBot" />
          </div>
          <div className="falconbot-header-text">
            <h2>FalconBot</h2>
            <p>AI-Powered Analytics Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="falconbot-messages">
        <div className="falconbot-messages-inner">
          {messages.map((message, index) => (
            <div key={index} className={`message-wrapper ${message.role}`}>
              <div className="message-content">
                {message.role === 'assistant' && (
                  <div className="message-avatar">
                    <img src="/bot.png" alt="FalconBot" />
                  </div>
                )}
                <div className="message-bubble">
                  <div className="message-text">{message.content}</div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
                {message.role === 'user' && (
                  <div className="message-avatar user-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper assistant">
              <div className="message-content">
                <div className="message-avatar">
                  <img src="/bot.png" alt="FalconBot" />
                </div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="suggested-prompts">
            <p className="suggested-prompts-title">Try asking:</p>
            <div className="suggested-prompts-grid">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="suggested-prompt-btn"
                  onClick={() => handleSuggestedPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="falconbot-input-area">
        <form onSubmit={handleSubmit} className="falconbot-input-form">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message FalconBot..."
              rows="1"
              className="falconbot-textarea"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="falconbot-send-btn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </form>
        <p className="falconbot-disclaimer">
          FalconBot can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

export default FalconBot;
