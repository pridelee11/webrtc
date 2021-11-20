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
  peer = new Peer(userId, {
    config: {
      iceServers: [
        { url: "stun:stun.l.google.com:19302" },
        { url: "stun:stun1.l.google.com:19302" },
        { url: "stun:stun2.l.google.com:19302" },
        { url: "stun:stun3.l.google.com:19302" },
        { url: "stun:stun4.l.google.com:19302" },
        { url: "stun:global.stun.twilio.com:3478?transport=udp" },
        // { url: "stun:stun01.sipphone.com" },
        // { url: "stun:stun.ekiga.net" },
        // { url: "stun:stun.fwdnet.net" },
        // { url: "stun:stun.ideasip.com" },
        // { url: "stun:stun.iptel.org" },
        // { url: "stun:stun.rixtelecom.se" },
        // { url: "stun:stun.schlund.de" },
        // { url: "stun:stunserver.org" },
        // { url: "stun:stun.softjoys.com" },
        // { url: "stun:stun.voiparound.com" },
        // { url: "stun:stun.voipbuster.com" },
        // { url: "stun:stun.voipstunt.com" },
        // { url: "stun:stun.voxgratia.org" },
        // { url: "stun:stun.xten.com" },
      ],
    },
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

          remoteVideo.className = "primary-video";
          localVideo.className = "secondary-video";
        });
      }
    );
  });
}

function startCall(otherUserId) {
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

        remoteVideo.className = "primary-video";
        localVideo.className = "secondary-video";
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
