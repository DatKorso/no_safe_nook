const express = require('express');
const path = require('path');
const open = require('open');
const app = express();
const port = 3000;

// Set proper MIME types
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// Ensure all routes serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Add error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════╗
║           No Safe Nook is running          ║
║                                           ║
║   Open your browser to:                   ║
║   http://localhost:${port}                  ║
║                                           ║
║   The game will open automatically...     ║
║                                           ║
║   To quit: Close this window and the      ║
║           browser tab                     ║
╚════════════════════════════════════════════╝
    `);
    
    // Open the game in the default browser
    open(`http://localhost:${port}`).catch(() => {
        console.log('Could not open browser automatically.');
        console.log('Please open http://localhost:${port} manually.');
    });
}); 