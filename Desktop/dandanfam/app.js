// ==================== CONFIG ====================
const API_BASE = 'http://localhost:3000/api';
let currentSessionId = null;
let galleryItems = [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    initializeSession();
    await loadGalleryItems();
    startViewerTracking();
    loadUserPreferences();
});

// Initialize user session
function initializeSession() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
    }
    currentSessionId = sessionId;

    // Check in visitor
    fetch(`${API_BASE}/visitor/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId, name: 'Guest' })
    }).catch(err => console.log('Check-in failed (server may not be running)'));
}

// Load gallery items from API
async function loadGalleryItems() {
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        if (response.ok) {
            galleryItems = await response.json();
            renderGallery();
        } else {
            console.warn('Could not load gallery from API, using default data');
            loadDefaultGallery();
        }
    } catch (err) {
        console.log('API server not running, using local data');
        loadDefaultGallery();
    }
}

// Default gallery data (fallback)
function loadDefaultGallery() {
    galleryItems = [
        { id: 1, design_number: 1, title: 'CLASSIC HERITAGE', description: '#01 · EST. 2024', image_url: 'Picsart_26-04-09_17-38-30-034.png', poem: 'DANDAN FAMILY REUNION 2026' },
        { id: 2, design_number: 2, title: 'FAMILY BRANCHES', description: '#02 · BRANCHES', image_url: 'Picsart_26-04-09_17-39-11-329.png', poem: 'Different directions, one root' },
        { id: 3, design_number: 3, title: 'ELEGANT PREMIUM', description: '#03 · TOGETHER', image_url: 'Picsart_26-04-09_17-40-10-247.png', poem: 'United as one family' },
        { id: 4, design_number: 4, title: 'ROOTS DEEP', description: '#04 · ROOTS DEEP', image_url: 'Picsart_26-04-09_17-40-43-096.png', poem: 'Strong foundations' },
        { id: 5, design_number: 5, title: 'UNITY', description: '#05 · UNITY', image_url: 'Picsart_26-04-09_17-42-24-479.png', poem: 'Together we stand' },
        { id: 6, design_number: 6, title: 'LEGACY', description: '#06 · LEGACY', image_url: 'Picsart_26-04-09_17-50-16-182.png', poem: 'Our roots run deep' },
        { id: 7, design_number: 7, title: 'COLLECTION', description: '#07 · WHISKS', image_url: 'Whisk_33d3517339d371c8adc4ae3390e8de71dr (1).jpeg', poem: 'Family forever' }
    ];
    renderGallery();
}

// Render gallery
function renderGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    container.innerHTML = '';

    galleryItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="card-header">
                <span class="design-number">#${String(item.design_number).padStart(2, '0')} · ${item.description.split('·')[1] || 'SPECIAL'}</span>
                <span class="roots-badge">🌳 ROOTS&BONDS</span>
            </div>
            <img src="${item.image_url}" alt="${item.title}" class="shirt-image">
            <div class="design-content">
                <div class="poem">${item.poem || 'Beautiful Design'}</div>
                <div class="family-name">— DANDAN FAMILY —</div>
            </div>
        `;
        
        // Add click handler to image
        card.querySelector('.shirt-image').addEventListener('click', function() {
            openModal(this.src);
        });
        
        container.appendChild(card);
    });
}

// ==================== MODAL FUNCTIONS ====================
function openModal(src) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    if (modal && modalImage) {
        modalImage.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
});

// ==================== LANDING PAGE ====================
function enterGallery() {
    const landing = document.getElementById('landingPage');
    const mainContent = document.getElementById('mainContent');
    if (landing && mainContent) {
        landing.classList.add('hidden');
        mainContent.style.display = 'block';
        setTimeout(() => {
            landing.style.display = 'none';
        }, 800);
    }
}

function downloadDesigns() {
    const designsHTML = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Dandan Designs</title></head>
<body style="background:#0f0f1e;color:#f1f0e8;font-family:Segoe UI,sans-serif;padding:40px;text-align:center;">
<h1 style="color:#f4a261;">🎨 DANDAN FAMILY REUNION 2026</h1>
<p style="color:#a8dadc;">7 Stunning T-Shirt Designs</p>
<hr style="border-color:#f4a261;">
<p style="color:#e9c46a;">💎 Created by Keith Charles Dandan</p>
<p>Family like branches of a tree we all grow in different directions yet our roots remain as one</p>
</body>
</html>`;
    const blob = new Blob([designsHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Dandan_Family_Designs_2026.html';
    link.click();
    showNotification('✅ Design pack downloaded!');
}

// ==================== VIEWER TRACKING ====================
let viewerCheckInterval;

function startViewerTracking() {
    updateViewerCount();
    viewerCheckInterval = setInterval(updateViewerCount, 3000);
}

function updateViewerCount() {
    fetch(`${API_BASE}/visitors/active`)
        .then(r => r.json())
        .then(data => {
            const counter = document.getElementById('viewerCount');
            if (counter) {
                counter.textContent = data.active_visitors || '1';
            }
        })
        .catch(err => {
            const counter = document.getElementById('viewerCount');
            if (counter) counter.textContent = '1';
        });
}

// ==================== USER PREFERENCES ====================
function loadUserPreferences() {
    const savedName = localStorage.getItem('userName');
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay && savedName) {
        nameDisplay.textContent = savedName;
    }
}

// ==================== NOTIFICATIONS ====================
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOutNotif 0.4s ease-out forwards';
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(viewerCheckInterval);
});
