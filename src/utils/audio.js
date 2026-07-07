const audioInstances = {
  click: new Audio('/sounds/click.mp3'),
  glitch: new Audio('/sounds/glitch.mp3'),
  atmosphere: new Audio('/sounds/atmosphere.mp3'),
  glitch_1: new Audio('/sounds/glitch_1.mp3'),
  lock_beep: new Audio('/sounds/lock_beep.mp3'),
  door_slam: new Audio('/sounds/door_slam.mp3'),
  pulse: new Audio('/sounds/pulse.mp3'),
  scanner: new Audio('/sounds/scanner.mp3'),
  calculating: new Audio('/sounds/calculating.mp3'),
  bonus: new Audio('/sounds/bonus.mp3'),
  impact: new Audio('/sounds/impact.mp3'),
  clock: new Audio('/sounds/clock.mp3'),
  slam: new Audio('/sounds/slam.mp3'),
  slash: new Audio('/sounds/slash.mp3'),
  system_alert: new Audio('/sounds/system_alert.mp3'),
  rule_print: new Audio('/sounds/rule_print.mp3'),
  winner: new Audio('/sounds/winner.mp3'),
  input_ui: new Audio('/sounds/input_ui.mp3'),
  click2: new Audio('/sounds/click2.mp3'),
  time_out: new Audio('/sounds/time_out.mp3'),
  warning_beep: new Audio('/sounds/warning_beep.mp3'),
};

let isSoundEnabled = true;
let isVibrationEnabled = true;

export const setGlobalSoundEnabled = (enabled) => {
  isSoundEnabled = enabled;
  
  if (!enabled) {
    if (audioInstances.atmosphere) audioInstances.atmosphere.pause();
    if (audioInstances.clock) audioInstances.clock.pause();
    if (audioInstances.calculating) audioInstances.calculating.pause();
    if (audioInstances.winner) audioInstances.winner.pause();
    if (audioInstances.scanner) audioInstances.scanner.pause();
  } else {
    if (audioInstances.atmosphere) {
      audioInstances.atmosphere.play().catch(() => {});
    }
  }
};

export const setGlobalVibrationEnabled = (enabled) => {
  isVibrationEnabled = enabled;
};

export const triggerVibration = (ms) => {
  if (!isVibrationEnabled) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
};

if (audioInstances.winner) {
  audioInstances.winner.loop = true;
}

if (audioInstances.clock) {
  audioInstances.clock.loop = true;
}

if (audioInstances.scanner) {
  audioInstances.scanner.volume = 0.15;
}

if (audioInstances.calculating) {
  audioInstances.calculating.loop = true;
}

if (audioInstances.atmosphere) {
  audioInstances.atmosphere.loop = true;
  audioInstances.atmosphere.volume = 0.4;
}

export const playSound = (soundName) => {
  if (!isSoundEnabled) return;
  const audio = audioInstances[soundName];
  if (audio) {
    if (soundName !== 'atmosphere') audio.currentTime = 0;
    audio.play().catch(error => {
      console.warn("Audio bloqueado por política del navegador:", error);
    });
  }
};

export const stopSound = (soundName) => {
  const audio = audioInstances[soundName];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};