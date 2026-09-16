const CACHE_NAME = 'ble-app-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Установка: кешируем файлы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Принудительно активируем новый SW
  );
});

// 2. АКТИВАЦИЯ: Удаляем старый кэш предыдущих версий сайта автоматически!
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Удаляем старый кэш:', key);
            return caches.delete(key); // Стираем старый удаленный файл из памяти
          }
        })
      );
    }).then(() => self.clients.claim()) // Мгновенно берем управление над страницей
  );
});

// 3. Запрос файлов: сначала берем из кэша, если нет — качаем из сети
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
