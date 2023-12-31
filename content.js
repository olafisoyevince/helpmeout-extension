var recorder = null;

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onStop = () => {
    stream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  };

  let isPaused = false;
  let pauseBtn = document.querySelector(".myPause");
  pauseBtn.addEventListener("click", () => {
    if (!recorder) return console.log("no recorder");

    console.log(recorder);
    if (!isPaused) {
      recorder.pause();
      pauseBtn.innerHTML = "play";
      isPaused = true;
    } else {
      recorder.resume();
      pauseBtn.innerHTML = "pause";
      isPaused = false;
    }
  });

  recorder.onStop = () => {
    stream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });

    console.log("i have stopped");

    document.body.removeChild(controlPanel);
  };

  recorder.ondataavailable = (event) => {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

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
  if (message.action == "request_recording") {
    // console.log("request_recording");
    sendResponse(`processed: ${message.action}`);

    let controlPanel = document.createElement("div");
    controlPanel.classList.add(".control-panel");
    controlPanel.insertAdjacentHTML(
      "afterbegin",
      `<div style="display: flex;
        gap: 20px;
        justify-items: center;
        align-items: center;
      ">

      <p class="myPause">Pause</p>
      <p style = "cursor: pointer" class="myStop">Stop</p>
     <p>Mute</p>
</div>`
    );

    let styles = {
      backgroundColor: "black",
      borderRadius: "30px",
      padding: "10px",
      position: "fixed",
      left: "40px",
      bottom: "20px",
      width: "200px",
      color: "white",
    };

    Object.assign(controlPanel.style, styles);

    document.body.appendChild(controlPanel);

    document.querySelector(".myStop").addEventListener("click", () => {
      console.log("e don lock");
    });
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 99999999999,
          height: 99999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }
});
