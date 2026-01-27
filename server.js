const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Get the branch name from environment variable
const BRANCH_NAME = process.env.BRANCH_NAME || 'unknown';
const APP_VERSION = '1.0.0';

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Version endpoint showing branch name
app.get('/version', (req, res) => {
  res.status(200).json({
    version: APP_VERSION,
    branch: BRANCH_NAME,
    environment: BRANCH_NAME === 'main' ? 'production' : 'staging',
    timestamp: new Date().toISOString()
  });
});

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Branch-Based Deployment</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          background-color: ${BRANCH_NAME === 'main' ? '#e8f5e9' : '#fff3e0'};
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 10px;
          ${BRANCH_NAME === 'main' 
            ? 'background-color: #4caf50; color: white;' 
            : 'background-color: #ff9800; color: white;'}
        }
        h1 { color: #333; }
        .info { margin-top: 20px; font-size: 16px; }
        a { color: #2196F3; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Branch-Based Deployment System</h1>
        <p>Welcome to the deployment verification page!</p>
        
        <div class="info">
          <strong>Current Branch:</strong> ${BRANCH_NAME}
          <div class="badge">${BRANCH_NAME === 'main' ? '📦 PRODUCTION' : '🔨 STAGING'}</div>
        </div>
        
        <div class="info">
          <strong>Application Version:</strong> ${APP_VERSION}
        </div>
        
        <div class="info">
          <strong>Environment:</strong> ${BRANCH_NAME === 'main' ? 'Production' : 'Staging'}
        </div>
        
        <hr style="margin: 30px 0;">
        
        <h3>Available Endpoints:</h3>
        <ul>
          <li><a href="/health">/health</a> - Health check status</li>
          <li><a href="/version">/version</a> - Version and branch information (JSON)</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`📦 Branch: ${BRANCH_NAME}`);
  console.log(`🌍 Environment: ${BRANCH_NAME === 'main' ? 'Production' : 'Staging'}`);
});
