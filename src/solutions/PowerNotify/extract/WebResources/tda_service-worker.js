self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.text());
  let entityName, entityId, icon;

  if(data.record.type && data.record.id) {
    entityName = data.record.type.substring(0, data.record.type.length - 1);
    entityId = data.record.id;
    icon = new URL(`/Image/download.aspx?Entity=${entityName}&Attribute=entityimage&Id=${entityId}`, self.location.origin).href;
  }

  event.waitUntil(
    registration.showNotification(data.title, {
      body: data.message || '',
      icon,
      data,
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  notification.close()
  event.waitUntil(clients.openWindow(notification.data.url));
});
