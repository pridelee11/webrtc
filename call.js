let localVideo = document.getElementById("local-video");
let remoteVideo = document.getElementById("remote-video");

localVideo.style.opacity = 0;
remoteVideo.style.opacity = 0;

localVideo.onplaying = () => {
  localVideo.style.opacity = 1;
};
remoteVideo.onplaying = () => {
  remoteVideo.style.opacity = 1;
};

let peer;
function init(userId) {
  console.log("init userid : ", userId);

  peer = new Peer(userId, {
    config: {
      iceServers: [
        { url: "stun:stun.l.google.com:19302" },
        { url: "stun:stun1.l.google.com:19302" },
        { url: "stun:stun2.l.google.com:19302" },
        { url: "stun:stun3.l.google.com:19302" },
        { url: "stun:stun4.l.google.com:19302" },
        { url: "stun:global.stun.twilio.com:3478?transport=udp" },
        {
          url: "turn:numb.viagenie.ca",
          username: "pridelee@gmail.com",
          credential: "5150as",
        },
      ],
    },
  });

  peer.on("open", (id) => {
    console.log("open id ", id);
  });

  peer.on("close", () => {
    console.log("close");
  });

  peer.on("disconnected", () => {
    console.log("disconnected");
  });

  peer.on("error", (err) => {
    console.log(err);
  });

  listen();
}

let localStream;
function listen() {
  peer.on("call", (call) => {
    navigator.getUserMedia(
      {
        audio: true,
        video: true,
      },
      (stream) => {
        localVideo.srcObject = stream;
        localStream = stream;

        call.answer(stream);
        call.on("stream", (remoteStream) => {
          remoteVideo.srcObject = remoteStream;

          // remoteVideo.className = "primary-video";
          // localVideo.className = "secondary-video";

          doAfterConnected();
        });
      }
    );
  });
}

function startCall(otherUserId) {
  console.log("startCall otherUserId : ", otherUserId);

  navigator.getUserMedia(
    {
      audio: true,
      video: true,
    },
    (stream) => {
      localVideo.srcObject = stream;
      localStream = stream;

      const call = peer.call(otherUserId, stream);
      call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;

        // remoteVideo.className = "primary-video";
        // localVideo.className = "secondary-video";

        doAfterConnected();
      });
    }
  );
}

function toggleVideo(enable) {
  if (enable) {
    localStream.getVideoTracks()[0].enabled = true;
  } else {
    localStream.getVideoTracks()[0].enabled = false;
  }
}

function toggleAudio(enable) {
  if (enable) {
    localStream.getAudioTracks()[0].enabled = true;
  } else {
    localStream.getAudioTracks()[0].enabled = false;
  }
  console.log("localstream ", localStream.getAudioTracks()[0].enabled);
}

//// login
const HIDDEN_ID = "appservice1";
const container_input = document.querySelector(".container_input");
const video_btn = document.querySelector("#btn-video");
const mute_btn = document.querySelector("#btn-mute");

const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const loginButton = document.querySelector("#login-btn");
// const sendButton = document.querySelector("#send-btn");
// const subscribeButton = document.getElementById("sub-button");

// subscribeButton.addEventListener("click", function() {
//   Notification.requestPermission().then(function (result)
//     {
//         if (result === 'granted')
//         {
//             console.log('[Notification] permit: ', result);
//         }
//         else
//         {
//             console.log('[Notification] disagree: ', result);
//         }
//     });
// });

// sendButton.addEventListener("click", sendFcmMessage);

let videoEnable = true;
function changeVideo() {
  videoEnable = !videoEnable;
  if (videoEnable) {
    video_btn.innerText = "Video On";
  } else {
    video_btn.innerText = "Video Off";
  }
  console.log("click video ", videoEnable);
  toggleVideo(videoEnable);
}

let audioEnable = true;
function changeAudio() {
  audioEnable = !audioEnable;
  if (audioEnable) {
    mute_btn.innerText = "Audio On";
  } else {
    mute_btn.innerText = "Audio Off";
  }
  console.log("click audio ", audioEnable);
  toggleAudio(audioEnable);
}

video_btn.addEventListener("click", changeVideo);
mute_btn.addEventListener("click", changeAudio);

function onLoginSubmit(event) {
  event.preventDefault();
  const username = loginInput.value + HIDDEN_ID;
  console.log("subimit user id : ", username);
  loginInput.disabled = true;
  loginButton.disabled = true;

  init(username);
}

loginForm.addEventListener("submit", onLoginSubmit);

//// connect to
const connectForm = document.querySelector("#connect-form");
const connectInput = document.querySelector("#connect-form input");
const connectButton = document.querySelector("#connect-btn");

function onConnect(event) {
  event.preventDefault();
  if (connectInput.value == "wing") {
    sendFcmMessage();
  } else {
    const toName = connectInput.value + HIDDEN_ID;
    console.log("connet to : ", toName);
    startCall(toName);
  }
  connectInput.disabled = true;
  connectButton.disabled = true;
}

connectForm.addEventListener("submit", onConnect);

//after connected
function doAfterConnected() {
  console.log("doAfterConnected");
  connectInput.disabled = true;
  connectButton.disabled = true;
  // container_input.style.display = "none";
  container_input.style.opacity = 0;
  video_btn.style.opacity = 1;
  mute_btn.style.opacity = 1;
  // if (audioEnable) {
  //   changeAudio();
  // }
}

function sendFcmMessage() {
  const connectInputMessage = loginInput.value;
  console.log(connectInputMessage);

  var xhr = new XMLHttpRequest();
  var url = "https://fcm.googleapis.com/fcm/send";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhr.setRequestHeader("Authorization", "key=AAAAijmYXZ4:APA91bH_oG8nwEgPZlrSNyL2HCHnjBB5StFAJ3I9dm1C30H7xAbW10m_QWaceIsJVlmif6nUmIMxDe0u1ViCqT4hKhumzAXAFf1Ypeqe3zugkYy38vZjaUFiJYQ0XkOWbiwuS8iHGISh");
  xhr.onreadystatechange = function () {
     console.log("xhr.status : " + xhr.status);
     console.log("xhr.readyState : " + xhr.readyState);
  if (xhr.readyState === 4 && xhr.status === 200) {

              console.log("xhr.responseText : " + xhr.responseText);
  var json = JSON.parse(xhr.responseText);
  console.log(json);
  }
};
  var data = JSON.stringify(  {
         'to': 'eFv1JA5uQ6u-wMqRSqsDNi:APA91bEwVrFr8bN_9wq1z2xc_prS09nAe7q7hWS9QpAtKZsiD5vcJTx8UiBvIt_xQpa6bF837akF8XHsayy2bKe7f8-bKa3oCf4CcppCAKyLeVdbotKA6i2gjTh9uy_oa39kfkMUyawz',
                         "data" : { "title" : "webrtc", "body" :"Please Click" , "friendname" :  connectInputMessage }}
  
);
  console.log(data);
  xhr.send(data);
}



