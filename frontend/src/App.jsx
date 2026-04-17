import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/dashboard/Dashboard';
import ChatInterface from './components/chat/ChatInterface';

// Initialize React Query Client optimizing aggressive cache 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

function MainApp() {
  const [activeTab, setActiveTab] = useState('landing');
  
  // NOTE: For demo purposes bypassing auth. In prod, connect to AuthProvider React Context

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col p-6 items-center">
      {/* Dynamic Backgrounds */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] animate-pulse delay-700 pointer-events-none"></div>

      {/* Primary Top Navigation Layer */}
      <nav className="w-full max-w-7xl flex justify-between items-center mb-10 z-50 glass rounded-2xl px-8 py-4 border border-white/10">
        <div 
           className="flex items-center gap-3 cursor-pointer group"
           onClick={() => setActiveTab('landing')}
        >
          <div className="bg-primary-500/20 p-2 rounded-lg border border-primary-500/30 group-hover:bg-primary-500/40 transition-colors">
            <Sparkles className="text-primary-400 w-6 h-6" />
          </div>
          <span className="text-white font-extrabold text-2xl tracking-tight">Smart Vault</span>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => setActiveTab('dashboard')}
             className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}
          >
             Document Library
          </button>
          <button 
             onClick={() => setActiveTab('chat')}
             className={`px-8 py-2 rounded-xl font-bold transition-all ${activeTab === 'chat' ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'bg-primary-600/30 text-gray-200 hover:bg-primary-600'}`}
          >
             Launch RAG Chat
          </button>
        </div>
      </nav>

      {/* Main Orchestration Layer */}
      <main className="w-full max-w-7xl z-10 flex flex-col items-center justify-center flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div 
               key="landing"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="text-center max-w-4xl mt-12"
            >
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-primary-100 to-primary-300 text-transparent bg-clip-text">
                Your Knowledge, Perfected.
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Ingest massive organizational datasets instantly. Query them natively using high-dimensional Vector Search paired with advanced LLM analysis ensuring zero hallucinations.
              </p>
              <button 
                 onClick={() => setActiveTab('dashboard')}
                 className="bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg py-5 px-14 rounded-2xl shadow-2xl shadow-primary-600/40 transition-transform hover:scale-105 active:scale-95"
              >
                 Enter The Vault
              </button>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
             <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
               <Dashboard />
             </motion.div>
          )}

          {activeTab === 'chat' && (
             <motion.div key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
               <ChatInterface />
             </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}

export default App;
