const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Disable CSP for development
app.use((req, res, next) => {
    res.removeHeader('Content-Security-Policy');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database
const dbPath = path.join(__dirname, 'data', 'reunion.db');
const dataDir = path.join(__dirname, 'data');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Schema
function initializeDatabase() {
    db.serialize(() => {
        // Gallery Items Table
        db.run(`
            CREATE TABLE IF NOT EXISTS gallery_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                design_number INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT NOT NULL,
                poem TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Visitor Sessions Table
        db.run(`
            CREATE TABLE IF NOT EXISTS visitor_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT UNIQUE NOT NULL,
                name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Gallery Statistics Table
        db.run(`
            CREATE TABLE IF NOT EXISTS statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_views INTEGER DEFAULT 0,
                total_visitors INTEGER DEFAULT 0,
                design_id INTEGER,
                view_count INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Load initial data
        loadInitialData();
    });
}

// Load Initial Gallery Data
function loadInitialData() {
    db.get('SELECT COUNT(*) as count FROM gallery_items', (err, row) => {
        if (err) {
            console.error('Error checking gallery items:', err);
            return;
        }

        if (row.count === 0) {
            const galleryData = [
                {
                    design_number: 1,
                    title: 'CLASSIC HERITAGE EDITION',
                    description: 'Design #01 · EST. 2024',
                    image_url: 'Picsart_26-04-09_17-38-30-034.png',
                    poem: 'DANDAN FAMILY REUNION 2026\n"Family like branches of a tree we\nall grow in different directions yet\nour roots remain as one"'
                },
                {
                    design_number: 2,
                    title: 'FAMILY LIKE BRANCHES',
                    description: 'Design #02 · BRANCHES',
                    image_url: 'Picsart_26-04-09_17-39-11-329.png',
                    poem: 'FAMILY LIKE BRANCHES\nof tree we all grow\nin different directions yet\nour roots remain as one'
                },
                {
                    design_number: 3,
                    title: 'ELEGANT PREMIUM',
                    description: 'Design #03 · TOGETHER',
                    image_url: 'Picsart_26-04-09_17-40-10-247.png',
                    poem: 'FAMILY LIKE BRANCHES\nof tree we all grow in\ndifferent directions\nyet our roots remain as one'
                },
                {
                    design_number: 4,
                    title: 'ROOTS DEEP',
                    description: 'Design #04 · ROOTS DEEP',
                    image_url: 'Picsart_26-04-09_17-40-43-096.png',
                    poem: 'DANDAN FAMILY · ROOTS AND BONDS\nFamily like branches of a tree we\nall grow in different directions yet\nour roots remain as one'
                },
                {
                    design_number: 5,
                    title: 'UNITY',
                    description: 'Design #05 · UNITY',
                    image_url: 'Picsart_26-04-09_17-42-24-479.png',
                    poem: '"ROOTS&BONDS:"\nFamily like branches of a tree\nwe all grow in different\ndirections yet our roots remain\nas one'
                },
                {
                    design_number: 6,
                    title: 'OUR ROOTS RUN DEEP',
                    description: 'Design #06 · LEGACY',
                    image_url: 'Picsart_26-04-09_17-50-16-182.png',
                    poem: 'OUR ROOTS RUN DEEP\nFamily like branches of tree we\nall grow in different directions yet\nour roots remain as one'
                },
                {
                    design_number: 7,
                    title: 'DANDAN FAMILY',
                    description: 'Design #07 · WHISKS',
                    image_url: 'Whisk_33d3517339d371c8adc4ae3390e8de71dr (1).jpeg',
                    poem: 'DANDAN FAMILY\nRoots & Bonds Collection\nFamily forever, roots together'
                }
            ];

            galleryData.forEach(item => {
                db.run(
                    `INSERT INTO gallery_items (design_number, title, description, image_url, poem) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [item.design_number, item.title, item.description, item.image_url, item.poem],
                    (err) => {
                        if (err) console.error('Error inserting gallery item:', err);
                    }
                );
            });

            console.log('✅ Gallery data loaded successfully');
        }
    });
}

// ==================== API ROUTES ====================

// Get all gallery items
app.get('/api/gallery', (req, res) => {
    db.all('SELECT * FROM gallery_items ORDER BY design_number ASC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get single gallery item
app.get('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM gallery_items WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }
        res.json(row);
    });
});

// Update view count
app.post('/api/gallery/:id/view', (req, res) => {
    const { id } = req.params;
    
    db.run(
        `UPDATE statistics SET view_count = view_count + 1 
         WHERE design_id = ? OR (design_id IS NULL AND id = ?)`,
        [id, 1],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'View recorded' });
        }
    );
});

// Visitor tracking
app.post('/api/visitor/check-in', (req, res) => {
    const { sessionId, name } = req.body;
    
    db.run(
        `INSERT OR REPLACE INTO visitor_sessions (session_id, name, last_seen)
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [sessionId, name || 'Anonymous'],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Check-in successful' });
        }
    );
});

// Get active visitors
app.get('/api/visitors/active', (req, res) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
    
    db.all(
        `SELECT COUNT(*) as active_count FROM visitor_sessions 
         WHERE last_seen > ?`,
        [fiveMinutesAgo],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ active_visitors: rows[0].active_count });
        }
    );
});

// Get all visitors
app.get('/api/visitors/all', (req, res) => {
    db.all(
        `SELECT session_id, name, created_at FROM visitor_sessions 
         ORDER BY created_at DESC LIMIT 100`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});

// Get statistics
app.get('/api/statistics', (req, res) => {
    db.get(
        `SELECT 
            COUNT(DISTINCT session_id) as total_visitors,
            (SELECT COUNT(*) FROM gallery_items) as total_designs,
            COALESCE(SUM(view_count), 0) as total_views
         FROM visitor_sessions`,
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(row);
        }
    );
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
    console.log(`👥 Visitors API: http://localhost:${PORT}/api/visitors/active`);
    console.log(`📊 Statistics: http://localhost:${PORT}/api/statistics`);
    console.log(`\n✨ Dandan Family Reunion 2026 - Full Stack Application Ready!\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error('Error closing database:', err);
        console.log('\n📴 Database connection closed');
        process.exit(0);
    });
});

module.exports = app;
