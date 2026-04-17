import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendChatQuery } from '../../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { answer, citations } = await sendChatQuery(userMessage.content);
      const aiMessage = { role: 'ai', content: answer, citations };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error communicating with intelligence database. Ensure backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-4xl mx-auto bg-surface/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden glass">
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <FileText className="w-16 h-16 mb-4" />
            <p>Ask anything about your documents...</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white/10 text-gray-100 border border-white/5'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-background/80 max-w-none">
                {msg.content}
              </ReactMarkdown>
            </div>
            
            {/* Interactive Citations Block */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto max-w-[85%] scrollbar-hide p-1">
                {msg.citations.map((cite, i) => (
                  <span key={i} className="text-xs font-semibold bg-white/5 border border-white/10 hover:border-primary-500 rounded-full px-3 py-1.5 cursor-help group relative transition-colors">
                    [Source {i + 1}]
                    
                    {/* Tooltip to view raw vector chunk context */}
                    <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-72 bg-background p-4 rounded-xl border border-white/10 shadow-2xl text-[11px] font-normal z-50 text-gray-300 pointer-events-none">
                      <p className="border-b border-white/10 pb-2 mb-2 text-primary-400">Context Confidence: {(cite.score*100).toFixed(1)}%</p>
                      {cite.text.substring(0, 300)}...
                    </div>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Loading Bubble */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-md">
               <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-surface/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query your knowledge vault..."
            className="w-full bg-background/50 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-inner transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 p-3 bg-primary-600 hover:bg-primary-500 rounded-full text-white transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
