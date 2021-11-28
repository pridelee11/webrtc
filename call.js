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

function toggleVideo(b) {
  if (b == "true") {
    localStream.getVideoTracks()[0].enabled = true;
  } else {
    localStream.getVideoTracks()[0].enabled = false;
  }
}

function toggleAudio(b) {
  if (b == "true") {
    localStream.getAudioTracks()[0].enabled = true;
  } else {
    localStream.getAudioTracks()[0].enabled = false;
  }
}

//// login
const HIDDEN_ID = "appservice1";
const container_input = document.querySelector(".container_input");
const mute_btn = document.querySelector("#btn-mute");
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const loginButton = document.querySelector("#login-btn");

let audioEnable = true;
function changeAudio() {
  audioEnable = !audioEnable;
  if (audioEnable) {
    mute_btn.innerText = "mute";
  } else {
    mute_btn.innerText = "unmute";
  }
  console.log("click audio ", audioEnable);
  toggleAudio(audioEnable);
}

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
  const toName = connectInput.value + HIDDEN_ID;
  console.log("connet to : ", toName);
  connectInput.disabled = true;
  connectButton.disabled = true;

  startCall(toName);
}

connectForm.addEventListener("submit", onConnect);

//after connected
function doAfterConnected() {
  console.log("doAfterConnected");
  connectInput.disabled = true;
  connectButton.disabled = true;
  // container_input.style.display = "none";
  container_input.style.opacity = 0;
  mute_btn.style.opacity = 1;
  if (audioEnable) {
    changeAudio();
  }
}
