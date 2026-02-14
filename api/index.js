import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.NODE_ENV,
    piConfigured: !!config.PI_API_KEY,
  });
});

// Serve static files from React build (production only)
if (config.isProduction) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  // Serve index.html for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Development and Local-Only Logic
// We wrap the listener and dev-messages in one block so they NEVER run on Vercel
if (config.isDevelopment) {
  const PORT = config.PORT || 3000;

  // Development welcome message API
  app.get('/', (req, res) => {
    res.json({
      message: 'Checkers4Pi API Server (Development Mode)',
      mode: 'development',
      note: 'Run "npm run dev" to start the Vite dev server for the frontend',
      apiEndpoints: {
        health: '/api/health',
        approvePayment: 'POST /api/payments/approve',
        completePayment: 'POST /api/payments/complete',
        getPayment: 'GET /api/payments/:paymentId',
      },
    });
  });

  // Start server ONLY in development
  app.listen(PORT, () => {
    console.log(`\n🚀 Checkers4Pi Server running on port ${PORT}`);
    console.log(`   Environment: ${config.NODE_ENV}`);
    console.log(`   Pi API configured: ${!!config.PI_API_KEY ? '✅' : '❌'}`);
    console.log(`\n   API: http://localhost:${PORT}/api`);
    console.log(`   Frontend (Vite): Run "npm run dev" in another terminal\n`);
  });
}

// Export the app (Necessary for Vercel to turn this into a Serverless Function)
export default app;