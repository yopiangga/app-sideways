const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const feedid = require('./modules/feedid/src');
const AISService = require('./aisService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-123';

// Initialize AIS Service
const aisService = new AISService(process.env.AIS_APIKEY);
aisService.start();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Static Auth Credentials
const USERS = [
    { username: 'admin', password: '123456' }
];

// Auth Middleware
const authenticateToken = (req, res, next) => {
    // Auth bypassed for development
    next();
};

app.get('/api/', (req, res) => {
    res.json({ message: 'Hello World!' });
})

// Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false }); // secure: true in production
        return res.json({ message: 'Login successful', token, username: user.username });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

app.get('/api/cctv', authenticateToken, (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'cctv.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading CCTV data' });
        res.json(JSON.parse(data));
    });
});

app.get('/api/news', authenticateToken, async (req, res) => {
    const { category = 'top' } = req.query;
    
    let newsItems = [];
    try {
        if (category === 'top') {
            const [antara, cnn, tempo] = await Promise.all([
                feedid.antara.terbaru(),
                feedid.cnn.terbaru(),
                feedid.tempo.nasional()
            ]);
            
            newsItems = [
                ...(antara.data?.posts || []).map(p => ({ ...p, source: { name: 'Antara' } })),
                ...(cnn.data?.posts || []).map(p => ({ ...p, source: { name: 'CNN Indonesia' } })),
                ...(tempo.data?.posts || []).map(p => ({ ...p, source: { name: 'Tempo' } }))
            ];
        } else if (category === 'politik') {
            const response = await feedid.antara.politik();
            newsItems = (response.data?.posts || []).map(p => ({ ...p, source: { name: 'Antara' } }));
        } else if (category === 'ekonomi') {
            const response = await feedid.antara.ekonomi();
            newsItems = (response.data?.posts || []).map(p => ({ ...p, source: { name: 'Antara' } }));
        } else if (category === 'militer') {
            // Militer often under Nasional/Politik in these feeds
            const response = await feedid.antara.politik();
            newsItems = (response.data?.posts || [])
                .filter(p => p.title.toLowerCase().includes('militer') || p.title.toLowerCase().includes('tni') || p.title.toLowerCase().includes('pertahanan'))
                .map(p => ({ ...p, source: { name: 'Antara' } }));
            
            // If empty, just show political news as fallback or broader national news
            if (newsItems.length === 0) {
                newsItems = (response.data?.posts || []).slice(0, 10).map(p => ({ ...p, source: { name: 'Antara' } }));
            }
        } else if (category === 'keamanan') {
            const response = await feedid.antara.hukum();
            newsItems = (response.data?.posts || []).map(p => ({ ...p, source: { name: 'Antara' } }));
        }

        // Normalize field names for frontend (publishedAt)
        const normalizedNews = newsItems.map(item => ({
            title: item.title,
            link: item.link,
            publishedAt: item.pubDate || new Date().toISOString(),
            source: item.source,
            thumbnail: item.thumbnail
        }));

        // Sort by date and limit
        normalizedNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        res.json(normalizedNews.slice(0, 20));
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

app.get('/api/ais', authenticateToken, (req, res) => {
    res.json(aisService.getShips());
});

// Removed /api/flights route as data is not available yet

app.get('/api/me', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
