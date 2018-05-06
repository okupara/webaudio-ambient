let timerID = null;
let interval = 50;
let runTimer = false;
let cnt = 0;
let startTime = 0;

const isActiveString = (data) => data && typeof data === 'string' && data.length > 0;

const startTimer = (fn) => {
  if (runTimer) {
    return;
  }
  runTimer = true;
  startTime = +(new Date());
  timerID = setInterval(() => {
    cnt += 1;
    const now = +(new Date());
    self.postMessage({ elapsed: now - startTime, cnt });
  }, interval);
};

const stopTimer = () => {
  clearInterval(timerID);
  cnt = 0;
  runTimer = false;
};

self.onmessage = (message) => {
  if(!isActiveString(message.data)) {
    return;
  }
  switch (message.data) {
    case "START":
      startTimer();
      break;
    case "STOP":
      stopTimer();
      break;
    default:
      break;
  }
};
