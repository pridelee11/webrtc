//Push Message 수신 이벤트
self.addEventListener('push', function (event)
{
    console.log('[ServiceWorker] 푸시알림 수신: ', event);
 
    //Push 정보 조회
    var title = event.data.title || '알림';
    var body = event.data.body;
    var icon = event.data.icon || '/Images/icon.png'; //512x512
    var badge = event.data.badge || '/Images/badge.png'; //128x128
    var options = {
        body: body
    };
     console.log('[ServiceWorker] 푸시알림 수신 title: ', title);
     console.log('[ServiceWorker] 푸시알림 수신 body: ', body);
     console.log('[ServiceWorker] 푸시알림 수신 options: ', options);
    //Notification 출력
    event.waitUntil(self.registration.showNotification(title, options));
});
 
//사용자가 Notification을 클릭했을 때
self.addEventListener('notificationclick', function (event)
{
    console.log('[ServiceWorker] 푸시알림 클릭: ', event);
 
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" })
            .then(function (clientList)
            {
                //실행된 브라우저가 있으면 Focus
                for (var i = 0; i < clientList.length; i++)
                {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                //실행된 브라우저가 없으면 Open
                if (clients.openWindow)
                    return clients.openWindow('https://festive-brahmagupta-b1dc4b.netlify.app/');
            })
    );
});
 
console.log('[ServiceWorker] 시작');
