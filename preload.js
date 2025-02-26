const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', 
  {
    // File operations
    openFile: async () => {
      return await ipcRenderer.invoke('open-file-dialog');
    },
    
    parseMsgFile: async (filePath) => {
      // Validate input
      if (typeof filePath !== 'string' || !filePath.trim()) {
        throw new Error('Invalid file path');
      }
      
      return await ipcRenderer.invoke('parse-msg-file', filePath);
    },
    
    saveAttachment: async (attachmentData) => {
      // Validate input
      if (!attachmentData || typeof attachmentData !== 'object') {
        throw new Error('Invalid attachment data');
      }
      
      if (!attachmentData.fileName || typeof attachmentData.fileName !== 'string') {
        throw new Error('Invalid attachment filename');
      }
      
      if (!attachmentData.content || typeof attachmentData.content !== 'string') {
        throw new Error('Invalid attachment content');
      }
      
      return await ipcRenderer.invoke('save-attachment', attachmentData);
    },
    
    // App info
    getAppVersion: () => process.env.npm_package_version,
    
    // System info
    getPlatform: () => process.platform
  }
);

// Log any uncaught exceptions for debugging
window.addEventListener('error', (event) => {
  console.error('Uncaught exception:', event.error);
});
