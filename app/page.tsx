"use client";
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const { messages, setMessages, sendMessage, status, error } = useChat({});
  
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || input.trim() === '') return;
    sendMessage({ content: input, role: 'user' } as any);
    setInput('');
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSendDisabled = !input || input.trim() === '';

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* The Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          right: '0',
          width: '380px',
          height: '550px',
          backgroundColor: '#f5f7f9',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          
          {/* Header */}
          <div style={{ backgroundColor: '#5b83ea', color: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Mac Window Controls & Title */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
              </div>
              <div style={{ position: 'absolute', left: '0', right: '0', textAlign: 'center', fontSize: '13px', fontWeight: '600', pointerEvents: 'none' }}>
                AI Engine
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', zIndex: 1, alignItems: 'center' }}>
                {messages.length > 0 && (
                  <button 
                    onClick={() => setMessages([])} 
                    title="Clear Chat"
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)} 
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', padding: 0 }}
                  aria-label="Close Chat"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
            
            {/* Bot Profile Info */}
            <div style={{ padding: '0 16px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <img src="/yetti.png" alt="Yetti AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>Discuss with</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Yetti Assistant</div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', fontSize: '14px', color: '#1a1a1a', border: '1px solid #edf1f5', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                  Hi! I am Yetti the Assistant! 🐾 I can help you find the right corporate training program or professional development courses.
                </div>
                {/* UX IMPROVEMENT: 4 Visually Appealing Quick Start Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button 
                    onClick={() => sendMessage({ content: "What courses do you offer?", role: 'user' } as any)}
                    style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', color: '#334155', transition: 'all 0.2s ease', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ fontSize: '16px' }}>📖</span> Find a Course
                  </button>
                  <button 
                    onClick={() => sendMessage({ content: "How do I request a corporate training quote?", role: 'user' } as any)}
                    style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', color: '#334155', transition: 'all 0.2s ease', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ fontSize: '16px' }}>💼</span> Request a Quote
                  </button>
                  <button 
                    onClick={() => sendMessage({ content: "How can I log in to my courses?", role: 'user' } as any)}
                    style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', color: '#334155', transition: 'all 0.2s ease', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ fontSize: '16px' }}>💻</span> Access LMS
                  </button>
                  <button 
                    onClick={() => sendMessage({ content: "How can I download a course brochure?", role: 'user' } as any)}
                    style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', color: '#334155', transition: 'all 0.2s ease', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ fontSize: '16px' }}>📥</span> Get Brochure
                  </button>
                </div>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: m.role === 'user' ? '#5b83ea' : 'white',
                  color: m.role === 'user' ? 'white' : '#1a1a1a',
                  border: m.role === 'user' ? 'none' : '1px solid #edf1f5',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  maxWidth: '85%'
                }}>
                  <div className="markdown-prose">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                      }}
                    >
                      {(m as any).content || (m as any).text || ((m as any).parts && (m as any).parts.length > 0 ? (m as any).parts.map((p:any) => p.text).join('') : '')}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ backgroundColor: 'white', padding: '14px 16px', borderRadius: '16px', border: '1px solid #edf1f5', display: 'flex', gap: '4px', alignItems: 'center', height: '40px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#5b83ea', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#5b83ea', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#5b83ea', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                 <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', textAlign: 'center' }}>
                   Something went wrong. Please check your API keys or try again!
                   <br />
                   <small>{error.message}</small>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px 20px', backgroundColor: 'white', borderTop: '1px solid #edf1f5' }}>
            <form 
              onSubmit={handleSubmit} 
              style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
            >
              <input 
                name="prompt"
                value={input} 
                onChange={(e) => {
                  console.log("Input changed!", e.target.value);
                  handleInputChange(e);
                }}
                disabled={isLoading}
                placeholder="Type your message..." 
                autoComplete="off"
                style={{ flex: 1, padding: '10px 0', border: 'none', outline: 'none', fontSize: '15px', backgroundColor: 'transparent', color: '#1a1a1a' }}
              />
              <button 
                type="submit" 
                disabled={!input || input.trim() === '' || isLoading} 
                style={{ 
                  padding: '0', 
                  borderRadius: '50%', 
                  border: 'none', 
                  backgroundColor: (!input || input.trim() === '' || isLoading) ? '#e2e8f0' : '#5b83ea', 
                  color: (!input || input.trim() === '' || isLoading) ? '#94a3b8' : 'white', 
                  cursor: (!input || input.trim() === '' || isLoading) ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  flexShrink: 0,
                  transition: 'background-color 0.2s ease, opacity 0.2s ease',
                  opacity: (!input || input.trim() === '' || isLoading) ? 0.8 : 1
                }}
              >
                <svg style={{ pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fab-container" style={{ position: 'relative' }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isOpen ? 'scale(0.9)' : 'scale(1)',
            position: 'relative',
            zIndex: 2,
            padding: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1.15)'}
          onMouseOut={(e) => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)'}
          aria-label="Toggle Chat"
        >
          <img src="/yetti.png" alt="Yetti" style={{ width: '100%', height: '100%', objectFit: 'contain', animation: 'float 3s ease-in-out infinite', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.25))' }} />
        </button>
        
        {/* Sparkles / Stars effect */}
        <div className="stars-wrapper" style={{ position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px', pointerEvents: 'none', zIndex: 1 }}>
          <div className="star star-1">✨</div>
          <div className="star star-2">✨</div>
          <div className="star star-3">✨</div>
        </div>
      </div>
      
      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .fab-container .stars-wrapper { opacity: 0; transition: opacity 0.3s; }
        .fab-container:hover .stars-wrapper { opacity: 1; }
        .fab-container .star { position: absolute; font-size: 24px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform: scale(0.5); opacity: 0; }
        .fab-container:hover .star-1 { transform: translate(0px, 0px) scale(1) rotate(15deg); opacity: 1; transition-delay: 0.05s; }
        .fab-container:hover .star-2 { transform: translate(70px, 10px) scale(1.2) rotate(-15deg); opacity: 1; transition-delay: 0.1s; }
        .fab-container:hover .star-3 { transform: translate(20px, 70px) scale(0.9) rotate(45deg); opacity: 1; transition-delay: 0.15s; }
        .markdown-prose p { margin: 0 0 10px 0; }
        .markdown-prose p:last-child { margin: 0; }
        .markdown-prose ul, .markdown-prose ol { margin: 0 0 10px 0; padding-left: 20px; }
        .markdown-prose li { margin-bottom: 4px; }
        .markdown-prose strong { font-weight: 600; }
        .markdown-prose a { color: #2563eb; text-decoration: underline; text-underline-offset: 2px; }
        .markdown-prose a:hover { color: #1d4ed8; }
      `}} />
    </div>
  );
}