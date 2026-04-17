import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, File, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadDocument, fetchDocuments } from '../../services/api';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setFile(null);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Upload failed');
    }
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onUploadSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto h-[75vh]">
      
      {/* Upload Zone */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-1/3 bg-surface/50 rounded-3xl border border-white/5 p-8 flex flex-col items-center justify-center glass shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Ingest Knowledge</h2>
        
        <form 
          className={`relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${dragActive ? 'border-primary-500 bg-primary-500/10' : 'border-white/20 bg-background/50 hover:bg-white/5 hover:border-white/30'}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" onChange={handleChange} accept=".pdf,.txt,.doc,.docx" />
          
          <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
          <p className="text-gray-300 font-medium text-center px-4">
            {file ? file.name : 'Drag & drop a file here, or click to browse'}
          </p>
          <p className="text-gray-500 text-xs mt-2">Support: PDF, TXT, DOCX</p>
        </form>

        {errorMsg && (
          <div className="mt-4 flex items-center text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errorMsg}
          </div>
        )}

        <button 
          onClick={onUploadSubmit}
          disabled={!file || uploadMutation.isPending}
          className="mt-6 w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {uploadMutation.isPending ? 'Processing Pipeline...' : 'Embed Document'}
        </button>
      </motion.div>

      {/* Library Grid */}
      <motion.div 
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         className="w-full md:w-2/3 bg-surface/50 rounded-3xl border border-white/5 p-8 glass shadow-xl overflow-hidden flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Your Vault</h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {isLoading ? (
            <p className="text-gray-400 text-center mt-10">Fetching your documents from MongoDB...</p>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
               <File className="w-12 h-12 mb-4 opacity-50" />
               <p>Your vault is empty. Upload your first document to begin Vector Search integration.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <motion.div 
                key={doc._id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="bg-primary-500/20 p-3 rounded-lg mr-4">
                    <File className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold truncate max-w-sm">{doc.originalName}</h3>
                    <p className="text-gray-400 text-xs mt-1">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${doc.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : doc.status === 'PROCESSING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {doc.status}
                  </span>
                  <button className="text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
