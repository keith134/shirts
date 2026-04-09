# 🎉 DANDAN FAMILY REUNION 2026 - Full Stack Application

## 📋 Project Overview

This is a professional full-stack web application built for the Dandan Family Reunion 2026. It features a beautiful photo gallery with a Node.js/Express backend and SQLite database.

### ✨ Features

- **Professional Welcome Landing Page** with 3D animated logo
- **Dynamic Photo Gallery** with 7 stunning T-shirt designs
- **Real-time Visitor Tracking** - See who's viewing the website
- **Fullscreen Lightbox** for photo viewing
- **Responsive Design** - Works on all devices
- **RESTful API** for gallery management
- **SQLite Database** for persistent data storage
- **Creator Credit** - Keith Charles Dandan
- **Download Functionality** for design pack

## 🛠️ Technology Stack

**Frontend:**
- HTML5
- CSS3 (with advanced animations and effects)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- SQLite3
- CORS support
- Compression & Security (Helmet)

**Database:**
- SQLite (lightweight, file-based)
- Pre-populated with 7 gallery items

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
cd c:\Users\63936\Desktop\dandanfam
npm install
```

This will install:
- express (web framework)
- sqlite3 (database)
- cors (cross-origin handling)
- body-parser (request parsing)
- compression (response compression)
- helmet (security headers)

### Step 2: Start the Server

```bash
npm start
```

You should see:
```
✅ Connected to SQLite database
✨ Dandan Family Reunion 2026 - Full Stack Application Ready!

🚀 Server running on http://localhost:3000
📸 Gallery API: http://localhost:3000/api/gallery
👥 Visitors API: http://localhost:3000/api/visitors/active
📊 Statistics: http://localhost:3000/api/statistics
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## 📁 Project Structure

```
dandanfam/
├── server.js              # Express server & API
├── package.json           # Dependencies
├── README.md              # This file
├── data/
│   └── reunion.db        # SQLite database (auto-created)
└── public/
    ├── index.html        # Main application
    ├── Picsart_26-04-09_17-38-30-034.png
    ├── Picsart_26-04-09_17-39-11-329.png
    ...                   # Image files
```

## 🔌 API Endpoints

### Gallery Management
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get single item
- `POST /api/gallery/:id/view` - Record a view

### Visitor Tracking  
- `POST /api/visitor/check-in` - Register visitor
- `GET /api/visitors/active` - Get active visitors (last 5 min)
- `GET /api/visitors/all` - Get all visitors

### Statistics
- `GET /api/statistics` - Get site statistics
- `GET /api/health` - Server health check

## 🚀 Features Detail

### 1. Welcome Landing Page
- Beautiful gradient background
- 3D animated logo
- Smooth entrance animations
- Quick access buttons: "Enter Gallery" & "Download Designs"
- Live viewer counter

### 2. Main Gallery
- 7 design cards with hover effects
- Fullscreen lightbox modal for images
- Professional typography
- Responsive grid layout
- Smooth animations

### 3. Database
Pre-populated with:
```
- Design #01: Classic Heritage Edition
- Design #02: Family Like Branches
- Design #03: Elegant Premium
- Design #04: Roots Deep
- Design #05: Unity
- Design #06: Legacy (Our Roots Run Deep)
- Design #07: Dandan Family Collection
```

### 4. Real-time Tracking
- Track active visitors
- Display live viewer count
- Session management
- Visitor statistics

## 🎨 Customization

### Change Creator Name
Edit in `server.js` and `public/index.html`:
```javascript
// server.js - comment or modify the author field
"author": "Keith Charles Dandan"

// public/index.html - update creator credit
💎 Created by <span class="creator-name">Your Name Here</span>
```

### Add More Designs
Edit `server.js` in the `loadInitialData()` function:
```javascript
{
    design_number: 8,
    title: 'YOUR DESIGN',
    description: '#08 · YOUR BADGE',
    image_url: 'your-image.png',
    poem: 'Your design text here'
}
```

### Modify Colors
Edit the CSS variables in `public/index.html`:
- Primary: `#f4a261` (orange/gold)
- Secondary: `#e9c46a` (yellow)
- Accent: `#a8dadc` (teal)
- Dark: `#0f0f1e` (dark blue)

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify `server.js`:
```javascript
const PORT = 3000; // Change to 3001, 3002, etc.
```

### Images Not Loading
- Ensure image files are in the `dandanfam/` directory
- Check file names match exactly in the database
- Use the same directory for the server

### First Run Issues
- Delete `data/reunion.db` to reset
- Run `npm install` again
- Check Node.js version: `node --version`

### API Not Responding
- Check if server is running (port 3000)
- Look at console for error messages
- Ensure all dependencies installed: `npm install`

## 📊 Database Schema

### gallery_items
```sql
CREATE TABLE gallery_items (
    id INTEGER PRIMARY KEY,
    design_number INTEGER,
    title TEXT,
    description TEXT,
    image_url TEXT,
    poem TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### visitor_sessions
```sql
CREATE TABLE visitor_sessions (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE,
    name TEXT,
    created_at TIMESTAMP,
    last_seen TIMESTAMP
)
```

### statistics
```sql
CREATE TABLE statistics (
    id INTEGER PRIMARY KEY,
    total_views INTEGER,
    total_visitors INTEGER,
    design_id INTEGER,
    view_count INTEGER,
    last_updated TIMESTAMP
)
```

## 📱 Responsive Breakpoints

- **Desktop**: 1400px (optimal viewing)
- **Tablet**: 768px columns adjust
- **Mobile**: Full-width single column

## 🔒 Security Features

- Helmet.js for security headers
- CORS enabled for API calls
- Input validation ready
- SQL injection protection (prepared statements)
- Safe session management

## 📈 Performance

- CSS compression enabled
- Response compression (gzip)
- Optimized animations (GPU acceleration)
- Lazy loading ready
- Efficient database queries

## 🎯 Future Enhancements

- User authentication
- Admin panel for content management
- Image upload functionality
- Comment/reaction system
- Email notifications
- Advanced analytics
- Social media integration
- Mobile app version

## 📞 Support

For issues or questions about the application, refer to this README or check the console for error messages.

## 👨‍💻 Creator

**Keith Charles Dandan**
- Professional Web Developer
- Full-Stack Applications
- Reunion Website Specialist

## 📄 License

MIT License - Feel free to modify and use

---

**Last Updated**: April 9, 2026
**Version**: 1.0.0
**Status**: ✅ Fully Operational
