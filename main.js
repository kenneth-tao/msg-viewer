const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const msgParser = require('msg-parser');
const { initialize, enable } = require('@electron/remote/main');

// Initialize remote module
initialize();

// Security best practices
const createSecureWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Protect against prototype pollution
      nodeIntegration: false, // Prevent direct access to Node.js APIs
      enableRemoteModule: false, // Disable remote module for security
      sandbox: true, // Enable Chromium sandbox for renderer
      webSecurity: true, // Enable web security features
      allowRunningInsecureContent: false, // Prevent loading of insecure content
    },
    // Enable accessibility features
    accessibleTitle: 'MSG Viewer - View Outlook .msg files on macOS',
  });

  // Enable remote module for this window
  enable(mainWindow.webContents);

  // Load the index.html of the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  return mainWindow;
};

// Create window when app is ready
app.whenReady().then(() => {
  const mainWindow = createSecureWindow();

  // Set up security headers
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline';"
        ],
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['SAMEORIGIN'],
        'X-XSS-Protection': ['1; mode=block']
      }
    });
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createSecureWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle file open dialog
ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Outlook MSG Files', extensions: ['msg'] }]
  });
  
  if (canceled || filePaths.length === 0) {
    return null;
  }
  
  return filePaths[0];
});

// Handle MSG file parsing
ipcMain.handle('parse-msg-file', async (event, filePath) => {
  try {
    // Validate file path to prevent path traversal attacks
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.endsWith('.msg')) {
      throw new Error('Invalid file type. Only .msg files are supported.');
    }
    
    // Check if file exists and is accessible
    await fs.promises.access(normalizedPath, fs.constants.R_OK);
    
    // Parse the MSG file
    return new Promise((resolve, reject) => {
      msgParser.parseFile(normalizedPath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          // Sanitize the data before sending to renderer
          const sanitizedData = sanitizeMsgData(data);
          resolve(sanitizedData);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing MSG file:', error);
    throw error;
  }
});

// Sanitize MSG data to prevent XSS and other injection attacks
function sanitizeMsgData(data) {
  // Create a deep copy to avoid modifying the original data
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // Helper function to sanitize text fields
  const sanitizeText = (text) => {
    if (typeof text !== 'string') return text;
    
    // Basic HTML sanitization - convert special characters to entities
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  // Sanitize common email fields
  if (sanitized.subject) sanitized.subject = sanitizeText(sanitized.subject);
  if (sanitized.from) sanitized.from = sanitizeText(sanitized.from);
  if (sanitized.displayTo) sanitized.displayTo = sanitizeText(sanitized.displayTo);
  if (sanitized.displayCc) sanitized.displayCc = sanitizeText(sanitized.displayCc);
  if (sanitized.body) sanitized.body = sanitizeText(sanitized.body);
  
  // Sanitize attachments
  if (sanitized.attachments && Array.isArray(sanitized.attachments)) {
    sanitized.attachments = sanitized.attachments.map(attachment => {
      if (attachment.fileName) attachment.fileName = sanitizeText(attachment.fileName);
      if (attachment.contentId) attachment.contentId = sanitizeText(attachment.contentId);
      return attachment;
    });
  }
  
  return sanitized;
}

// Handle attachment saving
ipcMain.handle('save-attachment', async (event, attachmentData) => {
  try {
    const { fileName, content } = attachmentData;
    
    // Show save dialog
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Attachment',
      defaultPath: fileName,
      buttonLabel: 'Save',
      properties: ['createDirectory', 'showOverwriteConfirmation']
    });
    
    if (canceled || !filePath) {
      return { success: false, message: 'Save operation canceled' };
    }
    
    // Convert base64 to buffer and save
    const buffer = Buffer.from(content, 'base64');
    await fs.promises.writeFile(filePath, buffer);
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Error saving attachment:', error);
    return { success: false, message: error.message };
  }
});
