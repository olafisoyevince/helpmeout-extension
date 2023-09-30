// content.js

var recorder = null;

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (event) {
    let recorderBlob = event.data;
    let url = URL.createObjectURL(recorderBlob);

    let a = document.createElement("a");

    a.style.display = "none";
    a.href = url;
    a.download = "screen-recording.webm";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse("seen");

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        // video: {
        //   width: 9999999999,
        //   height: 9999999999,
        // },
        video: true,
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }
});
