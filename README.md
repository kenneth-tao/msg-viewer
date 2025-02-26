# MSG Viewer

A lightweight, standalone application for macOS that allows you to open and view Microsoft Outlook .msg files. This application helps macOS users view .msg files that are commonly shared by Windows Outlook users.

## Features

- Open and view .msg files on macOS
- Display email headers, body content, and attachments
- Save attachments to your local filesystem
- Dark mode support
- Accessibility features
- Security-focused design

## Installation

### Download the Pre-built Application

1. Download the latest release from the Releases page
2. Mount the DMG file
3. Drag the MSG Viewer app to your Applications folder
4. Open the app from your Applications folder

### Build from Source

If you prefer to build the application from source:

1. Clone this repository
   ```
   git clone https://github.com/kenneth-tao/msg-viewer.git
   cd msg-viewer
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Build the application
   ```
   npm run build
   ```

4. Start the application
   ```
   npm start
   ```

5. Package the application for distribution
   ```
   npm run package
   ```
   
   This will create a distributable application in the `dist` folder.

## Development

### Available Scripts

- `npm start` - Start the Electron application
- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the React application
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run package` - Package the application for macOS
- `npm run package-dmg` - Package the application as a universal DMG for macOS (x64 and arm64)

### Project Structure

- `main.js` - Electron main process
- `preload.js` - Preload script for secure IPC communication
- `src/` - React application source code
  - `components/` - React components
  - `styles/` - CSS styles
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions

## Security Considerations

This application was built with security in mind:

- Content Security Policy (CSP) to prevent XSS attacks
- Context isolation to protect against prototype pollution
- Proper input validation and sanitization
- Secure IPC communication between renderer and main processes
- File path validation to prevent path traversal attacks
- HTML content sanitization to prevent XSS in email content

## Accessibility

The application includes several accessibility features:

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management
- Semantic HTML structure
- ARIA attributes where appropriate

## Recent Updates

- Fixed test suite issues to ensure 100% test coverage for components
- Improved error handling in email parsing and rendering
- Enhanced accessibility features for screen readers
- Fixed syntax errors in console output

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
