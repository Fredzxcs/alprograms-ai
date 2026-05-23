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
    <div style={{ minHeight: '100vh', backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: 'min(100%, 900px)', maxHeight: '100%', backgroundColor: '#f5f7f9', borderRadius: '24px', boxShadow: '0 32px 80px rgba(31, 41, 55, 0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: '#5b83ea', color: 'white', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/yetti.png" alt="Yetti" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>ALPrograms Chat Assistant</div>
            <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.1 }}>Yetti Assistant</div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {messages.length === 0 && (
            <div style={{ borderRadius: '18px', backgroundColor: 'white', padding: '22px', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' }}>
              <div style={{ fontSize: '15px', color: '#111827', marginBottom: '12px' }}>
                Hi! I am Yetti the Assistant! 🐾 I can help you find the right corporate training program or professional development courses.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                <button type="button" onClick={() => sendMessage({ content: 'What courses do you offer?', role: 'user' } as any)} style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left' }}>
                  📖 Find a Course
                </button>
                <button type="button" onClick={() => sendMessage({ content: 'How do I request a corporate training quote?', role: 'user' } as any)} style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left' }}>
                  💼 Request a Quote
                </button>
                <button type="button" onClick={() => sendMessage({ content: 'How can I log in to my courses?', role: 'user' } as any)} style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left' }}>
                  💻 Access LMS
                </button>
                <button type="button" onClick={() => sendMessage({ content: 'How can I download a course brochure?', role: 'user' } as any)} style={{ padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: '#1f2937', cursor: 'pointer', textAlign: 'left' }}>
                  📥 Get Brochure
                </button>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '85%', padding: '16px 18px', borderRadius: '20px', backgroundColor: m.role === 'user' ? '#5b83ea' : 'white', color: m.role === 'user' ? 'white' : '#111827', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>
                <div className="markdown-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '18px', backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5b83ea', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5b83ea', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.15s' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5b83ea', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.3s' }}></span>
              </div>
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '16px', padding: '14px 16px', border: '1px solid #fecaca' }}>
              Something went wrong. Please check your API keys or try again.
              <div style={{ marginTop: '8px', fontSize: '13px' }}>{error.message}</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '18px 24px', backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
          <input
            name="prompt"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Type your message..."
            autoComplete="off"
            style={{ flex: 1, minWidth: 0, border: '1px solid #d1d5db', borderRadius: '16px', padding: '14px 16px', fontSize: '15px', backgroundColor: '#f8fafc', color: '#111827', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: !input.trim() || isLoading ? '#e5e7eb' : '#5b83ea', color: 'white', cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      ` }} />
    </div>
  );
}
