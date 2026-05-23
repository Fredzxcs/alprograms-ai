"use client";
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const { messages, setMessages, sendMessage, status, error } = useChat({});
  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || input.trim() === '') return;
    sendMessage({ content: input, role: 'user' } as any);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* THE RESTORED MAC-STYLE HEADER */}
      <div style={{ backgroundColor: '#5b83ea', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        
        {/* Mac Window Controls & Title */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
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
            {/* The "Close" X Button - Triggers WordPress to close the window */}
            <button 
              onClick={() => window.parent.postMessage('close-yetti', '*')} 
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', padding: 0 }}
              aria-label="Close Chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        
        {/* Bot Profile Info */}
        <div style={{ padding: '12px 16px 16px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <img src="/yetti.png" alt="Yetti AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '2px' }}>Discuss with</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: '1.1' }}>Yetti Assistant</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <div style={{ borderRadius: '16px', backgroundColor: 'white', padding: '18px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
            <div style={{ fontSize: '14px', color: '#111827', marginBottom: '12px' }}>
              Hi! I am Yetti the Assistant! 🐾 I can help you find the right corporate training program or professional development courses.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
              <button type="button" onClick={() => sendMessage({ content: 'What courses do you offer?', role: 'user' } as any)} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left', fontSize: '13px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                📖 Find a Course
              </button>
              <button type="button" onClick={() => sendMessage({ content: 'How do I request a corporate training quote?', role: 'user' } as any)} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left', fontSize: '13px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                💼 Request a Quote
              </button>
              <button type="button" onClick={() => sendMessage({ content: 'How can I log in to my courses?', role: 'user' } as any)} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left', fontSize: '13px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                💻 Access LMS
              </button>
              <button type="button" onClick={() => sendMessage({ content: 'How can I download a course brochure?', role: 'user' } as any)} style={{ padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left', fontSize: '13px', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                📥 Get Brochure
              </button>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', padding: '14px 16px', borderRadius: '18px', backgroundColor: m.role === 'user' ? '#5b83ea' : 'white', color: m.role === 'user' ? 'white' : '#111827', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
              <div className="markdown-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: m.role === 'user' ? 'white' : '#2563eb', textDecoration: 'underline' }} />,
                  }}
                >
                  {(m as any).content || (m as any).text || ((m as any).parts && (m as any).parts.length > 0 ? (m as any).parts.map((p: any) => p.text).join('') : '')}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 16px', borderRadius: '16px', backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b83ea', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b83ea', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.15s' }}></span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5b83ea', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.3s' }}></span>
            </div>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '16px', padding: '12px 14px', border: '1px solid #fecaca', fontSize: '13px' }}>
            Something went wrong. Please check your API keys or try again.
            <div style={{ marginTop: '4px', fontSize: '12px' }}>{error.message}</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '14px 16px', backgroundColor: 'white', borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Type your message..."
          autoComplete="off"
          style={{ flex: 1, minWidth: 0, border: '1px solid #d1d5db', borderRadius: '14px', padding: '12px 14px', fontSize: '14px', backgroundColor: '#f8fafc', color: '#111827', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', backgroundColor: !input.trim() || isLoading ? '#e5e7eb' : '#5b83ea', color: 'white', cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.2s' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      ` }} />
    </div>
  );
}