import Div from "../Div.js";
import Button from "../buttons/Button.js";
import Icon from "../icons/Icon.js";

export default function AudioRecorder({
  onSave = () => {}
} = {}) {
  let stream = null;
  let recorder = null;
  let chunks = [];
  let recording = false;

  async function start() {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    recorder = new MediaRecorder(stream);
    chunks = [];

    recorder.ondataavailable = e => {
      chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, {
        type: "audio/webm"
      });

      onSave(blob);

      stream.getTracks().forEach(t => t.stop());
    };

    recorder.start();
    recording = true;
  }

  function stop() {
    if (!recorder) return;
    recorder.stop();
    recording = false;
  }

  return Div(
    { className: "audio-recorder" },

    Button(
      {
        className: recording
          ? "btn-danger"
          : "btn-primary",
        onClick: () =>
          recording ? stop() : start()
      },
      Icon({ name: "mic" }),
      recording ? "Stop" : "Record"
    )
  );
}