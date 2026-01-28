document.addEventListener("DOMContentLoaded", async () => {
  const pianoKeys = document.querySelectorAll(".key");
  let audioContext;

  const noteFrequencies = {
    C3: 130.81,
    "C#3": 138.59,
    D3: 146.83,
    "D#3": 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185.0,
    G3: 196.0,
    "G#3": 207.65,
    A3: 220.0,
    "A#3": 233.08,
    B3: 246.94,

    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
    B4: 493.88,

    C5: 523.25,
    "C#5": 554.37,
    D5: 587.33,
    "D#5": 622.25,
    E5: 659.25,
    F5: 698.46,
    "F#5": 739.99,
    G5: 783.99,
    "G#5": 830.61,
    A5: 880.0,
    "A#5": 932.33,
    B5: 987.77,
  };

  async function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function createPianoSound(frequency) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "triangle";
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1.5,
    );

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 1.5);
  }

  function playNote(note) {
    if (!audioContext) return;
    if (noteFrequencies[note]) {
      createPianoSound(noteFrequencies[note]);
    }
  }

  // Mouse click
  pianoKeys.forEach((key) => {
    key.addEventListener("click", async () => {
      await initAudio();
      playNote(key.dataset.note);

      key.classList.add("pressed");
      setTimeout(() => key.classList.remove("pressed"), 150);
    });
  });

  // 🔥 PERFECT KEYBOARD MAPPING
  const keyboardNoteMap = {
    // Octave 1
    z: "C3",
    s: "C#3",
    x: "D3",
    d: "D#3",
    c: "E3",
    v: "F3",
    g: "F#3",
    b: "G3",
    h: "G#3",
    n: "A3",
    j: "A#3",
    m: "B3",

    // Octave 2
    q: "C4",
    2: "C#4",
    w: "D4",
    3: "D#4",
    e: "E4",
    r: "F4",
    5: "F#4",
    t: "G4",
    6: "G#4",
    y: "A4",
    7: "A#4",
    u: "B4",

    // Octave 3 (EASY KEYS)
    i: "C5",
    9: "C#5",
    o: "D5",
    0: "D#5",
    p: "E5",
    ",": "F5",
    ".": "F#5",
    "/": "G5",
    "?": "G#5",
    ";": "A5",
    "'": "A#5",
    ">": "B5",
  };

  // ✅ TOGGLE NOTE LABELS (FIXED)
  const toggleButton = document.getElementById("toggle-labels");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      document.body.classList.toggle("show-labels");
    });
  }

  document.addEventListener("keydown", async (e) => {
    await initAudio();

    const key = e.key;
    const note = keyboardNoteMap[key];

    if (note) {
      playNote(note);
      const el = document.querySelector(`.key[data-note="${note}"]`);
      if (el) el.classList.add("pressed");
    }
  });

  document.addEventListener("keyup", (e) => {
    const key = e.key;
    const note = keyboardNoteMap[key];

    if (note) {
      const el = document.querySelector(`.key[data-note="${note}"]`);
      if (el) el.classList.remove("pressed");
    }
  });
});
