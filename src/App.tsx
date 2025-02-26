import React, { useState, useEffect } from 'react';
import { AppState, Attachment, MsgFile } from './types';
import EmailViewer from './components/EmailViewer';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import LoadingState from './components/LoadingState';
import './styles/global.css';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentFile: null,
    filePath: null,
    loading: false,
    error: null,
    selectedAttachment: null
  });
  
  // Handle file opening
  const handleOpenFile = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Open file dialog
      const filePath = await window.api.openFile();
      
      if (!filePath) {
        // User canceled the dialog
        setState(prev => ({ ...prev, loading: false }));
        return;
      }
      
      // Parse the MSG file
      const msgFile = await window.api.parseMsgFile(filePath);
      
      setState(prev => ({
        ...prev,
        currentFile: msgFile,
        filePath,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error opening file:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to open file'
      }));
    }
  };
  
  // Handle attachment saving
  const handleSaveAttachment = async (attachment: Attachment) => {
    try {
      setState(prev => ({ ...prev, selectedAttachment: attachment }));
      
      const result = await window.api.saveAttachment({
        fileName: attachment.fileName,
        content: attachment.content
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save attachment');
      }
      
      setState(prev => ({ ...prev, selectedAttachment: null }));
    } catch (error) {
      console.error('Error saving attachment:', error);
      setState(prev => ({ ...prev, selectedAttachment: null }));
      throw error; // Re-throw to be handled by the component
    }
  };
  
  // Render content based on state
  const renderContent = () => {
    if (state.loading) {
      return <LoadingState />;
    }
    
    if (state.error) {
      return <ErrorState message={state.error} onRetry={handleOpenFile} />;
    }
    
    if (!state.currentFile) {
      return <EmptyState onOpenFile={handleOpenFile} />;
    }
    
    return (
      <EmailViewer 
        email={state.currentFile} 
        onSaveAttachment={handleSaveAttachment} 
      />
    );
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">MSG Viewer</h1>
        <button 
          className="btn btn-secondary"
          onClick={handleOpenFile}
          disabled={state.loading}
          aria-label="Open a different MSG file"
        >
          Open File
        </button>
      </header>
      
      <main className="app-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
