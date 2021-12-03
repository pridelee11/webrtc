  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-analytics.js";
 <script src="https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js"></script>

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  function initFireBase(serviceWorkRegistration) {
  const firebaseConfig = {
    apiKey: "AIzaSyBcYJO-phtTP7BZ6ZBfxW5_q5RMR_Vkk9w",
    authDomain: "webrtcdemo-d6f83.firebaseapp.com",
    projectId: "webrtcdemo-d6f83",
    storageBucket: "webrtcdemo-d6f83.appspot.com",
    messagingSenderId: "593671773598",
    appId: "1:593671773598:web:5411b7727d61336f0f4a8f",
    measurementId: "G-DD0Q0THB16"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
      // var messaging = firebase.messaging();
      messaging.useServiceWorker(serviceWorkRegistration);
      messaging.usePublicVapidKey("BH2XwnpA1W7wNx4Pfm0WrJ403-_idcRJkdhLbK4wnMky7VZG_9qpesPt_bpo5cUd6ncTfiK6MyoXF3_Kza_2l4w");

      //Instance ID Token 발급 요청
    messaging.getToken()
        .then((currentToken) =>
        {
            if (currentToken)
            {
                console.log('[InstanceID Token] 발행완료: ', currentToken);
                sendTokenToServer(currentToken); //Token을 서버로 전송
            }
            else
            {
                console.log('[InstanceID Token] 발행실패');
                sendTokenToServer(null);
            }
        })
        .catch((err) =>
        {
            console.log('[InstanceID Token] 발행오류: ', err);
            sendTokenToServer(null);
        });
 
    //Instance ID Token 변경 시 호출되는 이벤트
    messaging.onTokenRefresh(() =>
    {
        messaging.getToken().then((refreshedToken) =>
        {
            console.log('[InstanceID Token] 갱신완료', refreshedToken);
            // sendTokenToServer(refreshedToken); //Token을 서버로 전송
        })
        .catch((err) =>
        {
            console.log('[InstanceID Token] 갱신실패', err);
            sendTokenToServer(null);
        });
    });
 
    messaging.onMessage((payload) =>
    {
        //Push Message 수신 시 호출되는 이벤트
        console.log('[PushMessage] 수신: ', payload);
    });

  }


 
  function sendTokenToServer(token) {

  console.log('sendTokenToServer', token);
  }

export {initFireBase};