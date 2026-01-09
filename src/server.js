require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log('\n' + '='.repeat(60));
    console.log(`📡 [${timestamp}] ${req.method} ${req.url}`);
    if (Object.keys(req.query).length > 0) {
        console.log('📋 Query params:', JSON.stringify(req.query, null, 2));
    }
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    }
    
    const oldSend = res.send;
    res.send = function(data) {
        console.log('✅ Response status:', res.statusCode);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                console.log('📤 Response data:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('📤 Response:', data.substring(0, 200));
            }
        }
        console.log('='.repeat(60) + '\n');
        oldSend.apply(res, arguments);
    };
    
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

const championRoutes = require('./routes/champions');
const itemRoutes = require('./routes/items');

app.use('/api/champions', championRoutes);
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/overview.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
