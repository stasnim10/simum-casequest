// CaseQuest Service Worker - Offline Support
const CACHE_NAME = 'casequest-v1';
const OFFLINE_URL = '/offline.html';

// Core files to cache for offline functionality
const CORE_CACHE_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  OFFLINE_URL
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core files');
        return cache.addAll(CORE_CACHE_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Firebase/external API calls
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebase.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Try network request
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync pending user progress when online
      syncPendingData()
    );
  }
});

async function syncPendingData() {
  // Get pending data from IndexedDB
  const pendingData = await getPendingData();
  
  for (const data of pendingData) {
    try {
      // Attempt to sync with Firebase
      await syncToFirebase(data);
      // Remove from pending queue on success
      await removePendingData(data.id);
    } catch (error) {
      console.log('Sync failed, will retry later:', error);
    }
  }
}

// Placeholder functions - implement based on your data structure
async function getPendingData() {
  // Retrieve pending data from IndexedDB
  return [];
}

async function syncToFirebase(data) {
  // Sync data to Firebase when online
}

async function removePendingData(id) {
  // Remove synced data from IndexedDB
}
